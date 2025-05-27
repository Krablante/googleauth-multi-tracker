# googleauth-multi-tracker
A simple book tracker
# Reading Tracker

A simple, offline-capable PWA for tracking books/articles **and** films/series. Built with React, TypeScript, and Firebase, it lets you sign in with Google, add entries by date and title, and view them grouped by day under two categories: **READ** and **FILMS**.

<img src="https://your-domain.com/path/to/screenshot.png" alt="Screenshot" width="600"/>

## Features

- 🔐 **Google Authentication** (only signed-in users can access)
- 📚 **Two categories**:  
  - **READ** (books & articles)  
  - **FILMS** (movies & TV shows)
- 📅 **Date picker** via a single calendar icon
- ➕ **Add & remove** entries synced in real time with Firestore
- 📂 **Grouped list** of entries sorted by date
- 🌙 **Light / Dark theme** toggle (saved in `localStorage`)
- 📱 **Offline support** thanks to a custom Service Worker
- ⚡ **Deployable** on Vercel (CRA preset) or GitHub Pages

## Tech Stack

- **React** + **TypeScript**  
- **Firebase** Authentication & Firestore database  
- **CSS Variables** for theming & responsive design  
- **Service Worker** for PWA offline cache  
- **Vercel** for instant deployments
