import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  LayoutTemplate,
  Palette,
  FolderHeart,
  Images,
  Wallet,
  Search,
  CalendarDays,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flower2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { NavId } from '@/types';

const NAV: { id: NavId; path: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', path: '/', icon: LayoutDashboard },
  { id: 'templates', path: '/templates', icon: LayoutTemplate },
  { id: 'studio', path: '/studio', icon: Palette },
  { id: 'designs', path: '/designs', icon: FolderHeart },
  { id: 'moodboards', path: '/moodboards', icon: Images },
  { id: 'budget', path: '/budget', icon: Wallet },
  { id: 'decorators', path: '/decorators', icon: Search },
  { id: 'bookings', path: '/bookings', icon: CalendarDays },
  { id: 'settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { locale, sidebarCollapsed, setSidebarCollapsed, mobileNavOpen, setMobileNavOpen } =
    useApp();

  const content = (
    <div className="flex flex-col h-full">
      <div
        className={cn(
          'flex items-center gap-3 px-4 h-16 border-b border-white/10',
          sidebarCollapsed && 'justify-center px-2',
        )}
      >
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-champagne/20 text-champagne shrink-0">
          <Flower2 className="h-5 w-5" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <p className="font-display text-xl text-ivory leading-tight truncate">
              {t(locale, 'brand')}
            </p>
            <p className="text-[10px] text-sage tracking-wide truncate">{t(locale, 'tagline')}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5" aria-label="Main">
        {NAV.map(({ id, path, icon: Icon }) => (
          <NavLink
            key={id}
            to={path}
            end={path === '/'}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                sidebarCollapsed && 'justify-center px-2',
                isActive
                  ? 'bg-white/15 text-ivory'
                  : 'text-sage hover:bg-white/10 hover:text-ivory',
              )
            }
            title={t(locale, id)}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden />
            {!sidebarCollapsed && <span>{t(locale, id)}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="hidden md:flex p-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center w-full h-9 rounded-xl text-sage hover:bg-white/10 hover:text-ivory transition"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-forest text-ivory shrink-0 transition-all duration-300 h-screen sticky top-0',
          sidebarCollapsed ? 'w-[72px]' : 'w-60',
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-charcoal/50"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-forest animate-fade-in shadow-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
