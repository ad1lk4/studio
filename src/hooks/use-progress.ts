'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

interface Progress {
  xp: number;
  completedLessons: string[];
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
};

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('kazakhLinguaProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Failed to load progress from localStorage', error);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const saveProgress = useCallback((newProgress: Progress) => {
    try {
      localStorage.setItem('kazakhLinguaProgress', JSON.stringify(newProgress));
      setProgress(newProgress);
    } catch (error) {
      console.error('Failed to save progress to localStorage', error);
    }
  }, []);

  const completeLesson = useCallback((lessonId: string, points: number) => {
    setProgress((prevProgress) => {
      if (prevProgress.completedLessons.includes(lessonId)) {
        return prevProgress; // Already completed
      }
      const newProgress = {
        xp: prevProgress.xp + points,
        completedLessons: [...prevProgress.completedLessons, lessonId],
      };
      saveProgress(newProgress);
      return newProgress;
    });
  }, [saveProgress]);

  return (
    <ProgressContext.Provider value={{ progress, completeLesson, isLoading }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
