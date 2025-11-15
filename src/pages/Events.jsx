// src/pages/Events.jsx
import React, { useEffect, useState } from "react";
import { eventsAPI } from "../services/api";
import EventCard from "../components/EventCard";
//git fix 
export default function Events() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await eventsAPI.list({ page: 1, limit: 20, status: "scheduled" });
        setEvents(res.data.data.events || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Events</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.length ? events.map((ev) => <EventCard key={ev._id || ev.slug} event={ev} />) : <div>No upcoming events.</div>}
      </div>
    </div>
  );
}
