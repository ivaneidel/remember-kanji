import { useState } from "react";
import { useNavigate } from "react-router";
import { useFlashcards } from "../../flashcard/context/FlashcardContext";

import "./styles.scss";

const lessonSize = 15;

const lessonSizes = [
  lessonSize * 1,
  lessonSize * 2,
  lessonSize * 3,
  lessonSize * 4,
];

const ConfigReview = () => {
  const navigate = useNavigate();
  const { flashcards, missedFlashcards } = useFlashcards();
  const [reviewSize, setReviewSize] = useState(
    flashcards.length >= lessonSize ? lessonSizes[0] : flashcards.length
  );

  return (
    <div className="config-review">
      <div className="title">
        <span>Configure the review</span>
      </div>
      {flashcards.length >= lessonSize && (
        <div className="range">
          <input
            type="range"
            value={reviewSize}
            onChange={(e) => setReviewSize(Number(e.target.value))}
            min={lessonSizes[0]}
            max={lessonSizes[lessonSizes.length - 1]}
            step={lessonSize}
          />
          <span>{reviewSize}</span>
        </div>
      )}
      <button
        className="start-button"
        onClick={() => navigate(`/review/${reviewSize}`, { replace: true })}
      >
        START
      </button>
      <div className="divider" />
      <button
        className="start-button"
        disabled={missedFlashcards.length === 0}
        onClick={() => navigate(`/review/onlyMissed`, { replace: true })}
      >
        REVIEW ONLY MISSED ({missedFlashcards.length})
      </button>
    </div>
  );
};

export default ConfigReview;
