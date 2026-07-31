import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { commonTitleStyle } from "../styles/constants";
import ProgressiveImage from "../components/ProgressiveImage";

const Gallery = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state: which show + which photo index is open
  const [lightbox, setLightbox] = useState(null); // { showIndex, photoIndex }

  useEffect(() => {
    const loadShows = async () => {
      try {
        const showsRef = collection(db, "shows");
        const snap = await getDocs(query(showsRef, orderBy("createdAt", "desc")));
        const loaded = snap.docs
          .map((d) => ({ id: d.id, photos: [], ...d.data() }))
          .filter((show) => show.photos && show.photos.length > 0);

        loaded.sort((a, b) => {
          const aOrder = a.order !== undefined ? a.order : Infinity;
          const bOrder = b.order !== undefined ? b.order : Infinity;
          return aOrder - bOrder;
        });

        setShows(loaded);
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    loadShows();
  }, []);

  // Derived: the currently open photo and its show
  const activeShow = lightbox !== null ? shows[lightbox.showIndex] : null;
  const activePhoto = activeShow ? activeShow.photos[lightbox.photoIndex] : null;
  const totalPhotos = activeShow ? activeShow.photos.length : 0;

  const openLightbox = (showIndex, photoIndex) => {
    setLightbox({ showIndex, photoIndex });
  };

  const closeLightbox = () => setLightbox(null);

  const goNext = useCallback(() => {
    if (!lightbox) return;
    setLightbox((prev) => ({
      ...prev,
      photoIndex: (prev.photoIndex + 1) % totalPhotos,
    }));
  }, [lightbox, totalPhotos]);

  const goPrev = useCallback(() => {
    if (!lightbox) return;
    setLightbox((prev) => ({
      ...prev,
      photoIndex: (prev.photoIndex - 1 + totalPhotos) % totalPhotos,
    }));
  }, [lightbox, totalPhotos]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox, goNext, goPrev]);

  return (
    <div
      className="container-fluid text-white"
      style={{
        minHeight: "100vh",
        paddingTop: "120px",
        paddingBottom: "60px",
      }}
    >
      <div className="container text-center" style={{ maxWidth: "1100px" }}>
        <h1 style={commonTitleStyle}>GALLERY</h1>

        {loading ? (
          <p style={{ color: "#e0e0e0" }}>Loading...</p>
        ) : shows.length === 0 ? (
          <p style={{ color: "#999" }}>No photos yet. Check back after our next show!</p>
        ) : (
          shows.map((show, showIndex) => (
            <div key={show.id} className="mb-5">
              <h2
                style={{
                  color: "#c4a96a",
                  fontWeight: "bold",
                  fontSize: "1.6rem",
                  marginBottom: "1rem",
                  textAlign: "left",
                }}
              >
                {show.name}
              </h2>
              <div className="row g-3">
                {show.photos.map((photo, photoIndex) => (
                  <div key={photo.storagePath} className="col-6 col-md-4 col-lg-3">
                    <div style={{ position: "relative" }}>
                      <ProgressiveImage
                        src={photo.url}
                        lqip={photo.lqip || null}
                        alt={show.name}
                        onClick={() => openLightbox(showIndex, photoIndex)}
                        style={{ width: "100%", height: "200px", borderRadius: "4px" }}
                      />
                      {photo.credit && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "6px",
                            left: "6px",
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "rgba(255,255,255,0.85)",
                            fontSize: "0.65rem",
                            padding: "2px 6px",
                            borderRadius: "3px",
                            pointerEvents: "none",
                            maxWidth: "calc(100% - 12px)",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          © {photo.credit}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {lightbox && activePhoto && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.95)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          // Close when clicking the dark backdrop
          onClick={closeLightbox}
        >
          {/* Stop clicks on the image/controls from closing the lightbox */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "90vw",
              maxHeight: "90vh",
            }}
          >
            {/* The photo itself — plain img tag, already loaded in the grid */}
            <img
              key={activePhoto.url} // force remount when photo changes
              src={activePhoto.url}
              alt={activeShow.name}
              style={{
                maxWidth: "90vw",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "4px",
                display: "block",
              }}
            />

            {/* Photo counter */}
            <div
              style={{
                position: "absolute",
                bottom: "-28px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "#999",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
              }}
            >
              {lightbox.photoIndex + 1} / {totalPhotos}
            </div>

            {/* Photographer credit caption */}
            {activePhoto.credit && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-52px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: "#666",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                }}
              >
                © {activePhoto.credit}
              </div>
            )}
          </div>

          {/* Prev button */}
          {totalPhotos > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              style={navButtonStyle("left")}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          {/* Next button */}
          {totalPhotos > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              style={navButtonStyle("right")}
              aria-label="Next photo"
            >
              ›
            </button>
          )}

          {/* Close button */}
          <button
            onClick={closeLightbox}
            style={{
              position: "absolute",
              top: "16px",
              right: "20px",
              background: "none",
              border: "none",
              color: "white",
              fontSize: "2rem",
              cursor: "pointer",
              lineHeight: 1,
              opacity: 0.8,
            }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

const navButtonStyle = (side) => ({
  position: "fixed",
  top: "50%",
  [side]: "16px",
  transform: "translateY(-50%)",
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.3)",
  color: "white",
  fontSize: "2.5rem",
  lineHeight: 1,
  width: "48px",
  height: "64px",
  cursor: "pointer",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s",
});

export default Gallery;