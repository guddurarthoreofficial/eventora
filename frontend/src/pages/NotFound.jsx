import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">

      <div className="bg-white shadow-xl rounded-3xl p-12 text-center max-w-2xl w-full">

        <h1 className="text-8xl font-bold text-blue-600">
          404
        </h1>

        <h2 className="text-4xl font-bold mt-4 text-slate-800">
          Page Not Found
        </h2>

        <p className="text-slate-500 mt-4 text-lg">
          Oops! The page you're looking for doesn't exist
          or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 mt-8 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-2xl font-semibold hover:opacity-90 transition"
        >
          <FaHome />
          Back To Home
        </Link>

      </div>

    </div>
  );
};

export default NotFound;