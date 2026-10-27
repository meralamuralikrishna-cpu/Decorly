const PREFIX = 'decorly:';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function removeKey(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export const StorageKeys = {
  designs: 'designs',
  favorites: 'favorites',
  moodboards: 'moodboards',
  bookings: 'bookings',
  budget: 'budget',
  profile: 'profile',
  locale: 'locale',
  notifications: 'notifications',
  sidebarCollapsed: 'sidebarCollapsed',
  activeDesignId: 'activeDesignId',
  shares: 'shares',
} as const;
