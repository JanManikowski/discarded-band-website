import React, { useContext } from 'react';
import { BasketContext } from '../contexts/BasketContext';

const ProductCard = ({ product }) => {
  const { addToBasket } = useContext(BasketContext);

  return (
    <div className="col-md-4 text-center mb-4">
      <h5 style={{ color: 'white' }}>{product.title}</h5>
      <p style={{ color: 'white' }}>{product.description}</p>
      {product.variants.edges.length > 0 && (
        <div>
          <img
            src={product.variants.edges[0].node.image.src}
            alt={product.variants.edges[0].node.image.altText || product.title}
            width="200"
            className="img-fluid mb-3"
          />
          <button
            className="btn btn-primary"
            onClick={() => addToBasket(product)}
          >
            Add to Basket
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
