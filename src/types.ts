export interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  progress: number;
  lessonsCount: number;
  completedLessons: number;
  description: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Recommendation {
  title: string;
  reason: string;
  difficulty: string;
  estimatedHours: string;
  chaptersCount: number;
}

export interface StudentStats {
  active: number;
  done: number;
  streak: number;
  score: number;
  weeklyHours: number[]; // Mon-Sun study hours
}

export interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
}
