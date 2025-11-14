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
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/login";

// Admin Utilities
import AdminRoute from "./components/AdminRoutes";

// Admin Pagess
import AdminDashboardPage from "./pages/admin/AdminDashboard.jsx";
import EventsAdmin from "./pages/admin/EventsAdmin";
import EventsEdit from "./pages/admin/EventsEdit";
import ArticlesAdmin from "./pages/admin/ArticlesAdmin.jsx"
import ArticlesEdit from "./pages/admin/ArticlesEdit";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import TestimonialsEdit from "./pages/admin/TestimonialsEdit";
import ContactsAdmin from "./pages/admin/ContactsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import CreateEventAdmin from "./pages/admin/CreateEventAdmin";
import CreateTestimonialAdmin from "./pages/admin/CreateTestimonialAdmin";
import ArticlesCreate from "./pages/admin/CreateArticle";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Header for public site */}
          <Header />

          {/* Main Content */}
          <div className="flex-1">
            <Routes>
              {/* ----- Public Routes ----- */}
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:slug" element={<EventDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
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
                    <ArticlesCreate/>                  
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
          </div>

          {/* Footer for public site */}
          <Footer />
        </div>

        {/* Floating Chat Button */}
        <ChatButton />
      </BrowserRouter>
    </AuthProvider>
  );
}
