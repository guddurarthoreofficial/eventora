const Booking = require("../models/Booking");
const Event = require("../models/Event");
const OTP = require("../models/OTP");

const {
  sendOTPEmail,
  sendBookingEmail,
} = require("../utils/email");

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send Booking OTP
exports.sendBookingOTP = async (req, res) => {
  try {
    const otp = generateOTP();

    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    await OTP.create({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    await sendOTPEmail(
      req.user.email,
      otp,
      "event_booking"
    );

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    const otpRecord = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      eventId,
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You already booked this event",
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      eventId,
      amount: event.ticketPrice,
      status: "pending",
      paymentStatus: "non_paid",
    });

    await OTP.deleteMany({
      email: req.user.email,
      action: "event_booking",
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Confirm Booking (Admin)
exports.confirmBooking = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!["paid", "non_paid"].includes(paymentStatus)) {
      return res.status(400).json({
        message: "Invalid payment status",
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("userId")
      .populate("eventId");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({
        message: "Booking already confirmed",
      });
    }

    const event = booking.eventId;

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    booking.status = "confirmed";
    booking.paymentStatus = paymentStatus;

    event.availableSeats -= 1;

    await booking.save();
    await event.save();

    await sendBookingEmail(
      booking.userId.email,
      booking.userId.name,
      event.title
    );

    res.status(200).json({
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
    })
      .populate("eventId")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Bookings (Admin)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email")
      .populate("eventId", "title date location");

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      booking.userId.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (booking.status === "confirmed") {
      const event = await Event.findById(
        booking.eventId
      );

      if (event) {
        event.availableSeats += 1;
        await event.save();
      }
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};