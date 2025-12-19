import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetch('/api/orders/myorders', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) return <div className="container" style={{ marginTop: '50px' }}>Please login to view orders.</div>;
    if (loading) return <div className="container" style={{ marginTop: '50px' }}>Loading orders...</div>;

    return (
        <div className="container" style={{ marginTop: '50px', marginBottom: '80px' }}>
            <h1 style={{ marginBottom: '30px' }}>My Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {orders.map(order => (
                        <div key={order._id} style={{ border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #f5f5f5', paddingBottom: '10px' }}>
                                <div>
                                    <strong>Order ID:</strong> <span style={{ color: '#777' }}>{order._id}</span>
                                </div>
                                <div>
                                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                                <div>
                                    <strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}
                                </div>
                            </div>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {order.orderItems.map((item, index) => (
                                    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                                        <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                                        <span>{item.title} x {item.qty}</span>
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: '15px', fontWeight: 'bold', color: order.isPaid ? 'green' : 'orange' }}>
                                Status: {order.isPaid ? 'Paid' : 'Pending Payment'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
