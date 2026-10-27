import { useEffect, useMemo, useState, FormEvent } from 'react';
import { Heart, Search, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { DEMO_DECORATORS } from '@/data/mock';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DemoBadge } from '@/components/ui/Badge';
import { cn, formatINR } from '@/lib/utils';
import type { Decorator } from '@/types';

export function FindDecorators() {
  const { designs, decoratorFavorites, toggleDecoratorFavorite, saveBooking } = useApp();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('all');
  const [favOnly, setFavOnly] = useState(false);
  const [inquire, setInquire] = useState<Decorator | null>(null);
  const [eventDate, setEventDate] = useState('');
  const [eventType, setEventType] = useState('Wedding');
  const [venue, setVenue] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ eventDate?: string; venue?: string }>({});

  const linkedDesignId = params.get('design');
  const linkedEstimate = Number(params.get('estimate') || 0);
  const linkedDesign = useMemo(
    () => (linkedDesignId ? designs.find((d) => d.id === linkedDesignId) ?? null : null),
    [designs, linkedDesignId],
  );
  const estimate =
    linkedEstimate > 0 ? linkedEstimate : (linkedDesign?.estimatedBudget ?? 0);

  useEffect(() => {
    if (!linkedDesign) return;
    setNotes((prev) =>
      prev.trim()
        ? prev
        : `Please quote for design “${linkedDesign.name}” (illustrative studio estimate ${formatINR(estimate)}). Demo inquiry only.`,
    );
    if (linkedDesign.eventDate) setEventDate(linkedDesign.eventDate);
  }, [linkedDesign, estimate]);

  const cities = useMemo(
    () => ['all', ...Array.from(new Set(DEMO_DECORATORS.map((d) => d.city)))],
    [],
  );

  const filtered = useMemo(() => {
    return DEMO_DECORATORS.filter((d) => {
      if (favOnly && !decoratorFavorites.includes(d.id)) return false;
      if (city !== 'all' && d.city !== city) return false;
      if (q) {
        const hay = `${d.name} ${d.city} ${d.specialties.join(' ')} ${d.bio}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [q, city, favOnly, decoratorFavorites]);

  // Deterministic mock recommendations: sort by rating then name
  const ranked = useMemo(
    () => [...filtered].sort((a, b) => b.rating - a.rating || a.name.localeCompare(b.name)),
    [filtered],
  );

  const submitInquiry = (e: FormEvent) => {
    e.preventDefault();
    if (!inquire) return;
    const next: typeof errors = {};
    if (!eventDate) next.eventDate = 'Event date is required';
    if (!venue.trim()) next.venue = 'Venue is required';
    setErrors(next);
    if (Object.keys(next).length) return;

    saveBooking({
      id: uuid(),
      decoratorId: inquire.id,
      decoratorName: inquire.name,
      eventDate,
      eventType,
      venue: venue.trim(),
      status: 'inquiry',
      notes:
        notes.trim() ||
        'Demo inquiry — no message sent to a real decorator.',
      isDemo: true,
      createdAt: new Date().toISOString(),
      designId: linkedDesign?.id,
      designName: linkedDesign?.name,
      estimatedBudget: estimate > 0 ? estimate : undefined,
    });
    toast(
      linkedDesign
        ? `Inquiry saved with design “${linkedDesign.name}” (demo)`
        : 'Inquiry saved locally (demo only)',
      'success',
    );
    setInquire(null);
    setEventDate('');
    setVenue('');
    setNotes('');
  };

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-[2.75rem] text-forest tracking-tight leading-none">
            Find Decorators
          </h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Demo directory with deterministic rankings. No real contacts or payments.
          </p>
        </div>
        <DemoBadge />
      </div>

      {linkedDesign && (
        <div className="mb-6 rounded-2xl border border-champagne/40 bg-champagne/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-champagne font-medium">
              Quote request from Studio
            </p>
            <p className="font-display text-xl text-forest mt-0.5">{linkedDesign.name}</p>
            <p className="text-xs text-charcoal/60">
              Illustrative estimate {formatINR(estimate)} — will attach to your inquiry.
            </p>
          </div>
          <Link to={`/studio?design=${encodeURIComponent(linkedDesign.id)}`}>
            <Button variant="secondary" size="sm">
              Back to design
            </Button>
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-8 items-end">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
          <Input
            className="pl-9"
            placeholder="Search by name, specialty…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select
          label="City"
          options={cities.map((c) => ({
            value: c,
            label: c === 'all' ? 'All cities' : c,
          }))}
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <Button
          variant={favOnly ? 'primary' : 'secondary'}
          onClick={() => setFavOnly((v) => !v)}
          aria-pressed={favOnly}
        >
          <Heart className={cn('h-4 w-4', favOnly && 'fill-current')} />
          Favorites
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ranked.map((d, i) => {
          const fav = decoratorFavorites.includes(d.id);
          return (
            <Card key={d.id} className="flex flex-col">
              <CardBody className="pt-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-xl text-forest">{d.name}</p>
                    <p className="text-xs text-charcoal/50">
                      {d.city} · {d.priceBand} · {d.yearsExperience} yrs
                    </p>
                  </div>
                  <DemoBadge />
                </div>
                <div className="flex items-center gap-1 mt-2 text-champagne text-sm">
                  <Star className="h-3.5 w-3.5 fill-champagne" />
                  {d.rating.toFixed(1)}
                  {i === 0 && ranked.length > 1 && (
                    <span className="ml-2 text-[10px] text-forest bg-sage/30 px-2 py-0.5 rounded-full">
                      Top match
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal/60 mt-3 flex-1">{d.bio}</p>
                <div className="flex flex-wrap gap-1 mt-3 mb-4">
                  {d.specialties.map((s) => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-blush/40 text-charcoal">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => setInquire(d)}>
                    {linkedDesign ? 'Request quote' : 'Inquire'}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-label="Toggle favorite"
                    onClick={() => toggleDecoratorFavorite(d.id)}
                  >
                    <Heart className={cn('h-3.5 w-3.5', fav && 'fill-blush text-blush')} />
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <Modal
        open={!!inquire}
        onClose={() => setInquire(null)}
        title={
          linkedDesign
            ? `Quote — ${inquire?.name ?? ''}`
            : `Inquire — ${inquire?.name ?? ''}`
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setInquire(null)}>
              Cancel
            </Button>
            <Button type="submit" form="inquire-form">
              Save inquiry
            </Button>
          </>
        }
      >
        <p className="text-xs text-charcoal/50 mb-4">
          Demo form only. Nothing is sent to a real decorator or payment system.
        </p>
        {linkedDesign && (
          <div className="mb-4 rounded-xl bg-sage/15 border border-sage/30 px-3 py-2 text-xs text-charcoal/70">
            Attaching design <span className="font-medium text-forest">{linkedDesign.name}</span>
            {estimate > 0 && (
              <> · studio estimate {formatINR(estimate)}</>
            )}
          </div>
        )}
        <form id="inquire-form" onSubmit={submitInquiry} className="space-y-3">
          <Input
            label="Event date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            error={errors.eventDate}
            required
          />
          <Select
            label="Event type"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            options={[
              { value: 'Wedding', label: 'Wedding' },
              { value: 'Reception', label: 'Reception' },
              { value: 'Haldi', label: 'Haldi' },
              { value: 'Mehendi', label: 'Mehendi' },
              { value: 'Sangeet', label: 'Sangeet' },
              { value: 'Engagement', label: 'Engagement' },
              { value: "Valentine's Day", label: "Valentine's Day" },
              { value: 'Anniversary', label: 'Anniversary' },
              { value: 'Birthday', label: 'Birthday' },
              { value: 'Baby Shower', label: 'Baby Shower' },
              { value: 'Diwali', label: 'Diwali' },
            ]}
          />
          <Input
            label="Venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            error={errors.venue}
            required
          />
          <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </form>
      </Modal>
    </div>
  );
}
