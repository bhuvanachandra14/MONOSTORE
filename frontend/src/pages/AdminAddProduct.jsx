import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ToastContext from '../context/ToastContext';

const AdminAddProduct = () => {
    const { user } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
    });

    if (!user || !user.isAdmin) {
        return <div className="container" style={{ marginTop: '100px' }}>Not Authorized</div>;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                showToast('Product added successfully!', 'success');
                navigate('/');
            } else {
                showToast('Failed to add product', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Error adding product', 'error');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '80px', marginBottom: '80px' }}>
            <h1 style={{ marginBottom: '30px' }}>Add New Product</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Category</label>
                    <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Image URL</label>
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="5"
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd' }}
                    ></textarea>
                </div>
                <button type="submit" className="btn" style={{ padding: '15px' }}>
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AdminAddProduct;
