# EcoVeridian

Student-led environmental research hub — React 19 + Vite + Tailwind CSS v4, with a
Firebase-backed admin CMS at `/admin`.

## How content works

Every piece of site content (articles, resources, team, page copy, nav, footer,
theme colors, SEO) lives in **Firestore** and is edited from the **admin panel at
`/admin`** — no code changes or deploys needed. The public site resolves content
as: Firestore → localStorage cache (previous visit) → bundled seeds
(`src/content/seeds.ts`), so it always renders even if Firestore is unreachable.

- Public reads use `firebase/firestore/lite`; the admin panel (full SDK + auth)
  is a lazy chunk that public visitors never download.
- Public queries **must** filter `publishStatus == 'published'` — the security
  rules reject unfiltered queries (rules are not filters).
- Firestore doc IDs are content slugs (`ART-001`, `EV-TOUR-2026-01`) and appear
  in URLs (`/articles/ART-001`).

## Development

```bash
npm install
cp .env.example .env.local   # fill in the Firebase web config
npm run dev                  # http://localhost:3000
npm run lint                 # typecheck (tsc --noEmit)
npm run build                # production build
```

## Deployment (Vercel)

Deploys build from git as before. **The six `VITE_FIREBASE_*` variables from
`.env.local` must be set in Vercel → Project Settings → Environment Variables**,
otherwise the deployed site serves only the bundled fallback content.

Firebase security rules deploy separately from the repo root:

```bash
npx firebase-tools deploy --only firestore   # firestore.rules
npx firebase-tools deploy --only storage     # storage.rules (needs Storage enabled)
```

## Admin panel runbook

- **URL:** `/admin` (login at `/admin/login`).
- **First owner (bootstrap):** `risithcha@gmail.com` can self-activate via the
  login page's *Activate Account* tab — this email is allowlisted in
  `firestore.rules` and `src/admin/AuthContext.tsx`.
- **Inviting teammates:** Admin Users → invite an email with a role. The invitee
  opens `/admin/login` → *Activate Account* and picks a password.
- **Roles & permissions:** roles live in the `roles` Firestore collection and are
  managed on the Roles page (owners, or anyone whose role has the *users*
  permission). Each role is a set of granular permissions (articles, resources,
  team, taxonomies, pages, settings, inquiries, media, users), enforced in
  `firestore.rules`/`storage.rules` **and** in the UI. Built-ins: **Owner**
  (immutable superuser) and **Editor** (content). Guarantees encoded in the
  rules: owner accounts cannot be modified or removed by anyone (including
  other owners); only owners can grant the owner role; the owner role doc
  itself is immutable.
- **Removing access:** Admin Users → remove. This deletes the Firestore admin
  doc; the Auth account itself can only be deleted in the Firebase console.
- **Seeding:** Import Defaults writes the bundled seed content into Firestore
  (skips non-empty collections unless *overwrite* is checked).
- **Inquiries:** the Partner form writes to the Firestore `inquiries` inbox
  (visible in admin) *and* relays an email via FormSubmit to the address in
  Site Settings.

## Firebase project

- Project: `ecoveridian` (config in `.env.local`; web config values are public
  identifiers — all security lives in the rules files).
- Firestore `(default)` database, `nam5`, **free tier** — keep it that way by
  not creating additional databases.
- **Storage is not yet enabled.** Enable via console (Storage → Get Started,
  requires Blaze; free allowances still apply), then
  `npx firebase-tools deploy --only storage`. Until then the Media Library
  shows a notice and image fields take pasted URLs.
- Known SPA limit: social-media link previews (Discord/Slack/X cards) always
  show the static tags from `index.html`, not per-article ones — that would
  require prerendering/SSR.
