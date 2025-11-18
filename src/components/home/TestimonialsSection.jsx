import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

 import { testimonialsAPI } from '../../services/api';

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);
  const fetchTestimonials = async () => {
  setLoading(true);
  setError(null);

  const fallbackTestimonials = [
    {
      _id: "1",
      name: "Shreyash",
      designation: "Course Participant",
      content:
        "Thank you for the Course. As they say AI is future actually AI is present now...",
      rating: 5,
      avatar: null,
    },
    {
      _id: "2",
      name: "Pulkita",
      designation: "GenAI Course Student",
      content:
        "I wanted to thank you for your time. I totally loved this free GenAI course...",
      rating: 5,
      avatar: null,
    },
    {
      _id: "3",
      name: "Sakshi",
      designation: "Training Program Graduate",
      content:
        "In today's technical world with cutting-edge technology it's been a great experience...",
      rating: 5,
      avatar: null,
    },
  ];

  try {
    // ✅ fetch all testimonials
    const response = await testimonialsAPI.list({ isActive: true });

    console.log("Testimonials API response:", response.data);

    const testimonials =
      response.data?.data?.testimonials && Array.isArray(response.data.data.testimonials)
        ? response.data.data.testimonials
        : [];

    if (testimonials.length > 0) {
      setTestimonials(testimonials);
    } else {
      setTestimonials(fallbackTestimonials);
    }
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    setError("Failed to load testimonials");
    setTestimonials(fallbackTestimonials);
  } finally {
    setLoading(false);
  }
};




  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-600'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="relative py-20 md:py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,198,0.05),transparent_50%)]" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-6">
            <span className="text-cyan-400 text-sm font-medium">Testimonials</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">
            <span className="text-white">What Our </span>
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="flex flex-col items-center gap-4">
              <svg className="animate-spin h-12 w-12 text-cyan-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-400">Loading testimonials...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button
              onClick={fetchTestimonials}
              className="mt-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Testimonial Display */}
        {!loading && testimonials.length > 0 && (
          <>
            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 md:p-12 shadow-2xl shadow-cyan-500/10"
                >
                  {/* Quote Icon */}
                  <svg className="w-12 h-12 text-cyan-500/30 mb-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  {/* Quote */}
                  <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6 italic">
                    "{testimonials[activeIndex].content}"
                  </p>

                  {/* Rating */}
                  {testimonials[activeIndex].rating && (
                    <div className="mb-6">
                      {renderStars(testimonials[activeIndex].rating)}
                    </div>
                  )}

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    {testimonials[activeIndex].avatar ? (
                      <img
                        src={testimonials[activeIndex].avatar}
                        alt={testimonials[activeIndex].name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-black font-bold text-xl">
                        {testimonials[activeIndex].name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-white">
                        {testimonials[activeIndex].name}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {testimonials[activeIndex].designation}
                        {testimonials[activeIndex].company && (
                          <span> • {testimonials[activeIndex].company}</span>
                        )}
                      </div>
                      {testimonials[activeIndex].courseOrService && (
                        <div className="text-cyan-400 text-xs mt-1">
                          {testimonials[activeIndex].courseOrService}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`transition-all duration-300 ${
                    index === activeIndex
                      ? 'bg-cyan-500 w-8 h-3 rounded-full'
                      : 'bg-gray-600 hover:bg-gray-500 w-3 h-3 rounded-full'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows (Desktop) */}
            <div className="hidden md:flex justify-center gap-4 mt-6">
              <button
                onClick={() => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full bg-gray-800/80 hover:bg-cyan-500/20 border border-gray-700 hover:border-cyan-500/50 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-all"
                aria-label="Previous testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActiveIndex((current) => (current + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full bg-gray-800/80 hover:bg-cyan-500/20 border border-gray-700 hover:border-cyan-500/50 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-all"
                aria-label="Next testimonial"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && testimonials.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No testimonials available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}