import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaPlusCircle,
  FaSignOutAlt,
  FaCheckCircle,
} from "react-icons/fa";
import api from "../utils/axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const eventsRes = await api.get("/events");
      const bookingsRes = await api.get("/bookings");

      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmBooking = async (bookingId) => {
    try {
      await api.post(`/bookings/${bookingId}/confirm`, {
        paymentStatus: "paid",
      });

      alert("Booking Confirmed");
      fetchData();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
        "Failed to confirm booking"
      );
    }
  };

  const deleteEvent = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/events/${eventId}`);

      alert("Event Deleted Successfully");

      fetchData();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
        "Failed to delete event"
      );
    }
  };

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed"
  );

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6">

        <h1 className="text-2xl font-bold mb-10">
          Eventora Admin
        </h1>

        <ul className="space-y-5">

          <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
            <FaClipboardList />
            Dashboard
          </li>

          <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
            <FaCalendarAlt />
            Events
          </li>

          <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
            <FaCheckCircle />
            Bookings
          </li>

          <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
            <Link to="/admin/create-event">
              <li className="flex items-center gap-3 cursor-pointer hover:text-cyan-400">
                <FaPlusCircle />
                Create Event
              </li>
            </Link>
          </li>

          <li className="flex items-center gap-3 cursor-pointer hover:text-red-400">
            <FaSignOutAlt />
            Logout
          </li>

        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold mb-8">
          Dashboard Overview
        </h1>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Total Events
            </h3>

            <p className="text-4xl font-bold text-blue-600">
              {events.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Total Bookings
            </h3>

            <p className="text-4xl font-bold text-violet-600">
              {bookings.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Pending
            </h3>

            <p className="text-4xl font-bold text-yellow-500">
              {pendingBookings.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-gray-500">
              Confirmed
            </h3>

            <p className="text-4xl font-bold text-green-600">
              {confirmedBookings.length}
            </p>
          </div>

        </div>

        {/* Events Table */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">

          <h2 className="text-2xl font-bold mb-4">
            Recent Events
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b">

                  <td className="p-3">
                    {event.title}
                  </td>

                  <td className="p-3">
                    {event.category}
                  </td>

                  <td className="p-3">
                    ₹{event.ticketPrice}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        deleteEvent(event._id)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

        {/* Pending Bookings */}
        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold mb-4">
            Pending Bookings
          </h2>

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Event</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>

            <tbody>

              {pendingBookings.map((booking) => (
                <tr key={booking._id} className="border-b">

                  <td className="p-3">
                    {booking.userId?.name}
                  </td>

                  <td className="p-3">
                    {booking.eventId?.title}
                  </td>

                  <td className="p-3">
                    ₹{booking.amount}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() =>
                        confirmBooking(
                          booking._id
                        )
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;