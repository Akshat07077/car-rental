import { useAuth } from "@/hooks/use-auth";
import { useListBookings } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Car, Calendar, ExternalLink, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function UserDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation('/login');
    }
  }, [user, authLoading, setLocation]);

  const { data: bookings, isLoading } = useListBookings();

  if (authLoading || !user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'completed': return 'bg-primary/10 text-primary border-primary/20';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold mb-2 tracking-tight">Welcome, {user.name || 'Driver'}</h1>
        <p className="text-muted-foreground text-lg">Manage your upcoming trips and past rentals.</p>
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold font-display flex items-center gap-2 mb-8">
          <Activity className="w-6 h-6 text-primary" /> Your Bookings
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking.id} className="flex flex-col md:flex-row bg-muted/30 border border-border/50 rounded-2xl overflow-hidden hover:border-border hover:shadow-md transition-all">
                <div className="w-full md:w-48 bg-muted shrink-0 relative">
                   {booking.car?.imageUrl ? (
                     <img src={booking.car.imageUrl} alt={booking.car.model} className="w-full h-full object-cover min-h-[160px]" />
                   ) : (
                     <div className="w-full h-full min-h-[160px] flex items-center justify-center bg-muted">
                        <Car className="w-8 h-8 text-muted-foreground/30" />
                     </div>
                   )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold font-display">{booking.car?.brand} {booking.car?.model}</h3>
                      <Badge variant="outline" className={`capitalize ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" /> 
                        <span className="font-medium text-foreground">{format(new Date(booking.pickupDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" /> 
                        <span className="font-medium text-foreground">{format(new Date(booking.returnDate), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground col-span-2 mt-2">
                        Total Amount: <span className="font-bold text-foreground text-base">${booking.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-end items-end shrink-0">
                    <Link href={`/booking/confirmation/${booking.id}`}>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        View Receipt <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border">
            <Car className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">Looks like you haven't rented any cars yet.</p>
            <Link href="/cars">
              <Button className="rounded-xl">Browse Fleet</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
