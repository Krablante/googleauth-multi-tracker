# Tracker

A simple, PWA for tracking books/articles, films/series, goals/tasks **and** custom web resources. Built with React, TypeScript, Firebase, and DnD Kit, it lets you sign in with Google, add entries, manage wishlists (now with optional keywords), set daily goals with drag-&-drop reordering, and bookmark your favorite sites or news feeds.

## Features

* 🔐 **Google Authentication** (only signed-in users can access)
* 📚 **Six categories**:

  * **READ** (books & articles)
  * **READ (W)** (wishlist for books & articles; undated, move items to READ with today’s date)
  * **FILMS** (movies & TV shows)
  * **FILMS (W)** (wishlist for films & TV shows; undated, move items to FILMS with today’s date)
  * **GOALS 🎯** (tasks/goals; drag & drop to reorder; undated list, mark as done to remove)
  * **RESOURCES 📰** (custom links and news sites; add, reorder via drag & drop, and remove bookmarks)
* ➕ **Add & remove** entries, goals, and resources in real time with Firestore
* 🏷️ **Optional Keywords**: When marking a wishlist item as done, an inline form appears under the item for entering optional keywords (separated by `;`) before moving it to the main list.
* 🔀 **Drag & Drop Reordering** for Goals and Resources: hold and move to adjust priority (works on desktop and mobile)
* 📅 **Date picker** via calendar icon for READ & FILMS categories
* ✔️ **Wishlist support**: mark items as done to move them into main lists with today’s date; keyword form appears inline before finalizing
* 🎯 **Goals support**: add tasks without dates; drag & drop to reorder; mark with ✓ to delete
* 🌗 **Light / Dark theme** toggle (saved in `localStorage`)
* 💾 **Offline support** via custom Service Worker
* 📱 **Progressive Web App**: installable on desktop & mobile, offline-ready
* ⚡ **Deployable** on Vercel, GitHub Pages, or wrapped as PWA in Play Store via TWA

## Import / Export JSON

Tracker supports **JSON import and export** for your entries (excluding news resources and goals). In each category (READ, READ (W), FILMS, FILMS (W)), you’ll see a 📁 button next to the avatar:

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

## Keywords in Wishlist Flow

When viewing a wishlist item (either READ (W) or FILMS (W)), clicking the ✓ button triggers an inline form:

1. **Inline Keyword Form**: A text input appears beneath the wishlist item prompting "Keywords separated by `;` (optional)". A confirm (✓) button sits to the right of this input.
2. **Enter Keywords** (optional): Users can type keywords separated by semicolons; these keywords are saved alongside the completed entry.
3. **Confirm Completion**: Hitting the confirm button finalizes the move:

   * The entry (with any provided keywords) is added to the main list (READ or FILMS) with today's date.
   * The wishlist item is removed.
4. **Skip Keywords**: If no keywords are entered, simply confirming moves the item without metadata.

This inline approach keeps the UI streamlined and avoids extra modal dialogs.

## Drag & Drop Reordering (Goals & Resources)

We use **@dnd-kit** to provide seamless drag & drop on both desktop and mobile browsers. You can reorder tasks in **Goals** and bookmarks in **Resources** by holding and dragging:

1. **Long-press** (on mobile) or **click-and-drag** (on desktop) an item.
2. **Move** the item up or down to the desired position.
3. **Release**, and the new order is saved instantly to Firestore.

Draggable behavior is powered by:

```json
"@dnd-kit/core": "^8.0.0",
"@dnd-kit/sortable": "^8.0.0",
"@dnd-kit/utilities": "^8.0.0"
```

## Tech Stack

* **React** + **TypeScript**
* **Firebase** Authentication & Firestore database
* **@dnd-kit** for drag & drop functionality
* **CSS Variables** & responsive design
* **Service Worker** for offline cache
* **Progressive Web App**: installable on desktop & mobile, offline-ready

## Getting Started

1. Clone the repo
2. `npm install`
3. Configure Firebase in `src/contexts/AuthContext.tsx`
4. `npm start` to run locally

## Deploying as a PWA or Native Wrapper

### Deploy as PWA (GitHub Pages or Vercel)

Simply run `npm run build` and follow deployment instructions for your chosen platform. Users can then **Install** as a PWA from Chrome or Firefox.

### Deploy via Trusted Web Activity (TWA)

1. Ensure your site is served over HTTPS with a valid `manifest.json` and Service Worker.
2. Create an Android project using **Android Studio → New Project → Trusted Web Activity**.
3. Point `startUrl` to your production URL in the **android/app/src/main/AndroidManifest.xml**.
4. Set up `assetlinks.json` on your domain to verify the Android package.
5. Build and publish to Google Play. Users will install a shell that launches your PWA in a Chrome Custom Tab, supporting full PWA capabilities.

### Wrap in Capacitor (Android/iOS)

1. Install Capacitor:

   ```bash
   npm install @capacitor/cli @capacitor/core --save
   ```
2. Initialize: `npx cap init "Tracker" "com.example.tracker"`
3. Build React: `npm run build`
4. Copy to native: `npx cap copy`
5. Add platforms: `npx cap add android` (and `ios` if needed)
6. Open IDE: `npx cap open android`
7. Build and run on device/emulator.

## Future Improvements

* 📊 **Statistics Dashboard**: visualize reading/watching patterns and resources over time
* 🌐 **Tagging**: add advanced tag filtering on entries and resources
* 🔗 **External Integrations**: Google Books API, OMDB/TMDB for metadata auto-fill

Enjoy tracking your reading, watching, goals, and web explorations!