import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  /** ink = dark green strokes, soft = blush/sage on dark, light = ivory */
  tone?: 'ink' | 'soft' | 'light';
  animated?: boolean;
}

/** Signature floral arch — Decorly's visual motif */
export function BrandMark({ className, tone = 'ink', animated = false }: BrandMarkProps) {
  const stroke =
    tone === 'soft' ? '#D2A6A2' : tone === 'light' ? '#F0F4F1' : '#10241E';
  const fill =
    tone === 'soft' ? 'rgba(181,107,110,0.35)' : tone === 'light' ? 'rgba(240,244,241,0.12)' : 'rgba(210,166,162,0.35)';
  const accent = tone === 'soft' ? '#86A094' : tone === 'light' ? '#86A094' : '#B56B6E';

  return (
    <svg
      viewBox="0 0 120 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animated && 'animate-arch-draw', className)}
      aria-hidden
    >
      {/* Outer arch */}
      <path
        d="M12 78 C12 34 36 8 60 8 C84 8 108 34 108 78"
        stroke={stroke}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        className={animated ? 'arch-path' : undefined}
      />
      {/* Inner arch */}
      <path
        d="M28 78 C28 42 42 22 60 22 C78 22 92 42 92 78"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
        fill="none"
        className={animated ? 'arch-path-delay' : undefined}
      />
      {/* Bloom at apex */}
      <ellipse cx="60" cy="18" rx="7" ry="9" fill={fill} stroke={accent} strokeWidth="1.2" />
      <circle cx="60" cy="20" r="2.2" fill={accent} />
      {/* Side buds */}
      <ellipse cx="22" cy="48" rx="4" ry="5.5" fill={fill} opacity="0.85" transform="rotate(-28 22 48)" />
      <ellipse cx="98" cy="48" rx="4" ry="5.5" fill={fill} opacity="0.85" transform="rotate(28 98 48)" />
      {/* Base line */}
      <path d="M18 78 H102" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function BrandMarkIcon({ className, tone = 'soft' }: Omit<BrandMarkProps, 'animated'>) {
  return <BrandMark className={cn('h-7 w-9', className)} tone={tone} />;
}
