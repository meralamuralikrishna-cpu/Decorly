import type { CanvasElement, LibraryCategory } from '@/types';

interface Props {
  element: CanvasElement;
  density?: number;
}

/** Rich illustrated décor — gradients and depth, no external photo assets. */
export function ElementVisual({ element, density = 65 }: Props) {
  const { category, color, accent, name, libraryId } = element;
  const d = density / 100;
  const uid = libraryId || element.id;

  switch (category) {
    case 'backdrops':
      return <BackdropVisual name={name} color={color} accent={accent} uid={uid} />;
    case 'flowers':
      return <FlowerVisual name={name} color={color} accent={accent} density={d} uid={uid} />;
    case 'furniture':
      return <FurnitureVisual name={name} color={color} accent={accent} uid={uid} />;
    case 'lighting':
      return <LightingVisual name={name} color={color} uid={uid} />;
    case 'fabrics':
      return <FabricVisual name={name} color={color} accent={accent} uid={uid} />;
    case 'props':
      return <PropVisual name={name} color={color} accent={accent} uid={uid} />;
    default:
      return <rect width="100%" height="100%" fill={color} rx="8" />;
  }
}

function BackdropVisual({
  name,
  color,
  accent,
  uid,
}: {
  name: string;
  color: string;
  accent?: string;
  uid: string;
}) {
  const a = accent ?? '#C5A46D';
  const n = name.toLowerCase();

  if (n.includes('moon')) {
    return (
      <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id={`moon-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={a} stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="none" stroke={a} strokeWidth="14" />
        <circle cx="100" cy="100" r="68" fill="none" stroke={color} strokeWidth="6" opacity="0.85" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 100 + Math.cos(rad) * 74;
          const cy = 100 + Math.sin(rad) * 74;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={10 + (i % 3)} fill={`url(#moon-${uid})`} />
              <circle cx={cx - 4} cy={cy + 2} r="5" fill={a} opacity="0.7" />
            </g>
          );
        })}
      </svg>
    );
  }

  if (n.includes('balloon') && n.includes('arch')) {
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="none">
        <path
          d="M20 150 V70 A80 80 0 0 1 180 70 V150"
          fill="none"
          stroke={a}
          strokeWidth="3"
          opacity="0.35"
        />
        {[
          [28, 120], [36, 90], [52, 62], [78, 42], [100, 34], [122, 42], [148, 62], [164, 90], [172, 120],
          [44, 110], [60, 78], [88, 52], [112, 52], [140, 78], [156, 110],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={10 + (i % 3)} ry={12 + (i % 2)} fill={i % 2 === 0 ? color : a} opacity="0.9" />
            <line x1={cx} y1={cy + 12} x2={cx} y2={cy + 18} stroke={a} strokeWidth="1" opacity="0.5" />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('toran')) {
    return (
      <svg viewBox="0 0 220 70" className="w-full h-full" preserveAspectRatio="none">
        <path d="M10 18 Q110 48 210 18" fill="none" stroke={a} strokeWidth="4" />
        {[20, 45, 70, 95, 120, 145, 170, 195].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${22 + (i % 2) * 8})`}>
            <ellipse cx="0" cy="8" rx="7" ry="10" fill={i % 2 === 0 ? color : a} />
            <circle cy="0" r="5" fill={color} />
            <path d="M-4 16 L0 28 L4 16" fill="#6B8F71" opacity="0.8" />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('jaali') || n.includes('lattice')) {
    return (
      <svg viewBox="0 0 160 180" className="w-full h-full" preserveAspectRatio="none">
        <rect x="8" y="8" width="144" height="164" rx="6" fill={color} opacity="0.25" stroke={a} strokeWidth="4" />
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 4 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={28 + col * 34}
              cy={30 + row * 30}
              r="10"
              fill="none"
              stroke={a}
              strokeWidth="2"
              opacity="0.7"
            />
          )),
        )}
        <rect x="8" y="8" width="144" height="12" fill={a} opacity="0.8" />
        <rect x="8" y="160" width="144" height="12" fill={a} opacity="0.8" />
      </svg>
    );
  }

  if (n.includes('photo')) {
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="none">
        <rect x="6" y="6" width="188" height="148" rx="4" fill={color} opacity="0.35" stroke={a} />
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          return (
            <rect
              key={i}
              x={18 + col * 44}
              y={18 + row * 44}
              width="36"
              height="36"
              rx="2"
              fill="#FAF7F2"
              stroke={a}
              opacity="0.85"
            />
          );
        })}
      </svg>
    );
  }

  if (n.includes('panel') || n.includes('neon backdrop')) {
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`panel-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={a} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <rect x="10" y="10" width="180" height="140" rx="8" fill={`url(#panel-${uid})`} />
        <rect x="22" y="22" width="156" height="116" rx="4" fill="none" stroke={a} strokeWidth="3" opacity="0.7" />
        {n.includes('neon') && (
          <path
            d="M55 80 Q80 55 100 80 T145 78"
            fill="none"
            stroke="#FAF7F2"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.9"
          />
        )}
      </svg>
    );
  }

  if (n.includes('arch') || n.includes('mandap')) {
    return (
      <svg viewBox="0 0 200 180" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`arch-wood-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
          <radialGradient id={`arch-bloom-${uid}`} cx="50%" cy="20%" r="55%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={a} stopOpacity="0.2" />
          </radialGradient>
          <filter id={`soft-${uid}`}>
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>
        <ellipse cx="100" cy="168" rx="70" ry="8" fill="#243D35" opacity="0.12" />
        <path
          d="M22 170 V68 A78 78 0 0 1 178 68 V170"
          fill="none"
          stroke={`url(#arch-wood-${uid})`}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M36 170 V74 A64 64 0 0 1 164 74 V170"
          fill="none"
          stroke={color}
          strokeWidth="7"
          opacity="0.85"
        />
        {[
          [32, 78],
          [168, 78],
          [100, 32],
          [55, 48],
          [145, 48],
          [40, 120],
          [160, 120],
        ].map(([cx, cy], i) => (
          <g key={i} filter={`url(#soft-${uid})`}>
            <circle cx={cx} cy={cy} r={10 + (i % 3) * 2} fill={`url(#arch-bloom-${uid})`} />
            <circle cx={cx - 6} cy={cy + 4} r="6" fill={a} opacity="0.7" />
            <circle cx={cx + 5} cy={cy - 3} r="5" fill={color} opacity="0.9" />
          </g>
        ))}
        {n.includes('mandap') && (
          <>
            <rect x="28" y="155" width="8" height="15" rx="1" fill={a} />
            <rect x="164" y="155" width="8" height="15" rx="1" fill={a} />
            <path d="M70 55 Q100 20 130 55" fill="none" stroke={a} strokeWidth="3" opacity="0.6" />
          </>
        )}
      </svg>
    );
  }

  if (n.includes('wall') || n.includes('pampas')) {
    const fluffy = n.includes('pampas');
    return (
      <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`wall-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={a} stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" width="184" height="144" rx="10" fill={`url(#wall-${uid})`} />
        {Array.from({ length: fluffy ? 24 : 30 }).map((_, i) => {
          const col = i % 6;
          const row = Math.floor(i / 6);
          return (
            <g key={i}>
              <ellipse
                cx={28 + col * 30}
                cy={28 + row * 28}
                rx={fluffy ? 14 + (i % 3) : 11 + (i % 3)}
                ry={fluffy ? 18 + (i % 2) * 4 : 14 + (i % 2) * 3}
                fill={i % 2 === 0 ? color : a}
                opacity={0.55 + (i % 4) * 0.08}
              />
            </g>
          );
        })}
      </svg>
    );
  }

  // curtain
  return (
    <svg viewBox="0 0 200 160" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`drape-${uid}`} x1="0" x2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.98" />
          <stop offset="35%" stopColor={a} stopOpacity="0.55" />
          <stop offset="70%" stopColor={color} stopOpacity="0.95" />
          <stop offset="100%" stopColor={a} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="188" height="148" rx="8" fill={`url(#drape-${uid})`} />
      <rect x="6" y="6" width="188" height="10" rx="4" fill={a} opacity="0.55" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M${22 + i * 30} 16 Q${34 + i * 30} 80 ${22 + i * 30} 150`}
          fill="none"
          stroke={a}
          strokeWidth="2"
          opacity="0.35"
        />
      ))}
    </svg>
  );
}

function FlowerVisual({
  name,
  color,
  accent,
  density,
  uid,
}: {
  name: string;
  color: string;
  accent?: string;
  density: number;
  uid: string;
}) {
  const a = accent ?? '#C5A46D';
  const n = name.toLowerCase();
  const petals = Math.round(6 + density * 8);

  if (n.includes('garland') || (n.includes('marigold') && !n.includes('bunch'))) {
    return (
      <svg viewBox="0 0 120 40" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id={`mar-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE08A" />
            <stop offset="70%" stopColor={color} />
            <stop offset="100%" stopColor={a} />
          </radialGradient>
        </defs>
        <path
          d="M8 22 Q40 8 60 22 T112 20"
          fill="none"
          stroke={a}
          strokeWidth="3"
          opacity="0.5"
        />
        {[12, 28, 44, 60, 76, 92, 108].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${16 + (i % 2) * 6})`}>
            {Array.from({ length: 8 }).map((_, p) => {
              const ang = (p / 8) * Math.PI * 2;
              return (
                <ellipse
                  key={p}
                  cx={Math.cos(ang) * 6}
                  cy={Math.sin(ang) * 6}
                  rx="4"
                  ry="6"
                  fill={`url(#mar-${uid})`}
                  transform={`rotate(${(ang * 180) / Math.PI})`}
                />
              );
            })}
            <circle r="3" fill="#C45C26" />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('jasmine') || n.includes('gajra')) {
    return (
      <svg viewBox="0 0 120 36" className="w-full h-full" preserveAspectRatio="none">
        <path d="M6 18 Q40 6 60 18 T114 16" fill="none" stroke={a} strokeWidth="2" opacity="0.45" />
        {[14, 28, 42, 56, 70, 84, 98, 110].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${14 + (i % 2) * 6})`}>
            {[0, 1, 2, 3, 4].map((p) => {
              const ang = (p / 5) * Math.PI * 2;
              return (
                <ellipse
                  key={p}
                  cx={Math.cos(ang) * 4}
                  cy={Math.sin(ang) * 4}
                  rx="3"
                  ry="4"
                  fill={color}
                  opacity="0.95"
                />
              );
            })}
            <circle r="1.5" fill={a} />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('lotus')) {
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        <ellipse cx="50" cy="70" rx="30" ry="6" fill="#243D35" opacity="0.1" />
        {[ -50, -30, -10, 10, 30, 50 ].map((rot, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="42"
            rx="10"
            ry="28"
            fill={i % 2 === 0 ? color : a}
            opacity="0.85"
            transform={`rotate(${rot} 50 55)`}
          />
        ))}
        <circle cx="50" cy="52" r="8" fill="#E8A838" opacity="0.9" />
      </svg>
    );
  }

  if (n.includes('lily')) {
    return (
      <svg viewBox="0 0 90 110" className="w-full h-full">
        <path d="M45 105 V40" fill="none" stroke={a} strokeWidth="2.5" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(45, ${30 + i * 22}) rotate(${(i - 1) * 18})`}>
            {[-35, -12, 12, 35].map((rot, p) => (
              <ellipse
                key={p}
                cx="0"
                cy="-14"
                rx="7"
                ry="18"
                fill={color}
                opacity="0.92"
                transform={`rotate(${rot})`}
              />
            ))}
            <circle cy="-2" r="3" fill={a} />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes("baby") || n.includes('gypsophila') || n.includes('breath')) {
    return (
      <svg viewBox="0 0 100 90" className="w-full h-full">
        {Array.from({ length: 28 }).map((_, i) => {
          const cx = 18 + (i % 7) * 12 + (i % 2) * 4;
          const cy = 16 + Math.floor(i / 7) * 18 + (i % 3) * 3;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r="3.5" fill={color} opacity="0.9" />
              <circle cx={cx + 5} cy={cy + 3} r="2.5" fill={a} opacity="0.55" />
            </g>
          );
        })}
      </svg>
    );
  }

  if (n.includes('sunflower')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {Array.from({ length: 16 }).map((_, i) => {
          const ang = (i / 16) * Math.PI * 2;
          return (
            <ellipse
              key={i}
              cx={50 + Math.cos(ang) * 28}
              cy={50 + Math.sin(ang) * 28}
              rx="8"
              ry="16"
              fill={color}
              transform={`rotate(${(ang * 180) / Math.PI} ${50 + Math.cos(ang) * 28} ${50 + Math.sin(ang) * 28})`}
            />
          );
        })}
        <circle cx="50" cy="50" r="18" fill={a} />
        <circle cx="50" cy="50" r="12" fill="#243D35" opacity="0.35" />
      </svg>
    );
  }

  if (n.includes('tulip')) {
    return (
      <svg viewBox="0 0 80 110" className="w-full h-full">
        <path d="M40 105 V48" fill="none" stroke={a} strokeWidth="2.5" />
        <path d="M28 70 Q22 40 40 28 Q58 40 52 70 Z" fill={color} />
        <path d="M34 68 Q40 38 46 68" fill={a} opacity="0.45" />
        <ellipse cx="26" cy="78" rx="10" ry="5" fill="#6B8F71" opacity="0.75" transform="rotate(-30 26 78)" />
      </svg>
    );
  }

  if (n.includes('dahlia') || n.includes('chrysanthemum') || n.includes('mum') || n.includes('carnation')) {
    const layers = n.includes('dahlia') ? 3 : 2;
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id={`dah-${uid}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor={a} />
          </radialGradient>
        </defs>
        {Array.from({ length: layers }).map((_, layer) =>
          Array.from({ length: 12 }).map((_, i) => {
            const ang = (i / 12) * Math.PI * 2 + layer * 0.2;
            const r = 28 - layer * 8;
            return (
              <ellipse
                key={`${layer}-${i}`}
                cx={50 + Math.cos(ang) * r * 0.4}
                cy={50 + Math.sin(ang) * r * 0.4}
                rx={7 - layer}
                ry={14 - layer * 2}
                fill={`url(#dah-${uid})`}
                opacity={0.85}
                transform={`rotate(${(ang * 180) / Math.PI} ${50 + Math.cos(ang) * r * 0.4} ${50 + Math.sin(ang) * r * 0.4})`}
              />
            );
          }),
        )}
        <circle cx="50" cy="50" r="8" fill={a} />
      </svg>
    );
  }

  if (n.includes('fern') || n.includes('greenery') || n.includes('eucalyptus') || n.includes('sage')) {
    return (
      <svg viewBox="0 0 100 110" className="w-full h-full">
        <path d="M50 105 Q48 55 52 10" fill="none" stroke={a} strokeWidth="2.5" />
        {Array.from({ length: n.includes('fern') ? 16 : 12 }).map((_, i) => {
          const y = 14 + i * 6;
          const side = i % 2 === 0 ? -1 : 1;
          return (
            <ellipse
              key={i}
              cx={50 + side * (10 + (i % 3) * 3)}
              cy={y}
              rx={n.includes('fern') ? 14 : 9 + (i % 3)}
              ry={n.includes('fern') ? 4 : 5}
              fill={i % 2 === 0 ? color : a}
              opacity={0.75}
              transform={`rotate(${side * 28} ${50 + side * 12} ${y})`}
            />
          );
        })}
      </svg>
    );
  }

  if (n.includes('pampas')) {
    return (
      <svg viewBox="0 0 90 120" className="w-full h-full">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${20 + i * 12}, 10) rotate(${(i - 2) * 8})`}>
            <path d="M5 100 Q5 40 5 8" fill="none" stroke={a} strokeWidth="1.5" />
            <ellipse cx="5" cy="28" rx="10" ry="28" fill={color} opacity="0.75" />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('anthurium')) {
    return (
      <svg viewBox="0 0 90 110" className="w-full h-full">
        <path d="M45 105 V55" fill="none" stroke={a} strokeWidth="2.5" />
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${30 + i * 30}, ${40 + i * 8})`}>
            <path d="M0 30 Q-18 10 0 -8 Q18 10 0 30 Z" fill={color} opacity="0.92" />
            <ellipse cx="0" cy="4" rx="3" ry="16" fill={a} />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('cascade') || n.includes('trail')) {
    return (
      <svg viewBox="0 0 70 140" className="w-full h-full" preserveAspectRatio="none">
        <path d="M35 8 Q50 50 30 90 T40 135" fill="none" stroke={a} strokeWidth="2" opacity="0.5" />
        {[12, 28, 44, 60, 76, 92, 108, 124].map((y, i) => (
          <g key={i}>
            <circle cx={28 + (i % 3) * 8} cy={y} r={7 + (i % 3)} fill={i % 2 === 0 ? color : a} opacity="0.85" />
            <circle cx={40 + (i % 2) * 6} cy={y + 4} r="4" fill={color} opacity="0.7" />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('centerpiece') || n.includes('bouquet')) {
    return (
      <svg viewBox="0 0 90 120" className="w-full h-full">
        <defs>
          <radialGradient id={`ctr-${uid}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor={a} />
          </radialGradient>
        </defs>
        {!n.includes('bridal') && (
          <path d="M28 70 H62 L55 110 H35 Z" fill={a} opacity="0.85" />
        )}
        {Array.from({ length: 14 }).map((_, i) => {
          const ang = (i / 14) * Math.PI * 2;
          const cx = 45 + Math.cos(ang) * 22;
          const cy = 42 + Math.sin(ang) * 18;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx="8"
              ry="12"
              fill={`url(#ctr-${uid})`}
              transform={`rotate(${(ang * 180) / Math.PI} ${cx} ${cy})`}
            />
          );
        })}
        <circle cx="45" cy="42" r="8" fill={a} />
      </svg>
    );
  }

  if (n.includes('petal') || n.includes('scatter')) {
    return (
      <svg viewBox="0 0 120 50" className="w-full h-full" preserveAspectRatio="none">
        {Array.from({ length: 18 }).map((_, i) => (
          <ellipse
            key={i}
            cx={8 + i * 6.5}
            cy={18 + (i % 5) * 5}
            rx="5"
            ry="8"
            fill={i % 3 === 0 ? a : color}
            opacity="0.8"
            transform={`rotate(${(i * 27) % 60 - 30} ${8 + i * 6.5} ${18 + (i % 5) * 5})`}
          />
        ))}
      </svg>
    );
  }

  if (n.includes('orchid')) {
    return (
      <svg viewBox="0 0 80 110" className="w-full h-full">
        <defs>
          <linearGradient id={`orch-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <path d="M40 100 Q38 60 42 20" fill="none" stroke={a} strokeWidth="3" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(40, ${28 + i * 18}) rotate(${(i - 1.5) * 12})`}>
            <ellipse cx="-10" cy="0" rx="12" ry="7" fill={`url(#orch-${uid})`} opacity="0.95" />
            <ellipse cx="10" cy="0" rx="12" ry="7" fill={`url(#orch-${uid})`} opacity="0.95" />
            <ellipse cx="0" cy="-6" rx="7" ry="10" fill={color} opacity="0.9" />
            <circle cy="2" r="3" fill={a} />
          </g>
        ))}
      </svg>
    );
  }

  // Default bloom cluster (rose / peony / hydrangea / marigold bunch)
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id={`bloom-${uid}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={a} stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="88" rx="28" ry="6" fill="#243D35" opacity="0.1" />
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * Math.PI * 2;
        const r = 20 + (i % 3) * 7 * density;
        const cx = 50 + Math.cos(angle) * r * 0.55;
        const cy = 50 + Math.sin(angle) * r * 0.55;
        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={9 + density * 5}
            ry={13 + density * 6}
            fill={`url(#bloom-${uid})`}
            opacity={0.78 + (i % 4) * 0.05}
            transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
          />
        );
      })}
      <circle cx="50" cy="50" r="9" fill={a} />
      <circle cx="47" cy="47" r="3" fill="#FAF7F2" opacity="0.5" />
    </svg>
  );
}

