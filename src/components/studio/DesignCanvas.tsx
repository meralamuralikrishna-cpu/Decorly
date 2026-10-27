import type { CanvasElement, StudioSettings } from '@/types';
import { getTheme } from '@/data/themes';
import { CanvasItem } from './CanvasItem';
import { cn } from '@/lib/utils';

export const CANVAS_W = 800;
export const CANVAS_H = 480;

interface Props {
  elements: CanvasElement[];
  selectedId: string | null;
  settings: StudioSettings;
  zoom: number;
  preview?: boolean;
  onSelect: (id: string | null) => void;
  onUpdateElement: (el: CanvasElement) => void;
  onInteractionStart?: () => void;
}

export function DesignCanvas({
  elements,
  selectedId,
  settings,
  zoom,
  preview,
  onSelect,
  onUpdateElement,
  onInteractionStart,
}: Props) {
  const theme = getTheme(settings.themeId);
  const lightOpacity = settings.lightingIntensity / 100;

  return (
    <div className="flex-1 overflow-auto flex items-center justify-center p-4 md:p-8 bg-[#F3EEE6]">
      <div
        className={cn(
          'relative shadow-xl rounded-2xl overflow-hidden border border-sage/30 transition-transform origin-center',
          preview && 'pointer-events-none',
        )}
        style={{
          width: CANVAS_W * zoom,
          height: CANVAS_H * zoom,
        }}
      >
        <div
          className="relative origin-top-left"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${zoom})`,
          }}
          onMouseDown={() => onSelect(null)}
          role="application"
          aria-label="Design canvas"
        >
          {/* Scene base */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${theme.palette.backdrop} 0%, ${theme.palette.secondary} 70%, ${theme.palette.platform} 100%)`,
            }}
          />

          {/* Soft floor wash */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, ${theme.palette.accent}${Math.round(lightOpacity * 40).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
            }}
          />

          {/* Ambient lighting overlay */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity"
            style={{
              opacity: lightOpacity * 0.55,
              background: `radial-gradient(circle at 50% 20%, ${theme.palette.accent} 0%, transparent 55%)`,
            }}
          />

          {/* Density hint: extra soft petals when high */}
          {settings.flowerDensity > 70 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              {Array.from({ length: Math.floor((settings.flowerDensity - 70) / 5) }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 18 + (i % 4) * 6,
                    height: 18 + (i % 4) * 6,
                    left: 40 + ((i * 97) % 700),
                    top: 60 + ((i * 53) % 300),
                    background: theme.palette.primary,
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>
          )}

          {[...elements]
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((el) => (
              <CanvasItem
                key={el.id}
                element={el}
                selected={!preview && selectedId === el.id}
                zoom={zoom}
                density={settings.flowerDensity}
                onSelect={onSelect}
                onChange={onUpdateElement}
                onInteractionStart={onInteractionStart}
                canvasWidth={CANVAS_W}
                canvasHeight={CANVAS_H}
              />
            ))}

          {!preview && elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="font-display text-2xl text-forest/40">
                Add elements from the library
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
