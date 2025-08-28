import { useNavigate } from "react-router";
import AddNewFlashcardButton from "../components/add-new-flashcard-button";
import { useFlashcards } from "./context/FlashcardContext";

import "./styles.scss";
import { useCallback } from "react";
import { Flashcard } from "../types";

const Flashcards = () => {
  const navigate = useNavigate();
  const { flashcards, setFlashcards } = useFlashcards();

  const deleteFlashcard = useCallback(
    (flashcard: Flashcard) => {
      const newFlashcards = [
        ...flashcards.filter((f) => f.id !== flashcard.id),
      ];
      setFlashcards(newFlashcards);
    },
    [flashcards, setFlashcards]
  );

  return (
    <div className="flashcard-list">
      {!flashcards.length && (
        <div className="no-flashcards">
          <span>No flashcards yet... Create a new one!</span>
        </div>
      )}
      {flashcards.map((flashcard) => (
        <div
          className="flashcard-tile"
          key={flashcard.keyWord}
          onClick={() => {
            navigate(`/flashcards/${flashcard.id}`);
          }}
        >
          <span className="frame">{flashcard.frame || "*"}</span>
          <span className="key-word">{flashcard.keyWord.toUpperCase()}</span>
          <img src={flashcard.image} />
          <button
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const doDelete = confirm(
                `Do you really want to delete the Flashcard [${flashcard.keyWord.toUpperCase()}]`
              );
              if (!doDelete) return;
              deleteFlashcard(flashcard);
            }}
          >
            🗑️
          </button>
        </div>
      ))}
      <AddNewFlashcardButton />
    </div>
  );
};

export default Flashcards;
