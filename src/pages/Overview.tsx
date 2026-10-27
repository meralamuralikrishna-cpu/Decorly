import { Link } from 'react-router-dom';
import { ArrowRight, Plus, LayoutTemplate, Calendar, Wallet } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/Badge';
import { BrandMark } from '@/components/brand/BrandMark';
import { Wordmark } from '@/components/brand/Wordmark';
import { POPULAR_COMBOS } from '@/data/mock';
import { getTheme } from '@/data/themes';
import { formatDate, formatINR } from '@/lib/utils';

export function Overview() {
  const { locale, designs, budget, setActiveDesignId } = useApp();
  const recent = [...designs]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);
  const upcoming = designs
    .filter((d) => d.eventDate)
    .sort((a, b) => (a.eventDate ?? '').localeCompare(b.eventDate ?? ''))
    .slice(0, 3);
  const spent = budget.categories.reduce((s, c) => s + c.spent, 0);
  const pct = Math.min(100, Math.round((spent / budget.totalBudget) * 100));

  return (
    <div className="animate-fade-in">
      <section className="lookbook-hero min-h-[520px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center px-6 md:px-10 py-10 md:py-12">
        <div className="relative z-10 animate-brand-in">
          <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-blush/90 mb-5">
            Event decorations design studio
          </p>
          <Wordmark text={t(locale, 'brand')} size="hero" light className="mb-5 block" />
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-ivory/90 leading-snug mb-4 max-w-xl font-normal">
            {t(locale, 'heroTitle')}
          </h1>
          <p className="text-ivory/55 max-w-md mb-8 leading-relaxed text-[15px]">
            {t(locale, 'heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/studio" onClick={() => setActiveDesignId(null)}>
              <Button
                size="lg"
                variant="secondary"
                className="border-0 bg-white hover:bg-white shadow-lg shadow-black/20"
                style={{ color: '#14332b' }}
              >
                <Plus className="h-4 w-4" strokeWidth={2.25} style={{ color: '#14332b' }} />
                {t(locale, 'startDesigning')}
              </Button>
            </Link>
            <Link to="/templates">
              <Button
                size="lg"
                variant="ghost"
                className="text-ivory border border-white/25 hover:bg-white/10 hover:text-ivory"
              >
                <LayoutTemplate className="h-4 w-4" />
                {t(locale, 'browseTemplates')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center md:justify-end pointer-events-none">
          <BrandMark
            tone="soft"
            animated
            className="w-[min(100%,420px)] max-w-[420px] scale-[1.2] origin-center opacity-90 animate-soft-float"
          />
        </div>
      </section>

      <div className="px-6 md:px-10 py-12 grid lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker mb-2">Workspace</p>
              <h2 className="font-display text-3xl text-forest tracking-tight">
                {t(locale, 'recentDesigns')}
              </h2>
            </div>
            <Link
              to="/designs"
              className="text-sm font-semibold text-champagne hover:text-forest transition inline-flex items-center gap-1 shrink-0 mb-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            {recent.map((d, i) => {
              const theme = getTheme(d.thumbnailTheme);
              return (
                <Link
                  key={d.id}
                  to={`/studio?design=${d.id}`}
                  onClick={() => setActiveDesignId(d.id)}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group h-full min-h-[188px]">
                    <div
                      className="h-32 relative"
                      style={{
                        background: `linear-gradient(145deg, ${theme.palette.backdrop}, ${theme.palette.primary})`,
                      }}
                    >
                      <BrandMark
                        tone="light"
                        className="absolute right-2 top-2 h-14 w-auto opacity-30 group-hover:opacity-50 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/30 to-transparent opacity-60" />
                      <div className="absolute bottom-3 left-3 right-3 flex gap-1.5">
                        {[theme.palette.primary, theme.palette.accent, theme.palette.secondary].map(
                          (c) => (
                            <span
                              key={c}
                              className="h-3 w-3 rounded-full border border-white/70 shadow-sm"
                              style={{ background: c }}
                            />
                          ),
                        )}
                      </div>
                    </div>
                    <CardBody className="pt-3.5">
                      <p className="font-semibold text-sm text-forest group-hover:text-champagne transition">
                        {d.name}
                      </p>
                      <p className="text-xs text-charcoal/50 mt-0.5">
                        Updated {formatDate(d.updatedAt)} · {formatINR(d.estimatedBudget)}
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}

            <Link
              to="/studio"
              onClick={() => setActiveDesignId(null)}
              className="animate-slide-up group"
              style={{ animationDelay: `${recent.length * 70}ms` }}
            >
              <div className="h-full min-h-[188px] rounded-2xl border border-dashed border-sage/50 bg-white/30 flex flex-col items-center justify-center gap-2.5 text-charcoal/45 transition-all duration-200 group-hover:border-blush group-hover:text-blush group-hover:bg-blush/5">
                <Plus className="h-7 w-7" strokeWidth={1.75} />
                <span className="text-sm font-semibold">{t(locale, 'newDesign')}</span>
              </div>
            </Link>
          </div>
        </section>

        <div className="space-y-6">
          <section>
            <p className="section-kicker mb-2 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              Schedule
            </p>
            <h2 className="font-display text-2xl text-forest tracking-tight mb-4">
              {t(locale, 'upcomingEvents')}
            </h2>
            <Card>
              <CardBody className="space-y-3.5 pt-5">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-charcoal/50">No upcoming event dates set.</p>
                ) : (
                  upcoming.map((d) => (
                    <div
                      key={d.id}
                      className="flex justify-between items-start gap-2 pb-3 border-b border-sage/15 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{d.name}</p>
                        <p className="text-xs text-charcoal/50">{d.notes ?? 'Saved design'}</p>
                      </div>
                      <span className="text-xs font-semibold text-forest whitespace-nowrap">
                        {d.eventDate && formatDate(d.eventDate)}
                      </span>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </section>

          <section>
            <p className="section-kicker mb-2 flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5" />
              Spend
            </p>
            <h2 className="font-display text-2xl text-forest tracking-tight mb-4">
              {t(locale, 'budgetProgress')}
            </h2>
            <Card>
              <CardBody className="pt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-charcoal/70">{budget.eventName}</p>
                  <DemoBadge />
                </div>
                <p className="font-display text-3xl text-forest mb-3 tracking-tight">
                  {formatINR(spent)}{' '}
                  <span className="text-base text-charcoal/35">/ {formatINR(budget.totalBudget)}</span>
                </p>
                <div className="h-2 rounded-full bg-sage/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-forest via-sage to-champagne transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-charcoal/45 mt-2">{pct}% of demo budget</p>
                <Link
                  to="/budget"
                  className="inline-block mt-3 text-xs font-semibold text-champagne hover:text-forest transition"
                >
                  Open budget planner →
                </Link>
              </CardBody>
            </Card>
          </section>
        </div>
      </div>

      <section className="px-6 md:px-10 pb-16">
        <div className="mb-6">
          <p className="section-kicker mb-2">Palette stories</p>
          <h2 className="font-display text-3xl text-forest tracking-tight">
            {t(locale, 'popularFlowers')}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_COMBOS.map((c, i) => (
            <Link
              key={c.id}
              to={`/studio?theme=${c.themeId}`}
              onClick={() => setActiveDesignId(null)}
              title={t(locale, 'demoPalette')}
              className="animate-slide-up block"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <Card className="overflow-hidden h-full transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(16,36,30,0.1)]">
                <div className="h-20 flex">
                  {c.colors.map((col) => (
                    <div key={col} className="flex-1" style={{ background: col }} />
                  ))}
                </div>
                <CardHeader className="pb-1">
                  <p className="text-sm font-semibold text-forest">{c.name}</p>
                </CardHeader>
                <CardBody>
                  <p className="text-[11px] text-charcoal/45 leading-relaxed">
                    {t(locale, c.occasionKey)}
                  </p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
