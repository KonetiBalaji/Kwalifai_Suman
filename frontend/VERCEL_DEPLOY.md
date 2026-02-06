# Deploy Frontend to Vercel

This guide walks you through deploying the **frontend** (Next.js) app from this monorepo to [Vercel](https://vercel.com).

## Prerequisites

- A [Vercel](https://vercel.com) account (GitHub/GitLab/Bitbucket login)
- This repo pushed to a Git provider (GitHub, GitLab, or Bitbucket)

## Steps

### 1. Import the project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. **Import** your repository (e.g. from GitHub).
3. Select this repository.

### 2. Configure the project

- **Framework Preset:** Vercel should detect **Next.js** automatically.
- **Root Directory:** Click **Edit** and set it to **`frontend`** (this is required because the Next.js app lives in the `frontend` folder).
- **Build Command:** `pnpm run build` (or leave default).
- **Output Directory:** Leave default (Next.js is auto-detected).
- **Install Command:** `pnpm install` (Vercel often detects pnpm from the repo; if not, set it here).

### 3. Environment variables

In **Project → Settings → Environment Variables**, add:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_GATEWAY_URL` | Your production API Gateway URL (e.g. `https://api.yourdomain.com`) | Yes, for production |
| `NEXT_PUBLIC_FRED_API_KEY` | FRED API key for mortgage rates (optional) | No |

Use **Production** (and optionally Preview) for the environment.

### 4. Deploy

Click **Deploy**. Vercel will:

1. Clone the repo  
2. Set the project root to `frontend`  
3. Run `pnpm install` and `pnpm run build`  
4. Deploy the Next.js app  

After the first deploy, pushes to your main branch will trigger new deployments (if you enabled Vercel Git integration).

## Monorepo note

The app is built from the `frontend` directory only. The lockfile (`pnpm-lock.yaml`) is at the repo root; pnpm will still use it when installing from `frontend` because the repo is a pnpm workspace.

## Troubleshooting

- **Build fails with "pnpm not found"**  
  In Project Settings → General → **Node.js Version**, choose 18 or 20. In Build & Development Settings, set **Install Command** to `pnpm install` and ensure the repo has `pnpm-lock.yaml` at the root (it does).

- **API calls fail in production**  
  Set `NEXT_PUBLIC_API_GATEWAY_URL` to your real backend URL and redeploy. Without it, the app falls back to `http://localhost:3001`, which only works locally.

- **404 or wrong routes**  
  Confirm **Root Directory** is exactly `frontend` (no trailing slash).
