'use client';

import { useState } from 'react';
import type { Lesson, Task } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import TaskDisplay from './TaskDisplay';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { CheckCircle, XCircle, Award, Star, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/use-progress';
import Confetti from 'react-confetti';
import { speak } from '@/lib/tts';

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

export default function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [showConfetti, setShowConfetti] = useState(false);

  const router = useRouter();
  const { completeLesson } = useProgress();

  const currentTask = lesson.tasks[currentTaskIndex];
  const isLessonFinished = currentTaskIndex >= lesson.tasks.length;
  const progressPercentage = (currentTaskIndex / lesson.tasks.length) * 100;

  const handleCheckAnswer = () => {
    let isCorrect = false;
    switch (currentTask.type) {
      case 'MULTIPLE_CHOICE':
      case 'DIALOGUE_COMPLETION':
      case 'ODD_ONE_OUT':
        isCorrect = userAnswer === currentTask.correctAnswer;
        break;
      case 'TRUE_FALSE':
        isCorrect = userAnswer === currentTask.correctAnswer;
        break;
      case 'SENTENCE_BUILDER':
        isCorrect = userAnswer === currentTask.correctAnswer;
        break;
      case 'MATCH_PAIRS':
        isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(currentTask.pairs.map(p => `${p.prompt}-${p.answer}`).sort());
        break;
    }
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
  };

  const handleContinue = () => {
    if (currentTaskIndex < lesson.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setAnswerStatus('unanswered');
      setUserAnswer(null);
    } else {
      // Finish lesson
      completeLesson(lesson.id, lesson.points);
      setShowConfetti(true);
      setCurrentTaskIndex(currentTaskIndex + 1); // To show completion screen
    }
  };

  if (isLessonFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        {showConfetti && <Confetti recycle={false} onConfettiComplete={() => setShowConfetti(false)} />}
        <Card className="w-full max-w-md text-center p-8">
          <Award className="w-20 h-20 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Урок пройден!</h2>
          <p className="text-muted-foreground mb-4">Отличная работа! Вы заработали:</p>
          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-yellow-500 mb-8">
            <Star className="w-8 h-8" />
            <span>{lesson.points} XP</span>
          </div>
          <Button onClick={() => router.push('/learn')} size="lg" className="w-full">
            Продолжить
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="p-4">
        <Progress value={progressPercentage} className="w-full" />
      </div>

      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold">{currentTask.question}</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speak(currentTask.question)}
                    aria-label="Прослушать вопрос"
                    className="shrink-0"
                >
                    <Volume2 className="h-6 w-6 text-primary" />
                </Button>
            </div>
            <TaskDisplay task={currentTask} onAnswerChange={setUserAnswer} status={answerStatus} />
          </CardContent>
        </Card>
      </div>
      
      {answerStatus !== 'unanswered' && (
        <div className={`p-4 ${answerStatus === 'correct' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {answerStatus === 'correct' ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                    <p className={`font-bold ${answerStatus === 'correct' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {answerStatus === 'correct' ? 'Правильно!' : 'Неверно.'}
                    </p>
                </div>
                <Button onClick={handleContinue}>Продолжить</Button>
            </div>
        </div>
      )}

      {answerStatus === 'unanswered' && (
        <div className="p-4 border-t">
          <div className="container mx-auto flex justify-end">
            <Button onClick={handleCheckAnswer} disabled={userAnswer === null}>
              Проверить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
