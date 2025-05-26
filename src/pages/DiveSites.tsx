
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, Filter, MapPin, Waves, User, Clock, ChevronDown, 
  Star, Thermometer, Compass, Mountain, Eye, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import DiveMap from '@/components/DiveMap';
import DiveSiteCard from '@/components/DiveSiteCard';
import { Skeleton } from "@/components/ui/skeleton";

// Define DiveSite interface based on expected transformed data
export interface DiveSite {
  id: number; // from divesiteID
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string; // Constructed
  type: string;
  difficulty: string;
  depth: number;
  visibility: number;
  temperature: number;
  description: string;
  country?: string;
  commonMarineLife?: string;
  // rating and reviews are removed as they are not in the Divesites table
}

// Raw data structure from Supabase Divesites table
interface DiveSiteSupabaseData {
  divesiteID: number;
  "Dive Site Name": string | null;
  Location: string | null;
  Country: string | null;
  Latitude: string | null;
  Longitude: string | null;
  Type: string | null;
  Difficulty: string | null;
  "Depth (m)": any | null; // Changed from Json to any for flexibility
  "Visibility (m)": any | null; // Changed from Json to any
  "Temperature (°C)": any | null; // Changed from Json to any
  Description: any | null; // Changed from Json to any
  "Common Marine Life": string | null;
  // Add other fields if selected
  [key: string]: any; // Allow other properties
}

const parseJsonOrNumber = (value: any, propertyForObject?: string): number => {
  if (value === null || typeof value === 'undefined') return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'number') return parsed;
      if (typeof parsed === 'object' && parsed !== null && propertyForObject && propertyForObject in parsed) {
        return Number(parsed[propertyForObject]);
      }
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    } catch (e) {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    }
  }
  if (typeof value === 'object' && value !== null && propertyForObject && propertyForObject in value) {
     return Number(value[propertyForObject]);
  }
  return 0;
};

const parseJsonOrString = (value: any, propertyForObject?: string): string => {
  if (value === null || typeof value === 'undefined') return '';
  if (typeof value === 'string') {
     try {
        const parsed = JSON.parse(value);
        if (typeof parsed === 'string') return parsed;
        if (typeof parsed === 'object' && parsed !== null && propertyForObject && propertyForObject in parsed) {
          return String(parsed[propertyForObject]);
        }
        return value; // Return original string if parsing leads to non-string or no property
     } catch (e) {
        return value; // Return original string if not valid JSON
     }
  }
  if (typeof value === 'object' && value !== null && propertyForObject && propertyForObject in value) {
    return String(value[propertyForObject]);
  }
  return String(value);
};


const fetchDiveSites = async (): Promise<DiveSite[]> => {
  const { data, error } = await supabase
    .from('Divesites')
    .select('*');

  if (error) {
    console.error('Error fetching dive sites:', error);
    throw new Error(error.message);
  }

  if (!data) return [];

  return data.map((site: DiveSiteSupabaseData) => {
    const lat = parseFloat(site.Latitude || '0');
    const lng = parseFloat(site.Longitude || '0');
    
    const depth = parseJsonOrNumber(site['Depth (m)'], 'max'); // Assuming 'max' or direct number
    const visibility = parseJsonOrNumber(site['Visibility (m)'], 'value'); // Assuming 'value' or direct number
    const temperature = parseJsonOrNumber(site['Temperature (°C)'], 'value'); // Assuming 'value' or direct number
    const description = parseJsonOrString(site.Description, 'text'); // Assuming 'text' or direct string

    return {
      id: site.divesiteID,
      name: site['Dive Site Name'] || 'Unknown Site',
      location: site.Location || 'Unknown Location',
      coordinates: {
        lat: !isNaN(lat) ? lat : 0,
        lng: !isNaN(lng) ? lng : 0,
      },
      imageUrl: `https://ioyfxcceheflwshhaqhk.supabase.co/storage/v1/object/public/divesites images/${site.divesiteID}.png`,
      type: site.Type || 'Unknown',
      difficulty: site.Difficulty || 'Unknown',
      depth: depth,
      visibility: visibility,
      temperature: temperature,
      description: description || 'No description available.',
      country: site.Country || undefined,
      commonMarineLife: site['Common Marine Life'] || undefined,
    };
  });
};

