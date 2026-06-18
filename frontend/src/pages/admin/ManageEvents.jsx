import React, { useEffect, useState } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const ManageEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get("/events");

            setEvents(data);
            setFilteredEvents(data);
        } catch (error) {
            console.log(error);
            alert("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        const filtered = events.filter(
            (event) =>
                event.title
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                event.category
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                event.location
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
        );

        setFilteredEvents(filtered);
    }, [search, events]);

    const deleteEvent = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/events/${id}`);

            alert("Event Deleted Successfully");

            fetchEvents();
        } catch (error) {
            alert(
                error?.response?.data?.message ||
                "Failed to delete event"
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-20">
                <h1 className="text-3xl font-bold">
                    Loading Events...
                </h1>
            </div>
        );
    }

    return (
        <div>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">

                <div>
                    <h1 className="text-4xl font-bold">
                        Manage Events
                    </h1>

                    <p className="text-slate-500 mt-2">
                        View, Search and Delete Events
                    </p>
                </div>

            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow p-4 mb-6">

                <div className="relative">

                    <FaSearch className="absolute left-4 top-4 text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search Events..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full border rounded-xl py-3 pl-12 pr-4"
                    />

                </div>

            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-100">

                            <tr>

                                <th className="text-left p-4">
                                    Event
                                </th>

                                <th className="text-left p-4">
                                    Category
                                </th>

                                <th className="text-left p-4">
                                    Date
                                </th>

                                <th className="text-left p-4">
                                    Location
                                </th>

                                <th className="text-left p-4">
                                    Price
                                </th>

                                <th className="text-left p-4">
                                    Seats
                                </th>

                                <th className="text-left p-4">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <tr
                                        key={event._id}
                                        className="border-b hover:bg-slate-50"
                                    >

                                        <td className="p-4">
                                            <div className="flex items-center gap-3">

                                                <img
                                                    src={
                                                        event.imageUrl ||
                                                        "https://via.placeholder.com/80"
                                                    }
                                                    alt={event.title}
                                                    className="w-14 h-14 rounded-lg object-cover"
                                                />

                                                <span className="font-semibold">
                                                    {event.title}
                                                </span>

                                            </div>
                                        </td>

                                        <td className="p-4">
                                            {event.category}
                                        </td>

                                        <td className="p-4">
                                            {new Date(
                                                event.date
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="p-4">
                                            {event.location}
                                        </td>

                                        <td className="p-4 font-semibold text-green-600">
                                            ₹{event.ticketPrice}
                                        </td>

                                        <td className="p-4">
                                            {event.availableSeats}
                                        </td>

                                        <td className="p-4">

                                            <div className="flex gap-3">

                                                <button
                                                    onClick={() =>
                                                        navigate(`/admin/edit-event/${event._id}`)
                                                    }
                                                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteEvent(event._id)
                                                    }
                                                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                                >
                                                    <FaTrash />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center p-8"
                                    >
                                        No Events Found
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default ManageEvents;