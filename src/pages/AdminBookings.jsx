import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDate, cn } from '@/lib/utils';

export function AdminBookings() {
  const { isAdmin, bookings, setBookingStatus } = useApp();
  const { toast } = useToast();
  if (!isAdmin) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <p className="section-kicker mb-2">Administration</p>
        <h1 className="font-display text-4xl text-forest tracking-tight">Admin access required</h1>
        <p className="text-sm text-charcoal/65 mt-3">
          This account does not have the trusted admin role. Set <code>app_metadata.role</code> to <code>admin</code> for this account in Supabase, then sign out and sign back in.
        </p>
        <Link to="/" className="inline-flex mt-5 text-sm font-semibold text-forest underline decoration-champagne/70 hover:decoration-champagne">Return to workspace</Link>
      </div>
    );
  }

  const decide = async (booking, status) => {
    try {
      await setBookingStatus(booking.id, status);
      toast(status === 'confirmed' ? 'Booking confirmed' : 'Booking declined', 'success');
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Could not update this booking.', 'error');
    }
  };

  const pending = bookings.filter((booking) => booking.status === 'pending');
  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <p className="section-kicker mb-2">Administration</p>
        <h1 className="font-display text-4xl text-forest tracking-tight">Booking requests</h1>
        <p className="text-sm text-charcoal/60 mt-2">Review requests from all Decorly users and confirm or decline them.</p>
      </div>

      {pending.length === 0 ? (
        <EmptyState title="No requests to review" description="New booking requests will appear here." />
      ) : (
        <ul className="space-y-4">
          {pending.map((booking) => (
            <li key={booking.id}>
              <Card>
                <CardBody className="pt-5 flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-xl text-forest">{booking.decoratorName || 'Venue booking'}</h2>
                      <Badge className={cn('bg-champagne/25 text-charcoal')}>Pending review</Badge>
                    </div>
                    <p className="text-sm text-charcoal/70">{booking.eventType} · {formatDate(booking.eventDate)}{booking.venue ? ` · ${booking.venue}` : ''}</p>
                    {booking.designName && <p className="text-sm text-forest">Decoration: {booking.designName}</p>}
                    {booking.notes && <p className="text-sm text-charcoal/60">{booking.notes}</p>}
                    {(booking.requesterName || booking.requesterEmail) && <p className="text-sm text-forest">Requested by {booking.requesterName || booking.requesterEmail}{booking.requesterName && booking.requesterEmail ? ` · ${booking.requesterEmail}` : ''}</p>}
                    <p className="text-[11px] text-charcoal/40">Request {booking.id} · Submitted {formatDate(booking.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => void decide(booking, 'confirmed')}><Check className="h-4 w-4"/>Confirm</Button>
                    <Button size="sm" variant="secondary" onClick={() => void decide(booking, 'declined')}><X className="h-4 w-4"/>Decline</Button>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
