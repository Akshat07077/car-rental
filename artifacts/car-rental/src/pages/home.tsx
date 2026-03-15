import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Clock, MapPin, Star } from "lucide-react";
import { useListCars } from "@workspace/api-client-react";
import { CarCard } from "@/components/CarCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: cars, isLoading } = useListCars({ available: true });
  const featuredCars = cars?.slice(0, 3) || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative w-full h-[650px] flex items-center overflow-hidden">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
          alt="Luxury Car Hero" 
          className="absolute inset-0 w-full h-full object-cover scale-105 animate-in fade-in zoom-in duration-1000" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-6 bg-primary/20 text-primary hover:bg-primary/30 border-none px-4 py-1.5 text-sm">
              Premium Car Rental
            </Badge>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
              Drive Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Dream Car</span> Today.
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Experience unparalleled luxury and performance. Browse our exclusive collection of premium vehicles for your next journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cars">
                <Button size="lg" className="rounded-xl px-8 h-14 text-base font-semibold shadow-xl shadow-primary/20">
                  Browse Fleet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Fully Insured</h3>
              <p className="text-muted-foreground">Comprehensive coverage included with every rental for your peace of mind.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">24/7 Support</h3>
              <p className="text-muted-foreground">Our dedicated concierge team is available around the clock to assist you.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Premium Fleet</h3>
              <p className="text-muted-foreground">Meticulously maintained luxury and performance vehicles from top brands.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cars */}
      <div className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold mb-4 tracking-tight">Featured Vehicles</h2>
              <p className="text-muted-foreground text-lg">Hand-picked selections for your driving pleasure.</p>
            </div>
            <Link href="/cars">
              <Button variant="outline" className="hidden sm:flex rounded-xl font-semibold">View All Cars</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[250px] w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
          
          <div className="mt-10 sm:hidden">
            <Link href="/cars">
              <Button variant="outline" className="w-full rounded-xl">View All Cars</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal Badge Component for Hero
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>{children}</span>
}
