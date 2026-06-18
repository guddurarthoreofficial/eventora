import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaUsers,
  FaChartLine,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import api from "../../utils/axios";

// ─── Stat Card (Professional) ───────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color, prefix = "", trend }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border-l-4" style={{ borderLeftColor: color.border }}>
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className={`p-3 rounded-xl ${color.bg}`}>
        <Icon className={`text-xl ${color.text}`} />
      </div>
    </div>
    <div>
      <h2 className={`text-3xl font-bold ${color.text}`}>
        {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </h2>
      {trend !== undefined && (
        <p className={`text-xs mt-2 flex items-center gap-1.5 font-medium ${trend >= 0 ? "text-green-500" : "text-red-400"}`}>
          {trend >= 0 ? <FaArrowUp className="text-sm" /> : <FaArrowDown className="text-sm" />}
          {Math.abs(trend)}% vs last month
        </p>
      )}
    </div>
  </div>
);

// ─── Status Badge (Professional) ────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-green-100 text-green-700 border border-green-200",
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    cancelled: "bg-red-100 text-red-700 border border-red-200",
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${styles[status] ?? "bg-slate-100 text-slate-600 border border-slate-200"}`}>
      {status}
    </span>
  );
};

// ─── Custom Tooltip (Professional) ──────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 shadow-xl rounded-xl px-4 py-3 text-sm border border-slate-700">
      <p className="font-semibold text-white mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-white">
          <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
          <span className="font-bold ml-1">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const PIE_COLORS = ["#f59e0b", "#10b981", "#ef4444"];

// ─── Main Component (Professional Dashboard) ────────────────────────────────
const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [eventsRes, bookingsRes] = await Promise.all([
          api.get("/events"),
          api.get("/bookings"),
        ]);
        setEvents(eventsRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const totalEvents = events.length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (b.amount ?? 0), 0);
  const avgBookingValue = confirmedBookings > 0 ? totalRevenue / confirmedBookings : 0;

  // ── Chart data ─────────────────────────────────────────────────────────────
  const pieData = [
    { name: "Pending", value: pendingBookings },
    { name: "Confirmed", value: confirmedBookings },
    { name: "Cancelled", value: cancelledBookings },
  ].filter((d) => d.value > 0);

  const revenueByEvent = events.slice(0, 6).map((ev) => ({
    name: ev.title?.length > 12 ? ev.title.slice(0, 12) + "…" : ev.title,
    Revenue: bookings
      .filter((b) => b.eventId?._id === ev._id && b.status === "confirmed")
      .reduce((s, b) => s + (b.amount ?? 0), 0),
  }));

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyMap = {};
  bookings.forEach((b) => {
    if (!b.createdAt) return;
    const d = new Date(b.createdAt);
    const key = monthNames[d.getMonth()];
    monthlyMap[key] = (monthlyMap[key] ?? 0) + 1;
  });
  const areaData = Object.entries(monthlyMap).slice(-7).map(([month, count]) => ({ month, Bookings: count }));

  // Revenue trend data
  const revenueTrendData = Object.entries(monthlyMap).slice(-6).map(([month, count]) => {
    const eventRevenue = bookings
      .filter((b) => {
        if (!b.createdAt) return false;
        const d = new Date(b.createdAt);
        return monthNames[d.getMonth()] === month && b.status === "confirmed";
      })
      .reduce((s, b) => s + (b.amount ?? 0), 0);
    return { month, Revenue: eventRevenue };
  });

  // ── Skeleton loading ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 bg-slate-50">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { label: "Total Events", value: totalEvents, icon: FaCalendarAlt, color: { bg: "bg-blue-50", text: "text-blue-600", border: "#3b82f6" }, trend: 12 },
    { label: "Total Bookings", value: totalBookings, icon: FaClipboardList, color: { bg: "bg-violet-50", text: "text-violet-600", border: "#8b5cf6" }, trend: 8 },
    { label: "Pending", value: pendingBookings, icon: FaClock, color: { bg: "bg-amber-50", text: "text-amber-600", border: "#f59e0b" }, trend: -3 },
    { label: "Confirmed", value: confirmedBookings, icon: FaCheckCircle, color: { bg: "bg-green-50", text: "text-green-600", border: "#10b981" }, trend: 15 },
    { label: "Total Revenue", value: totalRevenue, icon: FaRupeeSign, color: { bg: "bg-emerald-50", text: "text-emerald-600", border: "#059669" }, trend: 20, prefix: "₹" },
  ];

  const recentEvents = events.slice(-5).reverse();
  const recentBookings = bookings.slice(-5).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-violet-600 p-2 rounded-xl">
                <FaChartLine className="text-white text-xl" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Notifications */}
              <button className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                <FaBell className="text-slate-600" />
              </button>
              
              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="bg-gradient-to-r from-blue-500 to-violet-500 w-10 h-10 rounded-full flex items-center justify-center">
                  <FaUsers className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Admin User</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-slate-800">Welcome back, Admin! 👋</h2>
              <p className="text-slate-600 mt-2">Here's what's happening with your events today</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Today</p>
              <p className="text-lg font-semibold text-slate-700">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Average Booking Value</p>
                <p className="text-3xl font-bold mt-2">₹{avgBookingValue.toLocaleString("en-IN")}</p>
              </div>
              <FaChartLine className="text-4xl text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold mt-2">
                  {totalBookings > 0 ? ((confirmedBookings / totalBookings) * 100).toFixed(1) : 0}%
                </p>
              </div>
              <FaCheckCircle className="text-4xl text-violet-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Active Events</p>
                <p className="text-3xl font-bold mt-2">{totalEvents}</p>
              </div>
              <FaCalendarAlt className="text-4xl text-emerald-200" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Area Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Bookings Over Time</h3>
                <p className="text-sm text-slate-500 mt-1">Monthly booking volume trend</p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold text-blue-600">{areaData.length} Months</p>
              </div>
            </div>
            {areaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={areaData} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6d28d9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6d28d9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 13, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 13, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Bookings" stroke="#6d28d9" strokeWidth={3} fill="url(#bookingGrad)" dot={{ r: 5, fill: "#6d28d9", strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-slate-400">No time-series data available</div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800">Booking Status</h3>
              <p className="text-sm text-slate-500 mt-1">Distribution by status</p>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={3} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={12} wrapperStyle={{ fontSize: "13px", paddingTop: "20px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Revenue by Event</h3>
              <p className="text-sm text-slate-500 mt-1">Confirmed booking revenue per event (top 6)</p>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold text-emerald-600">₹{totalRevenue.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByEvent} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="Revenue" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Events */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Recent Events</h3>
                <p className="text-sm text-slate-500 mt-1">Latest added events</p>
              </div>
              <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-4 py-2 rounded-full">
                {totalEvents} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wide border-b-2 border-slate-100">
                    <th className="text-left py-3 pb-4 font-semibold">Title</th>
                    <th className="text-left py-3 pb-4 font-semibold">Category</th>
                    <th className="text-left py-3 pb-4 font-semibold">Price</th>
                    <th className="text-left py-3 pb-4 font-semibold">Seats</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map((event) => (
                    <tr key={event._id} className="border-b border-slate-50 hover:bg-slate-50 transition group">
                      <td className="py-4 font-medium text-slate-700 group-hover:text-blue-600">{event.title}</td>
                      <td className="py-4">
                        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                          {event.category}
                        </span>
                      </td>
                      <td className="py-4 text-slate-600 font-medium">₹{event.ticketPrice?.toLocaleString("en-IN")}</td>
                      <td className="py-4 text-slate-600">{event.availableSeats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Recent Bookings</h3>
                <p className="text-sm text-slate-500 mt-1">Latest booking transactions</p>
              </div>
              <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-4 py-2 rounded-full">
                {totalBookings} total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wide border-b-2 border-slate-100">
                    <th className="text-left py-3 pb-4 font-semibold">User</th>
                    <th className="text-left py-3 pb-4 font-semibold">Event</th>
                    <th className="text-left py-3 pb-4 font-semibold">Status</th>
                    <th className="text-left py-3 pb-4 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="border-b border-slate-50 hover:bg-slate-50 transition group">
                      <td className="py-4 font-medium text-slate-700">{booking.userId?.name ?? "—"}</td>
                      <td className="py-4 text-slate-600 max-w-[150px] truncate">{booking.eventId?.title ?? "—"}</td>
                      <td className="py-4"><StatusBadge status={booking.status} /></td>
                      <td className="py-4 text-slate-700 font-semibold">₹{booking.amount?.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;