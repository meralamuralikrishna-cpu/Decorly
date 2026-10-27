import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import { DEMO_TEMPLATES } from '@/data/mock';
import { getTheme } from '@/data/themes';
import { useApp } from '@/context/AppContext';
import { Card, CardBody } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { formatINR, cn } from '@/lib/utils';

export function ExploreTemplates() {
  const { templateFavorites, toggleTemplateFavorite, setActiveDesignId } = useApp();
  const [q, setQ] = useState('');
  const [eventType, setEventType] = useState('all');
  const [theme, setTheme] = useState('all');
  const [favOnly, setFavOnly] = useState(false);

  const filtered = useMemo(() => {
    return DEMO_TEMPLATES.filter((t) => {
      if (favOnly && !templateFavorites.includes(t.id)) return false;
      if (eventType !== 'all' && t.eventType !== eventType) return false;
      if (theme !== 'all' && t.themeId !== theme) return false;
      if (q) {
        const hay = `${t.name} ${t.description} ${t.tags.join(' ')} ${t.style}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [q, eventType, theme, favOnly, templateFavorites]);

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl text-forest">Explore Templates</h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Curated starting points. All items are labelled demo data.
          </p>
        </div>
        <DemoBadge />
      </div>

      <div className="flex flex-wrap gap-3 mb-8 items-end">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
          <Input
            className="pl-9"
            placeholder="Search templates…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search templates"
          />
        </div>
        <Select
          label="Event"
          options={[
            { value: 'all', label: 'All events' },
            { value: 'Wedding', label: 'Wedding' },
            { value: 'Reception', label: 'Reception' },
            { value: 'Haldi', label: 'Haldi' },
          ]}
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        />
        <Select
          label="Theme"
          options={[
            { value: 'all', label: 'All themes' },
            { value: 'blush-romance', label: 'Blush Romance' },
            { value: 'ivory-elegance', label: 'Ivory Elegance' },
            { value: 'sage-garden', label: 'Sage Garden' },
            { value: 'royal-gold', label: 'Royal Gold' },
            { value: 'traditional-marigold', label: 'Traditional Marigold' },
          ]}
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
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

      {filtered.length === 0 ? (
        <p className="text-center text-charcoal/50 py-16">No templates match your filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tpl) => {
            const th = getTheme(tpl.themeId);
            const fav = templateFavorites.includes(tpl.id);
            return (
              <Card key={tpl.id} className="overflow-hidden flex flex-col">
                <div
                  className="h-36 relative"
                  style={{
                    background: `linear-gradient(160deg, ${th.palette.backdrop}, ${th.palette.primary} 60%, ${th.palette.platform})`,
                  }}
                >
                  <button
                    type="button"
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition"
                    aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
                    onClick={() => toggleTemplateFavorite(tpl.id)}
                  >
                    <Heart className={cn('h-4 w-4 text-forest', fav && 'fill-blush text-blush')} />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <DemoBadge />
                  </div>
                </div>
                <CardBody className="pt-4 flex-1 flex flex-col">
                  <p className="font-display text-xl text-forest">{tpl.name}</p>
                  <p className="text-xs text-charcoal/55 mt-1 flex-1">{tpl.description}</p>
                  <p className="text-xs text-champagne mt-3">
                    {formatINR(tpl.budgetRange[0])} – {formatINR(tpl.budgetRange[1])} · {tpl.style}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2 mb-4">
                    {tpl.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-sage/25 text-forest">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/studio?template=${tpl.id}`} onClick={() => setActiveDesignId(null)}>
                    <Button className="w-full" size="sm">
                      Use in Studio
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
