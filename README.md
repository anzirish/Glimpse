<div align="center">

# 🛍️ Glimpse E-commerce Backend

### A robust and scalable e-commerce API built with modern technologies

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-glimpse--backend-4A90E2?style=for-the-badge)](https://glimpse-backend-9gln.onrender.com/health)
[![Status](https://img.shields.io/badge/Status-Live-00C853?style=for-the-badge)](https://glimpse-backend-9gln.onrender.com/health)

</div>

<div align="center">

### 🛠️ Built With

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

</div>

---

## 🌟 Live API

**Base URL:** `https://glimpse-backend-9gln.onrender.com`

**Health Check:** [https://glimpse-backend-9gln.onrender.com/health](https://glimpse-backend-9gln.onrender.com/health)

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

<table>
<tr>
<td align="center" width="33%">
<h3>⚙️ Backend</h3>
<p>Node.js + TypeScript</p>
<p>Express.js Framework</p>
</td>
<td align="center" width="33%">
<h3>💾 Database</h3>
<p>MongoDB + Mongoose</p>
<p>Redis Cache</p>
</td>
<td align="center" width="33%">
<h3>🔐 Security</h3>
<p>JWT Authentication</p>
<p>Rate Limiting + Helmet</p>
</td>
</tr>
</table>

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

**Base URL**: `https://glimpse-backend-9gln.onrender.com/api/v1`

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

### 💡 Made with ❤️ for E-commerce

[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)
[![Deployed on Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://glimpse-backend-9gln.onrender.com)

**[API Documentation](https://glimpse-backend-9gln.onrender.com/health)** • **[Report Bug](https://github.com/anzirish/Glimpse/issues)** • **[Request Feature](https://github.com/anzirish/Glimpse/issues)**

</div>
