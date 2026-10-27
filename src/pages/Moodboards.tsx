import { useMemo, useState, FormEvent } from 'react';
import { Heart, Plus, Search, Trash2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import type { MoodboardItem } from '@/types';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { DemoBadge } from '@/components/ui/Badge';
import { formatDate, cn } from '@/lib/utils';

const DEFAULT_COLORS = ['#E8C7C4', '#FAF7F2', '#C5A46D', '#A8B5A0'];

export function Moodboards() {
  const {
    moodboards,
    saveMoodboard,
    deleteMoodboard,
    toggleMoodboardFavorite,
  } = useApp();
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const [colors, setColors] = useState(DEFAULT_COLORS);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const filtered = useMemo(() => {
    return moodboards.filter((m) => {
      if (favOnly && !m.isFavorite) return false;
      if (q) {
        const hay = `${m.title} ${m.notes} ${m.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [moodboards, q, favOnly]);

  const onCreate = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const item: MoodboardItem = {
      id: uuid(),
      title: title.trim(),
      colors,
      notes: notes.trim() || 'Custom moodboard',
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isFavorite: false,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    saveMoodboard(item);
    toast('Moodboard created', 'success');
    setCreateOpen(false);
    setTitle('');
    setNotes('');
    setTags('');
    setColors(DEFAULT_COLORS);
  };

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl md:text-[2.75rem] text-forest tracking-tight leading-none">
            Moodboards
          </h1>
          <p className="text-sm text-charcoal/60 mt-1">Colour stories for your celebration.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New moodboard
        </Button>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal/40" />
          <Input className="pl-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
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
          title="No moodboards"
          description="Create one to collect colour stories for your event."
          action={
            <Button onClick={() => setCreateOpen(true)}>Create moodboard</Button>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <div className="h-20 flex">
                {m.colors.map((c) => (
                  <div key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              <CardBody className="pt-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-xl text-forest">{m.title}</p>
                  {m.isDemo && <DemoBadge />}
                </div>
                <p className="text-xs text-charcoal/55 mt-1">{m.notes}</p>
                <p className="text-[10px] text-charcoal/40 mt-2">{formatDate(m.createdAt)}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-label="Toggle favorite"
                    onClick={() => toggleMoodboardFavorite(m.id)}
                  >
                    <Heart className={cn('h-3.5 w-3.5', m.isFavorite && 'fill-blush text-blush')} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    aria-label="Delete"
                    onClick={() => setDeleteId(m.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New moodboard"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="moodboard-form">
              Create
            </Button>
          </>
        }
      >
        <form id="moodboard-form" onSubmit={onCreate} className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            required
          />
          <Input
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Input
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            hint="e.g. blush, evening"
          />
          <fieldset>
            <legend className="text-sm font-medium text-charcoal/80 mb-2">Palette</legend>
            <div className="flex gap-2">
              {colors.map((c, i) => (
                <input
                  key={i}
                  type="color"
                  value={c}
                  aria-label={`Colour ${i + 1}`}
                  onChange={(e) => {
                    const next = [...colors];
                    next[i] = e.target.value;
                    setColors(next);
                  }}
                  className="h-10 w-14 rounded-lg border border-sage/40 cursor-pointer"
                />
              ))}
            </div>
          </fieldset>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete moodboard?"
        message="This moodboard will be removed from this device."
        confirmLabel="Delete"
        danger
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMoodboard(deleteId);
            toast('Moodboard deleted', 'info');
          }
          setDeleteId(null);
        }}
      />
    </div>
  );
}
