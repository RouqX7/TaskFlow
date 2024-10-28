import { initializeApp, cert } from "firebase-admin/app";
import { initializeApp as initApp } from "firebase/app";
import { getDatabase } from "firebase-admin/database";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth"; 
import { getAuth as getClientAuth } from "firebase/auth"; 
import { profile } from "console";

// Firebase Admin SDK initialization (server-side)
export const firebaseAdminSdkBase64 = process.env.FIREBASE_ADMIN_SDK_BASE64 ?? '';
const firebaseAdminSdkBuffer = Buffer.from(firebaseAdminSdkBase64, 'base64');
const firebaseAdminSdkConfig = JSON.parse(firebaseAdminSdkBuffer.toString('utf-8'));

const firebaseAdminConfig = {
    credential: cert(firebaseAdminSdkConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
};

// Initialize Firebase Admin SDK
const firebaseAdminApp = initializeApp(firebaseAdminConfig);

// Firebase Client SDK initialization (client-side)
const firebaseClientConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase Client SDK
const firebaseClientApp = initApp(firebaseClientConfig);

// Firebase Admin services
const firestoreAdmin = getFirestore(firebaseAdminApp);
const databaseAdmin = getDatabase(firebaseAdminApp);
const firebaseAuthAdmin = getAdminAuth(firebaseAdminApp);
firestoreAdmin.settings({ignoreUndefinedProperties:true});
// Firebase Client services
const firebaseAuthClient = getClientAuth(firebaseClientApp); // Use this for client-side login

export {
    firebaseAdminApp,
    firebaseClientApp,
    firebaseAuthAdmin,
    firebaseAuthClient, 
    databaseAdmin,
    firestoreAdmin
};

export const DBPath = {
    profile: 'profile',
}