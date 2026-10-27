import { cn } from '@/lib/utils';

interface WordmarkProps {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  light?: boolean;
}

const sizes = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl md:text-5xl',
  hero: 'text-6xl sm:text-7xl md:text-8xl lg:text-[6.5rem]',
};

/**
 * Decorly wordmark — Fraunces with a hollow “o” ring (stroke only)
 * sized to x-height, sitting on the baseline, letter-spacing 0.
 */
export function Wordmark({ text = 'Decorly', className, size = 'md', light }: WordmarkProps) {
  const isLatin = /^[A-Za-z]+$/.test(text);
  const colorClass = light ? 'text-ivory' : 'text-forest';
  const ringColor = light ? '#D2A6A2' : '#B56B6E';

  if (!isLatin) {
    return (
      <span
        className={cn(
          'font-display font-medium leading-none tracking-normal',
          colorClass,
          sizes[size],
          className,
        )}
        style={{ letterSpacing: 0 }}
      >
        {text}
      </span>
    );
  }

  const oIndex = text.toLowerCase().indexOf('o');
  if (oIndex < 0) {
    return (
      <span
        className={cn(
          'font-display font-medium leading-none tracking-normal',
          colorClass,
          sizes[size],
          className,
        )}
        style={{ letterSpacing: 0 }}
      >
        {text}
      </span>
    );
  }

  const before = text.slice(0, oIndex);
  const after = text.slice(oIndex + 1);

  return (
    <span
      className={cn(
        'font-display font-medium leading-none tracking-normal inline-flex items-baseline',
        colorClass,
        sizes[size],
        className,
      )}
      style={{ letterSpacing: 0 }}
      aria-label={text}
    >
      <span>{before}</span>
      {/* Hollow ring ≈ lowercase o: x-height tall, on baseline, equal side gaps */}
      <span
        aria-hidden
        className="inline-block shrink-0 rounded-full box-border"
        style={{
          width: '0.5em',
          height: '0.5em',
          marginLeft: '0.06em',
          marginRight: '0.06em',
          borderWidth: '0.072em',
          borderStyle: 'solid',
          borderColor: ringColor,
          background: 'transparent',
          verticalAlign: 'baseline',
          alignSelf: 'flex-end',
          marginBottom: '0.02em',
        }}
      />
      <span>{after}</span>
    </span>
  );
}
