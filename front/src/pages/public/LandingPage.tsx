// pages/public/LandingPage.tsx
import { Link } from 'react-router-dom';
import { Shield, Zap, Users, TrendingUp, Lock, Globe, ChevronRight, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const features = [
  { icon: <Shield size={24} color="var(--color-secondary)" />, title: 'Sécurité Blockchain', desc: 'Chaque cotisation est enregistrée sur la blockchain EVM. Immuable, transparent, vérifiable par tous.' },
  { icon: <Zap size={24} color="var(--color-tertiary)" />, title: 'Paiement Mobile Money', desc: 'Payez via MTN Money ou Moov Money. Confirmation en moins de 60 secondes.' },
  { icon: <Users size={24} color="var(--color-secondary)" />, title: 'Gestion de Groupe', desc: 'Invitez vos membres par lien, gérez les ordres de passage, la messagerie et les remplaçants.' },
  { icon: <TrendingUp size={24} color="var(--color-tertiary)" />, title: 'Suivi en Temps Réel', desc: 'Tableau de bord complet : solde, prochaines distributions, historique des transactions.' },
  { icon: <Lock size={24} color="var(--color-secondary)" />, title: 'Smart Contracts', desc: 'Les règles de votre tontine sont encodées dans un smart contract. Aucune modification possible après démarrage.' },
  { icon: <Globe size={24} color="var(--color-tertiary)" />, title: 'Conçu pour le Bénin', desc: 'Interface en français, montants en FCFA, intégration Mobile Money locale et support de la culture tontine béninoise.' },
];

const steps = [
  { num: 1, title: 'Créez votre compte', desc: 'Inscription rapide avec votre numéro de téléphone ou email.' },
  { num: 2, title: 'Créez ou rejoignez une tontine', desc: 'Définissez les règles ou rejoignez via un lien d\'invitation.' },
  { num: 3, title: 'Payez vos cotisations', desc: 'Paiement sécurisé via MTN Money ou Moov Money.' },
  { num: 4, title: 'Recevez votre distribution', desc: 'Selon l\'ordre de passage, le smart contract distribue automatiquement.' },
];

const stats = [
  { value: '1 200+', label: 'Membres actifs' },
  { value: '85', label: 'Tontines en cours' },
  { value: '450 M FCFA', label: 'Volume géré' },
  { value: '99.8%', label: 'Taux de succès' },
];

export const LandingPage = () => (
  <div>
    {/* ── Hero ────────────────────────────────────── */}
    <section style={{
      background: 'linear-gradient(135deg, var(--color-primary) 0%, #1e2d4a 50%, var(--color-secondary) 100%)',
      padding: 'var(--space-16) 0 120px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(16,185,129,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
          background: 'rgba(16,185,129,0.2)', borderRadius: 'var(--radius-full)',
          padding: '6px 16px', marginBottom: 'var(--space-6)',
        }}>
          <Shield size={14} color="var(--color-secondary-fixed)" />
          <span style={{ font: 'var(--text-label)', color: 'var(--color-secondary-fixed)', letterSpacing: '0.05em' }}>
            SÉCURISÉ PAR BLOCKCHAIN EVM
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-headline)', fontSize: '52px', fontWeight: 800,
          lineHeight: 1.1, color: '#fff', marginBottom: 'var(--space-5)',
          maxWidth: '760px', marginInline: 'auto',
        }}>
          La tontine traditionnelle,<br />
          <span style={{ color: 'var(--color-secondary-fixed)' }}>sécurisée par la technologie</span>
        </h1>

        <p style={{
          font: 'var(--text-body-lg)', color: 'rgba(255,255,255,0.75)',
          maxWidth: '560px', marginInline: 'auto', marginBottom: 'var(--space-10)',
        }}>
          TontineChain numérise et sécurise vos tontines avec des smart contracts Ethereum. Payez via Mobile Money, suivez vos cycles en temps réel.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/inscription">
            <Button size="lg" style={{ background: 'var(--color-secondary)', color: '#fff', paddingInline: '36px' }}>
              Commencer gratuitement
            </Button>
          </Link>
          <Link to="/connexion">
            <Button size="lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)', paddingInline: '36px' }}>
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* ── Stats ──────────────────────────────────── */}
    <section style={{ background: 'var(--color-surface-container-lowest)', borderBottom: '1px solid var(--color-surface-container-high)' }}>
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <p style={{ font: 'var(--text-numeric-xl)', color: 'var(--color-secondary)', marginBottom: 'var(--space-1)' }}>{s.value}</p>
              <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', fontWeight: 600 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Features ──────────────────────────────── */}
    <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-background)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <p style={{ font: 'var(--text-label)', color: 'var(--color-secondary)', marginBottom: 'var(--space-3)', letterSpacing: '0.1em' }}>FONCTIONNALITÉS</p>
          <h2 style={{ color: 'var(--color-on-surface)', marginBottom: 'var(--space-4)' }}>Tout ce qu'il vous faut</h2>
          <p style={{ font: 'var(--text-body-lg)', color: 'var(--color-on-surface-variant)', maxWidth: '520px', marginInline: 'auto' }}>
            Une plateforme complète pour créer, gérer et participer à des tontines en toute sécurité.
          </p>
        </div>
        <div className="grid-3">
          {features.map((f) => (
            <Card key={f.title} hoverable>
              <div style={{
                width: '52px', height: '52px',
                background: 'var(--color-surface-container)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 'var(--space-4)',
              }}>
                {f.icon}
              </div>
              <h3 style={{ font: 'var(--text-h3)', marginBottom: 'var(--space-2)', color: 'var(--color-on-surface)' }}>{f.title}</h3>
              <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* ── Comment ça marche ─────────────────────── */}
    <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-surface-container-low)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <p style={{ font: 'var(--text-label)', color: 'var(--color-secondary)', marginBottom: 'var(--space-3)', letterSpacing: '0.1em' }}>PROCESSUS</p>
          <h2 style={{ color: 'var(--color-on-surface)' }}>Comment ça marche ?</h2>
        </div>
        <div className="grid-4">
          {steps.map((s) => (
            <div key={s.num} style={{ textAlign: 'center' }}>
              <div style={{
                width: '56px', height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginInline: 'auto', marginBottom: 'var(--space-4)',
                fontFamily: 'var(--font-headline)', fontSize: '20px', fontWeight: 800, color: '#fff',
              }}>
                {s.num}
              </div>
              <h4 style={{ font: 'var(--text-h4)', color: 'var(--color-on-surface)', marginBottom: 'var(--space-2)' }}>{s.title}</h4>
              <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ────────────────────────────────────── */}
    <section style={{
      padding: 'var(--space-16) 0',
      background: 'linear-gradient(135deg, var(--color-primary), #1e3a5f)',
      textAlign: 'center',
    }}>
      <div className="container">
        <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '36px', fontWeight: 800, color: '#fff', marginBottom: 'var(--space-4)' }}>
          Prêt à sécuriser votre tontine ?
        </h2>
        <p style={{ font: 'var(--text-body-lg)', color: 'rgba(255,255,255,0.75)', marginBottom: 'var(--space-8)', maxWidth: '480px', marginInline: 'auto' }}>
          Rejoignez plus de 1 200 membres qui font confiance à TontineChain pour leur épargne collective.
        </p>
        <Link to="/inscription">
          <Button size="lg" style={{ background: 'var(--color-secondary)', color: '#fff', paddingInline: '40px', fontSize: '16px' }}>
            Créer mon compte gratuitement
            <ChevronRight size={18} style={{ marginLeft: 'var(--space-2)' }} />
          </Button>
        </Link>
      </div>
    </section>
  </div>
);
