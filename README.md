# 🎟️ Premier League Ticket Booking System

A full-stack football match ticket booking platform built with **React**, **Node.js**, and **MySQL**.

The system allows users to browse Premier League matches, view stadium seat maps, book tickets, apply discounts, and complete secure online payments.

---

# 🚀 Features

## 🔐 Authentication & Authorization
- JWT Authentication
- Google OAuth 2.0 Login (Passport.js)
- Role-based Access Control (Admin / User)

## ⚽ Match & Stadium Management
- Manage football matches
- Manage teams & stadiums
- Seat section management

## 🎟️ Ticket Booking
- Online ticket booking system
- Booking history tracking
- Invoice generation

## 💳 Payment Integration
- MoMo payment gateway integration
- Secure payment processing

## 🖼️ Media Upload
- Upload stadium & team images using Cloudinary

## 📧 Email Services
- Send booking confirmations
- OTP verification using Nodemailer

## ⏰ Automated Background Jobs
- Ticket status updates using Node-cron

---

# 🧰 Technologies Used

| Category | Technologies |
|----------|--------------|
| Frontend | React, TypeScript, Ant Design, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL, Sequelize ORM |
| Authentication | JWT, bcrypt, Passport.js |
| Cloud Storage | Cloudinary |
| Email Service | Nodemailer |
| Payments | MoMo API |
| API Style | RESTful APIs |
| Package Manager | npm |

---

# 🏗️ Project Structure

```bash
Ticket-Web/
├── be/ (Backend)
│   ├── src/
│   │   ├── config/       # Database, Cloudinary, MoMo configuration
│   │   ├── controllers/  # REST Controllers
│   │   ├── middlewares/  # Validation & authentication middlewares
│   │   ├── models/       # Sequelize entities/models
│   │   ├── routes/       # API route definitions
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utilities & cron jobs
│   └── .env
│
└── fe/ (Frontend)
    ├── public/
    ├── src/
    └── package.json
```

---

# 🔌 Main API Endpoints

## 👤 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and get JWT token |
| POST | `/api/auth/register` | Register a new user |
| GET | `/api/auth/google` | Login with Google OAuth |

---

## ⚽ Matches & Stadiums

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches` | Get all football matches |
| GET | `/api/matches/:id` | Get match details |
| GET | `/api/stadiums` | Get stadiums & seat sections |
| GET | `/api/teams` | Get participating teams |

---

## 🎟️ Bookings & Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create ticket booking |
| GET | `/api/bookings/user/:id` | Get user booking history |
| POST | `/api/payment/momo` | Initiate MoMo payment |
| POST | `/api/invoices` | Generate invoice |

---

# ▶️ Getting Started

## 📋 Prerequisites

- Node.js (v16 or newer)
- npm
- MySQL (v8+)
- Cloudinary Account
- MoMo Sandbox Account

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Minh-Ha-04/Ticket-Web.git
cd Ticket-Web
```

---

## 2️⃣ Backend Setup

```bash
cd be
npm install
```

Create a `.env` file inside the `be/` directory:

```env
PORT=5000

DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=ticket_db

JWT_SECRET=your_jwt_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

CLIENT_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
```

Run backend server:

```bash
npm run dev
```

---

## 3️⃣ Frontend Setup

```bash
cd ../fe
npm install
npm start
```

Frontend runs at:

```bash
http://localhost:3000
```

---

# 📧 Core Functionalities

- User Authentication
- Google Login
- Ticket Booking
- Online Payment
- Email Confirmation
- Discount Application
- Invoice Generation
- Admin Dashboard Management

---

# 🤝 Contributing

```bash
git checkout -b feature/amazing-feature
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

Then open a Pull Request 🚀

---

# 👨‍💻 Contributors

- **Minh Hà** – Fullstack Developer

GitHub:  
https://github.com/Minh-Ha-04

---

# 📄 License

This project is for educational and internship purposes only.
