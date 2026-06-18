import { useState } from "react";
import api from "../../utils/axios";

const CreateEvent = () => {
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

    const [loading, setLoading] = useState(false);

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
            setLoading(true);

            const payload = {
                ...formData,
                totalSeats: Number(formData.totalSeats),
                availableSeats: Number(formData.totalSeats),
                ticketPrice: Number(formData.ticketPrice),
            };

            const { data } = await api.post(
                "/events",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("✅ Event Created Successfully");

            setFormData({
                title: "",
                description: "",
                category: "",
                location: "",
                date: "",
                ticketPrice: "",
                totalSeats: "",
                imageUrl: "",
            });

            console.log(data);

        } catch (error) {
            console.log("FULL ERROR =>", error.response);

            alert(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to Create Event"
            );
        } finally {
            setLoading(false);
        }

    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold">
                    Create Event
                </h1>

                <p className="text-slate-500 mt-2">
                    Add a new event to Eventora
                </p>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-8">
                <form
                    onSubmit={handleSubmit}
                    className="grid md:grid-cols-2 gap-6"
                >

                    {/* Title */}
                    <div>
                        <label className="block font-medium mb-2">
                            Event Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-xl"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block font-medium mb-2">
                            Category
                        </label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-xl"
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

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block font-medium mb-2">
                            Description
                        </label>

                        <textarea
                            rows="4"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-xl"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block font-medium mb-2">
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-xl"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block font-medium mb-2">
                            Event Date
                        </label>

                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-xl"
                        />
                    </div>

                    {/* Ticket Price */}
                    <div>
                        <label className="block font-medium mb-2">
                            Ticket Price
                        </label>

                        <input
                            type="number"
                            name="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-xl"
                        />
                    </div>

                    {/* Total Seats */}
                    <div>
                        <label className="block font-medium mb-2">
                            Total Seats
                        </label>

                        <input
                            type="number"
                            name="totalSeats"
                            value={formData.totalSeats}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-xl"
                        />
                    </div>

                    {/* Image URL */}
                    <div className="md:col-span-2">
                        <label className="block font-medium mb-2">
                            Image URL
                        </label>

                        <input
                            type="text"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full border p-3 rounded-xl"
                        />
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-4 rounded-xl font-semibold hover:opacity-90"
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