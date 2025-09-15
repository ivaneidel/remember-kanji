// Helper to get today's date string in YYYY-MM-DD format
export const dateToIdString = (date: Date): string => {
  // Get local date components
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to get today's date string in YYYY-MM-DD format
export const getTodayString = (): string => {
  return dateToIdString(new Date());
};

export const dateToIsoWithTimezone = (date: Date): string => {
  const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
};
