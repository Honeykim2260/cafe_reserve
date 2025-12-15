// Firebase configuration and initialization
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJBZ56UhiPJvwYCXju9TGo5PE8mcEHfcw",
  authDomain: "mycafe-reservation.firebaseapp.com",
  projectId: "mycafe-reservation",
  storageBucket: "mycafe-reservation.firebasestorage.app",
  messagingSenderId: "1071532456772",
  appId: "1:1071532456772:web:cb68a46972f2fb41a57511",
  measurementId: "G-K3VC9Q2KSQ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

export default app
