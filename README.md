# ActiVA Microsite

Product marketing microsite for **ActiVA**, a digiLATERAL solution: phygital, interactive in-clinic detailing for pharmaceutical brands.

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, Framer Motion, Lucide icons, self-hosted Plus Jakarta Sans
- **Backend:** Node.js (18.18+), Express 4, MongoDB with Mongoose 8
- **Enquiries:** `POST /api/demo-requests` validates the enquiry and stores it in MongoDB (there is no public read endpoint)

```
activa-microsite/
├── frontend/
│   ├── public/            favicon, logo (webp/png), OG image
│   ├── src/
│   │   ├── assets/illustrations/   hero + 5 interaction + demo SVG illustrations
│   │   ├── components/    Navbar, Hero, HowItWorks, InteractionExperiences,
│   │   │                  InteractionPreview, BrandStory, WhyActiVA,
│   │   │                  DemoRequestForm, Footer, Logo, Reveal
│   │   ├── data/content.js   all section copy, icons, and tab data
│   │   ├── services/api.js   enquiry API client
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html         SEO title, meta description, Open Graph, favicon
│   └── .env.example
├── backend/
│   ├── config/            env loader, MongoDB connection
│   ├── controllers/       demoRequestController.js
│   ├── middleware/        validation and sanitising, rate limiting, error handler
│   ├── models/            DemoRequest.js
│   ├── routes/            demo requests, health
│   ├── app.js             Express app (helmet, CORS, routes)
│   ├── server.js          entry point
│   └── .env.example
└── README.md
```

## 1. Prerequisites

- Node.js 18.18 or newer (20 LTS recommended)
- MongoDB: a local install (`mongodb://127.0.0.1:27017/activa`) or a MongoDB Atlas connection string

## 2. Run locally

```bash
# Backend (terminal 1)
cd backend
cp .env.example .env          # then set MONGODB_URI
npm install
npm run dev                   # http://localhost:5000  (GET /api/health)

# Frontend (terminal 2)
cd frontend
cp .env.example .env          # leave VITE_API_BASE_URL empty for local dev
npm install
npm run dev                   # http://localhost:5173
```

During development, Vite proxies `/api/*` to `http://localhost:5000`, so the form works without any CORS setup.

## 3. API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Returns `200` when the API is up and MongoDB is connected, `503` otherwise |
| `POST` | `/api/demo-requests` | Stores a demo enquiry |

**Request**

```json
{
  "fullName": "Example Name",
  "designation": "Brand Manager",
  "company": "Example Pharma",
  "email": "example@company.com",
  "phone": "9876543210",
  "message": "We would like to explore ActiVA."
}
```

**Responses**

- `201` `{ success: true, message, data: { id, submittedAt } }`
- `422` `{ success: false, message, errors: [{ field, message }] }` for a validation failure
- `429` when there are too many requests (default: 10 per IP per 15 minutes)
- `400` for malformed JSON, `403` for a disallowed origin, `413` for an oversized payload, `503` when the database is unavailable

**Security and validation**

- Required fields; length limits; email checked with `validator`; phone must be 7–15 digits (`+`, spaces, `-` and `()` allowed)
- HTML tags and control characters are stripped, and the email is lower-cased
- Only whitelisted string fields are accepted, which blocks NoSQL operator injection such as `{"$gt": ""}`
- `helmet` security headers, a 10 kb JSON body limit, a CORS allow-list, rate limiting, and a hidden honeypot field against bots
- The submission timestamp is stored as `createdAt`. IP, user agent and referrer are stored in `meta`
- There is no endpoint that lists or reads enquiries. View them in MongoDB Compass, Atlas, or `mongosh`:
  `db.demorequests.find().sort({ createdAt: -1 })`

The frontend shows the success message only after a confirmed `2xx` response. Network failures, timeouts and server errors show an error message instead.

## 4. Environment variables

**backend/.env**

