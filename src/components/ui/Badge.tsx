import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide',
        'bg-sage/25 text-forest',
        className,
      )}
      {...props}
    />
  );
}

export function DemoBadge() {
  return (
    <Badge className="bg-blush/30 text-charcoal border border-blush/50">
      Demo data
    </Badge>
  );
}
