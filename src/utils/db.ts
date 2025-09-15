import { openDB } from "idb";
import { DailyStats, Flashcard, FlashcardMetadata, Streak } from "../types";
import { getDefaultStreakValue } from "./streak";
import { dateToIdString, getTodayString } from "./date";

const DB_NAME = "remember_kanji";
const STREAK_STORE_NAME = "streak";
const FLASHCARDS_STORE_NAME = "flashcards";
const METADATA_STORE_NAME = "flashcards_metadata";
const STATS_STORE_NAME = "stats";

const getDB = () =>
  openDB(DB_NAME, 4, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(FLASHCARDS_STORE_NAME)) {
        db.createObjectStore(FLASHCARDS_STORE_NAME, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
        db.createObjectStore(METADATA_STORE_NAME, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(STATS_STORE_NAME)) {
        db.createObjectStore(STATS_STORE_NAME, { keyPath: "date" });
      }
    },
  });

// FLASHCARDS

export const getAllFlashcards = async () => {
  const db = await getDB();
  return (await db.getAll(FLASHCARDS_STORE_NAME)) as Flashcard[];
};

export const saveAllFlashcards = async (flashcards: Flashcard[]) => {
  const db = await getDB();
  const tx = db.transaction(FLASHCARDS_STORE_NAME, "readwrite");
  await tx.objectStore(FLASHCARDS_STORE_NAME).clear();
  for (const flashcard of flashcards) {
    await tx.objectStore(FLASHCARDS_STORE_NAME).put(flashcard);
  }
  await tx.done;
};

// METADATA

export const getAllFlashcardsMetadata = async () => {
  const db = await getDB();
  return (await db.getAll(METADATA_STORE_NAME)) as FlashcardMetadata[];
};

export const saveAllFlashcardsMetadata = async (
  flashcardsMetadata: FlashcardMetadata[]
) => {
  const db = await getDB();
  const tx = db.transaction(METADATA_STORE_NAME, "readwrite");
  await tx.objectStore(METADATA_STORE_NAME).clear();
  for (const metadata of flashcardsMetadata) {
    await tx.objectStore(METADATA_STORE_NAME).put(metadata);
  }
  await tx.done;
};

// STATS

export const getAllStats = async () => {
  const db = await getDB();
  return (await db.getAll(STATS_STORE_NAME)) as DailyStats[];
};

export const saveAllStats = async (stats: DailyStats[]) => {
  const db = await getDB();
  const tx = db.transaction(STATS_STORE_NAME, "readwrite");
  await tx.objectStore(STATS_STORE_NAME).clear();
  for (const stat of stats) {
    await tx.objectStore(STATS_STORE_NAME).put(stat);
  }
  await tx.done;
};

// STREAK

export const getStorageStreak = () => {
  const stored = localStorage.getItem(STREAK_STORE_NAME);
  if (!stored) return getDefaultStreakValue();

  const streak = JSON.parse(stored) as Streak;

  const yesterdayString = dateToIdString(
    new Date(Date.now() - 1000 * 60 * 60 * 24)
  );

  if (
    streak.lastActiveName !== yesterdayString &&
    streak.lastActiveName !== getTodayString()
  ) {
    return getDefaultStreakValue();
  }

  return streak;
};

export const saveStorageStreak = (streak: Streak) => {
  localStorage.setItem(STREAK_STORE_NAME, JSON.stringify(streak));
};
