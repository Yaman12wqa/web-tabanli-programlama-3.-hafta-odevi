import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User, Edit3, Shield } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--accent-primary)' }}>
                    <Edit3 size={28} />
                    BEUBlog
                </Link>

                <div className="flex items-center gap-6" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <button
                        onClick={toggleTheme}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem', border: 'none' }}
                        title="Tema Degistir"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <>
                            <Link to="/create-post" className="btn btn-primary text-sm">Yazi Olustur</Link>
                            <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium" style={{ transition: 'color 0.2s' }}>
                                <Edit3 size={18} />
                                Panel
                            </Link>
                            <Link to="/profile" className="flex items-center gap-2 text-sm font-medium" style={{ transition: 'color 0.2s' }}>
                                <User size={18} />
                                {user.username}
                            </Link>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="flex items-center gap-2 text-sm font-medium" style={{ transition: 'color 0.2s' }}>
                                    <Shield size={18} />
                                    Admin
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn btn-secondary text-sm flex items-center gap-2" title="Cikis Yap">
                                <LogOut size={16} />
                                Cikis
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium" style={{ transition: 'color 0.2s' }}>Giris Yap</Link>
                            <Link to="/register" className="btn btn-primary text-sm">Uye Ol</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
