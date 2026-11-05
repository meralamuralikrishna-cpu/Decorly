import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppShell } from '@/components/layout/AppShell';
import { Overview } from '@/pages/Overview';
import { DesignStudio } from '@/pages/DesignStudio';
import { ExploreTemplates } from '@/pages/ExploreTemplates';
import { MyDesigns } from '@/pages/MyDesigns';
import { Moodboards } from '@/pages/Moodboards';
import { FindDecorators } from '@/pages/FindDecorators';
import { Bookings } from '@/pages/Bookings';
import { AdminBookings } from '@/pages/AdminBookings';
import { Settings } from '@/pages/Settings';
import { ShareView } from '@/pages/ShareView';
import { Auth } from '@/pages/Auth';
export default function App() {
    return (<AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="share/:shareId" element={<ShareView />}/>
            <Route path="login" element={<Auth />}/>
            <Route element={<AppShell />}>
              <Route index element={<Overview />}/>
              <Route path="studio" element={<DesignStudio />}/>
              <Route path="templates" element={<ExploreTemplates />}/>
              <Route path="designs" element={<MyDesigns />}/>
              <Route path="moodboards" element={<Moodboards />}/>
              <Route path="decorators" element={<FindDecorators />}/>
              <Route path="bookings" element={<Bookings />}/>
              <Route path="admin" element={<AdminBookings />}/>
              <Route path="admin/bookings" element={<Navigate to="/admin" replace />}/>
              <Route path="settings" element={<Settings />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>);
}
