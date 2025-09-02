import AddNewFlashcardButton from "../components/add-new-flashcard-button";
import { useFlashcards } from "./context/FlashcardContext";

import "./styles.scss";
import { List } from "react-window";
import FlashcardTile from "./flashcard-tile";

const Flashcards = () => {
  const { flashcards } = useFlashcards();

  return (
    <div className="flashcard-list">
      {!flashcards.length && (
        <div className="no-flashcards">
          <span>No flashcards yet... Create a new one!</span>
        </div>
      )}
      <List
        rowComponent={FlashcardTile}
        rowCount={flashcards.length}
        rowHeight={48}
        rowProps={{ flashcards }}
      />
      <AddNewFlashcardButton />
    </div>
  );
};

export default Flashcards;
