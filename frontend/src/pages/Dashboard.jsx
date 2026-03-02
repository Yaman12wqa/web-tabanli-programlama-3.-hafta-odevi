import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { Edit, Trash2, Plus } from 'lucide-react';

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user) {
            setLoading(false);
            return;
        }

        const fetchMyPosts = async () => {
            try {
                const response = await api.get('/auth/me/posts');
                setPosts(response.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPosts();
    }, [authLoading, user]);

    const handleDelete = async (postId) => {
        if (!window.confirm('Bu yaziyi silmek istediginize emin misiniz?')) {
            return;
        }

        try {
            await api.delete(`/posts/${postId}`);
            setPosts((current) => current.filter((post) => post._id !== postId));
        } catch (err) {
            console.error(err);
            window.alert('Silme islemi basarisiz oldu.');
        }
    };

    if (authLoading || loading) {
        return <div className="text-center my-8">Yukleniyor...</div>;
    }

    if (!user) {
        return (
            <div className="card text-center" style={{ maxWidth: '640px', margin: '2rem auto' }}>
                <h1 className="text-2xl mb-4">Yonetim Paneli</h1>
                <p className="text-gray mb-4">Bu sayfayi gormek icin giris yapmaniz gerekiyor.</p>
                <Link to="/login" className="btn btn-primary">Giris Yap</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8" style={{ gap: '1rem', flexWrap: 'wrap' }}>
                <h1 className="text-2xl font-bold">Yonetim Paneli</h1>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                    <Link to="/profile" className="btn btn-secondary">Profil</Link>
                    {user.role === 'admin' && <Link to="/admin" className="btn btn-secondary">Admin</Link>}
                    <Link to="/create-post" className="btn btn-primary flex items-center gap-2">
                        <Plus size={18} /> Yeni Yazi
                    </Link>
                </div>
            </div>

            <div className="card mb-8">
                <h2 className="text-xl mb-4" style={{ fontWeight: '600' }}>Profil Bilgileri</h2>
                <div className="flex flex-col gap-2">
                    <p><strong className="text-gray" style={{ display: 'inline-block', minWidth: '120px' }}>Kullanici Adi:</strong> {user.username}</p>
                    <p><strong className="text-gray" style={{ display: 'inline-block', minWidth: '120px' }}>E-posta:</strong> {user.email}</p>
                    <p><strong className="text-gray" style={{ display: 'inline-block', minWidth: '120px' }}>Rol:</strong> <span style={{ textTransform: 'capitalize' }}>{user.role}</span></p>
                </div>
            </div>

            <h2 className="text-xl mb-4" style={{ fontWeight: '600' }}>Yazilarim</h2>
            {posts.length === 0 ? (
                <div className="card text-center text-gray" style={{ padding: '2rem' }}>Henuz bir yazi eklemediniz.</div>
            ) : (
                <div className="flex flex-col gap-4">
                    {posts.map((post) => (
                        <div key={post._id} className="card flex items-center justify-between" style={{ padding: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
                            <div>
                                <h3 className="text-lg" style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                                </h3>
                                <div className="text-sm text-gray flex items-center gap-3" style={{ flexWrap: 'wrap' }}>
                                    <span>
                                        Durum:
                                        <span
                                            style={{
                                                marginLeft: '0.35rem',
                                                fontWeight: '500',
                                                color:
                                                    post.status === 'approved'
                                                        ? 'var(--success-color)'
                                                        : post.status === 'pending'
                                                            ? 'orange'
                                                            : 'var(--danger-color)'
                                            }}
                                        >
                                            {post.status.toUpperCase()}
                                        </span>
                                    </span>
                                    <span>Kategori: {post.category?.name || 'Kategorisiz'}</span>
                                </div>
                            </div>

                            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                                <Link to={`/edit-post/${post._id}`} className="btn btn-secondary flex items-center gap-1 text-sm" style={{ padding: '0.4rem 0.8rem' }}>
                                    <Edit size={16} /> Duzenle
                                </Link>
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="btn btn-danger flex items-center gap-1 text-sm"
                                    style={{ padding: '0.4rem 0.8rem' }}
                                >
                                    <Trash2 size={16} /> Sil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
