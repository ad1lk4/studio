export type TaskType =
  | 'MULTIPLE_CHOICE'
  | 'SENTENCE_BUILDER'
  | 'TRUE_FALSE'
  | 'ODD_ONE_OUT'
  | 'MATCH_PAIRS'
  | 'DIALOGUE_COMPLETION';

export interface BaseTask {
  id: string;
  type: TaskType;
  question: string;
}

export interface MultipleChoiceTask extends BaseTask {
  type: 'MULTIPLE_CHOICE';
  options: string[];
  correctAnswer: string;
}

export interface SentenceBuilderTask extends BaseTask {
  type: 'SENTENCE_BUILDER';
  words: string[];
  correctAnswer: string;
}

export interface TrueFalseTask extends BaseTask {
  type: 'TRUE_FALSE';
  correctAnswer: boolean;
  explanation?: string;
}

export interface OddOneOutTask extends BaseTask {
  type: 'ODD_ONE_OUT';
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface MatchPairsTask extends BaseTask {
  type: 'MATCH_PAIRS';
  pairs: {
    prompt: string;
    answer: string;
  }[];
}

export interface DialogueCompletionTask extends BaseTask {
  type: 'DIALOGUE_COMPLETION';
  options: string[];
  correctAnswer: string;
}

export type Task =
  | MultipleChoiceTask
  | SentenceBuilderTask
  | TrueFalseTask
  | OddOneOutTask
  | MatchPairsTask
  | DialogueCompletionTask;

export interface Lesson {
  id: string;
  title: string;
  sectionId: string;
  points: number;
  tasks: Task[];
}

export interface Section {
  id: string;
  title: string;
  totalPoints: number;
  lessons: Lesson[];
}
