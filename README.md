# 🤖 AI Social Scheduler

> 🚀 A full-stack AI-powered social media automation platform for creating, generating, scheduling, and publishing content across multiple social media platforms from a single dashboard.

<p align="center">
  <a href="https://ai-social-scheduler-phi.vercel.app/">🌐 Live Demo</a>
  &nbsp; • &nbsp;
  <a href="https://github.com/varunreddy0129/ai-social-scheduler">💻 GitHub</a>
  &nbsp; • &nbsp;
  <a href="https://ai-social-scheduler-1.onrender.com">⚙️ Backend API</a>
</p>

---

## 🌟 Overview

**AI Social Scheduler** is a production-deployed full-stack application that helps users manage their social media content from one centralized platform.

Users can create posts manually, generate captions with AI, optionally generate images, upload media, connect social accounts using OAuth, schedule posts for future publication, and monitor publishing activity.

The project combines a modern React frontend with a TypeScript/Express backend, MongoDB Atlas, AI services, cloud media storage, and a unified social publishing API.

---

## ✨ Features

### 🤖 AI Content Generation

- ✍️ Generate social media captions using Google Gemini
- 🎨 Generate AI images using Replicate
- 🎯 Choose different content tones:
  - Formal
  - Informal
  - Friendly
  - Professional
  - Humorous
- ⚡ Generate content directly from a simple prompt

### 📱 Multi-Platform Publishing

Connect and publish content to supported platforms through Zernio:

- 𝕏 Twitter / X
- 📘 Facebook
- 📄 Facebook Pages
- 📸 Instagram
- 💼 Instagram Business
- 💼 LinkedIn

### 📅 Smart Post Scheduling

- ⏰ Schedule posts for a future date and time
- 🔄 Background scheduler checks for due posts
- 🚀 Automatically publishes scheduled posts
- ✅ Updates post status after publishing
- ❌ Tracks failed publications

### 🔐 Authentication

- 👤 User registration and login
- 🔑 JWT-based authentication
- 🔒 Password hashing with bcrypt
- 🛡️ Protected API routes

### 👥 Account Management

- 🔗 Connect social accounts
- 🔄 Sync connected accounts
- 👀 View connected accounts
- ❌ Disconnect accounts
- 📱 Manage multiple social platforms

### ☁️ Media Management

- 🖼️ Image uploads
- 🎥 Video uploads
- 🎵 Audio uploads
- ☁️ Cloudinary media storage

### 📊 Activity Tracking

- ✅ Successful publication logs
- ❌ Failed publication logs
- 👤 Account activity
- 📝 Post activity history

---

## 🌐 Live Application

| Component | URL | Status |
|---|---|---|
| 🎨 Frontend | https://ai-social-scheduler-phi.vercel.app/ | 🟢 Live |
| ⚙️ Backend | https://ai-social-scheduler-1.onrender.com | 🟢 Live |
| 💻 GitHub | https://github.com/varunreddy0129/ai-social-scheduler | 🟢 Available |

> 💡 The backend is hosted on a free-tier service. If it has been inactive, the first request may take a little longer while the service starts.

---

## 🛠️ Tech Stack

### 🎨 Frontend

| Technology | Purpose |
|---|---|
| ⚛️ React 19 | User interface |
| 🔷 TypeScript | Type safety |
| ⚡ Vite | Development and build tooling |
| 🎨 Tailwind CSS | Styling |
| 🧭 React Router | Client-side routing |
| 📡 Axios | API communication |

### ⚙️ Backend

| Technology | Purpose |
|---|---|
| 🟢 Node.js | JavaScript runtime |
| 🚂 Express 5 | REST API |
| 🔷 TypeScript | Type safety |
| 🍃 MongoDB | Database |
| 🦫 Mongoose | MongoDB ODM |
| 🔑 JWT | Authentication |
| 🔒 bcrypt | Password hashing |
| ⏰ node-cron | Background scheduling |
| 📤 Multer | File uploads |

### 🤖 AI & Cloud Services

| Service | Purpose |
|---|---|
| ✨ Google Gemini | AI text/content generation |
| 🎨 Replicate | AI image generation |
| ☁️ Cloudinary | Media storage |
| 📱 Zernio | Social account integration and publishing |
| 🍃 MongoDB Atlas | Cloud database |

### 🚀 Deployment

| Platform | Component |
|---|---|
| ▲ Vercel | Frontend |
| 🟣 Render | Backend |
| 🍃 MongoDB Atlas | Database |
| ☁️ Cloudinary | Media storage |

---

## 🏗️ System Architecture

