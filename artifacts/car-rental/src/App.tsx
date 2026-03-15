import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "./components/layout";
import { AdminLayout } from "./components/admin-layout";

import Home from "./pages/home";
import Cars from "./pages/cars";
import CarDetail from "./pages/car-detail";
import Booking from "./pages/booking";
import Confirmation from "./pages/confirmation";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AdminCars from "./pages/admin/cars";
import AdminBookings from "./pages/admin/bookings";

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => !isAbortError(error) && failureCount < 1,
      refetchOnWindowFocus: false,
      throwOnError: (error) => !isAbortError(error),
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public / Auth Pages */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Admin Pages */}
      <Route path="/admin">
        <Redirect to="/admin/cars" />
      </Route>
      <Route path="/admin/cars">
        <AdminLayout><AdminCars /></AdminLayout>
      </Route>
      <Route path="/admin/bookings">
        <AdminLayout><AdminBookings /></AdminLayout>
      </Route>

      {/* Main Site Pages */}
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/cars">
        <Layout><Cars /></Layout>
      </Route>
      <Route path="/cars/:id">
        <Layout><CarDetail /></Layout>
      </Route>
      
      {/* Protected User Pages */}
      <Route path="/booking/:carId">
        <Layout><Booking /></Layout>
      </Route>
      <Route path="/booking/confirmation/:bookingId">
        <Layout><Confirmation /></Layout>
      </Route>
      <Route path="/dashboard">
        <Layout><Dashboard /></Layout>
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