function FurnitureVisual({
  name,
  color,
  accent,
  uid,
}: {
  name: string;
  color: string;
  accent?: string;
  uid: string;
}) {
  const a = accent ?? '#C5A46D';
  const n = name.toLowerCase();

  if (n.includes('stage') || n.includes('platform')) {
    return (
      <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`stage-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={a} />
          </linearGradient>
        </defs>
        <polygon points="10,12 190,12 198,48 2,48" fill={`url(#stage-${uid})`} />
        <rect x="2" y="48" width="196" height="8" rx="2" fill={a} opacity="0.85" />
        <line x1="24" y1="20" x2="176" y2="20" stroke="#FAF7F2" strokeWidth="1" opacity="0.35" />
      </svg>
    );
  }

  if (n.includes('loveseat') || n.includes('sofa')) {
    return (
      <svg viewBox="0 0 160 70" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`sofa-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <stop offset="40%" stopColor={color} />
            <stop offset="100%" stopColor={a} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect x="8" y="22" width="144" height="36" rx="12" fill={`url(#sofa-${uid})`} />
        <rect x="4" y="18" width="22" height="42" rx="10" fill={color} />
        <rect x="134" y="18" width="22" height="42" rx="10" fill={color} />
        <rect x="32" y="10" width="96" height="20" rx="8" fill={a} opacity="0.75" />
        <ellipse cx="80" cy="40" rx="36" ry="8" fill="#FAF7F2" opacity="0.2" />
      </svg>
    );
  }

  if (n.includes('throne')) {
    return (
      <svg viewBox="0 0 140 90" className="w-full h-full" preserveAspectRatio="none">
        {[18, 78].map((x) => (
          <g key={x}>
            <rect x={x} y="28" width="44" height="48" rx="6" fill={color} />
            <rect x={x + 4} y="8" width="36" height="28" rx="8" fill={a} />
            <path d={`M${x + 8} 12 Q${x + 22} 0 ${x + 36} 12`} fill="none" stroke="#E8A838" strokeWidth="2" />
            <rect x={x + 6} y="70" width="8" height="14" fill={a} />
            <rect x={x + 30} y="70" width="8" height="14" fill={a} />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('chiavari') || n.includes('chair')) {
    return (
      <svg viewBox="0 0 160 70" className="w-full h-full" preserveAspectRatio="none">
        {[12, 48, 84, 120].map((x) => (
          <g key={x}>
            <rect x={x + 6} y="8" width="18" height="28" rx="2" fill="none" stroke={a} strokeWidth="2" />
            <rect x={x} y="34" width="30" height="8" rx="2" fill={color} stroke={a} />
            <line x1={x + 4} y1="42" x2={x + 4} y2="62" stroke={a} strokeWidth="2" />
            <line x1={x + 26} y1="42" x2={x + 26} y2="62" stroke={a} strokeWidth="2" />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('table') || n.includes('cocktail')) {
    const tall = n.includes('cocktail');
    return (
      <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="none">
        <ellipse cx="50" cy={tall ? 22 : 28} rx="40" ry="10" fill={color} stroke={a} />
        <rect x="46" y={tall ? 28 : 34} width="8" height={tall ? 40 : 28} fill={a} />
        <ellipse cx="50" cy={tall ? 70 : 64} rx="16" ry="4" fill={a} opacity="0.7" />
      </svg>
    );
  }

  if (n.includes('bench')) {
    return (
      <svg viewBox="0 0 160 60" className="w-full h-full" preserveAspectRatio="none">
        <rect x="10" y="18" width="140" height="14" rx="3" fill={color} stroke={a} />
        <rect x="16" y="32" width="10" height="22" fill={a} />
        <rect x="134" y="32" width="10" height="22" fill={a} />
        <rect x="20" y="8" width="120" height="12" rx="2" fill={a} opacity="0.75" />
      </svg>
    );
  }

  if (n.includes('bar')) {
    return (
      <svg viewBox="0 0 100 90" className="w-full h-full" preserveAspectRatio="none">
        <rect x="12" y="20" width="76" height="10" rx="2" fill={a} />
        <rect x="18" y="30" width="64" height="40" rx="3" fill={color} opacity="0.85" />
        <circle cx="28" cy="72" r="6" fill="none" stroke={a} strokeWidth="2" />
        <circle cx="72" cy="72" r="6" fill="none" stroke={a} strokeWidth="2" />
        <rect x="30" y="8" width="8" height="14" fill={a} opacity="0.6" />
        <rect x="62" y="10" width="8" height="12" fill={a} opacity="0.6" />
      </svg>
    );
  }

  // pedestal / stand
  return (
    <svg viewBox="0 0 60 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`ped-${uid}`} x1="0" x2="1">
          <stop offset="0%" stopColor={a} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={a} />
        </linearGradient>
      </defs>
      <ellipse cx="30" cy="14" rx="20" ry="6" fill={a} />
      <rect x="18" y="14" width="24" height="8" fill={a} />
      <path d="M16 22 H44 L40 72 H20 Z" fill={`url(#ped-${uid})`} />
      <ellipse cx="30" cy="78" rx="16" ry="5" fill={a} />
      <rect x="14" y="80" width="32" height="12" rx="2" fill={color} opacity="0.9" />
    </svg>
  );
}

function LightingVisual({ name, color, uid }: { name: string; color: string; uid: string }) {
  const n = name.toLowerCase();

  if (n.includes('chandelier')) {
    return (
      <svg viewBox="0 0 100 110" className="w-full h-full">
        <defs>
          <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="55" r="42" fill={`url(#glow-${uid})`} />
        <line x1="50" y1="4" x2="50" y2="22" stroke={color} strokeWidth="2" />
        <circle cx="50" cy="26" r="7" fill={color} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(a) * 30;
          const y = 42 + Math.sin(a) * 22;
          return (
            <g key={i}>
              <line x1="50" y1="26" x2={x} y2={y} stroke={color} strokeWidth="1.5" opacity="0.8" />
              <circle cx={x} cy={y} r="5.5" fill="#FAF7F2" stroke={color} />
              <circle cx={x} cy={y} r="2" fill="#C5A46D" opacity="0.7" />
            </g>
          );
        })}
      </svg>
    );
  }

  if (n.includes('fairy') || n.includes('canopy')) {
    return (
      <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id={`fair-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {[0, 1, 2, 3].map((row) => (
          <path
            key={row}
            d={`M8 ${16 + row * 16} Q50 ${8 + row * 16} 100 ${18 + row * 16} T192 ${14 + row * 16}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.55"
          />
        ))}
        {Array.from({ length: 24 }).map((_, i) => (
          <circle
            key={i}
            cx={12 + (i % 8) * 24}
            cy={14 + Math.floor(i / 8) * 20 + (i % 2) * 4}
            r="3"
            fill={`url(#fair-${uid})`}
          />
        ))}
      </svg>
    );
  }

  if (n.includes('string')) {
    return (
      <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <radialGradient id={`bulb-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </radialGradient>
        </defs>
        <path
          d="M8 18 Q50 4 90 18 T170 16 T194 12"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
        {[18, 48, 78, 108, 138, 168].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={10 + (i % 2) * 8} r="7" fill={`url(#bulb-${uid})`} />
            <circle cx={x} cy={10 + (i % 2) * 8} r="3.5" fill="#FAF7F2" stroke={color} />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('lantern')) {
    return (
      <svg viewBox="0 0 70 90" className="w-full h-full">
        <line x1="35" y1="4" x2="35" y2="16" stroke={color} strokeWidth="2" />
        <rect x="14" y="16" width="42" height="8" rx="2" fill={color} />
        <path d="M18 24 H52 L48 70 H22 Z" fill={color} opacity="0.35" stroke={color} />
        <ellipse cx="35" cy="48" rx="10" ry="14" fill="#FFF8E7" opacity="0.7" />
        <rect x="18" y="70" width="34" height="8" rx="2" fill={color} />
      </svg>
    );
  }

  if (n.includes('candelabra')) {
    return (
      <svg viewBox="0 0 80 110" className="w-full h-full">
        <rect x="36" y="50" width="8" height="50" fill={color} />
        <ellipse cx="40" cy="102" rx="18" ry="5" fill={color} />
        {[-24, 0, 24].map((dx, i) => (
          <g key={i}>
            <path d={`M40 55 Q${40 + dx} 40 ${40 + dx} 28`} fill="none" stroke={color} strokeWidth="2" />
            <rect x={36 + dx} y="18" width="8" height="14" rx="1" fill="#FAF7F2" stroke={color} />
            <ellipse cx={40 + dx} cy="14" rx="3" ry="5" fill="#FFF4C2" />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('diya')) {
    return (
      <svg viewBox="0 0 160 40" className="w-full h-full" preserveAspectRatio="none">
        {[16, 48, 80, 112, 144].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy="28" rx="12" ry="6" fill={color} />
            <ellipse cx={x} cy="24" rx="8" ry="4" fill="#C45C26" opacity="0.7" />
            <ellipse cx={x} cy="14" rx="3" ry="6" fill="#FFF4C2" />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('neon') || n.includes('script')) {
    return (
      <svg viewBox="0 0 140 60" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <filter id={`neon-${uid}`}>
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect x="4" y="4" width="132" height="52" rx="6" fill="#243D35" opacity="0.15" />
        <path
          d="M20 32 Q40 12 55 32 T90 30 Q110 18 124 34"
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          filter={`url(#neon-${uid})`}
        />
      </svg>
    );
  }

  if (n.includes('spot')) {
    return (
      <svg viewBox="0 0 100 70" className="w-full h-full">
        <defs>
          <linearGradient id={`spot-${uid}`} x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="40,8 60,8 85,65 15,65" fill={`url(#spot-${uid})`} />
        <rect x="38" y="2" width="24" height="10" rx="2" fill={color} />
      </svg>
    );
  }

  // uplight / led wash
  return (
    <svg viewBox="0 0 90 50" className="w-full h-full">
      <defs>
        <radialGradient id={`up-${uid}`} cx="50%" cy="100%" r="80%">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="45" cy="28" rx="40" ry="20" fill={`url(#up-${uid})`} />
      <rect x="32" y="30" width="26" height="14" rx="3" fill={color} />
    </svg>
  );
}

function FabricVisual({
  name,
  color,
  accent,
  uid,
}: {
  name?: string;
  color: string;
  accent?: string;
  uid: string;
}) {
  const a = accent ?? '#C5A46D';
  const n = (name ?? '').toLowerCase();

  if (n.includes('canopy')) {
    return (
      <svg viewBox="0 0 200 70" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`can-${uid}`} x1="0" x2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="50%" stopColor={a} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M10 ${18 + i * 16} Q55 ${4 + i * 16} 100 ${20 + i * 16} T190 ${16 + i * 16}`}
            fill="none"
            stroke={`url(#can-${uid})`}
            strokeWidth="10"
            strokeLinecap="round"
            opacity={0.85 - i * 0.15}
          />
        ))}
      </svg>
    );
  }

  if (n.includes('sash')) {
    return (
      <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
        <path d="M20 8 Q50 40 80 8" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" />
        <circle cx="50" cy="36" r="8" fill={a} />
        <path d="M42 40 Q50 55 58 40" fill={color} opacity="0.8" />
      </svg>
    );
  }

  if (n.includes('velvet') || n.includes('organza') || n.includes('cloth')) {
    return (
      <svg viewBox="0 0 160 90" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`cloth-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={a} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M20 20 H140 L150 80 H10 Z"
          fill={`url(#cloth-${uid})`}
          opacity={n.includes('organza') ? 0.55 : 0.92}
        />
        <ellipse cx="80" cy="22" rx="62" ry="10" fill={color} opacity="0.9" />
      </svg>
    );
  }

  if (n.includes('dupatta')) {
    return (
      <svg viewBox="0 0 80 120" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`dup-${uid}`} x1="0" x2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={a} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path
          d="M20 8 Q40 20 55 8 L68 110 Q40 100 12 110 Z"
          fill={`url(#dup-${uid})`}
          opacity="0.9"
        />
        <path d="M22 30 Q40 40 58 28" fill="none" stroke={a} strokeWidth="1.5" opacity="0.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`fab-${uid}`} x1="0" x2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="50%" stopColor={a} stopOpacity="0.65" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path
        d="M4 12 Q50 4 100 14 T196 12 L196 32 Q150 38 100 28 T4 32 Z"
        fill={`url(#fab-${uid})`}
      />
      <path
        d="M4 12 Q50 4 100 14 T196 12"
        fill="none"
        stroke={a}
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  );
}

function PropVisual({
  name,
  color,
  accent,
  uid,
}: {
  name: string;
  color: string;
  accent?: string;
  uid: string;
}) {
  const a = accent ?? '#C5A46D';
  const n = name.toLowerCase();

  if (n.includes('candle')) {
    return (
      <svg viewBox="0 0 90 70" className="w-full h-full">
        <defs>
          <radialGradient id={`flame-${uid}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFF4C2" />
            <stop offset="100%" stopColor="#C5A46D" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {[22, 45, 68].map((x, i) => (
          <g key={i}>
            <rect
              x={x - 6}
              y={28 - i * 4}
              width="12"
              height={32 + i * 5}
              rx="2"
              fill={color}
              stroke={a}
            />
            <ellipse cx={x} cy={24 - i * 4} rx="4" ry="7" fill={`url(#flame-${uid})`} />
          </g>
        ))}
      </svg>
    );
  }

  if (n.includes('kalash')) {
    return (
      <svg viewBox="0 0 70 100" className="w-full h-full">
        <defs>
          <linearGradient id={`kal-${uid}`} x1="0" x2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor={a} />
          </linearGradient>
        </defs>
        <path d="M22 40 Q18 70 28 88 H42 Q52 70 48 40 Z" fill={`url(#kal-${uid})`} />
        <ellipse cx="35" cy="40" rx="16" ry="6" fill={a} />
        <ellipse cx="35" cy="34" rx="10" ry="4" fill={color} />
        {[ -20, -8, 8, 20 ].map((dx, i) => (
          <ellipse
            key={i}
            cx={35 + dx * 0.4}
            cy={22}
            rx="5"
            ry="14"
            fill="#6B8F71"
            opacity="0.85"
            transform={`rotate(${dx} 35 34)`}
          />
        ))}
        <circle cx="35" cy="14" r="5" fill="#E8A838" />
      </svg>
    );
  }

  if (n.includes('urli')) {
    return (
      <svg viewBox="0 0 100 55" className="w-full h-full">
        <ellipse cx="50" cy="38" rx="40" ry="12" fill={a} />
        <ellipse cx="50" cy="32" rx="34" ry="10" fill="#3A6B7A" opacity="0.45" />
        {[30, 42, 55, 68].map((x, i) => (
          <circle key={i} cx={x} cy={28 + (i % 2) * 3} r="6" fill={i % 2 === 0 ? color : '#E8A838'} />
        ))}
      </svg>
    );
  }

  if (n.includes('rangoli')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="42" fill="none" stroke={a} strokeWidth="3" />
        <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <ellipse
              key={i}
              cx={50 + Math.cos(rad) * 34}
              cy={50 + Math.sin(rad) * 34}
              rx="6"
              ry="10"
              fill={i % 2 === 0 ? color : a}
              transform={`rotate(${deg} ${50 + Math.cos(rad) * 34} ${50 + Math.sin(rad) * 34})`}
            />
          );
        })}
        <circle cx="50" cy="50" r="10" fill={a} />
      </svg>
    );
  }

  if (n.includes('balloon') && n.includes('cluster')) {
    return (
      <svg viewBox="0 0 80 110" className="w-full h-full">
        {[
          [40, 28, 16],
          [22, 42, 14],
          [58, 42, 14],
          [30, 58, 12],
          [50, 58, 12],
        ].map(([cx, cy, r], i) => (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={r} ry={r + 4} fill={i % 2 === 0 ? color : a} opacity="0.9" />
            <line x1={cx} y1={cy + r + 2} x2={40} y2="100" stroke={a} strokeWidth="1" opacity="0.5" />
          </g>
        ))}
        <rect x="36" y="98" width="8" height="8" rx="1" fill={a} />
      </svg>
    );
  }

  if (n.includes('hoop')) {
    return (
      <svg viewBox="0 0 100 110" className="w-full h-full">
        <circle cx="50" cy="55" r="38" fill="none" stroke={a} strokeWidth="4" />
        {[0, 40, 80, 120, 200, 240, 280].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 50 + Math.cos(rad) * 38;
          const cy = 55 + Math.sin(rad) * 38;
          return <circle key={i} cx={cx} cy={cy} r={6 + (i % 3)} fill={i % 2 === 0 ? color : a} />;
        })}
        <line x1="50" y1="8" x2="50" y2="17" stroke={a} strokeWidth="2" />
      </svg>
    );
  }

  if (n.includes('cake')) {
    return (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <ellipse cx="40" cy="88" rx="28" ry="6" fill={a} opacity="0.5" />
        <rect x="16" y="62" width="48" height="26" rx="3" fill={color} stroke={a} />
        <rect x="22" y="42" width="36" height="22" rx="3" fill="#FAF7F2" stroke={a} />
        <rect x="28" y="26" width="24" height="18" rx="3" fill={color} stroke={a} />
        <circle cx="40" cy="20" r="5" fill={a} />
      </svg>
    );
  }

  if (n.includes('birdcage')) {
    return (
      <svg viewBox="0 0 70 110" className="w-full h-full">
        <ellipse cx="35" cy="28" rx="22" ry="18" fill="none" stroke={a} strokeWidth="2.5" />
        <rect x="13" y="28" width="44" height="55" fill="none" stroke={a} strokeWidth="2.5" />
        {[18, 28, 38, 48].map((x) => (
          <line key={x} x1={x} y1="28" x2={x} y2="83" stroke={a} strokeWidth="1.5" opacity="0.7" />
        ))}
        <rect x="13" y="80" width="44" height="8" fill={a} />
        <circle cx="35" cy="12" r="5" fill={a} />
        <line x1="35" y1="17" x2="35" y2="28" stroke={a} strokeWidth="2" />
      </svg>
    );
  }

  if (n.includes('gift')) {
    return (
      <svg viewBox="0 0 90 80" className="w-full h-full">
        <rect x="18" y="32" width="54" height="40" rx="3" fill={color} stroke={a} />
        <rect x="42" y="32" width="6" height="40" fill={a} />
        <rect x="18" y="48" width="54" height="6" fill={a} />
        <rect x="28" y="18" width="34" height="16" rx="2" fill={a} opacity="0.85" />
        <path d="M45 18 Q38 8 32 18" fill="none" stroke={color} strokeWidth="2" />
        <path d="M45 18 Q52 8 58 18" fill="none" stroke={color} strokeWidth="2" />
      </svg>
    );
  }

  if (n.includes('number')) {
    return (
      <svg viewBox="0 0 50 80" className="w-full h-full">
        <rect x="8" y="10" width="34" height="48" rx="3" fill={color} opacity="0.9" />
        <text
          x="25"
          y="42"
          textAnchor="middle"
          fill={a}
          fontSize="22"
          fontFamily="serif"
          fontWeight="600"
        >
          12
        </text>
        <rect x="20" y="58" width="10" height="16" fill={a} />
      </svg>
    );
  }

  if (n.includes('frame') || n.includes('photo frame')) {
    return (
      <svg viewBox="0 0 70 90" className="w-full h-full">
        <rect x="8" y="8" width="54" height="70" rx="2" fill={a} />
        <rect x="14" y="14" width="42" height="52" fill="#FAF7F2" opacity="0.5" />
        <circle cx="35" cy="40" r="12" fill={color} opacity="0.35" />
        <rect x="30" y="78" width="10" height="8" fill={a} />
      </svg>
    );
  }

  if (n.includes('confetti')) {
    return (
      <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
        {Array.from({ length: 16 }).map((_, i) => (
          <rect
            key={i}
            x={6 + i * 6}
            y={8 + (i % 4) * 6}
            width="4"
            height="7"
            fill={i % 2 === 0 ? color : a}
            opacity="0.85"
            transform={`rotate(${(i * 23) % 70} ${8 + i * 6} ${12 + (i % 4) * 6})`}
          />
        ))}
      </svg>
    );
  }

  if (n.includes('urn')) {
    return (
      <svg viewBox="0 0 60 95" className="w-full h-full">
        <defs>
          <linearGradient id={`urn-${uid}`} x1="0" x2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="40%" stopColor={color} />
            <stop offset="100%" stopColor={a} />
          </linearGradient>
        </defs>
        <ellipse cx="30" cy="16" rx="18" ry="6" fill={a} />
        <path d="M14 18 Q8 48 18 78 H42 Q52 48 46 18 Z" fill={`url(#urn-${uid})`} />
        <ellipse cx="30" cy="78" rx="14" ry="5" fill={a} />
        <path d="M22 40 Q30 48 38 40" fill="none" stroke="#FAF7F2" strokeWidth="1.5" opacity="0.35" />
      </svg>
    );
  }

  if (n.includes('mirror')) {
    return (
      <svg viewBox="0 0 70 110" className="w-full h-full">
        <defs>
          <linearGradient id={`mir-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <ellipse cx="35" cy="48" rx="28" ry="40" fill={a} />
        <ellipse cx="35" cy="48" rx="22" ry="34" fill={`url(#mir-${uid})`} stroke={color} />
        <rect x="30" y="88" width="10" height="14" fill={a} />
        <rect x="22" y="100" width="26" height="6" rx="1" fill={a} />
      </svg>
    );
  }

  // welcome sign
  return (
    <svg viewBox="0 0 90 110" className="w-full h-full">
      <rect x="12" y="18" width="66" height="78" rx="6" fill={color} opacity="0.92" />
      <rect x="20" y="28" width="50" height="48" rx="3" fill="#FAF7F2" opacity="0.28" />
      <line x1="28" y1="42" x2="62" y2="42" stroke={a} strokeWidth="2" opacity="0.7" />
      <line x1="32" y1="52" x2="58" y2="52" stroke={a} strokeWidth="1.5" opacity="0.45" />
      <line x1="36" y1="62" x2="54" y2="62" stroke={a} strokeWidth="1.5" opacity="0.35" />
      <circle cx="45" cy="12" r="7" fill={a} />
      <rect x="40" y="96" width="10" height="10" fill={a} />
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
