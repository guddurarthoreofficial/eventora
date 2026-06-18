import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    ticketPrice: "",
    totalSeats: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);

      setFormData({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        location: data.location || "",
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "",
        ticketPrice: data.ticketPrice || "",
        totalSeats: data.totalSeats || "",
        imageUrl: data.imageUrl || "",
      });
    } catch (error) {
      console.log(error);
      alert("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      setUpdating(true);

      const payload = {
        ...formData,
        totalSeats: Number(formData.totalSeats),
        ticketPrice: Number(formData.ticketPrice),
      };

      await api.put(
        `/events/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Event Updated Successfully");

      navigate("/admin/manage-events");
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to update event"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold">
          Loading Event...
        </h1>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Edit Event
        </h1>

        <p className="text-slate-500 mt-2">
          Update event details
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8">

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >

          <div>
            <label className="block mb-2 font-medium">
              Event Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              required
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
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Event Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Ticket Price
            </label>

            <input
              type="number"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Total Seats
            </label>

            <input
              type="number"
              name="totalSeats"
              value={formData.totalSeats}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">
              Image URL
            </label>

            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full border p-3 rounded-xl"
            />
          </div>

          <div className="md:col-span-2 flex gap-4">

            <button
              type="submit"
              disabled={updating}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl"
            >
              {updating
                ? "Updating..."
                : "Update Event"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/manage-events")
              }
              className="bg-gray-300 px-8 py-3 rounded-xl"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditEvent;