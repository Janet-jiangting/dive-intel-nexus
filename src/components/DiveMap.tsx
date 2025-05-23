
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
    fish: ['Midnight Parrotfish', 'Caribbean Reef Shark', 'Atlantic Goliath Grouper'],
    coral: ['Brain Coral', 'Elkhorn Coral'],
    other: ['Caribbean Spiny Lobster', 'Green Sea Turtle']
  },
  2: { // SS Thistlegorm
    fish: ['Batfish', 'Barracuda', 'Lionfish', 'Moray Eel'],
    coral: ['Soft Coral', 'Table Coral'],
    other: ['Octopus', 'Nudibranch']
  },
  3: { // Barracuda Point
    fish: ['Barracuda Schools', 'Hammerhead Shark', 'Trevally'],
    coral: ['Staghorn Coral', 'Fire Coral'],
    other: ['Sea Turtle', 'Sea Snake']
  },
  4: { // Molokini Crater
    fish: ['Hawaiian Triggerfish', 'Butterflyfish', 'Yellow Tang'],
    coral: ['Rice Coral', 'Cauliflower Coral'],
    other: ['Hawaiian Monk Seal', 'Green Sea Turtle']
  },
  5: { // Blue Corner
    fish: ['Grey Reef Shark', 'Napoleon Wrasse', 'Manta Ray'],
    coral: ['Plate Coral', 'Bubble Coral'],
    other: ['Sea Turtle', 'Sea Fan']
  },
  6: { // Richelieu Rock
    fish: ['Whale Shark', 'Ghost Pipefish', 'Frogfish'],
    coral: ['Soft Coral', 'Gorgonian Fan'],
    other: ['Harlequin Shrimp', 'Seahorse']
  }
};

const DiveMap = ({ sites }: DiveMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [hoveredSite, setHoveredSite] = useState<DiveSite | null>(null);
  const [mapError, setMapError] = useState<string>('');
  const popupRef = useRef(new mapboxgl.Popup({ 
    closeButton: false, 
    closeOnClick: false,
    offset: 25,
    className: 'dive-site-popup'
  }));

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
        zoom: 2
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        console.log('Map loaded successfully');
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
            
            const marineLife = marineLifeData[site.id as keyof typeof marineLifeData];
            if (!marineLife) return;
            
            const popupContent = `
              <div class="p-2">
                <h3 class="font-bold text-white">${site.name}</h3>
                <p class="text-xs text-gray-300">${site.location} (${site.type})</p>
                <div class="mt-2">
                  <p class="text-xs font-medium text-gray-200">Marine Life:</p>
                  <ul class="text-xs text-gray-300">
                    ${marineLife.fish.slice(0, 2).map(fish => `<li>• ${fish}</li>`).join('')}
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
          });
        });
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setMapError('Failed to load map. Please check your internet connection.');
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

    // Initialize map immediately
    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

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
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />
      
      {hoveredSite && (
        <div className="absolute bottom-4 left-4 z-10 bg-ocean-900/90 p-4 rounded-lg border border-ocean-700 max-w-xs">
          <h3 className="font-bold text-white text-lg">{hoveredSite.name}</h3>
          <p className="text-ocean-200 mb-2">{hoveredSite.location} • {hoveredSite.type}</p>
          
          {marineLifeData[hoveredSite.id as keyof typeof marineLifeData] && (
            <div>
              <h4 className="font-medium text-ocean-300 mb-1 mt-2">Common Marine Life</h4>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {marineLifeData[hoveredSite.id as keyof typeof marineLifeData].fish.map((fish, idx) => (
                  <p key={idx} className="text-sm text-ocean-100">• {fish}</p>
                ))}
              </div>
              
              <h4 className="font-medium text-ocean-300 mb-1 mt-2">Coral</h4>
              <div>
                {marineLifeData[hoveredSite.id as keyof typeof marineLifeData].coral.map((coral, idx) => (
                  <p key={idx} className="text-sm text-ocean-100">• {coral}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiveMap;
