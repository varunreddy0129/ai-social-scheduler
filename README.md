# 🤖 AI Social Scheduler

A full-stack AI-powered social media scheduling platform that allows users to create, generate, schedule, and publish content across multiple social media platforms from a single dashboard.

## 🚀 Live Demo

### 🌐 Frontend
https://ai-social-scheduler-phi.vercel.app/

### ⚙️ Backend API
https://ai-social-scheduler-1.onrender.com

---

## ✨ Features

- 🔐 **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Password hashing using bcrypt

- 🤖 **AI Content Generation**
  - Generate social media captions using Google Gemini
  - Multiple writing tones:
    - Formal
    - Informal
    - Friendly
    - Professional
    - Humorous
  - AI-generated images using Replicate

- 📱 **Multi-Platform Publishing**
  - Twitter / X
  - Facebook
  - Facebook Pages
  - Instagram
  - Instagram Business
  - LinkedIn
  - Social account management through Zernio

- 📅 **Post Scheduling**
  - Schedule posts for future dates and times
  - Automatic background scheduler
  - Cron job checks for posts that are ready to publish

- ☁️ **Media Uploads**
  - Upload images, videos, and audio
  - Media stored using Cloudinary

- 📊 **Activity Logs**
  - Track published posts
  - Track failed posts
  - Track account activity

- 🔗 **OAuth Account Connection**
  - Connect social media accounts
  - Sync connected accounts
  - Disconnect accounts

---

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express 5
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- node-cron

### APIs & Services

- Google Gemini
- Replicate
- Cloudinary
- Zernio
- MongoDB Atlas

### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Media Storage:** Cloudinary

---

## 🏗️ Project Structure

```text
ai-social-scheduler/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   │       ├── Home
│   │       ├── Login
│   │       ├── Dashboard
│   │       ├── AIComposer
│   │       ├── Scheduler
│   │       └── Accounts
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.ts
│   └── package.json
│
├── .gitignore
└── README.md