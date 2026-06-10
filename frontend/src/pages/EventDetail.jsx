import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/axios";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    };

    fetchEvent();
  }, [id]);

  if (!event) return <h1>Loading...</h1>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="w-full h-[450px] object-cover rounded-2xl"
      />

      <div className="mt-8">
        <h1 className="text-5xl font-bold">
          {event.title}
        </h1>

        <p className="mt-4 text-gray-600 text-lg">
          {event.description}
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <p>📍 {event.location}</p>
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p>🎟️ {event.availableSeats} Seats Left</p>
          <p>🏷️ {event.category}</p>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <h2 className="text-4xl font-bold text-blue-600">
            ₹{event.ticketPrice}
          </h2>

          <button className="bg-green-600 text-white px-8 py-3 rounded-xl text-lg hover:bg-green-700">
            Register For Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;