# School Website Backend API

Backend API for the school website built with Node.js, Express.js, and MongoDB.

## Features

- RESTful API architecture
- JWT authentication
- MongoDB database with Mongoose ODM
- Image upload support
- CORS enabled
- Environment-based configuration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_website
JWT_SECRET=your_secret_key
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. Start MongoDB (make sure MongoDB is installed and running)

5. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current admin (protected)

### Hero Section
- `GET /api/hero` - Get hero section
- `PUT /api/hero/:id` - Update hero section (protected)

### About Section
- `GET /api/about` - Get about section
- `PUT /api/about/:id` - Update about section (protected)

### Admissions
- `GET /api/admissions` - Get admission info
- `PUT /api/admissions/:id` - Update admission info (protected)

### Gallery
- `GET /api/gallery` - Get all gallery items
- `GET /api/gallery/categories` - Get gallery categories
- `GET /api/gallery/:id` - Get single gallery item
- `POST /api/gallery` - Create gallery item (protected)
- `PUT /api/gallery/:id` - Update gallery item (protected)
- `DELETE /api/gallery/:id` - Delete gallery item (protected)

### Contact
- `GET /api/contact` - Get contact info
- `PUT /api/contact/:id` - Update contact info (protected)

## Default Admin Credentials

After first registration, you can login with your credentials. To create the first admin, use the `/api/auth/register` endpoint.

## Project Structure

```
backend/
├── models/          # Mongoose models
├── routes/          # API routes
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── uploads/         # Uploaded files
├── .env            # Environment variables
└── server.js       # Entry point
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing
# backend-school
