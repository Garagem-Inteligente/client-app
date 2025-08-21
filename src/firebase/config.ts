// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtwoXZUnHSgUg_Rr0-BSgrNchn6hk9UgU",
  authDomain: "autocare-platform.firebaseapp.com",
  projectId: "autocare-platform",
  storageBucket: "autocare-platform.firebasestorage.app",
  messagingSenderId: "868408826724",
  appId: "1:868408826724:web:37775191fb1e4b26d57871",
  measurementId: "G-TVZFYH3Z0M"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Analytics (optional)
export const analytics = getAnalytics(app)

export default app