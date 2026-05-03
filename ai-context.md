# ai-context.md — Plateforme Tontine Blockchain (Bénin)

> Ce fichier est le contexte de référence du projet. Lis-le entièrement avant de générer du code, des composants ou des réponses. Respecte toutes les conventions définies ici.

---

## 1. Vue d'ensemble du projet

**Nom du projet** : TontineChain  
**Domaine** : Fintech / Épargne collective / Blockchain  
**Marché cible** : Bénin (Afrique de l'Ouest), FCFA, mobile-first  
**Langue de l'interface** : Français (fr-BJ)  
**Objectif** : Numériser et sécuriser les tontines via des smart contracts Ethereum (EVM), en offrant une interface accessible aux organisateurs et participants.

---

## 2. Architecture générale

```
Frontend React (SPA)
    │
    ├── React Router v6          → Routing + PrivateRoute par rôle
    ├── Zustand                  → State global (auth, user, notifs)
    ├── TanStack Query           → Data fetching, cache, mutations
    ├── WebSocket / SSE          → Temps réel (paiements, notifs)
    │
    ├── Services
    │   ├── apiClient (Axios)    → REST API backend (JWT + retry)
    │   ├── blockchainService    → ethers.js, lecture smart contracts
    │   └── paymentService       → MTN Money, Moov Money APIs
    │
    └── Backends
        ├── REST API             → Node.js + PostgreSQL
        ├── Blockchain EVM       → Smart contracts Solidity
        └── Mobile Money APIs    → MTN, Moov, Orange
```

---

## 3. Structure des dossiers (à respecter absolument)

```
src/
├── router/
│   ├── index.tsx               → Définition de toutes les routes
│   └── PrivateRoute.tsx        → Guard par rôle (membre | organisateur | admin)
│
├── layouts/
│   ├── PublicLayout.tsx        → Navbar + Footer (pages non connectées)
│   ├── MemberLayout.tsx        → Sidebar + NotifBell (membre/organisateur)
│   └── AdminLayout.tsx         → Nav admin + lien audit (admin)
│
├── pages/
│   ├── public/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── 
│   │   ├── InvitationPage.tsx      → Vue lien partagé (sans compte requis)
│   │   └── ForgotPasswordPage.tsx
│   │
│   ├── member/
│   │   ├── DashboardMembre.tsx
│   │   ├── MesTontines.tsx
│   │   ├── TontineDetail.tsx
│   │   ├── PaiementPage.tsx
│   │   ├── HistoriquePaiements.tsx
│   │   ├── MonProfil.tsx
│   │   ├── RejoindreTonitne.tsx    → Confirmation des règles + adhésion
│   │   ├── LitigePage.tsx
│   │   ├── NotificationsPage.tsx
│   │   └── TransactionDetail.tsx
│   │
│   ├── organizer/
│   │   ├── DashboardOrga.tsx
│   │   ├── CreerTontine.tsx        → Formulaire multi-étapes
│   │   ├── GererTontine.tsx
│   │   ├── OrdrePassage.tsx        → Drag-and-drop ou saisie ordre
│   │   ├── LienInvitation.tsx      → QR code + partage
│   │   ├── ValidationMembres.tsx
│   │   ├── Remplacants.tsx
│   │   ├── Messagerie.tsx
│   │   ├── HistoriqueOrga.tsx
│   │   └── ClotureTontine.tsx
│   │
│   └── admin/
│       ├── DashboardAdmin.tsx
│       ├── GestionUtilisateurs.tsx
│       ├── SupervisionTontines.tsx
│       ├── GestionLitiges.tsx
│       ├── Parametres.tsx
│       └── LogsAudit.tsx
│
├── components/
│   ├── ui/                     → Design system (Button, Input, Modal, Badge, Toast…)
│   ├── tontine/                → Composants métier (TontineCard, CycleBar, PayStatus…)
│   └── forms/                  → Formulaires métier (TontineForm, KycForm, PaymentForm…)
│
├── stores/
│   ├── authStore.ts
│   ├── userStore.ts
│   ├── tontineStore.ts
│   └── notifStore.ts
│
├── hooks/
│   ├── useTontines.ts          → Wrappers TanStack Query
│   ├── usePaiements.ts
│   └── useNotifications.ts
│
├── services/
│   ├── apiClient.ts            → Instance Axios + intercepteurs
│   ├── blockchainService.ts    → ethers.js
│   └── paymentService.ts       → MTN / Moov
│
└── types/
    ├── tontine.types.ts
    ├── user.types.ts
    └── transaction.types.ts
```

---

## 4. Types TypeScript de référence

> Toujours utiliser ces types. Ne pas les redéfinir localement dans les composants.

```ts
// types/user.types.ts
export type Role = 'membre' | 'organisateur' | 'admin';
export type KycStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  role: Role;
  tontinesIds: string[];
  createdAt: string;
}

// types/tontine.types.ts
export type FrequenceCotisation = 'hebdomadaire' | 'mensuel' | 'bimensuel';
export type TontineStatus = 'configuration' | 'adhesion' | 'active' | 'terminee' | 'annulee';
export type OrdreType = 'fixe' | 'tirage_au_sort';

export interface Penalites {
  retardMontant: number;           // montant fixe en FCFA
  retardPourcentage?: number;      // OU pourcentage (l'un ou l'autre)
  retraitFraction: number;         // ex: 0.33 = 1/3 de la cagnotte
  depassementDelai: number;        // montant fixe FCFA
  interetTontinier: number;        // pourcentage prélevé par cycle
}

export interface Tontine {
  id: string;
  nom: string;
  description?: string;
  chefTontinierUserId: string;
  montantCotisation: number;       // en FCFA
  frequenceCotisation: FrequenceCotisation;
  frequenceRamassage: FrequenceCotisation;
  nombreMembresMax: number;
  durateLimiteParCycleDays: number;
  ordreType: OrdreType;
  ordreBeneficiaires: string[];    // userIds dans l'ordre de passage
  penalites: Penalites;
  status: TontineStatus;
  smartContractAddress?: string;
  cycleActuel: number;
  membresIds: string[];
  lienInvitation: string;          // URL unique
  createdAt: string;
  demarreAt?: string;
}

// types/transaction.types.ts
export type TransactionType = 'cotisation' | 'penalite' | 'distribution' | 'remboursement';
export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export interface Transaction {
  id: string;
  tontineId: string;
  userId: string;
  type: TransactionType;
  montant: number;                 // en FCFA
  status: TransactionStatus;
  txHash?: string;                 // hash blockchain
  createdAt: string;
  confirmedAt?: string;
}
```

---

## 5. Rôles et permissions

| Action | Public | Membre | Organisateur | Admin |
|---|---|---|---|---|
| Voir la landing page | ✅ | ✅ | ✅ | ✅ |
| Voir une invitation (lien) | ✅ | ✅ | ✅ | ✅ |
| Créer une tontine | ❌ | ❌ | ✅ | ✅ |
| Rejoindre une tontine | ❌ | ✅ | ✅ | ❌ |
| Payer une cotisation | ❌ | ✅ | ✅ | ❌ |
| Voir statuts paiements | ❌ | ✅ (partiel) | ✅ (complet) | ✅ |
| Valider des membres | ❌ | ❌ | ✅ | ✅ |
| Définir l'ordre de passage | ❌ | ❌ | ✅ | ❌ |
| Suspendre un utilisateur | ❌ | ❌ | ❌ | ✅ |
| Accéder aux logs | ❌ | ❌ | ❌ | ✅ |

**Règle critique** : Le guard `PrivateRoute` doit vérifier le rôle depuis `authStore`, pas depuis le localStorage directement.

---

## 6. Règles métier fondamentales

Ces règles sont NON NÉGOCIABLES. Ne jamais les contourner même si l'UI le permet.

### Cycle de vie d'une tontine
1. **Configuration** → le chef tontinier définit TOUTES les règles avant toute adhésion
2. **Adhésion** → les membres rejoignent via le lien, lisent et confirment les règles
3. **Pré-démarrage** → le chef définit l'ordre de passage des bénéficiaires
4. **Active** → cotisations, pénalités, distributions automatiques
5. **Terminée** → après le dernier cycle, archivage automatique

### Règles d'adhésion
- Un membre ne peut rejoindre qu'**avant le démarrage du premier cycle**
- Un membre ne peut **pas se retirer** après le démarrage
- Un membre ne peut s'inscrire qu'**une seule fois** à une même tontine
- L'acceptation des règles doit être **explicite** (case à cocher + bouton de confirmation)

### Règles de configuration
- Une fois le premier cycle démarré, **aucun paramètre ne peut être modifié**
- Tous les paramètres sont encodés dans le smart contract
- La `frequenceRamassage` est distincte de la `frequenceCotisation`

### Règles de pénalités
- Retard de paiement → montant fixe OU pourcentage (pas les deux)
- Retrait en cours de tontine → exactement 1/3 de la cagnotte reversée au tontinier
- L'ajout d'un remplaçant doit être validé par le smart contract
- Un remplaçant **ne peut pas recevoir** la cagnotte des tours déjà passés

---

## 7. Conventions de code

### Nommage
- Composants : `PascalCase` → `TontineCard.tsx`
- Hooks : `camelCase` préfixé par `use` → `useTontines.ts`
- Stores : `camelCase` suffixé par `Store` → `tontineStore.ts`
- Types : `PascalCase` → `Tontine`, `User`
- Variables/fonctions : `camelCase`
- Constantes globales : `SCREAMING_SNAKE_CASE`

### Composants
```tsx
// ✅ Toujours typer les props
interface TontineCardProps {
  tontine: Tontine;
  onSelect?: (id: string) => void;
}

// ✅ Toujours utiliser des exports nommés pour les composants
export const TontineCard = ({ tontine, onSelect }: TontineCardProps) => {
  // ...
};

// ❌ Ne jamais utiliser any
// ❌ Ne jamais faire de fetch direct dans un composant (passer par les hooks)
// ❌ Ne jamais accéder à localStorage directement (passer par les stores)
```

### Gestion des erreurs
- Toujours utiliser les états `isLoading`, `isError`, `error` de TanStack Query
- Toujours afficher un `Toast` en cas d'erreur de mutation
- Les erreurs blockchain doivent être interceptées et traduites en français

### Montants et devises
```ts
// ✅ Toujours formater les montants en FCFA
const formatFCFA = (montant: number): string =>
  new Intl.NumberFormat('fr-BJ', { style: 'currency', currency: 'XOF' }).format(montant);

// ❌ Ne jamais afficher un montant brut sans formatage
```

### Dates
```ts
// ✅ Toujours utiliser date-fns avec la locale fr
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
format(new Date(transaction.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr });
```

---

## 8. Authentification et sécurité

- Le token JWT est stocké dans le `authStore` Zustand (mémoire), jamais dans localStorage
- Le refresh token est stocké en cookie `HttpOnly` (géré côté serveur)
- `apiClient.ts` ajoute automatiquement le header `Authorization: Bearer <token>`
- En cas de 401, l'intercepteur tente un refresh silencieux avant de déconnecter
- Le KYC doit être `verified` avant tout paiement ou création de tontine
- Le 2FA est requis à la connexion (OTP SMS ou TOTP)




---

## 9. Gestion du state (Zustand)

```ts
// Pattern de base pour tous les stores
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
}

// ✅ Toujours utiliser des sélecteurs pour éviter les re-renders inutiles
const user = useAuthStore((state) => state.user);

// ❌ Ne jamais faire
const { user, token, login } = useAuthStore(); // cause un re-render sur tout changement
```

---

## 10. Appels API (TanStack Query)

```ts
// Pattern de base pour un hook de query
export const useTontines = () => {
  return useQuery({
    queryKey: ['tontines'],
    queryFn: () => apiClient.get<Tontine[]>('/tontines').then(r => r.data),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

// Pattern de base pour une mutation
export const usePayerCotisation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PaiementPayload) =>
      apiClient.post('/paiements', payload).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tontines'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Paiement enregistré avec succès');
    },
    onError: (error) => {
      toast.error('Échec du paiement. Veuillez réessayer.');
    },
  });
};
```

---

## 11. Intégrations spécifiques

### Blockchain (ethers.js)
```ts
// ✅ Toujours vérifier la confirmation de transaction avant de mettre à jour l'UI
const tx = await contract.payerCotisation(tontineId, { value: montant });
const receipt = await tx.wait(1); // attendre 1 confirmation
// Puis invalider les queries
```

### Mobile Money
- MTN Money : `paymentService.mtn.initiatePayment()`
- Moov Money : `paymentService.moov.initiatePayment()`
- Toujours afficher un état "En attente de confirmation" pendant le traitement
- Le webhook de confirmation peut prendre jusqu'à 60 secondes

---

## 12. Accessibilité et performance

- Toutes les images doivent avoir un attribut `alt` en français
- Tous les formulaires doivent avoir des labels associés (`htmlFor`)
- Les boutons d'action critiques (payer, confirmer règles) doivent avoir une confirmation modale
- Le mode hors-ligne partiel doit fonctionner : les données déjà chargées par TanStack Query restent consultables
- Optimiser pour les connexions 3G : pas d'images >100ko non optimisées, lazy loading systématique
- Supporter les appareils Android avec 2 Go de RAM minimum (éviter les animations lourdes)

---

## 13. Vues existantes (31 au total)

### Publiques (sans connexion)
| Vue | Composant | Description |
|---|---|---|
| Landing page | `LandingPage` | Présentation, CTA inscription/connexion |
| Inscription | `RegisterPage` | Formulaire  |
| Connexion | `LoginPage` | Email/tel + mdp + 2FA |
| Mot de passe oublié | `ForgotPasswordPage` | Reset par SMS/email |
| Invitation | `InvitationPage` | Règles de la tontine, rejoindre/refuser |

### Membre
| Vue | Composant | Description |
|---|---|---|
| Tableau de bord | `DashboardMembre` | Résumé tontines, prochains paiements |
| Mes tontines | `MesTontines` | Liste avec statuts |
| Détail tontine | `TontineDetail` | Règles, membres, cycle, paiements |
| Payer cotisation | `PaiementPage` | Interface paiement mobile money |
| Historique | `HistoriquePaiements` | Liste horodatée + hash blockchain |
| Mon profil | `MonProfil` | Infos perso,  2FA |
| Rejoindre | `RejoindreTonitne` | Lecture + confirmation des règles |
| Litige | `LitigePage` | Formulaire + suivi ticket |
| Notifications | `NotificationsPage` | Centre de notifs |
| Détail transaction | `TransactionDetail` | Détail + lien explorateur blockchain |

### Organisateur
| Vue | Composant | Description |
|---|---|---|
| Tableau de bord | `DashboardOrga` | Vue globale, retards, prochaine distrib. |
| Créer tontine | `CreerTontine` | Formulaire multi-étapes + déploiement SC |
| Gérer tontine | `GererTontine` | Membres, paiements temps réel |
| Ordre de passage | `OrdrePassage` | Drag-and-drop avant démarrage |
| Lien invitation | `LienInvitation` | QR code + partage direct |
| Valider membres | `ValidationMembres` | Accepter / refuser |
| Remplaçants | `Remplacants` | Désigner un remplaçant |
| Messagerie | `Messagerie` | Messages individuels et groupés |
| Historique | `HistoriqueOrga` | Toutes les transactions de la tontine |
| Clôture | `ClotureTontine` | Confirmation fin de cycle |

### Admin
| Vue | Composant | Description |
|---|---|---|
| Dashboard admin | `DashboardAdmin` | KPIs globaux, volume FCFA |
| Utilisateurs | `GestionUtilisateurs` | Liste, suspension, KYC manuel |
| Supervision | `SupervisionTontines` | Toutes les tontines actives |
| Litiges | `GestionLitiges` | File de tickets, arbitrage |
| Paramètres | `Parametres` | Frais, intégrations, maintenance |
| Logs | `LogsAudit` | Journal sécurité, export |

---

## 14. Ce que tu NE dois PAS faire

- ❌ Ne jamais modifier les règles métier (section 6) sous prétexte que "c'est plus simple"
- ❌ Ne jamais stocker le JWT dans localStorage ou sessionStorage
- ❌ Ne jamais faire de fetch direct dans un composant React (toujours passer par les hooks)
- ❌ Ne jamais afficher un montant sans le formater en FCFA
- ❌ Ne jamais créer un nouveau dossier sans suivre la structure de la section 3
- ❌ Ne jamais redéfinir les types TypeScript localement (toujours les importer depuis `src/types/`)
- ❌ Ne jamais permettre l'accès à une route sans vérification du rôle via `PrivateRoute`
- ❌ Ne jamais laisser une action critique (paiement, confirmation de règles) sans validation explicite de l'utilisateur
- ❌ Ne jamais afficher les données d'un autre utilisateur (scope strictement personnel sauf pour l'admin)

