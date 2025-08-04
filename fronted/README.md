# 🚀 MinkedIn Frontend – Next.js + Firebase

This is the **frontend** application for our platform, built using **Next.js** and integrated with **Firebase** for
authentication, Firestore, and storage.

The source code was provided as a `.zip` archive and extracted into the `frontend/` folder.


---

## 🛠 Prerequisites

Before you start, make sure you have:

- **Node.js** v18 or newer
- **npm** or **yarn** installed
- A **Firebase project** set up in the [Firebase Console](https://console.firebase.google.com/)

---

## ⚙️ Firebase Setup

1. **Create a Firebase Project**
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click **Add project** and follow the setup steps.

2. **Enable Authentication**
    - Navigate to **Build > Authentication > Sign-in method**.
    - Enable your preferred sign-in methods (Email/Password, Google, etc.).

3. **Create a Web App**
    - In **Project Settings**, click **Add app** → **Web**.
    - Register your app and copy the Firebase config.

---

## ▶️ Installation & Running

1. **Navigate to the frontend folder**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build for Production

```bash
npm run build
npm run start
```


---

## 📄 License

This project is licensed under the MIT License.  
You are free to modify and distribute it as needed.

