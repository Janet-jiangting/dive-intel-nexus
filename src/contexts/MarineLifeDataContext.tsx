
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the Species interface
export interface Species {
  id: number | string; // Allow string for potentially UUIDs or timestamp-based IDs from uploads
  name: string;
  scientificName: string;
  category: string;
  habitat: string;
  conservationStatus: string;
  description: string;
  regions: string[];
  imageUrl: string;
  depth: string;
}

// Initial mock data
const initialMarineLifeData: Species[] = [
  {
    id: 1,
    name: 'Clownfish',
    scientificName: 'Amphiprioninae',
    category: 'Fish',
    habitat: 'Coral Reefs',
    conservationStatus: 'Least Concern',
    description: 'Known for their bright orange coloration with white stripes and black borders.',
    regions: ['Indo-Pacific', 'Great Barrier Reef', 'Red Sea'],
    imageUrl: '/images/marine-life/clownfish.jpg',
    depth: '1-15m',
  },
  {
    id: 2,
    name: 'Manta Ray',
    scientificName: 'Manta birostris',
    category: 'Ray',
    habitat: 'Open Ocean',
    conservationStatus: 'Vulnerable',
    description: 'The largest type of ray, with a wingspan that can reach up to 7 meters.',
    regions: ['Tropical Waters', 'Pacific Ocean', 'Indian Ocean', 'Atlantic Ocean'],
    imageUrl: '/images/marine-life/manta.jpg',
    depth: '10-120m',
  },
  {
    id: 3,
    name: 'Green Sea Turtle',
    scientificName: 'Chelonia mydas',
    category: 'Reptile',
    habitat: 'Coral Reefs, Seagrass Beds',
    conservationStatus: 'Endangered',
    description: 'Named for the greenish color of their fat, these turtles are herbivores as adults.',
    regions: ['Tropical Waters', 'Subtropical Waters'],
    imageUrl: '/images/marine-life/turtle.jpg',
    depth: '3-40m',
  },
  {
    id: 4,
    name: 'Coral Grouper',
    scientificName: 'Plectropomus leopardus',
    category: 'Fish',
    habitat: 'Coral Reefs',
    conservationStatus: 'Near Threatened',
    description: 'A predatory fish known for its bright red to brown coloration with blue spots.',
    regions: ['Indo-Pacific', 'Great Barrier Reef'],
    imageUrl: '/images/marine-life/grouper.jpg',
    depth: '5-50m',
  },
  {
    id: 5,
    name: 'Leafy Sea Dragon',
    scientificName: 'Phycodurus eques',
    category: 'Fish',
    habitat: 'Kelp Forests',
    conservationStatus: 'Near Threatened',
    description: 'A unique marine fish with leaf-like appendages that provide excellent camouflage.',
    regions: ['Southern Australia'],
    imageUrl: '/images/marine-life/seadragon.jpg',
    depth: '10-30m',
  },
  {
    id: 6,
    name: 'Blue-Spotted Stingray',
    scientificName: 'Taeniura lymma',
    category: 'Ray',
    habitat: 'Coral Reefs, Sandy Bottoms',
    conservationStatus: 'Near Threatened',
    description: 'Distinctive ray with bright blue spots on a yellowish or greenish background.',
    regions: ['Indo-Pacific', 'Red Sea'],
    imageUrl: '/images/marine-life/stingray.jpg',
    depth: '2-30m',
  },
  {
    id: 7,
    name: 'Hawksbill Turtle',
    scientificName: 'Eretmochelys imbricata',
    category: 'Reptile',
    habitat: 'Coral Reefs',
    conservationStatus: 'Critically Endangered',
    description: 'Recognized by its sharp, hawk-like beak and beautiful shell pattern.',
    regions: ['Tropical Waters', 'Atlantic Ocean', 'Pacific Ocean'],
    imageUrl: '/images/marine-life/hawksbill.jpg',
    depth: '1-30m',
  },
  {
    id: 8,
    name: 'Whale Shark',
    scientificName: 'Rhincodon typus',
    category: 'Shark',
    habitat: 'Open Ocean, Coastal Areas',
    conservationStatus: 'Endangered',
    description: 'The largest known fish species, with a distinctive pattern of white spots on a dark background.',
    regions: ['Tropical Waters', 'Warm Temperate Waters'],
    imageUrl: '/images/marine-life/whaleshark.jpg',
    depth: '0-700m',
  },
  {
    id: 9,
    name: 'Seahorse',
    scientificName: 'Hippocampus',
    category: 'Fish',
    habitat: 'Seagrass Beds, Coral Reefs',
    conservationStatus: 'Vulnerable',
    description: 'Small marine fish named for their horse-like head shape. Males carry the eggs in a pouch.',
    regions: ['Worldwide in Temperate and Tropical Waters'],
    imageUrl: '/images/marine-life/seahorse.jpg',
    depth: '1-15m',
  },
];


interface MarineLifeDataContextValue {
  marineLife: Species[];
  addMarineLifeEntries: (entries: Species[]) => void;
  getSpeciesById: (id: string | number) => Species | undefined;
}

const MarineLifeDataContext = createContext<MarineLifeDataContextValue | undefined>(undefined);

export const MarineLifeDataProvider = ({ children }: { children: ReactNode }) => {
  const [marineLife, setMarineLife] = useState<Species[]>(initialMarineLifeData);

  const addMarineLifeEntries = (entries: Species[]) => {
    setMarineLife(prevEntries => {
      // Filter out duplicates based on name + scientific name combo
      const filteredNew = entries.filter(newEntry => 
        !prevEntries.some(existing => 
          existing.name === newEntry.name && 
          existing.scientificName === newEntry.scientificName
        )
      );
      
      return [...prevEntries, ...filteredNew];
    });
  };
  
  const getSpeciesById = (id: string | number): Species | undefined => {
    return marineLife.find(species => species.id.toString() === id.toString());
  };

  return (
    <MarineLifeDataContext.Provider value={{ marineLife, addMarineLifeEntries, getSpeciesById }}>
      {children}
    </MarineLifeDataContext.Provider>
  );
};

export const useMarineLifeData = () => {
  const context = useContext(MarineLifeDataContext);
  if (context === undefined) {
    throw new Error('useMarineLifeData must be used within a MarineLifeDataProvider');
  }
  return context;
};
