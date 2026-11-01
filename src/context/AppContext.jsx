import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode, } from 'react';
import { loadJSON, saveJSON, StorageKeys } from '@/lib/storage';
import { DEMO_MOODBOARDS, DEMO_BOOKINGS, DEMO_BUDGET, DEMO_NOTIFICATIONS, DEFAULT_PROFILE, SEED_DESIGNS, } from '@/data/mock';
const AppContext = createContext(null);
export function AppProvider({ children }) {
    const [locale, setLocaleState] = useState(() => loadJSON(StorageKeys.locale, 'en'));
    const [sidebarCollapsed, setSidebarCollapsedState] = useState(() => loadJSON(StorageKeys.sidebarCollapsed, false));
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [designs, setDesigns] = useState(() => {
        const loaded = loadJSON(StorageKeys.designs, SEED_DESIGNS);
        if (!loaded.length)
            return SEED_DESIGNS;
        const ids = new Set(loaded.map((d) => d.id));
        const missing = SEED_DESIGNS.filter((s) => !ids.has(s.id));
        return missing.length ? [...loaded, ...missing] : loaded;
    });
    const [moodboards, setMoodboards] = useState(() => loadJSON(StorageKeys.moodboards, DEMO_MOODBOARDS));
    const [bookings, setBookings] = useState(() => loadJSON(StorageKeys.bookings, DEMO_BOOKINGS));
    const [budget, setBudgetState] = useState(() => loadJSON(StorageKeys.budget, DEMO_BUDGET));
    const [notifications, setNotifications] = useState(() => loadJSON(StorageKeys.notifications, DEMO_NOTIFICATIONS));
    const [profile, setProfileState] = useState(() => loadJSON(StorageKeys.profile, DEFAULT_PROFILE));
    const [templateFavorites, setTemplateFavorites] = useState(() => loadJSON(StorageKeys.favorites + ':templates', []));
    const [decoratorFavorites, setDecoratorFavorites] = useState(() => loadJSON(StorageKeys.favorites + ':decorators', []));
    const [activeDesignId, setActiveDesignIdState] = useState(() => loadJSON(StorageKeys.activeDesignId, null));
    useEffect(() => saveJSON(StorageKeys.locale, locale), [locale]);
    useEffect(() => saveJSON(StorageKeys.sidebarCollapsed, sidebarCollapsed), [sidebarCollapsed]);
    useEffect(() => saveJSON(StorageKeys.designs, designs), [designs]);
    useEffect(() => saveJSON(StorageKeys.moodboards, moodboards), [moodboards]);
    useEffect(() => saveJSON(StorageKeys.bookings, bookings), [bookings]);
    useEffect(() => saveJSON(StorageKeys.budget, budget), [budget]);
    useEffect(() => saveJSON(StorageKeys.notifications, notifications), [notifications]);
    useEffect(() => saveJSON(StorageKeys.profile, profile), [profile]);
    useEffect(() => saveJSON(StorageKeys.favorites + ':templates', templateFavorites), [templateFavorites]);
    useEffect(() => saveJSON(StorageKeys.favorites + ':decorators', decoratorFavorites), [decoratorFavorites]);
    useEffect(() => saveJSON(StorageKeys.activeDesignId, activeDesignId), [activeDesignId]);
    const setLocale = useCallback((l) => {
        setLocaleState(l);
        setProfileState((p) => ({ ...p, preferredLanguage: l }));
    }, []);
    const setSidebarCollapsed = useCallback((v) => setSidebarCollapsedState(v), []);
    const saveDesign = useCallback((d) => {
        setDesigns((prev) => {
            const idx = prev.findIndex((x) => x.id === d.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = d;
                return next;
            }
            return [d, ...prev];
        });
    }, []);
    const deleteDesign = useCallback((id) => {
        setDesigns((prev) => prev.filter((d) => d.id !== id));
    }, []);
    const toggleDesignFavorite = useCallback((id) => {
        setDesigns((prev) => prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)));
    }, []);
    const saveMoodboard = useCallback((m) => {
        setMoodboards((prev) => {
            const idx = prev.findIndex((x) => x.id === m.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = m;
                return next;
            }
            return [m, ...prev];
        });
    }, []);
    const deleteMoodboard = useCallback((id) => {
        setMoodboards((prev) => prev.filter((m) => m.id !== id));
    }, []);
    const toggleMoodboardFavorite = useCallback((id) => {
        setMoodboards((prev) => prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m)));
    }, []);
    const saveBooking = useCallback((b) => {
        setBookings((prev) => {
            const idx = prev.findIndex((x) => x.id === b.id);
            if (idx >= 0) {
                const next = [...prev];
                next[idx] = b;
                return next;
            }
            return [b, ...prev];
        });
    }, []);
    const deleteBooking = useCallback((id) => {
        setBookings((prev) => prev.filter((b) => b.id !== id));
    }, []);
    const setBudget = useCallback((b) => setBudgetState(b), []);
    const markNotificationRead = useCallback((id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }, []);
    const markAllNotificationsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }, []);
    const setProfile = useCallback((p) => setProfileState(p), []);
    const toggleTemplateFavorite = useCallback((id) => {
        setTemplateFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    }, []);
    const toggleDecoratorFavorite = useCallback((id) => {
        setDecoratorFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    }, []);
    const setActiveDesignId = useCallback((id) => setActiveDesignIdState(id), []);
    const value = useMemo(() => ({
        locale,
        setLocale,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileNavOpen,
        setMobileNavOpen,
        designs,
        saveDesign,
        deleteDesign,
        toggleDesignFavorite,
        moodboards,
        saveMoodboard,
        deleteMoodboard,
        toggleMoodboardFavorite,
        bookings,
        saveBooking,
        deleteBooking,
        budget,
        setBudget,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        profile,
        setProfile,
        templateFavorites,
        toggleTemplateFavorite,
        decoratorFavorites,
        toggleDecoratorFavorite,
        activeDesignId,
        setActiveDesignId,
    }), [
        locale,
        setLocale,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileNavOpen,
        designs,
        saveDesign,
        deleteDesign,
        toggleDesignFavorite,
        moodboards,
        saveMoodboard,
        deleteMoodboard,
        toggleMoodboardFavorite,
        bookings,
        saveBooking,
        deleteBooking,
        budget,
        setBudget,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        profile,
        setProfile,
        templateFavorites,
        toggleTemplateFavorite,
        decoratorFavorites,
        toggleDecoratorFavorite,
        activeDesignId,
        setActiveDesignId,
    ]);
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx)
        throw new Error('useApp must be used within AppProvider');
    return ctx;
}
