import { useEffect, useState } from "react";
import { collection, query, where, orderBy, limit as fbLimit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { startOfToday } from "../utils/showDates";

/**
 * Fetches shows from "upcomingShows" with eventDate >= today, soonest first.
 * Past shows are never deleted by this - they're just excluded from the
 * query, so they remain in Firestore for the admin to manage/delete later.
 *
 * @param {number|null} limitCount - optional cap (e.g. 3 for a Home page teaser)
 */
const useUpcomingShows = (limitCount = null) => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const showsRef = collection(db, "upcomingShows");
        const constraints = [
          where("eventDate", ">=", startOfToday()),
          orderBy("eventDate", "asc"),
        ];
        if (limitCount) constraints.push(fbLimit(limitCount));

        const snap = await getDocs(query(showsRef, ...constraints));
        if (isMounted) {
          setShows(
            snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                ...data,
                // Firestore returns a Timestamp; normalize to a JS Date for display use.
                eventDate: data.eventDate?.toDate ? data.eventDate.toDate() : data.eventDate,
              };
            })
          );
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to load upcoming shows:", err);
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
  }, [limitCount]);

  return { shows, loading, error };
};

export default useUpcomingShows;