import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatDate, cn } from '@/lib/utils';
import { Link, useSearchParams } from 'react-router-dom';
const STATUS_STYLE = {
    pending: 'bg-champagne/25 text-charcoal',
    confirmed: 'bg-sage/40 text-forest',
    declined: 'bg-red-100 text-red-800',
};
export function Bookings() {
    const { bookings, deleteBooking, saveBooking, canSaveData } = useApp();
    const { toast } = useToast();
    const [searchParams] = useSearchParams();
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('all');
    const [deleteId, setDeleteId] = useState(null);
    const [addOpen, setAddOpen] = useState(searchParams.get('new') === '1');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [eventDate, setEventDate] = useState('');
    const [eventType, setEventType] = useState(searchParams.get('eventType') || 'Wedding');
    const [venue, setVenue] = useState(searchParams.get('venue') || '');
    const [notes, setNotes] = useState(searchParams.get('notes') || '');
    const linkedDesignId = searchParams.get('designId') || '';
    const linkedDesignName = searchParams.get('designName') || '';
    const linkedDesignType = searchParams.get('designType') || '';
    useEffect(() => {
        if (searchParams.get('new') === '1') setAddOpen(true);
    }, [searchParams]);
    const addBooking = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await saveBooking({ eventDate, eventType, venue: venue.trim(), notes: notes.trim(), designId: linkedDesignId, designName: linkedDesignName, designType: linkedDesignType });
            setEventDate(''); setVenue(''); setNotes(''); setAddOpen(false);
            toast('Booking request submitted for review', 'success');
        } catch (error) {
            toast(error?.message || 'Could not submit this booking request. Check the Supabase booking_requests table and RLS policies.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    const filtered = useMemo(() => {
        return bookings.filter((b) => {
            if (status !== 'all' && b.status !== status)
                return false;
            if (q) {
                const hay = `${b.decoratorName} ${b.venue} ${b.eventType} ${b.notes}`.toLowerCase();
                if (!hay.includes(q.toLowerCase()))
                    return false;
            }
            return true;
        });
    }, [bookings, q, status]);
    return (<div className="p-6 md:p-10 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-[2.75rem] text-forest tracking-tight leading-none">
            Booking history
          </h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Your venue booking requests and their review status.
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4"/>New request</Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 items-end">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40"/>
          <Input className="pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)}/>
        </div>
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} options={[
            { value: 'all', label: 'All statuses' },
            { value: 'pending', label: 'Pending review' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'declined', label: 'Declined' },
        ]}/>
      </div>

      {filtered.length === 0 ? (<EmptyState title="No booking requests" description="Submit a request to send it to the Decorly admin team for review." action={<Button onClick={() => setAddOpen(true)}>New request</Button>}/>) : (<ul className="space-y-4">
          {filtered.map((b) => (<li key={b.id}>
              <Card>
                <CardBody className="pt-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display text-xl text-forest">{b.decoratorName || 'Venue booking'}</p>
                        <Badge className={cn(STATUS_STYLE[b.status])}>{b.status}</Badge>
                      </div>
                      <p className="text-sm text-charcoal/70 mt-1">
                        {b.eventType} · {formatDate(b.eventDate)} · {b.venue}
                      </p>
                      {b.designName && (<p className="text-xs text-forest mt-2">
                          {b.designId ? (<Link to={b.designType === 'template' ? `/studio?template=${encodeURIComponent(b.designId)}` : `/studio?design=${encodeURIComponent(b.designId)}`} className="underline decoration-champagne/60 hover:decoration-champagne">
                              {b.designName ?? 'Linked design'}
                            </Link>) : (b.designName)}
                        </p>)}
                      {b.notes && <p className="text-xs text-charcoal/50 mt-2">{b.notes}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" aria-label="Delete booking" onClick={() => setDeleteId(b.id)}>
                        <Trash2 className="h-3.5 w-3.5"/>
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </li>))}
        </ul>)}

      <ConfirmDialog open={!!deleteId} title="Delete booking?" message="This booking request will be removed." confirmLabel="Delete" danger onCancel={() => setDeleteId(null)} onConfirm={async () => {
            if (deleteId) {
                try { await deleteBooking(deleteId); toast('Booking request deleted', 'info'); }
                catch (error) { toast(error instanceof Error ? error.message : 'Could not delete this request.', 'error'); }
            }
            setDeleteId(null);
        }}/>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add a booking" footer={<>
        <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
        <Button type="submit" form="booking-form" disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit request'}</Button>
      </>}>
        <form id="booking-form" onSubmit={addBooking} className="space-y-3">
          {!canSaveData && <p className="text-xs text-amber-800">Sign in with a configured Supabase account to submit requests for admin review.</p>}
          {linkedDesignName && <p className="rounded-lg bg-sage/15 px-3 py-2 text-sm text-forest">Linked decoration: <span className="font-semibold">{linkedDesignName}</span></p>}
          <Input label="Event date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
          <Input label="Event type" value={eventType} onChange={(e) => setEventType(e.target.value)} required />
          <Input label="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
          <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </form>
      </Modal>
    </div>);
}
