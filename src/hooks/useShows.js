import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit as fbLimit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { startOfToday } from "../utils/showDates";

// Firestore returns a Timestamp; normalize to a JS Date for display use.
const normalizeShow = (d) => {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    eventDate: data.eventDate?.toDate ? data.eventDate.toDate() : data.eventDate,
  };
};

/**
 * Fetches shows from "upcomingShows".
 *
 *  when: "upcoming" → eventDate >= today, soonest first
 *  when: "past"     → eventDate <  today, most recent first
 *
 * Shows are never deleted when their date passes - they just move from the
 * "upcoming" query to the "past" one - so the played-shows list builds itself.
 *
 * @param {object} options
 * @param {"upcoming"|"past"} options.when
 * @param {number|null} options.limitCount - optional cap (e.g. 3 for the Home teaser)
 */
const useShows = ({ when = "upcoming", limitCount = null } = {}) => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const showsRef = collection(db, "upcomingShows");
        const constraints =
          when === "past"
            ? [where("eventDate", "<", startOfToday()), orderBy("eventDate", "desc")]
            : [where("eventDate", ">=", startOfToday()), orderBy("eventDate", "asc")];
        if (limitCount) constraints.push(fbLimit(limitCount));

        const snap = await getDocs(query(showsRef, ...constraints));
        if (isMounted) {
          setShows(snap.docs.map(normalizeShow));
          setLoading(false);
        }
      } catch (err) {
        console.error(`Failed to load ${when} shows:`, err);
        if (isMounted) {
          setError(err);
          setShows([]);
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [when, limitCount]);

  return { shows, loading, error };
};

export default useShows;
