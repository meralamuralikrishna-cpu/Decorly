import { useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/Modal';
import { DemoBadge, Badge } from '@/components/ui/Badge';
import { formatDate, cn } from '@/lib/utils';
import type { Booking } from '@/types';
import { Link } from 'react-router-dom';

const STATUS_STYLE: Record<Booking['status'], string> = {
  inquiry: 'bg-champagne/25 text-charcoal',
  confirmed: 'bg-sage/40 text-forest',
  completed: 'bg-forest/15 text-forest',
  cancelled: 'bg-red-100 text-red-800',
};

export function Bookings() {
  const { bookings, deleteBooking, saveBooking } = useApp();
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (status !== 'all' && b.status !== status) return false;
      if (q) {
        const hay = `${b.decoratorName} ${b.venue} ${b.eventType} ${b.notes}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [bookings, q, status]);

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl text-forest">Bookings</h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Local demo inquiries only — no real bookings or payments.
          </p>
        </div>
        <DemoBadge />
      </div>

      <div className="flex flex-wrap gap-3 mb-8 items-end">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
          <Input className="pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'inquiry', label: 'Inquiry' },
            { value: 'confirmed', label: 'Confirmed' },
            { value: 'completed', label: 'Completed' },
            { value: 'cancelled', label: 'Cancelled' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No bookings"
          description="Inquire with a decorator from Find Decorators to create a demo booking."
          action={
            <Link to="/decorators">
              <Button>Find decorators</Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {filtered.map((b) => (
            <li key={b.id}>
              <Card>
                <CardBody className="pt-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display text-xl text-forest">{b.decoratorName}</p>
                        <Badge className={cn(STATUS_STYLE[b.status])}>{b.status}</Badge>
                        {b.isDemo && <DemoBadge />}
                      </div>
                      <p className="text-sm text-charcoal/70 mt-1">
                        {b.eventType} · {formatDate(b.eventDate)} · {b.venue}
                      </p>
                      <p className="text-xs text-charcoal/50 mt-2">{b.notes}</p>
                    </div>
                    <div className="flex gap-2">
                      {b.status === 'inquiry' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            saveBooking({ ...b, status: 'confirmed' });
                            toast('Marked confirmed (demo)', 'success');
                          }}
                        >
                          Mark confirmed
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="secondary"
                        aria-label="Delete booking"
                        onClick={() => setDeleteId(b.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete booking?"
        message="This demo booking will be removed from localStorage."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteBooking(deleteId);
            toast('Booking deleted', 'info');
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
