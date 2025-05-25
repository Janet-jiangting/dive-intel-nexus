import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Ensure this path is correct

// Define the Species interface
export interface Species {
  id: number | string;
  name: string;
  scientificName: string;
  category: string; // Was 'family' from Supabase
  // habitat: string; // Removed as per request
  conservationStatus: string;
  description: string;
  regions: string[]; // Was 'distribution' from Supabase, split into array
  imageUrl: string; // Now constructed based on species id
  depth: string; // Was 'depth_range'
}

interface MarineLifeDataContextValue {
  marineLife: Species[];
  isLoading: boolean;
  error: Error | null;
  addMarineLifeEntries: (entries: Species[]) => void;
  getSpeciesById: (id: string | number) => Species | undefined;
}

const MarineLifeDataContext = createContext<MarineLifeDataContextValue | undefined>(undefined);

const SUPABASE_PROJECT_REF = "ioyfxcceheflwshhaqhk";
const IMAGE_BUCKET_NAME = "fishimages"; // User confirmed this bucket name

export const MarineLifeDataProvider = ({ children }: { children: ReactNode }) => {
  const [marineLife, setMarineLife] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMarineLife = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Removed "image_path" from the select statement as it does not exist.
        const { data, error: dbError } = await supabase
          .from('Marine Life')
          .select('id, species_name, scientific_name, family, description, "Conservation Status", distribution, depth_range');

        if (dbError) {
          console.error("Supabase error:", dbError);
          throw dbError;
        }

        if (data) {
          const mappedData: Species[] = data.map((item: any) => {
            // Construct image URL using species id.
            // Assumes images in the bucket are named like 'id.jpg'.
            let imageNameForUrl: string;
            if (item.id) { // Check if id exists and is not null/undefined
              imageNameForUrl = `${item.id}.jpg`; // Using id directly. Assuming .jpg extension.
            } else {
              imageNameForUrl = 'placeholder.svg'; // Fallback if id is not available
            }

            const imageUrl = imageNameForUrl === 'placeholder.svg'
              ? '/placeholder.svg'
              : `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${IMAGE_BUCKET_NAME}/${imageNameForUrl}`;

            let regionsArray: string[] = [];
            if (typeof item.distribution === 'string') {
              regionsArray = item.distribution.split(',').map(r => r.trim()).filter(r => r);
            } else if (Array.isArray(item.distribution)) {
              regionsArray = item.distribution;
            }

            return {
              id: item.id,
              name: item.species_name || 'Unknown',
              scientificName: item.scientific_name || 'N/A',
              category: item.family || 'Unknown',
              conservationStatus: item['Conservation Status'] || 'Least Concern',
              description: item.description || 'No description available.',
              regions: regionsArray,
              imageUrl: imageUrl, // imageUrl is now derived from id
              depth: item.depth_range || 'N/A',
            };
          });
          setMarineLife(mappedData);
        }
      } catch (err: any) {
        console.error("Error fetching marine life data:", err);
        setError(err);
        setMarineLife([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarineLife();
  }, []);

  const addMarineLifeEntries = (entries: Species[]) => {
    // This function might need re-evaluation if data is solely from Supabase.
    // For now, it adds to the client-side state.
    setMarineLife(prevEntries => {
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
    <MarineLifeDataContext.Provider value={{ marineLife, isLoading, error, addMarineLifeEntries, getSpeciesById }}>
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
