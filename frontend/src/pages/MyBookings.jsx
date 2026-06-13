import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import api from "../utils/axios";
import { toast } from "react-toastify";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");

      setBookings(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl font-bold">
          Loading Your Bookings...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white py-16">

        <div className="container mx-auto px-6">

          <h1 className="text-5xl font-bold">
            My Bookings
          </h1>

          <p className="mt-3 text-blue-100">
            Manage and track all your event bookings
          </p>

        </div>

      </div>

      <div className="container mx-auto px-6 py-10">

        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow">

            <h2 className="text-3xl font-bold text-gray-700">
              No Bookings Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Book your first event and it will appear here.
            </p>

          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">

            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                <img
                  src={
                    booking.eventId?.imageUrl ||
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                  }
                  alt={booking.eventId?.title}
                  className="w-full h-60 object-cover"
                />

                <div className="p-6">

                  <div className="flex justify-between items-center">

                    <h2 className="text-2xl font-bold">
                      {booking.eventId?.title}
                    </h2>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                  </div>

                  <div className="mt-5 space-y-3">

                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-blue-600" />
                      <span>
                        {new Date(
                          booking.eventId?.date
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-blue-600" />
                      <span>
                        {booking.eventId?.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaTicketAlt className="text-blue-600" />
                      <span>
                        ₹{booking.amount}
                      </span>
                    </div>

                  </div>

                  <div className="mt-6 border-t pt-4">

                    <div className="flex justify-between">

                      <span className="text-gray-500">
                        Payment
                      </span>

                      <span
                        className={`font-semibold ${
                          booking.paymentStatus === "paid"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>

                    </div>

                    <div className="flex justify-between mt-3">

                      <span className="text-gray-500">
                        Booking ID
                      </span>

                      <span className="font-medium text-sm">
                        {booking._id}
                      </span>

                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;