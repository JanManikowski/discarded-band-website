import React, { useContext } from 'react';
import { BasketContext } from '../contexts/BasketContext';
import backgroundImage from '../assets/background-high.png';
import handleOrder from '../utils/handleOrder'; // Import the utility function

const Basket = () => {
  const { basketItems, calculateTotal } = useContext(BasketContext);

  const placeOrder = async () => {
    try {
      const checkoutUrl = await handleOrder(basketItems); // Call the utility function
      if (checkoutUrl) {
        window.location.href = checkoutUrl; // Redirect to the checkout page
      }
    } catch (error) {
      alert(`Error placing order: ${error.message}`);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '50px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <div
        className="container p-5"
        style={{
          backgroundColor: 'rgba(34, 34, 34, 0.85)',
          color: 'white',
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h1 className="text-center mb-4" style={{ fontWeight: 'bold' }}>Your Basket</h1>
        {basketItems.length > 0 ? (
          <>
            <ul className="list-group mb-4">
              {basketItems.map((item, index) => (
                <li
                  key={index}
                  className="list-group-item"
                  style={{
                    backgroundColor: 'rgba(44, 44, 44, 0.9)',
                    color: 'white',
                    marginBottom: '15px',
                    borderRadius: '8px',
                    border: 'none',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="font-weight-bold">{item.title}</h5>
                      <p className="mb-1"><strong>Variant:</strong> {item.variant.title}</p>
                      <p className="mb-1"><strong>Price:</strong> {item.variant.price.amount} {item.variant.price.currencyCode}</p>
                      <p className="mb-1"><strong>Quantity:</strong> {item.quantity}</p>
                    </div>
                    <img
                      src={item.variant.image.src}
                      alt={item.variant.image.altText || item.title}
                      style={{
                        width: '100px',
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="font-weight-bold">Total: {calculateTotal().toFixed(2)} USD</h4>
            </div>
            <button
              className="btn btn-success w-100"
              onClick={placeOrder}
              style={{
                backgroundColor: '#388e3c',
                borderColor: '#388e3c',
                fontWeight: 'bold',
              }}
            >
              Place Order
            </button>
          </>
        ) : (
          <p className="text-center">Your basket is empty!</p>
        )}
      </div>
    </div>
  );
};

export default Basket;
