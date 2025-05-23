
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

// Mock data for marine life
const marineLife = [
  {
    id: 1,
    name: 'Clownfish',
    scientificName: 'Amphiprioninae',
    category: 'Fish',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 2,
    name: 'Manta Ray',
    scientificName: 'Manta birostris',
    category: 'Ray',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 3,
    name: 'Green Sea Turtle',
    scientificName: 'Chelonia mydas',
    category: 'Reptile',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 4,
    name: 'Coral Grouper',
    scientificName: 'Plectropomus leopardus',
    category: 'Fish',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 5,
    name: 'Leafy Sea Dragon',
    scientificName: 'Phycodurus eques',
    category: 'Fish',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 6,
    name: 'Blue-Spotted Stingray',
    scientificName: 'Taeniura lymma',
    category: 'Ray',
    imageUrl: '/placeholder.svg',
  }
];

const MarineLifeGallery = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {marineLife.map((creature) => (
        <Link 
          to={`/marine-life/${creature.id}`} 
          key={creature.id} 
          className="group relative overflow-hidden rounded-lg aspect-square bg-ocean-800 hover:shadow-lg hover:shadow-ocean-500/20 transition-transform hover:-translate-y-1"
        >
          <img
            src={creature.imageUrl}
            alt={creature.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-900 via-ocean-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
            <Badge className="self-start mb-1 bg-ocean-700/80">{creature.category}</Badge>
            <h3 className="font-medium text-white text-sm">{creature.name}</h3>
            <p className="text-xs text-ocean-200 italic">{creature.scientificName}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MarineLifeGallery;
