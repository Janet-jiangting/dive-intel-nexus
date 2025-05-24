import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Fish, Database, Waves, AlertTriangle, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import MarineLifeCard from '@/components/MarineLifeCard';
import FishIdentifier from '@/components/FishIdentifier';

// Mock data for marine life
const marineLifeData = [
  {
    id: 1,
    name: 'Clownfish',
    scientificName: 'Amphiprioninae',
    category: 'Fish',
    habitat: 'Coral Reefs',
    conservationStatus: 'Least Concern',
    description: 'Known for their bright orange coloration with white stripes and black borders.',
    regions: ['Indo-Pacific', 'Great Barrier Reef', 'Red Sea'],
    imageUrl: '/placeholder.svg',
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
    imageUrl: '/placeholder.svg',
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
    imageUrl: '/placeholder.svg',
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
    imageUrl: '/placeholder.svg',
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
    imageUrl: '/placeholder.svg',
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
    imageUrl: '/placeholder.svg',
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
    imageUrl: '/placeholder.svg',
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
    imageUrl: '/placeholder.svg',
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
    imageUrl: '/placeholder.svg',
    depth: '1-15m',
  },
];

// Get unique values for filters
const categories = [...new Set(marineLifeData.map(item => item.category))];
const habitats = [...new Set(marineLifeData.map(item => item.habitat))];
const conservationStatuses = [...new Set(marineLifeData.map(item => item.conservationStatus))];

const MarineLife = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHabitat, setSelectedHabitat] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // Apply filters
  const filteredMarineLife = marineLifeData.filter(item => {
    // Apply search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.scientificName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (selectedCategory && !item.category.includes(selectedCategory)) {
      return false;
    }
    
    // Apply habitat filter
    if (selectedHabitat && !item.habitat.includes(selectedHabitat)) {
      return false;
    }
    
    // Apply conservation status filter
    if (selectedStatus && item.conservationStatus !== selectedStatus) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-ocean-900">
      <div className="bg-ocean-800 py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Marine Life Database</h1>
          <p className="text-ocean-200 mb-8">
            Explore and learn about diverse marine species around the world
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for species by name or scientific name..."
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
          </div>
          
          {showFilters && (
            <Card className="mt-4 bg-ocean-800 border-ocean-700">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-ocean-200 mb-2 block">
                      Category
                    </label>
                    <Select onValueChange={(value) => setSelectedCategory(value || null)} value={selectedCategory || undefined}>
                      <SelectTrigger className="bg-ocean-700/50 border-ocean-600 text-white">
                        <SelectValue placeholder="Any Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ocean-200 mb-2 block">
                      Habitat
                    </label>
                    <Select onValueChange={(value) => setSelectedHabitat(value || null)} value={selectedHabitat || undefined}>
                      <SelectTrigger className="bg-ocean-700/50 border-ocean-600 text-white">
                        <SelectValue placeholder="Any Habitat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Habitat</SelectItem>
                        {habitats.map((habitat) => (
                          <SelectItem key={habitat} value={habitat}>{habitat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-ocean-200 mb-2 block">
                      Conservation Status
                    </label>
                    <Select onValueChange={(value) => setSelectedStatus(value || null)} value={selectedStatus || undefined}>
                      <SelectTrigger className="bg-ocean-700/50 border-ocean-600 text-white">
                        <SelectValue placeholder="Any Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Any Status</SelectItem>
                        {conservationStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        {/* Fish Identifier Section */}
        <div className="mb-12">
          <FishIdentifier />
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-ocean-200">{filteredMarineLife.length} species found</span>
          </div>
          <Select defaultValue="name">
            <SelectTrigger className="w-[180px] bg-ocean-800/50 border-ocean-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="status">Conservation Status</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Marine Life Database Stats */}
        <Card className="bg-ocean-800/50 border-ocean-700 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-ocean-700/80 rounded-full p-3">
                  <Fish className="h-6 w-6 text-ocean-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">500+</h3>
                  <p className="text-ocean-300 text-sm">Species Cataloged</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-ocean-700/80 rounded-full p-3">
                  <Database className="h-6 w-6 text-ocean-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">10,000+</h3>
                  <p className="text-ocean-300 text-sm">Photos & Videos</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-ocean-700/80 rounded-full p-3">
                  <Waves className="h-6 w-6 text-ocean-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">120+</h3>
                  <p className="text-ocean-300 text-sm">Dive Regions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-ocean-700/80 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-coral-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">75+</h3>
                  <p className="text-coral-500 text-sm">Endangered Species</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarineLife.map((species) => (
            <MarineLifeCard key={species.id} species={species} />
          ))}
        </div>
        
        {filteredMarineLife.length === 0 && (
          <div className="text-center py-12">
            <Fish className="h-12 w-12 text-ocean-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Species Found</h3>
            <p className="text-ocean-300 max-w-md mx-auto">
              We couldn't find any marine species that match your search criteria. Try adjusting your filters or search terms.
            </p>
          </div>
        )}
        
        {/* Conservation Information */}
        <Card className="mt-12 bg-gradient-to-r from-ocean-800 to-ocean-900 border-ocean-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="h-5 w-5 mr-2 text-ocean-300" />
              Marine Conservation Initiative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-ocean-100 mb-4">
              Many marine species face threats from overfishing, habitat destruction, pollution, and climate change. 
              Learn about conservation efforts and how you can help protect these fascinating creatures.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-ocean-700/50 rounded-lg p-4 border-l-4 border-l-red-600">
                <h4 className="font-semibold text-white mb-2">Critically Endangered</h4>
                <p className="text-sm text-ocean-200">
                  Facing an extremely high risk of extinction in the wild.
                </p>
              </div>
              
              <div className="bg-ocean-700/50 rounded-lg p-4 border-l-4 border-l-amber-500">
                <h4 className="font-semibold text-white mb-2">Endangered</h4>
                <p className="text-sm text-ocean-200">
                  Facing a very high risk of extinction in the wild.
                </p>
              </div>
              
              <div className="bg-ocean-700/50 rounded-lg p-4 border-l-4 border-l-yellow-500">
                <h4 className="font-semibold text-white mb-2">Vulnerable</h4>
                <p className="text-sm text-ocean-200">
                  Facing a high risk of extinction in the wild.
                </p>
              </div>
            </div>
            
            <Button className="bg-seagreen-600 hover:bg-seagreen-700 text-white">
              Learn About Conservation Efforts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarineLife;
