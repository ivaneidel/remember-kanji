import { useCallback, useEffect, useMemo, useState } from "react";
import { Flashcard } from "../../types";
import { useFlashcards } from "../../flashcard/context/FlashcardContext";
import { shuffle } from "lodash";
import FlashcardView from "../../flashcard/view";
import { useNavigate } from "react-router";
import GradeFlashcardReview from "../../components/grade-flashcard-review";

import "./styles.scss";

const ReviewFlashcards = () => {
  const navigate = useNavigate();

  const { flashcards, flashcardsMetadataById } = useFlashcards();

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

  useEffect(() => {
    const shuffled = shuffle(
      flashcards.filter(
        (f) =>
          flashcardsMetadataById[f.id] &&
          flashcardsMetadataById[f.id].due <= Date.now()
      )
    );
    setFlashcardsToReview(shuffled);
    if (shuffled.length === 0) {
      setReachEnd(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  Object.values(flashcardsMetadataById).forEach((m) =>
    console.log(new Date(m.due))
  );

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
                  <GradeFlashcardReview
                    metadata={flashcardsMetadataById[flashcard.id]}
                    postGradeAction={() => onForward()}
                  />
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
