import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Species } from '@/contexts/MarineLifeDataContext';

export interface MarineFilters {
  searchQuery: string;
  category: string | null;
  status: string | null;
  depthRange: string | null;
  distribution: string | null;
}

interface MarineLifeFiltersProps {
  marineLifeData: Species[];
  onApplyFilters: (filters: MarineFilters) => void;
  initialFilters: MarineFilters;
}

const MarineLifeFilters = ({ marineLifeData, onApplyFilters, initialFilters }: MarineLifeFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialFilters.category);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(initialFilters.status);
  const [selectedDepthRange, setSelectedDepthRange] = useState<string | null>(initialFilters.depthRange);
  const [selectedDistribution, setSelectedDistribution] = useState<string | null>(initialFilters.distribution);

  const categories = useMemo(() => [...new Set(marineLifeData.map(item => item.category))].sort(), [marineLifeData]);
  const conservationStatuses = useMemo(() => [...new Set(marineLifeData.map(item => item.conservationStatus))].sort(), [marineLifeData]);
  
  // WORKAROUND for build error: Cast to 'any' to access properties potentially missing from Species type definition.
  // Ideally, the Species type in MarineLifeDataContext.tsx should be updated.
  const depthRanges = useMemo(() => [...new Set(marineLifeData.map(item => (item as any).depth_range).filter(Boolean) as string[])].sort(), [marineLifeData]);
  const distributions = useMemo(() => [...new Set(marineLifeData.map(item => (item as any).distribution).filter(Boolean) as string[])].sort(), [marineLifeData]);


  const handleApplyFilters = () => {
    onApplyFilters({
      searchQuery,
      category: selectedCategory,
      status: selectedStatus,
      depthRange: selectedDepthRange,
      distribution: selectedDistribution,
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedStatus(null);
    setSelectedDepthRange(null);
    setSelectedDistribution(null);
    onApplyFilters({
      searchQuery: '',
      category: null,
      status: null,
      depthRange: null,
      distribution: null,
    });
  };

  return (
    <Card className="bg-ocean-800 border-ocean-700 mb-8">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or scientific name..."
              className="pl-9 bg-ocean-700/50 border-ocean-600 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="category-select" className="text-sm font-medium text-ocean-200 mb-1 block">
              Category
            </label>
            <Select
              onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
              value={selectedCategory || "all"}
            >
              <SelectTrigger id="category-select" className="bg-ocean-700/50 border-ocean-600 text-white">
                <SelectValue placeholder="Any Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="status-select" className="text-sm font-medium text-ocean-200 mb-1 block">
              Conservation Status
            </label>
            <Select
              onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
              value={selectedStatus || "all"}
            >
              <SelectTrigger id="status-select" className="bg-ocean-700/50 border-ocean-600 text-white">
                <SelectValue placeholder="Any Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Status</SelectItem>
                {conservationStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="depth-select" className="text-sm font-medium text-ocean-200 mb-1 block">
              Depth Range
            </label>
            <Select
              onValueChange={(value) => setSelectedDepthRange(value === "all" ? null : value)}
              value={selectedDepthRange || "all"}
            >
              <SelectTrigger id="depth-select" className="bg-ocean-700/50 border-ocean-600 text-white">
                <SelectValue placeholder="Any Depth Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Depth Range</SelectItem>
                {depthRanges.map((depth) => (
                  <SelectItem key={depth} value={depth}>{depth}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="distribution-select" className="text-sm font-medium text-ocean-200 mb-1 block">
              Distribution
            </label>
            <Select
              onValueChange={(value) => setSelectedDistribution(value === "all" ? null : value)}
              value={selectedDistribution || "all"}
            >
              <SelectTrigger id="distribution-select" className="bg-ocean-700/50 border-ocean-600 text-white">
                <SelectValue placeholder="Any Distribution" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Distribution</SelectItem>
                {distributions.map((dist) => (
                  <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
            <Button 
                variant="outline" 
                className="border-ocean-600 text-white hover:bg-ocean-700"
                onClick={handleResetFilters}
            >
                Reset Filters
            </Button>
            <Button
                className="bg-seagreen-600 hover:bg-seagreen-700 text-white flex items-center gap-2"
                onClick={handleApplyFilters}
            >
                <Filter className="h-4 w-4" />
                Apply Filters
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarineLifeFilters;
