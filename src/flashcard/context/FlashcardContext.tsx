/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Flashcard } from "../../types";
import { getAllFlashcards, saveAllFlashcards } from "../../utils/flashcards";

type FlashcardsById = {
  [id: string]: Flashcard;
};

type FlashcardContextType = {
  flashcards: Flashcard[];
  flashcardsById: FlashcardsById;
  setFlashcards: (value: Flashcard[]) => void;
  deleteFlashcardById: (id: string) => void;
};

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined
);

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsById, setFlashcardsById] = useState<FlashcardsById>({});

  const onSetFlashcards = useCallback((newFlashcards: Flashcard[]) => {
    newFlashcards.sort((f1, f2) => {
      if (!f1.frame) return -1;

      if (!f2.frame) return 1;

      return f1.frame < f2.frame ? -1 : 1;
    });

    // Set the in the state
    setFlashcards(newFlashcards);

    // Set them in the dictionary
    const byId: FlashcardsById = {};
    newFlashcards.forEach((flashcard) => {
      byId[flashcard.id] = flashcard;
    });
    setFlashcardsById(byId);

    // Save them in storage
    saveAllFlashcards(newFlashcards);
  }, []);

  const deleteFlashcardById = useCallback(
    (id: string) => {
      onSetFlashcards(flashcards.filter((f) => f.id !== id));
    },
    [onSetFlashcards, flashcards]
  );

  const loadFlashcards = useCallback(async () => {
    onSetFlashcards(await getAllFlashcards());
  }, [onSetFlashcards]);

  useEffect(() => {
    loadFlashcards();
  }, [loadFlashcards]);

  return (
    <FlashcardContext.Provider
      value={{
        flashcards,
        flashcardsById,
        setFlashcards: onSetFlashcards,
        deleteFlashcardById,
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};

export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error("useFlashcards must be used within a FlashcardProvider");
  }
  return context;
};
