
import { useState, useCallback } from 'react';

interface DiveSite {
  id: number;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  type: string;
  rating: number;
  difficulty: string;
  depth: number;
  visibility: number;
  temperature: number;
  description: string;
  reviews: number;
}

interface MarineLifeData {
  [key: string]: {
    fish: string[];
    coral: string[];
    other: string[];
  };
}

interface MapData {
  style?: string;
  center?: [number, number];
  zoom?: number;
}

const useDataManager = () => {
  const [customDiveSites, setCustomDiveSites] = useState<DiveSite[]>([]);
  const [customMarineLife, setCustomMarineLife] = useState<MarineLifeData>({});
  const [customMapData, setCustomMapData] = useState<MapData>({});

  const importData = useCallback((data: any, type: 'diveSites' | 'marineLife' | 'mapData') => {
    switch (type) {
      case 'diveSites':
        if (Array.isArray(data)) {
          setCustomDiveSites(data);
          console.log('Imported dive sites:', data);
        }
        break;
      case 'marineLife':
        if (typeof data === 'object') {
          setCustomMarineLife(data);
          console.log('Imported marine life data:', data);
        }
        break;
      case 'mapData':
        if (typeof data === 'object') {
          setCustomMapData(data);
          console.log('Imported map data:', data);
        }
        break;
    }
  }, []);

  const resetData = useCallback((type?: 'diveSites' | 'marineLife' | 'mapData') => {
    if (!type) {
      setCustomDiveSites([]);
      setCustomMarineLife({});
      setCustomMapData({});
    } else {
      switch (type) {
        case 'diveSites':
          setCustomDiveSites([]);
          break;
        case 'marineLife':
          setCustomMarineLife({});
          break;
        case 'mapData':
          setCustomMapData({});
          break;
      }
    }
  }, []);

  return {
    customDiveSites,
    customMarineLife,
    customMapData,
    importData,
    resetData,
  };
};

export default useDataManager;
