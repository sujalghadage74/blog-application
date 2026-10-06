import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import { PenTool, Compass, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        if (res.data.success) {
          setFeaturedBlogs(res.data.blogs.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch featured blogs:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={16} color="#4f46e5" />
            <span>Modern Blogging Platform</span>
          </div>

          <h1 className="hero-title">
            Share Your Thoughts, Code & Stories With The World
          </h1>

          <p className="hero-subtitle">
            A fast, powerful MERN stack blogging application equipped with rich text editing, secure authentication, and seamless media uploads.
          </p>

          <div className="hero-actions">
            <Link to="/create" className="btn btn-primary btn-lg">
              <PenTool size={20} />
              Start Writing
            </Link>
            <Link to="/blogs" className="btn btn-outline btn-lg">
              <Compass size={20} />
              Explore Blogs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Why Choose BlogCraft?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon icon-indigo">
                <PenTool size={24} />
              </div>
              <h3>Rich Text Editor</h3>
              <p>Format your articles with headings, bold text, lists, and links using our built-in rich text editor.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-green">
                <ShieldCheck size={24} />
              </div>
              <h3>Secure Authentication</h3>
              <p>JWT-authenticated user registration and login with encrypted password protection.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon icon-amber">
                <Zap size={24} />
              </div>
              <h3>Fast Cover Uploads</h3>
              <p>Instant cover image uploads powered by Multer with responsive card displays.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2 className="section-title text-left">Latest Articles</h2>
              <p className="section-subtitle">Discover recent stories published by our vibrant community</p>
            </div>
            <Link to="/blogs" className="view-all-link">
              <span>View all blogs</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : featuredBlogs.length > 0 ? (
            <div className="blogs-grid">
              {featuredBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No blog posts published yet. Be the first to write one!</p>
              <Link to="/create" className="btn btn-primary mt-4">
                Write First Blog
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
