import useSiteContent from "./useSiteContent";
import { prepareMerchItems } from "../utils/merch";

export const DEFAULT_MERCH_SETTINGS = {
  intro: "Shirts, CDs and more. Orders go through our Bandcamp.",
  hidden: [],
};

/**
 * Merch for the public site: the items the daily sync copied from Bandcamp
 * (site_content/merch), with the admin's choices applied
 * (site_content/merchSettings: hidden items, intro text).
 */
const useMerch = () => {
  const merch = useSiteContent("merch", { items: [] });
  const settings = useSiteContent("merchSettings", DEFAULT_MERCH_SETTINGS);

  return {
    items: prepareMerchItems(merch.data.items, settings.data.hidden),
    intro: settings.data.intro ?? DEFAULT_MERCH_SETTINGS.intro,
    loading: merch.loading || settings.loading,
  };
};

export default useMerch;
