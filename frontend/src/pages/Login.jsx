import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Giriş başarısız');
        }
    };

    return (
        <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-2xl text-center mb-6">Giriş Yap</h2>
                {error && <div className="mb-4 text-center text-sm" style={{ color: 'var(--danger-color)' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Adresi</label>
                        <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Parola</label>
                        <input type="password" name="password" className="form-input" required value={formData.password} onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4">Giriş Yap</button>
                </form>

                <div className="text-center mt-6 text-sm">
                    Hesabınız yok mu? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>Kayıt Ol</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
