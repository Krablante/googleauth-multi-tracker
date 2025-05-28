# Tracker

A simple, PWA for tracking books/articles, films/series **and** custom web resources. Built with React, TypeScript, and Firebase, it lets you sign in with Google, add entries, manage wishlists and even bookmark your favorite sites or news feeds.

<img src="https://your-domain.com/path/to/screenshot.png" alt="Screenshot" width="600" />

## Features

* 🔐 **Google Authentication** (only signed-in users can access)
* 📚 **Five categories**:

  * **READ** (books & articles)
  * **READ (W)** (wishlist for books & articles; undated, move items to READ with today’s date)
  * **FILMS** (movies & TV shows)
  * **FILMS (W)** (wishlist for films & TV shows; undated, move items to FILMS with today’s date)
  * **RESOURCES 📰** (custom links and news sites; add, reorder, and remove bookmarks)
* ➕ **Add & remove** entries and resources in real time with Firestore
* 🔀 **Reordering** for Resources: move bookmarks up or down to adjust priority
* 📅 **Date picker** via calendar icon for READ & FILMS categories
* ✔️ **Wishlist support**: mark items as done to move them into main lists with today’s date
* 🌗 **Light / Dark theme** toggle (saved in `localStorage`)
* 💾 **Offline support** via custom Service Worker
* 📱 **Progressive Web App**: installable on desktop & mobile, offline-ready
* ⚡ **Deployable** on Vercel or GitHub Pages

## Import / Export JSON

Tracker now supports **JSON import and export** for your entries (excluding news resources). In each category (READ, READ (W), FILMS, FILMS (W)), you’ll see a 📁 button next to the avatar:

1. **Click the 📁 button** to open the Import / Export modal.
2. **Choose** **Export** or **Import**.
3. **Select a category** (e.g., `READ_WISH`).

### Export

* Validates that the category contains at least one entry.
* Downloads a JSON file named `<CATEGORY>-export-YYYY-MM-DD.json`, containing an array of objects:

  ```json
  [
    {
      "id": "...",
      "date": "YYYY-MM-DD",
      "title": "Entry Title",
      "category": "read",
      "createdAt": { "seconds": 1234567890, "nanoseconds": 0 },
      "owner": "user_uid"
    },
    ...
  ]
  ```

### Import

* Only accepts **.json** files.

* Validates file extension and MIME type.

* Prompts a template JSON for the chosen category at the top of the modal:

  ```json
  [
    { "date": "YYYY-MM-DD", "title": "Entry Title" }
  ]
  ```

* Reads the uploaded file, parses the array, and adds each item to the selected category.

* On success or error, displays a message at the top of the modal.

## Tech Stack

* **React** + **TypeScript**
* **Firebase** Authentication & Firestore database
* **CSS Variables** & responsive design
* **Service Worker** for offline cache
* **Recharts** ready for future dashboard charts

## Getting Started

1. Clone the repo
2. `npm install`
3. Configure Firebase in `src/contexts/AuthContext.tsx`
4. `npm start` to run locally

## Future Improvements

* 📊 **Statistics Dashboard**: visualize reading/watching patterns and resources over time
* 🏷️ **Tagging**: add tags to entries for advanced filtering
* 🌐 **External Integrations**: Google Books API, OMDB/TMDB for metadata auto-fill

---

Enjoy tracking your reading, watching, and web explorations!
