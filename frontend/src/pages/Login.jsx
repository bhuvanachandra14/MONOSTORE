import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '100px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h1>
            {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', marginBottom: '20px' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                    Sign In
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                New customer? <a href="/register" style={{ textDecoration: 'underline' }}>Create an account</a>.
            </p>
        </div>
    );
};

export default Login;
