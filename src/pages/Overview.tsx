import { Link } from 'react-router-dom';
import { ArrowRight, Palette, LayoutTemplate, Calendar, Wallet } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DemoBadge } from '@/components/ui/Badge';
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
      {/* Hero */}
      <section className="relative px-6 md:px-10 pt-10 pb-14 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 85% 20%, #E8C7C4 0%, transparent 40%), radial-gradient(circle at 10% 80%, #A8B5A0 0%, transparent 35%)',
          }}
        />
        <div className="relative max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-champagne mb-3">Decorly</p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-forest leading-tight mb-4">
            {t(locale, 'heroTitle')}
          </h1>
          <p className="text-charcoal/65 max-w-xl mb-8 leading-relaxed">
            {t(locale, 'heroSubtitle')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/studio" onClick={() => setActiveDesignId(null)}>
              <Button size="lg">
                <Palette className="h-4 w-4" />
                {t(locale, 'startDesigning')}
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="secondary">
                <LayoutTemplate className="h-4 w-4" />
                {t(locale, 'browseTemplates')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="px-6 md:px-10 pb-12 grid lg:grid-cols-3 gap-6">
        {/* Recent designs */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-forest">{t(locale, 'recentDesigns')}</h2>
            <Link to="/designs" className="text-sm text-champagne hover:underline inline-flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <Card>
              <CardBody className="py-10 text-center text-sm text-charcoal/50">
                {t(locale, 'emptyDesigns')}
              </CardBody>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {recent.map((d, i) => {
                const theme = getTheme(d.thumbnailTheme);
                return (
                  <Link
                    key={d.id}
                    to={`/studio?design=${d.id}`}
                    onClick={() => setActiveDesignId(d.id)}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition group h-full">
                      <div
                        className="h-28 relative"
                        style={{
                          background: `linear-gradient(135deg, ${theme.palette.backdrop}, ${theme.palette.primary})`,
                        }}
                      >
                        <div className="absolute bottom-3 left-3 right-3 flex gap-1">
                          {[theme.palette.primary, theme.palette.accent, theme.palette.secondary].map(
                            (c) => (
                              <span
                                key={c}
                                className="h-3 w-3 rounded-full border border-white/60"
                                style={{ background: c }}
                              />
                            ),
                          )}
                        </div>
                      </div>
                      <CardBody className="pt-3">
                        <p className="font-medium text-sm text-forest group-hover:text-champagne transition">
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
            </div>
          )}
        </section>

        {/* Side column */}
        <div className="space-y-6">
          <section>
            <h2 className="font-display text-2xl text-forest mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-champagne" />
              {t(locale, 'upcomingEvents')}
            </h2>
            <Card>
              <CardBody className="space-y-3 pt-5">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-charcoal/50">No upcoming event dates set.</p>
                ) : (
                  upcoming.map((d) => (
                    <div key={d.id} className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-sm font-medium text-charcoal">{d.name}</p>
                        <p className="text-xs text-charcoal/50">{d.notes ?? 'Saved design'}</p>
                      </div>
                      <span className="text-xs text-forest whitespace-nowrap">
                        {d.eventDate && formatDate(d.eventDate)}
                      </span>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>
          </section>

          <section>
            <h2 className="font-display text-2xl text-forest mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-champagne" />
              {t(locale, 'budgetProgress')}
            </h2>
            <Card>
              <CardBody className="pt-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-charcoal/70">{budget.eventName}</p>
                  <DemoBadge />
                </div>
                <p className="font-display text-2xl text-forest mb-2">
                  {formatINR(spent)}{' '}
                  <span className="text-base text-charcoal/40">/ {formatINR(budget.totalBudget)}</span>
                </p>
                <div className="h-2 rounded-full bg-sage/30 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-forest transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-charcoal/45 mt-2">{pct}% of demo budget</p>
                <Link to="/budget" className="inline-block mt-3 text-xs text-champagne hover:underline">
                  Open budget planner
                </Link>
              </CardBody>
            </Card>
          </section>
        </div>
      </div>

      {/* Popular combos */}
      <section className="px-6 md:px-10 pb-14">
        <h2 className="font-display text-2xl text-forest mb-4">{t(locale, 'popularFlowers')}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_COMBOS.map((c) => (
            <Card key={c.id} className="overflow-hidden">
              <div className="h-16 flex">
                {c.colors.map((col) => (
                  <div key={col} className="flex-1" style={{ background: col }} />
                ))}
              </div>
              <CardHeader className="pb-1">
                <p className="text-sm font-medium text-forest">{c.name}</p>
              </CardHeader>
              <CardBody>
                <p className="text-[10px] text-charcoal/45">{c.note}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
