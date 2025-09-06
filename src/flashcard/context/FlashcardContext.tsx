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
import {
  getAllFlashcards,
  getAllMissedFlashcards,
  saveAllFlashcards,
  saveAllMissedFlashcards,
} from "../../utils/flashcards";

type FlashcardsById = {
  [id: string]: Flashcard;
};

type MissedFlashcardsById = {
  [id: string]: boolean;
};

type FlashcardContextType = {
  flashcards: Flashcard[];
  flashcardsById: FlashcardsById;
  setFlashcards: (value: Flashcard[]) => void;
  addFlashcard: (value: Flashcard) => void;
  deleteFlashcardById: (id: string) => void;
  // Missed
  missedFlashcards: string[];
  missedFlashcardsById: MissedFlashcardsById;
  addMissedFlashcardById: (id: string) => void;
  deleteMissedFlashcardById: (id: string) => void;
};

const FlashcardContext = createContext<FlashcardContextType | undefined>(
  undefined
);

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsById, setFlashcardsById] = useState<FlashcardsById>({});
  const [missedFlashcards, setMissedFlashcards] = useState<string[]>([]);
  const [missedFlashcardsById, setMissedFlashcardsById] =
    useState<MissedFlashcardsById>({});

  const onSetFlashcards = useCallback((newFlashcards: Flashcard[]) => {
    newFlashcards.sort((f1, f2) => {
      if (!f1.frame) return -1;

      if (!f2.frame) return 1;

      return f1.frame < f2.frame ? -1 : 1;
    });

    // Set them in the state
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

  const addFlashcard = useCallback(
    (flashcard: Flashcard) => {
      const isEdit = !!flashcardsById[flashcard.id];

      let newFlashcards: Flashcard[];
      if (isEdit) {
        newFlashcards = flashcards.map((f) => {
          if (f.id !== flashcard.id) {
            return f;
          }

          return flashcard;
        });
      } else {
        newFlashcards = [...flashcards, flashcard];
      }

      onSetFlashcards(newFlashcards);
    },
    [flashcards, flashcardsById, onSetFlashcards]
  );

  const onSetMissedFlashcards = useCallback((newMissedFlashcards: string[]) => {
    const cleanList = [...new Set(newMissedFlashcards)];
    // Set them in the state
    setMissedFlashcards(cleanList);

    // Set them in the dictionary
    const byId: MissedFlashcardsById = {};
    cleanList.forEach((id) => {
      byId[id] = true;
    });
    setMissedFlashcardsById(byId);

    // Save them in storage
    saveAllMissedFlashcards(cleanList);
  }, []);

  const deleteFlashcardById = useCallback(
    (id: string) => {
      onSetFlashcards(flashcards.filter((f) => f.id !== id));
    },
    [onSetFlashcards, flashcards]
  );

  const addMissedFlashcardById = useCallback(
    (id: string) => {
      onSetMissedFlashcards([...missedFlashcards, id]);
    },
    [onSetMissedFlashcards, missedFlashcards]
  );

  const deleteMissedFlashcardById = useCallback(
    (id: string) => {
      onSetMissedFlashcards(missedFlashcards.filter((mId) => mId !== id));
    },
    [onSetMissedFlashcards, missedFlashcards]
  );

  const loadData = useCallback(async () => {
    onSetFlashcards(await getAllFlashcards());
    onSetMissedFlashcards(await getAllMissedFlashcards());
  }, [onSetFlashcards, onSetMissedFlashcards]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <FlashcardContext.Provider
      value={{
        flashcards,
        flashcardsById,
        setFlashcards: onSetFlashcards,
        addFlashcard,
        deleteFlashcardById,
        missedFlashcards,
        missedFlashcardsById,
        addMissedFlashcardById,
        deleteMissedFlashcardById,
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
