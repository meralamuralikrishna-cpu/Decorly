import { useState } from 'react';
import type { CanvasElement, StudioSettings, ArrangementStyle, ThemeId, VenuePlan } from '@/types';
import { THEME_PRESETS } from '@/data/themes';
import { formatINR, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Trash2, Wallet, MessageSquareQuote, Upload, X } from 'lucide-react';

interface Props {
  settings: StudioSettings;
  onSettingsChange: (s: StudioSettings) => void;
  selected: CanvasElement | null;
  onUpdateSelected: (el: CanvasElement) => void;
  onDeleteSelected: () => void;
  estimatedBudget: number;
  venuePlan: VenuePlan;
  onVenuePlanChange: (v: VenuePlan) => void;
  onApplyToBudget: () => void;
  onRequestQuote: () => void;
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
  venuePlan,
  onVenuePlanChange,
  onApplyToBudget,
  onRequestQuote,
}: Props) {
  const [uploadHint, setUploadHint] = useState<string | null>(null);

  const onUpload = (file: File | null) => {
    setUploadHint(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadHint('Use a PNG, JPG, or WebP image.');
      return;
    }
    if (file.size > 4_000_000) {
      setUploadHint('Image must be under 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onVenuePlanChange({
        ...venuePlan,
        enabled: true,
        imageDataUrl: String(reader.result),
      });
      setUploadHint('Floor plan attached — place décor to scale.');
    };
    reader.onerror = () => setUploadHint('Could not read that image.');
    reader.readAsDataURL(file);
  };

  return (
    <aside className="w-64 lg:w-72 shrink-0 border-l border-sage/30 bg-white/60 flex flex-col h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {venuePlan.enabled && (
          <section className="space-y-3 rounded-xl border border-champagne/40 bg-champagne/5 p-3">
            <h2 className="font-display text-lg text-forest">Venue floor plan</h2>
            <p className="text-[10px] text-charcoal/50 leading-relaxed">
              Upload a hall sketch. Set real dimensions so décor is placed to scale.
            </p>
            <label className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-sage/50 bg-white/70 px-3 py-4 cursor-pointer hover:border-champagne transition text-center">
              <Upload className="h-4 w-4 text-champagne" />
              <span className="text-xs text-charcoal/70">
                {venuePlan.imageDataUrl ? 'Replace floor plan image' : 'Upload hall sketch'}
              </span>
              <span className="text-[10px] text-charcoal/40">PNG / JPG · max 4 MB</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(e) => {
                  onUpload(e.target.files?.[0] ?? null);
                  e.target.value = '';
                }}
              />
            </label>
            {uploadHint && (
              <p
                className={cn(
                  'text-[10px] leading-relaxed',
                  uploadHint.includes('must') || uploadHint.includes('Could') || uploadHint.includes('Use')
                    ? 'text-red-700'
                    : 'text-forest',
                )}
              >
                {uploadHint}
              </p>
            )}
            {venuePlan.imageDataUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  onVenuePlanChange({ ...venuePlan, imageDataUrl: null });
                  setUploadHint(null);
                }}
              >
                <X className="h-3.5 w-3.5" />
                Clear image
              </Button>
            )}
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[10px] text-charcoal/60">
                Width (ft)
                <input
                  type="number"
                  min={10}
                  max={200}
                  className="w-full h-8 mt-0.5 px-2 rounded-lg border border-sage/40 text-xs"
                  value={venuePlan.widthFt}
                  onChange={(e) =>
                    onVenuePlanChange({
                      ...venuePlan,
                      widthFt: Math.max(10, Number(e.target.value) || 10),
                    })
                  }
                />
              </label>
              <label className="text-[10px] text-charcoal/60">
                Depth (ft)
                <input
                  type="number"
                  min={10}
                  max={200}
                  className="w-full h-8 mt-0.5 px-2 rounded-lg border border-sage/40 text-xs"
                  value={venuePlan.depthFt}
                  onChange={(e) =>
                    onVenuePlanChange({
                      ...venuePlan,
                      depthFt: Math.max(10, Number(e.target.value) || 10),
                    })
                  }
                />
              </label>
            </div>
            <p className="text-[10px] text-charcoal/45">
              Hall scale: {venuePlan.widthFt} × {venuePlan.depthFt} ft
            </p>
            <label className="flex items-center gap-2 text-xs text-charcoal/70">
              <input
                type="checkbox"
                checked={venuePlan.showGrid}
                onChange={(e) =>
                  onVenuePlanChange({ ...venuePlan, showGrid: e.target.checked })
                }
                className="accent-forest"
              />
              Show scale grid
            </label>
          </section>
        )}

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
            {venuePlan.enabled && (
              <p className="text-[10px] text-champagne">
                ≈ {(selected.width / (800 / Math.max(10, venuePlan.widthFt))).toFixed(1)} ft ×{' '}
                {(selected.height / (480 / Math.max(10, venuePlan.depthFt))).toFixed(1)} ft
              </p>
            )}
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

        <section className="border-t border-sage/30 pt-4 space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-champagne font-medium mb-1">
            Illustrative estimate
          </p>
          <p className="font-display text-3xl text-forest">{formatINR(estimatedBudget)}</p>
          <p className="text-[10px] text-charcoal/45 leading-relaxed">
            Deterministic mock figure based on elements and settings. Not a real quote or payment.
          </p>
          <Button variant="secondary" size="sm" className="w-full" onClick={onApplyToBudget}>
            <Wallet className="h-3.5 w-3.5" />
            Apply to budget
          </Button>
          <Button variant="gold" size="sm" className="w-full" onClick={onRequestQuote}>
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Request quote
          </Button>
        </section>
      </div>
    </aside>
  );
}
