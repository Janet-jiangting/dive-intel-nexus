
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Species } from '@/contexts/MarineLifeDataContext';
import { MapPin, Ruler, ShieldAlert, Thermometer, Zap, Waves } from 'lucide-react'; // Added more icons

interface MarineLifeDetailModalProps {
  species: Species | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Critically Endangered': return 'bg-red-600 text-white';
    case 'Endangered': return 'bg-amber-500 text-white';
    case 'Vulnerable': return 'bg-yellow-500 text-ocean-900';
    case 'Near Threatened': return 'bg-yellow-300 text-ocean-900';
    case 'Least Concern': return 'bg-green-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const MarineLifeDetailModal = ({ species, isOpen, onOpenChange }: MarineLifeDetailModalProps) => {
  if (!species) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] bg-ocean-800 border-ocean-700 text-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">{species.name}</DialogTitle>
              <DialogDescription className="text-ocean-300 italic">
                {species.scientificName}
              </DialogDescription>
            </div>
            <Badge className={`ml-4 ${getStatusColor(species.conservationStatus)}`}>{species.conservationStatus}</Badge>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative w-full h-64 rounded-md overflow-hidden mb-2">
            <img
              src={species.imageUrl}
              alt={species.name}
              className="w-full h-full object-cover"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; 
                currentTarget.src = '/placeholder.svg';
              }}
            />
             <Badge className="absolute top-3 left-3" variant="secondary">{species.category}</Badge>
          </div>
          
          <p className="text-ocean-200 text-sm">{species.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm mt-2">
            <div className="flex items-center">
              <Ruler className="h-5 w-5 mr-2 text-ocean-300 flex-shrink-0" />
              <span className="text-white"><strong>Depth:</strong> {species.depth}</span>
            </div>
            {species.regions && species.regions.length > 0 && (
              <div className="flex items-start col-span-2"> {/* Made regions take full width if needed */}
                <MapPin className="h-5 w-5 mr-2 text-ocean-300 mt-0.5 flex-shrink-0" />
                <span className="text-white"><strong>Regions:</strong> {species.regions.join(', ')}</span>
              </div>
            )}
          </div>

          {(species.conservationStatus === 'Critically Endangered' || 
            species.conservationStatus === 'Endangered' ||
            species.conservationStatus === 'Vulnerable') && (
            <div className="flex items-center mt-4 p-3 bg-ocean-700/50 rounded-md border border-coral-700">
              <ShieldAlert className="h-5 w-5 text-coral-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-coral-300">
                This species is <strong className="font-semibold">{species.conservationStatus.toLowerCase()}</strong> and requires significant conservation attention.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-white border-ocean-600 hover:bg-ocean-700">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarineLifeDetailModal;
