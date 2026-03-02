import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirmPassword) {
            return setError('Parolalar eşleşmiyor');
        }
        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Kayıt başarısız');
        }
    };

    return (
        <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-2xl text-center mb-6">Yeni Hesap Oluştur</h2>
                {error && <div className="mb-4 text-center text-sm" style={{ color: 'var(--danger-color)' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Kullanıcı Adı</label>
                        <input type="text" name="username" className="form-input" required value={formData.username} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Adresi</label>
                        <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Parola</label>
                        <input type="password" name="password" className="form-input" required value={formData.password} onChange={handleChange} minLength="6" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Parola (Tekrar)</label>
                        <input type="password" name="confirmPassword" className="form-input" required value={formData.confirmPassword} onChange={handleChange} minLength="6" />
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4">Kayıt Ol</button>
                </form>

                <div className="text-center mt-6 text-sm">
                    Zaten hesabınız var mı? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>Giriş Yap</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
