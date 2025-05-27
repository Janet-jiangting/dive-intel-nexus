import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMarineLifeData, Species } from '../contexts/MarineLifeDataContext';
import { Image as ImageIcon, MapPin } from 'lucide-react';

interface Coordinates {
  lat: number;
  lng: number;
}

interface DiveSite {
  id: number;
  name: string;
  location: string;
  coordinates: Coordinates;
  type: string;
}

interface DiveMapProps {
  sites: DiveSite[];
}

// Store the Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibmFueWVudW93ZWkiLCJhIjoiY21iMTYwMHFoMHd3MDJqc2N3ZGVqZHVwYiJ9.1zIehxqF8MGArJsCR3pj8w';

// Sample marine life data for different dive sites
const marineLifeData = {
  1: { // Great Blue Hole
    fish: ['Midnight Parrotfish', 'Caribbean Reef Shark', 'Atlantic Goliath Grouper', 'Black Grouper'],
    coral: ['Brain Coral', 'Elkhorn Coral', 'Staghorn Coral'],
    other: ['Caribbean Spiny Lobster', 'Green Sea Turtle']
  },
  2: { // SS Thistlegorm
    fish: ['Batfish', 'Barracuda', 'Lionfish', 'Moray Eel', 'Giant Trevally'],
    coral: ['Soft Coral', 'Table Coral', 'Black Coral'],
    other: ['Octopus', 'Nudibranch']
  },
  3: { // Barracuda Point
    fish: ['Barracuda Schools', 'Hammerhead Shark', 'Trevally', 'Reef Manta Ray'],
    coral: ['Staghorn Coral', 'Fire Coral', 'Brain Coral'],
    other: ['Sea Turtle', 'Sea Snake']
  },
  4: { // Molokini Crater
    fish: ['Hawaiian Triggerfish', 'Butterflyfish', 'Yellow Tang', 'Moorish Idol'],
    coral: ['Rice Coral', 'Cauliflower Coral', 'Lobe Coral'],
    other: ['Hawaiian Monk Seal', 'Green Sea Turtle', 'Spinner Dolphin']
  },
  5: { // Blue Corner
    fish: ['Grey Reef Shark', 'Napoleon Wrasse', 'Manta Ray', 'Dogtooth Tuna'],
    coral: ['Plate Coral', 'Bubble Coral', 'Soft Coral'],
    other: ['Sea Turtle', 'Sea Fan']
  },
  6: { // Richelieu Rock
    fish: ['Whale Shark', 'Ghost Pipefish', 'Frogfish', 'Seahorse'],
    coral: ['Soft Coral', 'Gorgonian Fan', 'Anemone'],
    other: ['Harlequin Shrimp', 'Ornate Ghost Pipefish']
  }
};

