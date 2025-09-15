export type Flashcard = {
  id: string;
  frame?: number;
  keyWord: string;
  help?: string;
  image: string;
  primitive: boolean;
};

export type FlashcardMetadata = {
  id: string;
  lastReviewed: number;
  interval: number;
  ease: number;
  due: number;
};

export type DailyStats = {
  date: string; // YYYY-MM-DD
  newFlashcardsAdded: number;
  reviewed: number;
  hit: number;
  miss: number;
  easy: number;
  hard: number;
  xp: number;
};

export type Streak = {
  days: number;
  lastActiveName: string; // YYYY-MM-DD
};
