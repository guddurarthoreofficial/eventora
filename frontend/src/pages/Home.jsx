import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-2xl font-semibold text-blue-600 animate-pulse">
          Loading Events...
        </h1>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Discover Amazing Events
          </h1>

          <p className="text-xl mb-8 text-blue-100">
            Book your favorite events, concerts, workshops and festivals
            instantly.
          </p>

          <Link
            to="#events"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Explore Events
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-blue-600">
              {events.length}+
            </h2>
            <p className="text-gray-600">Available Events</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-green-600">
              1000+
            </h2>
            <p className="text-gray-600">Bookings</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h2 className="text-3xl font-bold text-purple-600">
              500+
            </h2>
            <p className="text-gray-600">Happy Users</p>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section
        id="events"
        className="container mx-auto px-4 py-10"
      >
        <h2 className="text-4xl font-bold text-center mb-10">
          Upcoming Events
        </h2>

        {events.length === 0 ? (
          <div className="text-center text-gray-500">
            No Events Found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <img
                  src={
                    event.imageUrl ||
                    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                  }
                  alt={event.title}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {event.category}
                  </span>

                  <h3 className="text-2xl font-bold mt-3">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="mt-4 space-y-2 text-gray-700">
                    <p>📍 {event.location}</p>

                    <p>
                      📅{" "}
                      {new Date(
                        event.date
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      🎟️ Seats Available:{" "}
                      {event.availableSeats}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-5">
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{event.ticketPrice}
                    </span>

                    <Link
                      to={`/events/${event._id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16 mt-10">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join an Event?
          </h2>

          <p className="text-lg mb-6">
            Find your next favorite event and reserve your seat today.
          </p>

          <Link
            to="/events"
            className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200"
          >
            Browse Events
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-10">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold">Eventora</h2>

          <p className="mt-2 text-gray-400">
            Book Events • Create Memories • Enjoy Experiences
          </p>

          <p className="mt-4 text-sm text-gray-500">
            © 2026 Eventora. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;