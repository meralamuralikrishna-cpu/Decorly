import type { ThemeId, StudioSettings } from '@/types';

export interface ThemePreset {
  id: ThemeId;
  name: string;
  description: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    backdrop: string;
    platform: string;
  };
  defaultSettings: Partial<StudioSettings>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'blush-romance',
    name: 'Blush Romance',
    description: 'Soft blush florals with champagne accents',
    palette: {
      primary: '#E8C7C4',
      secondary: '#FAF7F2',
      accent: '#C5A46D',
      backdrop: '#F3E6E4',
      platform: '#D4C4B0',
    },
    defaultSettings: { flowerDensity: 70, lightingIntensity: 60, arrangementStyle: 'cascade' },
  },
  {
    id: 'ivory-elegance',
    name: 'Ivory Elegance',
    description: 'Clean ivory tones with soft sage greenery',
    palette: {
      primary: '#FAF7F2',
      secondary: '#A8B5A0',
      accent: '#C5A46D',
      backdrop: '#F5F1EA',
      platform: '#E8E2D6',
    },
    defaultSettings: { flowerDensity: 45, lightingIntensity: 50, arrangementStyle: 'symmetrical' },
  },
  {
    id: 'sage-garden',
    name: 'Sage Garden',
    description: 'Lush garden greens with natural textures',
    palette: {
      primary: '#A8B5A0',
      secondary: '#243D35',
      accent: '#C5A46D',
      backdrop: '#E4EBE0',
      platform: '#C5CBB8',
    },
    defaultSettings: { flowerDensity: 80, lightingIntensity: 45, arrangementStyle: 'asymmetric' },
  },
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    description: 'Deep forest with rich champagne gold',
    palette: {
      primary: '#C5A46D',
      secondary: '#243D35',
      accent: '#E8C7C4',
      backdrop: '#2F4A40',
      platform: '#3D5A4E',
    },
    defaultSettings: { flowerDensity: 55, lightingIntensity: 75, arrangementStyle: 'symmetrical' },
  },
  {
    id: 'traditional-marigold',
    name: 'Traditional Marigold',
    description: 'Festive marigold and warm ivory tradition',
    palette: {
      primary: '#E8A838',
      secondary: '#FAF7F2',
      accent: '#C45C26',
      backdrop: '#F7EBD4',
      platform: '#E0C89A',
    },
    defaultSettings: { flowerDensity: 90, lightingIntensity: 65, arrangementStyle: 'cascade' },
  },
];

export function getTheme(id: ThemeId): ThemePreset {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0];
}

export const DEFAULT_SETTINGS: StudioSettings = {
  themeId: 'blush-romance',
  flowerDensity: 65,
  lightingIntensity: 55,
  arrangementStyle: 'cascade',
};
