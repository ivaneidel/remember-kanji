import { useNavigate } from "react-router";
import AddNewFlashcardButton from "../components/add-new-flashcard-button";
import { useFlashcards } from "../context/FlashcardContext";
import StatsSection from "./stats";
import CalendarSection from "./calendar";

import "./styles.scss";
import StreakSection from "./streak";

const Home = () => {
  const navigate = useNavigate();
  const { flashcards } = useFlashcards();

  return (
    <div className="home">
      <button className="settings-button" onClick={() => navigate("/settings")}>
        三
      </button>
      <div className="home-content">
        <StreakSection />
        <StatsSection />
        <CalendarSection />
      </div>
      <div className="bottom-navigation">
        <div
          className="link all-flashcards"
          onClick={() => (flashcards.length ? navigate("/flashcards") : null)}
        >
          <span>🗂️ FLASHCARDS</span>
        </div>
        <div
          className="link review-flashcards"
          onClick={() => (flashcards.length ? navigate("/review") : null)}
        >
          <span>🔄 REVIEW</span>
        </div>
      </div>
      <AddNewFlashcardButton />
    </div>
  );
};

export default Home;
