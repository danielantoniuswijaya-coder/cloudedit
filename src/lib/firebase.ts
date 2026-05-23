import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// AUTH
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// STORAGE (kalau kamu pakai upload file, kalau tidak pakai juga boleh dihapus)
export const storage = getStorage(app);

export default app;