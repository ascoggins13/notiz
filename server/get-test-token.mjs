import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_WEB_API_KEY',
  authDomain: 'notiz-4870f.firebaseapp.com',
  projectId: 'notiz-4870f',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = 'aaron.sem.expert@gmail.com';
const password = 'Scoggins123!';

const credential = await signInWithEmailAndPassword(auth, email, password);
const token = await credential.user.getIdToken();

console.log(token);