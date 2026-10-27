import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  addShareComment,
  getSharedDesign,
  setShareStatus,
} from '@/lib/share';
import type { SharedDesign, ShareStatus } from '@/types';
import { DesignCanvas } from '@/components/studio/DesignCanvas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, DemoBadge } from '@/components/ui/Badge';
import { formatDate, formatINR, cn } from '@/lib/utils';
import { Check, MessageCircle, PencilLine } from 'lucide-react';

const STATUS_LABEL: Record<ShareStatus, string> = {
  pending: 'Awaiting family feedback',
  approved: 'Approved',
  changes: 'Changes requested',
};

const STATUS_STYLE: Record<ShareStatus, string> = {
  pending: 'bg-champagne/25 text-charcoal',
  approved: 'bg-sage/40 text-forest',
  changes: 'bg-blush/50 text-charcoal',
};

export function ShareView() {
  const { shareId } = useParams<{ shareId: string }>();
  const [share, setShare] = useState<SharedDesign | null>(null);
  const [missing, setMissing] = useState(false);
  const [author, setAuthor] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [flash, setFlash] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!shareId) {
      setMissing(true);
      return;
    }
    const found = getSharedDesign(shareId);
    if (!found) {
      setMissing(true);
      setShare(null);
      return;
    }
    setMissing(false);
    setShare(found);
  }, [shareId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const showFlash = (msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2800);
  };

  const onComment = (e: FormEvent) => {
    e.preventDefault();
    if (!shareId) return;
    if (!body.trim()) {
      setError('Please write a short comment');
      return;
    }
    setError('');
    const next = addShareComment(shareId, author, body);
    if (next) {
      setShare(next);
      setBody('');
      showFlash('Comment saved on this device');
    }
  };

  const onStatus = (status: ShareStatus) => {
    if (!shareId) return;
    const next = setShareStatus(shareId, status, author || undefined);
    if (next) {
      setShare(next);
      showFlash(
        status === 'approved'
          ? 'Look approved — designer will see this locally'
          : 'Changes requested',
      );
    }
  };

  if (missing) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col">
        <header className="border-b border-sage/30 bg-white/70 backdrop-blur px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl text-forest tracking-wide">
            Decorly
          </Link>
          <DemoBadge />
        </header>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-4">
            <h1 className="font-display text-3xl text-forest">Share link not found</h1>
            <p className="text-sm text-charcoal/60 leading-relaxed">
              Guest shares are stored in this browser only. Open the link on the same device
              where it was created, or ask the designer to share again.
            </p>
            <Link to="/studio">
              <Button variant="gold">Open Design Studio</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!share) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center text-charcoal/50 text-sm">
        Loading share…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EEE6]">
      <header className="border-b border-sage/30 bg-white/80 backdrop-blur sticky top-0 z-20 px-4 md:px-8 py-3 flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/" className="font-display text-2xl text-forest tracking-wide shrink-0">
            Decorly
          </Link>
          <span className="text-sage/60 hidden sm:inline">·</span>
          <div className="min-w-0">
            <p className="font-display text-lg text-forest truncate">{share.name}</p>
            <p className="text-[11px] text-charcoal/50">
              Shared {formatDate(share.createdAt)} · guest view
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn(STATUS_STYLE[share.status])}>{STATUS_LABEL[share.status]}</Badge>
          <DemoBadge />
        </div>
      </header>

      {flash && (
        <div
          role="status"
          className="mx-auto max-w-3xl mt-3 px-4"
        >
          <p className="text-xs text-center bg-forest text-ivory rounded-full py-2 px-4 shadow animate-fade-in">
            {flash}
          </p>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
        <section className="rounded-2xl overflow-hidden border border-sage/30 shadow-lg bg-white/40">
          <DesignCanvas
            elements={share.elements}
            selectedId={null}
            settings={share.settings}
            venuePlan={share.venuePlan}
            zoom={1}
            preview
            onSelect={() => {}}
            onUpdateElement={() => {}}
          />
        </section>

        <div className="grid md:grid-cols-[1fr_280px] gap-6 items-start">
          <section className="bg-white/70 border border-sage/30 rounded-2xl p-5 md:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-champagne" />
              <h2 className="font-display text-2xl text-forest">Family comments</h2>
            </div>
            {share.comments.length === 0 ? (
              <p className="text-sm text-charcoal/50">No comments yet — be the first.</p>
            ) : (
              <ul className="space-y-3">
                {share.comments.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-xl bg-sage/10 border border-sage/20 px-3 py-2.5"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-medium text-forest">{c.author}</p>
                      <p className="text-[10px] text-charcoal/40">{formatDate(c.createdAt)}</p>
                    </div>
                    <p className="text-sm text-charcoal/80 mt-1 leading-relaxed">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}

            <form onSubmit={onComment} className="space-y-3 pt-2 border-t border-sage/20">
              <Input
                label="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Amma, Sister"
              />
              <label className="block text-xs text-charcoal/70">
                Comment
                <textarea
                  className="w-full mt-1 min-h-[88px] rounded-xl border border-sage/40 bg-white px-3 py-2 text-sm outline-none focus:border-champagne resize-y"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="What do you love? What should change?"
                />
              </label>
              {error && <p className="text-xs text-red-700">{error}</p>}
              <Button type="submit" size="sm">
                Post comment
              </Button>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="bg-white/70 border border-sage/30 rounded-2xl p-5 space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-champagne font-medium">
                Illustrative estimate
              </p>
              <p className="font-display text-3xl text-forest">
                {formatINR(share.estimatedBudget)}
              </p>
              <p className="text-[10px] text-charcoal/45 leading-relaxed">
                Mock figure for discussion only — not a real quote or payment.
              </p>
              {share.status === 'approved' && share.approvedBy && (
                <p className="text-xs text-forest bg-sage/25 rounded-lg px-3 py-2">
                  Approved by {share.approvedBy}
                  {share.approvedAt ? ` · ${formatDate(share.approvedAt)}` : ''}
                </p>
              )}
            </div>

            <div className="bg-white/70 border border-sage/30 rounded-2xl p-5 space-y-2">
              <h3 className="font-display text-lg text-forest mb-1">Decide</h3>
              <Button
                variant="gold"
                size="sm"
                className="w-full"
                onClick={() => onStatus('approved')}
                disabled={share.status === 'approved'}
              >
                <Check className="h-3.5 w-3.5" />
                Approve this look
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => onStatus('changes')}
              >
                <PencilLine className="h-3.5 w-3.5" />
                Request changes
              </Button>
              <p className="text-[10px] text-charcoal/45 pt-1 leading-relaxed">
                Feedback stays on this browser. Open Studio on the same device to continue editing.
              </p>
              <Link
                to={`/studio?design=${encodeURIComponent(share.designId)}`}
                className="block pt-1"
              >
                <Button variant="ghost" size="sm" className="w-full">
                  Open in Studio
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
