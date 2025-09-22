import AddNewFlashcardButton from "../components/add-new-flashcard-button";
import { useFlashcards } from "../context/FlashcardContext";
import { List } from "react-window";
import FlashcardTile from "./tile";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import "./styles.scss";
import classNames from "classnames";
import { defaultFlashcardSort } from "../utils/flashcards";

enum SortType {
  ByFrameDesc,
  ByFrameAsc,
  ByDueAsc,
}

const Flashcards = () => {
  const { flashcards, flashcardsMetadataById } = useFlashcards();

  const [searchParam, setSearchParam] = useSearchParams();
  const [filteredFlashcards, setFilteredFlashcards] = useState(flashcards);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortType, setSortType] = useState(SortType.ByFrameAsc);

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

  const onSetSortType = useCallback((type: SortType) => {
    setSortType(type);
    setSortMenuVisible(false);
  }, []);

  useEffect(() => {
    const clone = [...flashcards];

    if (sortType === SortType.ByFrameAsc) {
      defaultFlashcardSort(clone);
    }
    if (sortType === SortType.ByFrameDesc) {
      clone.sort((f1, f2) => {
        if (!f1.frame) return 1;

        if (!f2.frame) return -1;

        return f1.frame < f2.frame ? 1 : -1;
      });
    }
    if (sortType === SortType.ByDueAsc) {
      clone.sort((f1, f2) => {
        const m1 = flashcardsMetadataById[f1.id];
        const m2 = flashcardsMetadataById[f2.id];

        if (!m1) return -1;

        if (!m2) return 1;

        return m1.due - m2.due;
      });
    }

    setFilteredFlashcards(clone);
  }, [sortType, flashcards, flashcardsMetadataById]);

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
          <div className="search-sort">
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
            <div className="flashcard-sort">
              <button
                className="toggle"
                onClick={() => setSortMenuVisible(!sortMenuVisible)}
              >
                ↕
              </button>
              {sortMenuVisible && (
                <div className="sort-menu">
                  <div
                    className={classNames("sort", "by-frame-asc", {
                      active: sortType === SortType.ByFrameAsc,
                    })}
                    onClick={() => onSetSortType(SortType.ByFrameAsc)}
                  >
                    <span>By Frame</span>
                    <span>↑</span>
                  </div>
                  <div
                    className={classNames("sort", "by-frame-desc", {
                      active: sortType === SortType.ByFrameDesc,
                    })}
                    onClick={() => onSetSortType(SortType.ByFrameDesc)}
                  >
                    <span>By Frame</span>
                    <span>↓</span>
                  </div>
                  <div
                    className={classNames("sort", "by-due-asc", {
                      active: sortType === SortType.ByDueAsc,
                    })}
                    onClick={() => onSetSortType(SortType.ByDueAsc)}
                  >
                    <span>By Due</span>
                    <span>↓</span>
                  </div>
                </div>
              )}
            </div>
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
