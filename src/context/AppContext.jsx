import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadJSON, saveJSON, StorageKeys } from '@/lib/storage';
import { DEMO_MOODBOARDS, DEMO_BOOKINGS, DEMO_BUDGET, DEMO_NOTIFICATIONS, DEFAULT_PROFILE, SEED_DESIGNS, } from '@/data/mock';
import { supabase } from '@/lib/supabase';
const AppContext = createContext(null);
export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authReady, setAuthReady] = useState(!supabase);
    const [cloudReady, setCloudReady] = useState(false);
    useEffect(() => {
        if (!supabase) return;
        let alive = true;
        supabase.auth.getSession().then(({ data }) => { if (alive) { setUser(data.session?.user ?? null); setAuthReady(true); } });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session) setCloudReady(false);
        });
        return () => { alive = false; listener.subscription.unsubscribe(); };
    }, []);
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
    useEffect(() => {
        if (!supabase || !user) { setCloudReady(false); return; }
        let alive = true;
        setCloudReady(false);
        (async () => {
            const { data, error } = await supabase.from('user_data').select('payload').eq('user_id', user.id).maybeSingle();
            if (!alive) return;
            if (error) { console.error('Could not load account data', error); setCloudReady(true); return; }
            const p = data?.payload;
            if (p) {
                if (p.designs) setDesigns(p.designs);
                if (p.moodboards) setMoodboards(p.moodboards);
                if (p.bookings) setBookings(p.bookings);
                if (p.budget) setBudgetState(p.budget);
                if (p.profile) setProfileState({ ...DEFAULT_PROFILE, ...p.profile, email: user.email ?? p.profile.email });
                else setProfileState((old) => ({ ...old, email: user.email ?? old.email }));
                if (p.templateFavorites) setTemplateFavorites(p.templateFavorites);
                if (p.decoratorFavorites) setDecoratorFavorites(p.decoratorFavorites);
                if (p.locale) setLocaleState(p.locale);
                if (p.notifications) setNotifications(p.notifications);
                if (p.activeDesignId) setActiveDesignIdState(p.activeDesignId);
            } else {
                setDesigns(SEED_DESIGNS);
                setMoodboards(DEMO_MOODBOARDS);
                setBookings(DEMO_BOOKINGS);
                setBudgetState(DEMO_BUDGET);
                setNotifications(DEMO_NOTIFICATIONS);
                setTemplateFavorites([]);
                setDecoratorFavorites([]);
                setActiveDesignIdState(null);
                setProfileState({ ...DEFAULT_PROFILE, name: user.user_metadata?.name || DEFAULT_PROFILE.name, email: user.email ?? DEFAULT_PROFILE.email });
            }
            setCloudReady(true);
        })();
        return () => { alive = false; };
    }, [user?.id]);
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
    useEffect(() => {
        if (!supabase || !user || !cloudReady) return;
        const payload = { designs, moodboards, bookings, budget, profile, templateFavorites, decoratorFavorites, locale, notifications, activeDesignId };
        const timer = setTimeout(async () => {
            const { error } = await supabase.from('user_data').upsert({ user_id: user.id, payload, updated_at: new Date().toISOString() });
            if (error) console.error('Could not save account data', error);
        }, 500);
        return () => clearTimeout(timer);
    }, [user?.id, cloudReady, designs, moodboards, bookings, budget, profile, templateFavorites, decoratorFavorites, locale, notifications, activeDesignId]);
    const signIn = useCallback(async (email, password) => {
        if (!supabase) return { error: 'Account sign-in is unavailable. Configure the Supabase URL and publishable key, then restart the app.' };
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { session: data.session, error: error?.message };
    }, []);
    const signUp = useCallback(async (email, password, name) => {
        if (!supabase) return { error: 'Account creation is unavailable. Configure the Supabase URL and publishable key, then restart the app.' };
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
                emailRedirectTo: `${window.location.origin}/`,
            },
        });
        return { session: data.session, error: error?.message };
    }, []);
    const signOut = useCallback(async () => { if (supabase) await supabase.auth.signOut(); }, []);
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
        user,
        authReady,
        cloudReady,
        authEnabled: !!supabase,
        signIn,
        signUp,
        signOut,
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
        user,
        authReady,
        cloudReady,
        signIn,
        signUp,
        signOut,
    ]);
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx)
        throw new Error('useApp must be used within AppProvider');
    return ctx;
}
