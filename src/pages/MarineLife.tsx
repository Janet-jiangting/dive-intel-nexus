import React, { useState, useMemo } from 'react';
import { Fish, Database, AlertTriangle, Globe } from 'lucide-react';
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
import { useMarineLifeData, Species } from '@/contexts/MarineLifeDataContext';
import { Skeleton } from '@/components/ui/skeleton';
import MarineLifeDetailModal from '@/components/MarineLifeDetailModal';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import MarineLifeFilters, { MarineFilters } from '@/components/MarineLifeFilters';

const ITEMS_PER_PAGE = 9;

const MarineLife = () => {
  const { marineLife: marineLifeData, isLoading, error } = useMarineLifeData();

  const initialFiltersState: MarineFilters = {
    searchQuery: '',
    category: null,
    status: null,
    depthRange: null,
    distribution: null,
  };
  const [appliedFilters, setAppliedFilters] = useState<MarineFilters>(initialFiltersState);

  // Modal State
  const [selectedSpeciesModal, setSelectedSpeciesModal] = useState<Species | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredMarineLife = useMemo(() => {
    console.log("Filtering data with applied filters:", appliedFilters);
    const filtered = marineLifeData.filter(item => {
      if (appliedFilters.searchQuery && 
          !item.name.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase()) && 
          !item.scientificName.toLowerCase().includes(appliedFilters.searchQuery.toLowerCase())) {
        return false;
      }
      if (appliedFilters.category && item.category !== appliedFilters.category) return false;
      if (appliedFilters.status && item.conservationStatus !== appliedFilters.status) return false;
      if (appliedFilters.depthRange && item.depth_range !== appliedFilters.depthRange) return false;
      if (appliedFilters.distribution && item.distribution !== appliedFilters.distribution) return false;
      return true;
    });
    console.log("Filtered count:", filtered.length);
    return filtered;
  }, [marineLifeData, appliedFilters]);

  // Paginated Data
  const totalPages = Math.ceil(filteredMarineLife.length / ITEMS_PER_PAGE);
  const paginatedMarineLife = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredMarineLife.slice(startIndex, endIndex);
  }, [filteredMarineLife, currentPage]);

  const handleCardClick = (species: Species) => {
    setSelectedSpeciesModal(species);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleApplyFiltersInPage = (filters: MarineFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to page 1 when filters are applied
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5; // Max number of page links to show (e.g., 1 ... 4 5 6 ... 10)
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" isActive={currentPage === i} onClick={(e) => { e.preventDefault(); handlePageChange(i); }}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" isActive={currentPage === 1} onClick={(e) => { e.preventDefault(); handlePageChange(1); }}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      let startPage = Math.max(2, currentPage - halfMaxPages + (currentPage > totalPages - halfMaxPages ? totalPages - currentPage - (halfMaxPages - (totalPages-currentPage)) +1 : 0) );
      let endPage = Math.min(totalPages - 1, currentPage + halfMaxPages - (currentPage < halfMaxPages+1 ? halfMaxPages - currentPage +1 : 0));
      
      if (currentPage - 1 > halfMaxPages && totalPages > maxPagesToShow) {
         items.push(<PaginationEllipsis key="start-ellipsis" />);
      }
      
      for (let i = startPage; i <= endPage; i++) {
          if (i === 0) continue; // Should not happen with Math.max(2, ...)
           items.push(
             <PaginationItem key={i}>
               <PaginationLink href="#" isActive={currentPage === i} onClick={(e) => { e.preventDefault(); handlePageChange(i); }}>
                 {i}
               </PaginationLink>
             </PaginationItem>
           );
      }

      if (totalPages - currentPage > halfMaxPages && totalPages > maxPagesToShow) {
        items.push(<PaginationEllipsis key="end-ellipsis" />);
      }

      // Show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" isActive={currentPage === totalPages} onClick={(e) => { e.preventDefault(); handlePageChange(totalPages); }}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ocean-900 p-8">
        <div className="container mx-auto">
          <Skeleton className="h-12 w-1/2 mb-4" />
          <Skeleton className="h-8 w-3/4 mb-8" />
          {/* Skeleton for filters */}
          <Card className="bg-ocean-800 border-ocean-700 mb-8">
            <CardContent className="pt-6">
                <Skeleton className="h-10 w-full mb-4" /> {/* Search bar skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)} {/* Filter selects skeleton */}
                </div>
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-24" /> {/* Apply button skeleton */}
                </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <Card key={i} className="bg-ocean-800/50 border-ocean-700">
                <Skeleton className="h-48 w-full" />
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <div className="space-y-2">
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
          
          <MarineLifeFilters 
            marineLifeData={marineLifeData} 
            onApplyFilters={handleApplyFiltersInPage}
            initialFilters={appliedFilters}
          />
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
          {/* Sort by Select - functionality not implemented yet */}
          <Select defaultValue="name">
            <SelectTrigger className="w-[180px] bg-ocean-800/50 border-ocean-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="name_desc">Name Z-A</SelectItem>
              <SelectItem value="status">Conservation Status</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              {/* Add more sort options if needed */}
            </SelectContent>
          </Select>
        </div>
        
        <Card className="bg-ocean-800/50 border-ocean-700 mb-8">
          <CardContent className="p-6">
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
          {paginatedMarineLife.map((species) => (
            <MarineLifeCard key={species.id} species={species} onClick={() => handleCardClick(species)} />
          ))}
        </div>
        
        {totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}/>
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}/>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        
        {filteredMarineLife.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Fish className="h-12 w-12 text-ocean-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Species Found</h3>
            <p className="text-ocean-300 max-w-md mx-auto">
              We couldn't find any marine species that match your search criteria. Try adjusting your filters or search terms.
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
               {/* ... existing conservation status info boxes ... */}
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
      
      <MarineLifeDetailModal 
        species={selectedSpeciesModal}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
};

export default MarineLife;
