'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Check, Lock } from 'lucide-react';
import type { Section, Lesson } from '@/lib/types';
import { useProgress } from '@/hooks/use-progress';
import { KazakhOrnament } from './KazakhOrnament';

const LessonNode = ({ lesson, index, isCompleted, isUnlocked, isCurrent }: { lesson: Lesson; index: number; isCompleted: boolean; isUnlocked: boolean; isCurrent: boolean; }) => {
  const alignment = index % 2 === 0 ? 'self-start' : 'self-end';
  const Icon = isCompleted ? Check : (isUnlocked ? BookOpen : Lock);
  
  const nodeContent = (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
      className={`relative ${alignment}`}
    >
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center border-4
          ${isCompleted ? 'bg-primary/20 border-primary' : ''}
          ${isCurrent ? 'bg-accent/20 border-accent animate-pulse' : ''}
          ${!isUnlocked ? 'bg-muted border-border' : ''}
          ${isUnlocked && !isCompleted && !isCurrent ? 'bg-card border-border' : ''}
        `}
      >
        <Icon className={`h-10 w-10 
          ${isCompleted ? 'text-primary' : ''}
          ${isCurrent ? 'text-accent' : ''}
          ${!isUnlocked ? 'text-muted-foreground' : ''}
          ${isUnlocked && !isCompleted && !isCurrent ? 'text-primary' : ''}
        `} />
      </div>
    </motion.div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {isUnlocked ? (
            <Link href={lesson.tasks.length > 0 ? `/lesson/${lesson.id}` : '#'} className="cursor-pointer">
              {nodeContent}
            </Link>
          ) : (
            <div className="cursor-not-allowed">{nodeContent}</div>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold">{lesson.title}</p>
          <p>{lesson.points} очков</p>
          {isCompleted && <p className='text-primary'>Пройдено</p>}
          {!isUnlocked && <p className='text-muted-foreground'>Заблокировано</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function LessonPath({ sections }: { sections: Section[] }) {
  const { progress } = useProgress();

  return (
    <div className="space-y-16">
      {sections.map((section) => {
        const lastCompletedLessonIndex = section.lessons
          .map(l => l.id)
          .reduce((acc, curr, idx) => (progress.completedLessons.includes(curr) ? idx : acc), -1);
        
        return (
          <Card key={section.id} className="p-6 md:p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-5 -translate-y-1/4 translate-x-1/4">
                <KazakhOrnament className="w-64 h-64 text-primary" />
            </div>
            <CardHeader className="text-center mb-8 relative z-10">
              <CardTitle className="text-3xl font-bold">{section.title}</CardTitle>
              <p className="text-muted-foreground">{section.totalPoints} очков за раздел</p>
            </CardHeader>
            <div className="relative flex flex-col items-center w-full max-w-sm mx-auto">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-1 bg-border/40 rounded-full" />
              <div className="flex flex-col gap-12 w-full">
                {section.lessons.map((lesson, index) => {
                  const isCompleted = progress.completedLessons.includes(lesson.id);
                  const isUnlocked = index <= lastCompletedLessonIndex + 1;
                  const isCurrent = index === lastCompletedLessonIndex + 1;
                  return (
                    <LessonNode 
                      key={lesson.id} 
                      lesson={lesson} 
                      index={index} 
                      isCompleted={isCompleted} 
                      isUnlocked={isUnlocked}
                      isCurrent={isCurrent}
                    />
                  );
                })}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
