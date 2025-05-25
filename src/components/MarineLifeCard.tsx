
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Ruler, AlertTriangle } from 'lucide-react'; // Removed Fish icon for habitat
import { Species } from '@/contexts/MarineLifeDataContext';

interface MarineLifeCardProps {
  species: Species;
}

const MarineLifeCard = ({ species }: MarineLifeCardProps) => {
  // Determine conservation status color
  const getStatusColor = () => {
    switch (species.conservationStatus) {
      case 'Critically Endangered':
        return 'bg-red-600 text-white';
      case 'Endangered':
        return 'bg-amber-500 text-white';
      case 'Vulnerable':
        return 'bg-yellow-500 text-ocean-900';
      case 'Near Threatened':
        return 'bg-yellow-300 text-ocean-900';
      case 'Least Concern':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Link to={`/marine-life/${species.id}`}>
      <Card className="overflow-hidden bg-ocean-800/50 border-ocean-700 hover:shadow-lg hover:shadow-ocean-500/20 transition-all hover:-translate-y-1 h-full flex flex-col">
        <div className="relative h-48">
          <img
            src={species.imageUrl}
            alt={species.name}
            className="w-full h-full object-cover"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = '/placeholder.svg'; // fallback image
            }}
          />
          <Badge className="absolute top-3 left-3" variant="secondary">
            {species.category}
          </Badge>
          <Badge className={`absolute top-3 right-3 ${getStatusColor()}`}>
            {species.conservationStatus === 'Least Concern' ? 'LC' : 
             species.conservationStatus === 'Near Threatened' ? 'NT' :
             species.conservationStatus === 'Vulnerable' ? 'VU' :
             species.conservationStatus === 'Endangered' ? 'EN' :
             species.conservationStatus === 'Critically Endangered' ? 'CR' :
             species.conservationStatus}
          </Badge>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ocean-900 to-transparent h-24" />
        </div>
        
        <CardContent className="pt-4 flex-grow flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-xl text-white">{species.name}</h3>
            <p className="text-sm text-ocean-300 italic">{species.scientificName}</p>
          </div>
          
          <p className="text-ocean-200 text-sm mb-4 line-clamp-3 flex-grow"> {/* Increased line-clamp from 2 to 3 */}
            {species.description}
          </p>
          
          <div className="space-y-2 mt-auto">
            {/* Habitat display removed */}
            {/* <div className="flex items-center text-sm">
              <Fish className="h-4 w-4 mr-2 text-ocean-300 flex-shrink-0" />
              <span className="text-white truncate" title={species.habitat}>{species.habitat}</span>
            </div> */}
            
            <div className="flex items-center text-sm">
              <Ruler className="h-4 w-4 mr-2 text-ocean-300 flex-shrink-0" />
              <span className="text-white">Depth: {species.depth}</span>
            </div>
            
            {species.regions && species.regions.length > 0 && (
              <div className="flex items-start text-sm">
                <MapPin className="h-4 w-4 mr-2 text-ocean-300 mt-0.5 flex-shrink-0" />
                <span className="text-white">{species.regions.slice(0, 2).join(', ')}
                {species.regions.length > 2 && '...'}
                </span>
              </div>
            )}
          </div>
          
          {(species.conservationStatus === 'Critically Endangered' || 
            species.conservationStatus === 'Endangered' ||
            species.conservationStatus === 'Vulnerable') && (
            <div className="flex items-center mt-4 p-2 bg-ocean-700/50 rounded-md">
              <AlertTriangle className="h-4 w-4 text-coral-500 mr-2 flex-shrink-0" />
              <p className="text-xs text-coral-300">
                This species is {species.conservationStatus.toLowerCase()} and requires conservation attention.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default MarineLifeCard;
