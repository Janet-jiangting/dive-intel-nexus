
import React from 'react';
import { MapPin } from 'lucide-react';

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

const DiveMap = ({ sites }: DiveMapProps) => {
  // In a real implementation, this would use a mapping library like Leaflet,
  // Google Maps or Mapbox. For now, we'll create a placeholder.
  
  return (
    <div className="w-full h-full bg-ocean-700 relative flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-16 w-16 text-ocean-300 mx-auto mb-4" />
        <p className="text-white text-lg font-medium mb-2">Interactive Map</p>
        <p className="text-ocean-200 max-w-md">
          This would be an interactive map showing {sites.length} dive sites. 
          In a real implementation, it would use Leaflet, Google Maps, or Mapbox.
        </p>
      </div>
    </div>
  );
};

export default DiveMap;
