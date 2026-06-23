import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { commonTitleStyle } from "../styles/constants";

const Gallery = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  useEffect(() => {
    const loadShows = async () => {
      try {
        const showsRef = collection(db, "shows");
        const snap = await getDocs(query(showsRef, orderBy("createdAt", "desc")));
        setShows(
          snap.docs
            .map((d) => ({ id: d.id, photos: [], ...d.data() }))
            .filter((show) => show.photos && show.photos.length > 0)
        );
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    };
    loadShows();
  }, []);

  return (
    <div
      className="container-fluid text-white"
      style={{
        backgroundColor: "#0A060D",
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
          shows.map((show) => (
            <div key={show.id} className="mb-5">
              <h2
                style={{
                  color: "#b61c1c",
                  fontWeight: "bold",
                  fontSize: "1.6rem",
                  marginBottom: "1rem",
                  textAlign: "left",
                }}
              >
                {show.name}
              </h2>
              <div className="row g-3">
                {show.photos.map((photo) => (
                  <div key={photo.storagePath} className="col-6 col-md-4 col-lg-3">
                    <img
                      src={photo.url}
                      alt={show.name}
                      className="img-fluid rounded"
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() => setLightboxUrl(photo.url)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Simple lightbox: click a photo to enlarge, click again to close */}
      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000,
            cursor: "zoom-out",
            padding: "20px",
          }}
        >
          <img
            src={lightboxUrl}
            alt="Enlarged"
            style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "6px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;