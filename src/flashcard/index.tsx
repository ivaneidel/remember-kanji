import AddNewFlashcardButton from "../components/add-new-flashcard-button";
import { useFlashcards } from "./context/FlashcardContext";

import "./styles.scss";
import { List } from "react-window";
import FlashcardTile from "./flashcard-tile";
import { useEffect, useState } from "react";

const Flashcards = () => {
  const { flashcards } = useFlashcards();

  const [search, setSearch] = useState("");
  const [filteredFlashcards, setFilteredFlashcards] = useState(flashcards);

  useEffect(() => {
    if (search.trim()) {
      setFilteredFlashcards(
        flashcards.filter((f) =>
          f.keyWord.includes(search.trim().toLowerCase())
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyword"
            />
            <button className="clear" onClick={() => setSearch("")}>
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
