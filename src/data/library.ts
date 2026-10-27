import type { LibraryItem } from '@/types';

export const LIBRARY_ITEMS: LibraryItem[] = [
  // Flowers
  { id: 'fl-rose-blush', name: 'Blush Rose Cluster', category: 'flowers', color: '#E8C7C4', accent: '#C5A46D', baseCost: 4500, icon: 'rose', description: 'Soft blush rose arrangement' },
  { id: 'fl-ivory-peony', name: 'Ivory Peony Bunch', category: 'flowers', color: '#FAF7F2', accent: '#E8C7C4', baseCost: 5200, icon: 'peony', description: 'Full ivory peonies' },
  { id: 'fl-sage-eucalyptus', name: 'Sage Eucalyptus', category: 'flowers', color: '#A8B5A0', accent: '#243D35', baseCost: 2800, icon: 'leaf', description: 'Trailing eucalyptus greenery' },
  { id: 'fl-marigold', name: 'Marigold Garland', category: 'flowers', color: '#E8A838', accent: '#C45C26', baseCost: 3200, icon: 'marigold', description: 'Traditional marigold strand' },
  { id: 'fl-orchid', name: 'White Orchid Spray', category: 'flowers', color: '#FFFFFF', accent: '#C5A46D', baseCost: 6800, icon: 'orchid', description: 'Elegant orchid spray' },
  { id: 'fl-hydrangea', name: 'Blush Hydrangea', category: 'flowers', color: '#F0D6D3', accent: '#A8B5A0', baseCost: 4900, icon: 'hydrangea', description: 'Rounded hydrangea mound' },
  // Backdrops
  { id: 'bd-floral-arch', name: 'Floral Arch', category: 'backdrops', color: '#E8C7C4', accent: '#A8B5A0', baseCost: 18000, icon: 'arch', description: 'Classic arched floral frame' },
  { id: 'bd-draped-curtain', name: 'Draped Curtain', category: 'backdrops', color: '#FAF7F2', accent: '#C5A46D', baseCost: 9500, icon: 'curtain', description: 'Soft fabric curtain backdrop' },
  { id: 'bd-mandap', name: 'Mandap Frame', category: 'backdrops', color: '#C5A46D', accent: '#E8A838', baseCost: 35000, icon: 'mandap', description: 'Traditional mandap structure' },
  { id: 'bd-garden-wall', name: 'Garden Wall', category: 'backdrops', color: '#A8B5A0', accent: '#243D35', baseCost: 22000, icon: 'wall', description: 'Living greenery wall' },
  // Furniture
  { id: 'fu-stage', name: 'Stage Platform', category: 'furniture', color: '#D4C4B0', accent: '#C5A46D', baseCost: 12000, icon: 'stage', description: 'Raised stage platform' },
  { id: 'fu-loveseat', name: 'Couple Loveseat', category: 'furniture', color: '#E8C7C4', accent: '#C5A46D', baseCost: 7500, icon: 'sofa', description: 'Upholstered sweetheart seat' },
  { id: 'fu-pedestal', name: 'Column Pedestal', category: 'furniture', color: '#FAF7F2', accent: '#C5A46D', baseCost: 3500, icon: 'pedestal', description: 'Classic display pedestal' },
  { id: 'fu-aisle-stand', name: 'Aisle Stand', category: 'furniture', color: '#A8B5A0', accent: '#243D35', baseCost: 2800, icon: 'stand', description: 'Aisle floral stand' },
  // Lighting
  { id: 'li-string-lights', name: 'String Lights', category: 'lighting', color: '#C5A46D', accent: '#FAF7F2', baseCost: 4200, icon: 'string', description: 'Warm fairy string lights' },
  { id: 'li-chandeliers', name: 'Crystal Chandelier', category: 'lighting', color: '#FAF7F2', accent: '#C5A46D', baseCost: 15000, icon: 'chandelier', description: 'Hanging crystal chandelier' },
  { id: 'li-uplights', name: 'Uplight Wash', category: 'lighting', color: '#E8C7C4', accent: '#C5A46D', baseCost: 6000, icon: 'uplight', description: 'Soft color uplighting' },
  { id: 'li-lanterns', name: 'Hanging Lanterns', category: 'lighting', color: '#C5A46D', accent: '#243D35', baseCost: 3800, icon: 'lantern', description: 'Decorative hanging lanterns' },
  // Fabrics
  { id: 'fa-silk-drape', name: 'Silk Drape', category: 'fabrics', color: '#E8C7C4', accent: '#FAF7F2', baseCost: 5500, icon: 'drape', description: 'Flowing silk drapery' },
  { id: 'fa-table-runner', name: 'Table Runner', category: 'fabrics', color: '#C5A46D', accent: '#FAF7F2', baseCost: 1800, icon: 'runner', description: 'Champagne table runner' },
  { id: 'fa-aisle-runner', name: 'Aisle Runner', category: 'fabrics', color: '#FAF7F2', accent: '#E8C7C4', baseCost: 3200, icon: 'aisle', description: 'Ivory aisle fabric' },
  // Props
  { id: 'pr-candles', name: 'Candle Cluster', category: 'props', color: '#FAF7F2', accent: '#C5A46D', baseCost: 2200, icon: 'candle', description: 'Pillar candle grouping' },
  { id: 'pr-urn', name: 'Decorative Urn', category: 'props', color: '#C5A46D', accent: '#243D35', baseCost: 4500, icon: 'urn', description: 'Gold-tone decorative urn' },
  { id: 'pr-signage', name: 'Welcome Sign', category: 'props', color: '#243D35', accent: '#C5A46D', baseCost: 2800, icon: 'sign', description: 'Custom welcome signage' },
  { id: 'pr-mirror', name: 'Vintage Mirror', category: 'props', color: '#C5A46D', accent: '#FAF7F2', baseCost: 6500, icon: 'mirror', description: 'Ornate mirror prop' },
];

export const CATEGORY_LABELS: Record<LibraryItem['category'], string> = {
  flowers: 'Flowers',
  backdrops: 'Backdrops',
  furniture: 'Furniture',
  lighting: 'Lighting',
  fabrics: 'Fabrics',
  props: 'Props',
};

export function getLibraryItem(id: string): LibraryItem | undefined {
  return LIBRARY_ITEMS.find((i) => i.id === id);
}
