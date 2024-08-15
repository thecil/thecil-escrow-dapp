const MS = 1000;
const MINUTES_TO_SECONDS = 60;
const HOURS_TO_MINUTES = 60;
const DAYS_TO_HOURS = 24;

export const toUnixTime = (date: Date) => {
  if (!date) return 0;
  date = new Date(date);
  return Math.floor(date.valueOf() / MS);
};

export const unixNow = () => toUnixTime(new Date());

export const timeToUnix = (
  amount: number,
  unit: "seconds" | "minutes" | "days" | "weeks"
): number => {
  switch (unit) {
    case "seconds":
      return amount * MS;
    case "minutes":
      return amount * MINUTES_TO_SECONDS * MS;
    case "days":
      return amount * DAYS_TO_HOURS * HOURS_TO_MINUTES * MS;
    case "weeks":
      return amount * 7 * DAYS_TO_HOURS * HOURS_TO_MINUTES * MS;
    default:
      throw new Error(`Invalid unit: ${unit}`);
  }
};
