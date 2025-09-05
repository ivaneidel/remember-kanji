/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Flashcard } from "../../types";
import { useFlashcards } from "../../flashcard/context/FlashcardContext";
import { shuffle } from "lodash";
import FlashcardView from "../../flashcard/view";
import { useNavigate, useParams } from "react-router";

import "./styles.scss";

const ReviewFlashcards = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    flashcards,
    missedFlashcardsById,
    addMissedFlashcardById,
    deleteMissedFlashcardById,
  } = useFlashcards();

  const [flashcardsToReview, setFlashcardsToReview] = useState<Flashcard[]>([]);
  const [active, setActive] = useState(0);
  const [reachEnd, setReachEnd] = useState(false);

  const reviewPercentage = useMemo(() => {
    const divider = flashcardsToReview.length - 1;

    if (divider < 1) return 100;

    return (active * 100) / divider;
  }, [active, flashcardsToReview]);

  const onBackwards = useCallback(() => {
    if (active > 0) {
      setActive(active - 1);
    }
  }, [active, setActive]);

  const onForward = useCallback(() => {
    if (active < flashcardsToReview.length - 1) {
      setActive(active + 1);
      return;
    }

    setReachEnd(true);
  }, [active, setActive, flashcardsToReview, setReachEnd]);

  const onFlashcardMiss = useCallback(
    (event: any, flashcardId: string) => {
      event.preventDefault();
      event.stopPropagation();
      addMissedFlashcardById(flashcardId);
      onForward();
    },
    [addMissedFlashcardById, onForward]
  );

  const onFlashcardHit = useCallback(
    (event: any, flashcardId: string) => {
      event.preventDefault();
      event.stopPropagation();
      deleteMissedFlashcardById(flashcardId);
      onForward();
    },
    [deleteMissedFlashcardById, onForward]
  );

  useEffect(() => {
    const shuffled = shuffle(flashcards);
    if (params.reviewSize) {
      if (params.reviewSize === "onlyMissed") {
        setFlashcardsToReview(
          flashcards.filter((f) => !!missedFlashcardsById[f.id])
        );
      } else {
        setFlashcardsToReview(shuffled.slice(0, Number(params.reviewSize)));
      }
    } else {
      setFlashcardsToReview(shuffled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="review">
      <div className="review-completion-percentage">
        <div className="bar" style={{ width: `${reviewPercentage}%` }} />
      </div>
      {!reachEnd && (
        <>
          {flashcardsToReview.map((flashcard, index) => {
            if (index !== active) return null;

            return (
              <FlashcardView
                startFlipped
                paramFlashcard={flashcard}
                key={flashcard.id}
                extraContentFront={
                  <div className="hit-miss-buttons">
                    <div
                      className="button miss"
                      onClick={(e) => onFlashcardMiss(e, flashcard.id)}
                    >
                      👎
                    </div>
                    <div
                      className="button hit"
                      onClick={(e) => onFlashcardHit(e, flashcard.id)}
                    >
                      👍
                    </div>
                  </div>
                }
              />
            );
          })}
          <div className="buttons-section">
            <button className="button previous" onClick={onBackwards}>
              ⬅️
            </button>
            <button className="button next" onClick={onForward}>
              ➡️
            </button>
          </div>
        </>
      )}
      {reachEnd && (
        <div className="reach-end">
          <span>Congrats, you finished your review 🥳!!</span>
          <button onClick={() => navigate("/", { replace: true })}>
            CONTINUE
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewFlashcards;
