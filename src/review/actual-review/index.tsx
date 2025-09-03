import { useEffect, useMemo, useState } from "react";
import { Flashcard } from "../../types";
import { useFlashcards } from "../../flashcard/context/FlashcardContext";
import { shuffle } from "lodash";
import FlashcardView from "../../flashcard/view";
import { useParams } from "react-router";

import "./styles.scss";

const ReviewFlashcards = () => {
  const params = useParams();
  const { flashcards } = useFlashcards();

  const [flashcardsToReview, setFlashcardsToReview] = useState<Flashcard[]>([]);
  const [active, setActive] = useState(0);

  const reviewPercentage = useMemo(() => {
    const divider = flashcardsToReview.length - 1;

    if (divider < 1) return 100;

    return (active * 100) / divider;
  }, [active, flashcardsToReview]);

  useEffect(() => {
    const shuffled = shuffle(flashcards);
    if (params.reviewSize) {
      setFlashcardsToReview(shuffled.slice(0, Number(params.reviewSize)));
    } else {
      setFlashcardsToReview(shuffled);
    }
  }, [flashcards, params]);

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
