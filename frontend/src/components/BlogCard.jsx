import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import { Calendar, User, ArrowRight, Edit3, Trash2, Eye } from 'lucide-react';

const BlogCard = ({ blog, isOwner = false, onDeleteClick }) => {
  const [imgError, setImgError] = useState(false);

  // Helper to extract plain text excerpt from HTML content
  const getExcerpt = (htmlContent, length = 120) => {
    if (!htmlContent) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const imageUrl = getImageUrl(blog.image);

  return (
    <article className="blog-card">
      <div className="blog-card-image-wrapper">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={blog.title}
            className="blog-card-image"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="blog-card-image-fallback">
            <span>{blog.title.charAt(0).toUpperCase()}</span>
          </div>
        )}
      </div>

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span className="meta-author">
            <User size={14} />
            {blog.author?.name || 'Anonymous Writer'}
          </span>
          <span className="meta-date">
            <Calendar size={14} />
            {formatDate(blog.createdAt)}
          </span>
        </div>

        <h3 className="blog-card-title">
          <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
        </h3>

        <p className="blog-card-excerpt">{getExcerpt(blog.content)}</p>

        {isOwner ? (
          <div className="blog-card-actions">
            <Link to={`/blogs/${blog._id}`} className="card-action-btn view-btn">
              <Eye size={16} />
              View
            </Link>
            <Link to={`/edit/${blog._id}`} className="card-action-btn edit-btn">
              <Edit3 size={16} />
              Edit
            </Link>
            <button
              onClick={() => onDeleteClick && onDeleteClick(blog)}
              className="card-action-btn delete-btn"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        ) : (
          <div className="blog-card-footer">
            <Link to={`/blogs/${blog._id}`} className="read-more-btn">
              <span>Read Article</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};

export default BlogCard;
