import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import type {
  Locale,
  Design,
  MoodboardItem,
  Booking,
  BudgetPlan,
  AppNotification,
  UserProfile,
} from '@/types';
import { loadJSON, saveJSON, StorageKeys } from '@/lib/storage';
import {
  DEMO_MOODBOARDS,
  DEMO_BOOKINGS,
  DEMO_BUDGET,
  DEMO_NOTIFICATIONS,
  DEFAULT_PROFILE,
  SEED_DESIGN,
} from '@/data/mock';

interface AppContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean) => void;
  designs: Design[];
  saveDesign: (d: Design) => void;
  deleteDesign: (id: string) => void;
  toggleDesignFavorite: (id: string) => void;
  moodboards: MoodboardItem[];
  saveMoodboard: (m: MoodboardItem) => void;
  deleteMoodboard: (id: string) => void;
  toggleMoodboardFavorite: (id: string) => void;
  bookings: Booking[];
  saveBooking: (b: Booking) => void;
  deleteBooking: (id: string) => void;
  budget: BudgetPlan;
  setBudget: (b: BudgetPlan) => void;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  templateFavorites: string[];
  toggleTemplateFavorite: (id: string) => void;
  decoratorFavorites: string[];
  toggleDecoratorFavorite: (id: string) => void;
  activeDesignId: string | null;
  setActiveDesignId: (id: string | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    loadJSON(StorageKeys.locale, 'en' as Locale),
  );
  const [sidebarCollapsed, setSidebarCollapsedState] = useState(() =>
    loadJSON(StorageKeys.sidebarCollapsed, false),
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [designs, setDesigns] = useState<Design[]>(() =>
    loadJSON(StorageKeys.designs, [SEED_DESIGN]),
  );
  const [moodboards, setMoodboards] = useState<MoodboardItem[]>(() =>
    loadJSON(StorageKeys.moodboards, DEMO_MOODBOARDS),
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    loadJSON(StorageKeys.bookings, DEMO_BOOKINGS),
  );
  const [budget, setBudgetState] = useState<BudgetPlan>(() =>
    loadJSON(StorageKeys.budget, DEMO_BUDGET),
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadJSON(StorageKeys.notifications, DEMO_NOTIFICATIONS),
  );
  const [profile, setProfileState] = useState<UserProfile>(() =>
    loadJSON(StorageKeys.profile, DEFAULT_PROFILE),
  );
  const [templateFavorites, setTemplateFavorites] = useState<string[]>(() =>
    loadJSON(StorageKeys.favorites + ':templates', [] as string[]),
  );
  const [decoratorFavorites, setDecoratorFavorites] = useState<string[]>(() =>
    loadJSON(StorageKeys.favorites + ':decorators', [] as string[]),
  );
  const [activeDesignId, setActiveDesignIdState] = useState<string | null>(() =>
    loadJSON(StorageKeys.activeDesignId, null as string | null),
  );

  useEffect(() => saveJSON(StorageKeys.locale, locale), [locale]);
  useEffect(() => saveJSON(StorageKeys.sidebarCollapsed, sidebarCollapsed), [sidebarCollapsed]);
  useEffect(() => saveJSON(StorageKeys.designs, designs), [designs]);
  useEffect(() => saveJSON(StorageKeys.moodboards, moodboards), [moodboards]);
  useEffect(() => saveJSON(StorageKeys.bookings, bookings), [bookings]);
  useEffect(() => saveJSON(StorageKeys.budget, budget), [budget]);
  useEffect(() => saveJSON(StorageKeys.notifications, notifications), [notifications]);
  useEffect(() => saveJSON(StorageKeys.profile, profile), [profile]);
  useEffect(
    () => saveJSON(StorageKeys.favorites + ':templates', templateFavorites),
    [templateFavorites],
  );
  useEffect(
    () => saveJSON(StorageKeys.favorites + ':decorators', decoratorFavorites),
    [decoratorFavorites],
  );
  useEffect(() => saveJSON(StorageKeys.activeDesignId, activeDesignId), [activeDesignId]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    setProfileState((p) => ({ ...p, preferredLanguage: l }));
  }, []);

  const setSidebarCollapsed = useCallback((v: boolean) => setSidebarCollapsedState(v), []);

  const saveDesign = useCallback((d: Design) => {
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

  const deleteDesign = useCallback((id: string) => {
    setDesigns((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const toggleDesignFavorite = useCallback((id: string) => {
    setDesigns((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isFavorite: !d.isFavorite } : d)),
    );
  }, []);

  const saveMoodboard = useCallback((m: MoodboardItem) => {
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

  const deleteMoodboard = useCallback((id: string) => {
    setMoodboards((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const toggleMoodboardFavorite = useCallback((id: string) => {
    setMoodboards((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m)),
    );
  }, []);

  const saveBooking = useCallback((b: Booking) => {
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

  const deleteBooking = useCallback((id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const setBudget = useCallback((b: BudgetPlan) => setBudgetState(b), []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const setProfile = useCallback((p: UserProfile) => setProfileState(p), []);

  const toggleTemplateFavorite = useCallback((id: string) => {
    setTemplateFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const toggleDecoratorFavorite = useCallback((id: string) => {
    setDecoratorFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const setActiveDesignId = useCallback((id: string | null) => setActiveDesignIdState(id), []);

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
