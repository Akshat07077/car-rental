import { Link } from "wouter";
import type { Car } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Fuel, Settings2 } from "lucide-react";

// car placeholder
const defaultImage = "https://images.unsplash.com/photo-1503376760302-8fac2a800d02?w=800&q=80";

export function CarCard({ car }: { car: Car }) {
  const imageSrc = car.imageUrl || defaultImage;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-lg shadow-black/5 hover:shadow-xl hover:border-border transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img 
          src={imageSrc} 
          alt={`${car.brand} ${car.model}`} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-background/90 text-foreground backdrop-blur-md border-none font-bold shadow-sm px-3 py-1">
            {car.year}
          </Badge>
        </div>
        {car.available === false && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[2px] z-20">
            <Badge variant="destructive" className="text-sm px-4 py-1.5 shadow-lg">Currently Unavailable</Badge>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-foreground line-clamp-1">{car.brand} {car.model}</h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
              {car.location}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-display font-bold text-primary">${car.pricePerDay}</p>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Per day</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4 mb-4 border-y border-border/50">
          <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-muted/50">
            <Settings2 className="w-4 h-4 text-muted-foreground mb-1" />
            <span className="text-xs font-medium capitalize">{car.transmission}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-muted/50">
            <Fuel className="w-4 h-4 text-muted-foreground mb-1" />
            <span className="text-xs font-medium capitalize">{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center p-2 rounded-lg bg-muted/50">
            <Users className="w-4 h-4 text-muted-foreground mb-1" />
            <span className="text-xs font-medium">{car.seats} Seats</span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <Link href={`/cars/${car.id}`}>
            <Button className="w-full font-semibold rounded-xl" size="lg" variant={car.available ? "default" : "secondary"}>
              {car.available ? "View Details" : "View Specs"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
