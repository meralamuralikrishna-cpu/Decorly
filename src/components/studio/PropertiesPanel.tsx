import type { CanvasElement, StudioSettings, ArrangementStyle, ThemeId } from '@/types';
import { THEME_PRESETS } from '@/data/themes';
import { formatINR, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Trash2 } from 'lucide-react';

interface Props {
  settings: StudioSettings;
  onSettingsChange: (s: StudioSettings) => void;
  selected: CanvasElement | null;
  onUpdateSelected: (el: CanvasElement) => void;
  onDeleteSelected: () => void;
  estimatedBudget: number;
}

const STYLES: { value: ArrangementStyle; label: string }[] = [
  { value: 'cascade', label: 'Cascade' },
  { value: 'symmetrical', label: 'Symmetrical' },
  { value: 'asymmetric', label: 'Asymmetric' },
  { value: 'minimal', label: 'Minimal' },
];

export function PropertiesPanel({
  settings,
  onSettingsChange,
  selected,
  onUpdateSelected,
  onDeleteSelected,
  estimatedBudget,
}: Props) {
  return (
    <aside className="w-64 lg:w-72 shrink-0 border-l border-sage/30 bg-white/60 flex flex-col h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        <section>
          <h2 className="font-display text-lg text-forest mb-3">Themes</h2>
          <div className="space-y-2">
            {THEME_PRESETS.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    themeId: theme.id as ThemeId,
                    ...theme.defaultSettings,
                  })
                }
                className={cn(
                  'w-full text-left rounded-xl border p-2.5 transition',
                  settings.themeId === theme.id
                    ? 'border-champagne bg-champagne/10 ring-1 ring-champagne/40'
                    : 'border-sage/30 hover:border-sage',
                )}
              >
                <div className="flex gap-1.5 mb-1.5">
                  {[theme.palette.primary, theme.palette.secondary, theme.palette.accent].map(
                    (c) => (
                      <span
                        key={c}
                        className="h-4 w-4 rounded-full border border-white shadow-sm"
                        style={{ background: c }}
                      />
                    ),
                  )}
                </div>
                <p className="text-xs font-medium text-charcoal">{theme.name}</p>
                <p className="text-[10px] text-charcoal/50">{theme.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-lg text-forest">Arrangement</h2>
          <label className="block text-xs text-charcoal/70">
            Flower density
            <input
              type="range"
              min={10}
              max={100}
              value={settings.flowerDensity}
              onChange={(e) =>
                onSettingsChange({ ...settings, flowerDensity: Number(e.target.value) })
              }
              className="w-full mt-1 accent-forest"
              aria-valuetext={`${settings.flowerDensity}%`}
            />
            <span className="text-[10px] text-charcoal/40">{settings.flowerDensity}%</span>
          </label>
          <label className="block text-xs text-charcoal/70">
            Lighting intensity
            <input
              type="range"
              min={10}
              max={100}
              value={settings.lightingIntensity}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  lightingIntensity: Number(e.target.value),
                })
              }
              className="w-full mt-1 accent-champagne"
            />
            <span className="text-[10px] text-charcoal/40">{settings.lightingIntensity}%</span>
          </label>
          <fieldset>
            <legend className="text-xs text-charcoal/70 mb-1.5">Arrangement style</legend>
            <div className="grid grid-cols-2 gap-1.5">
              {STYLES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() =>
                    onSettingsChange({ ...settings, arrangementStyle: s.value })
                  }
                  className={cn(
                    'px-2 py-1.5 rounded-lg text-[11px] border transition',
                    settings.arrangementStyle === s.value
                      ? 'bg-forest text-ivory border-forest'
                      : 'border-sage/40 text-charcoal/70 hover:bg-sage/20',
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
        </section>

        {selected && (
          <section className="space-y-2 border-t border-sage/30 pt-4">
            <h2 className="font-display text-lg text-forest">Selected</h2>
            <p className="text-xs font-medium">{selected.name}</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[10px] text-charcoal/60">
                Width
                <input
                  type="number"
                  className="w-full h-8 mt-0.5 px-2 rounded-lg border border-sage/40 text-xs"
                  value={Math.round(selected.width)}
                  onChange={(e) =>
                    onUpdateSelected({ ...selected, width: Number(e.target.value) || 40 })
                  }
                />
              </label>
              <label className="text-[10px] text-charcoal/60">
                Height
                <input
                  type="number"
                  className="w-full h-8 mt-0.5 px-2 rounded-lg border border-sage/40 text-xs"
                  value={Math.round(selected.height)}
                  onChange={(e) =>
                    onUpdateSelected({ ...selected, height: Number(e.target.value) || 30 })
                  }
                />
              </label>
              <label className="text-[10px] text-charcoal/60">
                Rotation
                <input
                  type="number"
                  className="w-full h-8 mt-0.5 px-2 rounded-lg border border-sage/40 text-xs"
                  value={selected.rotation}
                  onChange={(e) =>
                    onUpdateSelected({
                      ...selected,
                      rotation: Number(e.target.value) || 0,
                    })
                  }
                />
              </label>
              <label className="text-[10px] text-charcoal/60">
                Color
                <input
                  type="color"
                  className="w-full h-8 mt-0.5 rounded-lg border border-sage/40 cursor-pointer"
                  value={selected.color}
                  onChange={(e) =>
                    onUpdateSelected({ ...selected, color: e.target.value })
                  }
                />
              </label>
            </div>
            <Button variant="danger" size="sm" className="w-full mt-2" onClick={onDeleteSelected}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete element
            </Button>
          </section>
        )}

        <section className="border-t border-sage/30 pt-4">
          <p className="text-[10px] uppercase tracking-wider text-champagne font-medium mb-1">
            Illustrative estimate
          </p>
          <p className="font-display text-3xl text-forest">{formatINR(estimatedBudget)}</p>
          <p className="text-[10px] text-charcoal/45 mt-1 leading-relaxed">
            Deterministic mock figure based on elements and settings. Not a real quote or payment.
          </p>
        </section>
      </div>
    </aside>
  );
}
