export function getCurrentSeason(month?: number): string {
  month = month ? month : new Date().getMonth();

  const seasons = ["Winter", "Spring", "Summer", "Fall"];

  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }

  const index = Math.floor(((month % 12) / 12) * 4) % 4;
  return seasons[index];
}

export type StatusType =
  | "Ongoing"
  | "Finished"
  | "Hiatus"
  | "Cancelled"
  | "Not yet aired"
  | "Unknown";

export function convertStatus(status: string): StatusType {
  switch (status) {
    case "RELEASING":
      return "Ongoing";
    case "NOT_YET_RELEASED":
      return "Not yet aired";
    case "FINISHED":
      return "Finished";
    case "CANCELLED":
      return "Cancelled";
    case "HIATUS":
      return "Hiatus";
    default:
      return "Unknown";
  }
}

export interface UDate {
  day: number;
  month: number;
  year: number;
}

export function convertDateStringToNumbers(dateString: string): UDate | string {
  const monthMap: { [key: string]: number } = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  const dateRegex = /^(\w{3}) (\d{2}), (\d{4})$/;
  const match = dateString.match(dateRegex);

  if (!match) {
    return dateString;
  }

  const monthAbbreviation = match[1];
  const day = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  const month = monthMap[monthAbbreviation];

  if (!month) {
    throw new Error("Invalid month abbreviation");
  }

  return {
    day: day,
    month: month,
    year: year,
  };
}
