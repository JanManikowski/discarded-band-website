import useShows from "./useShows";

/**
 * Upcoming shows only (eventDate >= today), soonest first.
 * Kept as its own hook so the Home page teaser stays a one-liner.
 *
 * @param {number|null} limitCount - optional cap (e.g. 3 for a Home page teaser)
 */
const useUpcomingShows = (limitCount = null) => useShows({ when: "upcoming", limitCount });

export default useUpcomingShows;
