import type { LibraryItem } from '@/types';

export const LIBRARY_ITEMS: LibraryItem[] = [
  // ── Flowers ──────────────────────────────────────────────
  { id: 'fl-rose-blush', name: 'Blush Rose Cluster', category: 'flowers', color: '#E8C7C4', accent: '#C5A46D', baseCost: 4500, icon: 'rose', description: 'Soft blush rose arrangement' },
  { id: 'fl-rose-red', name: 'Deep Red Roses', category: 'flowers', color: '#9B2C2C', accent: '#C5A46D', baseCost: 4800, icon: 'rose', description: 'Classic red rose mound for mandap & stage' },
  { id: 'fl-ivory-peony', name: 'Ivory Peony Bunch', category: 'flowers', color: '#FAF7F2', accent: '#E8C7C4', baseCost: 5200, icon: 'peony', description: 'Full ivory peonies' },
  { id: 'fl-sage-eucalyptus', name: 'Sage Eucalyptus', category: 'flowers', color: '#A8B5A0', accent: '#243D35', baseCost: 2800, icon: 'leaf', description: 'Trailing eucalyptus greenery' },
  { id: 'fl-marigold', name: 'Marigold Garland', category: 'flowers', color: '#E8A838', accent: '#C45C26', baseCost: 3200, icon: 'marigold', description: 'Traditional marigold strand' },
  { id: 'fl-marigold-bunch', name: 'Marigold Bunch', category: 'flowers', color: '#F0B429', accent: '#C45C26', baseCost: 2400, icon: 'marigold', description: 'Dense marigold posy for entrance & urli' },
  { id: 'fl-orchid', name: 'White Orchid Spray', category: 'flowers', color: '#FFFFFF', accent: '#C5A46D', baseCost: 6800, icon: 'orchid', description: 'Elegant orchid spray' },
  { id: 'fl-orchid-purple', name: 'Purple Orchid Cascade', category: 'flowers', color: '#7B5EA7', accent: '#E8C7C4', baseCost: 7200, icon: 'orchid', description: 'Cascading phalaenopsis in royal purple' },
  { id: 'fl-hydrangea', name: 'Blush Hydrangea', category: 'flowers', color: '#F0D6D3', accent: '#A8B5A0', baseCost: 4900, icon: 'hydrangea', description: 'Rounded hydrangea mound' },
  { id: 'fl-jasmine', name: 'Jasmine Gajra', category: 'flowers', color: '#FAF7F2', accent: '#A8B5A0', baseCost: 1800, icon: 'jasmine', description: 'Fragrant jasmine strand for hair & décor' },
  { id: 'fl-lotus', name: 'Lotus Blooms', category: 'flowers', color: '#E8C7C4', accent: '#C45C26', baseCost: 3600, icon: 'lotus', description: 'Sacred lotus cluster for mandap & urli' },
  { id: 'fl-lily', name: 'White Lily Bunch', category: 'flowers', color: '#FAF7F2', accent: '#C5A46D', baseCost: 4100, icon: 'lily', description: 'Trumpet lilies for elegant stages' },
  { id: 'fl-babys-breath', name: "Baby's Breath Cloud", category: 'flowers', color: '#FAF7F2', accent: '#A8B5A0', baseCost: 2900, icon: 'gypsophila', description: 'Airy gypsophila filler cloud' },
  { id: 'fl-sunflower', name: 'Sunflower Cluster', category: 'flowers', color: '#F0B429', accent: '#243D35', baseCost: 3400, icon: 'sunflower', description: 'Cheerful sunflowers for daytime events' },
  { id: 'fl-tulip', name: 'Tulip Bunch', category: 'flowers', color: '#E8C7C4', accent: '#9B2C2C', baseCost: 5600, icon: 'tulip', description: 'Spring tulip bouquet' },
  { id: 'fl-dahlia', name: 'Dahlia Bloom', category: 'flowers', color: '#C45C6A', accent: '#C5A46D', baseCost: 3800, icon: 'dahlia', description: 'Full layered dahlia statement bloom' },
  { id: 'fl-carnation', name: 'Carnation Spray', category: 'flowers', color: '#F0D6D3', accent: '#E8C7C4', baseCost: 2200, icon: 'carnation', description: 'Budget-friendly carnation spray' },
  { id: 'fl-chrysanthemum', name: 'Chrysanthemum Mound', category: 'flowers', color: '#FAF7F2', accent: '#E8A838', baseCost: 2600, icon: 'mum', description: 'Dense mum mound for stage edges' },
  { id: 'fl-fern', name: 'Fern Greenery', category: 'flowers', color: '#6B8F71', accent: '#243D35', baseCost: 1600, icon: 'fern', description: 'Lush fern filler for bases & aisles' },
  { id: 'fl-cascade', name: 'Cascading Floral Trail', category: 'flowers', color: '#E8C7C4', accent: '#A8B5A0', baseCost: 8500, icon: 'cascade', description: 'Hanging cascade for arches & tables' },
  { id: 'fl-centerpiece', name: 'Tall Centerpiece', category: 'flowers', color: '#E8C7C4', accent: '#C5A46D', baseCost: 6200, icon: 'centerpiece', description: 'Elevated table centerpiece' },
  { id: 'fl-bridal-bouquet', name: 'Bridal Bouquet', category: 'flowers', color: '#FAF7F2', accent: '#E8C7C4', baseCost: 5500, icon: 'bouquet', description: 'Handheld bridal bouquet prop' },
  { id: 'fl-petals', name: 'Rose Petal Scatter', category: 'flowers', color: '#E8C7C4', accent: '#9B2C2C', baseCost: 1200, icon: 'petals', description: 'Scattered petals for aisle & stage' },
  { id: 'fl-pampas', name: 'Pampas Grass', category: 'flowers', color: '#E8D9C0', accent: '#C5A46D', baseCost: 4200, icon: 'pampas', description: 'Boho pampas stems' },
  { id: 'fl-anthurium', name: 'Anthurium Accents', category: 'flowers', color: '#C45C6A', accent: '#243D35', baseCost: 4800, icon: 'anthurium', description: 'Modern tropical anthurium stems' },

  // ── Backdrops ────────────────────────────────────────────
  { id: 'bd-floral-arch', name: 'Floral Arch', category: 'backdrops', color: '#E8C7C4', accent: '#A8B5A0', baseCost: 18000, icon: 'arch', description: 'Classic arched floral frame' },
  { id: 'bd-moon-gate', name: 'Moon Gate Arch', category: 'backdrops', color: '#E8C7C4', accent: '#C5A46D', baseCost: 24000, icon: 'moon', description: 'Circular moon-gate floral frame' },
  { id: 'bd-draped-curtain', name: 'Draped Curtain', category: 'backdrops', color: '#FAF7F2', accent: '#C5A46D', baseCost: 9500, icon: 'curtain', description: 'Soft fabric curtain backdrop' },
  { id: 'bd-mandap', name: 'Mandap Frame', category: 'backdrops', color: '#C5A46D', accent: '#E8A838', baseCost: 35000, icon: 'mandap', description: 'Traditional mandap structure' },
  { id: 'bd-garden-wall', name: 'Garden Wall', category: 'backdrops', color: '#A8B5A0', accent: '#243D35', baseCost: 22000, icon: 'wall', description: 'Living greenery wall' },
  { id: 'bd-pampas-wall', name: 'Pampas Wall', category: 'backdrops', color: '#E8D9C0', accent: '#C5A46D', baseCost: 28000, icon: 'wall', description: 'Boho dried-grass photo wall' },
  { id: 'bd-balloon-arch', name: 'Balloon Arch', category: 'backdrops', color: '#E8C7C4', accent: '#C5A46D', baseCost: 12000, icon: 'balloon', description: 'Organic balloon arch for entrance' },
  { id: 'bd-photo-wall', name: 'Photo Wall', category: 'backdrops', color: '#FAF7F2', accent: '#243D35', baseCost: 15000, icon: 'photo', description: 'Grid photo / polaroid display wall' },
  { id: 'bd-toran', name: 'Floral Toran', category: 'backdrops', color: '#E8A838', accent: '#9B2C2C', baseCost: 4500, icon: 'toran', description: 'Doorway marigold & mango-leaf toran' },
  { id: 'bd-jaali', name: 'Jaali Screen', category: 'backdrops', color: '#C5A46D', accent: '#243D35', baseCost: 16000, icon: 'jaali', description: 'Decorative lattice / jaali panel' },
  { id: 'bd-stage-panel', name: 'Stage Backdrop Panel', category: 'backdrops', color: '#243D35', accent: '#C5A46D', baseCost: 20000, icon: 'panel', description: 'Solid stage panel with trim' },
  { id: 'bd-neon-frame', name: 'Neon Backdrop Frame', category: 'backdrops', color: '#E8C7C4', accent: '#FAF7F2', baseCost: 18000, icon: 'neon', description: 'LED neon script backdrop frame' },

  // ── Furniture ────────────────────────────────────────────
  { id: 'fu-stage', name: 'Stage Platform', category: 'furniture', color: '#D4C4B0', accent: '#C5A46D', baseCost: 12000, icon: 'stage', description: 'Raised stage platform' },
  { id: 'fu-loveseat', name: 'Couple Loveseat', category: 'furniture', color: '#E8C7C4', accent: '#C5A46D', baseCost: 7500, icon: 'sofa', description: 'Upholstered sweetheart seat' },
  { id: 'fu-throne', name: 'Throne Chairs', category: 'furniture', color: '#C5A46D', accent: '#E8A838', baseCost: 9000, icon: 'throne', description: 'Pair of ornate couple thrones' },
  { id: 'fu-chiavari', name: 'Chiavari Chair Row', category: 'furniture', color: '#C5A46D', accent: '#FAF7F2', baseCost: 3500, icon: 'chair', description: 'Gold chiavari guest seating' },
  { id: 'fu-round-table', name: 'Round Banquet Table', category: 'furniture', color: '#FAF7F2', accent: '#C5A46D', baseCost: 2800, icon: 'table', description: 'Guest round table (cloth separate)' },
  { id: 'fu-cake-table', name: 'Cake Table', category: 'furniture', color: '#FAF7F2', accent: '#E8C7C4', baseCost: 2200, icon: 'table', description: 'Small round cake display table' },
  { id: 'fu-cocktail', name: 'Cocktail High Table', category: 'furniture', color: '#243D35', accent: '#C5A46D', baseCost: 1800, icon: 'cocktail', description: 'Standing cocktail table' },
  { id: 'fu-pedestal', name: 'Column Pedestal', category: 'furniture', color: '#FAF7F2', accent: '#C5A46D', baseCost: 3500, icon: 'pedestal', description: 'Classic display pedestal' },
  { id: 'fu-aisle-stand', name: 'Aisle Stand', category: 'furniture', color: '#A8B5A0', accent: '#243D35', baseCost: 2800, icon: 'stand', description: 'Aisle floral stand' },
  { id: 'fu-bench', name: 'Garden Bench', category: 'furniture', color: '#A8B5A0', accent: '#243D35', baseCost: 4200, icon: 'bench', description: 'Wooden garden bench seating' },
  { id: 'fu-bar-cart', name: 'Bar Cart', category: 'furniture', color: '#C5A46D', accent: '#243D35', baseCost: 5500, icon: 'bar', description: 'Mobile bar / welcome drinks cart' },

  // ── Lighting ─────────────────────────────────────────────
  { id: 'li-string-lights', name: 'String Lights', category: 'lighting', color: '#C5A46D', accent: '#FAF7F2', baseCost: 4200, icon: 'string', description: 'Warm fairy string lights' },
  { id: 'li-fairy-canopy', name: 'Fairy Light Canopy', category: 'lighting', color: '#C5A46D', accent: '#FAF7F2', baseCost: 9800, icon: 'canopy', description: 'Ceiling mesh of fairy lights' },
  { id: 'li-chandeliers', name: 'Crystal Chandelier', category: 'lighting', color: '#FAF7F2', accent: '#C5A46D', baseCost: 15000, icon: 'chandelier', description: 'Hanging crystal chandelier' },
  { id: 'li-uplights', name: 'Uplight Wash', category: 'lighting', color: '#E8C7C4', accent: '#C5A46D', baseCost: 6000, icon: 'uplight', description: 'Soft color uplighting' },
  { id: 'li-lanterns', name: 'Hanging Lanterns', category: 'lighting', color: '#C5A46D', accent: '#243D35', baseCost: 3800, icon: 'lantern', description: 'Decorative hanging lanterns' },
  { id: 'li-candelabra', name: 'Candelabra', category: 'lighting', color: '#C5A46D', accent: '#FAF7F2', baseCost: 4500, icon: 'candelabra', description: 'Tall multi-arm candelabra' },
  { id: 'li-diyas', name: 'Diyas Row', category: 'lighting', color: '#E8A838', accent: '#C45C26', baseCost: 1500, icon: 'diya', description: 'Traditional oil lamp line' },
  { id: 'li-spotlights', name: 'Stage Spotlights', category: 'lighting', color: '#FAF7F2', accent: '#C5A46D', baseCost: 7200, icon: 'spot', description: 'Focused stage spot beams' },
  { id: 'li-neon-sign', name: 'Neon Script Sign', category: 'lighting', color: '#E8C7C4', accent: '#FAF7F2', baseCost: 8500, icon: 'neon', description: 'Custom neon “names” sign' },
  { id: 'li-led-wash', name: 'LED Color Wash', category: 'lighting', color: '#7B5EA7', accent: '#E8C7C4', baseCost: 9000, icon: 'led', description: 'Programmable LED ambience wash' },

  // ── Fabrics ──────────────────────────────────────────────
  { id: 'fa-silk-drape', name: 'Silk Drape', category: 'fabrics', color: '#E8C7C4', accent: '#FAF7F2', baseCost: 5500, icon: 'drape', description: 'Flowing silk drapery' },
  { id: 'fa-ceiling-canopy', name: 'Ceiling Canopy', category: 'fabrics', color: '#FAF7F2', accent: '#E8C7C4', baseCost: 14000, icon: 'canopy', description: 'Overhead fabric canopy swags' },
  { id: 'fa-table-runner', name: 'Table Runner', category: 'fabrics', color: '#C5A46D', accent: '#FAF7F2', baseCost: 1800, icon: 'runner', description: 'Champagne table runner' },
  { id: 'fa-aisle-runner', name: 'Aisle Runner', category: 'fabrics', color: '#FAF7F2', accent: '#E8C7C4', baseCost: 3200, icon: 'aisle', description: 'Ivory aisle fabric' },
  { id: 'fa-chair-sash', name: 'Chair Sashes', category: 'fabrics', color: '#E8C7C4', accent: '#C5A46D', baseCost: 1200, icon: 'sash', description: 'Tied chair sash bows' },
  { id: 'fa-organza', name: 'Organza Overlay', category: 'fabrics', color: '#FAF7F2', accent: '#E8C7C4', baseCost: 2400, icon: 'organza', description: 'Sheer organza table overlay' },
  { id: 'fa-velvet-cloth', name: 'Velvet Tablecloth', category: 'fabrics', color: '#243D35', accent: '#C5A46D', baseCost: 2800, icon: 'velvet', description: 'Rich velvet full cloth' },
  { id: 'fa-dupatta-drape', name: 'Dupatta Drape', category: 'fabrics', color: '#E8C7C4', accent: '#C5A46D', baseCost: 3600, icon: 'dupatta', description: 'Bridal dupatta-style fabric cascade' },

  // ── Props ────────────────────────────────────────────────
  { id: 'pr-candles', name: 'Candle Cluster', category: 'props', color: '#FAF7F2', accent: '#C5A46D', baseCost: 2200, icon: 'candle', description: 'Pillar candle grouping' },
  { id: 'pr-urn', name: 'Decorative Urn', category: 'props', color: '#C5A46D', accent: '#243D35', baseCost: 4500, icon: 'urn', description: 'Gold-tone decorative urn' },
  { id: 'pr-signage', name: 'Welcome Sign', category: 'props', color: '#243D35', accent: '#C5A46D', baseCost: 2800, icon: 'sign', description: 'Custom welcome signage' },
  { id: 'pr-mirror', name: 'Vintage Mirror', category: 'props', color: '#C5A46D', accent: '#FAF7F2', baseCost: 6500, icon: 'mirror', description: 'Ornate mirror prop' },
  { id: 'pr-kalash', name: 'Kalash Set', category: 'props', color: '#C5A46D', accent: '#E8A838', baseCost: 3200, icon: 'kalash', description: 'Ceremonial brass kalash with mango leaves' },
  { id: 'pr-urli', name: 'Flower Urli', category: 'props', color: '#C5A46D', accent: '#E8C7C4', baseCost: 3800, icon: 'urli', description: 'Brass urli bowl with floating blooms' },
  { id: 'pr-rangoli', name: 'Rangoli Accent', category: 'props', color: '#E8A838', accent: '#9B2C2C', baseCost: 1800, icon: 'rangoli', description: 'Floor rangoli / floral mandala' },
  { id: 'pr-balloon-cluster', name: 'Balloon Cluster', category: 'props', color: '#E8C7C4', accent: '#C5A46D', baseCost: 2500, icon: 'balloon', description: 'Floor balloon bouquet' },
  { id: 'pr-floral-hoop', name: 'Floral Hoop', category: 'props', color: '#E8C7C4', accent: '#A8B5A0', baseCost: 4200, icon: 'hoop', description: 'Hanging floral hoop prop' },
  { id: 'pr-cake-stand', name: 'Cake Stand', category: 'props', color: '#FAF7F2', accent: '#C5A46D', baseCost: 2100, icon: 'cake', description: 'Tiered cake / dessert stand' },
  { id: 'pr-birdcage', name: 'Decorative Birdcage', category: 'props', color: '#C5A46D', accent: '#FAF7F2', baseCost: 3600, icon: 'birdcage', description: 'Vintage birdcage card holder' },
  { id: 'pr-gift-table', name: 'Gift Box Stack', category: 'props', color: '#E8C7C4', accent: '#C5A46D', baseCost: 1500, icon: 'gift', description: 'Styled gift / favor boxes' },
  { id: 'pr-number-stand', name: 'Table Number Stand', category: 'props', color: '#243D35', accent: '#C5A46D', baseCost: 800, icon: 'number', description: 'Guest table number holder' },
  { id: 'pr-photo-frame', name: 'Photo Frame Prop', category: 'props', color: '#C5A46D', accent: '#FAF7F2', baseCost: 1900, icon: 'frame', description: 'Gold frame for couple photos' },
  { id: 'pr-confetti', name: 'Confetti Scatter', category: 'props', color: '#C5A46D', accent: '#E8C7C4', baseCost: 900, icon: 'confetti', description: 'Metallic confetti accents' },
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
