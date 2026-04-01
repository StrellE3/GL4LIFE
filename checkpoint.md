# RepCurator — Checkpoint Projet

> Dernière mise à jour : 2026-04-01

---

## Présentation

**RepCurator** est une plateforme de curation de produits destinée aux communautés d'achat via agents chinois (CNFans, Hipobuy, Sugargoo, Pandabuy). Les utilisateurs y trouvent des articles sourcés depuis Weidian, Taobao et 1688, avec des photos QC, des guides de tailles, et des groupes communautaires.

---

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript (strict) |
| Styling | Tailwind CSS + Shadcn/UI |
| Base de données | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | Supabase Auth (email + OAuth) |
| Storage | Supabase Storage |
| i18n | next-intl (FR / EN / CN) |
| Déploiement | Vercel (prévu) |

---

## Checkpoints

### Infrastructure

- [x] Schéma Prisma complet — User, Product, Category, QCPhoto, SizeChart, Group, GroupPost, PostLike, Comment, SizeOverride, GroupMember
- [x] Clients Supabase configurés — browser (`client.ts`), server (`server.ts`), admin (`admin.ts`)
- [x] Middleware auth + protection des routes `/admin/*`
- [x] Système i18n complet — routing + config + fichiers de traduction (fr/en/cn)
- [x] Système RBAC (`permissions.ts`) — rôles READER / WRITER / MODERATOR / ADMIN
- [x] Utilitaire `getUser.ts` — récupération de l'utilisateur côté serveur
- [x] Layout principal — fonts Outfit/DM Sans, thème sombre (`#0a0a0c`), accent rouge (`#e84142`)
- [ ] `DATABASE_URL` à configurer dans les variables d'environnement (Prisma)
- [ ] Variables d'environnement Supabase à renseigner (URL, anon key, service role key)
- [ ] Script de seed à créer

---

### Pages

- [x] Page d'accueil (`/[locale]`) — hero, CTA, section features
- [x] Login (`/[locale]/login`) + Register (`/[locale]/register`)
- [x] Callback OAuth (`/api/auth/callback`)
- [x] Liste produits (`/[locale]/products`) — grille + recherche + filtres
- [x] Détail produit (`/[locale]/products/[slug]`) — galerie, QC, guide tailles, boutons agents
- [x] Guide des tailles général (`/[locale]/size-guide`)
- [x] Liste groupes (`/[locale]/groups`)
- [x] Détail groupe (`/[locale]/groups/[id]`) — posts, likes, commentaires
- [x] Admin — dashboard (`/admin`)
- [x] Admin — gestion produits (`/admin/products`, `/new`, `/[id]/edit`)
- [x] Admin — gestion utilisateurs (`/admin/users`)
- [x] Admin — modération groupes (`/admin/groups`)
- [x] Admin — édition guides de tailles (`/admin/size-charts`)

---

### Composants

**Layout**
- [x] `Navbar.tsx`
- [x] `NavbarUserMenu.tsx`
- [x] `LangSwitcher.tsx`
- [x] `Footer.tsx`

**Auth**
- [x] `LoginForm.tsx`
- [x] `RegisterForm.tsx`

**Produits**
- [x] `ProductCard.tsx`
- [x] `ProductGrid.tsx`
- [x] `ProductFilters.tsx` — recherche + filtres catégorie/batch/tri
- [x] `QCSection.tsx` — liste des QC avec verdicts GL/RL
- [x] `QCUploadForm.tsx` — upload multiple images + verdict + commentaire
- [x] `AgentButtons.tsx` — boutons CNFans / Hipobuy / Sugargoo / Pandabuy
- [x] `SizeGuideWidget.tsx` — guide tailles intégré à la fiche produit

**Groupes**
- [x] `GroupCard.tsx`
- [x] `GroupPostCard.tsx`
- [x] `CreateGroupModal.tsx`
- [x] `PostFindForm.tsx`

**Admin**
- [x] `AdminSidebar.tsx`
- [x] `ProductForm.tsx` — formulaire ajout/édition produit (FR/EN/CN)
- [x] `SizeChartEditor.tsx` — tableau éditable par catégorie
- [x] `UserRoleEditor.tsx` — modal changement de rôle + affichage permissions

**Shared**
- [x] `ImageGallery.tsx`

**UI (Shadcn)**
- [x] `Button`, `Input`, `Label`

---

### Routes API

- [x] `GET/POST /api/products`
- [x] `POST /api/qc`
- [x] `GET/POST /api/groups`
- [x] `GET/POST /api/groups/[id]/posts`
- [x] `POST /api/groups/posts/[postId]/like`
- [x] `GET/POST /api/admin/products`
- [x] `PATCH/DELETE /api/admin/products/[id]`
- [x] `PATCH /api/admin/users/[id]/role`
- [x] `GET/PUT /api/admin/size-charts`
- [x] `GET /api/auth/callback`

---

### Utilitaires

- [x] `lib/utils/agents.ts` — génération des URLs affiliées par agent (CNFans, Hipobuy, Sugargoo, Pandabuy)
- [x] `lib/prisma.ts` — client Prisma singleton
- [x] `lib/utils.ts` — utilitaires généraux (cn, etc.)

---

### Traductions i18n

- [x] Structure fichiers `messages/fr.json`, `en.json`, `cn.json` en place
- [ ] Vérifier que tous les textes sont bien externalisés (certains sont encore hardcodés en FR)

---

### Qualité & Tests

- [ ] Tests unitaires / intégration (aucun à ce jour)
- [ ] Validation Zod sur toutes les routes API
- [ ] Gestion d'erreurs complète + messages traduits

---

### Déploiement

- [ ] Configuration Vercel
- [ ] Variables d'environnement de production
- [ ] Migration Prisma en production (`prisma migrate deploy`)

---

## Ordre de priorité pour la suite

1. Configurer les variables d'environnement (`.env.local`) et connecter Supabase + Prisma
2. Lancer `prisma migrate dev` + créer un script de seed
3. Vérifier et compléter les implémentations dans chaque fichier (pages + API routes)
4. Externaliser les textes hardcodés vers les fichiers i18n
5. Ajouter la validation Zod sur les routes API
6. Tests + déploiement Vercel
