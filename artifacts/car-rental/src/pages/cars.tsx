import { useState } from "react";
import { useListCars, ListCarsParams } from "@workspace/api-client-react";
import { CarCard } from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, FilterX, Car as CarIcon, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function FilterPanel({ filters, onChange, onClear }: {
  filters: ListCarsParams;
  onChange: (key: keyof ListCarsParams, value: any) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search city..."
            className="pl-9 rounded-xl bg-card border-border/50 focus-visible:ring-primary/20"
            value={filters.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transmission</Label>
          <select
            className="flex h-11 w-full rounded-xl border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={filters.transmission || 'all'}
            onChange={(e) => onChange('transmission', e.target.value)}
          >
            <option value="all">Any Transmission</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fuel Type</Label>
          <select
            className="flex h-11 w-full rounded-xl border border-border/50 bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={filters.fuel_type || 'all'}
            onChange={(e) => onChange('fuel_type', e.target.value)}
          >
            <option value="all">Any Fuel Type</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Max Price / Day</Label>
          <span className="text-sm font-bold text-primary">${filters.max_price || '1000+'}</span>
        </div>
        <input
          type="range"
          min="50" max="1000" step="50"
          value={filters.max_price || 1000}
          onChange={(e) => onChange('max_price', parseInt(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$50</span><span>$1000+</span>
        </div>
      </div>

      <Button variant="outline" className="w-full rounded-xl border-dashed" onClick={onClear}>
        <FilterX className="w-4 h-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );
}

export default function Cars() {
  const [filters, setFilters] = useState<ListCarsParams>({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data: cars, isLoading } = useListCars(filters);

  const handleFilterChange = (key: keyof ListCarsParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" || value === "" ? undefined : value
    }));
  };

  const clearFilters = () => setFilters({});
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

      {/* Mobile Filter Toggle */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-border bg-card text-sm font-semibold"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </span>
          {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {filtersOpen && (
          <div className="mt-3 p-4 bg-card border border-border rounded-2xl">
            <FilterPanel filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0">
          <h2 className="text-2xl font-display font-bold tracking-tight mb-6">Filters</h2>
          <FilterPanel filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
        </aside>

        {/* Cars Grid */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground text-sm md:text-base">
              Showing <span className="font-bold text-foreground">{cars?.length || 0}</span> vehicles
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {cars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center bg-card rounded-3xl border border-dashed border-border">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mb-4 md:mb-6">
                <CarIcon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-display font-bold mb-2">No vehicles found</h3>
              <p className="text-muted-foreground text-sm max-w-xs px-4">We couldn't find any cars matching your filters. Try adjusting your criteria.</p>
              <Button variant="outline" className="mt-6 rounded-xl" onClick={clearFilters}>Reset Filters</Button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
