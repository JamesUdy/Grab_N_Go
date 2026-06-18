# GrabNGo

A collaborative grocery list app — fast, synced, and always in your pocket.

Live demo: **https://grab-n-go.netlify.app/**

---

## What it does

- Add grocery items with quantities; the list syncs across all open tabs and devices in real time
- Double-click any item to remove it
- Sign in with Google — your list is private to your account
- Multiple named lists with a shared-list collaboration mode
- Built-in analytics (most-added items, shopping frequency)
- Three colour themes: Noir, Light, Dark — persisted across sessions
- Installable as a PWA (works offline for reads)

---

## Tech stack

| Concern | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Database | Firebase Realtime Database v11 |
| Auth | Firebase Authentication (Google OAuth) |
| Hosting | Netlify |
| Linting | ESLint 10 + typescript-eslint |
| Formatting | Prettier 3 |

---

## Running locally

```bash
npm install
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # tsc + vite build → dist/
npm run preview    # Preview the production build
npm run lint       # ESLint
npm run format     # Prettier write
```

---

## Project structure

```
src/
├── App.tsx                   # Root — route layout
├── main.tsx                  # React entry point
├── index.css                 # Tailwind v4 + theme tokens + global styles
├── assets/
│   └── noir.png              # Mascot (noir detective with receipt)
├── auth/
│   ├── AuthContext.tsx        # Firebase auth state provider
│   ├── RequireAuth.tsx        # Route guard
│   └── useAuth.ts            # Auth hook
├── components/
│   ├── AddItemForm.tsx        # Name + quantity form
│   ├── ItemCard.tsx           # Single list item (dblclick removes)
│   ├── ItemList.tsx           # List renderer + empty state
│   ├── ThemeToggle.tsx        # Cycle between themes
│   └── UpdateToast.tsx        # PWA update prompt
├── hooks/
│   └── useItems.ts            # Firebase onValue subscription + CRUD
├── lib/
│   └── firebase.ts            # Firebase app init + db export
├── pages/
│   ├── LoginPage.tsx          # Auth landing (animated)
│   ├── ListsOverviewPage.tsx  # All lists dashboard
│   ├── ListPage.tsx           # Single list view
│   ├── AnalyticsPage.tsx      # Usage analytics
│   ├── SettingsPage.tsx       # Theme + account settings
│   ├── ThemeChooserPage.tsx   # First-time theme picker
│   └── NotFoundPage.tsx       # 404
└── theme/
    ├── ThemeContext.tsx        # Theme provider
    └── useTheme.ts            # Theme hook
```

---

## How the data layer works

1. `useItems` subscribes to `itemsList/` in Firebase via `onValue` — React state updates on every remote change.
2. `addItem(name, qty)` calls `push(itemsRef, [name, qty])` — Firebase assigns the key.
3. `removeItem(id)` calls `remove(ref(db, \`itemsList/\${id}\`))`.
4. Firebase Auth restricts reads/writes to the signed-in user's data.

---

## Firebase config

Database URL is set in `src/lib/firebase.ts`:

```
https://grabngo-339fa-default-rtdb.asia-southeast1.firebasedatabase.app/
```

---

Built by [Udhaya Prakash M](https://udhay-prakash-portfolio.vercel.app/) — [LinkedIn](https://www.linkedin.com/in/udhaya-prakash-m-835b83226/) · [GitHub](https://github.com/JamesUdy)
