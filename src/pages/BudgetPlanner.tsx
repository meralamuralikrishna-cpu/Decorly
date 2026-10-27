import { FormEvent, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DemoBadge } from '@/components/ui/Badge';
import { formatINR } from '@/lib/utils';
import type { BudgetCategory } from '@/types';

export function BudgetPlanner() {
  const { budget, setBudget } = useApp();
  const { toast } = useToast();
  const [eventName, setEventName] = useState(budget.eventName);
  const [totalBudget, setTotalBudget] = useState(String(budget.totalBudget));
  const [categories, setCategories] = useState<BudgetCategory[]>(budget.categories);
  const [errors, setErrors] = useState<{ total?: string; categories?: string }>({});

  const plannedSum = categories.reduce((s, c) => s + c.planned, 0);
  const spentSum = categories.reduce((s, c) => s + c.spent, 0);
  const total = Number(totalBudget) || 0;

  const updateCat = (id: string, patch: Partial<BudgetCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!total || total < 1000) next.total = 'Enter a total budget of at least ₹1,000';
    if (categories.some((c) => c.planned < 0 || c.spent < 0)) {
      next.categories = 'Amounts cannot be negative';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setBudget({
      ...budget,
      eventName: eventName.trim() || 'Untitled event',
      totalBudget: total,
      categories,
      updatedAt: new Date().toISOString(),
    });
    toast('Budget plan saved locally', 'success');
  };

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl text-forest">Budget Planner</h1>
          <p className="text-sm text-charcoal/60 mt-1">
            Illustrative planning only — no payments are processed.
          </p>
        </div>
        <DemoBadge />
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <Card>
          <CardBody className="pt-5 grid sm:grid-cols-2 gap-4">
            <Input
              label="Event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <Input
              label="Total budget (₹)"
              type="number"
              min={1000}
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              error={errors.total}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-display text-xl text-forest">Categories</h2>
            {errors.categories && (
              <p className="text-xs text-red-600" role="alert">
                {errors.categories}
              </p>
            )}
          </CardHeader>
          <CardBody className="space-y-4">
            {categories.map((c) => {
              const pct = c.planned ? Math.min(100, Math.round((c.spent / c.planned) * 100)) : 0;
              return (
                <div key={c.id} className="rounded-xl border border-sage/30 p-3 space-y-2">
                  <p className="text-sm font-medium text-charcoal">{c.name}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Planned"
                      type="number"
                      min={0}
                      value={c.planned}
                      onChange={(e) =>
                        updateCat(c.id, { planned: Number(e.target.value) || 0 })
                      }
                    />
                    <Input
                      label="Spent (demo)"
                      type="number"
                      min={0}
                      value={c.spent}
                      onChange={(e) =>
                        updateCat(c.id, { spent: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="h-1.5 rounded-full bg-sage/25 overflow-hidden">
                    <div
                      className="h-full bg-champagne rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="pt-5 flex flex-wrap gap-6 items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-champagne">Summary</p>
              <p className="font-display text-2xl text-forest mt-1">
                Spent {formatINR(spentSum)} / Planned {formatINR(plannedSum)}
              </p>
              <p className="text-xs text-charcoal/50 mt-1">
                Total envelope: {formatINR(total)} ·{' '}
                {total ? Math.round((spentSum / total) * 100) : 0}% of total
              </p>
            </div>
            <Button type="submit">Save budget plan</Button>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
