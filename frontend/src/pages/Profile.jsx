import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, FileText, PlusSquare, Shield } from 'lucide-react';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        if (res.data.success) {
          setProfile(res.data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentUser = profile || authUser;

  if (loading) {
    return (
      <div className="spinner-center-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="profile-header-banner">
            <div className="profile-avatar-xl">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          <div className="profile-content">
            <h2 className="profile-name">{currentUser?.name}</h2>
            <div className="profile-badge">
              <Shield size={14} />
              <span>Verified Author</span>
            </div>

            <div className="profile-details-grid">
              <div className="detail-item">
                <Mail size={18} className="detail-icon" />
                <div>
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{currentUser?.email}</span>
                </div>
              </div>

              <div className="detail-item">
                <Calendar size={18} className="detail-icon" />
                <div>
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">{formatDate(currentUser?.createdAt)}</span>
                </div>
              </div>

              <div className="detail-item">
                <FileText size={18} className="detail-icon" />
                <div>
                  <span className="detail-label">Articles Published</span>
                  <span className="detail-value">{currentUser?.blogCount ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/my-blogs" className="btn btn-outline">
                <FileText size={18} />
                Manage My Blogs
              </Link>
              <Link to="/create" className="btn btn-primary">
                <PlusSquare size={18} />
                Write New Post
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
