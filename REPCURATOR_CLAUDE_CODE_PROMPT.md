# RepCurator — Prompt Complet pour Claude Code

## Contexte du Projet

RepCurator est une plateforme de curation de produits destinée aux communautés d'achat via agents chinois (CNFans, Hipobuy, Sugargoo, Pandabuy). Les utilisateurs y trouvent des articles sourcés depuis Weidian, Taobao et 1688, avec des photos QC (Quality Check), des guides de tailles, et des groupes communautaires pour partager leurs trouvailles.

Le domaine utilise un vocabulaire spécifique :
- **QC (Quality Check)** : Photos de contrôle qualité prises par l'agent avant expédition
- **GL (Green Light)** : Le produit est validé, bon à expédier
- **RL (Red Light)** : Le produit est rejeté, demande d'échange
- **Batch** : Version de fabrication d'un produit (LJR, GX, VT, PK, OG, M Batch, HP…)
- **Agent** : Intermédiaire d'achat (CNFans, Hipobuy, Sugargoo, Pandabuy)
- **W2C (Where to Cop)** : Lien d'achat vers Weidian/Taobao/1688
- **Haul** : Commande groupée de plusieurs articles

---

## Stack Technique

```
Framework     : Next.js 14 (App Router)
Langage       : TypeScript
Styling       : Tailwind CSS + Shadcn/UI
Base de données : Supabase (PostgreSQL + Auth + Storage)
ORM           : Prisma (connecté à Supabase)
i18n          : next-intl (FR / EN / CN)
Auth          : Supabase Auth (email + OAuth Google/Discord)
Storage       : Supabase Storage (images QC, avatars)
Déploiement   : Vercel (prévu, pas à configurer maintenant)
```

---

