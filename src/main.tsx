import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import { registerSW } from "virtual:pwa-register";

import Home from "./home/index.tsx";
import Flashcards from "./flashcard/index.tsx";
import NewFlashcard from "./flashcard/new/index.tsx";
import { FlashcardProvider } from "./flashcard/context/FlashcardContext.tsx";
import FlashcardView from "./flashcard/view/index.tsx";
import ConfigReview from "./review/config/index.tsx";
import Settings from "./settings/index.tsx";
import ReviewFlashcards from "./review/actual-review/index.tsx";
import EditFlashcard from "./flashcard/edit/index.tsx";

import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlashcardProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="flashcards">
            <Route index element={<Flashcards />} />
            <Route path="new" element={<NewFlashcard />} />
            <Route path=":flashcardId" element={<FlashcardView />} />
            <Route path=":flashcardId/edit" element={<EditFlashcard />} />
          </Route>
          <Route path="review">
            <Route index element={<ConfigReview />} />
            <Route path=":reviewSize" element={<ReviewFlashcards />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </HashRouter>
    </FlashcardProvider>
  </StrictMode>
);

registerSW();
