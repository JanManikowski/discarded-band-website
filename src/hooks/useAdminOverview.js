import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { startOfToday } from "../utils/showDates";
import { DEFAULT_RELEASES, getReleaseSlots } from "../utils/spotify";
import { DEFAULT_ABOUT_US } from "../content/aboutUsDefaults";
import { DEFAULT_SOCIALS } from "../utils/socialPlatforms";
import { toDate, daysBetween } from "../utils/merch";

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

const formatShowDate = (date) => date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/**
 * One short status line per admin section, so the dashboard shows what's
 * actually on the site ("Next: 5 Dec · Het Paard", "Missing: tech rider").
 * Each line is { text, tone: "normal" | "warn" | "error" }. A section whose
 * data can't be loaded simply gets no line.
 */
export const buildOverview = ({ nextShow, releases, about, gallery, socials, merch, press }) => {
  const overview = {};

  if (nextShow !== undefined) {
    overview.shows = nextShow
      ? {
          text: `Next: ${[nextShow.date && formatShowDate(nextShow.date), nextShow.venue].filter(Boolean).join(" · ")}`,
          tone: "normal",
        }
      : { text: "No upcoming shows", tone: "warn" };
  }

  if (releases !== undefined) {
    // Same fallback as the Home and Releases pages
    const count = getReleaseSlots({ ...DEFAULT_RELEASES, ...(releases || {}) }).length;
    overview.releases = count
      ? { text: `${plural(count, "Spotify player")} on the site`, tone: "normal" }
      : { text: "No Spotify link set", tone: "warn" };
  }

  if (about !== undefined) {
    const data = { ...DEFAULT_ABOUT_US, ...(about || {}) };
    const members = (data.members || []).filter((m) => (m.name || "").trim()).length;
    const photos = (data.bandPhotos || []).length;
    overview.about = { text: `${plural(members, "band member")} · ${plural(photos, "photo")}`, tone: "normal" };
  }

  if (gallery !== undefined) {
    const withPhotos = gallery.filter((show) => (show.photos || []).length > 0);
    const photos = withPhotos.reduce((sum, show) => sum + show.photos.length, 0);
    overview.gallery = withPhotos.length
      ? { text: `${plural(withPhotos.length, "show")} · ${plural(photos, "photo")}`, tone: "normal" }
      : { text: "No photos yet", tone: "warn" };
  }

  if (socials !== undefined) {
    const links = (socials?.links || DEFAULT_SOCIALS.links).filter((l) => (l.url || "").trim()).length;
    overview.socials = { text: `${plural(links, "link")} on the site`, tone: links ? "normal" : "warn" };
  }

  if (merch !== undefined) {
    const syncedAt = toDate(merch?.syncedAt);
    if (merch?.lastError) {
      overview.merch = { text: "Last sync failed, see details", tone: "error" };
    } else if (!syncedAt) {
      overview.merch = { text: "Not synced yet", tone: "warn" };
    } else {
      const days = daysBetween(syncedAt);
      const when = days <= 0 ? "today" : days === 1 ? "yesterday" : `${days} days ago`;
      const items = (merch.items || []).length;
      overview.merch = { text: `Synced ${when} · ${plural(items, "item")}`, tone: days > 3 ? "warn" : "normal" };
    }
  }

  if (press !== undefined) {
    const p = press || {};
    const missing = [
      !p.lineupPhoto?.url && "lineup photo",
      !(p.quotes || []).some((q) => (q.text || "").trim()) && "press quotes",
      !(p.videoUrl || "").trim() && "video",
      !p.rider?.url && "tech rider",
    ].filter(Boolean);
    overview.press = missing.length
      ? { text: `Missing: ${missing.join(", ")}`, tone: "warn" }
      : { text: "Everything filled in", tone: "normal" };
  }

  return overview;
};

const readDoc = async (id) => {
  const snap = await getDoc(doc(db, "site_content", id));
  return snap.exists() ? snap.data() : null;
};

const useAdminOverview = () => {
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const tasks = {
        nextShow: async () => {
          const snap = await getDocs(
            query(
              collection(db, "upcomingShows"),
              where("eventDate", ">=", startOfToday()),
              orderBy("eventDate", "asc"),
              limit(1)
            )
          );
          if (snap.empty) return null;
          const data = snap.docs[0].data();
          return { date: toDate(data.eventDate), venue: data.venue || "" };
        },
        releases: () => readDoc("releases"),
        about: () => readDoc("aboutUs"),
        gallery: async () => (await getDocs(collection(db, "shows"))).docs.map((d) => d.data()),
        socials: () => readDoc("socials"),
        merch: () => readDoc("merch"),
        press: () => readDoc("press"),
      };

      const keys = Object.keys(tasks);
      const results = await Promise.allSettled(keys.map((key) => tasks[key]()));
      const data = {};
      results.forEach((result, i) => {
        if (result.status === "fulfilled") data[keys[i]] = result.value;
      });

      if (active) {
        setOverview(buildOverview(data));
        setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return { overview, loading };
};

export default useAdminOverview;
