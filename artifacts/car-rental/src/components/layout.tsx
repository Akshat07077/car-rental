import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Car, User, LogOut, LayoutDashboard, Settings, Menu, X, Home, List } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight">AutoLuxe</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}>Home</Link>
            <Link href="/cars" className={`text-sm font-medium transition-colors hover:text-primary ${location === '/cars' ? 'text-primary' : 'text-muted-foreground'}`}>Browse Cars</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20">
                    <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer w-full flex items-center py-2">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/cars" className="cursor-pointer w-full flex items-center py-2">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-destructive focus:text-destructive py-2">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="font-semibold">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button className="font-semibold shadow-lg shadow-primary/20 rounded-xl">Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location === '/' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-foreground'}`}>
                <Home className="w-4 h-4" /> Home
              </div>
            </Link>
            <Link href="/cars" onClick={() => setMobileOpen(false)}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location === '/cars' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-foreground'}`}>
                <Car className="w-4 h-4" /> Browse Cars
              </div>
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${location === '/dashboard' ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-muted text-foreground'}`}>
                    <LayoutDashboard className="w-4 h-4" /> My Bookings
                  </div>
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/cars" onClick={() => setMobileOpen(false)}>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground transition-colors">
                      <Settings className="w-4 h-4" /> Admin Dashboard
                    </div>
                  </Link>
                )}
                <div className="pt-2 border-t border-border/40 mt-2">
                  <p className="px-4 py-1 text-xs text-muted-foreground">{user.email}</p>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive w-full transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t border-border/40 mt-2 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl font-semibold">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full rounded-xl font-semibold shadow-lg shadow-primary/20">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Car className="w-6 h-6 text-primary" />
              <span className="font-display font-bold text-xl tracking-tight">AutoLuxe</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Experience the thrill of driving premium vehicles. We offer an exclusive collection of luxury and performance cars for your next journey.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-display">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/cars" className="hover:text-primary transition-colors">Browse Fleet</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Member Login</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 font-display">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@autoluxe.example.com</li>
              <li>1-800-LUXE-CAR</li>
              <li>123 Prestige Ave, CA 90210</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} AutoLuxe Rentals. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
