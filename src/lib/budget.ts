import type {
  BudgetCategory,
  BudgetPlan,
  CanvasElement,
  LibraryCategory,
  StudioSettings,
} from '@/types';
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

const CATEGORY_TO_BUDGET: Record<LibraryCategory, string> = {
  flowers: 'cat-flowers',
  backdrops: 'cat-backdrop',
  lighting: 'cat-lighting',
  furniture: 'cat-furniture',
  fabrics: 'cat-fabrics',
  props: 'cat-misc',
};

/** Break a design estimate into budget category planned amounts. */
export function estimateByCategory(
  elements: CanvasElement[],
  settings: StudioSettings,
): Record<string, number> {
  const totals: Record<string, number> = {};
  const densityMult = 0.85 + (settings.flowerDensity / 100) * 0.4;
  const lightMult = 0.9 + (settings.lightingIntensity / 100) * 0.35;

  for (const el of elements) {
    const item = getLibraryItem(el.libraryId);
    const cost = item?.baseCost ?? 2000;
    const areaFactor = (el.width * el.height) / (120 * 120);
    const amount = cost * Math.max(0.5, Math.min(2, areaFactor)) * densityMult * lightMult;
    const catId = CATEGORY_TO_BUDGET[el.category] ?? 'cat-misc';
    totals[catId] = (totals[catId] ?? 0) + amount;
  }

  const rounded: Record<string, number> = {};
  for (const [id, val] of Object.entries(totals)) {
    rounded[id] = Math.round(val / 500) * 500;
  }
  return rounded;
}

/** Apply a studio design estimate onto an existing budget plan (planned columns). */
export function applyDesignToBudget(
  plan: BudgetPlan,
  elements: CanvasElement[],
  settings: StudioSettings,
  designName: string,
): BudgetPlan {
  const byCat = estimateByCategory(elements, settings);
  const total = estimateBudget(elements, settings);
  const categories: BudgetCategory[] = plan.categories.map((c) => ({
    ...c,
    planned: byCat[c.id] ?? c.planned,
  }));

  // If some category ids from estimate are missing, leave as-is
  const plannedSum = categories.reduce((s, c) => s + c.planned, 0);

  return {
    ...plan,
    eventName: designName.trim() || plan.eventName,
    totalBudget: Math.max(plan.totalBudget, total, plannedSum),
    categories,
    updatedAt: new Date().toISOString(),
  };
}
