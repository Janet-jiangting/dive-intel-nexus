
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
  imageUrl: string; // Constructed from image_path and bucket
  depth: string; // Was 'depth_range'
}

interface MarineLifeDataContextValue {
  marineLife: Species[];
  isLoading: boolean;
  error: Error | null;
  addMarineLifeEntries: (entries: Species[]) => void; // Kept for now, but primary data source is Supabase
  getSpeciesById: (id: string | number) => Species | undefined;
}

const MarineLifeDataContext = createContext<MarineLifeDataContextValue | undefined>(undefined);

const SUPABASE_PROJECT_REF = "ioyfxcceheflwshhaqhk";
const IMAGE_BUCKET_NAME = "fishimages";

export const MarineLifeDataProvider = ({ children }: { children: ReactNode }) => {
  const [marineLife, setMarineLife] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMarineLife = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assuming your table is named "Marine Life". Adjust if different.
        // Also, Supabase column names are typically snake_case.
        // The user mentioned a 'Conservation Status' column, so I'll use 'Conservation_Status' as a placeholder,
        // but it should match the exact column name in Supabase (likely 'conservation_status').
        const { data, error: dbError } = await supabase
          .from('Marine Life') // Exact table name
          .select('id, species_name, scientific_name, family, description, "Conservation Status", distribution, depth_range, image_path'); // Select specific columns

        if (dbError) {
          console.error("Supabase error:", dbError);
          throw dbError;
        }

        if (data) {
          const mappedData: Species[] = data.map((item: any) => {
            // Construct image URL
            const imagePath = item.image_path || 'placeholder.svg'; // Use placeholder if no image_path
            const imageUrl = imagePath === 'placeholder.svg' 
              ? '/placeholder.svg' 
              : `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${IMAGE_BUCKET_NAME}/${item.image_path}`;
            
            // Handle regions (distribution)
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
              category: item.family || 'Unknown', // Mapped from 'family'
              conservationStatus: item['Conservation Status'] || 'Least Concern', // Default if null/empty
              description: item.description || 'No description available.',
              regions: regionsArray,
              imageUrl: imageUrl,
              depth: item.depth_range || 'N/A',
            };
          });
          setMarineLife(mappedData);
        }
      } catch (err: any) {
        console.error("Error fetching marine life data:", err);
        setError(err);
        setMarineLife([]); // Clear data on error
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
