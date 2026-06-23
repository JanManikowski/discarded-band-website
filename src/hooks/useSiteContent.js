import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Fetches a single document from the "site_content" collection once when
 * the component mounts. Used for public-facing content (Spotify link,
 * About Us text, etc.) that's edited from the admin dashboard.
 *
 * @param {string} docId - e.g. "releases", "aboutUs"
 * @param {object} fallback - returned while loading / if the doc doesn't exist yet
 */
const useSiteContent = (docId, fallback = {}) => {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      try {
        const ref = doc(db, "site_content", docId);
        const snap = await getDoc(ref);
        if (isMounted) {
          if (snap.exists()) {
            setData({ ...fallback, ...snap.data() });
          } else {
            // No document yet (e.g. before the admin has saved anything) -
            // fall back so the public site doesn't break.
            setData(fallback);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error(`Failed to load site_content/${docId}:`, err);
        if (isMounted) {
          setError(err);
          setData(fallback);
          setLoading(false);
        }
      }
    };

    fetchContent();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId]);

  return { data, loading, error };
};

export default useSiteContent;