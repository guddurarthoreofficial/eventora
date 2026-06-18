# 🎟️ Eventora - MERN Event Booking Platform

A modern full-stack Event Booking and Management Platform built using the MERN Stack.

Users can browse events, register with OTP verification, book tickets, and manage bookings. Administrators can create, update, delete, and manage events and bookings through a professional admin dashboard.

---

# 🚀 Features

## 👥 User Features

* User Registration
* User Login & Authentication
* JWT Authorization
* Browse All Events
* View Event Details
* OTP Verification Before Booking
* Event Ticket Booking
* View My Bookings
* Responsive UI

---

## 🔐 Admin Features

* Admin Authentication
* Professional Admin Dashboard
* Create Events
* Edit Events
* Delete Events
* Manage Bookings
* View Statistics
* Revenue Tracking
* Booking Management
* Dashboard Analytics

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* React Icons
* React Toastify

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JWT (JSON Web Token)
* Protected Routes

## Email Services

* Nodemailer
* OTP Verification

---

# 📂 Project Structure

```bash
Eventora/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/eventora.git
```

```bash
cd eventora
```

---

## Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Install Backend Dependencies

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

# ▶️ Running the Project

## Start Backend

```bash
cd backend
npm run dev
```

Server:

```bash
http://localhost:3000
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```bash
http://localhost:5173
```

---

# 🔗 API Endpoints

## Authentication

### Register

```http
POST /api/users/register
```

### Login

```http
POST /api/users/login
```

---

## Events

### Get All Events

```http
GET /api/events
```

### Get Event By Id

```http
GET /api/events/:id
```

### Create Event (Admin)

```http
POST /api/events
```

### Update Event (Admin)

```http
PUT /api/events/:id
```

### Delete Event (Admin)

```http
DELETE /api/events/:id
```

---

## Bookings

### Send OTP

```http
GET /api/bookings/send-otp
```

### Create Booking

```http
POST /api/bookings
```

### Get My Bookings

```http
GET /api/bookings/my
```

### Get All Bookings (Admin)

```http
GET /api/bookings
```

### Confirm Booking

```http
POST /api/bookings/:id/confirm
```

### Cancel Booking

```http
POST /api/bookings/:id/cancel
```

---

# 📊 Admin Dashboard Modules

* Dashboard Analytics
* Create Event
* Manage Events
* Edit Event
* Manage Bookings
* User Management
* Settings
* Logout

---

# 🔒 Authentication Flow

1. User Registers
2. User Logs In
3. JWT Token Generated
4. Token Stored in LocalStorage
5. Protected Routes Validate Token
6. Authorized Requests Access APIs

---

# 📱 Responsive Design

Fully responsive for:

* Desktop
* Laptop
* Tablet
* Mobile Devices

---

# ✨ Future Enhancements

* Razorpay Integration
* Stripe Integration
* Event Reviews
* Event Ratings
* QR Ticket Generation
* PDF Ticket Download
* Event Categories Dashboard
* User Profile Management
* Analytics Charts
* Dark Mode

---

# 👨‍💻 Developed By

**Guddu Kumar**

B.Tech CSE (2022-2026)

Maharishi Markandeshwar (Deemed to be University)

Full Stack MERN Developer

---

# 📜 License

This project is developed for learning, portfolio, and educational purposes.
