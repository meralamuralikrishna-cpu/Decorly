import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'info' | 'error';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm"
        aria-live="polite"
        aria-relevant="additions"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-up text-sm',
              item.type === 'success' && 'bg-forest text-ivory border-forest',
              item.type === 'info' && 'bg-white text-charcoal border-sage/40',
              item.type === 'error' && 'bg-red-50 text-red-900 border-red-200',
            )}
            role="status"
          >
            {item.type === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />}
            {item.type === 'info' && <Info className="h-4 w-4 shrink-0 mt-0.5 text-champagne" />}
            {item.type === 'error' && <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
            <span className="flex-1">{item.message}</span>
            <button
              type="button"
              className="opacity-60 hover:opacity-100"
              aria-label="Dismiss"
              onClick={() => setItems((prev) => prev.filter((t) => t.id !== item.id))}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
