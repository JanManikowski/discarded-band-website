import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import logo from '../assets/discarded-yellow-low.png';
import backgroundLow from '../assets/background-low.png'; // Import the low-quality image
import backgroundHigh from '../assets/background-high.png'; // Import the high-quality image
import 'bootstrap/dist/css/bootstrap.min.css';
import { BasketContext } from '../contexts/BasketContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState({});
    const { addToBasket } = useContext(BasketContext);
    const [backgroundImage, setBackgroundImage] = useState(backgroundLow); // Use imported low-quality image

    useEffect(() => {
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
                setProducts(response.data.data.products.edges);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();

        // Preload and switch to high-quality image
        const highImage = new Image();
        highImage.src = backgroundHigh;
        highImage.onload = () => setBackgroundImage(backgroundHigh);
    }, []);

    const handleVariantChange = (productId, variant) => {
        setSelectedVariants((prev) => ({
            ...prev,
            [productId]: variant,
        }));
    };

    return (
        <>
            <div
                className="text-center d-flex flex-column justify-content-start align-items-center"
                style={{
                    position: 'relative',
                    minHeight: '100vh',
                    color: 'white',
                    textShadow: '2px 2px 5px rgba(0, 0, 0, 0.8)',
                    paddingTop: '100px',
                    userSelect: 'none',
                    backgroundImage: `url(${backgroundImage})`, // Set the dynamic background image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Logo */}
                <img
                    src={logo}
                    alt="Discarded Logo"
                    style={{
                        width: '100%',
                        maxWidth: '600px',
                        height: 'auto',
                        marginBottom: '20px',
                        userSelect: 'none',
                    }}
                />
                <button
                    className="btn btn-outline-light mt-4"
                    onClick={() => {
                        const featuredSection = document.getElementById('featured-section');
                        if (featuredSection) {
                            featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }}
                >
                    Shop Now
                </button>
            </div>

            <div id="featured-section" className="container-fluid p-5" style={{ backgroundColor: '#000000' }}>
                <h2 className="text-center text-uppercase mb-4" style={{ color: 'red' }}>
                    Featured
                </h2>
                <p className="text-center text-uppercase text-muted">Orders Shipped Weekly</p>
                <div className="row">
                    {products.length > 0 ? (
                        products.map(({ node: product }) => (
                            <div key={product.id} className="col-12 col-md-6 col-lg-4 text-center mb-4">
                                <h5 style={{ color: 'white' }}>{product.title}</h5>
                                <p style={{ color: 'white' }}>{product.description}</p>
                                {product.variants.edges.length > 0 && (
                                    <div>
                                        <img
                                            src={product.variants.edges[0].node.image.src}
                                            alt={product.variants.edges[0].node.image.altText || product.title}
                                            className="img-fluid mb-3"
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                        />
                                        <select
                                            className="form-select mb-3"
                                            onChange={(e) =>
                                                handleVariantChange(
                                                    product.id,
                                                    product.variants.edges.find(
                                                        (variant) => variant.node.id === e.target.value
                                                    ).node
                                                )
                                            }
                                        >
                                            {product.variants.edges.map(({ node: variant }) => (
                                                <option key={variant.id} value={variant.id}>
                                                    {variant.title} - {variant.price.amount} {variant.price.currencyCode}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                addToBasket(product, selectedVariants[product.id] || product.variants.edges[0].node)
                                            }
                                        >
                                            Add to Basket
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-white">Loading products...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
