// pages/public/LoginPage.tsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../stores/authStore';

export const LoginPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({});

  const login   = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = (location.state as any)?.from?.pathname ?? '/tableau-de-bord';

  const validate = () => {
    const e: typeof errors = {};
    if (!email)    e.email    = 'L\'email est requis.';
    if (!password) e.password = 'Le mot de passe est requis.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    try {
      await login({ email, password });
      // Redirection selon le rôle (géré par le store)
      const role = useAuthStore.getState().user?.role;
      const redirect = role === 'admin' ? '/admin' : role === 'organisateur' ? '/orga/tableau-de-bord' : from;
      navigate(redirect, { replace: true });
    } catch { /* erreur affichée par le store via toast */ }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-8) var(--space-4)',
      background: 'linear-gradient(135deg, var(--color-surface-container-low) 0%, var(--color-background) 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            borderRadius: 'var(--radius-xl)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginInline: 'auto', marginBottom: 'var(--space-4)',
            boxShadow: 'var(--shadow-md)',
          }}>
            <Shield size={28} color="#fff" />
          </div>
          <h1 style={{ font: 'var(--text-h2)', color: 'var(--color-on-surface)', marginBottom: 'var(--space-2)' }}>
            Connexion
          </h1>
          <p style={{ font: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)' }}>
            Accédez à votre espace TontineChain
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Input
              id="login-email"
              type="email"
              label="Adresse email"
              placeholder="koffi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              prefixIcon={<Mail size={16} />}
              autoComplete="email"
            />
            <Input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              label="Mot de passe"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              prefixIcon={<Lock size={16} />}
              suffixIcon={
                <button type="button" onClick={() => setShowPass((p) => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              autoComplete="current-password"
            />

            <div style={{ textAlign: 'right', marginTop: '-var(--space-3)' }}>
              <Link to="/mot-de-passe-oublie" style={{ font: 'var(--text-body-sm)', color: 'var(--color-secondary)', fontWeight: 600 }}>
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={isLoading} size="lg">
              Se connecter
            </Button>
          </form>

          {/* Comptes démo */}
          <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--color-surface-container)', borderRadius: 'var(--radius-md)' }}>
            <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
              🧪 Comptes de démonstration
            </p>
            {[
              { label: 'Membre', email: 'koffi@example.com', password: 'password123' },
              { label: 'Organisateur', email: 'aline@example.com', password: 'password123' },
              { label: 'Admin', email: 'admin@tontinechain.bj', password: 'admin123' },
            ].map((demo) => (
              <button
                key={demo.label}
                type="button"
                onClick={() => { setEmail(demo.email); setPassword(demo.password); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '6px var(--space-3)', marginBottom: 'var(--space-1)',
                  background: 'none', border: '1px solid var(--color-outline-variant)',
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)',
                  transition: 'background var(--transition-fast)',
                }}
              >
                <strong>{demo.label}</strong> — {demo.email}
              </button>
            ))}
          </div>
        </Card>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>
          Pas encore de compte ?{' '}
          <Link to="/inscription" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};
