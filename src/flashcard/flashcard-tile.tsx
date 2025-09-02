/* eslint-disable @typescript-eslint/no-explicit-any */
import { RowComponentProps } from "react-window";
import { Flashcard } from "../types";
import { useNavigate } from "react-router";
import { useFlashcards } from "./context/FlashcardContext";
import { useCallback } from "react";

const FlashcardTile = ({
  index,
  flashcards,
  style,
}: RowComponentProps<{
  flashcards: Flashcard[];
}>) => {
  const navigate = useNavigate();
  const { deleteFlashcardById } = useFlashcards();

  const flashcard = flashcards[index];

  const deleteFlashcard = useCallback(
    (event: any, flashcard: Flashcard) => {
      event.preventDefault();
      event.stopPropagation();
      const doDelete = confirm(
        `Do you really want to delete the Flashcard [${flashcard.keyWord.toUpperCase()}]`
      );
      if (!doDelete) return;

      deleteFlashcardById(flashcard.id);
    },
    [deleteFlashcardById]
  );

  return (
    <div
      style={style}
      className={`flashcard-tile ${flashcard.primitive ? "primitive" : ""}`}
      key={flashcard.id}
      onClick={() => {
        navigate(`/flashcards/${flashcard.id}`);
      }}
    >
      <span className="frame">{flashcard.frame || "*"}</span>
      <span className="key-word">{flashcard.keyWord.toUpperCase()}</span>
      <button onClick={(e) => deleteFlashcard(e, flashcard)}>🗑️</button>
    </div>
  );
};

export default FlashcardTile;
