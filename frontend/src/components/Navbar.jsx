import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PenTool,
  Home,
  BookOpen,
  PlusSquare,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
  FileText,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon">
            <PenTool size={22} color="#ffffff" />
          </div>
          <span className="brand-title">
            Blog<span className="brand-accent">Craft</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          <Link
            to="/blogs"
            className={`nav-link ${isActive('/blogs') ? 'active' : ''}`}
          >
            <BookOpen size={18} />
            <span>Explore Blogs</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-blogs"
                className={`nav-link ${isActive('/my-blogs') ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>My Blogs</span>
              </Link>

              <Link
                to="/create"
                className={`nav-link create-btn ${isActive('/create') ? 'active' : ''}`}
              >
                <PlusSquare size={18} />
                <span>Write Post</span>
              </Link>
            </>
          ) : null}
        </nav>

        {/* User Auth Section */}
        <div className="desktop-auth">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <Link
                to="/profile"
                className={`user-badge ${isActive('/profile') ? 'active' : ''}`}
              >
                <div className="avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name">{user?.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="logout-button"
                title="Logout"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">
                <LogIn size={18} />
                <span>Login</span>
              </Link>

              <Link to="/register" className="register-btn">
                <UserPlus size={18} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <Link
            to="/"
            className={`mobile-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>

          <Link
            to="/blogs"
            className={`mobile-link ${isActive('/blogs') ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <BookOpen size={20} />
            <span>Explore Blogs</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-blogs"
                className={`mobile-link ${isActive('/my-blogs') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText size={20} />
                <span>My Blogs</span>
              </Link>

              <Link
                to="/create"
                className={`mobile-link ${isActive('/create') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlusSquare size={20} />
                <span>Write Post</span>
              </Link>

              <Link
                to="/profile"
                className={`mobile-link ${isActive('/profile') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={20} />
                <span>Account Profile ({user?.name})</span>
              </Link>

              <button
                onClick={handleLogout}
                className="mobile-link logout-mobile"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="mobile-auth-buttons">
              <Link
                to="/login"
                className="mobile-login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>

              <Link
                to="/register"
                className="mobile-register"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus size={20} />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
