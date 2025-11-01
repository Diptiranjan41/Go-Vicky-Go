# Copilot / AI assistant instructions — Go Vicky Go

Short, focused instructions to help an AI assistant be productive in this repo.

Overview
- This is a mono-repo with two main services: `frontend/` (React + Vite) and `backend/` (Express + Mongoose).
- Frontend is a Vite React SPA using React Router and several context providers in `frontend/src/context/`.
- Backend is a small Express app in `backend/src/` that connects to MongoDB using `backend/src/config/db.js`.

How to run (developer workflows)
- Frontend (dev + build): open `frontend/` and use npm scripts in `frontend/package.json`:
  - `npm run dev` or `npm start` — run Vite dev server (HMR)
  - `npm run build` — production build
  - Environment keys for frontend use Vite format: `VITE_...` and are accessed via `import.meta.env` (e.g. `VITE_GEMINI_API_KEY` used in `src/services/geminiService.js`).
- Backend (dev): open `backend/` and run Node. There is no explicit start script — the app entry is `backend/src/app.js`.
  - Ensure `.env` contains `MONGO_URI` (used by `backend/src/config/db.js`) and optionally `PORT`.
  - Use `nodemon` (devDependency) for hot reload during development: `npx nodemon src/app.js`.

Architecture & patterns (what matters)
- Frontend uses multiple global Context providers: `CurrencyContext`, `NotificationContext`, `SearchContext`, `WishlistContext`, `CartContext`. Wrap new features in the appropriate provider when they need shared state (see `src/App.jsx`).
- Routing: `src/App.jsx` declares the route map. New pages/components should be added and then referenced there.
- UI composition lives under `src/components/ui/custom/` — large sections like `Header`, `Hero`, `Footer3D`, and many page components live there.
- Services / API wrappers: place fetch wrappers under `src/services/` (example: `geminiService.js` for Google Generative API). Use `import.meta.env.VITE_...` for secret-like keys.
- Local auth in UI: several components (e.g. `SignIn/SignIn.jsx`) store user info in `localStorage` (`userDetails`, `currentUser`, `authToken`). When integrating real auth, replace localStorage usage with proper backend endpoints and token management.

Backend specifics
- Code uses CommonJS (`require`) and `type: "commonjs"` in `backend/package.json`.
- DB connection: `backend/src/config/db.js` calls `mongoose.connect(process.env.MONGO_URI, ...)` and terminates process on connection failure. Keep `.env` up-to-date.
- `backend/src/app.js` currently contains the server and a placeholder for route imports — add routes under `backend/src/routes/` and mount them (`app.use('/api/...', routes)`).

Integration points & notable dependencies
- Google Generative AI: frontend depends on `@google/genai` and `@google/generative-ai` and the project uses a direct fetch wrapper in `src/services/geminiService.js` calling Generative Language API. Protect keys with Vite env vars.
- Firebase: `firebase` is a frontend dependency and there is a service worker `public/public/firebase-messaging-sw.js` — be mindful of auth and messaging integration when changing build/static assets.
- Payments: `@paypal/react-paypal-js` and `razorpay` are present. Check `pages/PaymentPage.jsx` (and related routes) before modifying checkout flows.

Conventions & common patterns
- Styling: Tailwind is used (see `tailwind.config.js` and `src/index.css`). Keep utility-first classes in components; avoid adding global CSS unless necessary.
- Assets: large data files are in `public/` (e.g. `public/food_items_large.json`); read from `public/` in production builds — don't import huge JSON into bundles.
- Component structure: small reusable UI pieces live under `src/components/ui/` and page-level components under `src/pages/` and `src/bookingPages/`.
- State persistence: many features use `localStorage` for prototypes (auth, user profile). When converting to server-backed flows, centralize token handling and follow the existing keys (`authToken`, `currentUser`, `userDetails`).

Files to reference when making changes
- Frontend entry: `frontend/src/main.jsx`, router and providers: `frontend/src/App.jsx`.
- Sign-in example (local-storage approach): `frontend/src/SignIn/SignIn.jsx`.
- AI service wrapper: `frontend/src/services/geminiService.js`.
- Frontend scripts + deps: `frontend/package.json`.
- Backend entry + DB: `backend/src/app.js`, `backend/src/config/db.js`, `backend/package.json`.

Quick examples for common edits
- Add an API route in backend:
  1. create `backend/src/routes/my.route.js` exporting an Express router
  2. in `backend/src/app.js` add: `const myRoutes = require('./routes/my.route'); app.use('/api/my', myRoutes);`
- Use a Vite env variable in frontend (example already used):
  - set `VITE_GEMINI_API_KEY=...` in `.env` at `frontend/` root
  - consumption: `const apiKey = import.meta.env.VITE_GEMINI_API_KEY;` (see `src/services/geminiService.js`).

What NOT to change lightly
- Do not change `type` in `backend/package.json` to `module` without updating the backend codebase to ESM — current code uses CommonJS.
- Avoid bundling extremely large JSON into the client bundle — keep them in `public/` and fetch at runtime.

If you need more context
- Open `frontend/README.md` and `frontend/package.json` for frontend dev specifics.
- Open `backend/src/app.js` and `backend/src/config/db.js` for backend patterns and environment expectations.

If anything here is unclear or you'd like this document to include additional examples (tests, CI, or deployment steps), tell me what to add and I will iterate.
