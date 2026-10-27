import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppShell } from '@/components/layout/AppShell';
import { Overview } from '@/pages/Overview';
import { DesignStudio } from '@/pages/DesignStudio';
import { ExploreTemplates } from '@/pages/ExploreTemplates';
import { MyDesigns } from '@/pages/MyDesigns';
import { Moodboards } from '@/pages/Moodboards';
import { BudgetPlanner } from '@/pages/BudgetPlanner';
import { FindDecorators } from '@/pages/FindDecorators';
import { Bookings } from '@/pages/Bookings';
import { Settings } from '@/pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Overview />} />
              <Route path="studio" element={<DesignStudio />} />
              <Route path="templates" element={<ExploreTemplates />} />
              <Route path="designs" element={<MyDesigns />} />
              <Route path="moodboards" element={<Moodboards />} />
              <Route path="budget" element={<BudgetPlanner />} />
              <Route path="decorators" element={<FindDecorators />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}
