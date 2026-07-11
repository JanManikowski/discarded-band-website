import React, { useEffect, useRef, useState } from "react";

/**
 * Shows a blurry LQIP placeholder immediately, then cross-fades to the
 * full image once it's loaded. Falls back gracefully to a dark background
 * for photos that predate the LQIP feature (lqip === null/undefined).
 *
 * Uses an IntersectionObserver so images only start loading when they're
 * about to scroll into view — saves bandwidth on long gallery pages.
 */
const ProgressiveImage = ({ src, lqip, alt, style, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  // Start loading the full image only when near the viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // start loading 200px before entering view
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#111",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {/* LQIP placeholder — always visible until the full image is ready */}
      {lqip && (
        <img
          src={lqip}
          aria-hidden="true"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(12px)",
            transform: "scale(1.05)", // prevents blur edge fringing
            opacity: loaded ? 0 : 1,
            transition: "opacity 0.4s ease",
          }}
        />
      )}

      {/* Full image — loads lazily, fades in on top of placeholder */}
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;