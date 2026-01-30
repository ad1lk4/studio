'use client';

import { doc, setDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { firestore } from '@/firebase/client'; // Assuming you have a client-side firestore instance export

/**
 * Creates a user document in the `users` collection after sign up.
 * @param user The user object from Firebase Authentication.
 * @param username The username provided during sign up.
 */
export async function createUserProfileDocument(user: User, username: string) {
  if (!user) return;

  const userRef = doc(firestore, 'users', user.uid);

  const userData = {
    id: user.uid,
    username: username,
    email: user.email,
    xp: 0,
    completedLessons: [],
  };

  try {
    await setDoc(userRef, userData);
  } catch (error) {
    console.error("Error creating user document:", error);
    // Optionally re-throw or handle the error, e.g., show a toast to the user
    throw new Error("Could not create user profile.");
  }
}

    