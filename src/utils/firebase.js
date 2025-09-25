import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Firebase configuration (replace with your config)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Submit exam results to Firestore
export async function submitExamResults(payload) {
  try {
    // Check if UID already exists (client-side check - not foolproof)
    const q = query(
      collection(db, 'skillup_submissions'), 
      where('uid', '==', payload.uid)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      throw new Error('ALREADY_SUBMITTED');
    }

    // Add document to Firestore
    const docRef = await addDoc(collection(db, 'skillup_submissions'), {
      ...payload,
      submittedAt: new Date()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    if (error.message === 'ALREADY_SUBMITTED') {
      throw error;
    }
    console.error('Error submitting exam results:', error);
    throw new Error('SUBMISSION_FAILED');
  }
}