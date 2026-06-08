import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
export let firebaseAvailable = false;

try {
  if (firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    firebaseAvailable = true;
  }
} catch {
  firebaseAvailable = false;
}

export { db };
export default app;
