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
