import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';
import API_URL from '../config';

const Account = () => {
    const { user } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/users/profile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setAddresses(data.addresses || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/users/address`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newAddress)
            });
            const data = await res.json();
            if (res.ok) {
                setAddresses(data);
                setNewAddress({ address: '', city: '', postalCode: '', country: '' });
                showToast('Address added successfully', 'success');
            } else {
                showToast(data.message || 'Failed to add address', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error adding address', 'error');
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const res = await fetch(`${API_URL}/users/address/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setAddresses(data);
                showToast('Address deleted', 'success');
            } else {
                showToast(data.message, 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error deleting address', 'error');
        }
    };

    return (
        <div className="container" style={{ marginTop: '50px', marginBottom: '80px' }}>
            <h2>My Account</h2>
            <div style={{ marginTop: '20px' }}>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>

            <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>My Addresses</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                {addresses.map(addr => (
                    <div key={addr._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px', position: 'relative' }}>
                        <p>{addr.address}</p>
                        <p>{addr.city}, {addr.postalCode}</p>
                        <p>{addr.country}</p>
                        <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                borderRadius: '3px'
                            }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <h3>Add New Address</h3>
            <form onSubmit={handleAddAddress} style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input
                    type="text"
                    placeholder="Address"
                    value={newAddress.address}
                    onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                    required
                    style={{ padding: '10px', border: '1px solid #ddd' }}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                    required
                    style={{ padding: '10px', border: '1px solid #ddd' }}
                />
                <input
                    type="text"
                    placeholder="Postal Code"
                    value={newAddress.postalCode}
                    onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    required
                    style={{ padding: '10px', border: '1px solid #ddd' }}
                />
                <input
                    type="text"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={e => setNewAddress({ ...newAddress, country: e.target.value })}
                    required
                    style={{ padding: '10px', border: '1px solid #ddd' }}
                />
                <button type="submit" className="btn" style={{ padding: '10px' }}>Add Address</button>
            </form>
        </div>
    );
};

export default Account;
