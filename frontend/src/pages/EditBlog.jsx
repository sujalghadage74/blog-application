import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';
import Toast from '../components/Toast';
import { Edit3, Upload, X, ArrowLeft } from 'lucide-react';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      setInitialLoading(true);
      try {
        const res = await api.get(`/blogs/${id}`);
        if (res.data.success) {
          const blog = res.data.blog;

          // Ownership check
          if (blog.author && blog.author._id !== user?._id && blog.author !== user?._id) {
            setErrorMessage('Unauthorized: You can only edit your own posts.');
            setTimeout(() => navigate('/my-blogs'), 1500);
            return;
          }

          setTitle(blog.title || '');
          setContent(blog.content || '');
          setExistingImage(blog.image || '');
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to fetch blog post');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchBlog();
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select a valid image file (JPEG, PNG, WEBP, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file size must be less than 5MB');
      return;
    }

    setErrorMessage('');
    setNewImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveNewImage = () => {
    setNewImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Please enter a blog title');
      return;
    }

    const tempText = content.replace(/<[^>]*>/g, '').trim();
    if (!tempText) {
      setErrorMessage('Please enter blog content');
      return;
    }

    setSubmitLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (newImageFile) {
        formData.append('image', newImageFile);
      }

      const res = await api.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setToastMessage('Blog post updated successfully!');
        setTimeout(() => {
          navigate(`/blogs/${id}`);
        }, 800);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update blog post');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="spinner-center-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const currentDisplayImage = imagePreview || (existingImage ? getImageUrl(existingImage) : null);

  return (
    <div className="editor-page-container">
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      <Toast message={errorMessage} type="error" onClose={() => setErrorMessage('')} />

      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h1>Edit Article</h1>
            <p>Update your title, content, or cover image</p>
          </div>
          <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm">
            <ArrowLeft size={16} />
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label htmlFor="title">Article Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            {currentDisplayImage ? (
              <div className="image-preview-wrapper">
                <img src={currentDisplayImage} alt="Cover Preview" className="image-preview" />
                {imagePreview ? (
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleRemoveNewImage}
                    title="Remove new selection"
                  >
                    <X size={18} />
                  </button>
                ) : (
                  <div className="change-image-badge">
                    <span>Current Image</span>
                  </div>
                )}
              </div>
            ) : null}

            <div className="file-dropzone mt-2">
              <input
                type="file"
                id="editCoverImage"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="file-input-hidden"
              />
              <label htmlFor="editCoverImage" className="dropzone-label">
                <div className="dropzone-icon">
                  <Upload size={20} color="#6366f1" />
                </div>
                <span className="dropzone-text">
                  {currentDisplayImage ? 'Click to replace cover image' : 'Click to upload cover image'}
                </span>
                <span className="dropzone-subtext">PNG, JPG, WEBP or GIF up to 5MB</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Article Content</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div className="form-actions-bar">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/blogs/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitLoading}>
              <Edit3 size={18} />
              {submitLoading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
