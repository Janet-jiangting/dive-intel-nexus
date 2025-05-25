
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useMarineLifeData } from '@/contexts/MarineLifeDataContext'; // Import context

const MarineLifeGallery = () => {
  const { marineLife } = useMarineLifeData(); // Use data from context

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {/* Display a subset or implement pagination if marineLife grows large */}
      {marineLife.slice(0, 12).map((creature) => ( // Displaying first 12 for brevity in gallery
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
            <Badge className="self-start mb-1 bg-ocean-700/80 text-xs">{creature.category}</Badge>
            <h3 className="font-medium text-white text-sm leading-tight">{creature.name}</h3>
            <p className="text-xs text-ocean-200 italic truncate">{creature.scientificName}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MarineLifeGallery;

