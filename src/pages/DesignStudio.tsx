import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import type { CanvasElement, Design, LibraryItem, StudioSettings, VenuePlan } from '@/types';
import { DEFAULT_SETTINGS } from '@/data/themes';
import { DEMO_TEMPLATES } from '@/data/mock';
import { applyDesignToBudget, estimateBudget } from '@/lib/budget';
import { exportNodeAsPng, nextPaint } from '@/lib/exportPng';
import { createSharedDesign, DEFAULT_VENUE_PLAN, shareUrl } from '@/lib/share';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { useUndoRedo } from '@/hooks/useUndoRedo';
import { ConfirmDialog, Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StudioToolbar } from '@/components/studio/StudioToolbar';
import { ElementLibrary } from '@/components/studio/ElementLibrary';
import { MobileLibrary } from '@/components/studio/MobileLibrary';
import { DesignCanvas, CANVAS_W, CANVAS_H } from '@/components/studio/DesignCanvas';
import { PropertiesPanel } from '@/components/studio/PropertiesPanel';
import { categoryDefaultSize } from '@/components/studio/ElementVisual';
import { clamp, formatINR } from '@/lib/utils';

interface StudioState {
  elements: CanvasElement[];
  settings: StudioSettings;
  venuePlan: VenuePlan;
}

const EMPTY: StudioState = {
  elements: [],
  settings: { ...DEFAULT_SETTINGS },
  venuePlan: DEFAULT_VENUE_PLAN(),
};

