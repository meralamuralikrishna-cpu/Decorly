import { useState } from 'react';
import { ArrowRight, Check, Clipboard, Flower2, MapPin, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

const SERVICES = ['Ceremony flowers', 'Stage & backdrop', 'Table styling', 'Lighting', 'Draping', 'Setup & teardown'];

export function FindDecorators() {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const linkedDesign = {
    id: searchParams.get('designId') || '',
    name: searchParams.get('designName') || '',
    type: searchParams.get('designType') || '',
  };
  const [eventType, setEventType] = useState(searchParams.get('eventType') || 'Wedding');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [style, setStyle] = useState(searchParams.get('style') || '');
  const [services, setServices] = useState([]);

  const brief = [
    `Looking for an event decorator for a ${eventType.toLowerCase()}.`,
    linkedDesign.name && `Decoration design: ${linkedDesign.name}.`,
    location.trim() && `Location: ${location.trim()}.`,
    budget.trim() && `Budget: ${budget.trim()}.`,
    style.trim() && `Style / inspiration: ${style.trim()}.`,
    services.length > 0 && `Services needed: ${services.join(', ')}.`,
  ].filter(Boolean).join('\n');

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      toast('Search brief copied', 'success');
    } catch {
      toast('Could not copy the brief. Check clipboard permissions.', 'error');
    }
  };

  const toggleService = (service) => setServices((current) => current.includes(service)
    ? current.filter((item) => item !== service)
    : [...current, service]);

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto">
      <PageHeader
        kicker="Local directory"
        title="Find Decorators"
        description="Put together a clear brief to share with decorators and keep your search moving."
      />

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5 items-start">
        <section className="rounded-2xl border border-sage/30 bg-white/75 p-5 md:p-7 shadow-sm">
          <div className="flex items-start gap-3 mb-6">
            <span className="h-10 w-10 rounded-xl bg-champagne/20 text-forest flex items-center justify-center"><Flower2 className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-2xl text-forest">Your decorator brief</h2>
              <p className="text-xs text-charcoal/55 mt-1">A few details make it easier to compare replies.</p>
            </div>
          </div>

          {linkedDesign.name && <div className="mb-5 rounded-xl border border-champagne/35 bg-champagne/10 px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-charcoal/50">Selected decoration</p>
            <p className="text-sm font-semibold text-forest mt-1">{linkedDesign.name}</p>
          </div>}

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="space-y-1.5 text-sm font-medium text-charcoal/80">
              Event type
              <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-sage/40 bg-white text-sm outline-none focus:border-champagne focus:ring-2 focus:ring-champagne/25">
                {['Wedding', 'Birthday', 'Baby shower', 'Engagement', 'Anniversary', 'Corporate event', 'Other celebration'].map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <Input label="City or venue" placeholder="e.g. Hyderabad" value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input label="Approximate budget" placeholder="e.g. ₹1,00,000" value={budget} onChange={(e) => setBudget(e.target.value)} />
            <Input label="Style or theme" placeholder="e.g. garden, ivory and sage" value={style} onChange={(e) => setStyle(e.target.value)} />
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-charcoal/80 mb-2.5">What do you need help with?</legend>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((service) => {
                const selected = services.includes(service);
                return <button key={service} type="button" aria-pressed={selected} onClick={() => toggleService(service)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs transition ${selected ? 'border-forest bg-forest text-ivory' : 'border-sage/40 bg-white text-charcoal/70 hover:border-sage'}`}>
                  {selected && <Check className="h-3 w-3" />}{service}
                </button>;
              })}
            </div>
          </fieldset>
        </section>

        <aside className="rounded-2xl border border-champagne/40 bg-ivory p-5 md:p-6">
          <div className="flex items-center gap-2 text-forest mb-3"><Sparkles className="h-4 w-4" /><h2 className="font-display text-xl">Ready to share</h2></div>
          <p className="text-xs leading-relaxed text-charcoal/55 mb-4">Copy your brief to share with decorators, then submit a venue booking request and track it in your booking history.</p>
          <div className="rounded-xl bg-white/75 border border-sage/25 p-4 mb-4 min-h-36">
            <p className="text-sm text-charcoal whitespace-pre-line leading-relaxed">{brief}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={copyBrief} className="w-full"><Clipboard className="h-4 w-4" />Copy brief</Button>
            <Link to={`/bookings?new=1&venue=${encodeURIComponent(location.trim())}&eventType=${encodeURIComponent(eventType)}&notes=${encodeURIComponent(brief)}&designId=${encodeURIComponent(linkedDesign.id)}&designName=${encodeURIComponent(linkedDesign.name)}&designType=${encodeURIComponent(linkedDesign.type)}`} className="inline-flex items-center justify-center gap-2 h-10 rounded-xl border border-sage/40 bg-white/80 px-4 text-sm font-semibold text-forest hover:bg-white transition">
              Book a venue <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-5 pt-4 border-t border-sage/25 flex gap-2 text-[11px] leading-relaxed text-charcoal/50"><MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />Decorator profiles are not connected yet, so this brief stays in your browser until you choose to share it.</p>
        </aside>
      </div>
    </div>
  );
}
