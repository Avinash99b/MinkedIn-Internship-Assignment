# 📌 MinkedIn — Backend

This is the **Node.js + Express + PostgreSQL** backend for **MinkedIn**,  
a Mini LinkedIn-like community platform.

It supports:
- **Firebase Authentication**
- **Markdown-based posts with images**
- **Comments**
- **User profiles**

---

## 🚀 Features

- **Authentication**
    - Firebase Email/Password authentication
    - JWT-based token verification on backend
- **Users**
    - Fetch current user profile
    - Fetch other users by UID
- **Posts**
    - Create posts with Markdown text & optional images
    - Public and private visibility
    - Public feed sorted by **relevance** and **latest date**
- **Comments**
    - Add comments to posts
    - Comment count updates automatically
- **Database**
    - PostgreSQL hosted on Render (or local)
- **Storage**
    - Firebase Storage for image uploads

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL (`pg` package)
- **Auth:** Firebase Authentication + Admin SDK
- **Storage:** Firebase Storage
- **Other:** CORS, Morgan, dotenv, Joi (validation)

---

## 📂 Folder Structure

```

MinkedIn/
│── src/
│   ├── config/
│   │   ├── db.ts
│   │   ├── firebase.ts
│   ├── middleware/
│   │   └── auth.ts
│   ├── routes/
│   │   ├── users.ts
│   │   ├── posts.ts
│   │   └── comments.ts
│   ├── controllers/
│   │   ├── usersController.ts
│   │   ├── postsController.ts
│   │   └── commentsController.ts
│   ├── types/
│   │   └── express/index.d.ts
│   ├── app.ts
│   └── server.ts
│── .env
│── Readme.md       # You are here!
│── package.json
│── tsconfig.json

````

---

## ⚙️ Setup & Installation

### 1️⃣ Go to backend folder
```bash
cd MinkedIn/backend
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure environment variables

Create a `.env` file in `backend/`:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/minkedin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key"
```

⚠ **Important:** Ensure `FIREBASE_PRIVATE_KEY` uses `\\n` for newlines in `.env`.

### 4️⃣ Setup PostgreSQL database

Run these commands in your PostgreSQL client:

```sql
CREATE TABLE users (
    uid TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    bio TEXT DEFAULT '',
    desired_field TEXT NOT NULL
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id TEXT REFERENCES users(uid) ON DELETE CASCADE,
    post_data JSONB NOT NULL,
    field TEXT NOT NULL,
    visibility TEXT CHECK (visibility IN ('public', 'private')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(uid) ON DELETE CASCADE,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5️⃣ Run the development server

```bash
npm run dev
```

Server will run on: `http://localhost:5000`

---

## 📡 API Endpoints

### **Users**

| Method | Endpoint      | Description                |
| ------ | ------------- | -------------------------- |
| GET    | `/users/me`   | Get current user's profile |
| GET    | `/users/:uid` | Get user profile by UID    |

### **Posts**

| Method | Endpoint        | Description                                |
| ------ | --------------- | ------------------------------------------ |
| POST   | `/posts`        | Create a new post                          |
| GET    | `/posts/public` | Get public feed sorted by relevance & date |
| GET    | `/posts`        | Get logged-in user's posts                 |

### **Comments**

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| POST   | `/comments`                | Add a comment to a post |
| GET    | `/posts/:post_id/comments` | Get comments for a post |

---

## 🔐 Authentication

All endpoints (except `/users/:uid`) require **Firebase ID Token** in the `Authorization` header:

```
Authorization: Bearer <your_firebase_id_token>
```

---

## 🚀 Deployment

* **Backend Hosting:** Render
* **Frontend Hosting:** Vercel / Netlify
* **Database Hosting:** Render PostgreSQL
* **Storage:** Firebase Storage

---

## 🧪 Testing

You can test API endpoints using:

* **Postman**
* **Swagger UI** (OpenAPI spec is available)
* **cURL**

Example request:

```bash
curl -X GET http://localhost:5000/posts/public \
  -H "Authorization: Bearer <your_firebase_id_token>"
```

---

## 📄 License

```
MIT License

```
