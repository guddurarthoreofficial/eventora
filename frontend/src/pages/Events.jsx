import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaChartLine,
  FaBriefcase,
  FaTools,
  FaMusic,
  FaFootballBall,
  FaGraduationCap,
} from "react-icons/fa";
import api from "../utils/axios";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (error) {
      console.log(error);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const trendingEvents = events.slice(0, 6);
  const technologyEvents = events.filter((event) => event.category === "Technology");
  const businessEvents = events.filter((event) => event.category === "Business");
  const workshopEvents = events.filter((event) => event.category === "Workshop");
  const musicEvents = events.filter((event) => event.category === "Music");
  const sportsEvents = events.filter((event) => event.category === "Sports");
  const educationEvents = events.filter((event) => event.category === "Education");

  // Category theme configuration
  const categoryThemes = {
    Technology: {
      icon: FaChartLine,
      bgGradient: "from-blue-500 to-cyan-500",
      cardBorder: "border-blue-200",
      badgeBg: "bg-blue-100",
      badgeText: "text-blue-700",
      titleColor: "text-blue-600",
      priceColor: "text-blue-600",
    },
    Business: {
      icon: FaBriefcase,
      bgGradient: "from-violet-500 to-purple-500",
      cardBorder: "border-violet-200",
      badgeBg: "bg-violet-100",
      badgeText: "text-violet-700",
      titleColor: "text-violet-600",
      priceColor: "text-violet-600",
    },
    Workshop: {
      icon: FaTools,
      bgGradient: "from-orange-500 to-amber-500",
      cardBorder: "border-orange-200",
      badgeBg: "bg-orange-100",
      badgeText: "text-orange-700",
      titleColor: "text-orange-600",
      priceColor: "text-orange-600",
    },
    Music: {
      icon: FaMusic,
      bgGradient: "from-pink-500 to-rose-500",
      cardBorder: "border-pink-200",
      badgeBg: "bg-pink-100",
      badgeText: "text-pink-700",
      titleColor: "text-pink-600",
      priceColor: "text-pink-600",
    },
    Sports: {
      icon: FaFootballBall,
      bgGradient: "from-green-500 to-emerald-500",
      cardBorder: "border-green-200",
      badgeBg: "bg-green-100",
      badgeText: "text-green-700",
      titleColor: "text-green-600",
      priceColor: "text-green-600",
    },
    Education: {
      icon: FaGraduationCap,
      bgGradient: "from-indigo-500 to-blue-600",
      cardBorder: "border-indigo-200",
      badgeBg: "bg-indigo-100",
      badgeText: "text-indigo-700",
      titleColor: "text-indigo-600",
      priceColor: "text-indigo-600",
    },
  };

  const EventCard = ({ event, theme }) => {
    const { icon: Icon } = theme;
    
    return (
      <div className={`group bg-white rounded-2xl ${theme.cardBorder} border-2 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
        {/* Card Header with Theme */}
        <div className={`bg-gradient-to-r ${theme.bgGradient} p-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Icon className="text-white text-xl" />
              </div>
              <span className={`${theme.badgeBg} ${theme.badgeText} px-3 py-1 rounded-full text-sm font-semibold`}>
                {event.category}
              </span>
            </div>
            <span className="text-white/80 text-sm font-medium">
              #{event._id.slice(-6)}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <h3 className={`text-xl font-bold ${theme.titleColor} mb-3 group-hover:scale-105 transition-transform`}>
            {event.title}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-slate-700">
              <div className={`bg-slate-100 p-2 rounded-lg`}>
                <FaCalendarAlt className={`${theme.titleColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="font-semibold text-sm">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <div className="bg-slate-100 p-2 rounded-lg">
                <FaMapMarkerAlt className={`${theme.titleColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-semibold text-sm">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <div className="bg-slate-100 p-2 rounded-lg">
                <FaTicketAlt className={`${theme.titleColor}`} />
              </div>
              <div>
                <p className="text-xs text-slate-500">Seats Available</p>
                <p className="font-semibold text-sm">{event.availableSeats}</p>
              </div>
            </div>
          </div>

          {/* Price & Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              <p className="text-slate-500 text-xs">Ticket Price</p>
              <p className={`text-2xl font-bold ${theme.priceColor}`}>
                ₹{event.ticketPrice}
              </p>
            </div>

            <Link
              to={`/events/${event._id}`}
              className={`bg-gradient-to-r ${theme.bgGradient} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg hover:shadow-xl`}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const EventSection = ({ title, events, category }) => {
    if (!events.length) return null;

    const theme = categoryThemes[category] || categoryThemes.Technology;
    const { icon: Icon, bgGradient, titleColor } = theme;

    return (
      <section className="mb-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`bg-gradient-to-r ${bgGradient} p-3 rounded-xl`}>
              <Icon className="text-white text-2xl" />
            </div>
            <h2 className={`text-3xl font-bold ${titleColor}`}>{title}</h2>
          </div>

          <span className="bg-white px-5 py-2 rounded-full shadow-md text-sm text-slate-600 font-semibold">
            {events.length} Events
          </span>
        </div>

        {/* Card Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} theme={theme} />
          ))}
        </div>
      </section>
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-2xl font-bold text-slate-700">Loading Events...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            Discover Events
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Explore workshops, conferences, business meetups, sports tournaments,
            music festivals and educational events.
          </p>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-10 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition">
              <h2 className="text-4xl font-bold text-blue-600">{events.length}</h2>
              <p className="text-slate-600 mt-2 font-medium">Total Events</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition">
              <h2 className="text-4xl font-bold text-violet-600">6+</h2>
              <p className="text-slate-600 mt-2 font-medium">Categories</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition">
              <h2 className="text-4xl font-bold text-green-600">1000+</h2>
              <p className="text-slate-600 mt-2 font-medium">Registrations</p>
            </div>
          </div>
        </div>

        {/* Event Sections */}
        <EventSection title="🔥 Trending Events" events={trendingEvents} category="Technology" />
        <EventSection title="💻 Technology Events" events={technologyEvents} category="Technology" />
        <EventSection title="💼 Business Events" events={businessEvents} category="Business" />
        <EventSection title="🛠️ Workshop Events" events={workshopEvents} category="Workshop" />
        <EventSection title="🎵 Music Events" events={musicEvents} category="Music" />
        <EventSection title="⚽ Sports Events" events={sportsEvents} category="Sports" />
        <EventSection title="🎓 Education Events" events={educationEvents} category="Education" />
      </div>
    </div>
  );
};

export default Events;