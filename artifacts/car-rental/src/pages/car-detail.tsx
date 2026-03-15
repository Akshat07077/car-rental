import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useGetCar, useCheckCarAvailability } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { differenceInDays } from "date-fns";
import { Users, Fuel, Settings2, MapPin, CalendarDays, CheckCircle2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

{/* car placeholder */}
const defaultImage = "https://images.unsplash.com/photo-1503376760302-8fac2a800d02?w=1200&q=80";

export default function CarDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: car, isLoading, error } = useGetCar(Number(id));
  
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const { data: availability, isLoading: isChecking } = useCheckCarAvailability(
    Number(id), 
    { pickup_date: pickupDate, return_date: returnDate },
    { query: { enabled: !!pickupDate && !!returnDate } }
  );

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Skeleton className="h-[500px] w-full rounded-3xl mb-8" />
      <Skeleton className="h-12 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );

  if (error || !car) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <h2 className="text-3xl font-bold font-display">Car Not Found</h2>
      <p className="text-muted-foreground mt-4">The vehicle you are looking for does not exist.</p>
      <Button className="mt-8" onClick={() => setLocation('/cars')}>Back to Fleet</Button>
    </div>
  );

  const imageSrc = car.imageUrl || defaultImage;
  const today = new Date().toISOString().split('T')[0];
  const minReturn = pickupDate || today;
  
  const days = (pickupDate && returnDate) ? differenceInDays(new Date(returnDate), new Date(pickupDate)) : 0;
  const total = days > 0 ? days * car.pricePerDay : 0;
  
  const isAvailable = availability?.available ?? true;

  const handleBookNow = () => {
    if (!pickupDate || !returnDate) {
      toast({ title: "Dates Required", description: "Please select both pickup and return dates.", variant: "destructive" });
      return;
    }
    if (days <= 0) {
      toast({ title: "Invalid Dates", description: "Return date must be after pickup date.", variant: "destructive" });
      return;
    }
    if (!isAvailable) {
      toast({ title: "Unavailable", description: "Car is not available for selected dates.", variant: "destructive" });
      return;
    }
    
    setLocation(`/booking/${car.id}?pickup=${pickupDate}&return=${returnDate}`);
  };

  return (
    <div className="bg-background pb-24">
      {/* Immersive Header Image */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-muted overflow-hidden">
        <img src={imageSrc} alt={`${car.brand} ${car.model}`} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-card p-8 rounded-3xl shadow-xl shadow-black/5 border border-border/50">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1">
                  {car.year}
                </Badge>
                {!car.available && <Badge variant="destructive" className="px-3 py-1">Currently Offline</Badge>}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-2 text-foreground">
                {car.brand} {car.model}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-primary" /> {car.location}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 border-t border-border/50 pt-10">
                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Transmission</span>
                  <div className="flex items-center gap-2 text-foreground font-medium text-lg">
                    <Settings2 className="w-5 h-5 text-primary" /> <span className="capitalize">{car.transmission}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Fuel</span>
                  <div className="flex items-center gap-2 text-foreground font-medium text-lg">
                    <Fuel className="w-5 h-5 text-primary" /> <span className="capitalize">{car.fuelType}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-muted-foreground text-sm uppercase tracking-wider font-semibold">Seats</span>
                  <div className="flex items-center gap-2 text-foreground font-medium text-lg">
                    <Users className="w-5 h-5 text-primary" /> <span>{car.seats} People</span>
                  </div>
                </div>
              </div>

              {car.description && (
                <div className="mt-10 border-t border-border/50 pt-10">
                  <h3 className="text-2xl font-display font-bold mb-4">About this vehicle</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{car.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/5 border border-border/50 sticky top-28">
              <div className="mb-6">
                <p className="text-3xl font-display font-bold text-primary">${car.pricePerDay}</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Per day</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Pickup Date</Label>
                  <Input 
                    type="date" 
                    value={pickupDate} 
                    onChange={(e) => setPickupDate(e.target.value)} 
                    min={today}
                    className="h-12 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Return Date</Label>
                  <Input 
                    type="date" 
                    value={returnDate} 
                    onChange={(e) => setReturnDate(e.target.value)} 
                    min={minReturn}
                    className="h-12 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20"
                  />
                </div>

                {pickupDate && returnDate && (
                  <div className="bg-muted/50 rounded-2xl p-5 border border-border/50 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex justify-between items-center mb-3 text-sm">
                      <span className="text-muted-foreground">${car.pricePerDay} × {days} days</span>
                      <span className="font-medium">${total}</span>
                    </div>
                    <div className="border-t border-border/50 pt-3 flex justify-between items-center">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-xl text-primary">${total}</span>
                    </div>

                    {isChecking ? (
                      <p className="text-sm text-muted-foreground mt-4 text-center">Checking availability...</p>
                    ) : isAvailable ? (
                      <p className="text-sm text-green-600 mt-4 flex items-center justify-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4" /> Available for these dates
                      </p>
                    ) : (
                      <p className="text-sm text-destructive mt-4 flex items-center justify-center gap-1.5 font-medium">
                        <AlertCircle className="w-4 h-4" /> Not available for selected dates
                      </p>
                    )}
                  </div>
                )}

                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                  onClick={handleBookNow}
                  disabled={!car.available || isChecking || !isAvailable}
                >
                  {car.available ? "Book Now" : "Unavailable"}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
