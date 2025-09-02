import { useCallback, useRef, useState } from "react";
import "./styles.scss";
import { exportFlashcards, importFlashcards } from "../utils/flashcards";
import { useFlashcards } from "../flashcard/context/FlashcardContext";
import { Flashcard } from "../types";
import { v4 } from "uuid";

const _fakeDataEnabled = true;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const { flashcards, setFlashcards } = useFlashcards();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onExportFlashcards = useCallback(async () => {
    setLoading(true);
    await exportFlashcards();
    setLoading(false);
  }, []);

  const onImportFlashcards = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const file = event.target.files?.[0];
      if (file) {
        const imported = await importFlashcards(file);

        if (imported) {
          setFlashcards(imported);

          event.target.value = ""; // allow re-uploading the same file
        }
      }
      setLoading(false);
    },
    [setFlashcards]
  );

  const onClearAllFlashcards = useCallback(() => {
    const doDelete = confirm(`Do you really want to clear all Flashcards?`);
    if (!doDelete) return;

    setFlashcards([]);
  }, [setFlashcards]);

  const onFakeData = useCallback(() => {
    if (_fakeDataEnabled) {
      setLoading(true);
      const faked = [...flashcards];
      const first = flashcards[0];
      for (let i = 0; i < 3000; i++) {
        const fk: Flashcard = {
          ...first,
          id: v4(),
        };
        faked.push(fk);
      }
      setFlashcards(faked);
      setLoading(false);
    }
  }, [flashcards, setFlashcards]);

  return (
    <div className="settings">
      <div className="title">
        <span>Settings</span>
      </div>
      <div className="tile-list">
        <div className="settings-tile" onClick={onExportFlashcards}>
          <span>EXPORT FLASHCARDS</span>
        </div>
        <div className="settings-tile" onClick={onImportFlashcards}>
          <span>IMPORT FLASHCARDS</span>
          <input
            type="file"
            accept=".kanji"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="settings-tile" onClick={onClearAllFlashcards}>
          <span>CLEAR ALL FLASHCARDS</span>
        </div>
        {_fakeDataEnabled && (
          <div className="settings-tile" onClick={onFakeData}>
            <span>FAKE DATA</span>
          </div>
        )}
      </div>
      {loading && <span className="loading">Loading...</span>}
    </div>
  );
};

export default Settings;
