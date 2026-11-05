import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { Wordmark } from '@/components/brand/Wordmark';
import { Navigate } from 'react-router-dom';

function getAuthErrorMessage(error) {
  const message = typeof error === 'string'
    ? error
    : error instanceof Error
      ? error.message
      : 'Could not complete the request. Please try again.';
  const normalized = message.toLowerCase();
  if (normalized.includes('rate limit') || normalized.includes('too many requests')) {
    if (normalized.includes('email')) {
      return 'Supabase has temporarily rate-limited email requests. Wait before trying again; repeated requests will not send another email. If you already confirmed your account, switch to Sign in. For ongoing use, configure custom SMTP in your Supabase project under Authentication → SMTP Settings.';
    }
    return 'Too many authentication attempts. Wait a while before trying again.';
  }
  return message;
}

export function Auth() {
  const { signIn, signUp, resendConfirmation, authEnabled, user, enterOfflineDemo } = useApp();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmationExpired, setConfirmationExpired] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.get('error_code') === 'otp_expired') {
      setConfirmationExpired(true);
      setError('This confirmation link has expired or was already used. Enter your email and request a new link.');
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  }, []);
  if (authEnabled && user) return <Navigate to="/" replace />;
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const result = mode === 'login' ? await signIn(email, password) : await signUp(email, password, name);
      if (result.error) setError(getAuthErrorMessage(result.error));
      else if (mode === 'signup' && !result.session) setMessage('Account created. Confirm your email, then return here and sign in. If confirmation opens Decorly automatically, you are already signed in.');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally { setBusy(false); }
  };
  const requestConfirmation = async () => {
    setBusy(true); setError(''); setMessage('');
    try {
      const result = await resendConfirmation(email);
      if (result.error) setError(getAuthErrorMessage(result.error));
      else setMessage('A new confirmation email has been sent. Use the latest link in your inbox.');
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally { setBusy(false); }
  };
  return <main className="min-h-screen app-atmosphere flex items-center justify-center p-5">
    <Card className="w-full max-w-md shadow-xl"><CardBody className="p-7 sm:p-9">
      <Wordmark size="lg"/><p className="text-sm text-charcoal/60 mt-5 mb-7">Sign in to keep your designs and workspace saved to your account.</p>
      {!authEnabled && <p role="alert" className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">Supabase account access is not configured for this app yet. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>, then restart locally or redeploy on Vercel.</p>}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-sage/10 mb-6">
        {['login', 'signup'].map((v) => <button key={v} type="button" onClick={() => { setMode(v); setError(''); setMessage(''); }} className={`rounded-lg py-2 text-sm font-semibold ${mode === v ? 'bg-white shadow text-forest' : 'text-charcoal/60'}`}>{v === 'login' ? 'Sign in' : 'Create account'}</button>)}
      </div>
      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && <Input label="Name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required/>}
        <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        <Input label="Password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required/>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="text-sm text-forest">{message}</p>}
        <Button className="w-full justify-center" disabled={busy || !authEnabled}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</Button>
      </form>
      {confirmationExpired && authEnabled && <Button type="button" variant="secondary" className="w-full justify-center mt-3" disabled={busy || !email} onClick={requestConfirmation}>{busy ? 'Please wait…' : 'Send new confirmation email'}</Button>}
      <div className="mt-5 border-t border-sage/20 pt-4">
        <Button type="button" variant="secondary" className="w-full justify-center" onClick={enterOfflineDemo}>Continue with offline demo</Button>
        <p className="text-[11px] text-charcoal/50 text-center mt-2">Demo only. This does not sign you into an account or save changes.</p>
      </div>
    </CardBody></Card>
  </main>;
}
