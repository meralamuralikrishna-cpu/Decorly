import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        if (!open)
            return;
        const onKey = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', onKey);
        dialogRef.current?.focus();
        return () => document.removeEventListener('keydown', onKey);
    }, [open, onClose]);
    if (!open)
        return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" role="presentation">
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]" onClick={onClose}/>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} className={cn('relative z-10 w-full bg-ivory/95 backdrop-blur-md rounded-2xl shadow-2xl border border-sage/30 animate-scale-in outline-none', size === 'sm' && 'max-w-sm', size === 'md' && 'max-w-lg', size === 'lg' && 'max-w-2xl')}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-sage/30">
          <h2 id="modal-title" className="font-display text-xl text-forest">
            {title}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog">
            <X className="h-4 w-4"/>
          </Button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && (<div className="px-5 py-4 border-t border-sage/30 flex justify-end gap-2">{footer}</div>)}
      </div>
    </div>);
}
export function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger, }) {
    return (<Modal open={open} onClose={onCancel} title={title} size="sm" footer={<>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>}>
      <p className="text-sm text-charcoal/80">{message}</p>
    </Modal>);
}
