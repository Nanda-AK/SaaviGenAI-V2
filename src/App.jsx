// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatButton from "./components/ChatButton";

// Public Pages
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import ComingSoon from "./pages/ComingSoon.jsx";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/login";

// Admin Utilities
import AdminRoute from "./components/AdminRoutes";

// Admin Pages
import AdminDashboardPage from "./pages/admin/AdminDashboard.jsx";
import EventsAdmin from "./pages/admin/EventsAdmin";
import EventsEdit from "./pages/admin/EventsEdit";
import ArticlesAdmin from "./pages/admin/ArticlesAdmin.jsx";
import ArticlesEdit from "./pages/admin/ArticlesEdit";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import TestimonialsEdit from "./pages/admin/TestimonialsEdit";
import ContactsAdmin from "./pages/admin/ContactsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import CreateEventAdmin from "./pages/admin/CreateEventAdmin";
import CreateTestimonialAdmin from "./pages/admin/CreateTestimonialAdmin";
import ArticlesCreate from "./pages/admin/CreateArticle";
import ContactSection from "./components/home/ContactSection";
import { AboutSection } from "./components/home/AboutSection";
import ServicesSection from "./components/home/ServicesSection.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* ScrollToTop Component - MUST be inside BrowserRouter but OUTSIDE Routes */}
        <ScrollToTop />
        
        {/* Dark theme wrapper - applies to entire app */}
        <div className="min-h-screen flex flex-col bg-black text-white">
          {/* Header for public site (Fixed at top) */}
          <Header />

          {/* Main Content with padding-top for fixed header */}
          <main className="flex-1 pt-20">
            <Routes>
              {/* ----- Public Routes ----- */}
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:slug" element={<EventDetail />} />
              <Route path="/contact" element={<ContactSection/>} />
              <Route path="/about" element={<AboutSection />} />
              <Route path="/services" element={<ServicesSection />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/login" element={<Login />} />

              {/* ----- Admin Routes (Protected) ----- */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <AdminRoute>
                    <EventsAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/events/create"
                element={
                  <AdminRoute>
                    <CreateEventAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/events/:slug/edit"
                element={
                  <AdminRoute>
                    <EventsEdit />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/articles"
                element={
                  <AdminRoute>
                    <ArticlesAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/articles/create"
                element={
                  <AdminRoute>
                    <ArticlesCreate />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/articles/:slug/edit"
                element={
                  <AdminRoute>
                    <ArticlesEdit />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/testimonials"
                element={
                  <AdminRoute>
                    <TestimonialsAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/testimonials/create"
                element={
                  <AdminRoute>
                    <CreateTestimonialAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/testimonials/:id/edit"
                element={
                  <AdminRoute>
                    <TestimonialsEdit />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/contacts"
                element={
                  <AdminRoute>
                    <ContactsAdmin />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UsersAdmin />
                  </AdminRoute>
                }
              />
            </Routes>
          </main>

          {/* Footer for public site */}
          <Footer />
        </div>

        {/* Floating Chat Button (outside main flow) */}
        <ChatButton />
      </BrowserRouter>
    </AuthProvider>
  );
}