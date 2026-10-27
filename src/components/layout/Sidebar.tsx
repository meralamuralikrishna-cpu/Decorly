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
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BrandMarkIcon } from '@/components/brand/BrandMark';
import { Wordmark } from '@/components/brand/Wordmark';
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
    <div className="flex flex-col h-full relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 90% 55% at 0% 0%, rgba(168,91,95,0.4), transparent 55%), radial-gradient(ellipse 70% 45% at 100% 100%, rgba(126,154,140,0.3), transparent 50%)',
        }}
      />
      <BrandMarkIcon
        tone="soft"
        className="pointer-events-none absolute -right-4 bottom-24 h-36 w-auto opacity-[0.12]"
      />

      <div
        className={cn(
          'relative flex items-center gap-3 px-4 h-[4.25rem] border-b border-white/8',
          sidebarCollapsed && 'justify-center px-2',
        )}
      >
        <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-white/8 ring-1 ring-white/12 shrink-0">
          <BrandMarkIcon tone="soft" className="h-6 w-8" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0 animate-fade-in">
            <Wordmark text={t(locale, 'brand')} size="sm" light />
            <p className="text-[10px] text-sage/90 tracking-[0.14em] uppercase mt-1.5 truncate font-semibold">
              Studio
            </p>
          </div>
        )}
      </div>

      <nav className="relative flex-1 overflow-y-auto py-4 px-2 space-y-0.5" aria-label="Main">
        {NAV.map(({ id, path, icon: Icon }) => (
          <NavLink
            key={id}
            to={path}
            end={path === '/'}
            onClick={() => setMobileNavOpen(false)}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200',
                sidebarCollapsed && 'justify-center px-2',
                isActive
                  ? 'bg-white/12 text-ivory shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]'
                  : 'text-sage hover:bg-white/8 hover:text-ivory',
              )
            }
            title={t(locale, id)}
          >
            <Icon
              className="h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105"
              aria-hidden
            />
            {!sidebarCollapsed && <span className="font-medium">{t(locale, id)}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="relative hidden md:flex p-3 border-t border-white/8">
        <button
          type="button"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex items-center justify-center w-full h-9 rounded-xl text-sage hover:bg-white/8 hover:text-ivory transition"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'hidden md:flex flex-col bg-forest text-ivory shrink-0 transition-all duration-300 h-screen sticky top-0',
          sidebarCollapsed ? 'w-[72px]' : 'w-60',
        )}
      >
        {content}
      </aside>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-charcoal/50 backdrop-blur-[2px]"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-forest animate-slide-up shadow-2xl">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
