import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const VerifyOtp = () => {
  const { verifyOtp } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await verifyOtp(email, otp);

      alert(
        data.message || "Account verified successfully"
      );

      navigate("/");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "OTP Verification Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            Verify OTP
          </h1>

          <p className="text-gray-500 mt-2">
            Enter the OTP sent to
          </p>

          <p className="font-semibold text-blue-600">
            {email}
          </p>
        </div>

        <form
          onSubmit={handleVerify}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium">
              OTP
            </label>

            <input
              type="text"
              placeholder="Enter 6 Digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full border p-3 rounded-lg text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;