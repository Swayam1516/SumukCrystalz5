# 🚀 Sumuk Crystalz 5 — Production Deployment Guide
### Complete Zero-Downtime Deployment Guide for Render (Backend) & Vercel (Customer + Admin Frontends)

---

## 🏗️ Architecture Overview

| Service | Technology | Cloud Platform | Deployment Directory | Primary Function |
| :--- | :--- | :--- | :--- | :--- |
| **Backend API** | Node.js / Express | **Render** | `backend/` | REST API, Razorpay Webhooks, RBAC Security, Brevo Emails |
| **Customer Storefront** | Next.js 14 / Tailwind | **Vercel** (Project 1) | `customer-frontend/` | Public Sanctuary Store, 3D Engine, Cart & Checkout |
| **Founder Admin Portal** | Next.js 14 / Tailwind | **Vercel** (Project 2) | `admin-frontend/` | Private Founder Inventory, Logistics & CRM |

---

## 👑 Founder Admin Credentials

> [!IMPORTANT]
> The Founder Sanctuary and Admin API are strictly secured with the following credentials:
> - **Founder Email**: `Sumukcrystalz5@gmail.com`
> - **Master Security Password**: `Sumukcrystalz@555`

---

## 📦 PART 1: Deploy Backend API to Render

1. Log into your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** &rarr; **Web Service**.
3. Connect your GitHub repository: `crystal-ecom`.
4. Configure the Web Service settings:
   - **Name**: `sumuk-crystalz-backend`
   - **Region**: Oregon (US West) or Singapore
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
5. Under **Advanced** &rarr; **Health Check Path**, enter: `/api/health`
6. In **Environment Variables**, add the following key-value pairs:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production security optimizations |
| `PORT` | `10000` | Render standard port (auto-bound) |
| `ADMIN_EMAIL` | `Sumukcrystalz5@gmail.com` | Founder administrator account |
| `ADMIN_PASSWORD` | `Sumukcrystalz@555` | Master administrator security password |
| `JWT_SECRET` | `sumuk_crystalz_luxury_secret_key_99482749102834710293` | Cryptographic JWT session secret |
| `SUPABASE_URL` | `https://cmsiounkoqpwjccczebk.supabase.co` | Supabase Cloud Database instance |
| `SUPABASE_KEY` | `sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP` | Supabase publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP` | Supabase service role key |
| `RAZORPAY_KEY_ID` | `rzp_test_TdpRP2dJ2kJRLp` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | `WO8H2BGJod4exSF7AA7rfTHd` | Razorpay Key Secret |
| `RAZORPAY_WEBHOOK_SECRET` | `mock_webhook_secret_crystal_9948` | Razorpay Webhook HMAC secret |
| `RAZORPAY_ME_URL` | `https://razorpay.me/@soumyaanaveenkumarkaradimath` | Razorpay UPI quick-pay URL |
| `RAZORPAY_ME_HANDLE` | `soumyaanaveenkumarkaradimath` | Razorpay VPA handle |
| `FRONTEND_URL` | `https://sumukcrystalz.vercel.app` | Allowed CORS customer origin |
| `ADMIN_URL` | `https://sumuk-admin.vercel.app` | Allowed CORS admin origin |

7. Click **Create Web Service**. Render will build and deploy your backend.
8. Once deployed, copy your Render URL (e.g., `https://sumuk-crystalz-backend.onrender.com`).

---

## 🛍️ PART 2: Deploy Customer Storefront to Vercel (Project 1)

1. Log into your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **Add New...** &rarr; **Project**.
3. Import your GitHub repository: `crystal-ecom`.
4. In the configuration screen:
   - **Project Name**: `sumuk-crystalz-store`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select **`customer-frontend`**
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
5. Expand **Environment Variables** and add:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE` | `https://sumuk-crystalz-backend.onrender.com` | Your Render Backend API URL |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_TdpRP2dJ2kJRLp` | Razorpay Client Key ID |
| `NEXT_PUBLIC_RAZORPAY_ME_URL` | `https://razorpay.me/@soumyaanaveenkumarkaradimath` | Razorpay UPI URL |
| `NEXT_PUBLIC_RAZORPAY_ME_HANDLE` | `soumyaanaveenkumarkaradimath` | Razorpay UPI VPA Handle |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cmsiounkoqpwjccczebk.supabase.co` | Supabase Realtime Database URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP` | Supabase Anon Key |
| `JWT_SECRET` | `sumuk_crystalz_luxury_secret_key_99482749102834710293` | JWT Secret |
| `ADMIN_EMAIL` | `Sumukcrystalz5@gmail.com` | Founder Admin Email |
| `ADMIN_PASSWORD` | `Sumukcrystalz@555` | Founder Admin Password |

6. Click **Deploy**. Vercel will build and assign your domain (e.g. `https://sumuk-crystalz-store.vercel.app`).

---

## 👑 PART 3: Deploy Founder Admin Dashboard to Vercel (Project 2)

1. In your **[Vercel Dashboard](https://vercel.com/dashboard)**, click **Add New...** &rarr; **Project**.
2. Select the same GitHub repository: `crystal-ecom`.
3. In the configuration screen:
   - **Project Name**: `sumuk-crystalz-admin`
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click *Edit* and select **`admin-frontend`**
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
4. Expand **Environment Variables** and add:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_BASE` | `https://sumuk-crystalz-backend.onrender.com` | Your Render Backend API URL |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://cmsiounkoqpwjccczebk.supabase.co` | Supabase Realtime Database URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_ylcqcDVWnCBJ9EhGPeEMKQ_P7-nnoVP` | Supabase Anon Key |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `Sumukcrystalz5@gmail.com` | Founder Admin Email |

5. Click **Deploy**. Vercel will deploy the standalone Founder Admin Sanctuary (e.g. `https://sumuk-crystalz-admin.vercel.app`).

---

## 🔒 PART 4: Verification & Live Health Check

Once all 3 services are deployed:

1. **Verify Backend**:
   - Open `https://<YOUR_RENDER_URL>/api/health` in your browser.
   - It should return: `{"status":"ok","timestamp":"..."}`
2. **Verify Customer Storefront**:
   - Open your Storefront Vercel URL.
   - Browse specimens, add to cart with Vedic Consecration, and test the checkout workflow.
3. **Verify Founder Admin Sanctuary**:
   - Open your Admin Dashboard Vercel URL.
   - Enter Founder Email: `Sumukcrystalz5@gmail.com`
   - Enter Master Password: `Sumukcrystalz@555`
   - Click **Unlock Sanctuary** &rarr; verify complete access to inventory catalog, orders vault, and CRM patrons directory!
   - Click **Sign Out** to ensure instant session termination.

---

## 🛠️ Local Testing Quick Reference

To test all 3 services locally simultaneously:
```bash
# Terminal 1: Backend
cd backend && node server.js

# Terminal 2: Customer Storefront
cd customer-frontend && npm run dev

# Terminal 3: Admin Dashboard
cd admin-frontend && npm run dev -p 3001
```
