import React from 'react';
import { Link } from 'react-router-dom';
import { PenTool, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="brand-logo">
            <div className="brand-icon">
              <PenTool size={20} color="#ffffff" />
            </div>
            <span className="brand-title">
              Blog<span className="brand-accent">Craft</span>
            </span>
          </Link>
          <p className="footer-desc">
            A modern, full-stack blogging platform built for creators, developers, and storytellers.
          </p>
        </div>

        <div className="footer-links">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/blogs">Explore Blogs</Link></li>
            <li><Link to="/create">Write a Post</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/my-blogs">Manage Blogs</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} BlogCraft MERN Application. Built with React, Express, Node.js & MongoDB.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
