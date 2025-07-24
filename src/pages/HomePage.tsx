
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useWatches, WatchFilters } from "@/context/WatchContext";
import WatchCard from "@/components/WatchCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

const HomePage = () => {
  const location = useLocation();
  const { filteredWatches, featuredWatches, filters, setFilters } = useWatches();
  const [localFilters, setLocalFilters] = useState<WatchFilters>(filters);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchTerm = params.get("search") || undefined;
    const featured = params.get("featured") === "true";
    
    const newFilters: WatchFilters = { ...filters };
    
    if (searchTerm) {
      newFilters.searchTerm = searchTerm;
      setLocalFilters(prev => ({ ...prev, searchTerm }));
    }
    
    setFilters(newFilters);
  }, [location.search, setFilters]);
  
  // Update local filters when global filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  const handleFilterChange = (name: keyof WatchFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyFilters = () => {
    setFilters({
      ...localFilters,
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    });
  };
  
  const resetFilters = () => {
    setLocalFilters({});
    setPriceRange([0, 1000]);
    setFilters({});
  };
  
  // Extract unique brands for filter options
  const uniqueBrands = Array.from(
    new Set(filteredWatches.map(watch => watch.brand))
  ).sort();
  
  // Determine which watches to display
  const displayWatches = filters.searchTerm || Object.keys(filters).length > 0
    ? filteredWatches
    : featuredWatches.length > 0
    ? featuredWatches
    : filteredWatches;
  
  const isFeaturedPage = new URLSearchParams(location.search).get("featured") === "true";
  
  // Fix for the type error: Create a handler function with the correct type signature
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]] as [number, number]);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Section */}
      {!isFeaturedPage && !filters.searchTerm && (
        <div className="mb-16 bg-background py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-semibold tracking-tight text-bezel-black md:text-6xl">
              Rent Luxury Watches
            </h1>
            <p className="mb-8 text-lg text-bezel-gray max-w-2xl mx-auto leading-relaxed">
              Access the world's finest timepieces. From Rolex to Patek Philippe, 
              experience luxury without the commitment of ownership.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button asChild size="lg" className="bg-bezel-black hover:bg-bezel-dark-gray text-white px-8 py-3 text-base">
                <a href="#featured-watches">Explore Collection</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="minimal-button px-8 py-3 text-base">
                <a href="/list-watch">List Your Watch</a>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Page Title */}
      <div className="mb-10">
        <h2 className="text-2xl font-medium text-bezel-black tracking-tight">
          {isFeaturedPage
            ? "Featured Watches"
            : filters.searchTerm
            ? `Search Results for "${filters.searchTerm}"`
            : "Available Watches"}
        </h2>
        <p className="mt-1 text-sm text-bezel-gray">
          {displayWatches.length} watches available
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Filters Sidebar */}
        <div className="mb-8 w-full lg:mb-0 lg:w-1/4">
          <div className="rounded border border-bezel-light-gray bg-background p-6">
            <h3 className="mb-6 text-lg font-medium text-bezel-black">Filters</h3>
            
            <Accordion type="single" collapsible defaultValue="brand">
              <AccordionItem value="brand">
                <AccordionTrigger>Brand</AccordionTrigger>
                <AccordionContent>
                  <Select
                    value={localFilters.brand || ""}
                    onValueChange={(value) => handleFilterChange("brand", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {uniqueBrands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="price">
                <AccordionTrigger>Price Range</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Slider
                      defaultValue={[0, 1000]}
                      max={1000}
                      step={10}
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                    />
                    <div className="flex items-center justify-between">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="rental">
                <AccordionTrigger>Rental Period</AccordionTrigger>
                <AccordionContent>
                  <Select
                    value={localFilters.rentalPeriod || ""}
                    onValueChange={(value: any) => handleFilterChange("rentalPeriod", value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Period</SelectItem>
                      <SelectItem value="day">Daily</SelectItem>
                      <SelectItem value="week">Weekly</SelectItem>
                      <SelectItem value="month">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="search">
                <AccordionTrigger>Search</AccordionTrigger>
                <AccordionContent>
                  <Input
                    placeholder="Search watches..."
                    value={localFilters.searchTerm || ""}
                    onChange={(e) => handleFilterChange("searchTerm", e.target.value || undefined)}
                    className="w-full"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6 space-y-3">
              <Button
                onClick={applyFilters}
                className="w-full bg-bezel-black hover:bg-bezel-dark-gray text-white"
                size="sm"
              >
                Apply Filters
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                className="w-full minimal-button"
                size="sm"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
        
        {/* Watches Grid */}
        <div className="w-full lg:w-3/4">
          {displayWatches.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded border border-bezel-light-gray bg-background p-8 text-center">
              <h3 className="mb-2 text-lg font-medium text-bezel-black">No watches found</h3>
              <p className="mb-4 text-sm text-bezel-gray">Try adjusting your filters or search criteria</p>
              <Button onClick={resetFilters} variant="outline" className="minimal-button">Reset Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {displayWatches.map((watch) => (
                <WatchCard key={watch.id} watch={watch} featured={watch.featured} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
