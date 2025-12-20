import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';
import API_URL from '../config';

const Checkout = () => {
    const { cartItems, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

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
            const orderItems = cartItems.map(item => ({
                title: item.title,
                qty: item.qty,
                image: item.image,
                price: item.price,
                product: item._id
            }));

            // 1. Create Order on Backend
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    orderItems,
                    shippingAddress: address,
                    paymentMethod: 'Card',
                    totalPrice
                })
            });

            if (res.ok) {
                showToast('Order placed successfully!', 'success');
                clearCart();
                navigate('/');
            } else {
                showToast('Failed to place order', 'error');
            }
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
                            <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #eee' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                    <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                                    <span>{item.title} x {item.qty}</span>
                                </div>
                                <span>₹{(item.price * item.qty).toFixed(2)}</span>
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
