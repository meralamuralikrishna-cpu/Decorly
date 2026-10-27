import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-sage/50 bg-white/40',
        className,
      )}
    >
      {icon && <div className="mb-4 text-sage">{icon}</div>}
      <h3 className="font-display text-2xl text-forest mb-2">{title}</h3>
      {description && <p className="text-sm text-charcoal/60 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
