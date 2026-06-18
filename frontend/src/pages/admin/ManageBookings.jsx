import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";
import api from "../../utils/axios";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings");

      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter(
      (booking) =>
        booking.userId?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.userId?.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        booking.eventId?.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredBookings(filtered);
  }, [search, bookings]);

  const confirmBooking = async (id) => {
    try {
      await api.post(`/bookings/${id}/confirm`, {
        paymentStatus: "paid",
      });

      alert("Booking Confirmed Successfully");

      fetchBookings();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Failed to confirm booking"
      );
    }
  };

  const cancelBooking = async (id) => {
    const confirmDelete = window.confirm(
      "Cancel this booking?"
    );

    if (!confirmDelete) return;

    try {
      await api.post(`/bookings/${id}/cancel`);

      alert("Booking Cancelled");

      fetchBookings();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Failed to cancel booking"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold">
          Loading Bookings...
        </h1>
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Manage Bookings
        </h1>

        <p className="text-slate-500 mt-2">
          View, Confirm & Cancel Event Bookings
        </p>

      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6">

        <div className="relative">

          <FaSearch className="absolute left-4 top-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border rounded-xl py-3 pl-12 pr-4"
          />

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="p-4 text-left">
                  User
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-left">
                  Event
                </th>

                <th className="p-4 text-left">
                  Amount
                </th>

                <th className="p-4 text-left">
                  Status
                </th>

                <th className="p-4 text-left">
                  Payment
                </th>

                <th className="p-4 text-left">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (

                  <tr
                    key={booking._id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="p-4 font-medium">
                      {booking.userId?.name}
                    </td>

                    <td className="p-4">
                      {booking.userId?.email}
                    </td>

                    <td className="p-4">
                      {booking.eventId?.title}
                    </td>

                    <td className="p-4 font-semibold text-green-600">
                      ₹{booking.amount}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {booking.status}
                      </span>

                    </td>

                    <td className="p-4">
                      {booking.paymentStatus}
                    </td>

                    <td className="p-4">

                      <div className="flex gap-2">

                        {booking.status ===
                          "pending" && (
                          <button
                            onClick={() =>
                              confirmBooking(
                                booking._id
                              )
                            }
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                          >
                            <FaCheckCircle />
                          </button>
                        )}

                        {booking.status !==
                          "cancelled" && (
                          <button
                            onClick={() =>
                              cancelBooking(
                                booking._id
                              )
                            }
                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                          >
                            <FaTimesCircle />
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>

                  <td
                    colSpan="7"
                    className="text-center p-10"
                  >
                    No Bookings Found
                  </td>

                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default ManageBookings;