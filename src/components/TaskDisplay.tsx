'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Volume2 } from 'lucide-react';
import { speak } from '@/lib/tts';

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

interface TaskDisplayProps {
  task: Task;
  onAnswerChange: (answer: any) => void;
  status: AnswerStatus;
}

const getButtonClass = (isSelected: boolean, status: AnswerStatus, isCorrect: boolean) => {
    if (status === 'unanswered') return isSelected ? 'bg-accent text-accent-foreground' : 'bg-secondary';
    if (isSelected) {
        return isCorrect ? 'bg-green-500 hover:bg-green-500 text-white' : 'bg-red-500 hover:bg-red-500 text-white';
    }
    if (status !== 'unanswered' && isCorrect) return 'bg-green-500 hover:bg-green-500 text-white';
    return 'bg-secondary hover:bg-muted';
}

const MultipleChoice = ({ task, onAnswerChange, status }: TaskDisplayProps & { task: Task & { type: 'MULTIPLE_CHOICE' | 'ODD_ONE_OUT' | 'DIALOGUE_COMPLETION' } }) => {
  const [selected, setSelected] = useState<string | null>(null);
  
  const handleClick = (option: string) => {
    if (status !== 'unanswered') return;
    setSelected(option);
    onAnswerChange(option);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {task.options.map((option) => (
        <div key={option} className="flex items-center gap-2">
            <Button
                variant="outline"
                className={cn("h-auto p-4 flex-grow justify-start text-left whitespace-normal", getButtonClass(selected === option, status, option === task.correctAnswer))}
                onClick={() => handleClick(option)}
            >
            {option}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    speak(option);
                }}
                aria-label={`Прослушать: ${option}`}
                className="shrink-0"
            >
                <Volume2 className="h-6 w-6 text-primary" />
            </Button>
        </div>
      ))}
    </div>
  );
};

const TrueFalse = ({ task, onAnswerChange, status }: TaskDisplayProps & { task: Task & { type: 'TRUE_FALSE' } }) => {
    const [selected, setSelected] = useState<boolean | null>(null);

    const handleClick = (value: boolean) => {
        if (status !== 'unanswered') return;
        setSelected(value);
        onAnswerChange(value);
    }
    
    return (
        <div className="flex gap-4">
             <Button
                variant="outline"
                className={cn("h-auto p-4 flex-1 text-base md:text-lg", getButtonClass(selected === true, status, task.correctAnswer === true))}
                onClick={() => handleClick(true)}
            >
              Верно
            </Button>
            <Button
                variant="outline"
                className={cn("h-auto p-4 flex-1 text-base md:text-lg", getButtonClass(selected === false, status, task.correctAnswer === false))}
                onClick={() => handleClick(false)}
            >
              Неверно
            </Button>
        </div>
    );
}

const SentenceBuilder = ({ task, onAnswerChange, status }: TaskDisplayProps & { task: Task & { type: 'SENTENCE_BUILDER' } }) => {
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [wordBank, setWordBank] = useState<string[]>(task.words);

  useEffect(() => {
    onAnswerChange(builtSentence.join(' '));
  }, [builtSentence, onAnswerChange]);
  
  const addWord = (word: string) => {
    if (status !== 'unanswered') return;
    setBuiltSentence([...builtSentence, word]);
    setWordBank(wordBank.filter(w => w !== word));
  }
  
  const removeWord = (word: string, index: number) => {
    if (status !== 'unanswered') return;
    const newSentence = [...builtSentence];
    newSentence.splice(index, 1);
    setBuiltSentence(newSentence);
    setWordBank([...wordBank, word]);
  }

  return (
    <div className='space-y-8'>
        <div className='min-h-[6rem] border-b-2 p-4 flex flex-wrap gap-2 items-center'>
            {builtSentence.map((word, index) => (
                <div key={`${word}-${index}`} className="flex items-center gap-1">
                    <Button variant="outline" onClick={() => removeWord(word, index)} className="h-auto whitespace-normal text-base md:text-lg p-2">{word}</Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            speak(word);
                        }}
                        aria-label={`Прослушать: ${word}`}
                        className="shrink-0 h-9 w-9"
                    >
                        <Volume2 className="h-5 w-5 text-primary" />
                    </Button>
                </div>
            ))}
        </div>
        <div className='flex flex-wrap gap-2 justify-center'>
            {wordBank.map(word => (
                 <div key={word} className="flex items-center gap-1">
                    <Button variant="secondary" onClick={() => addWord(word)} className="h-auto whitespace-normal text-base md:text-lg p-2">{word}</Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            speak(word);
                        }}
                        aria-label={`Прослушать: ${word}`}
                        className="shrink-0 h-9 w-9"
                    >
                        <Volume2 className="h-5 w-5 text-primary" />
                    </Button>
                </div>
            ))}
        </div>
    </div>
  );
}

