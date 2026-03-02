import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/posts/by-slug/${slug}`);
                setPost(res.data.data);
            } catch (err) {
                setError('Yazı bulunamadı');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    const handleLike = async () => {
        if (!user) return navigate('/login');
        try {
            const res = await api.put(`/posts/${post._id}/like`);
            setPost({ ...post, likes: res.data.data });
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center my-12">Yükleniyor...</div>;
    if (error || !post) return <div className="text-center my-12 text-xl" style={{ color: 'var(--danger-color)' }}>{error || 'Yazı bulunamadı'}</div>;

    const likedUserIds = (post.likes || []).map((like) => (
        typeof like === 'string' ? like : like.toString()
    ));
    const isLiked = user ? likedUserIds.includes(user.id) : false;

    return (
        <article className="max-w-4xl mx-auto">
            {post.coverImage && (
                <div className="mb-8" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                    <img src={`http://localhost:5000${post.coverImage}`} alt={post.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
                </div>
            )}

            <div className="mb-8 text-center">
                <span className="text-sm font-medium uppercase tracking-wider mb-4 inline-block" style={{ color: 'var(--accent-primary)', backgroundColor: 'var(--bg-secondary)', padding: '0.35rem 1rem', borderRadius: '9999px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    {post.category?.name || 'Kategorisiz'}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

                <div className="flex items-center justify-center gap-4 text-gray text-sm">
                    <div className="flex items-center gap-3">
                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: 'var(--shadow-sm)' }}>
                            {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="text-left">
                            <div className="font-semibold text-primary" style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{post.author?.username}</div>
                            <div>{new Date(post.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                    </div>
                </div>
            </div>

            {post.status !== 'approved' && (
                <div className="card mb-8" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                    <strong style={{ display: 'block', marginBottom: '0.35rem' }}>Moderation status</strong>
                    <span className="text-sm text-gray">This post is currently {post.status} and is visible because you have access to it.</span>
                </div>
            )}

            <div className="card mb-12" style={{ padding: '2rem', border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}>
                <div className="quill-content" dangerouslySetInnerHTML={{ __html: post.content }} style={{ fontSize: '1.125rem', lineHeight: '1.8' }} />
            </div>

            <div className="flex items-center justify-between border-t border-b py-6 mb-12" style={{ borderColor: 'var(--border-color)' }}>
                <button
                    onClick={handleLike}
                    className={`btn flex items-center gap-2 ${isLiked ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-xl)' }}
                >
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    {isLiked ? 'Beğendin' : 'Beğen'} ({post.likes.length})
                </button>
            </div>
        </article>
    );
};

export default PostDetail;
