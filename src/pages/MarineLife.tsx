import React, { useState, useMemo } from 'react';
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
import MarineLifeCard from '@/components/MarineLifeCard';
import FishIdentifier from '@/components/FishIdentifier';
import { useMarineLifeData } from '@/contexts/MarineLifeDataContext';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

const MarineLife = () => {
  const { marineLife: marineLifeData, isLoading, error } = useMarineLifeData();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // Derive filter options from context data
  const categories = useMemo(() => [...new Set(marineLifeData.map(item => item.category))], [marineLifeData]);
  const conservationStatuses = useMemo(() => [...new Set(marineLifeData.map(item => item.conservationStatus))], [marineLifeData]);

  // Apply filters
  const filteredMarineLife = useMemo(() => marineLifeData.filter(item => {
    // Apply search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.scientificName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (selectedCategory && item.category !== selectedCategory) {
      return false;
    }
    
    // Apply habitat filter - REMOVED
    // if (selectedHabitat && !item.habitat.toLowerCase().includes(selectedHabitat.toLowerCase())) { 
    //   return false;
    // }
    
    // Apply conservation status filter
    if (selectedStatus && item.conservationStatus !== selectedStatus) {
      return false;
    }
    
    return true;
  }), [marineLifeData, searchQuery, selectedCategory, /*selectedHabitat,*/ selectedStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ocean-900 p-8">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-8 w-3/4 mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-ocean-800/50 border-ocean-700">
                <Skeleton className="h-48 w-full" />
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ocean-900 p-8 flex flex-col items-center justify-center text-white">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Error Loading Data</h2>
        <p className="text-ocean-300 mb-4">Could not fetch marine life information. Please try again later.</p>
        <pre className="text-xs bg-ocean-800 p-2 rounded whitespace-pre-wrap w-full max-w-md text-left">
          {error.message}
        </pre>
      </div>
    );
  }

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
                {/* Grid columns adjusted from 3 to 2 as habitat filter is removed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                  <div>
                    <label htmlFor="category-select" className="text-sm font-medium text-ocean-200 mb-2 block">
                      Category
                    </label>
                    <Select onValueChange={(value) => setSelectedCategory(value === "Any Category" ? null : value)} value={selectedCategory || "Any Category"}>
                      <SelectTrigger id="category-select" className="bg-ocean-700/50 border-ocean-600 text-white">
                        <SelectValue placeholder="Any Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any Category">Any Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Habitat Select Removed */}
                  {/* <div>
                    <label htmlFor="habitat-select" className="text-sm font-medium text-ocean-200 mb-2 block">
                      Habitat
                    </label>
                    <Select onValueChange={(value) => setSelectedHabitat(value === "Any Habitat" ? null : value)} value={selectedHabitat || "Any Habitat"}>
                      <SelectTrigger id="habitat-select" className="bg-ocean-700/50 border-ocean-600 text-white">
                        <SelectValue placeholder="Any Habitat" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any Habitat">Any Habitat</SelectItem>
                        {habitats.map((habitat) => (
                          <SelectItem key={habitat} value={habitat}>{habitat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div> */}
                  
                  <div>
                    <label htmlFor="status-select" className="text-sm font-medium text-ocean-200 mb-2 block">
                      Conservation Status
                    </label>
                    <Select onValueChange={(value) => setSelectedStatus(value === "Any Status" ? null : value)} value={selectedStatus || "Any Status"}>
                      <SelectTrigger id="status-select" className="bg-ocean-700/50 border-ocean-600 text-white">
                        <SelectValue placeholder="Any Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Any Status">Any Status</SelectItem>
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
        
        <Card className="bg-ocean-800/50 border-ocean-700 mb-8">
          <CardContent className="p-6">
             {/* Adjusted grid-cols to 3 as one stat (habitat/dive regions related) might be removed or re-purposed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-4">
                <div className="bg-ocean-700/80 rounded-full p-3">
                  <Fish className="h-6 w-6 text-ocean-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{marineLifeData.length > 0 ? marineLifeData.length : '0'}+</h3>
                  <p className="text-ocean-300 text-sm">Species Cataloged</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-ocean-700/80 rounded-full p-3">
                  <Database className="h-6 w-6 text-ocean-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Supabase</h3>
                  <p className="text-ocean-300 text-sm">Powered Data</p>
                </div>
              </div>
              
              {/* Removed Dive Regions/Habitat Stat - Could be replaced if there's another relevant stat */}
              {/* <div className="flex items-center space-x-4">
                <div className="bg-ocean-700/80 rounded-full p-3">
                  <Waves className="h-6 w-6 text-ocean-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">120+</h3>
                  <p className="text-ocean-300 text-sm">Dive Regions (Illustrative)</p>
                </div>
              </div> */}
              
              <div className="flex items-center space-x-4">
                <div className="bg-ocean-700/80 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-coral-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{marineLifeData.filter(s => ['Endangered', 'Critically Endangered', 'Vulnerable'].includes(s.conservationStatus)).length}+</h3>
                  <p className="text-coral-500 text-sm">At-Risk Species</p>
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
        
        {filteredMarineLife.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Fish className="h-12 w-12 text-ocean-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Species Found</h3>
            <p className="text-ocean-300 max-w-md mx-auto">
              We couldn't find any marine species that match your search criteria. Try adjusting your filters or search terms, or there might be no data available.
            </p>
          </div>
        )}
        
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
