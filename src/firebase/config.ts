// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

// Debug: Log environment variables (only in development)
if (import.meta.env.DEV) {
  console.log('🔍 Firebase Environment Variables Debug:')
  console.log('VITE_FIREBASE_API_KEY:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_AUTH_DOMAIN:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_PROJECT_ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_STORAGE_BUCKET:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_MESSAGING_SENDER_ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_APP_ID:', import.meta.env.VITE_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing')
  console.log('VITE_FIREBASE_MEASUREMENT_ID:', import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? '✅ Set' : '❌ Missing')
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Enhanced validation with detailed error messages
const missingVars: string[] = []
if (!firebaseConfig.apiKey) missingVars.push('VITE_FIREBASE_API_KEY')
if (!firebaseConfig.authDomain) missingVars.push('VITE_FIREBASE_AUTH_DOMAIN')
if (!firebaseConfig.projectId) missingVars.push('VITE_FIREBASE_PROJECT_ID')
if (!firebaseConfig.storageBucket) missingVars.push('VITE_FIREBASE_STORAGE_BUCKET')
if (!firebaseConfig.messagingSenderId) missingVars.push('VITE_FIREBASE_MESSAGING_SENDER_ID')
if (!firebaseConfig.appId) missingVars.push('VITE_FIREBASE_APP_ID')

if (missingVars.length > 0) {
  const errorMessage = `Firebase configuration is missing. Missing variables: ${missingVars.join(', ')}. Please check your environment variables and ensure all required Firebase configuration is set.`
  console.error('❌ Firebase Configuration Error:', errorMessage)
  console.error('🔍 Current environment:', import.meta.env.MODE)
  console.error('🔍 Available env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')))
  throw new Error(errorMessage)
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Firestore Database
export const db = getFirestore(app)

// Initialize Firebase Storage
export const storage = getStorage(app)

// Initialize Cloud Functions
export const functions = getFunctions(app)

export default app