## Architecture des Fichiers

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Page d'accueil / catalogue
│   │   ├── products/
│   │   │   ├── page.tsx                # Liste produits + recherche + filtres
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Détail produit + QC + guide tailles
│   │   ├── groups/
│   │   │   ├── page.tsx                # Liste des groupes
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Détail groupe + posts
│   │   ├── size-guide/
│   │   │   └── page.tsx                # Guide des tailles général
│   │   └── admin/
│   │       ├── layout.tsx              # Layout admin avec sidebar
│   │       ├── page.tsx                # Dashboard admin
│   │       ├── products/
│   │       │   └── page.tsx            # CRUD produits
│   │       ├── users/
│   │       │   └── page.tsx            # Gestion utilisateurs + rôles
│   │       ├── groups/
│   │       │   └── page.tsx            # Modération groupes
│   │       └── size-charts/
│   │           └── page.tsx            # Édition des guides de tailles
│   ├── api/
│   │   ├── products/
│   │   │   └── route.ts
│   │   ├── qc/
│   │   │   └── route.ts
│   │   ├── groups/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── posts/route.ts
│   │   │       └── members/route.ts
│   │   ├── users/
│   │   │   └── route.ts
│   │   └── upload/
│   │       └── route.ts
├── components/
│   ├── ui/                             # Shadcn/UI components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── LangSwitcher.tsx
│   │   └── AdminSidebar.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx          # Barre recherche + filtres catégorie/batch/tri
│   │   ├── ProductDetail.tsx
│   │   ├── AgentButtons.tsx            # Boutons "Acheter via CNFans/Hipobuy/..."
│   │   ├── QCSection.tsx               # Section photos QC avec verdicts GL/RL
│   │   ├── QCUploadForm.tsx            # Formulaire d'upload QC (avec vérif permissions)
│   │   └── SizeGuideWidget.tsx         # Guide tailles intégré au produit
│   ├── groups/
│   │   ├── GroupCard.tsx
│   │   ├── GroupPostCard.tsx
│   │   ├── CreateGroupModal.tsx
│   │   └── PostFindForm.tsx
│   ├── admin/
│   │   ├── StatsCards.tsx
│   │   ├── ProductTable.tsx
│   │   ├── ProductForm.tsx             # Formulaire ajout/édition produit
│   │   ├── UserTable.tsx
│   │   ├── UserRoleEditor.tsx          # Modal édition rôle + affichage permissions
│   │   ├── GroupModerationTable.tsx
│   │   └── SizeChartEditor.tsx         # Éditeur de guides de tailles
│   └── shared/
│       ├── Badge.tsx
│       ├── SearchBar.tsx
│       └── ImageGallery.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Client browser
│   │   ├── server.ts                   # Client server-side
│   │   └── admin.ts                    # Client admin (service role)
│   ├── auth/
│   │   ├── permissions.ts              # Système RBAC
│   │   └── middleware.ts               # Protection des routes admin
│   ├── i18n/
│   │   ├── config.ts
│   │   └── request.ts
│   └── utils/
│       ├── agents.ts                   # Génération URLs affiliées par agent
│       └── sizes.ts                    # Logique de conversion de tailles
├── messages/
│   ├── fr.json
│   ├── en.json
│   └── cn.json
├── prisma/
│   └── schema.prisma
└── middleware.ts                        # i18n routing + auth check
```

---

## Schéma de Base de Données (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Utilisateurs & Rôles ───

enum UserRole {
  READER        // Lecture seule
  WRITER        // Lecture + écriture + upload QC
  MODERATOR     // Tout + modération (supprimer posts, mute users dans groupes)
  ADMIN         // Accès total (panneau admin, CRUD produits, gestion users)
}

enum UserStatus {
  ACTIVE
  BANNED
  SUSPENDED
}

model User {
  id            String      @id @default(uuid())
  email         String      @unique
  username      String      @unique
  avatarUrl     String?
  role          UserRole    @default(READER)
  status        UserStatus  @default(ACTIVE)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  qcPhotos      QCPhoto[]
  groupsCreated Group[]     @relation("GroupCreator")
  memberships   GroupMember[]
  posts         GroupPost[]
  postLikes     PostLike[]
  comments      Comment[]
}

// ─── Produits ───

model Category {
  id        String    @id @default(uuid())
  name      String    @unique          // ex: "Sneakers"
  nameFr    String
  nameEn    String
  nameCn    String
  slug      String    @unique
  products  Product[]
  sizeChart SizeChart?
}

model Product {
  id            String    @id @default(uuid())
  name          String                        // Nom principal (FR)
  nameEn        String                        // Nom EN
  nameCn        String                        // Nom CN
  slug          String    @unique
  description   String?
  descriptionEn String?
  descriptionCn String?
  price         Float                         // Prix en Yuan (¥)
  currency      String    @default("¥")
  batch         String                        // LJR, GX, VT, etc.
  seller        String                        // Nom du vendeur
  rating        Float     @default(0)
  imageUrl      String?                       // Image principale
  images        String[]                      // Galerie d'images
  weidianUrl    String?                       // Lien Weidian
  taobaoUrl     String?                       // Lien Taobao
  url1688       String?                       // Lien 1688
  sizes         String[]                      // Tailles disponibles ["38","39","40",...]
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  categoryId    String
  category      Category  @relation(fields: [categoryId], references: [id])
  qcPhotos      QCPhoto[]
  sizeOverrides SizeOverride[]

  @@index([categoryId])
  @@index([batch])
}

// ─── Photos QC ───

enum QCVerdict {
  GL    // Green Light — bon à envoyer
  RL    // Red Light — à renvoyer
}

model QCPhoto {
  id        String     @id @default(uuid())
  images    String[]                          // URLs des images (Supabase Storage)
  verdict   QCVerdict
  comment   String?
  createdAt DateTime   @default(now())

  productId String
  product   Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  userId    String
  user      User       @relation(fields: [userId], references: [id])

  @@index([productId])
}

// ─── Guide des Tailles ───

model SizeChart {
  id         String   @id @default(uuid())
  headers    String[]                         // ex: ["EU", "US", "UK", "CM"]
  rows       Json                             // Array de arrays: [["36","4","3.5","22.5"], ...]
  updatedAt  DateTime @updatedAt

  categoryId String   @unique
  category   Category @relation(fields: [categoryId], references: [id])
}

model SizeOverride {
  id        String   @id @default(uuid())
  sizeLabel String                            // ex: "42"
  values    Json                              // ex: { "us": "8.5", "uk": "8", "cm": "26.5" }

  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@unique([productId, sizeLabel])
}

// ─── Groupes Communautaires ───

enum GroupType {
  PUBLIC
  PRIVATE
}

enum MemberRole {
  MEMBER
  MODERATOR
  OWNER
}

model Group {
  id          String    @id @default(uuid())
  name        String
  description String?
  type        GroupType @default(PUBLIC)
  avatarUrl   String?
  createdAt   DateTime  @default(now())

  creatorId   String
  creator     User      @relation("GroupCreator", fields: [creatorId], references: [id])
  members     GroupMember[]
  posts       GroupPost[]

  @@index([type])
}

model GroupMember {
  id       String     @id @default(uuid())
  role     MemberRole @default(MEMBER)
  joinedAt DateTime   @default(now())

  userId   String
  user     User       @relation(fields: [userId], references: [id])
  groupId  String
  group    Group      @relation(fields: [groupId], references: [id], onDelete: Cascade)

  @@unique([userId, groupId])
}

model GroupPost {
  id        String   @id @default(uuid())
  title     String
  content   String?
  price     String?                           // ex: "199¥"
  link      String?                           // Lien Weidian/Taobao
  imageUrl  String?
  createdAt DateTime @default(now())

  userId    String
  user      User     @relation(fields: [userId], references: [id])
  groupId   String
  group     Group    @relation(fields: [groupId], references: [id], onDelete: Cascade)
  likes     PostLike[]
  comments  Comment[]

  @@index([groupId])
}

model PostLike {
  id     String @id @default(uuid())
  userId String
  user   User   @relation(fields: [userId], references: [id])
  postId String
  post   GroupPost @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@unique([userId, postId])
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())

  userId    String
  user      User     @relation(fields: [userId], references: [id])
  postId    String
  post      GroupPost @relation(fields: [postId], references: [id], onDelete: Cascade)
}
```

