import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';
import API_URL from '../config';

const Checkout = () => {
    const { cartItems, clearCart, removeFromCart, addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [savedAddresses, setSavedAddresses] = useState([]);

    useEffect(() => {
        if (user) {
            fetch(`${API_URL}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.addresses) {
                        setSavedAddresses(data.addresses);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            showToast('Please login to place an order', 'error');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            showToast('Your cart is empty', 'error');
            return;
        }

        try {
            const res = await loadRazorpay();
            if (!res) {
                showToast('Razorpay SDK failed to load', 'error');
                return;
            }

            // 1. Create Razorpay Order on Backend
            const orderRes = await fetch(`${API_URL}/orders/razorpay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ amount: totalPrice })
            });
            const orderData = await orderRes.json();

            // 2. Open Razorpay Modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RtmQmnNw90NIQ3', // Fallback for safety, but better to use env
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'MONOSTORE',
                description: 'Order Payment',
                order_id: orderData.id,
                handler: async function (response) {
                    // 3. Verify and Save Order on Backend
                    const orderItems = cartItems.map(item => ({
                        title: item.title,
                        qty: item.qty,
                        image: item.image,
                        price: item.price,
                        product: item._id
                    }));

                    const saveRes = await fetch(`${API_URL}/orders`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({
                            orderItems,
                            shippingAddress: address,
                            paymentMethod: 'Card',
                            totalPrice,
                            paymentResult: response // Send signature for verification
                        })
                    });

                    if (saveRes.ok) {
                        showToast('Order placed successfully!', 'success');
                        clearCart();
                        navigate('/');
                    } else {
                        showToast('Payment verification failed', 'error');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: '#000000'
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            showToast('Error placing order', 'error');
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px', marginBottom: '80px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
            {/* Shipping Form */}
            <div>
                <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>

                {savedAddresses.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <select
                            onChange={(e) => {
                                if (e.target.value === "") {
                                    setAddress({ address: '', city: '', postalCode: '', country: '' });
                                } else {
                                    const selected = savedAddresses.find(a => a._id === e.target.value);
                                    if (selected) {
                                        setAddress({
                                            address: selected.address,
                                            city: selected.city,
                                            postalCode: selected.postalCode,
                                            country: selected.country
                                        });
                                    }
                                }
                            }}
                            style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
                        >
                            <option value="">-- Select Saved Address --</option>
                            {savedAddresses.map(addr => (
                                <option key={addr._id} value={addr._id}>
                                    {addr.address}, {addr.city}
                                </option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>Or enter a new address below:</p>
                    </div>
                )}

                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" placeholder="Address" value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="Postal Code" value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="Country" value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} style={{ padding: '10px', border: '1px solid #ddd' }} />
                </form>

                <h2 style={{ marginBottom: '20px', marginTop: '40px' }}>Order Items</h2>
                {cartItems.length === 0 ? <p>Cart is empty</p> : (
                    <ul style={{ border: '1px solid #eee', borderRadius: '5px' }}>
                        {cartItems.map(item => (
                            <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                                            <button
                                                onClick={() => addToCart(item, -1)}
                                                disabled={item.qty <= 1}
                                                style={{ border: '1px solid #ddd', background: '#fff', cursor: item.qty <= 1 ? 'not-allowed' : 'pointer', padding: '2px 6px', borderRadius: '4px' }}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span style={{ fontSize: '0.9rem' }}>{item.qty}</span>
                                            <button
                                                onClick={() => addToCart(item, 1)}
                                                style={{ border: '1px solid #ddd', background: '#fff', cursor: 'pointer', padding: '2px 6px', borderRadius: '4px' }}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <span style={{ fontWeight: 'bold' }}>₹{(item.price * item.qty).toFixed(2)}</span>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ff4444', padding: '5px' }}
                                        title="Remove Item"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Order Summary */}
            <div style={{ border: '1px solid #eee', padding: '20px', height: 'fit-content' }}>
                <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Items:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span>Shipping:</span>
                    <span>Free</span>
                </div>
                <div style={{ borderTop: '1px solid #eee', margin: '15px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <span>Total:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <button onClick={handlePlaceOrder} className="btn" style={{ width: '100%', padding: '15px' }}>
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default Checkout;
