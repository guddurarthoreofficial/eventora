import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import EventDetail from "./pages/EventDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events/:id" element={<EventDetail/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />}/>
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/admin" element={<AdminDashboard />}/>
        <Route path="/my-bookings" element={<MyBookings/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;