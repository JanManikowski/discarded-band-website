import axios from 'axios';

const fetchProducts = async () => {
    try {
        const response = await axios.post(
            'https://discardedband.myshopify.com/api/2024-10/graphql.json',
            {
                query: `{
                    products(first: 10) {
                        edges {
                            node {
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
                                            image {
                                                src
                                                altText
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }`,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Storefront-Access-Token': '330032ec2b5424556cccb0f1e3547ca7',
                },
            }
        );
        return response.data.data.products.edges;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export default fetchProducts;
