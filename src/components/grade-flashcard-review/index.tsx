/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { FlashcardMetadata } from "../../types";
import { useFlashcards } from "../../flashcard/context/FlashcardContext";
import { updateSRS } from "../../utils/srs";

import "./styles.scss";

interface PropTypes {
  metadata: FlashcardMetadata;
  postGradeAction: () => void;
}

const GradeFlashcardReview = ({ metadata, postGradeAction }: PropTypes) => {
  const { addFlashcardMetadata } = useFlashcards();

  const onGradeFlashcard = useCallback(
    (event: any, grade: 0 | 1 | 2 | 3) => {
      event.preventDefault();
      event.stopPropagation();

      addFlashcardMetadata(updateSRS(metadata, grade));

      postGradeAction();
    },
    [addFlashcardMetadata, metadata, postGradeAction]
  );

  return (
    <div className="grade-flashcard-review">
      <button onClick={(e) => onGradeFlashcard(e, 0)}>🤬</button>
      <button onClick={(e) => onGradeFlashcard(e, 1)}>👎</button>
      <button onClick={(e) => onGradeFlashcard(e, 2)}>👍</button>
      <button onClick={(e) => onGradeFlashcard(e, 3)}>😎</button>
    </div>
  );
};

export default GradeFlashcardReview;
