import { 
  useListBookings, 
  useUpdateBookingStatus, 
  getListBookingsQueryKey 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

export default function AdminBookings() {
  const { data: bookings, isLoading } = useListBookings();
  const updateStatus = useUpdateBookingStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, data: { status: status as any } });
      queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
      toast({ title: "Status Updated", description: "Booking status changed successfully." });
    } catch {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-600 border-none';
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-none';
      case 'completed': return 'bg-primary/10 text-primary border-none';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-none';
      default: return 'bg-muted text-muted-foreground border-none';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <h1 className="text-3xl font-display font-bold tracking-tight">Manage Bookings</h1>
        <p className="text-muted-foreground mt-1">View and update customer reservations.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4">ID / Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vehicle & Dates</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center"><Spinner className="mx-auto text-primary" /></td></tr>
              ) : bookings?.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center text-muted-foreground">No bookings found.</td></tr>
              ) : bookings?.map(booking => (
                <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs font-bold text-muted-foreground mb-1">#{booking.id}</div>
                    <div className="text-xs">{format(new Date(booking.createdAt), 'MMM d, yyyy')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-foreground">{booking.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-muted-foreground">{booking.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">{booking.car?.brand} {booking.car?.model}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(booking.pickupDate), 'MM/dd/yy')} - {format(new Date(booking.returnDate), 'MM/dd/yy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold">
                    ${booking.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <Badge variant="outline" className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <select 
                        className="text-xs p-1 rounded border border-border bg-background focus:outline-none focus:border-primary"
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        disabled={updateStatus.isPending}
                      >
                        <option value="pending">Set Pending</option>
                        <option value="confirmed">Set Confirmed</option>
                        <option value="completed">Set Completed</option>
                        <option value="cancelled">Set Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
