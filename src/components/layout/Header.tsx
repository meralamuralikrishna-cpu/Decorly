import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { cn, formatDate } from '@/lib/utils';

export function Header() {
  const {
    locale,
    setLocale,
    setMobileNavOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    profile,
  } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-16 bg-ivory/90 backdrop-blur border-b border-sage/30 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <p className="hidden sm:block text-sm text-charcoal/50 font-display text-lg tracking-wide">
          {t(locale, 'tagline')}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div
          role="group"
          aria-label={t(locale, 'language')}
          className="flex rounded-xl border border-sage/40 overflow-hidden bg-white"
        >
          <button
            type="button"
            className={cn(
              'px-3 h-9 text-xs font-medium transition',
              locale === 'en' ? 'bg-forest text-ivory' : 'text-charcoal/70 hover:bg-sage/20',
            )}
            onClick={() => setLocale('en')}
            aria-pressed={locale === 'en'}
          >
            EN
          </button>
          <button
            type="button"
            className={cn(
              'px-3 h-9 text-xs font-medium transition',
              locale === 'te' ? 'bg-forest text-ivory' : 'text-charcoal/70 hover:bg-sage/20',
            )}
            onClick={() => setLocale('te')}
            aria-pressed={locale === 'te'}
          >
            తెలుగు
          </button>
        </div>

        <div className="relative" ref={notifRef}>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t(locale, 'notifications')}
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell className="h-4.5 w-4.5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blush ring-2 ring-ivory" />
            )}
          </Button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-sage/40 shadow-xl animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-sage/30">
                <p className="font-display text-lg text-forest">{t(locale, 'notifications')}</p>
                <button
                  type="button"
                  className="text-xs text-champagne hover:underline"
                  onClick={markAllNotificationsRead}
                >
                  Mark all read
                </button>
              </div>
              <ul className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      className={cn(
                        'w-full text-left px-4 py-3 hover:bg-sage/10 transition border-b border-sage/20',
                        !n.read && 'bg-blush/10',
                      )}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <p className="text-sm font-medium text-charcoal">{n.title}</p>
                      <p className="text-xs text-charcoal/60 mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-charcoal/40 mt-1">{formatDate(n.createdAt)}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t(locale, 'profile')}
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((v) => !v)}
          >
            <User className="h-4.5 w-4.5" />
          </Button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-sage/40 shadow-xl animate-scale-in p-4">
              <p className="font-medium text-sm text-forest">{profile.name}</p>
              <p className="text-xs text-charcoal/50 mt-0.5">{profile.email}</p>
              <p className="text-xs text-charcoal/50">{profile.city}</p>
              <p className="text-[10px] text-champagne mt-3 uppercase tracking-wider">Local profile</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
