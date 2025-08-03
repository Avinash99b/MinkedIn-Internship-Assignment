# 📌 MinkedIn — Monorepo

MinkedIn is a **Mini LinkedIn-like community platform** built as a **monorepo** containing:

- **Frontend** → Next.js + React + Firebase Auth SDK (Vercel/Netlify)
- **Backend** → Node.js + Express + PostgreSQL + Firebase Admin SDK (Render)

The platform allows users to:
- Create profiles
- Publish posts with **Markdown** and **images**
- View a feed sorted by **relevance** and **latest date**
- Comment on posts
- Manage public/private posts

---

## 📂 Monorepo Structure

```

MinkedIn/
│── frontend/   # React frontend
│── backend/    # Node.js Express backend
│── README.md   # This file

````

Each package has its own `README.md` with setup instructions.

---

## 🚀 Features Overview

### 🔐 Authentication
- Firebase Email/Password login
- Token-based auth between frontend and backend

### 👤 Users
- View profiles
- Edit own profile

### 📝 Posts
- Markdown + optional image uploads
- Public/private visibility
- Public feed sorted by **relevance** then **date**

### 💬 Comments
- Add Markdown-formatted comments
- Auto-updated comment counts

---

## 🛠 Tech Stack

**Frontend**
- React
- Firebase Auth SDK
- Firebase Storage SDK
- `react-markdown` for rendering
- Deployed to **Vercel** / **Netlify**

**Backend**
- Node.js + Express
- PostgreSQL
- Firebase Admin SDK
- Hosted on **Render**

**Database**
- PostgreSQL (local or Render-hosted)

**Storage**
- Firebase Storage (secured uploads)

---

## ⚙️ Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/MinkedIn.git
cd MinkedIn
````

### 2️⃣ Install dependencies for both apps

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 3️⃣ Configure environment variables

* **Frontend** → `frontend/.env`
* **Backend** → `backend/.env`

Refer to each folder's README for detailed `.env` setup.

---

## 🧪 Development

### Run backend (Express + PostgreSQL)

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

### Run frontend (React)

```bash
cd frontend
npm start
```

Frontend runs on: `http://localhost:3000`

---

## 🚀 Deployment

### Backend

* Deploy to **Render**
* Connect to **Render PostgreSQL**

### Frontend

* Deploy to **Vercel** or **Netlify**

### Storage

* Use **Firebase Storage** for image uploads

---

## 📄 License



````
MIT License
````