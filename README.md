# Aurelia — Real Estate Listing Platform

User-facing Next.js app for searching, filtering, and enquiring on property listings.

## User section (this release)

- Home with hero search (location, price range, property type)
- Listings with filters, sorting, debounced keyword search, and shareable URL params
- Property detail with gallery, amenities, map, and enquiry form
- About and contact
- Signup / login (JWT cookie) and saved favorites
- Optional map view on listings

Admin CRUD, Cloudinary uploads, and dashboard stats are the next phase.

## Stack

- Next.js + TypeScript + Tailwind CSS
- API routes (Express-compatible REST shape)
- Mongoose models ready — used automatically when `MONGODB_URI` is set
- Local JSON store for users, favorites, and enquiries when MongoDB is not configured
- OpenStreetMap + Leaflet for maps (no API key required)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` if you want MongoDB and a custom JWT secret. Without MongoDB, 14 seeded Dubai listings still load from `src/data/properties.ts`.
