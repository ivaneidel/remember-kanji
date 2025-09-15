import classNames from "classnames";
import { JSX, useMemo, useState } from "react";
import { useDailyStats } from "../../context/StatsContext";
import { dateComponentsToIdString } from "../../utils/date";

import "./styles.scss";
import { DailyStats } from "../../types";
import ClickOutside from "../../components/click-outside";

const CalendarSection = () => {
  const { dailyStatsByDate } = useDailyStats();

  const [selectedStats, setSelectedStats] = useState<DailyStats>();

  const calendarView = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const days: JSX.Element[] = [];

    for (let i = 0; i < daysInMonth; i++) {
      const dayId = dateComponentsToIdString(year, month, i + 1);
      const stats = dailyStatsByDate[dayId];
      const gold = stats && stats.reviewed && stats.newFlashcardsAdded;
      const green = stats && !stats.reviewed && stats.newFlashcardsAdded;
      const blue = stats && stats.reviewed && !stats.newFlashcardsAdded;
      const today = now.getDate() === i + 1;
      days.push(
        <div
          key={`day-${i + 1}`}
          className={classNames(["day", `${i + 1}`], {
            today,
            gold,
            green,
            blue,
          })}
          onClick={(e) => {
            if (stats) {
              e.preventDefault();
              e.stopPropagation();
              setSelectedStats(stats);
            }
          }}
        >
          {i + 1}
        </div>
      );
    }

    return <>{days}</>;
  }, [dailyStatsByDate]);

  return (
    <div className="calendar-view">
      <div className="days">{calendarView}</div>
      {selectedStats && (
        <ClickOutside onClickOutside={() => setSelectedStats(undefined)}>
          <div className="past-session-tooltip">
            <span>{selectedStats.date}</span>
            <span>Added: {selectedStats.newFlashcardsAdded}</span>
            <span>Reviewed: {selectedStats.reviewed}</span>
            <span>XP: {selectedStats.xp}</span>
          </div>
        </ClickOutside>
      )}
    </div>
  );
};

export default CalendarSection;
