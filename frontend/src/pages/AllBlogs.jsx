import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BlogCard from '../components/BlogCard';
import { Search, X, BookOpen, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const fetchBlogs = async (query = '') => {
    setLoading(true);
    try {
      const endpoint = query ? `/blogs?search=${encodeURIComponent(query)}` : '/blogs';
      const res = await api.get(endpoint);
      if (res.data.success) {
        setBlogs(res.data.blogs);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(activeSearch);
  }, [activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearch('');
  };

  return (
    <div className="page-container">
      <div className="blogs-header">
        <div className="blogs-header-text">
          <h1>Explore Articles</h1>
          <p>Read insightful articles written by creators and engineers</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search blogs by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="clear-search-btn" onClick={handleClearSearch}>
              <X size={16} />
            </button>
          )}
          <button type="submit" className="search-submit-btn">
            Search
          </button>
        </form>
      </div>

      {activeSearch && (
        <div className="search-results-info">
          <span>Showing results for: <strong>"{activeSearch}"</strong></span>
          <button onClick={handleClearSearch} className="reset-filter-btn">
            Clear Filter
          </button>
        </div>
      )}

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : blogs.length > 0 ? (
        <div className="blogs-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <BookOpen size={40} color="#9ca3af" />
          </div>
          <h3>No blogs found</h3>
          <p>
            {activeSearch
              ? `We couldn't find any articles matching "${activeSearch}".`
              : 'There are no published blog posts yet.'}
          </p>
          {activeSearch ? (
            <button onClick={handleClearSearch} className="btn btn-outline mt-4">
              Clear Search
            </button>
          ) : (
            <Link to="/create" className="btn btn-primary mt-4">
              <PenTool size={18} />
              Write First Article
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
