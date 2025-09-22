import { JSX, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFlashcards } from "../../context/FlashcardContext";
import { Flashcard } from "../../types";
import GradeFlashcardReview from "../../components/grade-flashcard-review";

import "./styles.scss";

const toCleanChunk = (s: string) => s.toLowerCase().replace(/[^a-z-]/gi, "");

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

  const { flashcardsById, flashcardsMetadataById } = useFlashcards();

  const [flipped, setFlipped] = useState(!!startFlipped);

  const flashcard = useMemo(() => {
    if (paramFlashcard) return paramFlashcard;

    if (!params.flashcardId) return null;

    return flashcardsById[params.flashcardId];
  }, [paramFlashcard, params.flashcardId, flashcardsById]);

  const help = useMemo(() => {
    if (!flashcard?.help) return null;

    const chunks = flashcard.help.trim().split(" ");

    const keyChunks = flashcard.keyWord.toLowerCase().trim().split(" ");

    let keyChunkCount = 0;

    return chunks.map((s, index) => {
      let isKeyWord = false;

      if (keyChunkCount === 0 && keyChunks.length > 1) {
        isKeyWord = keyChunks.every(
          (kCh, kI) =>
            chunks[index + kI] && kCh === toCleanChunk(chunks[index + kI])
        );
      } else {
        isKeyWord = keyChunks[keyChunkCount] === toCleanChunk(s);
      }

      keyChunkCount = isKeyWord ? keyChunkCount + 1 : 0;

      const isLowerCase = s.toLowerCase() === s;
      const isFirstWord = index === 0;
      const isAfterDot = chunks[index - 1] && chunks[index - 1].endsWith(".");

      if (isKeyWord) return <span className="is-keyword">{s}</span>;

      if (isLowerCase || isFirstWord || isAfterDot) return <span>{s}</span>;

      const isPrimitiveUse = s.startsWith("[") || s.endsWith("]");

      if (isPrimitiveUse) return <span className="primitive-use">{s}</span>;

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
        {!extraContentFront &&
          !hideMarkForReview &&
          flashcardsMetadataById[flashcard.id] && (
            <GradeFlashcardReview
              metadata={flashcardsMetadataById[flashcard.id]}
              postGradeAction={() => navigate(-1)}
            />
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
