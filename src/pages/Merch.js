import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { commonTitleStyle } from "../styles/constants";
import useMerch from "../hooks/useMerch";
import { splitMerchTitle } from "../utils/merch";
import { BANDCAMP_MERCH_URL } from "../config/site";

/** One product. The whole card opens the item on Bandcamp. */
const MerchCard = ({ item }) => {
  const { name, note } = splitMerchTitle(item.title);

  return (
    <a
      className={`merch-card${item.soldOut ? " is-sold-out" : ""}`}
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.title}, ${item.soldOut ? "sold out" : item.priceText}. Opens on Bandcamp.`}
    >
      <span className="merch-card-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" loading="lazy" />
        ) : (
          <span className="merch-card-noimage" aria-hidden="true">DISCARDED</span>
        )}
        {item.soldOut && <span className="merch-card-badge">Sold out</span>}
      </span>
      <span className="merch-card-body">
        {item.type && <span className="merch-card-type">{item.type}</span>}
        <span className="merch-card-name">{name}</span>
        {note && <span className="merch-card-note">{note}</span>}
        <span className="merch-card-price">{item.soldOut ? "Sold out" : item.priceText}</span>
        <span className="merch-card-cta" aria-hidden="true">
          {item.soldOut ? "View" : "Buy"}
          <span className="merch-card-cta-long"> on Bandcamp</span> <FaArrowRight />
        </span>
      </span>
    </a>
  );
};

/** Presentational part of the Merch page. */
export const MerchView = ({ items, intro, loading }) => (
  <div className="merch-page container-fluid text-white">
    <h1 style={commonTitleStyle}>MERCH</h1>
    {intro && <p className="merch-intro">{intro}</p>}

    {loading ? (
      <p className="merch-intro">Loading...</p>
    ) : items.length > 0 ? (
      <>
        <div className="merch-grid">
          {items.map((item) => (
            <MerchCard key={item.id} item={item} />
          ))}
        </div>
        <p className="merch-footnote">
          Orders, sizes and shipping are handled by Bandcamp.{" "}
          <a href={BANDCAMP_MERCH_URL} target="_blank" rel="noopener noreferrer">
            See all merch on Bandcamp
          </a>
        </p>
      </>
    ) : (
      <div className="merch-empty">
        <p>New merch is on its way. In the meantime, everything we have is on Bandcamp.</p>
        <a className="merch-empty-button" href={BANDCAMP_MERCH_URL} target="_blank" rel="noopener noreferrer">
          Visit our Bandcamp <FaArrowRight />
        </a>
      </div>
    )}
  </div>
);

const Merch = () => {
  const { items, intro, loading } = useMerch();
  return <MerchView items={items} intro={intro} loading={loading} />;
};

export default Merch;
