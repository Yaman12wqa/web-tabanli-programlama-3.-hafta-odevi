import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const getImageSrc = (imagePath) => {
    if (!imagePath) {
        return '';
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    return `http://localhost:5000${imagePath}`;
};

const Profile = () => {
    const { user, setUser, loading } = useContext(AuthContext);
    const [profileForm, setProfileForm] = useState({
        username: '',
        email: '',
        bio: '',
        profilePicture: ''
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [profileMessage, setProfileMessage] = useState('');
    const [profileError, setProfileError] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    useEffect(() => {
        if (!user) {
            return;
        }

        setProfileForm({
            username: user.username || '',
            email: user.email || '',
            bio: user.bio || '',
            profilePicture: user.profilePicture || ''
        });
    }, [user]);

    const handleProfileChange = (event) => {
        const { name, value } = event.target;
        setProfileForm((current) => ({ ...current, [name]: value }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswordForm((current) => ({ ...current, [name]: value }));
    };

    const handleProfileSubmit = async (event) => {
        event.preventDefault();
        setSavingProfile(true);
        setProfileMessage('');
        setProfileError('');

        try {
            let profilePicture = profileForm.profilePicture;

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);

                const uploadResponse = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                profilePicture = uploadResponse.data.data;
            }

            const response = await api.put('/auth/me/profile', {
                username: profileForm.username,
                email: profileForm.email,
                bio: profileForm.bio,
                profilePicture
            });

            setUser(response.data.data);
            setProfileForm((current) => ({ ...current, profilePicture }));
            setImageFile(null);
            setProfileMessage('Profil basariyla guncellendi.');
        } catch (err) {
            setProfileError(err.response?.data?.error || 'Profil guncellenemedi.');
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();
        setSavingPassword(true);
        setPasswordMessage('');
        setPasswordError('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Yeni sifre alanlari ayni olmali.');
            setSavingPassword(false);
            return;
        }

        try {
            const response = await api.put('/auth/me/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordMessage('Sifre basariyla guncellendi.');
        } catch (err) {
            setPasswordError(err.response?.data?.error || 'Sifre guncellenemedi.');
        } finally {
            setSavingPassword(false);
        }
    };

    if (loading) {
        return <div className="text-center my-8">Yukleniyor...</div>;
    }

    if (!user) {
        return (
            <div className="card text-center" style={{ maxWidth: '640px', margin: '2rem auto' }}>
                <h1 className="text-2xl mb-4">Profil</h1>
                <p className="text-gray mb-4">Bu sayfayi gormek icin giris yapmaniz gerekiyor.</p>
                <Link to="/login" className="btn btn-primary">Giris Yap</Link>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            <section className="card" style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                <div className="flex items-center justify-between mb-4" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                        <h1 className="text-2xl mb-2">Profil Ayarlari</h1>
                        <p className="text-gray">Hesap bilgilerinizi buradan guncelleyebilirsiniz.</p>
                    </div>
                    {profileForm.profilePicture && (
                        <img
                            src={getImageSrc(profileForm.profilePicture)}
                            alt={profileForm.username || 'Profile'}
                            style={{
                                width: '72px',
                                height: '72px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid var(--border-color)'
                            }}
                        />
                    )}
                </div>

                {profileMessage && <div className="mb-4 text-sm" style={{ color: 'var(--success-color)' }}>{profileMessage}</div>}
                {profileError && <div className="mb-4 text-sm" style={{ color: 'var(--danger-color)' }}>{profileError}</div>}

                <form onSubmit={handleProfileSubmit}>
                    <div className="form-group">
                        <label className="form-label">Kullanici Adi</label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            value={profileForm.username}
                            onChange={handleProfileChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">E-posta</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Biyografi</label>
                        <textarea
                            name="bio"
                            className="form-input"
                            rows="4"
                            value={profileForm.bio}
                            onChange={handleProfileChange}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Profil Fotografi</label>
                        <input
                            type="file"
                            className="form-input"
                            accept="image/*"
                            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                        {savingProfile ? 'Kaydediliyor...' : 'Profili Kaydet'}
                    </button>
                </form>
            </section>

            <section className="card" style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                <h2 className="text-xl mb-4">Sifre Degistir</h2>

                {passwordMessage && <div className="mb-4 text-sm" style={{ color: 'var(--success-color)' }}>{passwordMessage}</div>}
                {passwordError && <div className="mb-4 text-sm" style={{ color: 'var(--danger-color)' }}>{passwordError}</div>}

                <form onSubmit={handlePasswordSubmit}>
                    <div className="form-group">
                        <label className="form-label">Mevcut Sifre</label>
                        <input
                            type="password"
                            name="currentPassword"
                            className="form-input"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Yeni Sifre</label>
                        <input
                            type="password"
                            name="newPassword"
                            className="form-input"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            minLength="6"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Yeni Sifre (Tekrar)</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            minLength="6"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={savingPassword}>
                        {savingPassword ? 'Guncelleniyor...' : 'Sifreyi Guncelle'}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Profile;
