import React, { useContext } from 'react';
import { BasketContext } from '../contexts/BasketContext';
import axios from 'axios';
import backgroundImage from '../assets/background_square.png';

const Basket = () => {
  const { basketItems, calculateTotal } = useContext(BasketContext);

  const handleOrder = async () => {
    try {
      const lines = basketItems.map((item) => ({
        merchandiseId: item.variant.id,
        quantity: item.quantity,
      }));

      const response = await axios.post(
        'https://discardedband.myshopify.com/api/2024-10/graphql.json',
        {
          query: `
            mutation CreateCart($input: CartInput!) {
              cartCreate(input: $input) {
                cart {
                  id
                  checkoutUrl
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            input: {
              lines,
            },
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': '330032ec2b5424556cccb0f1e3547ca7',
          },
        }
      );

      console.log('Full Shopify Response:', response.data);

      const { data } = response;
      if (!data || !data.data || !data.data.cartCreate) {
        console.error('Unexpected Response Structure:', response.data);
        throw new Error('Unexpected Shopify response structure');
      }

      const userErrors = data.data.cartCreate.userErrors;
      if (userErrors && userErrors.length > 0) {
        console.error('Shopify User Errors:', userErrors);
        alert(`Error: ${userErrors[0].message}`);
        return;
      }

      const checkoutUrl = data.data.cartCreate.cart.checkoutUrl;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error('Unexpected Shopify API Response:', data);
        alert('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Shopify API Error:', error.response.data);
        alert(
          `Shopify API Error: ${
            error.response.data.errors
              ? error.response.data.errors[0].message
              : 'Unknown error'
          }`
        );
      } else if (error.request) {
        console.error('No Response from Shopify:', error.request);
        alert('Network Error: No response received from Shopify. Please check your internet connection.');
      } else {
        console.error('Unexpected Error:', error.message);
        alert(`Unexpected Error: ${error.message}`);
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        minHeight: '100vh',
        paddingTop: '120px',  // To prevent overlap with navbar
        paddingBottom: '50px',
        paddingLeft: '20px',
        paddingRight: '20px',
      }}
    >
      <div
        className="container p-5"
        style={{
          backgroundColor: 'rgba(34, 34, 34, 0.85)', // Darker background for better contrast
          color: 'white',
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)',
          maxWidth: '800px',
          margin: '0 auto', // Center container horizontally
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
                    marginBottom: '15px', // Add more spacing between items
                    borderRadius: '8px',
                    border: 'none',
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="font-weight-bold">{item.title}</h5>
                      <p className="mb-1">
                        <strong>Variant:</strong> {item.variant.title}
                      </p>
                      <p className="mb-1">
                        <strong>Price:</strong> {item.variant.price.amount}{' '}
                        {item.variant.price.currencyCode}
                      </p>
                      <p className="mb-1">
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
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
              onClick={handleOrder}
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
