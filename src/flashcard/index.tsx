import AddNewFlashcardButton from "../components/add-new-flashcard-button";
import { useFlashcards } from "../context/FlashcardContext";
import { List } from "react-window";
import FlashcardTile from "./flashcard-tile";
import { useCallback, useEffect, useMemo, useState } from "react";

import "./styles.scss";
import { useSearchParams } from "react-router";

const Flashcards = () => {
  const { flashcards } = useFlashcards();

  const [searchParam, setSearchParam] = useSearchParams();
  const [filteredFlashcards, setFilteredFlashcards] = useState(flashcards);

  const search = useMemo(() => searchParam.get("q") || "", [searchParam]);

  const onSearchChange = useCallback(
    (value: string) => {
      setSearchParam(
        { ...(value.trim() ? { q: value.trim() } : {}) },
        { replace: true }
      );
    },
    [setSearchParam]
  );

  useEffect(() => {
    if (search.trim()) {
      setFilteredFlashcards(
        flashcards.filter(
          (f) =>
            f.keyWord.toLowerCase().includes(search.trim().toLowerCase()) ||
            (f.help &&
              f.help.toLowerCase().includes(search.trim().toLowerCase()))
        )
      );
      return;
    }

    setFilteredFlashcards(flashcards);
  }, [search, flashcards]);

  return (
    <div className="flashcard-list">
      {!flashcards.length && (
        <div className="no-flashcards">
          <span>No flashcards yet... Create a new one!</span>
        </div>
      )}
      {flashcards.length > 0 && (
        <>
          <div className="flashcard-search">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search keyword or help"
            />
            <button className="clear" onClick={() => onSearchChange("")}>
              X
            </button>
          </div>
          <List
            rowComponent={FlashcardTile}
            rowCount={filteredFlashcards.length}
            rowHeight={48}
            rowProps={{ flashcards: filteredFlashcards }}
          />
        </>
      )}
      <AddNewFlashcardButton />
    </div>
  );
};

export default Flashcards;
