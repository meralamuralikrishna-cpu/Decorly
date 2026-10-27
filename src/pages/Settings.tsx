import { FormEvent, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/Modal';
import { removeKey, StorageKeys } from '@/lib/storage';
import type { Locale } from '@/types';

export function Settings() {
  const { profile, setProfile, locale, setLocale } = useApp();
  const { toast } = useToast();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [city, setCity] = useState(profile.city);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [clearOpen, setClearOpen] = useState(false);

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setProfile({
      name: name.trim(),
      email: email.trim(),
      city: city.trim() || '—',
      preferredLanguage: locale,
    });
    toast('Profile saved locally', 'success');
  };

  const clearData = () => {
    Object.values(StorageKeys).forEach((k) => removeKey(k));
    removeKey(StorageKeys.favorites + ':templates');
    removeKey(StorageKeys.favorites + ':decorators');
    setClearOpen(false);
    toast('Local data cleared — reloading…', 'info');
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-xl mx-auto">
      <h1 className="font-display text-4xl text-forest mb-2">Settings</h1>
      <p className="text-sm text-charcoal/60 mb-8">
        Local preferences only. Ready later for Node/Express/PostgreSQL auth.
      </p>

      <form onSubmit={onSave} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-display text-xl text-forest">Profile</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Select
              label="Preferred language"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              options={[
                { value: 'en', label: 'English' },
                { value: 'te', label: 'తెలుగు' },
              ]}
            />
            <Button type="submit">Save profile</Button>
          </CardBody>
        </Card>
      </form>

      <Card className="mt-6 border-red-200/60">
        <CardHeader>
          <h2 className="font-display text-xl text-forest">Data</h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-charcoal/60 mb-4">
            Clear all Decorly data from this browser&apos;s localStorage (designs, bookings, favorites).
          </p>
          <Button variant="danger" onClick={() => setClearOpen(true)}>
            Clear local data
          </Button>
        </CardBody>
      </Card>

      <ConfirmDialog
        open={clearOpen}
        title="Clear all local data?"
        message="This removes every Decorly key from localStorage and reloads the app. Cannot be undone."
        confirmLabel="Clear everything"
        danger
        onCancel={() => setClearOpen(false)}
        onConfirm={clearData}
      />
    </div>
  );
}
