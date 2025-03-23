# 🌍 One Photo A Day — *In Progress*

Welcome to **One Photo A Day**, a minimalist social experiment I'm building to explore global connection through a single shared image every 24 hours.

This project is **a work in progress** — I'm actively developing and refining it. Feel free to explore the code, try the app, or follow along as it evolves!

---

## 🎯 Goal

Build a simple mobile + web app where:
- Anyone in the world can upload a photo at any time
- Once a day, **one random photo** is selected from the past 24 hours
- That photo becomes the **only visible post** on the home screen for everyone
- No likes. No comments. No following. Just **presence**.

---

## ⚙️ Tech Stack

This app is powered by:

- **Expo + React Native** (multi-platform mobile & web)
- **Firebase**
  - 🔐 Anonymous Auth
  - 🔥 Firestore (realtime DB)
  - 📦 Storage (for uploaded images)
  - ☁️ Cloud Functions (to pick daily photo automatically)
- **TypeScript**

---

## 📌 Current Features

- ✅ Users can upload a photo with an optional caption + location
- ✅ Anonymous sign-in (no account needed) 
- ✅ Cloud Function picks a random image from the last 24 hrs
- ✅ Home screen shows the selected image globally
- ✅ Pull-to-refresh shows the latest without caching

---

## 🚧 In Progress

Here’s what I’m working on next:

- [ ] Auto-refresh daily photo when the app is reopened
- [ ] Archive mode to view past daily picks
- [ ] Optional approval before photo goes public
- [ ] "You got picked today!" notification or badge
- [ ] Light PWA theming for web version
- [ ] Creation of user accounts

---

## 🧠 Setup

### 1. Clone & install
```bash
git clone https://github.com/your-username/one-photo-a-day.git
cd one-photo-a-day
npm install
```

### 2. Firebase Config
Create a `firebaseConfig.js` in your root folder and add your Firebase project credentials.

```js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: '...',
  authDomain: '...',
  projectId: '...',
  storageBucket: '...',
  messagingSenderId: '...',
  appId: '...',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

Make sure:
- Firestore is enabled
- Firebase Storage is public (for now)
- Anonymous auth is turned on

---

### 3. Start the app
```bash
npx expo start
```

Choose iOS, Android, or Web!

---

### 4. Deploy Cloud Functions
Go to the `functions/` folder and run:

```bash
firebase deploy --only functions
```

This sets up the scheduled function to run daily (or every 5 mins during testing).

---



This project is one of those ideas — inspired by randomness, presence, and connection.


---

> ⚠️ Still in progress — features and structure may change over time.
