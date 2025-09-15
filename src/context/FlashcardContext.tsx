/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Flashcard, FlashcardMetadata } from "../types";
import {
  getAllFlashcards,
  getAllFlashcardsMetadata,
  saveAllFlashcards,
  saveAllFlashcardsMetadata,
} from "../utils/db";
import { getDefaultMetadata } from "../utils/srs";

type FlashcardsById = {
  [id: string]: Flashcard;
};

type FlashcardsMetadataById = {
  [id: string]: FlashcardMetadata;
};

type ContextType = {
  flashcards: Flashcard[];
  flashcardsById: FlashcardsById;
  setFlashcards: (value: Flashcard[]) => void;
  addFlashcard: (value: Flashcard) => void;
  deleteFlashcardById: (id: string) => void;
  // Metadata
  flashcardsMetadata: FlashcardMetadata[];
  flashcardsMetadataById: FlashcardsMetadataById;
  addFlashcardMetadata: (id: FlashcardMetadata) => void;
  deleteFlashcardMetadataById: (id: string) => void;
};

const FlashcardContext = createContext<ContextType | undefined>(
  undefined
);

export const FlashcardProvider = ({ children }: { children: ReactNode }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardsById, setFlashcardsById] = useState<FlashcardsById>({});
  const [flashcardsMetadata, setFlashcardsMetadata] = useState<
    FlashcardMetadata[]
  >([]);
  const [flashcardsMetadataById, setFlashcardsMetadataById] =
    useState<FlashcardsMetadataById>({});

  const onSetFlashcardsMetadata = useCallback(
    (newFlashcardsMetadata: FlashcardMetadata[]) => {
      // Set them in the state
      setFlashcardsMetadata(newFlashcardsMetadata);

      // Set them in the dictionary
      const byId: FlashcardsMetadataById = {};
      newFlashcardsMetadata.forEach((metadata) => {
        byId[metadata.id] = metadata;
      });
      setFlashcardsMetadataById(byId);

      // Save them in storage
      saveAllFlashcardsMetadata(newFlashcardsMetadata);
    },
    []
  );

  const addFlashcardMetadata = useCallback(
    (metadata: FlashcardMetadata) => {
      const isEdit = !!flashcardsMetadataById[metadata.id];

      let newFlashcards: FlashcardMetadata[];
      if (isEdit) {
        newFlashcards = flashcardsMetadata.map((f) => {
          if (f.id !== metadata.id) {
            return f;
          }

          return metadata;
        });
      } else {
        newFlashcards = [...flashcardsMetadata, metadata];
      }

      onSetFlashcardsMetadata(newFlashcards);
    },
    [flashcardsMetadata, flashcardsMetadataById, onSetFlashcardsMetadata]
  );

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
        addFlashcardMetadata(getDefaultMetadata(flashcard.id));
      }

      onSetFlashcards(newFlashcards);
    },
    [flashcards, flashcardsById, onSetFlashcards, addFlashcardMetadata]
  );

  const deleteFlashcardById = useCallback(
    (id: string) => {
      onSetFlashcards(flashcards.filter((f) => f.id !== id));
    },
    [onSetFlashcards, flashcards]
  );

  const deleteFlashcardMetadataById = useCallback(
    (id: string) => {
      onSetFlashcardsMetadata(flashcardsMetadata.filter((m) => m.id !== id));
    },
    [onSetFlashcardsMetadata, flashcardsMetadata]
  );

  const loadData = useCallback(async () => {
    const _flashcards = await getAllFlashcards();
    const _flashcardsMetadata = await getAllFlashcardsMetadata();
    const _metadataIds = new Set(_flashcardsMetadata.map((m) => m.id));
    _flashcards.forEach((f) => {
      if (!_metadataIds.has(f.id)) {
        _flashcardsMetadata.push(getDefaultMetadata(f.id));
      }
    });
    onSetFlashcards(_flashcards);
    onSetFlashcardsMetadata(_flashcardsMetadata);
  }, [onSetFlashcards, onSetFlashcardsMetadata]);

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
        // Metadata
        flashcardsMetadata,
        flashcardsMetadataById,
        addFlashcardMetadata,
        deleteFlashcardMetadataById,
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