| Variable | Default | Notes |
|---|---|---|
| `MONGODB_URI` | — | Required. Never commit the real value |
| `PORT` | `5000` | |
| `NODE_ENV` | `development` | Set to `production` in production (hides error details) |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated list of allowed browser origins (same-origin is always allowed) |
| `RATE_LIMIT_WINDOW_MINUTES` / `RATE_LIMIT_MAX` | `15` / `10` | Limit for enquiry submissions per IP |
| `TRUST_PROXY` | `0` | Set to `1` behind Nginx or a PaaS load balancer so the rate limiter sees real client IPs |
| `SERVE_FRONTEND` | `false` | `true` makes Express serve `../frontend/dist` (single-server deployment) |

**frontend/.env**

| Variable | Notes |
|---|---|
| `VITE_API_BASE_URL` | Leave empty when the site and API share a domain. Otherwise set the API origin, e.g. `https://api.example.com` |

## 5. Production build

```bash
cd frontend && npm ci && npm run build      # outputs frontend/dist
npm run preview                             # optional local check on :4173
```

**Option A: one server.** Set `SERVE_FRONTEND=true` and `NODE_ENV=production` in `backend/.env`, then run:

```bash
cd backend && npm ci --omit=dev && npm start
```

Express serves the site and the API from the same origin.

**Option B: separate hosting.** Deploy `frontend/dist` to any static host (Netlify, Vercel, S3/CloudFront, Nginx) with `VITE_API_BASE_URL` set at build time. Deploy `backend/` to a Node host (Render, Railway, EC2, etc.) and add the site's URL to `CORS_ORIGINS`.

Nginx example for Option B on one domain:

```nginx
location /api/ { proxy_pass http://127.0.0.1:5000; proxy_set_header Host $host; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; }
location /     { root /var/www/activa/dist; try_files $uri /index.html; }
```

For Option B, also set `TRUST_PROXY=1`.

## 6. Assets

- `public/assets/activa-logo.*` and `activa-logo-mark.*` are the official ActiVA logo, trimmed and optimised (WebP with PNG fallback). The favicon and OG image are derived from it.
- `src/assets/images/` holds the approved visuals supplied by digiLATERAL, upscaled 2x and sharpened, and served as WebP with `srcset`:
  - `hero-clinic*`: the MR, doctor, iPad and cards hero scene (JPG fallback included)
  - `interaction-rotate*`: the Rotate interaction visual, also used in Request a Demo
  - `ipad-detailing*`: the iPad taken from the Rotate visual, shared by the other four interaction tabs
  - `card-face.jpg`: the printed card face taken from the Rotate visual
- `src/assets/illustrations/card-*.svg` are the static card-side illustrations (Animation still uses one). Rotate, Sequence, Equalizer and Select are animated by `RotateAnimation.jsx`, `SequenceAnimation.jsx`, `EqualizerAnimation.jsx` and `SelectAnimation.jsx`, built from the image layers in `src/assets/images/*-anim/`.
- **Resolution note:** the supplied visuals are crops from the approved screenshot (the hero is 569×347 px). They have been upscaled for retina screens, but sharper original exports would improve quality. To replace one, keep the file name (or update the import) and re-export the 1x/2x WebP pair.
- No demonstration video, video player or "Watch Demo" control exists anywhere in the project.

## 7. Content

Page sections, in order: Hero, See · Interact · Discover, Interaction Experiences (5 animated tabs), Your Brand Story, Example concept (GERD, `WorkedExample.jsx`), Why ActiVA, How we work (`HowWeWork.jsx`), FAQ (`FAQ.jsx`), Request a Demo, Footer.

- **FAQ answers** describe only what ActiVA is documented to do. Review them before launch, and edit them in `src/components/FAQ.jsx`.
- **Example concept** is labelled on the page as illustrative, not a client case study, with fictional patients.
- **Footer contact details** live in `src/data/contact.js` and are currently empty, so none are shown. Fill in any field (address, phone, email, WhatsApp, LinkedIn, website) and it appears automatically. A WhatsApp number also adds a "Chat on WhatsApp" button.


All copy lives in `src/data/content.js` (navigation, flow steps, interaction tabs, brand-story steps, benefits) and in the section components. Privacy Policy and Terms links are intentionally omitted until that content exists. Email notifications are not configured: no email credentials are included. Add a mail provider in `controllers/demoRequestController.js` if needed.
#   A c t i v a - m i c r o s i t e  
 