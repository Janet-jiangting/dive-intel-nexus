
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Thermometer,
  Eye, 
  Wind, 
  Waves,
  Clock 
} from 'lucide-react';

interface DiveConditionsCardProps {
  location: string;
  temperature: number;
  visibility: number;
  currentStrength: string;
  waveHeight: number;
  lastUpdated: string;
  status: 'excellent' | 'good' | 'caution' | 'poor';
}

const DiveConditionsCard = ({
  location,
  temperature,
  visibility,
  currentStrength,
  waveHeight,
  lastUpdated,
  status,
}: DiveConditionsCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'excellent':
        return 'bg-green-500 text-white';
      case 'good':
        return 'bg-blue-500 text-white';
      case 'caution':
        return 'bg-amber-500 text-white';
      case 'poor':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'caution':
        return 'Use Caution';
      case 'poor':
        return 'Poor';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="bg-ocean-800/50 border-ocean-700 overflow-hidden">
      <div className={`h-2 w-full ${getStatusColor()}`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-white text-lg font-medium">{location}</CardTitle>
          <Badge className={getStatusColor()}>{getStatusText()}</Badge>
        </div>
        <div className="flex items-center text-sm text-ocean-200">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{location.split(',')[1]?.trim()}</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center">
            <Thermometer className="h-4 w-4 mr-2 text-ocean-300" />
            <div>
              <p className="text-sm font-medium text-white">{temperature}°C</p>
              <p className="text-xs text-ocean-200">Temperature</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-2 text-ocean-300" />
            <div>
              <p className="text-sm font-medium text-white">{visibility}m</p>
              <p className="text-xs text-ocean-200">Visibility</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Wind className="h-4 w-4 mr-2 text-ocean-300" />
            <div>
              <p className="text-sm font-medium text-white">{currentStrength}</p>
              <p className="text-xs text-ocean-200">Current</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Waves className="h-4 w-4 mr-2 text-ocean-300" />
            <div>
              <p className="text-sm font-medium text-white">{waveHeight}m</p>
              <p className="text-xs text-ocean-200">Wave Height</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-ocean-700/50 flex items-center justify-end text-xs text-ocean-300">
          <Clock className="h-3 w-3 mr-1" />
          <span>Updated {lastUpdated}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiveConditionsCard;
