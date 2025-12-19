import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();

    const keyword = searchParams.get('keyword') || '';

    useEffect(() => {
        fetch(`/api/products?keyword=${keyword}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setLoading(false);
            });
    }, [keyword]);

    return (
        <div className="container">
            {/* Hero Section */}
            <section style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '80px 40px',
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: '60px'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Minimalist Essentials</h1>
                <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '30px' }}>
                    Curated collection of premium black & white products.
                </p>
                <button className="btn" style={{ background: '#fff', color: '#000', border: 'none' }}>
                    Shop Collection
                </button>
            </section>

            {/* Product Grid */}
            <section>
                <h2 style={{ fontSize: '1.8rem', borderBottom: '2px solid #000', paddingBottom: '10px', display: 'inline-block' }}>
                    Featured Products
                </h2>

                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    <div className="grid-products">
                        {products.map(product => (
                            <Link to={`/product/${product._id}`} key={product._id} className="fade-in" style={{ display: 'block' }}>
                                <div style={{ border: '1px solid #eee', padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', overflow: 'hidden' }}>
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', filter: 'grayscale(100%)' }}
                                        />
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>{product.title}</h3>
                                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold' }}>₹{product.price ? product.price.toFixed(2) : '0.00'}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#777' }}>
                                            ★ {product.rating?.rate} ({product.rating?.count})
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
