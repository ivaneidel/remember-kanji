import { useEffect, useMemo, useState } from "react";
import { Flashcard } from "../types";
import { useFlashcards } from "../flashcard/context/FlashcardContext";
import { shuffle } from "lodash";
import FlashcardView from "../flashcard/view";

import "./styles.scss";

const ReviewFlashcards = () => {
  const { flashcards } = useFlashcards();

  const [flashcardsToReview, setFlashcardsToReview] = useState<Flashcard[]>([]);
  const [active, setActive] = useState(0);

  const reviewPercentage = useMemo(
    () => (active * 100) / (flashcards.length - 1),
    [active, flashcards]
  );

  useEffect(() => {
    setFlashcardsToReview(shuffle(flashcards));
  }, [flashcards]);

  return (
    <div className="review">
      <div className="review-completion-percentage">
        <div className="bar" style={{ width: `${reviewPercentage}%` }} />
      </div>
      {flashcardsToReview.map((flashcard, index) => {
        if (index !== active) return null;

        return (
          <FlashcardView
            startFlipped
            paramFlashcard={flashcard}
            key={flashcard.id}
          />
        );
      })}
      <div className="buttons-section">
        <button
          className="button previous"
          onClick={() => {
            if (active > 0) {
              setActive(active - 1);
            }
          }}
        >
          ⬅️
        </button>
        <button
          className="button next"
          onClick={() => {
            if (active < flashcardsToReview.length - 1) {
              setActive(active + 1);
            }
          }}
        >
          ➡️
        </button>
      </div>
    </div>
  );
};

export default ReviewFlashcards;
