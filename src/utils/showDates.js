const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

/**
 * Builds the {day, month, year, eventDate} fields stored on a show doc
 * from a plain JS Date. eventDate (a real Date/Timestamp) is what powers
 * the "hide past shows" query; day/month/year are just for display so we
 * don't have to re-derive a 3-letter month string every render.
 */
export const buildShowDateFields = (jsDate) => {
  return {
    day: jsDate.getDate(),
    month: MONTHS[jsDate.getMonth()],
    year: jsDate.getFullYear(),
    eventDate: jsDate,
  };
};

/**
 * Returns midnight today as a JS Date, used as the cutoff for "upcoming"
 * shows so a show happening later today still counts as upcoming.
 */
export const startOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export { MONTHS };