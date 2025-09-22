/* eslint-disable @typescript-eslint/no-explicit-any */
import { RowComponentProps } from "react-window";
import { Flashcard } from "../../types";
import { useNavigate } from "react-router";
import { useFlashcards } from "../../context/FlashcardContext";
import { useCallback, useMemo } from "react";
import { getDueProximity } from "../../utils/review";
import classNames from "classnames";

import "./styles.scss";

const FlashcardTile = ({
  index,
  flashcards,
  style,
}: RowComponentProps<{
  flashcards: Flashcard[];
}>) => {
  const navigate = useNavigate();
  const { deleteFlashcardById, flashcardsMetadataById } = useFlashcards();

  const flashcard = flashcards[index];

  const metadata = useMemo(
    () => (flashcard?.id ? flashcardsMetadataById[flashcard.id] : undefined),
    [flashcard, flashcardsMetadataById]
  );

  const dueProximity = useMemo(
    () => getDueProximity(metadata?.due || 0),
    [metadata]
  );

  const editFlashcard = useCallback(
    (event: any, flashcard: Flashcard) => {
      event.preventDefault();
      event.stopPropagation();

      navigate(`/flashcards/${flashcard.id}/edit`);
    },
    [navigate]
  );

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
      className={classNames("flashcard-tile", `due-${dueProximity}`, {
        primitive: flashcard.primitive,
      })}
      key={flashcard.id}
      onClick={() => {
        navigate(`/flashcards/${flashcard.id}`);
      }}
    >
      <span className="frame">{flashcard.frame || "*"}</span>
      <span className="key-word">{flashcard.keyWord.toUpperCase()}</span>
      <button onClick={(e) => editFlashcard(e, flashcard)}>🖋️</button>
      <button onClick={(e) => deleteFlashcard(e, flashcard)}>🗑️</button>
    </div>
  );
};

export default FlashcardTile;
