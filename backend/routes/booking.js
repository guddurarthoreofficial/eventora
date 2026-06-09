const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/auth");

const {
  createBooking,
  getBookings,
  sendBookingOTP,
  getMyBookings,
  confirmBooking,
  cancelBooking
} = require("../controllers/bookingController");

// Create Booking
router.post("/", protect, createBooking);

// Get all bookings (Admin)
router.get("/", protect, admin, getBookings);

// Send OTP
router.get("/send-otp", protect, sendBookingOTP);

// Get My Bookings
router.get("/my", protect, getMyBookings);

// Confirm Booking (Admin)
router.post("/:id/confirm", protect, admin, confirmBooking);

// Cancel Booking
router.post("/:id/cancel", protect, cancelBooking);

module.exports = router;