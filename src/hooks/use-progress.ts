'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { useFirebase, useMemoFirebase, useDoc } from '@/firebase';
import { doc, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { format, isSameDay, subDays, startOfDay, parseISO } from 'date-fns';

interface Progress {
  xp: number;
  completedLessons: string[];
  currentStreak: number;
}

interface ProgressContextType {
  progress: Progress;
  completeLesson: (lessonId: string, points: number) => void;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const initialProgress: Progress = {
  xp: 0,
  completedLessons: [],
  currentStreak: 0,
};

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [localProgress, setLocalProgress] = useState<Progress>(initialProgress);
  const [isLoading, setIsLoading] = useState(true);

  const { user, isUserLoading, firestore } = useFirebase();

  // Load local progress from localStorage
  useEffect(() => {
     if (!user) {
        try {
        const savedProgress = localStorage.getItem('soyleProgress');
        if (savedProgress) {
            setLocalProgress(JSON.parse(savedProgress));
        }
        } catch (error) {
        console.error('Failed to load progress from localStorage', error);
        }
     }
  }, [user]);

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  
  const { data: firestoreUserData, isLoading: isFirestoreLoading } = useDoc(userDocRef);

  // Streak logic
  useEffect(() => {
    if (!user || !userDocRef || !firestoreUserData || isUserLoading || isFirestoreLoading) {
      return;
    }

    const today = startOfDay(new Date());
    const lastLoginDateStr = firestoreUserData.lastLoginDate;

    if (lastLoginDateStr && isSameDay(parseISO(lastLoginDateStr), today)) {
        return;
    }

    const yesterday = subDays(today, 1);
    let newStreak = firestoreUserData.currentStreak || 0;
    const lastLoginDate = lastLoginDateStr ? parseISO(lastLoginDateStr) : null;

    if (lastLoginDate && isSameDay(lastLoginDate, yesterday)) {
      newStreak++;
    } else {
      newStreak = 1;
    }
    
    const todayStr = format(today, 'yyyy-MM-dd');

    updateDoc(userDocRef, {
      currentStreak: newStreak,
      lastLoginDate: todayStr,
    }).catch(error => {
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: { currentStreak: newStreak, lastLoginDate: todayStr },
          })
        )
    });
  }, [user, userDocRef, firestoreUserData, isUserLoading, isFirestoreLoading]);


  const saveLocalProgress = useCallback((newProgress: Progress) => {
    try {
      localStorage.setItem('soyleProgress', JSON.stringify(newProgress));
      setLocalProgress(newProgress);
    } catch (error) {
      console.error('Failed to save progress to localStorage', error);
    }
  }, []);

  const completeLesson = useCallback((lessonId: string, points: number) => {
    if (user && userDocRef) {
      // User is logged in, update Firestore
      if (firestoreUserData?.completedLessons?.includes(lessonId)) return;
      
      updateDoc(userDocRef, {
        xp: increment(points),
        completedLessons: arrayUnion(lessonId),
      }).catch(error => {
          errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: userDocRef.path,
              operation: 'update',
              requestResourceData: { xp: `increment(${points})`, completedLessons: `arrayUnion(${lessonId})` },
            })
          )
      });
    } else {
      // User is not logged in, update localStorage
      setLocalProgress((prevProgress) => {
        if (prevProgress.completedLessons.includes(lessonId)) {
          return prevProgress; // Already completed
        }
        const newProgress = {
          ...prevProgress,
          xp: prevProgress.xp + points,
          completedLessons: [...prevProgress.completedLessons, lessonId],
        };
        saveLocalProgress(newProgress);
        return newProgress;
      });
    }
  }, [user, userDocRef, firestoreUserData, saveLocalProgress]);
  
  const progress = user && firestoreUserData ? {
      xp: firestoreUserData.xp ?? 0,
      completedLessons: firestoreUserData.completedLessons ?? [],
      currentStreak: firestoreUserData.currentStreak ?? 0,
  } : localProgress;

  useEffect(() => {
      const loading = isUserLoading || (user && isFirestoreLoading);
      setIsLoading(loading);
  },[isUserLoading, user, isFirestoreLoading]);


  return React.createElement(ProgressContext.Provider, { value: { progress, completeLesson, isLoading } }, children);
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
