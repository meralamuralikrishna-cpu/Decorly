import { useState } from 'react';
import { LIBRARY_ITEMS, CATEGORY_LABELS } from '@/data/library';
import type { LibraryCategory, LibraryItem } from '@/types';
import { cn, formatINR } from '@/lib/utils';
import { ElementVisual } from './ElementVisual';

const TABS: LibraryCategory[] = [
  'flowers',
  'backdrops',
  'furniture',
  'lighting',
  'fabrics',
  'props',
];

interface Props {
  onAdd: (item: LibraryItem) => void;
}

export function ElementLibrary({ onAdd }: Props) {
  const [tab, setTab] = useState<LibraryCategory>('flowers');
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const items = LIBRARY_ITEMS.filter((i) => {
    if (i.category !== tab) return false;
    if (!query) return true;
    return (
      i.name.toLowerCase().includes(query) ||
      i.description.toLowerCase().includes(query)
    );
  });

  return (
    <aside className="w-56 lg:w-64 shrink-0 border-r border-sage/30 bg-white/60 flex flex-col h-full">
      <div className="px-3 pt-3 pb-2 space-y-2">
        <div className="flex items-baseline justify-between px-1">
          <h2 className="font-display text-lg text-forest">Library</h2>
          <span className="text-[10px] text-charcoal/40">{items.length}</span>
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search décor…"
          aria-label="Search library"
          className="w-full h-8 px-2.5 rounded-lg border border-sage/40 bg-white/80 text-xs outline-none focus:border-champagne"
        />
      </div>
      <div
        className="flex flex-wrap gap-1 px-3 pb-3"
        role="tablist"
        aria-label="Library categories"
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              'px-2 py-1 rounded-lg text-[11px] font-medium transition',
              tab === t
                ? 'bg-forest text-ivory'
                : 'bg-sage/20 text-charcoal/70 hover:bg-sage/35',
            )}
          >
            {CATEGORY_LABELS[t]}
          </button>
        ))}
      </div>
      <ul className="flex-1 overflow-y-auto px-3 pb-4 space-y-2" role="list">
        {items.length === 0 && (
          <li className="text-[11px] text-charcoal/45 px-1 py-4 text-center">
            No items match “{q.trim()}”
          </li>
        )}
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onAdd(item)}
              className="w-full text-left rounded-xl border border-sage/30 bg-ivory/80 hover:border-champagne hover:shadow-sm transition p-2.5 group"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-11 w-11 rounded-lg shrink-0 border border-sage/30 bg-gradient-to-br from-ivory to-sage/20 overflow-hidden p-0.5 shadow-sm"
                  aria-hidden
                >
                  <ElementVisual
                    element={{
                      id: item.id,
                      libraryId: item.id,
                      category: item.category,
                      name: item.name,
                      x: 0,
                      y: 0,
                      width: 40,
                      height: 40,
                      rotation: 0,
                      color: item.color,
                      accent: item.accent,
                      zIndex: 1,
                    }}
                    density={70}
                  />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-charcoal truncate group-hover:text-forest">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-charcoal/50 truncate">{item.description}</p>
                  <p className="text-[10px] text-champagne mt-0.5">{formatINR(item.baseCost)}</p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
