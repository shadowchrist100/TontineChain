// layouts/MemberLayout.tsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, List, CreditCard, Clock, User,
  Bell, LogOut, Shield, MessageSquare,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNotifStore } from '../stores/notifStore';

interface NavItem { to: string; label: string; icon: React.ReactNode }

const memberNav: NavItem[] = [
  { to: '/tableau-de-bord', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
  { to: '/mes-tontines',    label: 'Mes Tontines',    icon: <List size={18} /> },
  { to: '/historique',      label: 'Historique',       icon: <Clock size={18} /> },
  { to: '/notifications',   label: 'Notifications',    icon: <Bell size={18} /> },
  { to: '/profil',          label: 'Mon Profil',        icon: <User size={18} /> },
];

const orgaNav: NavItem[] = [
  { to: '/orga/tableau-de-bord', label: 'Tableau de bord',   icon: <LayoutDashboard size={18} /> },
  { to: '/mes-tontines',         label: 'Mes Tontines',      icon: <List size={18} /> },
  { to: '/orga/creer',           label: 'Créer une tontine', icon: <CreditCard size={18} /> },
  { to: '/orga/messagerie',      label: 'Messagerie',        icon: <MessageSquare size={18} /> },
  { to: '/historique',           label: 'Historique',         icon: <Clock size={18} /> },
  { to: '/notifications',        label: 'Notifications',      icon: <Bell size={18} /> },
  { to: '/profil',               label: 'Mon Profil',         icon: <User size={18} /> },
];


export const MemberLayout = () => {
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);
  const unread   = useNotifStore((s) => s.unreadCount);
  const navigate = useNavigate();

  const nav = user?.role === 'organisateur' ? orgaNav : memberNav;

  const handleLogout = () => { logout(); navigate('/connexion'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-background)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        background: 'var(--color-surface-container-lowest)',
        borderRight: '1px solid var(--color-surface-container-high)',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{
          height: 'var(--header-height)',
          display: 'flex', alignItems: 'center',
          padding: '0 var(--space-5)',
          borderBottom: '1px solid var(--color-surface-container-high)',
        }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginRight: 'var(--space-3)',
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '16px' }}>
            TontineChain
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: 'var(--space-4) var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: '10px var(--space-4)',
                borderRadius: 'var(--radius-md)',
                font: 'var(--text-body-sm)',
                fontFamily: 'var(--font-body)',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                background: isActive ? 'var(--color-primary-fixed)' : 'transparent',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                position: 'relative',
              })}
            >
              {item.icon}
              {item.label}
              {item.to === '/notifications' && unread > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--color-error)',
                  color: '#fff',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px', fontWeight: 700,
                  padding: '1px 6px',
                  minWidth: '18px', textAlign: 'center',
                }}>
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{
          padding: 'var(--space-4)',
          borderTop: '1px solid var(--color-surface-container-high)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-container)',
          }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-fixed))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-headline)',
              flexShrink: 0,
            }}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ font: 'var(--text-body-sm)', fontWeight: 700, color: 'var(--color-on-surface)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.prenom} {user?.nom}
              </p>
              <p style={{ font: 'var(--text-label)', color: 'var(--color-on-surface-variant)', textTransform: 'capitalize' }}>
                {user?.role}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Se déconnecter"
              style={{
                display: 'flex', alignItems: 'center',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-on-surface-variant)',
                transition: 'color var(--transition-fast)',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: 'var(--sidebar-width)',
        flex: 1,
        padding: 'var(--space-8)',
        minHeight: '100vh',
      }}>
        <Outlet />
      </main>
    </div>
  );
};
