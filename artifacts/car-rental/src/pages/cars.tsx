import { useState } from "react";
import { useListCars, ListCarsParams } from "@workspace/api-client-react";
import { CarCard } from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, FilterX, Car as CarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Cars() {
  const [filters, setFilters] = useState<ListCarsParams>({});
  const { data: cars, isLoading } = useListCars(filters);

  const handleFilterChange = (key: keyof ListCarsParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" || value === "" ? undefined : value
    }));
  };

  const clearFilters = () => setFilters({});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h2 className="text-2xl font-display font-bold tracking-tight mb-6">Filters</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Location</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search city..." 
                    className="pl-9 rounded-xl bg-card border-border/50 focus-visible:ring-primary/20"
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Transmission</Label>
                <select 
                  className="flex h-11 w-full rounded-xl border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={filters.transmission || 'all'}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                >
                  <option value="all">Any Transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Fuel Type</Label>
                <select 
                  className="flex h-11 w-full rounded-xl border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={filters.fuel_type || 'all'}
                  onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
                >
                  <option value="all">Any Fuel Type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Max Price / Day</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    type="range" 
                    min="50" max="1000" step="50"
                    value={filters.max_price || 1000}
                    onChange={(e) => handleFilterChange('max_price', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm font-medium w-12 text-right">${filters.max_price || '1000+'}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full rounded-xl border-dashed" onClick={clearFilters}>
                <FilterX className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </aside>

        {/* Cars Grid */}
        <div className="flex-1">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing <span className="font-bold text-foreground">{cars?.length || 0}</span> vehicles
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center bg-card rounded-3xl border border-dashed border-border">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <CarIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">No vehicles found</h3>
              <p className="text-muted-foreground max-w-sm">We couldn't find any cars matching your current filters. Try adjusting your criteria.</p>
              <Button variant="outline" className="mt-6 rounded-xl" onClick={clearFilters}>Reset Filters</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
