import React, { useEffect, useState, useContext } from 'react';
import logo from '../assets/discarded-yellow-low.png';
import backgroundLow from '../assets/background-low.png';
import backgroundHigh from '../assets/background-high.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';
import '../styles/responsive.css';
import { BasketContext } from '../contexts/BasketContext';
import fetchProducts from '../utils/fetchProducts';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState({});
    const { addToBasket } = useContext(BasketContext);
    const [backgroundImage, setBackgroundImage] = useState(backgroundLow);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productData = await fetchProducts();
                setProducts(productData);
            } catch (error) {
                console.error('Failed to load products:', error);
            }
        };

        loadProducts();

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

    const handleAddToBasket = (product, variant) => {
        addToBasket(product, variant);
        setToastMessage(`${product.title} added to the basket!`);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    return (
        <>
            {/* Toast Notification */}
            <div className={`toast-notification ${toastVisible ? 'visible' : ''}`}>
                {toastMessage}
            </div>

            <div
                className="home-header"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <img
                    src={logo}
                    alt="Discarded Logo"
                    className="logo"
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

            <div id="featured-section" className="container-fluid featured-section">
                <h2 className="featured-title">Featured</h2>
                <p className="featured-subtitle">Orders Shipped Weekly</p>
                <div className="row">
                    {products.length > 0 ? (
                        products.map(({ node: product }) => (
                            <div key={product.id} className="col-12 col-md-6 col-lg-4 text-center product-card">
                                <h5 className="product-title">{product.title}</h5>
                                <p className="product-description">{product.description}</p>
                                {product.variants.edges.length > 0 && (
                                    <div>
                                        <img
                                            src={product.variants.edges[0].node.image.src}
                                            alt={product.variants.edges[0].node.image.altText || product.title}
                                            className="product-image"
                                        />
                                        <select
                                            className="form-select variant-select"
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
                                            className="btn btn-primary add-to-basket-btn"
                                            onClick={() =>
                                                handleAddToBasket(
                                                    product,
                                                    selectedVariants[product.id] || product.variants.edges[0].node
                                                )
                                            }
                                        >
                                            Add to Basket
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="loading-text">Loading products...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
