// src/pages/EventDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { eventsAPI } from "../services/api";
import { useAuth } from "../context/authContext";
import dayjs from "dayjs";

export default function EventDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await eventsAPI.get(slug);
        setEvent(res.data.data);
      } catch (e) {
        console.error("Failed to load event:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const formatPrice = (price) => {
    if (!price) return "—";
    if (price.value === 0) return "Free";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: price.currency,
      minimumFractionDigits: 0,
    }).format(price.value);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await eventsAPI.delete(event._id || event.id);
      navigate("/events");
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-white mb-2">Event not found</h2>
          <p className="text-gray-400 mb-6">The event you're looking for doesn't exist</p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Back Button - Top Right */}
      <Link
        to="/events"
        className="fixed top-28 right-6 z-50 inline-flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 rounded-lg transition-all"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Events
      </Link>

      {/* Admin Controls */}
      {isAdmin() && (
        <div className="fixed bottom-8 right-8 z-50 flex gap-2">
          <button
            onClick={() => navigate(`/admin/events/${slug}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        {event.image && (
          <>
            <img
              src={event.image}
              alt={event.imageAlt || event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </>
        )}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {event.category && (
                <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                  {event.category}
                </span>
              )}
              {event.mode && (
                <span className="px-3 py-1 bg-cyan-500 text-black text-xs font-semibold rounded-full capitalize">
                  {event.mode === 'online' ? '🌐 Online' : '📍 ' + event.mode}
                </span>
              )}
              <span className="px-3 py-1 bg-green-500 text-black text-xs font-semibold rounded-full">
                {event.status === 'scheduled' ? '🎯 Upcoming' : '✅ Completed'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              {event.title}
            </h1>

            {/* Key Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {/* Date */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-semibold">Date</span>
                </div>
                <p className="text-white text-sm font-bold">
                  {dayjs(event.startDate).format("MMM D, YYYY")}
                </p>
              </div>

              {/* Time */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-cyan-400 mb-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold">Time</span>
                </div>
                <p className="text-white text-sm font-bold">
                  {dayjs(event.startDate).format("h:mm A")}
                </p>
              </div>

              {/* Price */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold">Price</span>
                </div>
                <p className="text-white text-sm font-bold">
                  {formatPrice(event.price)}
                </p>
              </div>

              {/* Attendees */}
              {/* <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-purple-400 mb-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-xs font-semibold">Seats</span>
                </div>
                <p className="text-white text-sm font-bold">
                  {event.attendees}/{event.capacity}
                </p>
              </div> */}
            </div>

            {/* CTA Button */}
            <Link
              to = "/contact" 
            >
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              Register for Events
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Description Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About the Workshop
              </h2>
              <div
                className="prose prose-invert max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-base
                  prose-ul:text-gray-300 prose-ol:text-gray-300
                  prose-li:marker:text-cyan-400"
                dangerouslySetInnerHTML={{
                  __html: event.shortExcerpt || event.description || "No detailed description available.",
                }}
              />
            </div>

            {/* Speakers Section */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Meet the Mentor{event.speakers.length > 1 ? "s" : ""}
                </h2>
                <div className="space-y-4">
                  {event.speakers.map((speaker) => (
                    <div
                      key={speaker._id}
                      className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all"
                    >
                      <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-black font-bold text-xl">
                        {speaker.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-white">
                          {speaker.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {speaker.title} at <span className="text-cyan-400 font-semibold">{speaker.org}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Target Audience */}
              {event.audience && (
                <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Target Audience
                  </h3>
                  <p className="text-gray-300 text-sm">{event.audience}</p>
                </div>
              )}

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-sm font-semibold rounded-full border border-cyan-500/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Registration CTA */}
            <div className="mt-12 p-8 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 backdrop-blur-sm border border-cyan-500/30 rounded-2xl text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                Ready to Join?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm">
                Don't miss this opportunity to learn from industry experts and enhance your skills.
              </p>
              <Link
                to = "/contact"
              >
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                Register Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}