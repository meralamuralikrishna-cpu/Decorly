import type { CanvasElement, LibraryCategory } from '@/types';

interface Props {
  element: CanvasElement;
  density?: number;
}

export function ElementVisual({ element, density = 65 }: Props) {
  const { category, color, accent, name } = element;
  const d = density / 100;

  switch (category) {
    case 'backdrops':
      return <BackdropVisual name={name} color={color} accent={accent} />;
    case 'flowers':
      return <FlowerVisual color={color} accent={accent} density={d} />;
    case 'furniture':
      return <FurnitureVisual name={name} color={color} accent={accent} />;
    case 'lighting':
      return <LightingVisual name={name} color={color} />;
    case 'fabrics':
      return <FabricVisual color={color} accent={accent} />;
    case 'props':
      return <PropVisual name={name} color={color} accent={accent} />;
    default:
      return <rect width="100%" height="100%" fill={color} rx="8" />;
  }
}

function BackdropVisual({
  name,
  color,
  accent,
}: {
  name: string;
  color: string;
  accent?: string;
}) {
  if (name.toLowerCase().includes('arch') || name.toLowerCase().includes('mandap')) {
    return (
      <svg viewBox="0 0 200 180" className="w-full h-full" preserveAspectRatio="none">
        <path
          d="M20 170 V70 A80 80 0 0 1 180 70 V170"
          fill="none"
          stroke={accent ?? color}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M35 170 V75 A65 65 0 0 1 165 75 V170"
          fill="none"
          stroke={color}
          strokeWidth="8"
          opacity="0.85"
        />
        <circle cx="40" cy="80" r="10" fill={color} opacity="0.9" />
        <circle cx="160" cy="80" r="10" fill={color} opacity="0.9" />
        <circle cx="100" cy="35" r="12" fill={accent ?? color} opacity="0.8" />
      </svg>
    );
  }
  if (name.toLowerCase().includes('wall')) {
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="none">
        <rect x="10" y="10" width="180" height="140" rx="8" fill={color} opacity="0.5" />
        {Array.from({ length: 24 }).map((_, i) => (
          <ellipse
            key={i}
            cx={25 + (i % 6) * 30}
            cy={30 + Math.floor(i / 6) * 32}
            rx="12"
            ry="16"
            fill={i % 2 === 0 ? color : accent ?? color}
            opacity={0.7 + (i % 3) * 0.1}
          />
        ))}
      </svg>
    );
  }
  // curtain
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`drape-${color}`} x1="0" x2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.95" />
          <stop offset="50%" stopColor={accent ?? color} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="184" height="144" rx="6" fill={`url(#drape-${color})`} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${28 + i * 36} 12 Q${38 + i * 36} 80 ${28 + i * 36} 148`}
          fill="none"
          stroke={accent ?? '#C5A46D'}
          strokeWidth="1.5"
          opacity="0.4"
        />
      ))}
    </svg>
  );
}

function FlowerVisual({
  color,
  accent,
  density,
}: {
  color: string;
  accent?: string;
  density: number;
}) {
  const petals = Math.round(5 + density * 6);
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * Math.PI * 2;
        const r = 22 + (i % 3) * 6 * density;
        const cx = 50 + Math.cos(angle) * r * 0.55;
        const cy = 50 + Math.sin(angle) * r * 0.55;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={10 + density * 4}
            ry={14 + density * 5}
            fill={i % 2 === 0 ? color : accent ?? color}
            opacity={0.75 + (i % 4) * 0.05}
            transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
          />
        );
      })}
      <circle cx="50" cy="50" r="8" fill={accent ?? '#C5A46D'} />
    </svg>
  );
}

function FurnitureVisual({
  name,
  color,
  accent,
}: {
  name: string;
  color: string;
  accent?: string;
}) {
  if (name.toLowerCase().includes('stage') || name.toLowerCase().includes('platform')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
        <rect x="4" y="8" width="192" height="40" rx="6" fill={color} />
        <rect x="4" y="40" width="192" height="12" rx="2" fill={accent ?? '#C5A46D'} opacity="0.7" />
        <line x1="20" y1="16" x2="180" y2="16" stroke={accent ?? '#C5A46D'} strokeWidth="1" opacity="0.4" />
      </svg>
    );
  }
  if (name.toLowerCase().includes('loveseat') || name.toLowerCase().includes('sofa')) {
    return (
      <svg viewBox="0 0 160 70" className="w-full h-full" preserveAspectRatio="none">
        <rect x="10" y="20" width="140" height="35" rx="10" fill={color} />
        <rect x="5" y="18" width="20" height="40" rx="8" fill={color} />
        <rect x="135" y="18" width="20" height="40" rx="8" fill={color} />
        <rect x="30" y="12" width="100" height="18" rx="6" fill={accent ?? color} opacity="0.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 100" className="w-full h-full" preserveAspectRatio="none">
      <rect x="18" y="8" width="24" height="12" rx="2" fill={accent ?? '#C5A46D'} />
      <rect x="10" y="20" width="40" height="55" rx="4" fill={color} />
      <rect x="15" y="75" width="30" height="18" rx="2" fill={accent ?? '#C5A46D'} />
    </svg>
  );
}

function LightingVisual({ name, color }: { name: string; color: string }) {
  if (name.toLowerCase().includes('chandelier')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <line x1="50" y1="5" x2="50" y2="25" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="30" r="8" fill={color} opacity="0.9" />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <g key={i}>
              <line
                x1="50"
                y1="30"
                x2={50 + Math.cos(a) * 28}
                y2={40 + Math.sin(a) * 20}
                stroke={color}
                strokeWidth="1.5"
              />
              <circle
                cx={50 + Math.cos(a) * 28}
                cy={40 + Math.sin(a) * 20}
                r="5"
                fill="#FAF7F2"
                stroke={color}
              />
            </g>
          );
        })}
      </svg>
    );
  }
  if (name.toLowerCase().includes('string')) {
    return (
      <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
        <path d="M10 20 Q50 5 90 20 T170 20 T190 15" fill="none" stroke={color} strokeWidth="1.5" />
        {[20, 50, 80, 110, 140, 170].map((x, i) => (
          <circle key={i} cx={x} cy={12 + (i % 2) * 10} r="4" fill="#FAF7F2" stroke={color} />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 40" className="w-full h-full">
      <ellipse cx="40" cy="30" rx="30" ry="8" fill={color} opacity="0.35" />
      <rect x="30" y="8" width="20" height="14" rx="3" fill={color} />
    </svg>
  );
}

function FabricVisual({ color, accent }: { color: string; accent?: string }) {
  return (
    <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
      <rect x="4" y="8" width="192" height="24" rx="4" fill={color} />
      <rect x="4" y="8" width="192" height="6" rx="2" fill={accent ?? '#C5A46D'} opacity="0.5" />
    </svg>
  );
}

function PropVisual({
  name,
  color,
  accent,
}: {
  name: string;
  color: string;
  accent?: string;
}) {
  if (name.toLowerCase().includes('candle')) {
    return (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        {[18, 40, 58].map((x, i) => (
          <g key={i}>
            <rect x={x - 5} y={22 - i * 4} width="10" height={28 + i * 4} rx="2" fill={color} stroke={accent} />
            <ellipse cx={x} cy={18 - i * 4} rx="3" ry="5" fill="#C5A46D" opacity="0.8" />
          </g>
        ))}
      </svg>
    );
  }
  if (name.toLowerCase().includes('urn')) {
    return (
      <svg viewBox="0 0 60 90" className="w-full h-full">
        <ellipse cx="30" cy="18" rx="18" ry="6" fill={accent ?? color} />
        <path d="M14 20 Q10 50 18 75 H42 Q50 50 46 20 Z" fill={color} />
        <ellipse cx="30" cy="75" rx="14" ry="5" fill={accent ?? color} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 100" className="w-full h-full">
      <rect x="10" y="20" width="60" height="70" rx="4" fill={color} opacity="0.85" />
      <rect x="18" y="28" width="44" height="40" rx="2" fill="#FAF7F2" opacity="0.3" />
      <circle cx="40" cy="12" r="6" fill={accent ?? '#C5A46D'} />
    </svg>
  );
}

export function categoryDefaultSize(category: LibraryCategory): { width: number; height: number } {
  switch (category) {
    case 'backdrops':
      return { width: 360, height: 300 };
    case 'furniture':
      return { width: 280, height: 70 };
    case 'flowers':
      return { width: 100, height: 90 };
    case 'lighting':
      return { width: 140, height: 60 };
    case 'fabrics':
      return { width: 200, height: 36 };
    case 'props':
      return { width: 70, height: 80 };
    default:
      return { width: 100, height: 100 };
  }
}
