import { StatsByDate } from "../context/StatsContext";
import { DailyStats } from "../types";
import { getTodayString } from "./date";

export enum StatsActionType {
  Add,
  Review,
}

export enum GradeType {
  Miss = 0,
  Hard = 1,
  Easy = 2,
  Hit = 3,
}

// Get today's stats, or create a default if not present
export const getTodayStats = (statsByDate: StatsByDate): DailyStats => {
  const today = getTodayString();
  if (statsByDate[today]) {
    return statsByDate[today];
  }

  return {
    date: today,
    newFlashcardsAdded: 0,
    reviewed: 0,
    hit: 0,
    miss: 0,
    easy: 0,
    hard: 0,
    xp: 0,
  };
};

// Update today's stats with an action
export const updateTodayStats = (
  statsByDate: Record<string, DailyStats>,
  action: { type: StatsActionType; grade?: GradeType }
): DailyStats => {
  const stats = getTodayStats(statsByDate);

  if (action.type === StatsActionType.Add) {
    stats.newFlashcardsAdded += 1;
    stats.xp += 10; // XP for adding
  }

  if (action.type === StatsActionType.Review && action.grade) {
    stats.reviewed += 1;
    switch (action.grade) {
      case GradeType.Hit:
        stats.hit += 1;
        stats.xp += 2;
        break;
      case GradeType.Easy:
        stats.easy += 1;
        stats.xp += 2;
        break;
      case GradeType.Hard:
        stats.hard += 1;
        stats.xp += 1;
        break;
      default:
        stats.miss += 1;
        // No XP for miss
        break;
    }
  }

  // Return updated stats (caller should save to context/db)
  return { ...stats };
};
