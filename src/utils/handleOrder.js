import axios from 'axios';

const handleOrder = async (basketItems) => {
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

    const { data } = response;
    if (!data || !data.data || !data.data.cartCreate) {
      console.error('Unexpected Response Structure:', response.data);
      throw new Error('Unexpected Shopify response structure');
    }

    const userErrors = data.data.cartCreate.userErrors;
    if (userErrors && userErrors.length > 0) {
      console.error('Shopify User Errors:', userErrors);
      throw new Error(userErrors[0].message);
    }

    const checkoutUrl = data.data.cartCreate.cart.checkoutUrl;
    if (checkoutUrl) {
      return checkoutUrl; // Return the checkout URL
    } else {
      console.error('Unexpected Shopify API Response:', data);
      throw new Error('Unexpected error occurred. Please try again.');
    }
  } catch (error) {
    console.error('Order Handling Error:', error.message);
    throw error; // Rethrow the error for the caller to handle
  }
};

export default handleOrder;
