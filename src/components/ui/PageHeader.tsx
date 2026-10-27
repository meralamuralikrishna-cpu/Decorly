import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ kicker, title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4 mb-8', className)}>
      <div className="min-w-0">
        {kicker && <p className="section-kicker mb-2">{kicker}</p>}
        <h1 className="font-display text-4xl md:text-[2.75rem] text-forest tracking-tight leading-none">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-charcoal/55 mt-2.5 max-w-lg leading-relaxed">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
