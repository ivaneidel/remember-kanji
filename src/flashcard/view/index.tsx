/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX, useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFlashcards } from "../context/FlashcardContext";
import { Flashcard } from "../../types";

import "./styles.scss";

interface PropTypes {
  paramFlashcard?: Flashcard;
  startFlipped?: boolean;
  extraContentFront?: JSX.Element;
  extraContentBack?: JSX.Element;
  hideMarkForReview?: boolean;
}

const FlashcardView = ({
  paramFlashcard,
  startFlipped,
  extraContentFront,
  extraContentBack,
  hideMarkForReview,
}: PropTypes) => {
  const navigate = useNavigate();
  const params = useParams();

  const { flashcardsById, missedFlashcardsById, addMissedFlashcardById } =
    useFlashcards();

  const [flipped, setFlipped] = useState(!!startFlipped);

  const flashcard = useMemo(() => {
    if (paramFlashcard) return paramFlashcard;

    if (!params.flashcardId) return null;

    return flashcardsById[params.flashcardId];
  }, [paramFlashcard, params.flashcardId, flashcardsById]);

  const help = useMemo(() => {
    if (!flashcard?.help) return null;

    const chunks = flashcard.help.trim().split(" ");

    return chunks.map((s, index) => {
      const isLowerCase = s.toLowerCase() === s;
      const isFirstWord = index === 0;
      const isAfterDot = chunks[index - 1] && chunks[index - 1].endsWith(".");

      if (isLowerCase || isFirstWord || isAfterDot) return <span>{s}</span>;

      const isPrimitiveUse = s.startsWith("[") || s.endsWith("]");

      if (isPrimitiveUse) return <span className="primitive-use">{s}</span>;

      return <span className="primitive">{s}</span>;
    });
  }, [flashcard]);

  const onMarkForReview = useCallback(
    (event: any, flashcardId: string) => {
      event.preventDefault();
      event.stopPropagation();
      if (missedFlashcardsById[flashcardId]) return;

      addMissedFlashcardById(flashcardId);
      navigate(-1);
    },
    [missedFlashcardsById, addMissedFlashcardById, navigate]
  );

  if (!flashcard) return null;

  return (
    <div
      className={`flashcard-view ${flipped ? "flipped" : ""} ${
        flashcard.primitive ? "primitive" : ""
      }`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="front">
        <img src={flashcard.image} />
        <span className="frame">{flashcard.frame || "*"}</span>
        {extraContentFront}
        {!extraContentFront && !hideMarkForReview && (
          <div className="mark-for-review">
            <button
              disabled={missedFlashcardsById[flashcard.id]}
              className="button review"
              onClick={(e) => onMarkForReview(e, flashcard.id)}
            >
              📖
            </button>
          </div>
        )}
      </div>
      <div className="back">
        <span className="key-word">{flashcard.keyWord.toUpperCase()}</span>
        {help && <div className="help">{...help}</div>}
        {extraContentBack}
      </div>
    </div>
  );
};

export default FlashcardView;
