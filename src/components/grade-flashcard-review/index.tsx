/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { FlashcardMetadata } from "../../types";
import { useFlashcards } from "../../context/FlashcardContext";
import { updateSRS } from "../../utils/srs";
import {
  GradeType,
  StatsActionType,
  updateTodayStats,
} from "../../utils/stats";

import "./styles.scss";
import { useDailyStats } from "../../context/StatsContext";

interface PropTypes {
  metadata: FlashcardMetadata;
  postGradeAction: () => void;
}

const GradeFlashcardReview = ({ metadata, postGradeAction }: PropTypes) => {
  const { addFlashcardMetadata } = useFlashcards();
  const { addDailyStats, dailyStatsByDate, increaseStreak } = useDailyStats();

  const onGradeFlashcard = useCallback(
    (event: any, grade: GradeType) => {
      event.preventDefault();
      event.stopPropagation();

      addFlashcardMetadata(updateSRS(metadata, grade));

      const stats = updateTodayStats(dailyStatsByDate, {
        type: StatsActionType.Review,
        grade,
      });

      addDailyStats(stats);

      increaseStreak();

      postGradeAction();
    },
    [
      addFlashcardMetadata,
      metadata,
      postGradeAction,
      addDailyStats,
      dailyStatsByDate,
      increaseStreak,
    ]
  );

  return (
    <div className="grade-flashcard-review">
      <button onClick={(e) => onGradeFlashcard(e, GradeType.Miss)}>🤬</button>
      <button onClick={(e) => onGradeFlashcard(e, GradeType.Hard)}>👎</button>
      <button onClick={(e) => onGradeFlashcard(e, GradeType.Easy)}>👍</button>
      <button onClick={(e) => onGradeFlashcard(e, GradeType.Hit)}>😎</button>
    </div>
  );
};

export default GradeFlashcardReview;
