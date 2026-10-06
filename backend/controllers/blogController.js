const Blog = require('../models/Blog');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Helper to safely delete image file
const removeLocalFile = (imagePath) => {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  const fileName = path.basename(imagePath);
  const fullPath = path.join(__dirname, '..', 'uploads', fileName);
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error('Error deleting image file:', err);
    });
  }
};

// @desc    Get all blogs (with optional search and author filters)
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res) => {
  try {
    const { search, author } = req.query;
    let query = {};

    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid author ID format',
        });
      }
      query.author = author;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { content: searchRegex }];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching blogs',
    });
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format',
      });
    }

    const blog = await Blog.findById(id).populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching blog',
    });
  }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private
const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Blog title is required',
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Blog content is required',
      });
    }

    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      image: imagePath,
      author: req.user._id,
    });

    const populatedBlog = await Blog.findById(blog._id).populate(
      'author',
      'name email'
    );

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      blog: populatedBlog,
    });
  } catch (error) {
    console.error('Create blog error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating blog post',
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private (Owner only)
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format',
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own posts',
      });
    }

    if (title && title.trim()) {
      blog.title = title.trim();
    }
    if (content && content.trim()) {
      blog.content = content.trim();
    }

    if (req.file) {
      // Delete old local file if replacing
      if (blog.image) {
        removeLocalFile(blog.image);
      }
      blog.image = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await blog.save();
    const populatedBlog = await Blog.findById(updatedBlog._id).populate(
      'author',
      'name email'
    );

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      blog: populatedBlog,
    });
  } catch (error) {
    console.error('Update blog error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating blog post',
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Owner only)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format',
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own posts',
      });
    }

    // Remove local file if exists
    if (blog.image) {
      removeLocalFile(blog.image);
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting blog post',
    });
  }
};

module.exports = {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
