import { JSX, useMemo } from "react";
import { useDailyStats } from "../../context/StatsContext";
import { getTodayStats } from "../../utils/stats";

import "./styles.scss";
import classNames from "classnames";

const CalendarSection = () => {
  const { dailyStatsByDate } = useDailyStats();

  const calendarView = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();

    const days: JSX.Element[] = [];

    const stats = getTodayStats(dailyStatsByDate);

    for (let i = 0; i < daysInMonth; i++) {
      const today = now.getDate() === i + 1;
      const gold = today && stats.reviewed && stats.newFlashcardsAdded;
      const green = today && !stats.reviewed && stats.newFlashcardsAdded;
      const blue = today && stats.reviewed && !stats.newFlashcardsAdded;
      days.push(
        <div
          key={`day-${i + 1}`}
          className={classNames(["day", `${i + 1}`], {
            today,
            gold,
            green,
            blue,
          })}
        >
          {i + 1}
        </div>
      );
    }

    return <>{days}</>;
  }, [dailyStatsByDate]);

  return <div className="calendar-view">{calendarView}</div>;
};

export default CalendarSection;
