# Luxury Crystal E-Commerce — Core Scaffold

A working backbone for a crystal-brand storefront: 3D product viewer, Razorpay
checkout with server-side signature verification, JWT-protected admin CRUD,
and instant order notifications.

## Stack

- **Frontend:** Next.js (App Router) + React Three Fiber/drei + Tailwind CSS
- **Backend:** Node.js/Express + MongoDB (Mongoose)
- **Payments:** Razorpay (Orders API + webhook)
- **Notifications:** Nodemailer (email), optional Twilio WhatsApp

## Structure

```
backend/
  models/        Product, Order, User (Mongoose schemas)
  routes/        checkout.js (order create/verify/webhook), admin.js (auth + CRUD)
  middleware/    auth.js (JWT requireAuth / requireAdmin)
  utils/         notify.js (admin email + WhatsApp on paid order)
  server.js      Express app wiring — note the webhook raw-body ordering
  .env.example
customer-frontend/
  app/           Customer Next.js Storefront (Shop, Product Detail, 3D Engine, Vault, Checkout)
  components/    Luxury UI components (CrystalShowcase, DynamicOptionSelector, Header, Cart)
admin-frontend/
  app/           Founder & Admin Sanctuary Portal (Specimen Catalog, Media, CRM, Orders)
```

## Setup

```bash
# Backend
cd backend && npm install
cp .env.example .env   # fill in Mongo URI, Razorpay keys, SMTP creds
npm run dev

# Customer Storefront
cd customer-frontend && npm install
npm run dev

# Admin Portal
cd admin-frontend && npm install
npm run dev
```

Create your first admin user via a one-off script or a seed route (not
included here on purpose — don't expose an open "create admin" endpoint in
production):

```js
const user = new User({ name: 'Admin', email: 'admin@brand.com', role: 'admin' });
await user.setPassword('choose-a-strong-password');
await user.save();
```

## How the payment flow fits together

1. Frontend sends cart + shipping info to `POST /api/checkout/create-order`.
2. Server re-prices everything from the DB (never trusts client prices),
   creates a Razorpay order, and stores a local `Order` with status `created`.
3. Frontend opens the Razorpay Checkout sheet with the returned `order_id`.
4. On success, Razorpay's `handler` callback fires client-side — the frontend
   immediately posts the three returned fields to `POST /api/checkout/verify`.
5. Server recomputes the HMAC SHA-256 signature from
   `order_id|payment_id` using the Razorpay key secret and compares it with
   `crypto.timingSafeEqual`. Only on a match does the order flip to `paid`,
   stock decrement, and `notifyAdminOfOrder` fire.
6. `POST /api/checkout/webhook` is a second, server-to-server safety net for
   the case where step 4 never happens (tab closed mid-payment). It's
   registered with `express.raw()` **before** `express.json()` in
   `server.js`, because the webhook signature is computed over the exact raw
   bytes Razorpay sent.

## What's intentionally left for you to wire up

- **3D models:** point `Product.model3dUrl` at real `.glb` files (a CDN or
  S3 bucket); `CrystalShowcase` will render whatever geometry it finds.
- **Frontend pages:** storefront catalog/filtering, product detail, cart
  state (a Zustand store is a natural fit), and the brand-story/encyclopedia
  sections — these are content and layout work per the frontend-design
  guidance, not infrastructure, so they're not scaffolded here.
- **Admin UI:** the API is ready; a dashboard screen (product table + order
  table) is a straightforward React build against `/api/admin/*`.
- **Image/cert storage:** wire `images`, `model3dUrl`, and
  `certificateUrl` to whatever object storage you use (S3, Cloudinary, etc).
- **Idempotency on the webhook:** in production, also store `payload.id`
  from Razorpay and dedupe against it, since webhooks can be retried.
