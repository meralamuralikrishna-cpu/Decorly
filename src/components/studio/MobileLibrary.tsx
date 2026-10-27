import { useState } from 'react';
import { LIBRARY_ITEMS, CATEGORY_LABELS } from '@/data/library';
import type { LibraryCategory, LibraryItem } from '@/types';
import { cn } from '@/lib/utils';

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

export function MobileLibrary({ onAdd }: Props) {
  const [tab, setTab] = useState<LibraryCategory>('flowers');
  const items = LIBRARY_ITEMS.filter((i) => i.category === tab);

  return (
    <div className="border-t border-sage/30 bg-white">
      <div className="flex gap-1 px-2 pt-2 overflow-x-auto" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shrink-0',
              tab === t ? 'bg-forest text-ivory' : 'bg-sage/20 text-charcoal/70',
            )}
          >
            {CATEGORY_LABELS[t]}
          </button>
        ))}
      </div>
      <div className="flex gap-2 p-2 overflow-x-auto">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onAdd(item)}
            className="shrink-0 w-24 rounded-xl border border-sage/30 p-2 text-left hover:border-champagne"
          >
            <span
              className="block h-8 w-full rounded-lg mb-1.5"
              style={{ background: item.color }}
            />
            <span className="text-[10px] font-medium text-charcoal line-clamp-2">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
