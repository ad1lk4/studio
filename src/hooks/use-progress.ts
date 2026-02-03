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
  isStreakActiveToday: boolean;
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
  isStreakActiveToday: false,
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

  const saveLocalProgress = useCallback((newProgress: Progress) => {
    try {
      localStorage.setItem('soyleProgress', JSON.stringify(newProgress));
      setLocalProgress(newProgress);
    } catch (error) {
      console.error('Failed to save progress to localStorage', error);
    }
  }, []);

  const completeLesson = useCallback((lessonId: string, points: number) => {
    if (user && userDocRef && firestoreUserData) {
      // User is logged in, update Firestore
      if (firestoreUserData?.completedLessons?.includes(lessonId)) return;

      const today = startOfDay(new Date());
      const lastCompletionDateStr = firestoreUserData.lastLessonCompletionDate;
      const lastCompletionDate = lastCompletionDateStr ? parseISO(lastCompletionDateStr) : null;
      
      const updatePayload: any = {
        xp: increment(points),
        completedLessons: arrayUnion(lessonId),
      };

      // Only update streak if a lesson hasn't been completed today
      if (!lastCompletionDate || !isSameDay(lastCompletionDate, today)) {
        const yesterday = subDays(today, 1);
        const currentStreak = firestoreUserData.currentStreak || 0;
        
        const newStreak = (lastCompletionDate && isSameDay(lastCompletionDate, yesterday)) 
            ? currentStreak + 1 
            : 1;

        updatePayload.currentStreak = newStreak;
        updatePayload.lastLessonCompletionDate = format(today, 'yyyy-MM-dd');
      }

      updateDoc(userDocRef, updatePayload).catch(error => {
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
          isStreakActiveToday: false, // Streak not tracked for anonymous
        };
        saveLocalProgress(newProgress);
        return newProgress;
      });
    }
  }, [user, userDocRef, firestoreUserData, saveLocalProgress]);
  
  const isStreakActiveToday = user && firestoreUserData?.lastLessonCompletionDate
    ? isSameDay(parseISO(firestoreUserData.lastLessonCompletionDate), new Date())
    : false;
    
  const progress = user && firestoreUserData ? {
      xp: firestoreUserData.xp ?? 0,
      completedLessons: firestoreUserData.completedLessons ?? [],
      currentStreak: firestoreUserData.currentStreak ?? 0,
      isStreakActiveToday: isStreakActiveToday
  } : localProgress;

  useEffect(() => {
      const loading = Boolean(isUserLoading || (user && isFirestoreLoading));
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
