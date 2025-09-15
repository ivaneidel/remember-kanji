import { Streak } from "../types";

export const getDefaultStreakValue = (): Streak => ({
  days: 0,
  lastActiveName: "",
});
