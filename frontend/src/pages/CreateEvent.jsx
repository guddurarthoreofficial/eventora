import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/events", formData);

      alert("🎉 Event Created Successfully");

      navigate("/admin");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Failed to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-4xl font-bold mb-8 text-slate-800">
          Create New Event
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >

          <div>
            <label className="font-medium">
              Event Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-xl mt-2"
            />
          </div>

          <div>
            <label className="font-medium">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-xl mt-2"
            >
              <option value="">
                Select Category
              </option>

              <option value="Technology">
                Technology
              </option>

              <option value="Music">
                Music
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Business">
                Business
              </option>

              <option value="Workshop">
                Workshop
              </option>

            </select>
          </div>

          <div className="md:col-span-2">
            <label className="font-medium">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-xl mt-2"
            />
          </div>

          <div>
            <label className="font-medium">
              Event Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-xl mt-2"
            />
          </div>

          <div>
            <label className="font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-xl mt-2"
            />
          </div>

          <div>
            <label className="font-medium">
              Total Seats
            </label>

            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-xl mt-2"
            />
          </div>

          <div>
            <label className="font-medium">
              Ticket Price
            </label>

            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-xl mt-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-medium">
              Image URL
            </label>

            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl mt-2"
            />
          </div>

          <div className="md:col-span-2">

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-xl font-bold"
            >
              {loading
                ? "Creating Event..."
                : "Create Event"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateEvent;