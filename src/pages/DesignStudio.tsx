import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import type { CanvasElement, Design, LibraryItem, StudioSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/data/themes';
import { DEMO_TEMPLATES } from '@/data/mock';
import { estimateBudget } from '@/lib/budget';
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
import { clamp } from '@/lib/utils';

interface StudioState {
  elements: CanvasElement[];
  settings: StudioSettings;
}

const EMPTY: StudioState = {
  elements: [],
  settings: { ...DEFAULT_SETTINGS },
};

export function DesignStudio() {
  const { designs, saveDesign, activeDesignId, setActiveDesignId } = useApp();
  const { toast } = useToast();
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
  const [hydrated, setHydrated] = useState(false);

  // Load from active design / template query once
  useEffect(() => {
    if (hydrated) return;
    const templateId = params.get('template');
    const loadId = params.get('design') ?? activeDesignId;

    if (templateId) {
      const tpl = DEMO_TEMPLATES.find((t) => t.id === templateId);
      if (tpl) {
        const els = tpl.elements.map((el) => ({ ...el, id: uuid() }));
        reset({ elements: els, settings: { ...tpl.settings } });
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
        reset({ elements: d.elements, settings: d.settings });
        setDesignName(d.name);
        setDesignId(d.id);
        setHydrated(true);
        return;
      }
    }

    // Fresh studio with a starter scene
    const starter = DEMO_TEMPLATES[0];
    reset({
      elements: starter.elements.map((el) => ({ ...el, id: uuid() })),
      settings: { ...starter.settings },
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

  const budget = useMemo(
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

  // Live drag updates without flooding undo — record on each change is ok for demo;
  // for smoother UX we could debounce history. Keeping simple: update with history.
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

  // Commit history after drag ends by wrapping: CanvasItem fires many updates with recordHistory false.
  // We'll push a history snapshot when selection changes or settings change.

  const handleSettings = useCallback(
    (settings: StudioSettings) => {
      set((s) => ({ ...s, settings }));
    },
    [set],
  );

  const handleSave = () => {
    const now = new Date().toISOString();
    const existing = designs.find((d) => d.id === designId);
    const design: Design = {
      id: designId,
      name: designName.trim() || 'Untitled design',
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      thumbnailTheme: present.settings.themeId,
      elements: present.elements,
      settings: present.settings,
      estimatedBudget: budget,
      isFavorite: existing?.isFavorite ?? false,
      eventDate: existing?.eventDate,
      notes: existing?.notes,
    };
    saveDesign(design);
    setActiveDesignId(design.id);
    toast('Design saved to this device', 'success');
  };

  const handleExport = () => {
    const payload = {
      name: designName,
      settings: present.settings,
      elements: present.elements,
      illustrativeEstimate: budget,
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

  const handleShare = async () => {
    const text = `Decorly design "${designName}" — illustrative estimate ${budget}. Local demo only.`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast('Share text copied to clipboard', 'success');
      } else {
        setShareOpen(true);
      }
    } catch {
      setShareOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <StudioToolbar
        canUndo={canUndo}
        canRedo={canRedo}
        zoom={zoom}
        onUndo={undo}
        onRedo={redo}
        onZoomIn={() => setZoom((z) => clamp(z + 0.1, 0.5, 1.5))}
        onZoomOut={() => setZoom((z) => clamp(z - 0.1, 0.5, 1.5))}
        onReset={() => setResetOpen(true)}
        onPreview={() => setPreviewOpen(true)}
        onExport={handleExport}
        onSave={handleSave}
        onShare={handleShare}
        designName={designName}
        onNameChange={setDesignName}
      />

      <div className="flex flex-1 min-h-0">
        <div className="hidden md:flex">
          <ElementLibrary onAdd={addItem} />
        </div>

        <DesignCanvas
          elements={present.elements}
          selectedId={selectedId}
          settings={present.settings}
          zoom={zoom}
          onSelect={setSelectedId}
          onUpdateElement={(el) => {
            updateElementLive(el);
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
            estimatedBudget={budget}
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
        title="Share"
        footer={
          <Button variant="secondary" onClick={() => setShareOpen(false)}>
            Close
          </Button>
        }
      >
        <p className="text-sm text-charcoal/70 mb-2">
          Clipboard unavailable. Copy this text manually:
        </p>
        <pre className="text-xs bg-sage/10 p-3 rounded-xl whitespace-pre-wrap">
          {`Decorly design "${designName}" — illustrative estimate ${budget}. Local demo only.`}
        </pre>
      </Modal>
    </div>
  );
}