---

## Système de Permissions (RBAC)

Fichier `lib/auth/permissions.ts` — Implémente cette logique :

```
READER :
  ✅ Voir les produits, QC, groupes publics
  ❌ Poster, uploader QC, créer des groupes

WRITER :
  ✅ Tout ce que READER peut faire
  ✅ Uploader des photos QC
  ✅ Poster dans les groupes (publics + ceux dont il est membre)
  ✅ Commenter et liker
  ❌ Modérer, supprimer les posts des autres

MODERATOR :
  ✅ Tout ce que WRITER peut faire
  ✅ Supprimer les posts/QC des autres utilisateurs
  ✅ Mute/ban dans les groupes qu'il modère
  ❌ Accéder au panneau admin, CRUD produits

ADMIN :
  ✅ Accès total
  ✅ Panneau admin (CRUD produits, catégories, tailles)
  ✅ Gestion des utilisateurs (changer rôles, ban/unban)
  ✅ Modération globale de tous les groupes
  ✅ Édition du contenu du site sans toucher au code
```

**Middleware de protection** : Toutes les routes `/admin/*` doivent vérifier que l'utilisateur a le rôle `ADMIN`. Les routes API doivent vérifier les permissions selon l'action (POST, DELETE, etc.).

---

## Fonctionnalités Détaillées

### 1. Traduction i18n (FR / EN / CN)

- Utiliser `next-intl` avec routing basé sur `[locale]`
- Fichiers de traduction dans `/messages/fr.json`, `en.json`, `cn.json`
- Le switch de langue est dans la navbar (drapeaux 🇫🇷 🇬🇧 🇨🇳)
- Traduire : navigation, labels, boutons, messages d'erreur, placeholders
- Les noms de produits et descriptions ont des champs séparés par langue dans la DB
- La langue par défaut est le français

### 2. Recherche & Navigation Produits

- **Barre de recherche** : Recherche par nom de produit (dans la langue active), par batch, par vendeur
- **Filtres** :
  - Catégorie (pills cliquables : Sneakers, Hoodies, T-Shirts, Pants, Accessories)
  - Batch (dropdown : LJR, GX, VT, PK, OG, M Batch, HP)
  - Tri (dropdown : Plus récent, Prix croissant, Prix décroissant, Meilleure note)
- **Grille de produits** : Cards avec image, nom, batch badge, catégorie badge, prix, note, nombre de QC
- Les filtres sont dans l'URL (query params) pour le partage et le SEO

### 3. Guide des Tailles

**Guide général** (page `/size-guide`) :
- Tabs par catégorie : Sneakers (EU/US/UK/CM), Tops (Taille/Poitrine/Longueur/Épaules), Bottoms (Taille/Tour de taille/Longueur/Hanches)
- Tableau clair avec alternance de couleurs de lignes
- Éditable depuis le panneau admin

**Override par produit** :
- Si un produit a des `SizeOverride` en DB, afficher son propre tableau de tailles dans la fiche produit avec un badge "Guide spécifique à cet article"
- Sinon, afficher le guide général de sa catégorie

### 4. Photos QC & Fiches Produits

**Fiche produit** (`/products/[id]`) :
- Image principale + galerie
- Infos : nom, description, prix, batch, vendeur, note, tailles disponibles
- Boutons "Acheter via [Agent]" — génère les URLs affiliées CNFans, Hipobuy, etc. à partir du lien Weidian/Taobao/1688
- Tabs : Détails | Photos QC | Guide Tailles

**Section QC** :
- Liste des QC soumis avec : nom utilisateur + badge rôle, images (galerie cliquable), verdict GL/RL, commentaire, date
- Formulaire d'upload QC (visible uniquement si rôle >= WRITER) :
  - Upload multiple images (max 6, via Supabase Storage)
  - Sélection verdict GL/RL
  - Champ commentaire
  - Validation côté serveur du rôle

### 5. Groupes Communautaires

**Liste des groupes** (`/groups`) :
- Cards avec : avatar, nom, type (Public/Privé badge), description, nombre de membres, nombre de trouvailles
- Bouton "Créer un groupe" (rôle >= WRITER)
- Bouton "Rejoindre" (public) ou "Demander accès" (privé)

