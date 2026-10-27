import { forwardRef } from 'react';
import type { CanvasElement, StudioSettings, VenuePlan } from '@/types';
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
  /** Hide scale bar / empty hint (e.g. during PNG capture). */
  hideChrome?: boolean;
  venuePlan?: VenuePlan;
  onSelect: (id: string | null) => void;
  onUpdateElement: (el: CanvasElement) => void;
  onDeleteElement?: (id: string) => void;
  onInteractionStart?: () => void;
}

export const DesignCanvas = forwardRef<HTMLDivElement, Props>(function DesignCanvas(
  {
    elements,
    selectedId,
    settings,
    zoom,
    preview,
    hideChrome,
    venuePlan,
    onSelect,
    onUpdateElement,
    onDeleteElement,
    onInteractionStart,
  },
  ref,
) {
  const theme = getTheme(settings.themeId);
  const lightOpacity = settings.lightingIntensity / 100;
  const floorMode = !!venuePlan?.enabled;
  const widthFt = Math.max(10, venuePlan?.widthFt ?? 40);
  const depthFt = Math.max(10, venuePlan?.depthFt ?? 28);
  const pxPerFtX = CANVAS_W / widthFt;
  const pxPerFtY = CANVAS_H / depthFt;

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
          ref={ref}
          className="relative origin-top-left"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${zoom})`,
          }}
          onMouseDown={() => onSelect(null)}
          role="application"
          aria-label={floorMode ? 'Venue floor-plan canvas' : 'Design canvas'}
        >
          {/* Scene / venue base */}
          {floorMode && venuePlan?.imageDataUrl ? (
            <img
              src={venuePlan.imageDataUrl}
              alt="Venue floor plan"
              className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none"
              draggable={false}
            />
          ) : floorMode ? (
            <div
              className="absolute inset-0"
              style={{
                background: `
                  linear-gradient(90deg, rgba(36,61,53,0.06) 1px, transparent 1px),
                  linear-gradient(rgba(36,61,53,0.06) 1px, transparent 1px),
                  #EDE6DC
                `,
                backgroundSize: `${pxPerFtX}px ${pxPerFtY}px, ${pxPerFtX}px ${pxPerFtY}px, auto`,
              }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${theme.palette.backdrop} 0%, ${theme.palette.secondary} 70%, ${theme.palette.platform} 100%)`,
              }}
            />
          )}

          {/* Soft floor wash (scene mode only) */}
          {!floorMode && (
            <div
              className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${theme.palette.accent}${Math.round(lightOpacity * 40).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              }}
            />
          )}

          {/* Ambient lighting overlay */}
          {!floorMode && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity"
              style={{
                opacity: lightOpacity * 0.55,
                background: `radial-gradient(circle at 50% 20%, ${theme.palette.accent} 0%, transparent 55%)`,
              }}
            />
          )}

          {/* Density hint: extra soft petals when high */}
          {!floorMode && settings.flowerDensity > 70 && (
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

          {/* Floor-plan grid overlay */}
          {floorMode && venuePlan?.showGrid && venuePlan.imageDataUrl && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, rgba(36,61,53,0.18) 1px, transparent 1px),
                  linear-gradient(rgba(36,61,53,0.18) 1px, transparent 1px)
                `,
                backgroundSize: `${pxPerFtX}px ${pxPerFtY}px`,
              }}
            />
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
                onDelete={onDeleteElement}
                onInteractionStart={onInteractionStart}
                canvasWidth={CANVAS_W}
                canvasHeight={CANVAS_H}
              />
            ))}

          {/* Scale bar */}
          {floorMode && !hideChrome && (
            <div
              className="absolute bottom-3 left-3 pointer-events-none flex items-end gap-2"
              data-export-hide="true"
            >
              <div className="bg-forest/85 text-ivory text-[10px] px-2 py-1 rounded-lg shadow">
                <div
                  className="h-1.5 bg-champagne rounded-sm mb-1"
                  style={{ width: Math.min(120, pxPerFtX * 5) }}
                />
                5 ft · {widthFt}×{depthFt} ft hall
              </div>
            </div>
          )}

          {!preview && !hideChrome && elements.length === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              data-export-hide="true"
            >
              <p className="font-display text-2xl text-forest/40">
                {floorMode
                  ? 'Upload a floor plan, then place décor to scale'
                  : 'Add elements from the library'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
