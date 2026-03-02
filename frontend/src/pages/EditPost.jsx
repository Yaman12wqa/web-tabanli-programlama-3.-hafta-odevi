import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryResponse, postResponse] = await Promise.all([
                    api.get('/categories'),
                    api.get('/auth/me/posts')
                ]);

                setCategories(categoryResponse.data.data);

                const post = postResponse.data.data.find((item) => item._id === id);
                if (!post) {
                    setError('Post not found or you do not have permission.');
                    setFetching(false);
                    return;
                }

                setTitle(post.title);
                setContent(post.content);
                setCategoryId(post.category?._id || categoryResponse.data.data[0]?._id || '');
                setCurrentImage(post.coverImage || '');
            } catch (err) {
                setError('Failed to load post data.');
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (!image) {
            setImagePreview('');
            return;
        }

        const objectUrl = URL.createObjectURL(image);
        setImagePreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [image]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            let coverImage = currentImage;

            if (image) {
                const formData = new FormData();
                formData.append('image', image);

                const uploadResponse = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                coverImage = uploadResponse.data.data;
            }

            await api.put(`/posts/${id}`, {
                title,
                content,
                category: categoryId,
                coverImage
            });

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while updating the post.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="text-center my-8">Yukleniyor...</div>;
    }

    return (
        <div className="card max-w-4xl mx-auto">
            <h1 className="text-2xl mb-6 font-bold">Yaziyi Duzenle</h1>
            {error && <div className="mb-4 text-center text-sm" style={{ color: 'var(--danger-color)' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Baslik</label>
                    <input
                        type="text"
                        className="form-input"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Kategori</label>
                    <select
                        className="form-input"
                        value={categoryId}
                        onChange={(event) => setCategoryId(event.target.value)}
                        required
                    >
                        <option value="" disabled>Seciniz</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Kapak Gorseli (degistirmek icin yeni secin)</label>
                    {(imagePreview || currentImage) && (
                        <div className="mb-2">
                            <img
                                src={imagePreview || `http://localhost:5000${currentImage}`}
                                alt="Cover"
                                style={{
                                    width: '220px',
                                    height: '120px',
                                    borderRadius: 'var(--radius-md)',
                                    objectFit: 'cover',
                                    border: '1px solid var(--border-color)'
                                }}
                            />
                        </div>
                    )}
                    <input
                        type="file"
                        className="form-input"
                        accept="image/*"
                        onChange={(event) => setImage(event.target.files?.[0] || null)}
                    />
                </div>

                <div className="form-group mb-12">
                    <label className="form-label">Icerik</label>
                    <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: '300px' }} />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Iptal</button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Kaydediliyor...' : 'Degisiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;
