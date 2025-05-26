
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Waves, Thermometer, Mountain, Eye } from 'lucide-react'; // Removed Star, MessageSquare

// Updated DiveSite interface to match fetched data
interface DiveSite {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  type: string;
  // rating: number; // Removed
  difficulty: string;
  depth: number;
  visibility: number;
  temperature: number;
  description: string;
  // reviews: number; // Removed
  country?: string; // Optional, as it might not always be present
}

interface DiveSiteCardProps {
  site: DiveSite;
}

const DiveSiteCard = ({ site }: DiveSiteCardProps) => {
  return (
    <Link to={`/dive-sites/${site.id}`}>
      <Card className="overflow-hidden bg-ocean-800/50 border-ocean-700 hover:shadow-lg hover:shadow-ocean-500/20 transition-all hover:-translate-y-1 flex flex-col h-full">
        <div className="relative h-56">
          <img
            src={site.imageUrl}
            alt={site.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image or style if specific image fails to load
              (e.target as HTMLImageElement).src = '/placeholder.svg'; 
            }}
          />
          <Badge className="absolute top-3 right-3 bg-ocean-900/80 text-white" variant="secondary">
            {site.type}
          </Badge>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ocean-900/90 via-ocean-900/70 to-transparent">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-white line-clamp-2">{site.name}</h3>
              {/* Rating removed */}
            </div>
            
            <div className="flex items-center text-ocean-100 mt-1">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="text-sm line-clamp-1">{site.location}{site.country ? `, ${site.country}` : ''}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="pt-4 flex-grow flex flex-col justify-between">
          <div>
            <p className="text-ocean-200 text-sm mb-4 line-clamp-3">
              {site.description}
            </p>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center text-center p-1 bg-ocean-700/30 rounded-md">
                <Mountain className="h-4 w-4 mb-1 text-ocean-300" />
                <span className="text-xs text-ocean-300">Depth</span>
                <span className="text-white text-sm font-medium">{site.depth}m</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-1 bg-ocean-700/30 rounded-md">
                <Thermometer className="h-4 w-4 mb-1 text-ocean-300" />
                <span className="text-xs text-ocean-300">Temp</span>
                <span className="text-white text-sm font-medium">{site.temperature}°C</span>
              </div>
              
              <div className="flex flex-col items-center text-center p-1 bg-ocean-700/30 rounded-md">
                <Eye className="h-4 w-4 mb-1 text-ocean-300" />
                <span className="text-xs text-ocean-300">Visibility</span>
                <span className="text-white text-sm font-medium">{site.visibility}m</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-3 border-t border-ocean-700">
            <div className="flex items-center text-ocean-300 text-sm">
              <Waves className="h-4 w-4 mr-1.5 text-blue-400" />
              <span className="font-medium">{site.difficulty}</span>
            </div>
            {/* Reviews count removed */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DiveSiteCard;
