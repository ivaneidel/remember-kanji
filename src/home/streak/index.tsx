import { useDailyStats } from "../../context/StatsContext";

import "./styles.scss";

const StreakSection = () => {
  const { streak } = useDailyStats();

  return (
    <div className="streak-section">
      <span>{streak.days}⚡️</span>
    </div>
  );
};

export default StreakSection;
