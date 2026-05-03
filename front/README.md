# TontineChain - Plateforme de Tontine Digitale

## 📖 À propos du projet
**TontineChain** est une plateforme FinTech innovante dédiée à la numérisation et la sécurisation des tontines traditionnelles, particulièrement conçue pour le marché du Bénin et de l'Afrique de l'Ouest. En s'appuyant sur la technologie Blockchain (Smart Contracts EVM), la plateforme offre une transparence totale, sécurise les fonds et automatise les processus de collecte et de distribution via les réseaux de Mobile Money locaux (MTN Money, Moov Money).

L'application adopte une approche **Mobile-First** pour être accessible au plus grand nombre.

---

## ✨ Fonctionnalités Principales

La plateforme propose trois espaces distincts avec des fonctionnalités adaptées à chaque rôle :

### 👤 Espace Membre
- **Adhésion simplifiée** : Rejoindre des tontines via des liens d'invitation uniques ou des QR codes.
- **Paiement Mobile Money** : Payer ses cotisations facilement via MTN Money ou Moov Money de manière intégrée.
- **Tableau de Bord** : Suivre l'état de ses tontines, ses prochains paiements, et son historique de transactions.
- **Transparence** : Consulter les règles de la tontine (pénalités, fréquence, ordre de passage) et vérifier l'état des paiements sur la blockchain.
- **Notifications** : Recevoir des alertes en temps réel pour les cotisations à payer et les distributions reçues.

### 🛠 Espace Organisateur (Chef Tontinier)
- **Création de Tontines** : Définir les paramètres complets (montant, fréquence de cotisation/ramassage, nombre de membres, pénalités). Ces règles sont ensuite verrouillées dans un Smart Contract.
- **Gestion des Membres** : Valider les inscriptions, désigner des remplaçants en cas de défaillance.
- **Ordre de Passage** : Organiser l'ordre de ramassage (par tirage au sort ou manuellement avec un système de glisser-déposer).
- **Suivi en temps réel** : Visualiser les retards, les paiements effectués et les distributions à venir.
- **Outils de Communication** : Messagerie intégrée pour contacter les membres du groupe.

### 🛡 Espace Administrateur
- **Supervision Globale** : Accéder aux KPIs de la plateforme (volume financier, tontines actives).
- **Gestion des Utilisateurs** : Gérer les suspensions et le KYC (Know Your Customer).
- **Arbitrage** : Système de gestion des litiges et tickets de support.
- **Audit et Sécurité** : Consulter les logs d'audit et gérer les paramètres généraux.

---

## ⚙️ Cycle de Vie d'une Tontine

1. **Configuration** : Le chef tontinier définit toutes les règles (qui deviennent immuables une fois la tontine démarrée).
2. **Adhésion** : Les membres rejoignent, lisent et acceptent explicitement les conditions.
3. **Pré-démarrage** : Définition de l'ordre de passage.
4. **Active** : Déroulement de la tontine avec cotisations régulières, application automatique des pénalités en cas de retard, et distributions automatiques.
5. **Terminée** : Clôture de la tontine et archivage.

---

## 🚀 Technologies Utilisées

TontineChain s'appuie sur une stack moderne, robuste et réactive :

### 🎨 Frontend (Interface Utilisateur)
- **React 19** : Bibliothèque UI principale.
- **TypeScript** : Typage statique pour une base de code fiable et sécurisée.
- **Vite** : Bundler ultra-rapide pour l'expérience de développement.
- **React Router v6** : Gestion des routes et sécurisation des accès (Private Routes par rôle).
- **Zustand** : Gestion d'état global léger et performant (Authentification, Utilisateur).
- **TanStack Query (React Query)** : Gestion de cache, data fetching et mutations avec le backend.
- **@dnd-kit** : Implémentation fluide du glisser-déposer pour l'ordre de passage.
- **Lucide React** : Bibliothèque d'icônes modernes.
- **Sonner** : Système de notifications Toast élégant.

### ⚙️ Services & Interactions Backend
- **Axios** : Client HTTP pour communiquer avec l'API REST.
- **ethers.js** (prévu) : Interaction avec les Smart Contracts Ethereum/EVM.
- **date-fns** : Manipulation et formatage des dates (localisées en français).
- **APIs Mobile Money** : Intégrations avec MTN Money et Moov Money pour les paiements.

### 🏛 Architecture Globale (Vue d'ensemble)
- **API REST** : Node.js + PostgreSQL.
- **Blockchain** : Smart Contracts Solidity (EVM).
- **Temps Réel** : WebSocket / SSE (Server-Sent Events) pour les paiements et notifications.

---

## 🛠 Installation et Lancement en Local (Frontend)

### Prérequis
- [Node.js](https://nodejs.org/) (version 18+ recommandée)
- `npm` ou `yarn` ou `pnpm`

### Étapes d'installation

1. Cloner le dépôt et accéder au dossier `front` :
   ```bash
   cd TontineChain/front
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```

4. Construire pour la production :
   ```bash
   npm run build
   ```

Le serveur de développement démarrera généralement sur `http://localhost:5173`.
