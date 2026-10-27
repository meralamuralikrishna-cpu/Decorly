import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/brand/BrandMark';

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
        'relative flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-sage/35 bg-white/40 overflow-hidden',
        className,
      )}
    >
      <BrandMark
        tone="ink"
        className="absolute -right-6 -bottom-4 h-36 w-auto opacity-[0.06] pointer-events-none"
      />
      {icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage/15 text-sage relative">
          {icon}
        </div>
      ) : (
        <BrandMark tone="ink" className="h-16 w-auto mb-5 opacity-45 relative" />
      )}
      <h3 className="font-display text-2xl text-forest mb-2 tracking-tight relative">{title}</h3>
      {description && (
        <p className="text-sm text-charcoal/60 max-w-sm mb-6 leading-relaxed relative">{description}</p>
      )}
      <div className="relative">{action}</div>
    </div>
  );
}
