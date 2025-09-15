import { useCallback, useEffect, useMemo, useState } from "react";

import { Flashcard } from "../../types";
import { useNavigate, useParams } from "react-router";
import { useFlashcards } from "../../context/FlashcardContext";

import "./styles.scss";

const EditFlashcard = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { flashcardsById, addFlashcard } = useFlashcards();

  const [flashcard, setFlashcard] = useState<Flashcard>();
  const [frame, setFrame] = useState("");
  const [keyWord, setKeyWord] = useState("");
  const [help, setHelp] = useState("");
  const [primitive, setPrimitive] = useState(false);

  const saveDisabled = useMemo(() => !keyWord, [keyWord]);

  const onSave = useCallback(() => {
    if (!flashcard || !keyWord) return;

    const newFlashcard: Flashcard = {
      ...flashcard,
      frame: Number(frame.trim()),
      keyWord,
      help,
      primitive,
    };

    addFlashcard(newFlashcard);

    navigate(-1);
  }, [frame, keyWord, help, primitive, navigate, flashcard, addFlashcard]);

  useEffect(() => {
    if (params.flashcardId) {
      const _flashcard = flashcardsById[params.flashcardId];
      if (_flashcard) {
        setFlashcard(_flashcard);
        setFrame(`${_flashcard.frame || ""}`);
        setKeyWord(_flashcard.keyWord);
        setHelp(_flashcard.help || "");
        setPrimitive(_flashcard.primitive);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!flashcard) return null;

  return (
    <div className="edit-flashcard-container">
      <h2>Edit Flashcard</h2>
      <input
        type="number"
        value={frame}
        onChange={(e) => setFrame(e.target.value)}
        placeholder="Frame [*]"
      />
      <input
        type="text"
        value={keyWord}
        onChange={(e) => setKeyWord(e.target.value)}
        placeholder="Key Word"
      />
      <input
        type="text"
        value={help}
        onChange={(e) => setHelp(e.target.value)}
        placeholder="Help"
      />
      <div className="primitive" onClick={() => setPrimitive(!primitive)}>
        <label htmlFor="primitive">Primitive</label>
        <input type="checkbox" name="primitive" checked={primitive} readOnly />
      </div>
      <img src={flashcard.image} />
      <button className="save-button" disabled={saveDisabled} onClick={onSave}>
        Save
      </button>
    </div>
  );
};

export default EditFlashcard;
