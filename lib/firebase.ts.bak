import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDtq82AdCnBzEEGwcUGgKMsW7VLE8c5fpI",
  authDomain: "bottg-edbb0.firebaseapp.com",
  databaseURL: "https://bottg-edbb0-default-rtdb.firebaseio.com",
  projectId: "bottg-edbb0",
  storageBucket: "bottg-edbb0.appspot.com",
  messagingSenderId: "304723020345",
  appId: "1:304723020345:web:fbaa8b69b818317c8a5be8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export async function saveUserToRTDB(uid: string, name: string, email: string) {
  await set(ref(db, `users/${uid}`), {
    uid,
    name,
    email,
    createdAt: new Date().toISOString(),
  });
}
