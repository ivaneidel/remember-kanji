import { useCallback, useMemo, useState } from "react";
import FlashcardCanvas from "./canvas";

import { Flashcard } from "../../types";
import { useNavigate } from "react-router";
import { useFlashcards } from "../../context/FlashcardContext";
import { v4 as uuid } from "uuid";

import "./styles.scss";
import { StatsActionType, updateTodayStats } from "../../utils/stats";
import { useDailyStats } from "../../context/StatsContext";

const NewFlashcard = () => {
  const navigate = useNavigate();
  const { addFlashcard } = useFlashcards();
  const { dailyStatsByDate, addDailyStats, increaseStreak } = useDailyStats();

  const [image, setImage] = useState<string>();
  const [frame, setFrame] = useState("");
  const [keyWord, setKeyWord] = useState("");
  const [help, setHelp] = useState("");
  const [primitive, setPrimitive] = useState(false);

  const saveDisabled = useMemo(() => !image || !keyWord, [image, keyWord]);

  const onSave = useCallback(() => {
    if (!image || !keyWord) return;

    const newFlashcard: Flashcard = {
      id: uuid(),
      image,
      frame: Number(frame.trim()),
      keyWord,
      help,
      primitive,
    };

    addFlashcard(newFlashcard);

    const stats = updateTodayStats(dailyStatsByDate, {
      type: StatsActionType.Add,
    });

    addDailyStats(stats);

    increaseStreak();

    navigate(-1);
  }, [
    image,
    frame,
    keyWord,
    help,
    primitive,
    navigate,
    addFlashcard,
    dailyStatsByDate,
    addDailyStats,
    increaseStreak,
  ]);

  return (
    <div className="new-flashcard-container">
      {!image && <FlashcardCanvas setImage={setImage} />}
      {image && (
        <>
          <h2>Save new Flashcard</h2>
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
            <input
              type="checkbox"
              name="primitive"
              checked={primitive}
              readOnly
            />
          </div>
          <img src={image} />
          <button
            className="save-button"
            disabled={saveDisabled}
            onClick={onSave}
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default NewFlashcard;
