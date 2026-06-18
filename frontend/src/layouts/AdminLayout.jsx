import { Outlet, NavLink, useNavigate } from "react-router-dom"; import {
  FaHome,
  FaPlusCircle,
  FaCalendarAlt,
  FaClipboardList,
  FaUserCircle,
  FaCog,
  FaArrowLeft  
} from "react-icons/fa";

const AdminLayout = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logout Successful");

    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white shadow-lg">

        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-cyan-400">
            Eventora Admin
          </h1>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-3">

          <NavLink
            to="/admin/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
              }`
            }
          >
            <FaUserCircle />
            Profile
          </NavLink>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
              }`
            }
          >
            <FaHome />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/create-event"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
              }`
            }
          >
            <FaPlusCircle />
            Create Event
          </NavLink>

          <NavLink
            to="/admin/manage-events"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
              }`
            }
          >
            <FaCalendarAlt />
            Manage Events
          </NavLink>

          <NavLink
            to="/admin/manage-bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
              }`
            }
          >
            <FaClipboardList />
            Manage Bookings
          </NavLink>

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
              }`
            }
          >
            <FaArrowLeft />
            Back to Home
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
              }`
            }
          >
            <FaCog />
            Settings
          </NavLink>

        </nav>


        {/* Footer */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold"
        >
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;