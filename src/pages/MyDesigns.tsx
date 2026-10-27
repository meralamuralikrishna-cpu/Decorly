import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Search, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { getTheme } from '@/data/themes';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/Modal';
import { DemoBadge } from '@/components/ui/Badge';
import { formatDate, formatINR, cn } from '@/lib/utils';

export function MyDesigns() {
  const {
    designs,
    deleteDesign,
    toggleDesignFavorite,
    setActiveDesignId,
  } = useApp();
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return designs.filter((d) => {
      if (favOnly && !d.isFavorite) return false;
      if (q && !d.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [designs, q, favOnly]);

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl text-forest">My Designs</h1>
          <p className="text-sm text-charcoal/60 mt-1">Stored in localStorage on this device.</p>
        </div>
        <Link to="/studio" onClick={() => setActiveDesignId(null)}>
          <Button>
            <Plus className="h-4 w-4" />
            New design
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
          <Input
            className="pl-9"
            placeholder="Search designs…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
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
        <EmptyState
          title="No designs yet"
          description={
            designs.length === 0
              ? 'Open the Design Studio to create your first look.'
              : 'Nothing matches your search.'
          }
          action={
            <Link to="/studio">
              <Button>Start Designing</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d) => {
            const th = getTheme(d.thumbnailTheme);
            return (
              <Card key={d.id} className="overflow-hidden">
                <div
                  className="h-32 relative"
                  style={{
                    background: `linear-gradient(145deg, ${th.palette.backdrop}, ${th.palette.primary})`,
                  }}
                >
                  {d.notes?.toLowerCase().includes('demo') && (
                    <div className="absolute top-3 left-3">
                      <DemoBadge />
                    </div>
                  )}
                  <button
                    type="button"
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 flex items-center justify-center"
                    aria-label="Toggle favorite"
                    onClick={() => toggleDesignFavorite(d.id)}
                  >
                    <Heart
                      className={cn(
                        'h-4 w-4 text-forest',
                        d.isFavorite && 'fill-blush text-blush',
                      )}
                    />
                  </button>
                </div>
                <CardBody className="pt-4">
                  <p className="font-display text-xl text-forest">{d.name}</p>
                  <p className="text-xs text-charcoal/50 mt-1">
                    {formatDate(d.updatedAt)} · {formatINR(d.estimatedBudget)}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/studio?design=${d.id}`}
                      className="flex-1"
                      onClick={() => setActiveDesignId(d.id)}
                    >
                      <Button size="sm" className="w-full">
                        Open
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="secondary"
                      aria-label={`Delete ${d.name}`}
                      onClick={() => setDeleteId(d.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete design?"
        message="This cannot be undone. The design will be removed from localStorage."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteDesign(deleteId);
            toast('Design deleted', 'info');
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
