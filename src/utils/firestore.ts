import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { UserProfile, Gender } from '../types/user';

let cachedApp: FirebaseApp | null = null;

function getApp(): FirebaseApp {
    if (cachedApp) return cachedApp;
    // Expect env vars provided via app.json -> expo constants or native config
    const env = (globalThis as any)?.process?.env ?? {};
    const firebaseConfig = {
        apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
        measurementId: env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    } as const;
    cachedApp = initializeApp(firebaseConfig as any);
    return cachedApp;
}

function usersCollection() {
    const app = getApp();
    const db = getFirestore(app);
    return { db };
}

const COLLECTION_NAME = 'civil-card-payment';

export type FirestoreUser = {
    amount: number;
    card_id: string;
    register_date: string; // ISO datetime
    date_of_birth: string; // YYYY-MM-DD
    email_address: string;
    fullname: string;
    gender: 'male' | 'female' | 'other';
    phone_number: string;
    pin: string;
};

function mapToFirestore(user: UserProfile): FirestoreUser {
    return {
        amount: user.balance,
        card_id: user.cardId,
        register_date: user.registerDate,
        date_of_birth: user.dateOfBirth,
        email_address: user.email,
        fullname: user.fullName,
        gender: user.gender.toLowerCase() as 'male' | 'female' | 'other',
        phone_number: user.phoneNumber,
        pin: user.pin,
    };
}

function mapFromFirestore(data: FirestoreUser): UserProfile {
    const g = (data.gender ?? 'other').toLowerCase();
    let gender: Gender = 'Other';
    if (g === 'male') gender = 'Male';
    else if (g === 'female') gender = 'Female';
    return {
        cardId: data.card_id,
        fullName: data.fullname,
        email: data.email_address,
        dateOfBirth: data.date_of_birth,
        phoneNumber: data.phone_number,
        gender,
        registerDate: data.register_date,
        balance: data.amount,
        pin: data.pin,
    };
}

export async function getUserProfile(cardId: string): Promise<UserProfile | null> {
    const { db } = usersCollection();
    const ref = doc(db, COLLECTION_NAME, cardId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as FirestoreUser;
    return mapFromFirestore(data);
}

export async function saveUserProfile(user: UserProfile): Promise<void> {
    const { db } = usersCollection();
    const ref = doc(db, COLLECTION_NAME, user.cardId);
    await setDoc(ref, mapToFirestore(user), { merge: true });
}

export async function updateUserAmount(cardId: string, amount: number): Promise<void> {
    const { db } = usersCollection();
    const ref = doc(db, COLLECTION_NAME, cardId);
    await updateDoc(ref, { amount });
}


