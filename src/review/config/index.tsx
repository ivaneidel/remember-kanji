import { useState } from "react";
import { useNavigate } from "react-router";
import { useFlashcards } from "../../flashcard/context/FlashcardContext";

import "./styles.scss";

const ConfigReview = () => {
  const navigate = useNavigate();
  const { flashcards } = useFlashcards();
  const [reviewSize, setReviewSize] = useState(
    Math.max(Math.floor(flashcards.length / 2), 1)
  );

  return (
    <div className="config-review">
      <div className="title">
        <span>Configure the review</span>
      </div>
      {flashcards.length > 1 && (
        <div className="range">
          <input
            type="range"
            value={reviewSize}
            onChange={(e) => setReviewSize(Number(e.target.value))}
            min={1}
            max={flashcards.length}
            step={1}
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
    </div>
  );
};

export default ConfigReview;
