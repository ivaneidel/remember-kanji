import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useFlashcards } from "../context/FlashcardContext";
import { Flashcard } from "../../types";

import "./styles.scss";

interface PropTypes {
  paramFlashcard?: Flashcard;
  startFlipped?: boolean;
}

const FlashcardView = ({ paramFlashcard, startFlipped }: PropTypes) => {
  const params = useParams();
  const { flashcardsById } = useFlashcards();

  const [flipped, setFlipped] = useState(!!startFlipped);

  const flashcard = useMemo(() => {
    if (paramFlashcard) return paramFlashcard;

    if (!params.flashcardId) return null;

    return flashcardsById[params.flashcardId];
  }, [paramFlashcard, params.flashcardId, flashcardsById]);

  if (!flashcard) return null;

  return (
    <div
      className={`flashcard-view ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
    >
      <div className="front">
        <img src={flashcard.image} />
        <span className="frame">{flashcard.frame || "*"}</span>
      </div>
      <div className="back">
        <span className="key-word">{flashcard.keyWord.toUpperCase()}</span>
        {flashcard.help && <span className="help">{flashcard.help}</span>}
      </div>
    </div>
  );
};

export default FlashcardView;
