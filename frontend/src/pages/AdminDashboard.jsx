import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaUsers,
  FaTicketAlt,
  FaPlus,
} from "react-icons/fa";
import api from "../utils/axios";

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const eventsRes = await api.get("/events");

      const bookingsRes = await api.get("/bookings");

      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Manage events and bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">
                Total Events
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {events.length}
              </h2>
            </div>

            <FaCalendarAlt
              size={40}
              className="text-blue-500"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">
                Total Bookings
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {bookings.length}
              </h2>
            </div>

            <FaTicketAlt
              size={40}
              className="text-green-500"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-gray-500">
                Registered Users
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {new Set(
                  bookings.map((b) => b.userId?._id)
                ).size}
              </h2>
            </div>

            <FaUsers
              size={40}
              className="text-purple-500"
            />
          </div>
        </div>

      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl shadow mt-8 p-6">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">
            Recent Events
          </h2>

          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
            <FaPlus />
            Create Event
          </button>
        </div>

        {events.length === 0 ? (
          <p>No Events Found</p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    Title
                  </th>

                  <th className="text-left p-3">
                    Category
                  </th>

                  <th className="text-left p-3">
                    Price
                  </th>

                  <th className="text-left p-3">
                    Seats
                  </th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className="border-b hover:bg-gray-50"
                  >
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
                      {event.availableSeats}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow mt-8 p-6">

        <h2 className="text-2xl font-bold mb-5">
          Recent Bookings
        </h2>

        {bookings.length === 0 ? (
          <p>No Bookings Found</p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">
                    User
                  </th>

                  <th className="text-left p-3">
                    Event
                  </th>

                  <th className="text-left p-3">
                    Status
                  </th>

                  <th className="text-left p-3">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      {booking.userId?.name}
                    </td>

                    <td className="p-3">
                      {booking.eventId?.title}
                    </td>

                    <td className="p-3">
                      {booking.status}
                    </td>

                    <td className="p-3">
                      ₹{booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;