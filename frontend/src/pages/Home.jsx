import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
} from "react-icons/fa";
import api from "../utils/axios";

const Home = () => {
  const [priceFilter, setPriceFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Technology",
    "Music",
    "Sports",
    "Education",
    "Business",
    "Workshop",
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [search, selectedCategory, priceFilter, events]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
      setFilteredEvents(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Category Filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (event) =>
          event.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    // Search Filter
    if (search.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(search.toLowerCase()) ||
          event.location?.toLowerCase().includes(search.toLowerCase()) ||
          event.category?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Price Filter
    if (priceFilter === "under500") {
      filtered = filtered.filter(
        (event) => event.ticketPrice < 500
      );
    }

    if (priceFilter === "500to1000") {
      filtered = filtered.filter(
        (event) =>
          event.ticketPrice >= 500 &&
          event.ticketPrice <= 1000
      );
    }

    if (priceFilter === "above1000") {
      filtered = filtered.filter(
        (event) => event.ticketPrice > 1000
      );
    }

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-slate-700">
            Loading Events...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 text-white py-24">
        <div className="container mx-auto px-4 text-center">

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Discover Amazing Events
          </h1>

          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Find, Book & Experience the Best Events Near You
          </p>

          <div className="mt-10">
            <Link
              to="/events"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition"
            >
              Explore Events
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-5">
          <div className="relative">
            <FaSearch className="absolute left-5 top-5 text-slate-400" />

            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
            <h2 className="text-5xl font-bold text-blue-600">
              {events.length}
            </h2>
            <p className="text-slate-600 mt-2">
              Available Events
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
            <h2 className="text-5xl font-bold text-violet-600">
              1000+
            </h2>
            <p className="text-slate-600 mt-2">
              Event Bookings
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
            <h2 className="text-5xl font-bold text-cyan-600">
              500+
            </h2>
            <p className="text-slate-600 mt-2">
              Happy Users
            </p>
          </div>

        </div>

      </section>

      {/* Events Section */}
      <section
        id="events"
        className="container mx-auto px-4 py-10"
      >
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Filter Sidebar */}
          <div className="lg:w-1/4">

            <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-24">

              <h2 className="text-2xl font-bold mb-6 text-slate-800">
                Filters
              </h2>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full border p-3 rounded-xl mb-4"
              >
                <option value="all">All Prices</option>
                <option value="under500">Under ₹500</option>
                <option value="500to1000">₹500 - ₹1000</option>
                <option value="above1000">Above ₹1000</option>
              </select>


              <div className="space-y-3">

                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition ${selectedCategory === category
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                  >
                    {category}
                  </button>
                ))}

              </div>



              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold text-slate-800 mb-3">
                  Results
                </h3>

                <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-xl text-center font-semibold">
                  {filteredEvents.length} Events Found
                </div>
              </div>



            </div>

          </div>

          {/* Right Events Area */}
          <div className="lg:w-3/4">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-4xl font-bold text-slate-800">
                Upcoming Events
              </h2>

            </div>

            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow">
                <h3 className="text-2xl font-semibold text-slate-600">
                  No Events Found
                </h3>

                <p className="text-slate-500 mt-2">
                  Try changing your search or filter.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                {filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >

                    <div className="overflow-hidden">
                      <img
                        src={
                          event.imageUrl ||
                          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                        }
                        alt={event.title}
                        className="w-full h-56 object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>

                    <div className="p-5">

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>

                      <h3 className="text-xl font-bold mt-4 text-slate-800">
                        {event.title}
                      </h3>

                      <p className="text-slate-500 mt-2 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="mt-4 space-y-2">

                        <div className="flex items-center gap-2 text-slate-600">
                          <FaMapMarkerAlt />
                          {event.location}
                        </div>

                        <div className="flex items-center gap-2 text-slate-600">
                          <FaCalendarAlt />
                          {new Date(event.date).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-2 text-slate-600">
                          <FaTicketAlt />
                          {event.availableSeats} Seats Left
                        </div>

                      </div>

                      <div className="flex justify-between items-center mt-6">

                        <span className="text-2xl font-bold text-emerald-600">
                          ₹{event.ticketPrice}
                        </span>

                        <Link
                          to={`/events/${event._id}`}
                          className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
                        >
                          View Details
                        </Link>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="container mx-auto px-4 py-20">

        <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-3xl p-12 text-center text-white">

          <h2 className="text-4xl font-bold">
            Ready To Attend Your Next Event?
          </h2>

          <p className="mt-4 text-lg text-blue-100">
            Discover thousands of amazing events happening around you.
          </p>

          <div className="mt-8">
            <Link
              to="/events"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold"
            >
              Get Started
            </Link>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-10">

        <div className="container mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold">
            Eventora
          </h2>

          <p className="mt-3 text-slate-400">
            Discover • Book • Experience
          </p>

          <p className="mt-6 text-slate-500">
            © 2026 Eventora. All Rights Reserved.
          </p>

        </div>

      </footer>

    </div>
  );
};

export default Home;

