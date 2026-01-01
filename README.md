# MONOSTORE - E-commerce Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Live Demo
**Website:** [https://bhuvanachandra14.github.io/MONOSTORE/](https://bhuvanachandra14.github.io/MONOSTORE/)

## ✨ Features
- **User Authentication**: Login and Registration with JWT.
- **Product Browsing**: View products with details and images.
- **Shopping Cart**: Add, remove, and update quantities.
- **Checkout**: streamlined checkout process with Razorpay integration.
- **Account Management**: 
    - Save multiple shipping addresses.
    - View order history.
- **Admin Panel**: Add and manage products (Admin users only).

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Payment Gateway**: Razorpay
- **Deployment**:
    - Frontend: GitHub Pages
    - Backend: Render

## 📦 Setup & Installation

### Prerequisites
- Node.js installed
- MongoDB URI

### Backend
1. Go to `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend
1. Go to `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

## 📄 License
This project is open source.
