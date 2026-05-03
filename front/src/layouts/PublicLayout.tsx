// layouts/PublicLayout.tsx
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PublicLayout = () => {
  const { pathname } = useLocation();
  const isLogin    = pathname === '/connexion';
  const isRegister = pathname === '/inscription';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
      {/* Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(248,249,255,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-surface-container-high)',
      }}>
        <div className="container" style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '18px', color: 'var(--color-on-surface)' }}>
              TontineChain
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {!isLogin && (
              <Link to="/connexion">
                <Button variant="ghost" size="sm">Connexion</Button>
              </Link>
            )}
            {!isRegister && (
              <Link to="/inscription">
                <Button variant="primary" size="sm">Commencer</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-surface-container-high)',
        padding: 'var(--space-6) 0',
        background: 'var(--color-surface-container-low)',
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <p style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>
            © 2026 TontineChain — Épargne collective sécurisée par blockchain
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            {['Confidentialité', 'Conditions', 'Contact'].map((item) => (
              <a key={item} href="#" style={{ font: 'var(--text-body-sm)', color: 'var(--color-on-surface-variant)' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
