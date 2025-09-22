import { Flashcard } from "../types";
import { dateToIsoWithTimezone } from "./date";
import { getAllFlashcards } from "./db";

/**
 * Mutates array
 */
export const defaultFlashcardSort = (flashcards: Flashcard[]) =>
  flashcards.sort((f1, f2) => {
    if (!f1.frame) return -1;

    if (!f2.frame) return 1;

    return f1.frame < f2.frame ? -1 : 1;
  });

export const exportFlashcards = async () => {
  const date = dateToIsoWithTimezone(new Date())
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
