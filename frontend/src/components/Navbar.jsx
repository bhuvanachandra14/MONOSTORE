import { ShoppingCart, Search, User, LogOut, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    return (
        <header style={{ borderBottom: '1px solid var(--border)', padding: '15px 0' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Logo */}
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>
                    MONO<span style={{ fontWeight: '300' }}>STORE</span>
                </Link>

                {/* Search */}
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f5f5f5', padding: '5px 15px', borderRadius: '4px', width: '40%' }}>
                    <input
                        type="text"
                        placeholder="Search for products..."
                        id="searchInput"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                navigate(`/?keyword=${e.target.value}`);
                            }
                        }}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            width: '100%',
                            fontSize: '0.9rem',
                            padding: '5px'
                        }}
                    />
                    <button
                        onClick={() => {
                            const val = document.getElementById('searchInput').value;
                            navigate(`/?keyword=${val}`);
                        }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <Search size={18} color="#555" />
                    </button>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Hi, {user.name.split(' ')[0]}</span>

                            <Link to="/orders" style={{ fontSize: '0.9rem', textDecoration: 'underline' }}>Orders</Link>
                            <Link to="/account" style={{ fontSize: '0.9rem', textDecoration: 'underline' }}>Account</Link>

                            {user.isAdmin && (
                                <Link to="/admin/add-product" title="Add Product">
                                    <PlusCircle size={20} />
                                </Link>
                            )}

                            <div onClick={logout} style={{ cursor: 'pointer', title: 'Logout' }}>
                                <LogOut size={20} />
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                            <User size={20} />
                            <span style={{ fontSize: '0.9rem' }}>Login</span>
                        </Link>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <Link to="/checkout" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'inherit' }}>
                            <ShoppingCart size={20} />
                            {cartItems.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'black',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    width: '15px',
                                    height: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '50%'
                                }}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
                            )}
                        </Link>
                        <Link to="/checkout" style={{ fontSize: '0.9rem' }}>Cart</Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
