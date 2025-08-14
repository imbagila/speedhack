## Civil Card Payment (React Native + Expo)

<div align="center">

![SPEedhack Logo](./docs/speedhack.jpg)

</div>

This is a React Native app (Expo SDK 53) for NFC-based card payments, forced top-ups (superadmin), and registrations with Firebase Firestore as the backend.

### Tech Stack
- React Native 0.79 (Expo ~53)
- TypeScript
- Zustand (state management)
- react-native-nfc-manager (NFC reading, physical device required)
- Firebase v10 (Firestore)

### App Flows

- Register
  - Home → Register (requires admin PIN `123456`)
  - Scan card:
    - If not in Firestore → Register form → Save → Register Success → Home
    - If already exists → Show profile info + “already registered” → Home

- Do Payment
  - Home → Do Payment
  - Scan source card:
    - If not registered → Alert “Card not registered”
    - If registered → Profile screen
  - Scan destination card → Must be registered → Enter amount + source PIN → Transfer
  - Validations:
    - Incorrect PIN → Alert
    - Insufficient balance → Alert

- Force Topup (Superadmin)
  - Home → Force Topup
  - Enter amount → Scan card
  - If card not registered → Alert
  - Process only once per tap → Success screen → OK returns Home

### Firestore Data Model
Collection: `cards` (document ID = `card_id`)

Fields stored per card:
- `amount`: number (balance)
- `card_id`: string (NFC card identifier)
- `register_date`: string (ISO datetime)
- `date_of_birth`: string (YYYY-MM-DD)
- `email_address`: string
- `fullname`: string
- `gender`: 'male' | 'female' | 'other' (stored lowercase)
- `phone_number`: string
- `pin`: string (numeric)

The app maps Firestore to an internal `UserProfile` type. Gender is normalized to title case inside the app.

### Environment Configuration (Firebase)

The app reads Firebase config from environment variables with `EXPO_PUBLIC_` prefix. It also supports fallback values from `app.json → expo.extra.firebase` for development.

Set these in a local `.env` (not committed):
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Restart the dev server after changes. For CI/EAS builds, set the same variables in your build environment.

### Firestore Rules (Development Example)
For local/dev testing, you can temporarily allow reads/writes (do not use in production):
```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Project Structure (selected)
- `src/store/useWalletStore.ts`: Global state, actions (register, transfer, topup), Firestore sync helpers
- `src/utils/firestore.ts`: Firebase init + Firestore helpers
  - `getUserProfile(cardId)`
  - `saveUserProfile(user)`
  - `updateUserAmount(cardId, amount)`
  - `subscribeUserProfile(cardId, onData)`
- NFC readers: `src/screens/*ReaderScreen.tsx`
- Screens: `HomeScreen`, `Register*`, `Transfer*`, `Admin*`, `ProfileScreen`

### NFC Notes
- Requires a physical Android device with NFC enabled (or iOS with supported NFC capabilities).
- The app listens for NFC tags, extracts an ID, and uses it as `card_id`.

### Development

Prerequisites:
- Node.js 20+
- pnpm 10+
- Android SDK (for native builds)

Install:
```bash
pnpm install
```

Start (Expo dev server):
```bash
pnpm start
```

Run on Android (managed by Expo):
```bash
pnpm android
```

### Android APK Builds (local)

Debug APK:
```bash
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

Release APK (uses debug signing in this template — replace with your own keystore for production):
```bash
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

Optional: App Bundle
```bash
cd android
./gradlew bundleRelease
# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### CI (GitHub Actions)

Workflow file: `.github/workflows/android-build.yml`
- Triggers on push to `main`
- Installs pnpm via Corepack, installs deps, prepares Android SDK/Java
- Runs clean debug and release builds
- Uploads APK artifacts from `android/app/build/outputs/apk/*`

### Branding (Name & Icon)

- App name (Expo): set in `app.json` at `expo.name`
- Android app label: `android/app/src/main/res/values/strings.xml` → `app_name`
- iOS display name: `ios/<app>/Info.plist` → `CFBundleDisplayName`
- App icon (Expo): `app.json` → `expo.icon` and `expo.android.adaptiveIcon.foregroundImage`
  - Use a square 1024×1024 PNG; adaptive icon foreground should include padding to avoid cropping

After changing icons/names in a project with native folders, you must rebuild the native app (Metro reload will not update icons).

### Security Notes
- Do not commit real Firebase credentials. Use `.env` and CI secrets.
- The demo Firestore rules above are not suitable for production.

### Troubleshooting
- Icons not updating:
  - Rebuild the native app. Uninstall the old app from device/emulator before reinstall.
- NFC not detected:
  - Ensure NFC is enabled on device; test with another NFC reader app to verify hardware.
- “Card not registered” during payment/topup:
  - Ensure the card was registered and exists in Firestore `cards` collection.
- Stale profile data:
  - Scanning a card re-fetches from Firestore. The app also supports real-time subscriptions.


