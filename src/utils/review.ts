import { days, hours } from "./date";

export enum DueProximity {
  Soon = "soon",
  Medium = "medium",
  Safe = "safe",
}

export const getDueProximity = (dueDate: number) => {
  const delta = dueDate - Date.now();

  if (delta < hours(12)) {
    return DueProximity.Soon;
  }

  if (delta < days(1)) {
    return DueProximity.Medium;
  }

  return DueProximity.Safe;
};
