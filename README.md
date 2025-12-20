# BunkMaar

## Author

**Name:** Syedmohamamd Sameer

**Instagram:** @_samxiao

# 📚 BunkMaar

A modern, responsive web application for tracking student attendance with intelligent analytics and predictions.

![Attendance Tracker](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
# BunkMaar

**BunkMaar** is a modern, responsive attendance tracker for students with analytics, predictions, and an easy-to-use UI. It is built with React + TypeScript, Tailwind CSS, and Vite, and ships as a PWA-ready client-side app.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![React](https://img.shields.io/badge/react-18.x-blue) ![TypeScript](https://img.shields.io/badge/typescript-5.x-blue) ![Vite](https://img.shields.io/badge/vite-5.x-brightgreen)

## Table of Contents
- Features
- Tech Stack
- Quickstart
- Scripts
- Project Structure
- Notes
- Contributing
- License

## Features
- Track and mark attendance (Present / Absent / Holiday / Cancelled)
- Daily, calendar and timetable views
- Subject-wise analytics and monthly trends
- Attendance predictor (days required to reach target %) 
- Export / Import data and local persistence
- Light/Dark themes and PWA support

## Tech Stack
- Frontend: React 18 + TypeScript
- Styling: Tailwind CSS
- State: Zustand (with persistence)
- Routing: React Router
- UI primitives: Radix UI + shadcn components
- Charts: Recharts
- Build: Vite
- Optional: Firebase (for future sync)

## Quickstart
Prerequisites: Node.js (v16+) and npm or yarn.

1. Clone the repo

   git clone <YOUR_GIT_URL>
   cd bunkmaar

2. Install

   npm install

3. Run development server

   npm run dev

4. Open `http://localhost:5173`

## Building for Android

BunkMaar can be built as a native Android app using Capacitor:

1. Prerequisites:
   - Java Development Kit (JDK) 17 or higher
   - Android Studio with Android SDK
   - Gradle (included with Android Studio)

2. Build the Android APK:
   ```
   npm run android:build
   ```

   This command will:
   - Build the web app
   - Set up the Android platform (if needed)
   - Sync web assets to Android
   - Build the APK using Gradle

3. The APK will be located at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

Note: The first build may take several minutes as Gradle downloads dependencies.

## Changes
- Private/global messaging and the optional WebSocket relay have been removed.
   - The `Messages` routes and pages are no longer part of the app.
   - The WebSocket relay and related client utilities were deleted.
   - Scripts referencing the relay were removed from `package.json`.

## Useful Scripts
Use the scripts from [package.json](package.json#L1):

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run build:dev` — build with development mode
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint
- `npm run android:build` — build Android APK (requires Android SDK)

## Project Structure (key files)
- `src/` — application source code
  - `src/main.tsx` — app entry
  - `src/App.tsx` — main app layout
  - `src/components/` — reusable components & UI primitives
  - `src/pages/` — route pages (Today, Calendar, Timetable, Subjects, Settings)
- `public/` — static assets and PWA manifest
- `vite.config.ts` — Vite configuration
- `package.json` — scripts & dependencies ([package.json](package.json#L1))

Refer to the source for more details in each component.

## Notes
- The app is primarily client-side and stores data locally by default. There are Firebase utilities under `src/lib/` for optional sync.
- PWA support is included via `vite-plugin-pwa` — you can test installability by running a production build and serving the `dist/` output.

## Contributing
Friendly contributions welcome:

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit and push
4. Open a PR with a clear description

Please run `npm run lint` before opening PRs.

## Next Steps / Roadmap
- Add cloud-sync and user accounts (optional Firebase integration)
- Add exportable PDF/CSV reports
- Add CI (linting, type checks, preview deploy)

## License
MIT — see [LICENSE](LICENSE) for details.

---

If you'd like, I can also:
- add a short CONTRIBUTING.md, or
- create a simple GitHub Actions workflow for lint/build checks.

*Built with ❤️ — let me know what to improve next.*