// pages/public/RegisterPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { USERS_BY_EMAIL } from '../../mocks/users.mock';
import { toast } from 'sonner';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Partial<typeof form>>({});

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.nom)       e.nom       = 'Le nom est requis.';
    if (!form.prenom)    e.prenom    = 'Le prénom est requis.';
    if (!form.email)     e.email     = 'L\'email est requis.';
    else if (USERS_BY_EMAIL[form.email.toLowerCase()]) e.email = 'Cet email est déjà utilisé.';
    if (!form.telephone) e.telephone = 'Le téléphone est requis.';
    if (!form.password || form.password.length < 8) e.password = 'Minimum 8 caractères.';
    if (form.password !== form.confirm) e.confirm = 'Les mots de passe ne correspondent pas.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    toast.success('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
    navigate('/connexion');
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-8) var(--space-4)',
      background: 'linear-gradient(135deg, var(--color-surface-container-low) 0%, var(--color-background) 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
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
          <h1 style={{ font: 'var(--text-h2)', color: 'var(--color-on-surface)', marginBottom: 'var(--space-2)' }}>Créer un compte</h1>
          <p style={{ font: 'var(--text-body-md)', color: 'var(--color-on-surface-variant)' }}>Rejoignez la communauté TontineChain</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input id="reg-prenom" label="Prénom" placeholder="Koffi" value={form.prenom} onChange={set('prenom')} error={errors.prenom} prefixIcon={<User size={16} />} />
              <Input id="reg-nom"    label="Nom"    placeholder="Agossou" value={form.nom}   onChange={set('nom')}   error={errors.nom}    prefixIcon={<User size={16} />} />
            </div>
            <Input id="reg-email" type="email" label="Adresse email" placeholder="vous@example.com" value={form.email} onChange={set('email')} error={errors.email} prefixIcon={<Mail size={16} />} autoComplete="email" />
            <Input id="reg-tel" type="tel" label="Téléphone (Mobile Money)" placeholder="+229 67 00 11 22" value={form.telephone} onChange={set('telephone')} error={errors.telephone} prefixIcon={<Phone size={16} />} />
            <Input
              id="reg-pass" type={showPass ? 'text' : 'password'}
              label="Mot de passe" placeholder="Minimum 8 caractères"
              value={form.password} onChange={set('password')} error={errors.password}
              prefixIcon={<Lock size={16} />}
              suffixIcon={<button type="button" onClick={() => setShowPass((p) => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)', display: 'flex' }}>{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>}
            />
            <Input id="reg-confirm" type="password" label="Confirmer le mot de passe" placeholder="••••••••" value={form.confirm} onChange={set('confirm')} error={errors.confirm} prefixIcon={<Lock size={16} />} />

            <Button type="submit" fullWidth loading={loading} size="lg" style={{ marginTop: 'var(--space-2)' }}>
              Créer mon compte
            </Button>
          </form>
        </Card>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>
          Déjà un compte ?{' '}
          <Link to="/connexion" style={{ color: 'var(--color-secondary)', fontWeight: 700 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
};
