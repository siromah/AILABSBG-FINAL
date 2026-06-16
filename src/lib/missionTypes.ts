export type QuizOption = 'A' | 'B' | 'C' | 'D';

export type QuizQuestion = {
  id: string;
  question: string;
  options: Record<QuizOption, string>;
  correctAnswer: QuizOption;
  explanation: string;
  whyItMatters?: string;
  xpReward: number;
};

export type PracticalTask = {
  title: string;
  instructions: string;
  placeholder: string;
  exampleAnswer: string;
};

export type Mission = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  duration: string;
  goal: string;
  shortLesson: string;
  badExample?: string;
  goodExample?: string;
  quiz: QuizQuestion[];
  practicalTask: PracticalTask;
  recap: string[];
  xpReward: number;
  order: number;
};

export type LearningModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  missions: Mission[];
};
