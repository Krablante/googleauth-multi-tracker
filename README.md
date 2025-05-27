# Reading Tracker

A simple, offline-capable PWA for tracking books/articles **and** films/series. Built with React, TypeScript, and Firebase, it lets you sign in with Google, add entries, and view them under multiple categories.

<img src="https://your-domain.com/path/to/screenshot.png" alt="Screenshot" width="600"/>

## Features

* 🔐 **Google Authentication** (only signed-in users can access)
* 📚 **Four categories**:

  * **READ** (books & articles)
  * **READ (W)** (wishlist for books & articles; undated, move items to READ with today’s date)
  * **FILMS** (movies & TV shows)
  * **FILMS (W)** (wishlist for films & TV shows; undated, move items to FILMS with today’s date)
* 📅 **Date picker** via calendar icon (for main categories)
* ➕ **Add & remove** entries in real time with Firestore
* ✔️ **Wishlist support**: mark items as done to transfer them with the current date
* 🌙 **Light / Dark theme** toggle (saved in `localStorage`)
* 📱 **Offline support** with a custom Service Worker
* ⚡ **Deployable** on Vercel (CRA preset) or GitHub Pages

## Tech Stack

* **React** + **TypeScript**
* **Firebase** Authentication & Firestore database
* **CSS Variables** for theming & responsive design
* **Service Worker** for PWA offline cache
* **Recharts** for future statistics dashboards

## Getting Started

1. Clone the repo
2. `npm install`
3. Set up Firebase config in `src/contexts/AuthContext.tsx`
4. `npm start` to run locally

## Future Improvements

* 📊 **Statistics dashboard**: charts for entries over time, read/films breakdown
* 🔄 **Import / Export**: JSON/CSV backup and restore

---

Enjoy tracking your reading and watching habits!