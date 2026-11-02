import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_MOODBOARDS, DEMO_BOOKINGS, DEMO_BUDGET, DEMO_NOTIFICATIONS, DEFAULT_PROFILE, SEED_DESIGNS, } from '@/data/mock';
import { supabase } from '@/lib/supabase';
const AppContext = createContext(null);
export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [offlineDemo, setOfflineDemo] = useState(false);
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
    const [locale, setLocaleState] = useState('en');
    const [sidebarCollapsed, setSidebarCollapsedState] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [designs, setDesigns] = useState(SEED_DESIGNS);
    const [moodboards, setMoodboards] = useState(DEMO_MOODBOARDS);
    const [bookings, setBookings] = useState(DEMO_BOOKINGS);
    const [budget, setBudgetState] = useState(DEMO_BUDGET);
    const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
    const [profile, setProfileState] = useState(DEFAULT_PROFILE);
    const [templateFavorites, setTemplateFavorites] = useState([]);
    const [decoratorFavorites, setDecoratorFavorites] = useState([]);
    const [activeDesignId, setActiveDesignIdState] = useState(null);
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
                setDesigns(p.designs ?? SEED_DESIGNS);
                setMoodboards(p.moodboards ?? DEMO_MOODBOARDS);
                setBookings(p.bookings ?? DEMO_BOOKINGS);
                setBudgetState(p.budget ?? DEMO_BUDGET);
                setProfileState({ ...DEFAULT_PROFILE, ...p.profile, email: user.email ?? p.profile?.email ?? DEFAULT_PROFILE.email });
                setTemplateFavorites(p.templateFavorites ?? []);
                setDecoratorFavorites(p.decoratorFavorites ?? []);
                setLocaleState(p.locale ?? 'en');
                setNotifications(p.notifications ?? DEMO_NOTIFICATIONS);
                setActiveDesignIdState(p.activeDesignId ?? null);
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
    const enterOfflineDemo = useCallback(() => setOfflineDemo(true), []);
    const leaveOfflineDemo = useCallback(() => setOfflineDemo(false), []);
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
        canSaveData: !!supabase && !!user && !offlineDemo,
        offlineDemo,
        enterOfflineDemo,
        leaveOfflineDemo,
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
        offlineDemo,
        enterOfflineDemo,
        leaveOfflineDemo,
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
