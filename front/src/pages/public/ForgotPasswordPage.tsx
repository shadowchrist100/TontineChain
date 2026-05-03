// pages/public/ForgotPasswordPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { toast } from 'sonner';

export const ForgotPasswordPage = () => {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!email) { setError('L\'email est requis.'); return; }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
    toast.success('Email de réinitialisation envoyé !');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-8) var(--space-4)',
      background: 'linear-gradient(135deg, var(--color-surface-container-low), var(--color-background))',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            borderRadius: 'var(--radius-xl)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginInline: 'auto', marginBottom: 'var(--space-4)', boxShadow: 'var(--shadow-md)',
          }}>
            <Shield size={28} color="#fff" />
          </div>
          <h1 style={{ font: 'var(--text-h2)', color: 'var(--color-on-surface)', marginBottom: 'var(--space-2)' }}>
            Mot de passe oublié
          </h1>
          <p style={{ font: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)' }}>
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <Card>
          {sent ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <CheckCircle size={48} color="var(--color-secondary)" style={{ marginInline: 'auto', marginBottom: 'var(--space-4)' }} />
              <h3 style={{ font: 'var(--text-h3)', color: 'var(--color-on-surface)', marginBottom: 'var(--space-3)' }}>Email envoyé !</h3>
              <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', marginBottom: 'var(--space-6)' }}>
                Vérifiez votre boîte mail (et les spams). Le lien est valide pendant 30 minutes.
              </p>
              <Link to="/connexion">
                <Button variant="outline" fullWidth>Retour à la connexion</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <Input
                id="forgot-email"
                type="email"
                label="Adresse email"
                placeholder="vous@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                prefixIcon={<Mail size={16} />}
                autoComplete="email"
              />
              <Button type="submit" fullWidth loading={loading} size="lg">
                Envoyer le lien
              </Button>
            </form>
          )}
        </Card>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          <Link to="/connexion" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};
