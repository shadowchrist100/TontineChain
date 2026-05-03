// router/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout }  from '../layouts/PublicLayout';
import { MemberLayout }  from '../layouts/MemberLayout';
import { AdminLayout }   from '../layouts/AdminLayout';
import { PrivateRoute }  from './PrivateRoute';

// Public pages
import { LandingPage }        from '../pages/public/LandingPage';
import { LoginPage }          from '../pages/public/LoginPage';
import { RegisterPage }       from '../pages/public/RegisterPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { InvitationPage }     from '../pages/public/InvitationPage';

// Member pages
import { DashboardMembre }    from '../pages/member/DashboardMembre';
import { MesTontines }        from '../pages/member/MesTontines';
import { TontineDetail }      from '../pages/member/TontineDetail';
import { PaiementPage }       from '../pages/member/PaiementPage';
import { HistoriquePaiements } from '../pages/member/HistoriquePaiements';
import { MonProfil }          from '../pages/member/MonProfil';
import { RejoindreTonitne }   from '../pages/member/RejoindreTonitne';
import { LitigePage }         from '../pages/member/LitigePage';
import { NotificationsPage }  from '../pages/member/NotificationsPage';
import { TransactionDetail }  from '../pages/member/TransactionDetail';

// Organizer pages
import { DashboardOrga }      from '../pages/organizer/DashboardOrga';
import { CreerTontine }       from '../pages/organizer/CreerTontine';
import { GererTontine }       from '../pages/organizer/GererTontine';
import { OrdrePassage }       from '../pages/organizer/OrdrePassage';
import { LienInvitation }     from '../pages/organizer/LienInvitation';
import { ValidationMembres }  from '../pages/organizer/ValidationMembres';
import { Remplacants }        from '../pages/organizer/Remplacants';
import { Messagerie }         from '../pages/organizer/Messagerie';
import { HistoriqueOrga }     from '../pages/organizer/HistoriqueOrga';
import { ClotureTontine }     from '../pages/organizer/ClotureTontine';

// Admin pages
import { DashboardAdmin }       from '../pages/admin/DashboardAdmin';
import { GestionUtilisateurs }  from '../pages/admin/GestionUtilisateurs';
import { SupervisionTontines }  from '../pages/admin/SupervisionTontines';
import { GestionLitiges }       from '../pages/admin/GestionLitiges';
import { Parametres }           from '../pages/admin/Parametres';
import { LogsAudit }            from '../pages/admin/LogsAudit';

export const router = createBrowserRouter([
  // ─── Pages publiques ──────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/',                   element: <LandingPage /> },
      { path: '/connexion',          element: <LoginPage /> },
      { path: '/inscription',        element: <RegisterPage /> },
      { path: '/mot-de-passe-oublie', element: <ForgotPasswordPage /> },
    ],
  },
  // Invitation publique (layout minimal)
  { path: '/invitation/:lienId', element: <InvitationPage /> },

  // ─── Pages membre / organisateur ─────────────────────────
  {
    element: (
      <PrivateRoute allowedRoles={['membre', 'organisateur']}>
        <MemberLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '/tableau-de-bord',            element: <DashboardMembre /> },
      { path: '/mes-tontines',               element: <MesTontines /> },
      { path: '/tontines/:id',               element: <TontineDetail /> },
      { path: '/tontines/:id/payer',         element: <PaiementPage /> },
      { path: '/historique',                 element: <HistoriquePaiements /> },
      { path: '/profil',                     element: <MonProfil /> },
      { path: '/rejoindre/:id',              element: <RejoindreTonitne /> },
      { path: '/litige',                     element: <LitigePage /> },
      { path: '/notifications',              element: <NotificationsPage /> },
      { path: '/transactions/:id',           element: <TransactionDetail /> },
    ],
  },

  // ─── Pages organisateur ──────────────────────────────────
  {
    element: (
      <PrivateRoute allowedRoles={['organisateur']}>
        <MemberLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '/orga/tableau-de-bord',          element: <DashboardOrga /> },
      { path: '/orga/creer',                    element: <CreerTontine /> },
      { path: '/orga/tontines/:id',             element: <GererTontine /> },
      { path: '/orga/tontines/:id/ordre',       element: <OrdrePassage /> },
      { path: '/orga/tontines/:id/invitation',  element: <LienInvitation /> },
      { path: '/orga/tontines/:id/membres',     element: <ValidationMembres /> },
      { path: '/orga/tontines/:id/remplacants', element: <Remplacants /> },
      { path: '/orga/messagerie',               element: <Messagerie /> },
      { path: '/orga/historique',               element: <HistoriqueOrga /> },
      { path: '/orga/cloture/:id',              element: <ClotureTontine /> },
    ],
  },

  // ─── Pages admin ─────────────────────────────────────────
  {
    element: (
      <PrivateRoute allowedRoles={['admin']}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { path: '/admin',              element: <DashboardAdmin /> },
      { path: '/admin/utilisateurs', element: <GestionUtilisateurs /> },
      { path: '/admin/tontines',     element: <SupervisionTontines /> },
      { path: '/admin/litiges',      element: <GestionLitiges /> },
      { path: '/admin/parametres',   element: <Parametres /> },
      { path: '/admin/logs',         element: <LogsAudit /> },
    ],
  },

  // ─── Fallback ─────────────────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
]);
