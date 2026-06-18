import React from "react";
import { FaUserCircle, FaEnvelope, FaUserShield } from "react-icons/fa";

const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="max-w-4xl mx-auto">

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <div className="flex flex-col md:flex-row items-center gap-6">

          <div>
            <FaUserCircle className="text-8xl text-blue-600" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              {user?.name || "Admin"}
            </h1>

            <p className="text-slate-500 mt-2">
              Administrator Account
            </p>
          </div>

        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">

          <div className="bg-slate-50 p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-blue-600" />
              <span className="font-semibold">
                Email
              </span>
            </div>

            <p className="mt-2 text-slate-600">
              {user?.email || "admin@gmail.com"}
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl">
            <div className="flex items-center gap-3">
              <FaUserShield className="text-green-600" />
              <span className="font-semibold">
                Role
              </span>
            </div>

            <p className="mt-2 text-slate-600">
              {user?.role || "Admin"}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminProfile;