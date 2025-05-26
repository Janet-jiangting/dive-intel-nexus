import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Coordinates {
  lat: number;
  lng: number;
}

// Updated DiveSite interface to match fetched data
interface DiveSite {
  id: number;
  name: string;
  location: string;
  coordinates: Coordinates;
  type: string;
  commonMarineLife?: string; // Added this from DB
  // imageUrl is part of the DiveSite type in DiveSites.tsx but not directly used for marker image here.
}

interface DiveMapProps {
  sites: DiveSite[];
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibmFueWVudW93ZWkiLCJhIjoiY21iMTYwMHFoMHd3MDJqc2N3ZGVqZHVwYiJ9.1zIehxqF8MGArJsCR3pj8w';
if (!MAPBOX_TOKEN && MAPBOX_TOKEN !== 'pk.eyJ1IjoibmFueWVudW93ZWkiLCJhIjoiY21iMTYwMHFoMHd3MDJqc2N3ZGVqZHVwYiJ9.1zIehxqF8MGArJsCR3pj8w') {
  console.warn("Mapbox token is not set. Using default fallback. Please set VITE_MAPBOX_ACCESS_TOKEN in your .env file.");
}

// Removed mock marineLifeData object as we'll use commonMarineLife from site prop.

const DiveMap = ({ sites }: DiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [hoveredSite, setHoveredSite] = useState<DiveSite | null>(null); // For the bottom-left info box
  const [mapError, setMapError] = useState<string>('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const popupRef = useRef(new mapboxgl.Popup({ 
    closeButton: false, 
    closeOnClick: false,
    offset: 25,
    className: 'dive-site-popup' // Keep custom class for styling
  }));

  // Store markers to remove them later if sites change
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const initializeMap = () => {
    // ... keep existing code (initializeMap preamble, try/catch, map creation)
    if (!mapContainer.current) {
      console.log('Missing map container for DiveMap');
      setMapError('Map container not found.');
      return;
    }
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      if (map.current) {
        console.log('Map already exists, removing for reinitialization...');
        map.current.remove();
        map.current = null;
      }
      
      console.log('Creating new map instance...');
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Using a style that includes streets
        center: sites.length > 0 ? [sites[0].coordinates.lng, sites[0].coordinates.lat] : [0, 30],
        zoom: sites.length > 0 ? 5 : 1.5, // Zoom in a bit more if sites exist
        antialias: true
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl());


      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsMapLoaded(true);
        if (!map.current) return;

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        sites.forEach(site => {
          if (!site.coordinates || typeof site.coordinates.lng !== 'number' || typeof site.coordinates.lat !== 'number') {
            console.warn(`Skipping site "${site.name}" due to invalid coordinates.`);
            return;
          }

          const markerElement = document.createElement('div');
          markerElement.className = 'dive-site-marker'; // existing class for styling
          // Marker inner visual can be customized further here if needed
          markerElement.innerHTML = `<div class="marker-pin bg-blue-500 hover:bg-blue-400 transition-colors group">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="w-4 h-4 group-hover:scale-110 transition-transform">
                                          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a2.25 2.25 0 001.286-2.05N12.685 14.18 12 13.5l-.685.681a2.25 2.25 0 001.286 2.05l.071.04.028.016.004.002a.735.735 0 00.25.041.74.74 0 00.251-.041l.004-.002.028-.016.07-.041a2.254 2.254 0 001.287-2.051M12 2.25a.75.75 0 01.75.75v11.19l4.446-2.223a.75.75 0 01.653 1.305l-5.25 2.625a.75.75 0 01-.698 0l-5.25-2.625a.75.75 0 11.653-1.305L11.25 14.19V3a.75.75 0 01.75-.75z" clip-rule="evenodd" />
                                        </svg>
                                      </div>`; // Using an SVG icon inside pin
          markerElement.style.cursor = 'pointer';

          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([site.coordinates.lng, site.coordinates.lat])
            .addTo(map.current!);
          
          markersRef.current.push(marker); // Store marker
          
          const element = marker.getElement();
          
          element.addEventListener('mouseenter', () => {
            // Set hovered site for the external info box (bottom left)
            // setHoveredSite(site); This is now handled by popup logic more directly for this component if we keep this style
            
            const popupContent = `
              <div class="p-2.5 rounded-md shadow-lg" style="min-width: 200px; max-width: 280px;">
                <h3 class="font-bold text-white text-base mb-0.5">${site.name}</h3>
                <p class="text-xs text-gray-300 mb-1.5">${site.location} (${site.type})</p>
                ${site.commonMarineLife ? `
                  <div class="mt-1 pt-1 border-t border-gray-700">
                    <p class="text-xs font-semibold text-gray-200 mb-0.5">Common Marine Life:</p>
                    <p class="text-xs text-gray-300 leading-snug">${site.commonMarineLife.split(',').map(s => `<span>• ${s.trim()}</span>`).join('<br>')}</p>
                  </div>
                ` : ''}
              </div>
            `;
            
            popupRef.current
              .setLngLat([site.coordinates.lng, site.coordinates.lat])
              .setHTML(popupContent)
              .addTo(map.current!);
          });
          
          element.addEventListener('mouseleave', () => {
            // setHoveredSite(null); // For external info box
            popupRef.current.remove();
          });
          
          element.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent map click event when clicking marker
            if (!map.current) return;
            map.current.flyTo({
              center: [site.coordinates.lng, site.coordinates.lat],
              zoom: Math.max(map.current.getZoom(), 10), // Zoom in, but not too far out if already zoomed
              essential: true,
              speed: 0.7
            });
            setHoveredSite(site); // Show/update bottom-left info box on click
          });
        });
        
        // Fit map to bounds if sites exist
        if (sites.length > 0 && map.current) {
            const bounds = new mapboxgl.LngLatBounds();
            sites.forEach(site => {
                if(site.coordinates && typeof site.coordinates.lng === 'number' && typeof site.coordinates.lat === 'number') {
                    bounds.extend([site.coordinates.lng, site.coordinates.lat]);
                }
            });
            if (!bounds.isEmpty()) {
              map.current.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 1000 });
            }
        }

      });

      map.current.on('error', (e) => {
        console.error('Mapbox GL error:', e.error ? e.error.message : e);
        setMapError(`Failed to load map: ${e.error ? e.error.message : 'Unknown error'}. Please check your Mapbox token and internet connection.`);
      });
      
      // Handle map click to clear hoveredSite if clicked outside a marker
      map.current.on('click', () => {
        setHoveredSite(null);
      });

    } catch (error: any) {
      console.error('Error initializing map:', error);
      setMapError(`Map initialization error: ${error.message}`);
    }
  };
  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .dive-site-marker {
        width: 30px; /* Pin base size */
        height: 40px; /* Pin height including point */
        display: flex;
        justify-content: center;
        align-items: flex-end; /* Align pin to bottom for correct pointing */
      }
      .marker-pin {
        width: 28px; /* Visual part of pin */
        height: 28px;
        background-color: #3B82F6; /* Default bg-blue-500 */
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        border: 2px solid white; /* White border for better visibility */
      }
      .marker-pin:hover {
        background-color: #60A5FA; /* Default bg-blue-400 */
        transform: rotate(-45deg) scale(1.1);
      }
      .marker-pin svg {
         transform: rotate(45deg); /* Counter-rotate icon */
      }
      .dive-site-popup .mapboxgl-popup-content {
        background: rgba(17, 24, 39, 0.85); /* bg-gray-900 with opacity */
        backdrop-filter: blur(4px);
        padding: 0 !important; /* Reset padding, handle with inner div */
        border-radius: 8px !important;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
        border: 1px solid rgba(55, 65, 81, 0.7); /* border-gray-700 */
      }
      .dive-site-popup .mapboxgl-popup-tip {
        border-top-color: rgba(17, 24, 39, 0.85) !important; /* Match popup background */
      }
    `;
    document.head.appendChild(style);

    // Initialize map when component mounts or sites data changes
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeMap();
    }, 100);


    return () => {
      clearTimeout(timer);
      if (map.current) {
        console.log("Removing map instance on unmount/sites change");
        map.current.remove();
        map.current = null;
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
    };
  }, [sites]); // Re-initialize map if sites array changes

  // ... keep existing code (mapError display, loading indicator)
  if (mapError) {
    return (
      <div className="w-full h-full bg-ocean-800 relative flex flex-col items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-ocean-900 p-6 rounded-lg shadow-xl border border-ocean-700">
          <div className="text-center">
            <h3 className="text-xl font-medium text-white mb-2">Map Error</h3>
            <p className="text-red-200 text-sm">{mapError}</p>
            <Button onClick={initializeMap} className="mt-4">Try Reload Map</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-ocean-900">
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg"
        style={{ minHeight: '400px' }} // Ensure map has a minimum height
      />
      
      {!isMapLoaded && !mapError && ( // Show loading only if no error
        <div className="absolute inset-0 bg-ocean-900/80 flex items-center justify-center z-10">
          <div className="text-white text-lg flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading map...
          </div>
        </div>
      )}
      
      {/* Bottom-left info box for clicked/hovered site */}
      {hoveredSite && (
        <div className="absolute bottom-4 left-4 z-20 bg-ocean-900/90 p-4 rounded-lg border border-ocean-700 max-w-xs shadow-xl backdrop-blur-sm">
          <h3 className="font-bold text-white text-lg mb-1">{hoveredSite.name}</h3>
          <p className="text-ocean-200 text-sm mb-2">{hoveredSite.location} • {hoveredSite.type}</p>
          
          {hoveredSite.commonMarineLife && (
            <div>
              <h4 className="font-semibold text-ocean-300 text-xs uppercase tracking-wider mb-1 mt-2">Common Marine Life</h4>
              <p className="text-sm text-ocean-100 leading-relaxed">
                {hoveredSite.commonMarineLife}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiveMap;