const DiveSites = () => {
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [depthRange, setDepthRange] = useState([0, 150]); // Max depth increased slightly
  const [temperatureRange, setTemperatureRange] = useState([10, 35]); // Temp range adjusted

  const { data: diveSitesData, isLoading, error: queryError } = useQuery<DiveSite[], Error>({
    queryKey: ['diveSites'],
    queryFn: fetchDiveSites,
  });

  const diveSites = diveSitesData || [];

  const filteredSites = diveSites.filter(site => {
    // Apply search filter
    if (searchQuery && !site.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !site.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply difficulty filter
    if (selectedDifficulty && site.difficulty !== selectedDifficulty) {
      return false;
    }
    
    // Apply type filter
    if (selectedType && site.type !== selectedType) {
      return false;
    }
    
    // Apply depth filter
    if (site.depth < depthRange[0] || site.depth > depthRange[1]) {
      return false;
    }
    
    // Apply temperature filter
    if (site.temperature < temperatureRange[0] || site.temperature > temperatureRange[1]) {
      return false;
    }
    
    return true;
  });

  if (queryError) {
    return (
      <div className="min-h-screen bg-ocean-900 flex items-center justify-center text-white p-4">
        Error loading dive sites: {queryError.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-900">
      <div className="bg-ocean-800 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Dive Sites</h1>
          <p className="text-ocean-200 mb-8">
            Explore and discover dive sites around the world
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for dive sites by name or location..."
                className="pl-9 bg-ocean-700/50 border-ocean-600 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="border-ocean-600 text-white hover:bg-ocean-700 flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
            
            <Tabs 
              defaultValue="list" 
              className="w-fit"
              onValueChange={(value) => setView(value as 'list' | 'map')}
            >
              <TabsList className="bg-ocean-700">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {showFilters && (
            <Card className="mt-4 bg-ocean-800 border-ocean-700">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="text-sm font-medium text-ocean-200 mb-2 block">
                      Difficulty Level
                    </label>
                    <Select onValueChange={(value) => setSelectedDifficulty(value === "any" ? null : value)} value={selectedDifficulty || "any"}>
                      <SelectTrigger className="bg-ocean-700/50 border-ocean-600 text-white">
                        <SelectValue placeholder="Any Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Difficulty</SelectItem>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ocean-200 mb-2 block">
                      Site Type
                    </label>
                    <Select onValueChange={(value) => setSelectedType(value === "any" ? null : value)} value={selectedType || "any"}>
                      <SelectTrigger className="bg-ocean-700/50 border-ocean-600 text-white">
                        <SelectValue placeholder="Any Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Type</SelectItem>
                        <SelectItem value="Reef">Reef</SelectItem>
                        <SelectItem value="Wreck">Wreck</SelectItem>
                        <SelectItem value="Wall">Wall</SelectItem>
                        <SelectItem value="Cave">Cave</SelectItem>
                        <SelectItem value="Pinnacle">Pinnacle</SelectItem>
                        <SelectItem value="Drift">Drift</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ocean-200 mb-2 block">
                      Depth Range (m)
                    </label>
                    <div className="px-2">
                      <Slider
                        value={depthRange}
                        max={150} // Max depth for slider
                        step={5}
                        onValueChange={setDepthRange}
                        className="[&>span:first-child]:h-1 [&>span:first-child]:bg-ocean-500"
                      />
                      <div className="flex justify-between mt-1 text-xs text-ocean-300">
                        <span>{depthRange[0]}m</span>
                        <span>{depthRange[1]}m</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ocean-200 mb-2 block">
                      Water Temperature (°C)
                    </label>
                    <div className="px-2">
                      <Slider
                        value={temperatureRange}
                        min={0} // Min temp
                        max={40} // Max temp
                        step={1}
                        onValueChange={setTemperatureRange}
                        className="[&>span:first-child]:h-1 [&>span:first-child]:bg-ocean-500"
                      />
                      <div className="flex justify-between mt-1 text-xs text-ocean-300">
                        <span>{temperatureRange[0]}°C</span>
                        <span>{temperatureRange[1]}°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        {isLoading ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden bg-ocean-800/50 border-ocean-700">
                  <Skeleton className="h-56 w-full" />
                  <CardContent className="pt-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full mb-2" />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-ocean-700">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-ocean-200">{filteredSites.length} dive sites found</span>
              </div>
              {/* Sort functionality can be implemented later */}
              <Select defaultValue="name">
                <SelectTrigger className="w-[180px] bg-ocean-800/50 border-ocean-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="rating">Highest Rated</SelectItem> */}
                  {/* <SelectItem value="popularity">Most Popular</SelectItem> */}
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {view === 'list' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSites.map((site) => (
                  <DiveSiteCard key={site.id} site={site} />
                ))}
              </div>
            ) : (
              <div className="h-[600px] rounded-lg overflow-hidden border border-ocean-700">
                {diveSites.length > 0 ? <DiveMap sites={filteredSites} /> : <div className="text-white p-4">No sites to display on map.</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DiveSites;
