import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import Home from "./home/index.tsx";
import Flashcards from "./flashcard/index.tsx";
import NewFlashcard from "./flashcard/new/index.tsx";
import { FlashcardProvider } from "./flashcard/context/FlashcardContext.tsx";
import FlashcardView from "./flashcard/view/index.tsx";
import ReviewFlashcards from "./review/index.tsx";

import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlashcardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="flashcards">
            <Route index element={<Flashcards />} />
            <Route path="new" element={<NewFlashcard />} />
            <Route path=":flashcardId" element={<FlashcardView />} />
          </Route>
          <Route path="/review" element={<ReviewFlashcards />} />
        </Routes>
      </BrowserRouter>
    </FlashcardProvider>
  </StrictMode>
);
