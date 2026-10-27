import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide',
        'bg-sage/30 text-forest',
        className,
      )}
      {...props}
    />
  );
}

export function DemoBadge() {
  return (
    <Badge className="bg-champagne/25 text-charcoal border border-champagne/40">
      Demo data
    </Badge>
  );
}
