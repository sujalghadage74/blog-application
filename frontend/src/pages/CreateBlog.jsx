import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import Toast from '../components/Toast';
import { PenTool, Upload, Image as ImageIcon, X, ArrowLeft } from 'lucide-react';

const CreateBlog = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WEBP, or GIF)');
      return;
    }

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file size must be less than 5MB');
      return;
    }

    setErrorMessage('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a blog title');
      return;
    }

    // Strip empty HTML tags from content check
    const tempText = content.replace(/<[^>]*>/g, '').trim();
    if (!tempText) {
      setErrorMessage('Please enter blog content');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await api.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setToastMessage('Blog post published successfully!');
        setTimeout(() => {
          navigate(`/blogs/${res.data.blog._id}`);
        }, 800);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-page-container">
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      <Toast message={errorMessage} type="error" onClose={() => setErrorMessage('')} />

      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h1>Create New Article</h1>
            <p>Share your ideas with high-quality rich formatting and images</p>
          </div>
          <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
            <ArrowLeft size={16} />
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title">Article Title</label>
            <input
              type="text"
              id="title"
              placeholder="e.g. Building Scalable Web Apps with Node & React"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
              required
            />
          </div>

          {/* Cover Image Upload */}
          <div className="form-group">
            <label>Cover Image (Optional)</label>
            {imagePreview ? (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Cover Preview" className="image-preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                  title="Remove image"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="file-dropzone">
                <input
                  type="file"
                  id="coverImage"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="file-input-hidden"
                />
                <label htmlFor="coverImage" className="dropzone-label">
                  <div className="dropzone-icon">
                    <Upload size={24} color="#6366f1" />
                  </div>
                  <span className="dropzone-text">Click to upload cover image</span>
                  <span className="dropzone-subtext">PNG, JPG, WEBP or GIF up to 5MB</span>
                </label>
              </div>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="form-group">
            <label>Article Content</label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your story here..."
            />
          </div>

          {/* Submit Action */}
          <div className="form-actions-bar">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/blogs')}
            >
              Save Draft
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <PenTool size={18} />
              {loading ? 'Publishing Post...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
