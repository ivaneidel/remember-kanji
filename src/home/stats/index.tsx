import { useMemo } from "react";
import { useDailyStats } from "../../context/StatsContext";
import { getTodayStats } from "../../utils/stats";

import "./styles.scss";

const StatsSection = () => {
  const { dailyStatsByDate } = useDailyStats();

  const todayStats = useMemo(
    () => getTodayStats(dailyStatsByDate),
    [dailyStatsByDate]
  );

  return (
    <div className="stats-section">
      <div className="date">
        <span>{todayStats.date}</span>
      </div>
      <div className="added">
        <span>Added: {todayStats.newFlashcardsAdded}</span>
      </div>
      <div className="reviewed">
        <span>Reviewed: {todayStats.reviewed}</span>
      </div>
      <div className="xp">
        <span>XP: {todayStats.xp}</span>
      </div>
    </div>
  );
};

export default StatsSection;
