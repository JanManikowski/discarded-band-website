import axios from 'axios';

const fetchProductById = async (id) => {
    try {
        const response = await axios.post(
            'https://discardedband.myshopify.com/api/2024-10/graphql.json',
            {
                query: `{
                    product(id: "${id}") {
                        id
                        title
                        description
                        variants(first: 5) {
                            edges {
                                node {
                                    id
                                    title
                                    price {
                                        amount
                                        currencyCode
                                    }
                                    compareAtPrice {
                                        amount
                                        currencyCode
                                    }
                                    image {
                                        src
                                        altText
                                    }
                                }
                            }
                        }
                        images(first: 1) {
                            edges {
                                node {
                                    src
                                    altText
                                }
                            }
                        }
                    }
                }`                
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': '330032ec2b5424556cccb0f1e3547ca7',
                },
            }
        );

        // Log the full response for debugging
        console.log('Shopify API Response:', response.data);

        // Return the product data
        return response.data.data.product;
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        throw error;
    }
};

export default fetchProductById;
