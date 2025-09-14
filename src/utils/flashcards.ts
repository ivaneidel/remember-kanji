import { openDB } from "idb";
import { Flashcard, FlashcardMetadata } from "../types";

const DB_NAME = "remember_kanji";
const STORE_NAME = "flashcards";
const METADATA_STORE_NAME = "flashcards_metadata";

const getDB = () =>
  openDB(DB_NAME, 3, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(METADATA_STORE_NAME)) {
        db.createObjectStore(METADATA_STORE_NAME, { keyPath: "id" });
      }
    },
  });

export const getAllFlashcards = async () => {
  const db = await getDB();
  return (await db.getAll(STORE_NAME)) as Flashcard[];
};

export const getAllFlashcardsMetadata = async () => {
  const db = await getDB();
  return (await db.getAll(METADATA_STORE_NAME)) as FlashcardMetadata[];
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

export const exportFlashcards = async () => {
  const date = new Date()
    .toISOString()
    .split(".")[0]
    .replaceAll("-", "_")
    .replaceAll("T", "_")
    .replaceAll(":", "_");
  const flashcards = await getAllFlashcards();
  const serialized = JSON.stringify(flashcards);
  const blob = new Blob([serialized], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `flashcards_[${date}].kanji`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importFlashcards = async (file: File) => {
  try {
    const text = await file.text();
    const imported = JSON.parse(text);
    if (Array.isArray(imported)) {
      return imported as Flashcard[];
    }
  } catch {
    // Ignore
  }
};
