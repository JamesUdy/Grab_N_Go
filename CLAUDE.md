# CLAUDE.md — GrabNGo

## What This Project Is

**GrabNGo** is a collaborative grocery list web app. Users add items with quantities; the list syncs in real time across all open tabs/devices via Firebase Realtime Database. Double-clicking an item removes it.

Live demo: https://grab-n-go.netlify.app/

---

## Tech Stack

| Concern | Technology |
|---|---|
| Runtime | Node.js (dev only) |
| Framework | React 19 + Vite 8 |
| Language | TypeScript 6 |
| Styling | Tailwind CSS v4 (Vite plugin, no config file) |
| Database | Firebase Realtime Database v11 (npm SDK) |
| Linting | ESLint 10 + typescript-eslint |
| Formatting | Prettier 3 |
| Hosting | Netlify |

---

## Repository Structure

```
Grab_N_Go/
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component — layout + wires hook to components
│   ├── index.css             # Tailwind v4 import (@import "tailwindcss")
│   ├── assets/
│   │   └── shoppy.webp       # Hero image (imported as ES module in App.tsx)
│   ├── components/
│   │   ├── AddItemForm.tsx   # Name + quantity inputs and flip button
│   │   ├── FlipButton.module.css  # CSS module for 3-D flip button hover effect
│   │   ├── ItemCard.tsx      # Single grocery list item (odd/even colours, dblclick remove)
│   │   └── ItemList.tsx      # Renders the list or empty state
│   ├── hooks/
│   │   └── useItems.ts       # Firebase onValue subscription + addItem/removeItem
│   └── lib/
│       └── firebase.ts       # Firebase app init + db export
├── public/                   # Static assets (favicons, site.webmanifest)
├── index.html                # Vite entry HTML — mounts #root
├── vite.config.ts            # Vite config — react + tailwindcss plugins
├── eslint.config.js          # ESLint flat config + prettier disables
├── .prettierrc               # Prettier: no semi, single quotes, 100 col
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── package.json
```

---

## How It Works

1. `useItems` subscribes to `itemsList/` in Firebase via `onValue` — sets state on every change.
2. `addItem(name, qty)` calls `push(itemsRef, [name, qty])` — Firebase assigns the key.
3. `removeItem(id)` calls `remove(ref(db, \`itemsList/\${id}\`))`.
4. `ItemCard` renders each item; `onDoubleClick` calls `removeItem`.
5. Odd/even alternating colours (`#3fa7d6` / `#59cd90`) are applied via Tailwind classes based on list index.

---

## Firebase Config

Database URL is hardcoded in `src/lib/firebase.ts`:
```
https://grabngo-339fa-default-rtdb.asia-southeast1.firebasedatabase.app/
```

---

## Running Locally

```bash
npm install
npm run dev        # Vite dev server at http://localhost:5173
npm run build      # tsc + vite build → dist/
npm run preview    # Preview the production build
npm run lint       # ESLint
npm run format     # Prettier write
```

---

## Where To Look For What

| Task | File |
|---|---|
| Change layout / page structure | `src/App.tsx` |
| Add/change form inputs | `src/components/AddItemForm.tsx` |
| Change item card appearance | `src/components/ItemCard.tsx` |
| Change button flip animation | `src/components/FlipButton.module.css` |
| Change Firebase DB path or config | `src/lib/firebase.ts` |
| Change how items are read/written | `src/hooks/useItems.ts` |
| Add global styles | `src/index.css` |
| Change CORS / Vite plugins | `vite.config.ts` |
