import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Car, ListOrdered, ArrowLeft, LogOut } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      setLocation('/');
    }
  }, [isLoading, user, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card fixed h-full z-10 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">AutoLuxe <span className="text-primary text-sm uppercase ml-1">Admin</span></span>
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          <Link href="/admin/cars">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${location === '/admin/cars' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
              <Car className="w-5 h-5" />
              Manage Fleet
            </div>
          </Link>
          <Link href="/admin/bookings">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${location === '/admin/bookings' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
              <ListOrdered className="w-5 h-5" />
              Bookings
            </div>
          </Link>
        </div>

        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full justify-start gap-2 mb-2" onClick={() => setLocation('/')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Button>
          <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => logout()}>
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
