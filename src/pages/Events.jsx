// import React, { useEffect, useState } from "react";
// import { eventsAPI } from "../services/api";
// import EventCard from "../components/EventCard";

// export default function Events() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function loadEvents() {
//       try {
//         const res = await eventsAPI.list();
//         setEvents(res?.data?.data.events || []);
//       } catch (err) {
//         console.error(err);
//       }
//       setLoading(false);
//     }
//     loadEvents();
//   }, []);

//   return (
//     <section className="bg-black py-16">
//       <div className="max-w-5xl mx-auto px-4">
//         {/* Heading */}
//         <h1 className="text-2xl md:text-3xl font-semibold text-white mb-8">
//           Completed Workshops / Events
//         </h1>

//         {/* Loading */}
//         {loading && <p className="text-gray-400">Loading events...</p>}

//         {/* Event List */}
//         {events.length > 0 ? (
//           events.map((event) => <EventCard key={event._id} event={event} />)
//         ) : (
//           !loading && (
//             <p className="text-gray-500">No events found.</p>
//           )
//         )}
//       </div>
//     </section>
//   );
// }
import React, { useEffect, useState } from "react";
import { eventsAPI } from "../services/api";
import EventCard from "../components/EventCard";
import { motion } from 'framer-motion';


export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        // Simulated API call - replace with your actual API
        const res = await eventsAPI.list();
        let eventList = res?.data?.data?.events || [];

      

        // Sorting: Featured first, then date DESC
        const sortedEvents = eventList.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.startDate) - new Date(a.startDate);
        });

        setEvents(sortedEvents);
      } catch (error) {
        console.error("Failed to load events:", error);
      }
      setLoading(false);
    }

    loadEvents();
  }, []);

  return (
    <section className="relative min-h-screen bg-black py-12  overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-black to-teal-500/5" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
        

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl lg:text-3xl font-bold text-white mb-4"
          >
            Completed{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500  bg-clip-text text-transparent">
              Workshops
            </span>{" "}
            & Events
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-lg lg:text-sm max-w-2xl"
          >
            Explore our past events, workshops, and training sessions focused on AI, Machine Learning, and enterprise solutions.
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <div className="flex items-center gap-3 text-cyan-400">
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium">Loading events...</span>
            </div>
          </motion.div>
        )}

        {/* No Events State */}
        {!loading && events.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-gradient-to-br from-gray-900/50 to-black/50 
              backdrop-blur-xl border border-gray-800/60 rounded-2xl"
          >
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-400 text-lg">No events found at the moment.</p>
            <p className="text-gray-500 text-sm mt-2">Check back soon for upcoming workshops and events!</p>
          </motion.div>
        )}

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <EventCard key={event._id} event={event} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}

