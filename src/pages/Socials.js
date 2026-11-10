import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { commonTitleStyle } from "../styles/constants";
import useSocials from "../hooks/useSocials";
import { withAlpha } from "../utils/socialPlatforms";

/** One big clickable card for a platform. */
const SocialCard = ({ link }) => {
  const { platform, title, handle, description, image, url } = link;
  const Icon = platform.icon;

  return (
    <a
      className={`social-card${image?.url ? " has-image" : ""}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${title}${handle ? ` (${handle})` : ""}: ${platform.action} (opens in a new tab)`}
      style={{
        "--brand": platform.color,
        "--brand-soft": withAlpha(platform.color, 0.16),
        "--brand-glow": withAlpha(platform.color, 0.22),
      }}
    >
      {image?.url && <img className="social-card-bg" src={image.url} alt="" loading="lazy" />}
      <span className="social-card-shade" aria-hidden="true" />
      <Icon className="social-card-watermark" aria-hidden="true" />

      <span className="social-card-icon" aria-hidden="true">
        <Icon />
      </span>
      <span className="social-card-title">{title}</span>
      {handle && <span className="social-card-handle">{handle}</span>}
      {description && <span className="social-card-desc">{description}</span>}
      <span className="social-card-cta" aria-hidden="true">
        {platform.action} <FaArrowRight />
      </span>
    </a>
  );
};

/**
 * The grid of cards. With an odd number of links the first card spans the
 * full width, so the grid never ends with a lonely half-row.
 */
export const SocialsGrid = ({ links }) => (
  <div className={`socials-grid${links.length % 2 === 1 ? " is-odd" : ""}`}>
    {links.map((link) => (
      <SocialCard key={link.id || link.url} link={link} />
    ))}
  </div>
);

export const SocialsView = ({ heading, intro, links }) => (
  <div className="socials-page container-fluid text-white">
    <h1 style={commonTitleStyle}>{heading}</h1>
    {intro && <p className="socials-intro">{intro}</p>}
    {links.length > 0 ? (
      <SocialsGrid links={links} />
    ) : (
      <p className="socials-intro">Links coming soon.</p>
    )}
  </div>
);

const Socials = () => {
  const { heading, intro, links } = useSocials();
  return <SocialsView heading={heading} intro={intro} links={links} />;
};

export default Socials;
