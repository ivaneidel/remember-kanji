import { useNavigate } from "react-router";
import AddNewFlashcardButton from "../components/add-new-flashcard-button";

import "./styles.scss";
import { useFlashcards } from "../flashcard/context/FlashcardContext";

const Home = () => {
  const navigate = useNavigate();
  const { flashcards } = useFlashcards();

  return (
    <div className="home">
      <div
        className="link all-flashcards"
        onClick={() => (flashcards.length ? navigate("/flashcards") : null)}
      >
        <span>ALL FLASHCARDS</span>
      </div>
      <div
        className="link review-flashcards"
        onClick={() => (flashcards.length ? navigate("/review") : null)}
      >
        <span>REVIEW FLASHCARDS</span>
      </div>
      <button className="settings-button" onClick={() => navigate("/settings")}>
        三
      </button>
      <AddNewFlashcardButton />
    </div>
  );
};

export default Home;
