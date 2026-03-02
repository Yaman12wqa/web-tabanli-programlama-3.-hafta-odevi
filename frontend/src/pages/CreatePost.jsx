import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../api';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategories(response.data.data);

                if (response.data.data.length > 0) {
                    setCategoryId(response.data.data[0]._id);
                }
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };

        fetchCategories();
    }, []);

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

        if (!categoryId) {
            setError('Please choose a category first.');
            setLoading(false);
            return;
        }

        try {
            let coverImage = '';

            if (image) {
                const formData = new FormData();
                formData.append('image', image);

                const uploadResponse = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                coverImage = uploadResponse.data.data;
            }

            await api.post('/posts', {
                title,
                content,
                category: categoryId,
                coverImage
            });

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while creating the post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card max-w-4xl mx-auto">
            <h1 className="text-2xl mb-6 font-bold">Yeni Yazi Olustur</h1>
            {error && <div className="mb-4 text-center text-sm" style={{ color: 'var(--danger-color)' }}>{error}</div>}

            {categories.length === 0 && (
                <div className="mb-4 text-sm" style={{ color: 'orange' }}>
                    Sistemde henuz kategori yok. Bir admin once kategori eklemeli.
                </div>
            )}

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
                    <label className="form-label">Kapak Gorseli</label>
                    <input
                        type="file"
                        className="form-input"
                        accept="image/*"
                        onChange={(event) => setImage(event.target.files?.[0] || null)}
                    />

                    {imagePreview && (
                        <div className="mt-4">
                            <img
                                src={imagePreview}
                                alt="Preview"
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
                </div>

                <div className="form-group mb-12">
                    <label className="form-label">Icerik</label>
                    <ReactQuill theme="snow" value={content} onChange={setContent} style={{ height: '300px' }} />
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Iptal</button>
                    <button type="submit" className="btn btn-primary" disabled={loading || categories.length === 0}>
                        {loading ? 'Kaydediliyor...' : 'Yaziyi Gonder'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
