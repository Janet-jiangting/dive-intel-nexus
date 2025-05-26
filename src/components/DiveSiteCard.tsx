
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Waves, Thermometer, Mountain, Eye, MessageSquare } from 'lucide-react';

interface DiveSite {
  id: number;
  name: string;
  location: string;
  imageUrl: string;
  type: string;
  rating: number;
  difficulty: string;
  depth: number;
  visibility: number;
  temperature: number;
  description: string;
  reviews: number;
}

interface DiveSiteCardProps {
  site: DiveSite;
}

const DiveSiteCard = ({ site }: DiveSiteCardProps) => {
  return (
    <Link to={`/dive-sites/${site.id}`}>
      <Card className="overflow-hidden bg-ocean-800/50 border-ocean-700 hover:shadow-lg hover:shadow-ocean-500/20 transition-all hover:-translate-y-1">
        <div className="relative h-56">
          <img
            src={site.imageUrl}
            alt={site.name}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-3 right-3 bg-ocean-900/80" variant="secondary">
            {site.type}
          </Badge>
          
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ocean-900 to-transparent">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-xl text-white">{site.name}</h3>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                <span className="text-white">{site.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center text-ocean-100">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-sm">{site.location}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="pt-4">
          <p className="text-ocean-200 text-sm mb-4 line-clamp-2">
            {site.description}
          </p>
          
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="flex items-center text-sm">
              <Mountain className="h-3 w-3 mr-1 text-ocean-300" />
              <span className="text-white">{site.depth}m</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Thermometer className="h-3 w-3 mr-1 text-ocean-300" />
              <span className="text-white">{site.temperature}°C</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Eye className="h-3 w-3 mr-1 text-ocean-300" />
              <span className="text-white">{site.visibility}m</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-ocean-700">
            <div className="flex items-center text-ocean-300 text-sm">
              <Waves className="h-3 w-3 mr-1" />
              {site.difficulty}
            </div>
            
            <div className="flex items-center text-ocean-300 text-sm">
              <MessageSquare className="h-3 w-3 mr-1" />
              {site.reviews} reviews
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DiveSiteCard;
