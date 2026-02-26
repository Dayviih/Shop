# Copilot instructions for this repository

This repo is a small React + Vite e-commerce UI. The goal of these notes is to help an AI coding agent become productive quickly by calling out architecture, conventions, developer workflows, and concrete edit locations.

**Big picture**
- **Stack:** React (v19), Vite, `react-router` for routing (see `src/main.jsx` and `src/App.jsx`).
- **Runtime:** Vite dev server (`npm run dev`) on port `5175` by default.
- **Single source of truth for products:** `src/components/assets/all-products.js` contains static product objects and image imports. Most UI components import this file directly.
- **Global app state:** `src/Context/ShopContext.jsx` — the cart and helper functions (`addToCart`, `removeFromCart`, `getTotalCartAmount`, `getTotalCartItems`) live here and are provided to the tree via `ShopContextProvider` in `src/main.jsx`.

**Where to look for common tasks**
- Routing and page structure: `src/App.jsx` (routes for `/`, `/mens`, `/womens`, `/kids`, `/product/:productId`, `/cart`, `/login`).
- Component entry points: `src/components/*` (presentational components like `Navbar`, `Footer`, `ProductDisplay`, `CartItems`).
- Product data + images: `src/components/assets/all-products.js` and image files in the same folder.
- Styles: component-level CSS files live next to components (e.g., `src/components/navbar/Navbar.css`). Global CSS: `src/App.css`.

**Data shapes & conventions (important to preserve)**
- `all_product` array: each product object includes `id` (number), `name`, `category`, `image` (imported asset), `new_price`, `old_price`. When changing IDs keep them numeric.
- `cartItems` (in `ShopContext.jsx`) is an object mapping product id -> quantity, e.g. `{ 1: 0, 2: 3 }`.
- Code that looks up a product does `all_product.find(product => product.id === Number(item))` — maintain numeric IDs and string-to-number conversions if you change keys.

**Coding patterns and small surprises**
- The app imports routing primitives from `react-router` (not `react-router-dom`). If adding new routes or navigation check imports in `src/main.jsx` and `src/App.jsx`.
- Product pages use nested routes in `App.jsx` (`<Route path="/product" element={<Product/>}><Route path=":productId" .../>`). Editing product routing should preserve this pattern.
- Cart logic lives in context, components consume `ShopContext` via `useContext(ShopContext)` (search for `ShopContext` usage when modifying components).

**Developer workflows & commands**
- Start dev server: `npm run dev` (Vite; hot reload). Default port `5175`.
- Build production: `npm run build` → output in `dist/`.
- Preview production locally: `npm run preview`.
- Lint: `npm run lint` (ESLint config is `eslint.config.js`).

If the dev server port is occupied, the Quick Start recommends: `lsof -ti:5175 | xargs kill -9` before `npm run dev`.

**Where to make common changes**
- Add/modify products or images: edit `src/components/assets/all-products.js`. Add image imports at top and push new objects into the `all_product` array.
- Change brand text or navbar: `src/components/navbar/Navbar.jsx` (Quick Start references the brand text at line ~37).
- Change theme colors: `src/App.css` (there are CSS variables described in QUICK_START.md).

**Integration points / how to convert static data to API-backed**
- Currently the UI reads `all_product` directly. To use a backend:
  - Replace the static import in `ShopContext.jsx` or `pages/Shop.jsx` with a fetch call to your API.
  - Keep the `cartItems` shape the same (object map of id->qty) to avoid touching many components.
  - If persisting cart to server/localStorage, perform serialization/deserialization in `ShopContext.jsx`'s initialization.

**Testing & CI**
- There are no tests in the repo. Keep changes small and verify manually with `npm run dev` and `npm run build`.

**Pull request guidance for agents**
- Keep UI changes scoped to a component folder (`src/components/...`) or page file (`src/pages/...`).
- When editing the cart or product model, update `src/Context/ShopContext.jsx` and `src/components/assets/all-products.js` (or document changes to API data shape).

**Examples (quick edits)**
- Add a product image import and object: edit `src/components/assets/all-products.js` top imports and push `{ id: 37, name: 'New', category: 'women', image: p37_img, new_price: 99 }`.
- Persist cart to localStorage: add `useEffect` in `ShopContext.jsx` to sync `cartItems`.

If anything above is unclear or you want me to include more examples (e.g., a small code snippet for fetching products in `ShopContext.jsx`), tell me which area to expand and I will iterate.
