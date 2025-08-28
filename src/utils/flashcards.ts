import { openDB } from "idb";
import { Flashcard } from "../types";

const DB_NAME = "remember_kanji";
const STORE_NAME = "flashcards";

const getDB = () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });

export const getAllFlashcards = async () => {
  const db = await getDB();
  return (await db.getAll(STORE_NAME)) as Flashcard[];
};

export const saveAllFlashcards = async (flashcards: Flashcard[]) => {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.objectStore(STORE_NAME).clear();
  for (const flashcard of flashcards) {
    await tx.objectStore(STORE_NAME).put(flashcard);
  }
  await tx.done;
};
