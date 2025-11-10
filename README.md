# 🛍️ Glimpse - E-commerce Backend API

<div align="center">

![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20TypeScript-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cache](https://img.shields.io/badge/Cache-Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Deployed](https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)

</div>

---

A robust and scalable e-commerce backend API built with modern technologies for high performance and reliability.

## ✨ Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with refresh tokens
- 📦 **Product Management**: CRUD operations for products with search and filtering
- 🛒 **Shopping Cart**: Persistent cart management with Redis caching
- 📋 **Order Processing**: Complete order lifecycle management
- ⭐ **Review System**: Product reviews and ratings
- 🛡️ **Rate Limiting**: Redis-backed rate limiting for API protection
- ⚡ **Caching**: Redis caching for improved performance
- 📧 **Email Notifications**: Nodemailer integration for transactional emails

## 🚀 Tech Stack

| Category           | Technologies                          |
| ------------------ | ------------------------------------- |
| **Runtime**        | Node.js + TypeScript                  |
| **Framework**      | Express.js                            |
| **Database**       | MongoDB + Mongoose ODM                |
| **Cache**          | Redis                                 |
| **Authentication** | JWT (jsonwebtoken)                    |
| **Security**       | Helmet, bcryptjs, CORS, Rate Limiting |
| **Email**          | Nodemailer                            |

## 🏁 Getting Started

### 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis

### 📥 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd glimpse-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- Database connection strings
- JWT secrets
- Redis URL
- Email credentials
- Admin secret

4. Build the project:

```bash
npm run build
```

5. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

**Base URL**: `/api/v1`

### 🔐 Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### 📦 Products

- `GET /products` - Get all products (with filters)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### 🛒 Cart

- `GET /cart` - Get user cart
- `POST /cart` - Add item to cart
- `PUT /cart/:itemId` - Update cart item
- `DELETE /cart/:itemId` - Remove item from cart

### 📋 Orders

- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status (admin)

### ⭐ Reviews

- `GET /reviews/product/:productId` - Get product reviews
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

## 🚀 Deployment

This application is deployed on [Render](https://render.com).

### 🔧 Environment Variables on Render

Make sure to set all required environment variables in your Render dashboard:

- `MONGODB_URI_PROD` - Production MongoDB connection string
- `REDIS_URL` - Redis connection URL
- `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_RESET_SECRET`
- `EMAIL_USER`, `EMAIL_PASS`
- `ADMIN_SECRET`
- `FRONTEND_URL`
- `NODE_ENV=production`

### 🔨 Build Command

```bash
npm install && npm run build
```

### ▶️ Start Command

```bash
npm start
```

## 📁 Project Structure

```
src/
├── config/         # Configuration files (DB, Redis)
├── controllers/    # Route controllers
├── middleware/     # Custom middleware (auth, rate limiting, error handling)
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions (cache, helpers)
└── app.ts          # Application entry point
```

## 🔒 Security Features

- 🛡️ Helmet for security headers
- 🌐 CORS configuration
- ⏱️ Rate limiting with Redis
- 🔑 JWT token authentication
- 🔐 Password hashing with bcryptjs
- ✅ Input validation and sanitization

---

<div align="center">

Made with ❤️ for E-commerce

![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

</div>
