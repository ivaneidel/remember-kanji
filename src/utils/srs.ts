import { FlashcardMetadata } from "../types";
import { GradeType } from "./stats";

export const getDefaultMetadata = (id: string): FlashcardMetadata => {
  return {
    id,
    lastReviewed: 0,
    interval: 0,
    ease: 2.5,
    due: Date.now(), // or 0 if you want to delay first review
  };
};

/**
 * Updates FlashcardMetadata using the SM-2 algorithm.
 * @param metadata The current metadata for the flashcard.
 * @param grade 0 = Again, 1 = Hard, 2 = Good, 3 = Easy.
 * @returns Updated FlashcardMetadata.
 */
export const updateSRS = (
  metadata: FlashcardMetadata,
  grade: GradeType
): FlashcardMetadata => {
  const now = Date.now();
  let { interval, ease } = metadata;

  // Minimum ease factor
  const MIN_EASE = 1.3;

  // First review
  if (interval === 0) {
    if (grade === GradeType.Hit) interval = 4;
    else if (grade === GradeType.Easy) interval = 1;
    else interval = 0.5; // Try again soon
  } else {
    if (grade === GradeType.Hit) {
      interval = interval * ease;
      ease += 0.15;
    } else if (grade === GradeType.Easy) {
      interval = interval * (ease - 0.15);
      // ease unchanged
    } else if (grade === GradeType.Hard) {
      interval = Math.max(1, interval * 0.5);
      ease -= 0.2;
    } else {
      // grade === 0, failed
      interval = 0.5;
      ease -= 0.3;
    }
  }

  // Clamp ease to minimum
  if (ease < MIN_EASE) ease = MIN_EASE;

  // Clamp interval to minimum (12 hours)
  if (interval < 0.5) interval = 0.5;

  return {
    ...metadata,
    lastReviewed: now,
    interval,
    ease,
    due: now + interval * 24 * 60 * 60 * 1000, // interval in days
  };
};
