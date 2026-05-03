// layouts/AdminLayout.tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, AlertTriangle, Settings, FileText, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const adminNav = [
  { to: '/admin',              label: 'Tableau de bord',     icon: <LayoutDashboard size={18} /> },
  { to: '/admin/utilisateurs', label: 'Utilisateurs',         icon: <Users size={18} /> },
  { to: '/admin/tontines',     label: 'Supervision',          icon: <Shield size={18} /> },
  { to: '/admin/litiges',      label: 'Litiges',              icon: <AlertTriangle size={18} /> },
  { to: '/admin/parametres',   label: 'Paramètres',           icon: <Settings size={18} /> },
  { to: '/admin/logs',         label: 'Logs & Audit',         icon: <FileText size={18} /> },
];

export const AdminLayout = () => {
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/connexion'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: 'var(--color-primary)',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{
          height: 'var(--header-height)',
          display: 'flex', alignItems: 'center',
          padding: '0 var(--space-5)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Shield size={20} color="var(--color-secondary-fixed)" style={{ marginRight: 'var(--space-3)' }} />
          <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '16px', color: '#fff' }}>
            Admin Panel
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: 'var(--space-4) var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                padding: '10px var(--space-4)',
                borderRadius: 'var(--radius-md)',
                font: 'var(--text-body-sm)',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--color-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-headline)',
            }}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ font: 'var(--text-body-sm)', fontWeight: 700, color: '#fff' }}>{user?.prenom} {user?.nom}</p>
              <p style={{ font: 'var(--text-label)', color: 'rgba(255,255,255,0.6)' }}>Administrateur</p>
            </div>
            <button onClick={handleLogout} title="Déconnexion" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center' }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main style={{ marginLeft: 'var(--sidebar-width)', flex: 1, padding: 'var(--space-8)', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
};
