import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Download,
  Save,
  Share2,
  Image,
  Map,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Props {
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  floorPlanMode: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onPreview: () => void;
  onExportJson: () => void;
  onExportPng: () => void;
  onSave: () => void;
  onShareGuest: () => void;
  onToggleFloorPlan: () => void;
  designName: string;
  onNameChange: (name: string) => void;
}

export function StudioToolbar({
  canUndo,
  canRedo,
  zoom,
  floorPlanMode,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onReset,
  onPreview,
  onExportJson,
  onExportPng,
  onSave,
  onShareGuest,
  onToggleFloorPlan,
  designName,
  onNameChange,
}: Props) {
  const { locale } = useApp();

  return (
    <div className="h-14 shrink-0 border-b border-sage/30 bg-white/80 backdrop-blur flex items-center gap-2 px-3 overflow-x-auto">
      <input
        type="text"
        value={designName}
        onChange={(e) => onNameChange(e.target.value)}
        className="font-display text-lg text-forest bg-transparent border-b border-transparent focus:border-champagne outline-none min-w-[140px] max-w-[200px]"
        aria-label="Design name"
      />
      <div className="h-6 w-px bg-sage/40 mx-1" />
      <Button variant="ghost" size="icon" onClick={onUndo} disabled={!canUndo} aria-label={t(locale, 'undo')} title={t(locale, 'undo')}>
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onRedo} disabled={!canRedo} aria-label={t(locale, 'redo')} title={t(locale, 'redo')}>
        <Redo2 className="h-4 w-4" />
      </Button>
      <div className="h-6 w-px bg-sage/40 mx-1" />
      <Button variant="ghost" size="icon" onClick={onZoomOut} aria-label="Zoom out">
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="text-xs text-charcoal/60 w-10 text-center tabular-nums">
        {Math.round(zoom * 100)}%
      </span>
      <Button variant="ghost" size="icon" onClick={onZoomIn} aria-label="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </Button>
      <div className="h-6 w-px bg-sage/40 mx-1" />
      <Button
        variant={floorPlanMode ? 'primary' : 'ghost'}
        size="sm"
        onClick={onToggleFloorPlan}
        aria-pressed={floorPlanMode}
        title="Venue floor-plan mode"
      >
        <Map className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Floor plan</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={onReset} aria-label={t(locale, 'reset')}>
        <RotateCcw className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t(locale, 'reset')}</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={onPreview} aria-label={t(locale, 'preview')}>
        <Eye className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t(locale, 'preview')}</span>
      </Button>
      <div className="flex-1" />
      <Button variant="secondary" size="sm" onClick={onExportPng} title="Download PNG image">
        <Image className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">PNG</span>
      </Button>
      <Button variant="secondary" size="sm" onClick={onExportJson}>
        <Download className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{t(locale, 'export')}</span>
      </Button>
      <Button variant="secondary" size="sm" onClick={onShareGuest} title="Guest / family share link">
        <Link2 className="h-3.5 w-3.5" />
        <Share2 className={cn('h-3.5 w-3.5 sm:hidden')} />
        <span className="hidden sm:inline">{t(locale, 'share')}</span>
      </Button>
      <Button variant="gold" size="sm" onClick={onSave}>
        <Save className="h-3.5 w-3.5" />
        {t(locale, 'save')}
      </Button>
    </div>
  );
}
