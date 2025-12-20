import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Account</h1>
            {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', marginBottom: '20px' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: '15px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '15px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '15px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
                <button type="submit" className="btn" style={{ width: '100%', padding: '15px' }}>
                    Sign Up
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                Already have an account? <Link to="/login" style={{ textDecoration: 'underline' }}>Login</Link>.
            </p>
        </div>
    );
};

export default Register;