const MatchPairs = ({ task, onAnswerChange, status }: TaskDisplayProps & { task: Task & { type: 'MATCH_PAIRS' } }) => {
  const [prompts] = useState(() => task.pairs.map(p => p.prompt).sort(() => Math.random() - 0.5));
  const [answers] = useState(() => task.pairs.map(p => p.answer).sort(() => Math.random() - 0.5));
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  useEffect(() => {
      onAnswerChange(matchedPairs);
  }, [matchedPairs, onAnswerChange]);

  const handlePromptClick = (prompt: string) => {
      if (status !== 'unanswered' && !matchedPairs.some(p => p.startsWith(prompt))) {
          setSelectedPrompt(prompt);
      }
  }

  const handleAnswerClick = (answer: string) => {
      if (status !== 'unanswered' && selectedPrompt && !matchedPairs.some(p => p.endsWith(answer))) {
          const newPair = `${selectedPrompt}-${answer}`;
          setMatchedPairs([...matchedPairs, newPair]);
          setSelectedPrompt(null);
      }
  }
  
  const isMatched = (item: string, type: 'prompt'|'answer') => {
      return matchedPairs.some(p => type === 'prompt' ? p.startsWith(item) : p.endsWith(item));
  }

  const getPairStatus = (pairString: string) => {
    if (status === 'unanswered') return 'unanswered';
    return task.pairs.some(p => `${p.prompt}-${p.answer}` === pairString) ? 'correct' : 'incorrect';
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8'>
        <div className='space-y-2'>
            {prompts.map(prompt => (
                <div key={prompt} className="flex items-center gap-2">
                    <Button
                        key={prompt}
                        variant={isMatched(prompt, 'prompt') ? (getPairStatus(matchedPairs.find(p=>p.startsWith(prompt))!) === 'correct' ? 'default': 'destructive') : (selectedPrompt === prompt ? 'outline' : 'secondary')}
                        onClick={() => handlePromptClick(prompt)}
                        disabled={status !== 'unanswered' && isMatched(prompt, 'prompt')}
                        className={cn('w-full justify-center h-auto whitespace-normal p-3', {'ring-2 ring-primary': selectedPrompt === prompt})}
                    >{prompt}</Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); speak(prompt, 'ru-RU'); }}
                        aria-label={`Прослушать: ${prompt}`}
                        className="shrink-0"
                    >
                        <Volume2 className="h-5 w-5 text-primary" />
                    </Button>
                </div>
            ))}
        </div>
        <div className='space-y-2'>
            {answers.map(answer => (
                <div key={answer} className="flex items-center gap-2">
                    <Button
                        key={answer}
                        variant={isMatched(answer, 'answer') ? (getPairStatus(matchedPairs.find(p=>p.endsWith(answer))!) === 'correct' ? 'default': 'destructive') : 'secondary'}
                        onClick={() => handleAnswerClick(answer)}
                        disabled={status !== 'unanswered' && (isMatched(answer, 'answer') || !selectedPrompt)}
                        className='w-full justify-center h-auto whitespace-normal p-3'
                    >{answer}</Button>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); speak(answer); }}
                        aria-label={`Прослушать: ${answer}`}
                        className="shrink-0"
                    >
                        <Volume2 className="h-5 w-5 text-primary" />
                    </Button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default function TaskDisplay(props: TaskDisplayProps) {
  switch (props.task.type) {
    case 'MULTIPLE_CHOICE':
    case 'ODD_ONE_OUT':
    case 'DIALOGUE_COMPLETION':
      return <MultipleChoice {...props} task={props.task} />;
    case 'TRUE_FALSE':
      return <TrueFalse {...props} task={props.task} />;
    case 'SENTENCE_BUILDER':
        return <SentenceBuilder {...props} task={props.task} />
    case 'MATCH_PAIRS':
        return <MatchPairs {...props} task={props.task} />
    default:
      return <div>Тип задания не поддерживается.</div>;
  }
}
