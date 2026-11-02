import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApp } from '@/context/AppContext';
import { Auth } from '@/pages/Auth';
import { Button } from '@/components/ui/Button';
export function AppShell() {
    const { authEnabled, authReady, cloudReady, user, signOut, offlineDemo, leaveOfflineDemo } = useApp();
    if (authEnabled && !authReady) return <div className="min-h-screen flex items-center justify-center text-forest">Loading Decorly…</div>;
    if (authEnabled && !user && !offlineDemo) return <Auth />;
    if (authEnabled && user && !cloudReady) return <div className="min-h-screen flex items-center justify-center text-forest">Loading your saved workspace…</div>;
    return (<div className="flex min-h-screen app-atmosphere">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {offlineDemo && <div role="status" className="flex flex-wrap items-center justify-center gap-3 bg-amber-100 px-4 py-2 text-center text-xs text-amber-950">Offline demo mode — changes are temporary and won&apos;t be saved.<Button size="sm" variant="secondary" onClick={leaveOfflineDemo}>Return to sign in</Button></div>}
        <Header />
        {authEnabled && <div className="absolute top-20 right-6 z-20"><Button variant="secondary" size="sm" onClick={() => void signOut()}>Sign out</Button></div>}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>);
}
