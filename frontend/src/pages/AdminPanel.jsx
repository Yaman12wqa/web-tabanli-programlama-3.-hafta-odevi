import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const statusColors = {
    pending: 'orange',
    approved: 'var(--success-color)',
    suspended: 'var(--danger-color)'
};

const AdminPanel = () => {
    const { user, loading } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [pageError, setPageError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [categoryMessage, setCategoryMessage] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [savingCategory, setSavingCategory] = useState(false);
    const [updatingPostId, setUpdatingPostId] = useState('');

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!user || user.role !== 'admin') {
            setLoadingData(false);
            return;
        }

        const loadAdminData = async () => {
            setLoadingData(true);
            setPageError('');

            try {
                const [categoryResponse, postResponse] = await Promise.all([
                    api.get('/categories'),
                    api.get('/posts', { params: { scope: 'all' } })
                ]);

                setCategories(categoryResponse.data.data);
                setPosts(postResponse.data.data);
            } catch (err) {
                setPageError(err.response?.data?.error || 'Yonetim verileri yuklenemedi.');
            } finally {
                setLoadingData(false);
            }
        };

        loadAdminData();
    }, [loading, user]);

    const handleAddCategory = async (event) => {
        event.preventDefault();
        setSavingCategory(true);
        setCategoryError('');
        setCategoryMessage('');

        try {
            const response = await api.post('/categories', { name: newCategoryName });
            setCategories((current) => [...current, response.data.data]);
            setNewCategoryName('');
            setCategoryMessage('Kategori eklendi.');
        } catch (err) {
            setCategoryError(err.response?.data?.error || 'Kategori eklenemedi.');
        } finally {
            setSavingCategory(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await api.delete(`/categories/${categoryId}`);
            setCategories((current) => current.filter((category) => category._id !== categoryId));
        } catch (err) {
            setCategoryError(err.response?.data?.error || 'Kategori silinemedi.');
        }
    };

    const handleStatusUpdate = async (postId, status) => {
        setUpdatingPostId(postId);
        setPageError('');

        try {
            const response = await api.put(`/posts/${postId}/status`, { status });
            setPosts((current) =>
                current.map((post) => (post._id === postId ? response.data.data : post))
            );
        } catch (err) {
            setPageError(err.response?.data?.error || 'Yazi durumu guncellenemedi.');
        } finally {
            setUpdatingPostId('');
        }
    };

    if (loading || loadingData) {
        return <div className="text-center my-8">Yukleniyor...</div>;
    }

    if (!user) {
        return (
            <div className="card text-center" style={{ maxWidth: '640px', margin: '2rem auto' }}>
                <h1 className="text-2xl mb-4">Admin Paneli</h1>
                <p className="text-gray mb-4">Bu alani gormek icin giris yapmaniz gerekiyor.</p>
                <Link to="/login" className="btn btn-primary">Giris Yap</Link>
            </div>
        );
    }

    if (user.role !== 'admin') {
        return (
            <div className="card text-center" style={{ maxWidth: '640px', margin: '2rem auto' }}>
                <h1 className="text-2xl mb-4">Admin Paneli</h1>
                <p className="text-gray">Bu sayfa sadece admin kullanicilar icindir.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            <section className="card">
                <h1 className="text-2xl mb-2">Admin Paneli</h1>
                <p className="text-gray mb-4">Kategori yonetimi ve yazi moderasyonu buradan yapilir.</p>
                {pageError && <div className="text-sm" style={{ color: 'var(--danger-color)' }}>{pageError}</div>}
            </section>

            <section className="card">
                <h2 className="text-xl mb-4">Kategoriler</h2>

                {categoryMessage && <div className="mb-4 text-sm" style={{ color: 'var(--success-color)' }}>{categoryMessage}</div>}
                {categoryError && <div className="mb-4 text-sm" style={{ color: 'var(--danger-color)' }}>{categoryError}</div>}

                <form onSubmit={handleAddCategory} style={{ marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label className="form-label">Yeni Kategori</label>
                        <input
                            type="text"
                            className="form-input"
                            value={newCategoryName}
                            onChange={(event) => setNewCategoryName(event.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={savingCategory}>
                        {savingCategory ? 'Ekleniyor...' : 'Kategori Ekle'}
                    </button>
                </form>

                {categories.length === 0 ? (
                    <div className="text-gray">Heniz kategori yok.</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="flex items-center justify-between"
                                style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                            >
                                <div>
                                    <div style={{ fontWeight: '600' }}>{category.name}</div>
                                    <div className="text-sm text-gray">{category.slug}</div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteCategory(category._id)}
                                >
                                    Sil
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="card">
                <h2 className="text-xl mb-4">Yazi Moderasyonu</h2>

                {posts.length === 0 ? (
                    <div className="text-gray">Moderasyon icin yazi yok.</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                            >
                                <div className="flex items-center justify-between" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{post.title}</div>
                                        <div className="text-sm text-gray">
                                            {post.author?.username || 'Bilinmeyen yazar'} | {post.category?.name || 'Kategorisiz'}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '600', color: statusColors[post.status] || 'var(--text-primary)' }}>
                                        {post.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className="flex gap-2" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        disabled={updatingPostId === post._id}
                                        onClick={() => handleStatusUpdate(post._id, 'pending')}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        disabled={updatingPostId === post._id}
                                        onClick={() => handleStatusUpdate(post._id, 'approved')}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        disabled={updatingPostId === post._id}
                                        onClick={() => handleStatusUpdate(post._id, 'suspended')}
                                    >
                                        Suspend
                                    </button>
                                    <Link to={`/post/${post.slug}`} className="btn btn-secondary">
                                        Detay
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminPanel;
