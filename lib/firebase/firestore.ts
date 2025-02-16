import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  doc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';

import { User } from 'firebase/auth';

interface Calculation {
  userId: string;
  date: string;
  optionPrice: number;
  inputs: {
    stockPrice: number;
    strikePrice: number;
    interestRate: number;
    timeToExpiration: number;
    volatility: number;
  };
}

interface UserData {
  tokens: number;
}

// User token management
export async function getUserTokens(userId: string): Promise<number> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Initialize new user with default tokens if no document exists.
    await setDoc(userRef, { tokens: 100 });
    return 100;
  }
  
  return userSnap.data().tokens;
}

export async function updateUserTokens(userId: string, newTokenCount: number) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { tokens: newTokenCount });
}

// Calculation management using subcollections under each user

/**
 * Saves a calculation to the current user's calculations subcollection.
 */
export async function saveCalculation(calculation: Calculation) {
  try {
    // Deduct one token from the user's balance.
    const currentTokens = await getUserTokens(calculation.userId);
    if (currentTokens <= 0) {
      throw new Error('Insufficient tokens');
    }
    
    // Reference the user's document and the calculations subcollection
    const userRef = doc(db, 'users', calculation.userId);
    const calculationsRef = collection(userRef, 'calculations');
    
    // Save calculation in the subcollection
    const docRef = await addDoc(calculationsRef, calculation);
    
    // Update token count
    await updateUserTokens(calculation.userId, currentTokens - 1);
    
    return docRef.id;
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieves all calculations for the given user from their calculations subcollection.
 */
export async function getUserCalculations(userId: string) {
  const userRef = doc(db, 'users', userId);
  const calculationsRef = collection(userRef, 'calculations');
  
  // Get the calculations ordered by date (most recent first)
  const q = query(calculationsRef, orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

/**
 * Retrieves a single calculation from the user's calculations subcollection.
 * (Note: Now requires the userId.)
 */
export async function getCalculation(userId: string, calculationId: string) {
  const docRef = doc(db, 'users', userId, 'calculations', calculationId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Calculation not found');
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data()
  };
}

/**
 * Updates a calculation in the user's calculations subcollection.
 */
export async function updateCalculation(userId: string, calculationId: string, updates: Partial<Calculation>) {
  const docRef = doc(db, 'users', userId, 'calculations', calculationId);
  await updateDoc(docRef, updates);
}

/**
 * Deletes a calculation from the user's calculations subcollection.
 */
export async function deleteCalculation(userId: string, calculationId: string) {
  const docRef = doc(db, 'users', userId, 'calculations', calculationId);
  await deleteDoc(docRef);
} 

export async function createUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    {
      email: user.email,
      tokens: 100, // default token count for new accounts
      createdAt: new Date().toISOString(),
    },
    { merge: true } // Merge creates the document if it doesn't exist
  );
}