import type { CanvasElement, StudioSettings } from '@/types';
import { getLibraryItem } from '@/data/library';

/** Deterministic illustrative estimate — not a real quote */
export function estimateBudget(
  elements: CanvasElement[],
  settings: StudioSettings,
): number {
  const base = elements.reduce((sum, el) => {
    const item = getLibraryItem(el.libraryId);
    const cost = item?.baseCost ?? 2000;
    const areaFactor = (el.width * el.height) / (120 * 120);
    return sum + cost * Math.max(0.5, Math.min(2, areaFactor));
  }, 0);

  const densityMult = 0.85 + (settings.flowerDensity / 100) * 0.4;
  const lightMult = 0.9 + (settings.lightingIntensity / 100) * 0.35;
  const styleMult: Record<StudioSettings['arrangementStyle'], number> = {
    minimal: 0.85,
    symmetrical: 1,
    asymmetric: 1.08,
    cascade: 1.15,
  };

  const themeMult: Record<StudioSettings['themeId'], number> = {
    'blush-romance': 1.05,
    'ivory-elegance': 1,
    'sage-garden': 0.98,
    'royal-gold': 1.25,
    'traditional-marigold': 1.1,
  };

  const total =
    base *
    densityMult *
    lightMult *
    styleMult[settings.arrangementStyle] *
    themeMult[settings.themeId];

  // Round to nearest 500 for a clean illustrative figure
  return Math.round(total / 500) * 500 || 5000;
}
