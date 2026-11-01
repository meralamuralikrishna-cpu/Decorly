const PREFIX = 'decorly:';
export function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(PREFIX + key);
        if (!raw)
            return fallback;
        return JSON.parse(raw);
    }
    catch {
        return fallback;
    }
}
export function saveJSON(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
}
export function removeKey(key) {
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
};
