import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import DeleteModal from '../components/DeleteModal';
import Toast from '../components/Toast';
import { PenTool, FileText, Plus } from 'lucide-react';

const MyBlogs = () => {
  const { user } = useAuth();
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchMyBlogs = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/blogs?author=${user._id}`);
      if (res.data.success) {
        setMyBlogs(res.data.blogs);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load your blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, [user]);

  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBlog) return;
    setIsDeleting(true);
    try {
      const res = await api.delete(`/blogs/${selectedBlog._id}`);
      if (res.data.success) {
        setToastMessage('Blog post deleted successfully');
        setMyBlogs(myBlogs.filter((b) => b._id !== selectedBlog._id));
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete blog post');
    } finally {
      setIsDeleting(false);
      setSelectedBlog(null);
    }
  };

  return (
    <div className="page-container">
      <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />
      <Toast message={errorMessage} type="error" onClose={() => setErrorMessage('')} />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={selectedBlog?.title || ''}
        isDeleting={isDeleting}
      />

      <div className="my-blogs-header">
        <div>
          <h1>My Articles</h1>
          <p>Manage, edit, or remove your published blog posts</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          <Plus size={18} />
          Create New Post
        </Link>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : myBlogs.length > 0 ? (
        <>
          <div className="blogs-count-bar">
            <span>Published ({myBlogs.length})</span>
          </div>
          <div className="blogs-grid">
            {myBlogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                isOwner={true}
                onDeleteClick={handleDeleteClick}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={40} color="#9ca3af" />
          </div>
          <h3>You haven't written any blogs yet</h3>
          <p>Share your stories, insights, or technical guides with the community.</p>
          <Link to="/create" className="btn btn-primary mt-4">
            <PenTool size={18} />
            Write Your First Post
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
