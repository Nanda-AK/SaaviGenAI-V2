// src/pages/Home.jsx
// import React, { useEffect, useState } from "react";
// import Hero from "../components/Hero";
// import { articlesAPI, eventsAPI, testimonialsAPI } from "../services/api";
// import ArticleCard from "../components/ArticleCard";
// import EventCard from "../components/EventCard";
// import TestimonialCard from "../components/TestimonalCard"

// export default function Home() {
//   const [featuredArticles, setFeaturedArticles] = useState([]);
//   const [featuredEvents, setFeaturedEvents] = useState([]);
//   const [testimonials, setTestimonials] = useState([]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [aRes, eRes, tRes] = await Promise.all([
//           articlesAPI.featured(3),
//           eventsAPI.featured(3),
//           testimonialsAPI.featured(3),
//         ]);
//         setFeaturedArticles(aRes.data.data || []);
//         setFeaturedEvents(eRes.data.data || []);
//         setTestimonials(tRes.data.data || []);
//       } catch (e) {
//         console.warn(e);
//       }
//     })();
//   }, []);

//   return (
//     <div>
//       <Hero />

//       <main className="container mx-auto px-4 py-10 space-y-10">
//         <section>
//           <h2 className="text-xl font-semibold mb-4">Featured articles</h2>
//           <div className="grid md:grid-cols-3 gap-4">
//             {featuredArticles.length ? featuredArticles.map((a) => <ArticleCard key={a._id || a.slug} article={a} />) : <div>No articles yet.</div>}
//           </div>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-4">Upcoming / Featured events</h2>
//           <div className="grid md:grid-cols-3 gap-4">
//             {featuredEvents.length ? featuredEvents.map((e) => <EventCard key={e._id || e.slug} event={e} />) : <div>No events yet.</div>}
//           </div>
//         </section>

//         <section>
//           <h2 className="text-xl font-semibold mb-4">What our learners say</h2>
//           <div className="grid md:grid-cols-3 gap-4">
//             {testimonials.length ? testimonials.map((t) => <TestimonialCard key={t._id} t={t} />) : <div>No testimonials yet.</div>}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import { ProductsSection } from '../components/home/ProductsSection';
import ServicesSection from '../components/home/ServicesSection';
import { AboutSection } from '../components/home/AboutSection';
import  TestimonialsSection  from '../components/home/TestimonialsSection';
import ContactSection from '../components/home/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-black mt-[-150px]">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
