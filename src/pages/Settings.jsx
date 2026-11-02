import { FormEvent, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
export function Settings() {
    const { profile, setProfile, locale, setLocale, authEnabled } = useApp();
    const { toast } = useToast();
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email);
    const [city, setCity] = useState(profile.city);
    const [errors, setErrors] = useState({});
    const onSave = (e) => {
        e.preventDefault();
        const next = {};
        if (!name.trim())
            next.name = 'Name is required';
        if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            next.email = 'Enter a valid email';
        }
        setErrors(next);
        if (Object.keys(next).length)
            return;
        setProfile({
            name: name.trim(),
            email: email.trim(),
            city: city.trim() || '—',
            preferredLanguage: locale,
        });
        toast(authEnabled ? 'Profile saved to your account' : 'Demo change only — sign in to save your profile', authEnabled ? 'success' : 'info');
    };
    return (<div className="p-6 md:p-10 animate-fade-in max-w-xl mx-auto">
      <h1 className="font-display text-4xl md:text-[2.75rem] text-forest tracking-tight leading-none mb-2">
        Settings
      </h1>
      <p className="text-sm text-charcoal/60 mb-8">
        Your profile and planning data are saved with your Decorly account when Supabase is connected.
      </p>

      <form onSubmit={onSave} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-display text-xl text-forest">Profile</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name}/>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email}/>
            <Input label="City" value={city} onChange={(e) => setCity(e.target.value)}/>
            <Select label="Preferred language" value={locale} onChange={(e) => setLocale(e.target.value)} options={[
            { value: 'en', label: 'English' },
            { value: 'te', label: 'తెలుగు' },
        ]}/>
            <Button type="submit">Save profile</Button>
          </CardBody>
        </Card>
      </form>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-display text-xl text-forest">Account data</h2>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-charcoal/60 mb-4">
            {authEnabled ? 'Your saved data is stored in your Supabase account and loads when you sign in.' : 'You are viewing demo data. Sign in to save your profile, designs, bookings, and budget to Supabase.'}
          </p>
        </CardBody>
      </Card>
    </div>);
}
