import React from 'react';

const ProductCard = ({ product }) => {
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
          <select className="form-select mb-3">
            {product.variants.edges.map(({ node: variant }) => (
              <option key={variant.id} value={variant.id}>
                {variant.title} - {variant.price.amount} {variant.price.currencyCode}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
