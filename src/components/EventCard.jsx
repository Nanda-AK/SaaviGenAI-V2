import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function EventCard({ event }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 25px rgba(0, 200, 255, 0.35)",
      }}
      className="
        relative flex gap-5 bg-[#0b0b0b]/90 
        border border-[#1a1a1a] 
        rounded-xl p-5 mb-6
        transition-all duration-300 
        hover:border-cyan-400/60
        hover:bg-[#0f0f0f]
      "
    >
      {/* 🔥 TOP RIGHT BADGES */}
      <div className="absolute top-4 right-4 flex gap-2">

        {/* CATEGORY BADGE */}
        {event.category && (
          <span className="
            px-3 py-1 rounded-md text-[11px] md:text-xs font-medium 
            bg-black/40 border border-gray-700/50 
            text-gray-300 shadow-[0_0_8px_rgba(0,200,255,0.15)]
          ">
            {event.category}
          </span>
        )}

        {/* FEATURED BADGE */}
        {event.featured && (
          <span
            className="
              px-3 py-1 rounded-md text-[11px] md:text-xs font-semibold 
              bg-gradient-to-r from-cyan-400 to-teal-400 
              text-black shadow-[0_0_10px_rgba(0,200,255,0.4)]
            "
          >
            ⭐ Featured
          </span>
        )}
      </div>

      {/* LEFT IMAGE */}
      <div className="w-40 h-28 rounded-lg overflow-hidden flex-shrink-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col">

        {/* TITLE */}
        <h2 className="text-base md:text-lg font-semibold text-white">
          {event.title}
        </h2>

        {/* DATE */}
        <span
          className="
            bg-cyan-400 text-black px-3 py-[6px] rounded-md 
            text-[11px] md:text-xs font-medium w-max mt-2
          "
        >
          {new Date(event.startDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        {/* SHORT EXCERPT */}
        <p className="text-xs md:text-sm text-gray-400 mt-3 mb-auto line-clamp-2">
          {event.shortExcerpt}
        </p>

        {/* VIEW DETAILS — FIXED BOTTOM RIGHT */}
        <div className="flex justify-end mt-4">
          <Link
            to={`/events/${event.slug}`}
            className="
              text-cyan-400 text-sm font-medium 
              hover:text-cyan-300 transition-colors
            "
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
