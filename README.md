# BlogCraft - Full-Stack MERN Blogging Application

BlogCraft is a production-ready, feature-rich blogging platform constructed with the MERN stack (MongoDB, Express.js, React.js, and Node.js). It features JWT authentication, bcrypt password encryption, rich text editing, cover image uploads using Multer, post ownership controls, and full CRUD operations.

---

## 🌟 Key Features

### 1. User Authentication & Authorization
- **User Registration & Login** with validated input fields (Name, Email, Password).
- **Password Hashing** via `bcryptjs`.
- **JWT Token Management** with secure client-side storage and API interceptors.
- **Protected Routes** on both client and server sides preventing unauthorized post creation, editing, or deletion.
- **Owner Verification**: Users can only edit or delete their own articles.

### 2. Blog Post CRUD Operations
- **Create Articles** with formatted titles, rich text content, and cover images.
- **Explore & Search** articles by title or content keywords.
- **Single Article View** with complete author details, publication timestamps, and formatted HTML rendering.
- **My Articles Dashboard**: Filter and manage your published posts.
- **Delete Confirmation Modal**: Interactive dialog to prevent accidental deletion.

### 3. Rich Text Editing & Image Uploads
- **Rich Text Editor**: Integrated with Quill (`react-quill-new`) supporting headings, bold/italic formatting, bullet/ordered lists, links, and text alignments.
- **Multer Cover Uploads**: Supports local image file storage in `uploads/` directory with easy extensibility for Cloudinary/AWS S3.
- **Image Validation**: Checks allowed mime-types (JPEG, PNG, WEBP, GIF) and 5MB size limits.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite), React Router DOM v7, Axios, Lucide Icons, React Quill
- **Backend**: Node.js, Express.js, Multer, JSON Web Tokens (JWT), BcryptJS, CORS, Dotenv
- **Database**: MongoDB & Mongoose (with automated fallback to `mongodb-memory-server` if local MongoDB service is offline)
- **Styling**: Custom Responsive CSS with CSS Variables and Modern Component Tokens

---

## 📁 Project Structure

```
blog-application/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── blogController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Blog.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── blogRoutes.js
│   │   └── userRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BlogCard.jsx
│   │   │   ├── DeleteModal.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RichTextEditor.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AllBlogs.jsx
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── CreateBlog.jsx
│   │   │   ├── EditBlog.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyBlogs.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Environment Variables

Copy `backend/.env.example` to `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog-application
JWT_SECRET=super_secret_jwt_key_blog_app_2026_secure
```

---

## ⚡ Setup & Run Instructions

### 1. Backend Installation & Startup

```bash
cd backend
npm install
npm run dev
```

*The backend server will run on `http://localhost:5000`.*

### 2. Frontend Installation & Startup

```bash
cd frontend
npm install
npm run dev
```

*The frontend application will run on `http://localhost:5173`.*

---

## 📡 REST API Documentation

### Authentication Routes
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |

### User Routes
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Private | Get authenticated user profile & blog count |

### Blog Routes
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blogs` | Public | Get all published blogs (supports `?search=` and `?author=`) |
| `GET` | `/api/blogs/:id` | Public | Get blog post by ID |
| `POST` | `/api/blogs` | Private | Create a new blog post (supports cover image upload) |
| `PUT` | `/api/blogs/:id` | Private (Owner) | Update an existing blog post |
| `DELETE` | `/api/blogs/:id` | Private (Owner) | Delete a blog post |

---

## 🔮 Future Improvements

- Add Cloudinary image storage provider integration options.
- Add category tagging and bookmarking features.
- Implement post comments and like interactions.
