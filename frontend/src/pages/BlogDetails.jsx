import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DeleteModal from '../components/DeleteModal';
import Toast from '../components/Toast';
import { Calendar, User, ArrowLeft, Edit3, Trash2, Clock } from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data.success) {
          setBlog(res.data.blog);
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.data.success) {
        setToastMessage('Blog post deleted successfully');
        setTimeout(() => {
          navigate('/my-blogs');
        }, 1000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete blog post');
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="spinner-center-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (errorMessage || !blog) {
    return (
      <div className="page-container">
        <div className="error-card">
          <h2>Blog Post Not Found</h2>
          <p>{errorMessage || 'The requested blog post could not be retrieved.'}</p>
          <Link to="/blogs" className="btn btn-primary mt-4">
            <ArrowLeft size={18} />
            Back to All Blogs
          </Link>
        </div>
      </div>
    );
  }

  const isOwner =
    isAuthenticated &&
    user &&
    blog.author &&
    (blog.author._id === user._id || blog.author === user._id);

  const imageUrl = getImageUrl(blog.image);

  return (
    <div className="blog-details-page">
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      <Toast message={errorMessage} type="error" onClose={() => setErrorMessage('')} />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={blog.title}
        isDeleting={isDeleting}
      />

      <div className="details-container">
        {/* Navigation / Actions Header */}
        <div className="details-nav-bar">
          <Link to="/blogs" className="back-link">
            <ArrowLeft size={18} />
            <span>Back to Blogs</span>
          </Link>

          {isOwner && (
            <div className="owner-actions">
              <Link to={`/edit/${blog._id}`} className="btn btn-outline btn-sm">
                <Edit3 size={16} />
                Edit Post
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-danger-outline btn-sm"
              >
                <Trash2 size={16} />
                Delete Post
              </button>
            </div>
          )}
        </div>

        {/* Title & Metadata */}
        <header className="article-header">
          <h1 className="article-title">{blog.title}</h1>

          <div className="article-meta">
            <div className="author-info">
              <div className="author-avatar-lg">
                {blog.author?.name ? blog.author.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <span className="author-name">{blog.author?.name || 'Anonymous'}</span>
                <span className="author-email">{blog.author?.email || ''}</span>
              </div>
            </div>

            <div className="date-info">
              <span className="meta-item">
                <Calendar size={16} />
                Published {formatDate(blog.createdAt)}
              </span>
              {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                <span className="meta-item updated-meta">
                  <Clock size={16} />
                  Updated {formatDate(blog.updatedAt)}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {imageUrl && (
          <div className="article-cover-container">
            <img src={imageUrl} alt={blog.title} className="article-cover-image" />
          </div>
        )}

        {/* Article Body Content */}
        <div
          className="article-body ql-editor"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
};

export default BlogDetails;
