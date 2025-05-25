import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { useMarineLifeData, Species } from '@/contexts/MarineLifeDataContext';
import MarineLifeDetailModal from './MarineLifeDetailModal';

const MarineLifeGallery = () => {
  const { marineLife } = useMarineLifeData();

  // Modal State for Gallery items
  const [selectedGallerySpecies, setSelectedGallerySpecies] = useState<Species | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const handleGalleryItemClick = (species: Species) => {
    setSelectedGallerySpecies(species);
    setIsGalleryModalOpen(true);
  };

  // Function to determine status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
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
    <> {/* Fragment to wrap list and modal */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {marineLife.slice(0, 12).map((creature) => ( // Limiting to 12 for the homepage gallery for now
          <div 
            key={creature.id} 
            className="group relative overflow-hidden rounded-lg aspect-square bg-ocean-800 hover:shadow-lg hover:shadow-ocean-500/20 transition-transform hover:-translate-y-1 cursor-pointer"
            onClick={() => handleGalleryItemClick(creature)} // Added onClick
          >
            <div className="absolute inset-0 bg-ocean-700/30 z-0"></div>
            <img
              src={creature.imageUrl}
              alt={creature.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 z-10"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/placeholder.svg';
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-900 via-ocean-900/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 z-20">
              <div className="flex justify-between items-start mb-1">
                <Badge className="self-start bg-ocean-700/80 text-xs">{creature.category}</Badge>
                {creature.conservationStatus !== 'Least Concern' && (
                  <Badge className={`self-start ${getStatusColor(creature.conservationStatus)}`}>
                    {creature.conservationStatus === 'Critically Endangered' ? 'CR' : 
                     creature.conservationStatus === 'Endangered' ? 'EN' : 
                     creature.conservationStatus === 'Vulnerable' ? 'VU' : 'NT'}
                  </Badge>
                )}
              </div>
              <h3 className="font-medium text-white text-sm leading-tight">{creature.name}</h3>
              <p className="text-xs text-ocean-200 italic truncate">{creature.scientificName}</p>
            </div>
            
            {(creature.conservationStatus === 'Critically Endangered' || 
              creature.conservationStatus === 'Endangered') && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center z-30">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
      <MarineLifeDetailModal
        species={selectedGallerySpecies}
        isOpen={isGalleryModalOpen}
        onOpenChange={setIsGalleryModalOpen}
      />
    </>
  );
};

export default MarineLifeGallery;
