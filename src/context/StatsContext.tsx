/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { DailyStats, Streak } from "../types";
import {
  getAllStats,
  getStorageStreak,
  saveAllStats,
  saveStorageStreak,
} from "../utils/db";
import { getTodayString } from "../utils/date";

export type StatsByDate = {
  [date: string]: DailyStats;
};

type ContextType = {
  dailyStatsByDate: StatsByDate;
  addDailyStats: (stats: DailyStats) => void;
  // Streak
  streak: Streak;
  increaseStreak: () => void;
};

const DailyStatsContext = createContext<ContextType | undefined>(undefined);

export const DailyStatsProvider = ({ children }: { children: ReactNode }) => {
  const [dailyStatsByDate, setDailyStatsByDate] = useState<StatsByDate>({});
  const [streak, setStreak] = useState<Streak>({
    days: 0,
    lastActiveName: "",
  });

  const addDailyStats = useCallback(
    (stats: DailyStats) => {
      const copy = { ...dailyStatsByDate };

      copy[stats.date] = stats;

      // Set them in the state
      setDailyStatsByDate(copy);

      // Save them in storage
      saveAllStats(Object.values(copy));
    },
    [dailyStatsByDate]
  );

  const increaseStreak = useCallback(() => {
    if (streak.lastActiveName !== getTodayString()) {
      const newStreak: Streak = {
        days: streak.days + 1,
        lastActiveName: getTodayString(),
      };

      setStreak(newStreak);

      saveStorageStreak(newStreak);
    }
  }, [streak]);

  const loadData = useCallback(async () => {
    const stats = await getAllStats();
    const dictionary: StatsByDate = {};
    stats.forEach((s) => {
      dictionary[s.date] = s;
    });
    setDailyStatsByDate(dictionary);
    setStreak(getStorageStreak());
  }, [setDailyStatsByDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <DailyStatsContext.Provider
      value={{
        dailyStatsByDate,
        addDailyStats,
        // Streak
        streak,
        increaseStreak,
      }}
    >
      {children}
    </DailyStatsContext.Provider>
  );
};

export const useDailyStats = () => {
  const context = useContext(DailyStatsContext);
  if (!context) {
    throw new Error("useDailyStats must be used within a DailyStatsProvider");
  }
  return context;
};
