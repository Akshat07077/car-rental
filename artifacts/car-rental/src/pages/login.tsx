import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ data: { email, password } });
      setLocation(redirectUrl);
    } catch (err) {
      // Error handled by toast in hook
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-6">
              <Car className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-display font-extrabold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Log in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-10">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" type="email" required 
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl" placeholder="name@example.com" 
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" type="password" required 
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl" placeholder="••••••••" 
              />
            </div>
            
            <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20" disabled={isLoggingIn}>
              {isLoggingIn ? <Spinner className="w-5 h-5 mr-2" /> : null}
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right Image Side */}
      <div className="hidden lg:flex flex-1 relative bg-muted overflow-hidden">
        <img 
          src={`${import.meta.env.BASE_URL}images/auth-bg.png`} 
          alt="Abstract background" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]" />
        <div className="absolute bottom-12 left-12 right-12 text-white z-10">
          <h2 className="text-4xl font-display font-bold mb-4">The road is yours.</h2>
          <p className="text-lg text-white/80">Manage your bookings, unlock premium fleet options, and hit the road faster with an AutoLuxe account.</p>
        </div>
      </div>
    </div>
  );
}
