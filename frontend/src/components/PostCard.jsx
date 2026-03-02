import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    return (
        <div className="card flex flex-col" style={{ height: '100%' }}>
            {post.coverImage && (
                <div style={{ margin: '-1.5rem -1.5rem 1.5rem -1.5rem', overflow: 'hidden', borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)' }}>
                    <img src={`http://localhost:5000${post.coverImage}`} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                </div>
            )}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>{post.category?.name}</span>
                    <span className="text-sm text-gray">{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <Link to={`/post/${post.slug}`}>
                    <h3 className="text-xl mb-2 hover:text-[var(--accent-primary)] transition" style={{ transition: 'color 0.2s' }}>{post.title}</h3>
                </Link>
                <div className="text-gray text-sm mb-4" dangerouslySetInnerHTML={{ __html: post.content.substring(0, 100) + '...' }} />
            </div>

            <div className="flex items-center justify-between mt-auto pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2">
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        {post.author?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium">{post.author?.username}</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
