import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import CartContext from '../context/CartContext';
import ToastContext from '../context/ToastContext';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product, 1);
        showToast('Added to cart!', 'success');
    };

    const handleBuyNow = () => {
        addToCart(product, 1);
        navigate('/checkout');
    };

    if (loading) return <div className="container" style={{ marginTop: '50px' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ marginTop: '50px' }}>Product not found</div>;

    return (
        <div className="container" style={{ marginTop: '60px', marginBottom: '100px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                {/* Image */}
                <div style={{ border: '1px solid #f0f0f0', padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                        src={product.image}
                        alt={product.title}
                        style={{ maxWidth: '100%', maxHeight: '500px', filter: 'grayscale(100%)' }}
                    />
                </div>

                {/* Details */}
                <div>
                    <span style={{ textTransform: 'uppercase', color: '#777', fontSize: '0.9rem', letterSpacing: '1px' }}>
                        {product.category}
                    </span>
                    <h1 style={{ fontSize: '2.5rem', marginTop: '10px', marginBottom: '20px' }}>{product.title}</h1>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '30px' }}>
                        ₹{product.price ? product.price.toFixed(2) : '0.00'}
                    </p>
                    <div style={{ marginBottom: '30px', color: '#444', lineHeight: '1.8' }}>
                        {product.description}
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <button onClick={handleAddToCart} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                        <button onClick={handleBuyNow} className="btn btn-outline">
                            Buy Now
                        </button>
                    </div>

                    <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>Rating:</span>
                            <strong>{product.rating?.rate} / 5.0</strong>
                            <span style={{ color: '#777' }}>({product.rating?.count} reviews)</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