**Détail groupe** (`/groups/[id]`) :
- Header avec infos du groupe
- Liste des posts (trouvailles) avec : titre, image, prix, lien, likes, commentaires, auteur, date
- Formulaire "Publier une trouvaille" (membres du groupe avec rôle >= WRITER) :
  - Titre, prix, lien Weidian/Taobao/1688, image, description
- Système de likes et commentaires
- Pour les groupes privés : seuls les membres voient le contenu
- Le créateur du groupe peut inviter des membres et nommer des modérateurs

### 6. Interface Admin

**Dashboard** (`/admin`) :
- Stats cards : nombre de produits, utilisateurs, groupes, QC photos
- Activité récente : derniers QC, nouveaux groupes, actions de modération
- Graphiques simples (optionnel) : inscriptions par semaine, QC par jour

**Gestion Produits** (`/admin/products`) :
- Tableau avec tous les produits : nom, catégorie, batch, prix, nombre QC, actions
- Bouton "Ajouter produit" → formulaire complet :
  - Nom (FR/EN/CN), description (FR/EN/CN)
  - Catégorie (dropdown), batch (dropdown ou input libre)
  - Prix, vendeur
  - Upload image principale + galerie
  - Liens Weidian/Taobao/1688
  - Tailles disponibles (multi-select ou input chips)
  - Overrides de tailles (tableau éditable optionnel)
- Édition inline ou via modal
- Suppression avec confirmation

**Gestion Utilisateurs** (`/admin/users`) :
- Tableau avec : username, email, rôle, nombre de posts, statut (actif/banni), date inscription
- Actions : changer le rôle (dropdown Reader/Writer/Moderator/Admin), ban/unban
- Modal d'édition du rôle avec affichage visuel des permissions associées

**Modération Groupes** (`/admin/groups`) :
- Tableau avec : nom du groupe, type, membres, trouvailles, créateur
- Actions : modérer (voir les posts signalés), supprimer le groupe
- Possibilité de renommer, changer le type public/privé

**Édition Guide Tailles** (`/admin/size-charts`) :
- Sélecteur de catégorie
- Tableau éditable : ajouter/supprimer des lignes, modifier les valeurs
- Bouton sauvegarder → met à jour la DB

---

## Génération d'URLs Agent

Fichier `lib/utils/agents.ts` — Logique pour transformer un lien Weidian/Taobao/1688 en lien affilié par agent :

```typescript
type Agent = "cnfans" | "hipobuy" | "sugargoo" | "pandabuy";

function generateAgentUrl(sourceUrl: string, agent: Agent): string {
  // Chaque agent a son propre format d'URL avec le lien source encodé
  // CNFans : https://cnfans.com/product/?shop_type=weidian&id=XXX
  // Hipobuy : https://www.hipobuy.com/product/XXX
  // etc.
  // Extraire l'ID produit du lien source et construire l'URL agent
}
```

---

## Conventions de Code

- **TypeScript strict** : Pas de `any`, interfaces pour tous les types
- **Server Components par défaut** : Utiliser `"use client"` uniquement quand nécessaire (formulaires, interactivité)
- **Validation** : Zod pour la validation des formulaires et des API routes
- **Error handling** : try/catch sur toutes les opérations DB, messages d'erreur traduits
- **Commentaires** : Commenter les parties complexes (RBAC, génération URLs agent)
- **Nommage** : camelCase pour les variables/fonctions, PascalCase pour les composants, SCREAMING_SNAKE pour les constantes

---

## Design & UI

- **Thème sombre** : Background très foncé (#0a0a0c), cartes légèrement plus claires (#131318)
- **Accent rouge** : #e84142 pour les CTAs, prix, éléments importants
- **Typographie** : Font display "Outfit" pour les titres, "DM Sans" pour le body
- **Badges colorés** : Bleu pour catégories, violet pour batches, vert/rouge pour GL/RL
- **Animations** : Transitions subtiles au hover sur les cards, fade-in au chargement
- **Responsive** : Mobile-first, grille adaptive pour les produits

---

## Ordre d'Implémentation Suggéré

1. Setup Next.js + Tailwind + Shadcn/UI + Prisma + Supabase
2. Schéma Prisma + migrations + seed data
3. Auth Supabase + middleware de protection
4. Système RBAC (permissions.ts)
5. i18n avec next-intl (3 langues)
6. Pages produits (liste + détail + recherche/filtres)
7. Guide des tailles (général + overrides)
8. Photos QC (affichage + upload)
9. Groupes communautaires (CRUD + posts + likes/commentaires)
10. Interface Admin complète
11. Génération URLs agents
12. Polish UI + responsive + animations
