# Infrastructure Setup

This is the first real setup checklist for getting the product ready to run outside preview mode.

## Step 1: PostgreSQL

You need a real PostgreSQL database for:
- users
- plans
- subscriptions
- transfers
- files
- white-label settings

Required environment variables:

```env
DATABASE_URL=""
DIRECT_URL=""
```

Notes:
- `DATABASE_URL` is the main application connection string
- `DIRECT_URL` is used by Prisma for direct access when needed
- if your provider gives you only one connection string, use the same value for both at first

After adding the values:

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

## Step 2: Cloudflare R2

You need an R2 bucket for file uploads and downloads.

Required environment variables:

```env
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET=""
R2_PUBLIC_URL=""
```

Notes:
- `R2_BUCKET` is the bucket name
- `R2_PUBLIC_URL` is optional in early versions, depending on how downloads are handled
- uploads are currently built around signed URLs

## Step 3: Session Security

You need a strong session secret for auth cookies.

Required environment variable:

```env
SESSION_SECRET=""
```

Use a long random string.

## Step 4: Application URL

Set the live application URL:

```env
NEXT_PUBLIC_APP_URL=""
```

Examples:
- `http://localhost:3000` for local work
- `https://yourdomain.com` in production

## Step 5: Stripe

Stripe is not fully wired yet, but these variables are already reserved:

```env
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```

## Step 6: First Functional Test

Once PostgreSQL and R2 are configured:

1. Create a user account
2. Upload a small file
3. Generate a download link
4. Open the download page
5. Download the file

If that works, the core product engine is alive.

## Recommended Build Order

1. PostgreSQL connection
2. Prisma push and seed
3. R2 connection
4. Real upload/download test
5. Expiry cleanup job
6. Stripe billing
7. White-label persistence

## Minimal `.env` Template

```env
DATABASE_URL=""
DIRECT_URL=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SESSION_SECRET=""
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET=""
R2_PUBLIC_URL=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
```
