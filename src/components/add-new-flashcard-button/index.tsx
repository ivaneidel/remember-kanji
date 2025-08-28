import { useCallback } from "react";
import { useNavigate } from "react-router";

import "./styles.scss";

const AddNewFlashcardButton = () => {
  const navigate = useNavigate();

  const onButtonClick = useCallback(() => {
    navigate("/flashcards/new");
  }, [navigate]);

  return (
    <button className="add-flashcard-button" onClick={onButtonClick}>
      ➕
    </button>
  );
};

export default AddNewFlashcardButton;
