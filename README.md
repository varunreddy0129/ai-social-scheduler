# AI Social Scheduler

A full-stack platform for creating, scheduling, and auto-publishing social media posts across multiple platforms — with AI-generated captions and images built in.

## Features

- **AI Content Generation** — Generate on-brand post copy from a simple prompt and tone (formal, informal, friendly, professional, humorous) using Google Gemini, with an optional AI-generated image via Replicate.
- **Multi-Platform Publishing** — Connect and post to Twitter, Facebook, Facebook Pages, Instagram, Instagram Business, and LinkedIn.
- **Post Scheduling** — Schedule posts for a future date/time; a background cron job checks every minute and auto-publishes anything due.
- **Account Management** — Connect, sync, and disconnect social accounts via OAuth.
- **Media Uploads** — Attach images, video, or audio to posts, stored via Cloudinary.
- **Activity Log** — Track post publishes, failures, and account activity over time.
- **Auth** — JWT-based authentication with hashed passwords (bcrypt).

## Tech Stack

**Client**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

**Server**
- Node.js + Express 5 + TypeScript
- MongoDB + Mongoose
- JWT auth (jsonwebtoken, bcrypt)
- node-cron (scheduled publishing)
- Cloudinary (media storage)
- Google Gemini (`@google/genai`) — text generation
- Replicate — image generation
- Zernio — unified social platform publishing API

## Project Structure

```
ai-social-scheduler/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/          # Home, Login, Dashboard, AIComposer, Scheduler, Accounts
└── server/                 # Express + TypeScript backend
    ├── config/              # DB, Cloudinary, Multer, Zernio config
    ├── controllers/
    ├── middlewares/
    ├── models/              # User, Account, Post, Generation, ActivityLog
    ├── routes/
    ├── services/            # Cron-based post scheduler
    └── server.ts
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- API keys for Gemini, Replicate, Cloudinary, and Zernio

### 1. Clone the repo
```bash
git clone https://github.com/varunreddy0129/ai-social-scheduler.git
cd ai-social-scheduler
```

### 2. Set up the server
```bash
cd server
npm install
```

Create a `.env` file in `server/` with:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
REPLICATE_API_TOKEN=your_replicate_api_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ZERNIO_API_KEY=your_zernio_api_key
```

Run the server:
```bash
npm run server   # dev, with nodemon
# or
npm start        # plain tsx run
```

### 3. Set up the client
```bash
cd ../client
npm install
npm run dev
```

The client will start on the Vite dev server (default `http://localhost:5173`) and the API on `http://localhost:3000`.

## API Overview

| Route | Description |
|---|---|
| `/api/auth` | Register / login (JWT-based) |
| `/api/oauth/:platform/url` | Generate OAuth URL for a social platform |
| `/api/accounts` | Connect, list, and disconnect social accounts |
| `/api/posts` | Create, generate (AI), list, and schedule posts |
| `/api/activity` | Fetch account/post activity logs |

## License

No license specified yet.