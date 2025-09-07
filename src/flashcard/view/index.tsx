import { JSX, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useFlashcards } from "../context/FlashcardContext";
import { Flashcard } from "../../types";

import "./styles.scss";

interface PropTypes {
  paramFlashcard?: Flashcard;
  startFlipped?: boolean;
  extraContentFront?: JSX.Element;
  extraContentBack?: JSX.Element;
}

const FlashcardView = ({
  paramFlashcard,
  startFlipped,
  extraContentFront,
  extraContentBack,
}: PropTypes) => {
  const params = useParams();
  const { flashcardsById } = useFlashcards();

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

      return <span className="primitive">{s}</span>;
    });
  }, [flashcard]);

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
