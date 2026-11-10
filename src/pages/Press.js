import React from "react";
import { FaQuoteLeft, FaEnvelope, FaFilePdf, FaCamera, FaDownload } from "react-icons/fa6";
import logo from "../assets/logo_centered.png";
import useSiteContent from "../hooks/useSiteContent";
import useSocials from "../hooks/useSocials";
import EmailLink from "../components/EmailLink";
import { BOOKING_EMAIL } from "../config/site";
import { DEFAULT_PRESS, hasText } from "../content/pressDefaults";
import { DEFAULT_ABOUT_US } from "../content/aboutUsDefaults";
import { parseYouTubeId, buildYouTubeEmbedUrl } from "../utils/youtube";
import { formatFileSize } from "../utils/storageUpload";

// The burning still life, used behind the title until a lineup photo is uploaded.
const FALLBACK_HERO = `${process.env.PUBLIC_URL}/assets/share-image.jpg`;

/**
 * The press kit (EPK): everything a booker or journalist needs on one page.
 * Presentational only - all content comes in through props.
 */
export const PressView = ({ press, aboutIntroHtml, socials = [] }) => {
  const genre = (press.genreLine || "").trim();
  const manifesto = hasText(press.manifestoHtml) ? press.manifestoHtml : aboutIntroHtml;
  const photo = press.lineupPhoto?.url ? press.lineupPhoto : null;
  const quotes = (press.quotes || []).filter((q) => (q.text || "").trim());
  const videoId = parseYouTubeId(press.videoUrl);
  const videoTitle = (press.videoTitle || "").trim() || "Video";
  const rider = press.rider?.url ? press.rider : null;

  return (
    <div className="press-page text-white">
      {/* Title: lineup photo (or the still life) with logo and genre line */}
      <header className="press-hero">
        <img
          className={`press-hero-img${photo ? " is-photo" : ""}`}
          src={photo ? photo.url : FALLBACK_HERO}
          alt={photo ? "DISCARDED lineup" : ""}
        />
        <div className="press-hero-shade" aria-hidden="true" />
        <div className="press-hero-content">
          <span className="press-kicker">Press kit</span>
          <h1 className="press-hero-title">
            <img src={logo} alt="DISCARDED" />
          </h1>
          {genre && <p className="press-genre">{genre}</p>}
        </div>
      </header>

      {/* Manifesto */}
      {hasText(manifesto) && (
        <section className="press-section">
          <h2 className="press-heading">Manifesto</h2>
          <div className="press-manifesto" dangerouslySetInnerHTML={{ __html: manifesto }} />
        </section>
      )}

      {/* Press quotes */}
      {quotes.length > 0 && (
        <section className="press-section">
          <h2 className="press-heading">What the press says</h2>
          <div className={`press-quotes count-${Math.min(quotes.length, 3)}`}>
            {quotes.map((q, i) => (
              <figure className="press-quote" key={q.id || i}>
                <FaQuoteLeft className="press-quote-mark" aria-hidden="true" />
                <blockquote>{q.text}</blockquote>
                {q.source && (
                  <figcaption>
                    {q.url ? (
                      <a href={q.url} target="_blank" rel="noopener noreferrer">
                        {q.source}
                      </a>
                    ) : (
                      q.source
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Video */}
      {videoId && (
        <section className="press-section">
          <h2 className="press-heading">{videoTitle}</h2>
          <div className="press-video">
            <iframe
              src={buildYouTubeEmbedUrl(videoId)}
              title={`${videoTitle} (video)`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Booking + downloads */}
      <section className="press-section">
        <h2 className="press-heading">Booking &amp; downloads</h2>
        <div className="press-card is-booking">
          <div className="press-booking-text">
            <FaEnvelope className="press-card-icon" aria-hidden="true" />
            <h3>Booking</h3>
            <p>Shows, festivals, interviews and press requests:</p>
          </div>
          <EmailLink email={BOOKING_EMAIL} className="press-booking-email" />
        </div>

        {(rider || photo) && (
          <div className="press-downloads">
            {rider && (
              <a className="press-card is-link" href={rider.url} target="_blank" rel="noopener noreferrer">
                <FaFilePdf className="press-card-icon" aria-hidden="true" />
                <h3>Tech rider</h3>
                <p>
                  Stage plot, channel list and backline.
                  <span className="press-card-meta">
                    {" "}
                    PDF{rider.size ? `, ${formatFileSize(rider.size)}` : ""}
                  </span>
                </p>
                <span className="press-card-cta">
                  <FaDownload aria-hidden="true" /> Download
                </span>
              </a>
            )}

            {photo && (
              <a className="press-card is-link" href={photo.url} target="_blank" rel="noopener noreferrer">
                <FaCamera className="press-card-icon" aria-hidden="true" />
                <h3>Lineup photo</h3>
                <p>Free to use for press and promotion.</p>
                <span className="press-card-cta">
                  <FaDownload aria-hidden="true" /> Download
                </span>
              </a>
            )}
          </div>
        )}

        {socials.length > 0 && (
          <div className="press-socials">
            {socials.map((link) => {
              const Icon = link.platform.icon;
              return (
                <a
                  key={link.id || link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.title}
                  title={link.title}
                >
                  <Icon />
                </a>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const Press = () => {
  const { data: press } = useSiteContent("press", DEFAULT_PRESS);
  const { data: about } = useSiteContent("aboutUs", DEFAULT_ABOUT_US);
  const { links } = useSocials();

  return <PressView press={press} aboutIntroHtml={about.introHtml} socials={links} />;
};

export default Press;