const DiveMap = ({ sites }: DiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [hoveredSite, setHoveredSite] = useState<DiveSite | null>(null);
  const [clickedSite, setClickedSite] = useState<DiveSite | null>(null);
  const [mapError, setMapError] = useState<string>('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const popupRef = useRef(new mapboxgl.Popup({ 
    closeButton: false, 
    closeOnClick: false,
    offset: 25,
    className: 'dive-site-popup'
  }));

  const { marineLife: contextMarineLife, isLoading: marineLifeLoading } = useMarineLifeData();

  const initializeMap = () => {
    if (!mapContainer.current) {
      console.log('Missing container');
      return;
    }
    
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      if (map.current) {
        console.log('Map already exists, removing...');
        map.current.remove();
        map.current = null;
      }
      
      console.log('Creating new map...');
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [0, 30],
        zoom: 2,
        antialias: true
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsMapLoaded(true);
        if (!map.current) return;

        sites.forEach(site => {
          const markerElement = document.createElement('div');
          markerElement.className = 'dive-site-marker';
          markerElement.innerHTML = `<div class="marker-pin bg-blue-500 hover:bg-blue-400 transition-colors"></div>`;
          markerElement.style.cursor = 'pointer';

          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([site.coordinates.lng, site.coordinates.lat])
            .addTo(map.current!);
          
          const element = marker.getElement();
          
          element.addEventListener('mouseenter', () => {
            setHoveredSite(site);
            
            const siteMarineLife = marineLifeData[site.id as keyof typeof marineLifeData];
            if (!siteMarineLife) return;
            
            const popupContent = `
              <div class="p-2">
                <h3 class="font-bold text-white">${site.name}</h3>
                <p class="text-xs text-gray-300">${site.location} (${site.type})</p>
                <div class="mt-2">
                  <p class="text-xs font-medium text-gray-200">Marine Life:</p>
                  <ul class="text-xs text-gray-300">
                    ${siteMarineLife.fish.slice(0, 2).map(fish => `<li>• ${fish}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `;
            
            popupRef.current
              .setLngLat([site.coordinates.lng, site.coordinates.lat])
              .setHTML(popupContent)
              .addTo(map.current!);
          });
          
          element.addEventListener('mouseleave', () => {
            setHoveredSite(null);
            popupRef.current.remove();
          });
          
          element.addEventListener('click', () => {
            if (!map.current) return;
            map.current.flyTo({
              center: [site.coordinates.lng, site.coordinates.lat],
              zoom: 10,
              essential: true
            });
            setClickedSite(site);
          });
        });
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Failed to load map. Please check your internet connection.');
      });

      map.current.on('sourcedata', (e) => {
        if (e.isSourceLoaded) {
          console.log('Map source loaded');
        }
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Map initialization error.');
    }
  };
  
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .dive-site-marker {
        width: 30px;
        height: 40px;
      }
      .marker-pin {
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
      }
      .dive-site-popup {
        background: rgba(0, 0, 0, 0.8) !important;
        border-radius: 6px !important;
        color: white !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .dive-site-popup .mapboxgl-popup-content {
        background: transparent !important;
        padding: 0 !important;
        box-shadow: none !important;
      }
      .dive-site-popup .mapboxgl-popup-tip {
        border-top-color: rgba(0, 0, 0, 0.8) !important;
      }
    `;
    document.head.appendChild(style);

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeMap();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Helper function to get species details from context
  const getSpeciesImage = (name: string): string | undefined => {
    const species = contextMarineLife.find(s => s.name.toLowerCase() === name.toLowerCase());
    return species?.imageUrl;
  };

  if (mapError) {
    return (
      <div className="w-full h-full bg-ocean-800 relative flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-ocean-900 p-6 rounded-lg shadow-xl border border-ocean-700">
          <div className="text-center">
            <h3 className="text-xl font-medium text-white mb-2">Map Error</h3>
            <p className="text-red-200 text-sm">{mapError}</p>
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
        style={{ minHeight: '400px' }}
      />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-ocean-900 flex items-center justify-center">
          <div className="text-white">Loading map...</div>
        </div>
      )}
      
      {clickedSite && (
        <div className="absolute bottom-4 left-4 z-10 bg-ocean-900/90 p-4 rounded-lg border border-ocean-700 max-w-md w-full md:max-w-sm animate-fade-in">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-xl">{clickedSite.name}</h3>
              <p className="text-ocean-200 mb-2 text-sm">{clickedSite.location} • {clickedSite.type}</p>
            </div>
            <button 
              onClick={() => setClickedSite(null)} 
              className="text-ocean-300 hover:text-white transition-colors"
              aria-label="Close panel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          {marineLifeData[clickedSite.id as keyof typeof marineLifeData] && (
            <div className="mt-3">
              <h4 className="font-semibold text-ocean-100 mb-2 text-md">Featured Marine Life</h4>
              {marineLifeLoading ? <p className="text-sm text-ocean-300">Loading images...</p> : (
                <>
                  {(['fish', 'coral', 'other'] as const).map(category => {
                    const items = marineLifeData[clickedSite.id as keyof typeof marineLifeData][category]?.slice(0, category === 'fish' ? 4 : 3);
                    if (!items || items.length === 0) return null;
                    
                    return (
                      <div key={category} className="mb-3">
                        <h5 className="font-medium text-ocean-200 text-sm capitalize mb-1">{category}</h5>
                        <div className="flex flex-wrap gap-2">
                          {items.map((itemName, idx) => {
                            const imageUrl = getSpeciesImage(itemName);
                            return (
                              <div key={idx} className="flex flex-col items-center w-16">
                                {imageUrl ? (
                                  <img src={imageUrl} alt={itemName} className="w-12 h-12 object-cover rounded bg-ocean-800 border border-ocean-700" />
                                ) : (
                                  <div className="w-12 h-12 bg-ocean-800 border border-ocean-700 rounded flex items-center justify-center">
                                    <ImageIcon size={24} className="text-ocean-400" />
                                  </div>
                                )}
                                <p className="text-xs text-ocean-300 mt-1 text-center truncate w-full" title={itemName}>{itemName}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-ocean-700">
            <h4 className="font-semibold text-ocean-100 mb-2 text-md">Recommended Dive Shops</h4>
            <div className="flex items-center text-sm text-ocean-300 bg-ocean-800/50 p-3 rounded">
              <MapPin size={18} className="mr-2 text-ocean-400" />
              <span>Dive shop information coming soon.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiveMap;
