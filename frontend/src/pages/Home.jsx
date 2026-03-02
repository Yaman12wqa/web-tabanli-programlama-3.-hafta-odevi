import { useState, useEffect } from 'react';
import api from '../api';
import PostCard from '../components/PostCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts');
                setPosts(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center my-8">Yükleniyor...</div>;

    return (
        <div>
            <div className="text-center mb-12 mt-8">
                <h1 className="text-3xl mb-4 font-bold">BEUBlog'a Hoş Geldiniz</h1>
                <p className="text-gray text-lg max-w-2xl mx-auto">En güncel yazıları keşfedin. Modern ve hızlı blog platformu.</p>
            </div>

            {posts.length === 0 ? (
                <div className="card text-center text-gray py-12">Henüz yazı bulunmamaktadır.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