---

## 15. Checklist avant de générer du code

Avant de générer un composant ou une page, vérifie :

- [ ] Le composant est-il dans le bon dossier (`pages/`, `components/ui/`, `components/tontine/`, etc.) ?
- [ ] Les types sont-ils importés depuis `src/types/` ?
- [ ] Les données sont-elles chargées via un hook TanStack Query ?
- [ ] Le state global est-il géré via Zustand avec des sélecteurs ?
- [ ] Les montants sont-ils formatés en FCFA ?
- [ ] Les dates sont-elles formatées avec `date-fns` + locale `fr` ?
- [ ] Les erreurs sont-elles gérées et affichées en français ?
- [ ] Les actions critiques ont-elles une confirmation modale ?
- [ ] Le composant respecte-t-il les permissions du rôle concerné ?
- [ ] Le composant est-il accessible (labels, alt, aria) ?

## 16. Ce que tu dois faire régulièrement
- Vérifie les logs d'erreur dans la console pour identifier les problèmes potentiels
- Vérifie les messages d'erreur dans le terminal pour identifier les problèmes potentiels
- Vérifie les messages d'erreur dans les logs du serveur pour identifier les problèmes potentiels
- Vérifie les messages d'erreur dans les logs de la base de données pour identifier les problèmes potentiels
- Vérifie les messages d'erreur dans les logs du smart contract pour identifier les problèmes potentiels
- Vérifie les messages d'erreur dans les logs des intégrations externes pour identifier les problèmes potentiels
- Vérifie les messages d'erreur dans les logs des services tiers pour identifier les problèmes potentiels
- Toujours faire des commits avec des messages clairs et concis
- Garder en tête que pour le moment l'identification KYC est désactivée, donc pas de vérification KYC à faire. Ignore les sections du code qui font référence à la vérification KYC.