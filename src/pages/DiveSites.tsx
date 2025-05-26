import React, { useState } from 'react';
import { 
  Search, MapPin, Filter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
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

const SUPABASE_PROJECT_ID = 'ioyfxcceheflwshhaqhk';
const SUPABASE_BUCKET_NAME = 'divesiteimages'; // Corrected bucket name
const SUPABASE_STORAGE_PUBLIC_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/`;

// Mock data for dive sites
const diveSitesData = [
  {
    id: 1,
    name: 'Great Blue Hole',
    location: 'Belize',
    coordinates: { lat: 17.3157, lng: -87.5343 },
    type: 'Cave',
    rating: 4.8,
    difficulty: 'Advanced',
    depth: 124,
    visibility: 30,
    temperature: 26,
    description: 'A massive underwater sinkhole and world-class diving site.',
    reviews: 382,
  },
  {
    id: 2,
    name: 'SS Thistlegorm',
    location: 'Red Sea, Egypt',
    coordinates: { lat: 27.8167, lng: 33.9167 },
    type: 'Wreck',
    rating: 4.9,
    difficulty: 'Intermediate',
    depth: 30,
    visibility: 25,
    temperature: 27,
    description: 'A famous WWII shipwreck with cargo including motorcycles and trucks.',
    reviews: 529,
  },
  {
    id: 3,
    name: 'Barracuda Point',
    location: 'Sipadan, Malaysia',
    coordinates: { lat: 4.115, lng: 118.6283 },
    type: 'Wall',
    rating: 4.7,
    difficulty: 'Intermediate',
    depth: 40,
    visibility: 20,
    temperature: 29,
    description: 'Known for its swirling tornadoes of barracudas and passing pelagics.',
    reviews: 421,
  },
  {
    id: 4,
    name: 'Molokini Crater',
    location: 'Maui, Hawaii',
    coordinates: { lat: 20.6336, lng: -156.4975 },
    type: 'Reef',
    rating: 4.5,
    difficulty: 'Beginner',
    depth: 18,
    visibility: 35,
    temperature: 25,
    description: 'A crescent-shaped, partially submerged volcanic crater.',
    reviews: 625,
  },
  {
    id: 5,
    name: 'Blue Corner',
    location: 'Palau',
    coordinates: { lat: 7.1367, lng: 134.2214 },
    type: 'Wall',
    rating: 4.9,
    difficulty: 'Advanced',
    depth: 30,
    visibility: 25,
    temperature: 28,
    description: 'Famous for strong currents and large pelagic fish encounters.',
    reviews: 387,
  },
  {
    id: 6,
    name: 'Richelieu Rock',
    location: 'Surin Islands, Thailand',
    coordinates: { lat: 9.3598, lng: 98.0236 },
    type: 'Pinnacle',
    rating: 4.8,
    difficulty: 'Intermediate',
    depth: 35,
    visibility: 20,
    temperature: 28,
    description: 'A horseshoe-shaped reef known for whale sharks and macro life.',
    reviews: 312,
  },
];

const diveSites = diveSitesData.map(site => ({
  ...site,
  imageUrl: `${SUPABASE_STORAGE_PUBLIC_URL}${SUPABASE_BUCKET_NAME}//${encodeURIComponent(site.name.replace(/\s/g, '_'))}.jpg`,
}));

const DiveSites = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [depthRange, setDepthRange] = useState([0, 130]);
  const [temperatureRange, setTemperatureRange] = useState([20, 30]);
  const [activeView, setActiveView] = useState<'list' | 'map'>('list');

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

  return (
    <div className="min-h-screen bg-ocean-900">
      <div className="bg-ocean-800 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Dive Sites</h1>
          <p className="text-ocean-200 mb-6">
            Explore and discover dive sites around the world
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for dive sites by name or location..."
                className="pl-9 bg-ocean-700/50 border-ocean-600 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs 
              defaultValue="list" 
              value={activeView}
              onValueChange={(value) => setActiveView(value as 'list' | 'map')}
              className="w-fit"
            >
              <TabsList className="bg-ocean-700">
                <TabsTrigger value="list">List</TabsTrigger>
                <TabsTrigger value="map">Map</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Always visible filters */}
          <Card className="bg-ocean-800 border-ocean-700">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium text-ocean-200 mb-2 block">
                    Difficulty Level
                  </label>
                  <Select onValueChange={setSelectedDifficulty} value={selectedDifficulty || undefined}>
                    <SelectTrigger className="bg-ocean-700/50 border-ocean-600 text-white">
                      <SelectValue placeholder="Any Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Select onValueChange={setSelectedType} value={selectedType || undefined}>
                    <SelectTrigger className="bg-ocean-700/50 border-ocean-600 text-white">
                      <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reef">Reef</SelectItem>
                      <SelectItem value="Wreck">Wreck</SelectItem>
                      <SelectItem value="Wall">Wall</SelectItem>
                      <SelectItem value="Cave">Cave</SelectItem>
                      <SelectItem value="Pinnacle">Pinnacle</SelectItem>
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
                      max={130}
                      step={1}
                      onValueChange={setDepthRange}
                      className="[&>span:first-child]:h-1 [&>span:first-child]:bg-ocean-400 [&_[role=slider]]:bg-ocean-300 [&_[role=slider]]:border-ocean-300"
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
                      min={10}
                      max={35}
                      step={1}
                      onValueChange={setTemperatureRange}
                      className="[&>span:first-child]:h-1 [&>span:first-child]:bg-ocean-400 [&_[role=slider]]:bg-ocean-300 [&_[role=slider]]:border-ocean-300"
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
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-ocean-200">{filteredSites.length} dive sites found</span>
          </div>
          <Select defaultValue="rating">
            <SelectTrigger className="w-[180px] bg-ocean-800/50 border-ocean-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Content display based on activeView */}
        {activeView === 'list' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.length > 0 ? (
              filteredSites.map((site) => (
                <DiveSiteCard key={site.id} site={site} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <MapPin className="mx-auto h-12 w-12 text-ocean-400 mb-4" />
                <p className="text-xl text-ocean-200">No dive sites found matching your criteria.</p>
                <p className="text-ocean-300">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        ) : ( // activeView === 'map'
          <div className="h-[70vh] w-full rounded-lg overflow-hidden border border-ocean-700 shadow-xl">
            <DiveMap sites={filteredSites} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiveSites;