export function DesignStudio() {
  const { designs, saveDesign, activeDesignId, setActiveDesignId, budget, setBudget } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { present, set, undo, redo, reset, canUndo, canRedo, commitSnapshot } =
    useUndoRedo<StudioState>(EMPTY);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.9);
  const [designName, setDesignName] = useState('Untitled design');
  const [designId, setDesignId] = useState(() => uuid());
  const [previewOpen, setPreviewOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [exporting, setExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hydrated) return;
    const templateId = params.get('template');
    const loadId = params.get('design') ?? activeDesignId;

    if (templateId) {
      const tpl = DEMO_TEMPLATES.find((t) => t.id === templateId);
      if (tpl) {
        const els = tpl.elements.map((el) => ({ ...el, id: uuid() }));
        reset({
          elements: els,
          settings: { ...tpl.settings },
          venuePlan: DEFAULT_VENUE_PLAN(),
        });
        setDesignName(tpl.name + ' (copy)');
        setDesignId(uuid());
        setActiveDesignId(null);
        setHydrated(true);
        return;
      }
    }

    if (loadId) {
      const d = designs.find((x) => x.id === loadId);
      if (d) {
        reset({
          elements: d.elements,
          settings: d.settings,
          venuePlan: d.venuePlan ?? DEFAULT_VENUE_PLAN(),
        });
        setDesignName(d.name);
        setDesignId(d.id);
        setHydrated(true);
        return;
      }
    }

    const starter = DEMO_TEMPLATES[0];
    reset({
      elements: starter.elements.map((el) => ({ ...el, id: uuid() })),
      settings: { ...starter.settings },
      venuePlan: DEFAULT_VENUE_PLAN(),
    });
    setDesignName('New celebration look');
    setDesignId(uuid());
    setHydrated(true);
  }, [hydrated, params, activeDesignId, designs, reset, setActiveDesignId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (selectedId) {
          e.preventDefault();
          set((s) => ({
            ...s,
            elements: s.elements.filter((el) => el.id !== selectedId),
          }));
          setSelectedId(null);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo, selectedId, set]);

  const budgetEstimate = useMemo(
    () => estimateBudget(present.elements, present.settings),
    [present.elements, present.settings],
  );

  const selected = present.elements.find((e) => e.id === selectedId) ?? null;

  const addItem = useCallback(
    (item: LibraryItem) => {
      const size = categoryDefaultSize(item.category);
      const el: CanvasElement = {
        id: uuid(),
        libraryId: item.id,
        category: item.category,
        name: item.name,
        x: clamp(CANVAS_W / 2 - size.width / 2 + (Math.random() * 40 - 20), 20, CANVAS_W - size.width),
        y: clamp(CANVAS_H / 2 - size.height / 2 + (Math.random() * 40 - 20), 20, CANVAS_H - size.height),
        width: size.width,
        height: size.height,
        rotation: 0,
        color: item.color,
        accent: item.accent,
        zIndex: present.elements.length + 1,
      };
      set((s) => ({ ...s, elements: [...s.elements, el] }));
      setSelectedId(el.id);
      toast(`Added ${item.name}`, 'success');
    },
    [present.elements.length, set, toast],
  );

  const updateElement = useCallback(
    (el: CanvasElement) => {
      set((s) => ({
        ...s,
        elements: s.elements.map((e) => (e.id === el.id ? el : e)),
      }));
    },
    [set],
  );

  const updateElementLive = useCallback(
    (el: CanvasElement) => {
      set(
        (s) => ({
          ...s,
          elements: s.elements.map((e) => (e.id === el.id ? el : e)),
        }),
        false,
      );
    },
    [set],
  );

  const handleSettings = useCallback(
    (settings: StudioSettings) => {
      set((s) => ({ ...s, settings }));
    },
    [set],
  );

  const handleVenuePlan = useCallback(
    (venuePlan: VenuePlan) => {
      set((s) => ({ ...s, venuePlan }));
    },
    [set],
  );

  const buildDesign = (): Design => {
    const now = new Date().toISOString();
    const existing = designs.find((d) => d.id === designId);
    return {
      id: designId,
      name: designName.trim() || 'Untitled design',
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      thumbnailTheme: present.settings.themeId,
      elements: present.elements,
      settings: present.settings,
      estimatedBudget: budgetEstimate,
      isFavorite: existing?.isFavorite ?? false,
      eventDate: existing?.eventDate,
      notes: existing?.notes,
      venuePlan: present.venuePlan,
    };
  };

  const handleSave = () => {
    const design = buildDesign();
    saveDesign(design);
    setActiveDesignId(design.id);
    toast('Design saved to this device', 'success');
  };

  const handleExportJson = () => {
    const payload = {
      name: designName,
      settings: present.settings,
      venuePlan: present.venuePlan,
      elements: present.elements,
      illustrativeEstimate: budgetEstimate,
      exportedAt: new Date().toISOString(),
      note: 'Decorly demo export — illustrative only, no payment data.',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${designName.replace(/\s+/g, '-').toLowerCase() || 'decorly-design'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Exported design JSON', 'success');
  };

  const handleExportPng = async () => {
    if (!canvasRef.current || exporting) return;
    setExporting(true);
    const prevSelected = selectedId;
    setSelectedId(null);
    try {
      await nextPaint();
      if (!canvasRef.current) throw new Error('Canvas unmounted');
      const filename = `${designName.replace(/\s+/g, '-').toLowerCase() || 'decorly-design'}.png`;
      await exportNodeAsPng(canvasRef.current, filename);
      toast('Downloaded PNG — ready to share on WhatsApp', 'success');
    } catch {
      toast('Could not export PNG. Try again after the canvas loads.', 'error');
    } finally {
      setExporting(false);
      if (prevSelected) setSelectedId(prevSelected);
    }
  };

  const handleShareGuest = () => {
    const design = buildDesign();
    saveDesign(design);
    setActiveDesignId(design.id);
    const share = createSharedDesign({
      designId: design.id,
      name: design.name,
      elements: design.elements,
      settings: design.settings,
      venuePlan: design.venuePlan,
      estimatedBudget: design.estimatedBudget,
    });
    const url = shareUrl(share.id);
    setShareLink(url);
    setShareOpen(true);
    void navigator.clipboard?.writeText(url).then(
      () => toast('Guest share link copied', 'success'),
      () => toast('Share link ready — copy from the dialog', 'info'),
    );
  };

  const handleApplyToBudget = () => {
    const next = applyDesignToBudget(
      budget,
      present.elements,
      present.settings,
      designName.trim() || 'Studio design',
    );
    setBudget(next);
    handleSave();
    toast('Design estimate applied to Budget Planner', 'success');
    navigate('/budget');
  };

  const handleRequestQuote = () => {
    const design = buildDesign();
    saveDesign(design);
    setActiveDesignId(design.id);
    navigate(
      `/decorators?design=${encodeURIComponent(design.id)}&estimate=${design.estimatedBudget}`,
    );
    toast('Pick a decorator to request a quote with this design', 'info');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <StudioToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        floorPlanMode={present.venuePlan.enabled}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={() => setZoom((z) => clamp(z + 0.1, 0.5, 1.5))}
        onZoomOut={() => setZoom((z) => clamp(z - 0.1, 0.5, 1.5))}
        onReset={() => setResetOpen(true)}
        onPreview={() => setPreviewOpen(true)}
        onExportJson={handleExportJson}
        onExportPng={() => void handleExportPng()}
        onSave={handleSave}
        onShareGuest={handleShareGuest}
        onToggleFloorPlan={() => {
          const next = !present.venuePlan.enabled;
          set((s) => ({
            ...s,
            venuePlan: { ...s.venuePlan, enabled: next },
          }));
          toast(
            next
              ? 'Floor-plan mode on — set hall size and upload a sketch'
              : 'Scene mode restored',
            'info',
          );
        }}
        designName={designName}
        onNameChange={setDesignName}
      />

      <div className="flex flex-1 min-h-0">
        <div className="hidden md:flex">
          <ElementLibrary onAdd={addItem} />
        </div>

        <DesignCanvas
          ref={canvasRef}
          elements={present.elements}
          selectedId={exporting ? null : selectedId}
          settings={present.settings}
          venuePlan={present.venuePlan}
          zoom={zoom}
          hideChrome={exporting}
          onSelect={setSelectedId}
          onUpdateElement={(el) => {
            updateElementLive(el);
          }}
          onDeleteElement={(id) => {
            set((s) => ({
              ...s,
              elements: s.elements.filter((e) => e.id !== id),
            }));
            setSelectedId(null);
            toast('Element deleted', 'info');
          }}
          onInteractionStart={commitSnapshot}
        />

        <div className="hidden lg:flex">
          <PropertiesPanel
            settings={present.settings}
            onSettingsChange={handleSettings}
            selected={selected}
            onUpdateSelected={updateElement}
            onDeleteSelected={() => {
              if (!selectedId) return;
              set((s) => ({
                ...s,
                elements: s.elements.filter((e) => e.id !== selectedId),
              }));
              setSelectedId(null);
            }}
            estimatedBudget={budgetEstimate}
            venuePlan={present.venuePlan}
            onVenuePlanChange={handleVenuePlan}
            onApplyToBudget={handleApplyToBudget}
            onRequestQuote={handleRequestQuote}
          />
        </div>
      </div>

      <div className="md:hidden">
        <MobileLibrary onAdd={addItem} />
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Reset canvas?"
        message="This clears all elements and restores the default Blush Romance starter. Undo history will reset."
        confirmLabel="Reset"
        danger
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          const starter = DEMO_TEMPLATES[0];
          reset({
            elements: starter.elements.map((el) => ({ ...el, id: uuid() })),
            settings: { ...starter.settings },
            venuePlan: DEFAULT_VENUE_PLAN(),
          });
          setSelectedId(null);
          setResetOpen(false);
          toast('Canvas reset', 'info');
        }}
      />

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview" size="lg">
        <div className="overflow-auto max-h-[70vh]">
          <DesignCanvas
            elements={present.elements}
            selectedId={null}
            settings={present.settings}
            venuePlan={present.venuePlan}
            zoom={0.85}
            preview
            onSelect={() => {}}
            onUpdateElement={() => {}}
          />
        </div>
      </Modal>

      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Guest / family share link"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                void navigator.clipboard?.writeText(shareLink);
                toast('Link copied', 'success');
              }}
            >
              Copy link
            </Button>
            <Button variant="gold" onClick={() => window.open(shareLink, '_blank')}>
              Open guest view
            </Button>
          </>
        }
      >
        <p className="text-sm text-charcoal/70 mb-3 leading-relaxed">
          Anyone with this link (on this browser / device) can view a read-only snapshot, leave
          comments, and approve the look. Stored locally — not a real cloud share.
        </p>
        <p className="text-xs text-champagne mb-2">
          Illustrative estimate: {formatINR(budgetEstimate)}
        </p>
        <pre className="text-xs bg-sage/10 p-3 rounded-xl whitespace-pre-wrap break-all">
          {shareLink}
        </pre>
      </Modal>
    </div>
  );
}
