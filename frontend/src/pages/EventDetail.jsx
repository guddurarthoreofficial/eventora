import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import api from "../utils/axios";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      setBookingLoading(true);

      const { data } = await api.get("/bookings/send-otp");

      alert(data.message || "OTP sent successfully");

      setShowOtpModal(true);
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const bookEvent = async () => {
    if (!otp) {
      return alert("Please enter OTP");
    }

    try {
      setBookingLoading(true);

      const { data } = await api.post("/bookings", {
        eventId: event._id,
        otp,
      });

      alert(data.message);

      setShowOtpModal(false);
      setOtp("");

      fetchEvent();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Booking Failed"
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold">
          Loading Event...
        </h1>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold text-red-500">
          Event Not Found
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Banner */}
      <div className="relative">
        <img
          src={
            event.imageUrl ||
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
          }
          alt={event.title}
          className="w-full h-[500px] object-cover"
        />

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 text-white">

            <span className="bg-blue-600 px-4 py-2 rounded-full">
              {event.category}
            </span>

            <h1 className="text-5xl md:text-7xl font-bold mt-4">
              {event.title}
            </h1>

            <p className="mt-4 text-xl text-gray-200 max-w-3xl">
              {event.description}
            </p>

          </div>
        </div>
      </div>

      {/* Details */}
      <div className="container mx-auto px-6 py-12">

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-3xl shadow-lg p-8">

              <h2 className="text-3xl font-bold mb-6">
                Event Details
              </h2>

              <div className="space-y-5">

                <div className="flex items-center gap-3 text-lg">
                  <FaMapMarkerAlt className="text-blue-600" />
                  {event.location}
                </div>

                <div className="flex items-center gap-3 text-lg">
                  <FaCalendarAlt className="text-blue-600" />
                  {new Date(
                    event.date
                  ).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-3 text-lg">
                  <FaTicketAlt className="text-blue-600" />
                  {event.availableSeats} Seats Available
                </div>

              </div>

            </div>

          </div>

          {/* Right Card */}
          <div>

            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-24">

              <h3 className="text-4xl font-bold text-emerald-600">
                ₹{event.ticketPrice}
              </h3>

              <p className="text-gray-500 mt-2">
                Per Ticket
              </p>

              <div className="mt-6">

                <div className="flex justify-between mb-3">
                  <span>Available Seats</span>
                  <span className="font-bold">
                    {event.availableSeats}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Category</span>
                  <span className="font-bold">
                    {event.category}
                  </span>
                </div>

              </div>

              <button
                onClick={sendOtp}
                disabled={bookingLoading}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-2xl font-bold hover:opacity-90"
              >
                {bookingLoading
                  ? "Sending OTP..."
                  : "Register For Event"}
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md">

            <h2 className="text-3xl font-bold mb-3">
              Verify OTP
            </h2>

            <p className="text-gray-500 mb-6">
              Enter the OTP sent to your email
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border p-4 rounded-xl"
            />

            <div className="flex gap-4 mt-6">

              <button
                onClick={() => setShowOtpModal(false)}
                className="flex-1 bg-gray-200 py-3 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={bookEvent}
                disabled={bookingLoading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl"
              >
                {bookingLoading
                  ? "Verifying..."
                  : "Verify & Book"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default EventDetail;

