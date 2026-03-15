# Car Rental Platform — AutoLuxe

## Overview

A full-stack car rental PoC with a public-facing booking website and admin CMS.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (TailwindCSS v4, shadcn/ui, React Query, Wouter, Framer Motion)
- **API framework**: Express 5 + express-session
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Payments**: Stripe (connect via integrations)
- **Email**: Resend (connect via integrations)
- **Image upload**: Cloudinary (env vars needed)

## Test Credentials

- **Admin**: admin@carrental.com / admin123456
- **User**: john@example.com / password123

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/             # Express 5 API
│   └── car-rental/             # React + Vite frontend (at /)
├── lib/
│   ├── api-spec/               # OpenAPI spec + Orval codegen config
│   ├── api-client-react/       # Generated React Query hooks
│   ├── api-zod/                # Generated Zod schemas
│   └── db/                     # Drizzle ORM schema + DB connection
├── scripts/
│   └── src/seed.ts             # DB seeder (run: pnpm --filter @workspace/scripts run seed)
└── ...
```

## Database Schema

- **users** — id, name, email, password (sha256 hash), role (user/admin), created_at
- **cars** — id, brand, model, year, price_per_day, transmission, fuel_type, seats, location, description, image_url, available, created_at
- **bookings** — id, user_id, car_id, pickup_date, return_date, total_price, status (pending/confirmed/cancelled/completed), created_at
- **payments** — id, booking_id, amount, payment_status (pending/paid/failed/refunded), stripe_session_id, created_at

## API Routes

- `GET/POST /api/cars` — list/create cars
- `GET/PUT/DELETE /api/cars/:id` — car detail/update/delete
- `GET /api/cars/:id/availability?pickup_date&return_date` — check availability
- `GET/POST /api/bookings` — list/create bookings
- `GET/PUT /api/bookings/:id` — booking detail/update status (admin)
- `POST /api/payments/create-session` — create Stripe checkout session
- `POST /api/payments/webhook` — Stripe webhook
- `GET /api/payments/:bookingId` — payment info
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `POST /api/auth/logout` — logout
- `GET /api/auth/me` — current user
- `POST /api/upload/image` — upload image (multipart/form-data, admin only)

## Environment Variables Needed

- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned by Replit)
- `SESSION_SECRET` — Secret for express-session cookies
- `STRIPE_SECRET_KEY` — Stripe secret key (connect via Stripe integration)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (optional)
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `RESEND_API_KEY` — Resend API key (for email notifications)

## Development

```bash
# Push DB schema
pnpm --filter @workspace/db run push

# Seed database
pnpm --filter @workspace/scripts run seed

# Run API codegen
pnpm --filter @workspace/api-spec run codegen
```

## Pages

- `/` — Homepage with hero and featured cars
- `/cars` — Browse all cars with filters
- `/cars/:id` — Car detail with booking date picker
- `/booking/:carId` — Booking confirmation (auth required)
- `/booking/confirmation/:id` — Post-payment confirmation
- `/dashboard` — User's booking history
- `/login` — Login page
- `/register` — Registration page
- `/admin/cars` — Admin: manage fleet
- `/admin/bookings` — Admin: manage bookings
