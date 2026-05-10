
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

async function testConnection() {
  try {
    // Only test if we have a database configured
    if (firebaseConfig.firestoreDatabaseId) {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log("Firestore connection verified");
    }
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
    // We ignore 403s on the test doc since rules are global deny
  }
}
testConnection();
