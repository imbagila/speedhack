run:
	pnpm expo prebuild
	pnpm expo run:android

scrcpy:
	~/apps/scrcpy/scrcpy -b2M -m800

build:
	export EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
	export EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
	export EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
	export EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
	export EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
	export EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
	export EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
	cd android && ./gradlew assembleRelease
	cp android/app/build/outputs/apk/release/app-release.apk ./speedhack.apk
