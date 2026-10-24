# apo — Product Spec

Website for **apo** ([@apo.py_](https://www.instagram.com/apo.py_/)), a small custom printing and design business in Villa Elisa, Paraguay. They do **DTF textile printing**, **screen printing (serigrafía)**, personalized gifts and graphic design. Their products include t-shirts, mugs, hats, craft bags, graduation caps (birretes), stationery (papelería) and school kits (kits escolares).

Today, clients find them on Instagram and order through WhatsApp DMs. The site should **win more clients** by showing off past work, and **make ordering faster** by collecting everything needed for an order in one go.

- **Language:** Spanish only (es-PY). All UI copy is in Spanish.
- **Currency:** Guaraníes (PYG, `Gs. 85.000`). No decimals.
- **Hosting:** Cloudflare.

---

## 1. Goals

1. Show a portfolio of past work that convinces visitors to order.
2. Let people request a **custom order** (their design, or a blank product plus customization) with all the details up front: product, quantity, sizes, design files and deadline.
3. Sell **ready-made products** (apo's own designs) through a simple store.
4. Hand every order off to **WhatsApp** with a pre-filled summary, since that's where the business already runs.
5. Give the owner a **mobile-first admin**, simple enough to use from a phone with no technical knowledge.

### Non-goals (v1)
- Customer accounts or logins
- Card payments (planned for Phase 2)
- Multiple languages
- Live design editor or mockup generator

---

## 2. Users

| Who | Needs |
|---|---|
| **Visitor / customer** | See what apo can make, check prices, order or ask for a quote quickly from their phone (most traffic comes from Instagram, so it's mobile). |
| **Owner (admin)** | Young and non-technical. Uploads new work from their phone, manages products and prices, sees incoming orders, updates order status. |

---

## 3. Public site

### 3.1 Inicio (Home)
- Hero with a short pitch ("Estampados DTF y serigrafía en Villa Elisa") and two CTAs: **Pedí tu diseño** (custom order) and **Ver tienda**.
- Featured portfolio pieces.
- Services and techniques overview: DTF, serigrafía, personalized gifts, design.
- Featured products.
- "Cómo funciona" in 3 steps: elegí → mandá tu diseño → retirá/recibí.
- Instagram and WhatsApp links. Floating WhatsApp button on every page.

### 3.2 Trabajos (Portfolio)
- Photo grid. Filters by **category** (remeras, tazas, gorras, bolsos, birretes, papelería, kits escolares, otros) and **technique** (DTF, serigrafía, sublimación, bordado, other).
- Each item has photos (carousel), title, short description, technique and product, and an optional client or occasion (e.g. "Promo 2025 Colegio X").
- CTA on each item: **"Quiero algo así"**, which opens the custom order form prefilled with that product, category and a reference to the item.

### 3.3 Tienda (Store)
Two kinds of products:
- **Diseños propios:** finished products with apo's designs. Pick a variant (size, color) and quantity, then add to cart.
- **Productos para personalizar:** blank products (remera, taza, gorra, bolso…) with a base price. "Personalizar" leads to the custom order form with the product preselected.

Product page: photos, description, price (or "desde Gs. X" for customizable products), variants, available stock if tracked, and add to cart.

### 3.4 Carrito y checkout (Store orders)
- Cart is kept in the browser (localStorage). No login.
- Checkout form fields:
  - Nombre, teléfono/WhatsApp (required), email (optional)
  - **Entrega:** retiro en Villa Elisa / delivery (zone and city) / envío al interior. Options and costs are set in the admin.
  - **Pago:** **Transferencia bancaria** or **Efectivo** (paid on pickup or delivery).
  - **Factura:** "Necesito factura" toggle. When on, asks for **RUC** (validated format `12345678-9`, including the check digit) and **razón social**.
  - Notas
- On submit:
  1. The order is saved and gets a code like `APO-0042`.
  2. A confirmation page shows the summary. For transfers it also shows the bank details (from settings) and an optional **upload of the transfer receipt (comprobante)**.
  3. A **"Confirmar por WhatsApp"** button opens `wa.me/<number>?text=…` with the order code and summary prefilled.

### 3.5 Pedí tu diseño (Custom order / quote request)
A step-by-step form with progress steps, built for phones:
1. **Producto:** type (remera, taza, gorra, bolso, birrete, papelería, kit escolar, otro), optional preferred technique ("No sé, recomiéndenme" is the default).
2. **Cantidad y talles:** total quantity, plus a size breakdown for apparel (e.g. S×5, M×10, L×3) and garment color.
3. **Diseño:**
   - Upload files (images and PDFs, several allowed, size limited), and/or
   - "No tengo diseño, necesito que lo diseñen" plus a description.
   - Where it goes (frente, espalda, manga, etc.)
4. **Fecha y entrega:** needed by (date), delivery method.
5. **Contacto:** name, WhatsApp, email (optional), "Necesito factura" (RUC + razón social, same as checkout), notes.

On submit: the request is saved with a code (`APO-0043`). The confirmation page says "Te vamos a contactar con el presupuesto" and offers a WhatsApp button with the summary prefilled.

Custom orders are **quotes**: no price is shown up front, and the owner replies with a price. Optionally, show "precio orientativo desde Gs. X" using the product's base price.

### 3.6 Seguimiento de pedido (Order tracking)
- Each order has a private link (`/pedido/APO-0042?t=<token>`) that shows its current status. The link is shown on the confirmation page and included in the WhatsApp message.
- No login needed. The token makes the link hard to guess.

### 3.7 Info pages
- **Preguntas frecuentes:** DTF vs serigrafía (when to use each, minimum quantities), turnaround times, file formats, how payment and delivery work.
- **Contacto / Sobre nosotros:** location (Villa Elisa), hours, WhatsApp, Instagram, optional map.

---

## 4. Admin (`/admin`)

**Must be usable from a phone by someone non-technical.** Big buttons, few fields, sensible defaults, no jargon.

### 4.1 Access
- Protected with **Cloudflare Access** (email one-time code). No password system to build or maintain. Free for small teams.

### 4.2 Pedidos (Orders), the main screen
- List of orders, newest first, with a badge for **new** ones. Filter by status and type (tienda / personalizado).
- Order detail: all form data, design files (view and download), transfer receipt, and a **one-tap WhatsApp** button to message the customer.
- Invoice data, if requested: RUC and razón social with a copy button, and an "Factura emitida" checkbox. The factura itself is issued outside the site, in the owner's own invoicing system (SIFEN electronic invoicing is out of scope).
- Change status with one tap:
  - Store: `nuevo → confirmado → en producción → listo → entregado` (+ `cancelado`)
  - Custom: `nuevo → presupuestado → confirmado → en producción → listo → entregado` (+ `cancelado`)
- For custom orders, enter the **quoted price**.
- Payment status: `pendiente → comprobante recibido → pagado`.
- Internal notes.

### 4.3 Trabajos (Portfolio)
- **"Subir trabajo"** flow: pick photos from the phone gallery or camera, then title, category and technique (dropdowns), optional description, then publish.
- Images are resized and compressed in the browser before upload (WebP, max ~1600px).
- Reorder, mark as featured, hide, delete.

### 4.4 Productos (Products)
- Create and edit: name, photos, description, type (diseño propio / para personalizar), category, price, variants (sizes and colors, each with an optional price override and optional stock), active/hidden, featured.

### 4.5 Ajustes (Settings)
- WhatsApp number, Instagram link
- Bank details for transfers (bank, account holder, account number, CI/RUC, alias)
- Delivery options and costs
- Pickup address and hours
- Home page texts (hero text and similar)

### 4.6 Notifications
- New order: **email to the owner** (via a transactional email provider such as Resend, free tier). The customer's WhatsApp message also reaches them directly.
- Later: push notifications or a Telegram bot.

---

## 5. Recommended tech stack

Goals: free or nearly free on Cloudflare, one codebase, fast on phones, and a custom admin (much friendlier for the owner than a generic CMS).

**Maintainability:** the maintainer knows Python, JS and TS. The stack is **TypeScript end to end**, uses the most mainstream UI library (React), and keeps the parts that are new to the maintainer thin and well documented:

| Layer | Choice | Why | Learning curve |
|---|---|---|---|
| Language | **TypeScript** everywhere | Already known. | None |
| Framework | **Astro** with the `@astrojs/cloudflare` adapter | Static-first pages (portfolio and catalog load fast, good SEO), server routes where needed (forms, admin, API). Deploys natively to Cloudflare. | Low. `.astro` files are HTML with a TS block on top, and routing is file-based. |
| Interactive UI | **React** islands | Cart, multi-step form and admin screens. Largest ecosystem, docs and AI support. | Low to medium if React is new |
| Styling | **Tailwind CSS** | Fast to build a consistent, mobile-first UI. | Low |
| Database | **Cloudflare D1** (SQLite) + **Drizzle ORM** | Orders, products, portfolio, settings. Free tier is more than enough. | Low. It's SQLite, and the queries are typed TS. |
| Files | **Cloudflare R2** | Portfolio and product photos, customer design uploads, transfer receipts. No egress fees. | Low. S3-like put and get. |
| Admin auth | **Cloudflare Access** | Zero auth code. Configured in the dashboard. | None |
| Spam protection | **Cloudflare Turnstile** | On the public forms. A CAPTCHA-like widget plus a single verify call on the server. | None (~20 lines) |
| Email | **Resend** (or similar) | New-order notifications. | None (one API call) |
| Deploy | Cloudflare Workers (static assets + SSR) via GitHub integration or `wrangler` | Push to `main` → deploy. | Low |

Code conventions that help maintenance: business logic lives in plain TS modules (`src/lib/…`), separate from UI. Vitest covers pricing, order codes and RUC validation. A `README` covers local dev (`wrangler dev` with local D1/R2), migrations and deploy.

Alternatives considered:
- **Git-based CMS (Decap/Sveltia) + static site:** no database, but committing images to git and waiting for rebuilds is bad for a phone-first owner, and orders still need a backend. Rejected.
- **Shopify / Tiendanube:** fastest to launch but has monthly fees, weak support for custom quote flows, and less control. A valid fallback if building in-house stalls.

---

## 6. Data model (draft)

```
products
  id, slug, name, description, kind ('own_design' | 'blank'),
  category, base_price, featured, active, sort_order, created_at

product_images
  id, product_id, r2_key, sort_order

product_variants
  id, product_id, size, color, price_override?, stock?  (null stock = untracked)

portfolio_items
  id, title, description, category, technique, client_label?,
  featured, visible, sort_order, created_at

portfolio_images
  id, portfolio_item_id, r2_key, sort_order

orders
  id, code ('APO-0042'), token, kind ('store' | 'custom'),
  status, payment_method ('transfer' | 'cash'), payment_status,
  customer_name, customer_phone, customer_email?,
  delivery_method, delivery_city?, delivery_address?, delivery_cost,
  subtotal, total, quoted_price?,       -- quoted_price for custom orders
  invoice_required, ruc?, razon_social?, invoice_issued,
  notes, internal_notes, created_at, updated_at

order_items                             -- store orders
  id, order_id, product_id, variant_id, name_snapshot, unit_price, quantity

custom_requests                         -- 1:1 with custom orders
  order_id, product_type, technique_pref, quantity,
  size_breakdown (JSON), garment_color, placement,
  needs_design (bool), design_description, needed_by, portfolio_ref_id?

order_files
  id, order_id, kind ('design' | 'receipt'), r2_key, filename, size

settings
  key, value (JSON)
```

Categories and techniques start as fixed lists in code. They can become editable later if needed.

---

## 7. Non-functional requirements
- **Mobile-first.** Test at 360px width first.
- **Performance:** Lighthouse mobile score ≥ 90 on public pages. Images served in responsive sizes.
- **SEO:** proper titles and meta, Open Graph images (links get shared on WhatsApp and IG), local SEO for "estampados Villa Elisa / Asunción".
- **Accessibility:** good contrast, labeled inputs, tap targets ≥ 44px.
- **Uploads:** limit types (jpg, png, webp, pdf, svg, ai/psd if feasible) and size (e.g. 20 MB per file, 5 files).
- **Privacy:** customer data is visible only in the admin. Order links use random tokens.
- **Cost:** fit within Cloudflare free tiers at launch.

---

## 8. Roadmap

### Phase 1 — MVP
1. Project setup: Astro + Cloudflare, D1, R2, deploy pipeline
2. Public pages: Inicio, Trabajos, Tienda, Producto, FAQ, Contacto
3. Cart and checkout (transfer / cash) with WhatsApp handoff
4. Custom order form with file uploads
5. Order tracking page
6. Admin: orders, portfolio upload, products, settings (behind Cloudflare Access)
7. Email notification on new orders
8. Load initial content (portfolio from Instagram posts, products, settings)

### Phase 2
- **Card payments** (Bancard / Pagopar / similar Paraguayan gateway)
- Customer accounts (order history, quick reorder), if still needed
- Price calculator for custom orders (by quantity, technique and print size)
- Discount codes, and bulk/school pricing for kits escolares and promos

### Later / ideas
- Mockup preview (customer's design placed on a shirt or mug)
- Instagram feed sync into the portfolio
- Reviews and testimonials
- Analytics dashboard (orders per month, top products)

---

## 9. Open questions
- [ ] **Delivery:** which zones and costs? Do they ship to the interior (e.g. by bus courier)?
- [ ] **Minimums:** minimum quantity for serigrafía? Do they do single DTF pieces?
- [ ] **Sublimación / bordado:** do they offer these, or only DTF and serigrafía?
- [ ] **Pricing:** show real prices for blank and customizable products, or only "desde"?
- [ ] **Stock:** do own-design products need stock tracking, or are they made to order?
- [ ] **Brand:** logo, colors and fonts. Pull from the Instagram identity?
- [ ] **Domain:** e.g. `apo.com.py` or `apo.py`?
- [x] **Invoicing:** customers need a factura with RUC. The site collects RUC and razón social; the factura is issued outside the site.
- [ ] Should the WhatsApp number on the site be the same business number as in the IG bio?