```text
                         👤 USER
                           │
                           ▼
                ┌─────────────────────┐
                │       ▲ Vercel      │
                │   ⚛️ React Client   │
                │    TypeScript       │
                └──────────┬──────────┘
                           │
                      🔗 REST API
                           │
                           ▼
                ┌─────────────────────┐
                │      🟣 Render      │
                │  🟢 Node + Express  │
                │    🔷 TypeScript    │
                │   ⏰ Cron Scheduler │
                └──────────┬──────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
      ┌────────────┐ ┌────────────┐ ┌────────────┐
      │ 🍃 MongoDB │ │ ☁️ Cloudinary│ │ 📱 Zernio │
      │    Atlas   │ │   Storage  │ │ Social API │
      └────────────┘ └────────────┘ └──────┬─────┘
                                           │
                         ┌─────────────────┼─────────────────┐
                         ▼                 ▼                 ▼
                       𝕏 X             📘 Facebook       📸 Instagram
                                           │
                                           ▼
                                        💼 LinkedIn

                         🤖 AI SERVICES
                         ┌──────────────┐
                         │ ✨ Gemini    │
                         │ 🎨 Replicate │
                         └──────────────┘
```

---

## 📁 Project Structure

```text
ai-social-scheduler/
│
├── 📂 client/
│   ├── 📂 src/
│   │   ├── 📂 api/
│   │   ├── 📂 components/
│   │   ├── 📂 context/
│   │   └── 📂 pages/
│   │       ├── 🏠 Home/
│   │       ├── 🔐 Login/
│   │       ├── 📊 Dashboard/
│   │       ├── 🤖 AIComposer/
│   │       ├── 📅 Scheduler/
│   │       └── 👥 Accounts/
│   ├── 📄 package.json
│   └── 📄 .env
│
├── 📂 server/
│   ├── 📂 config/
│   ├── 📂 controllers/
│   ├── 📂 middlewares/
│   ├── 📂 models/
│   ├── 📂 routes/
│   ├── 📂 services/
│   │   └── ⏰ schedulerService.*
│   ├── 📄 server.ts
│   └── 📄 package.json
│
├── 📄 .gitignore
└── 📄 README.md
```

---

# 🚀 Getting Started

## 📋 Prerequisites

Make sure you have:

- 🟢 Node.js 18+
- 📦 npm
- 🍃 MongoDB Atlas account or local MongoDB
- ✨ Google Gemini API key
- 🎨 Replicate API token
- ☁️ Cloudinary account
- 📱 Zernio API key

Check your installed versions:

```bash
node --version
npm --version
```

---

## 📥 1. Clone the Repository

```bash
git clone https://github.com/varunreddy0129/ai-social-scheduler.git
cd ai-social-scheduler
```

---

# ⚙️ Backend Setup

## 📦 2. Install Backend Dependencies

```bash
cd server
npm install
```

## 🔐 3. Configure Backend Environment Variables

Create:

```text
server/.env
```

Add:

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

CLIENT_URL=http://localhost:5173
```

> ⚠️ Never commit real API keys, passwords, database credentials, or secrets to GitHub.

## ▶️ 4. Start the Backend

Development mode:

```bash
npm run server
```

Production-style start:

```bash
npm start
```

Local backend:

```text
http://localhost:3000
```

---

# 🎨 Frontend Setup

## 📦 5. Install Frontend Dependencies

Open a new terminal:

```bash
cd client
npm install
```

## 🔐 6. Configure Frontend Environment Variables

Create:

```text
client/.env
```

For local development:

```env
VITE_API_URL=http://localhost:3000
```

The frontend API client uses:

```typescript
baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000"
```

## ▶️ 7. Start the Frontend

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔌 API Overview

| Endpoint | Description |
|---|---|
| 🔐 `/api/auth` | Register and authenticate users |
| 🔗 `/api/oauth/:platform/url` | Generate OAuth URLs |
| 👥 `/api/accounts` | Connect, list, sync, and disconnect social accounts |
| 📝 `/api/posts` | Create, generate, list, and schedule posts |
| 📊 `/api/activity` | Retrieve activity and publishing logs |

---

# ⏰ How Post Scheduling Works

```text
                 📝 Create Post
                       │
                       ▼
                 📅 Select Date
                    & Time
                       │
                       ▼
                 💾 Save Post
                       │
                       ▼
              ⏰ Cron Scheduler
                       │
                       ▼
              🔍 Check Due Posts
                       │
                       ▼
              📱 Publish via Zernio
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
          ✅ Success          ❌ Failure
              │                 │
              ▼                 ▼
       📊 Update Status    📊 Record Error
              │                 │
              └────────┬────────┘
                       ▼
                 📋 Activity Log
```

---

# 🤖 AI Content Workflow

```text
💡 User Prompt
      │
      ▼
🎯 Select Tone
      │
      ▼
✨ Google Gemini
      │
      ▼
📝 Generated Caption
      │
      ├───────────────┐
      │               │
      ▼               ▼
   ✍️ Text         🎨 Replicate
                      │
                      ▼
                  🖼️ AI Image
                      │
                      ▼
                📅 Schedule/Post
```

---

# 🔗 Social Publishing Workflow

```text
👤 User
   │
   ▼
🔗 Connect Social Account
   │
   ▼
