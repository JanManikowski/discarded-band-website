import useSiteContent from "./useSiteContent";
import { DEFAULT_SOCIALS, resolveSocialLink } from "../utils/socialPlatforms";

/**
 * The band's social links from "site_content/socials", ready to render:
 * each link has its platform, icon, colour, title and handle filled in.
 * Used by the Socials page, the footer icons and the press kit.
 */
const useSocials = () => {
  const { data, loading } = useSiteContent("socials", DEFAULT_SOCIALS);
  const links = (Array.isArray(data.links) ? data.links : [])
    .filter((link) => link && (link.url || "").trim())
    .map(resolveSocialLink);

  return {
    heading: data.heading || DEFAULT_SOCIALS.heading,
    intro: data.intro ?? DEFAULT_SOCIALS.intro,
    links,
    loading,
  };
};

export default useSocials;
