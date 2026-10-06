import { initializeApp, getApps } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  signOut 
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCLkjWXopEWoOpCugoWcAGx80ZHsUQbaf8",
  authDomain: "wiftyup3.firebaseapp.com",
  projectId: "wiftyup3",
  storageBucket: "wiftyup3.firebasestorage.app",
  messagingSenderId: "464485577162",
  appId: "1:464485577162:web:634d82d184d7bb8ae71f33"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export { signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, signOut }