🔐 OAuth Authentication
   │
   ▼
📱 Account Stored
   │
   ▼
📝 Create Post
   │
   ▼
📅 Publish Now / Schedule
   │
   ▼
📡 Zernio API
   │
   ▼
🌐 Social Platform
   │
   ▼
📊 Activity Log
```

---

# 🌍 Production Deployment

## 🎨 Frontend — Vercel

The React frontend is deployed using Vercel.

### Configuration

```text
Root Directory: client
Build Command: npm run build
Output Directory: dist
```

### Production Environment Variable

```env
VITE_API_URL=https://ai-social-scheduler-1.onrender.com
```

### 🌐 Live Frontend

https://ai-social-scheduler-phi.vercel.app/

---

## ⚙️ Backend — Render

The Node.js + Express backend is deployed using Render.

### Configuration

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

### 🌐 Live Backend

https://ai-social-scheduler-1.onrender.com

The backend uses Render's automatically assigned `PORT` in production.

---

## 🍃 Database — MongoDB Atlas

MongoDB Atlas is used as the production database.

The backend connects using:

```env
MONGODB_URI=your_mongodb_connection_string
```

---

# 🔐 Security

The application follows several security practices:

- 🔒 Passwords are hashed using bcrypt
- 🔑 JWT is used for authentication
- 🔐 API credentials are stored in environment variables
- 🚫 Secrets are not hard-coded in source code
- 🔒 Production communication uses HTTPS
- 🛡️ Protected API routes
- 📁 `.env` files should be excluded from Git

### 🚨 Never commit

```text
.env
.env.local
.env.production
```

or any file containing private credentials.

> If an API key is accidentally exposed, revoke or rotate it immediately.

---

# 🧪 Testing Checklist

Before considering a deployment complete, test:

- [x] 🏠 Landing page
- [x] 📝 User registration
- [x] 🔐 User login
- [x] 📊 Dashboard
- [x] 🤖 AI content generation
- [x] 🎨 AI image generation
- [x] ☁️ Media upload
- [x] 👥 Social account connection
- [x] 📝 Post creation
- [x] 📅 Post scheduling
- [x] ⏰ Background scheduler
- [x] 📱 Social publishing
- [x] 📊 Activity logs
- [x] 🌐 Production frontend
- [x] ⚙️ Production backend

---

# 🛠️ Troubleshooting

### ❌ Frontend cannot connect to backend

Check:

```env
VITE_API_URL=https://ai-social-scheduler-1.onrender.com
```

Then verify that the Render backend is running.

### ❌ Frontend is still using localhost

Check:

```text
client/src/api/axios.ts
```

It should use:

```typescript
baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000"
```

### ❌ Render deployment fails

Verify:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

### ❌ MongoDB connection fails

Check:

- 🍃 `MONGODB_URI`
- 🔐 MongoDB credentials
- 🌐 MongoDB Atlas network access
- 🗄️ Database name and connection string

### ❌ AI generation fails

Check:

```text
GEMINI_API_KEY
REPLICATE_API_TOKEN
```

### ❌ Social publishing fails

Check:

```text
ZERNIO_API_KEY
```

and verify that the required social account is connected.

---

# 🚀 Future Improvements

- 📊 Social media analytics dashboard
- 📈 Post performance tracking
- 🗓️ Advanced content calendar
- #️⃣ AI hashtag generation
- 🤖 AI content recommendations
- 👥 Team collaboration
- 🔁 Recurring posts
- 🔔 Email and in-app notifications
- 📱 Additional social media integrations
- 🔄 Automatic retry for failed posts
- 📉 Engagement analytics
- 📤 Bulk post scheduling
- 🧪 Automated unit and integration tests
- 🔄 CI/CD pipeline

---

# 💡 Project Highlights

This project demonstrates practical experience with:

- ⚛️ React and TypeScript
- 🟢 Node.js and Express
- 🍃 MongoDB and Mongoose
- 🔐 JWT authentication
- 🔒 Password hashing
- 🔗 OAuth integrations
- 🤖 AI API integration
- ☁️ Cloud media storage
- ⏰ Background job scheduling
- 📡 REST API development
- 🌐 Third-party API integration
- 🔑 Environment-based configuration
- 🚀 Full-stack production deployment
- 🔄 Frontend/backend integration

---

# 📸 Screenshots

Add screenshots of your application here:

```markdown
![🏠 Home Page](screenshots/home.png)

![📊 Dashboard](screenshots/dashboard.png)

![🤖 AI Composer](screenshots/ai-composer.png)

![📅 Scheduler](screenshots/scheduler.png)

![👥 Accounts](screenshots/accounts.png)
```

---

# 👨‍💻 Author

## Varun Reddy

🎓 Computer Science & Engineering Student

💻 GitHub:  
https://github.com/varunreddy0129

---

# ⭐ Support

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">

🚀 **AI Social Scheduler**

**Create. Generate. Schedule. Automate. Publish.**

</p>
