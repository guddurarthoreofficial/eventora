import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import EventDetail from "./pages/EventDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";


import Dashboard from "./pages/admin/Dashboard";
import CreateEvent from "./pages/admin/CreateEvent";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageBookings from "./pages/admin/ManageBookings";
import AdminLayout from "./layouts/AdminLayout";
import AdminProfile from "./pages/admin/AdminProfile";
import EditEvent from "./pages/admin/EditEvent";
import Events from "./pages/Events";
import Settings from "./pages/admin/Settings";


function App() {
  return (
    <BrowserRouter>
      <ConditionalNavbar />
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="profile" element={<AdminProfile />} />
          <Route index element={<Dashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Helper component to conditionally show Navbar
function ConditionalNavbar() {
  const location = useLocation();

  // Hide navbar on all admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");

  return !isAdminRoute ? <Navbar /> : null;
}

export default App;