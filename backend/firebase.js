import admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Initialize Firebase Admin SDK (For Backend)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const adminDB = admin.firestore();

const firebaseConfig = {
    apiKey: "AIzaSyBi0R0wPbQCm-6ndleIx0I97uG1DGqb3JI",
    authDomain: "note-db-e3ead.firebaseapp.com",
    projectId: "note-db-e3ead",
    storageBucket: "note-db-e3ead.firebasestorage.app",
    messagingSenderId: "258142381260",
    appId: "1:258142381260:web:3c499d6497b29cc90c4e69",
    measurementId: "G-4HH1C4DEYF"
  };
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, adminDB };
