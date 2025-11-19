// src/pages/admin/CreateEventAdmin.jsx
import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { eventsAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

// Define the enum options from your Mongoose model for client-side use
const CATEGORY_OPTIONS = [
  "Training",
  "Workshop",
  "Webinar",
  "Masterclass",
  "Conference",
];

// Define the max length for the excerpt
const MAX_EXCERPT_LENGTH = 500;

export default function CreateEventAdmin() {
  const nav = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    title: "",
    metaTitle: "",
    metaDescription: "",
    shortExcerpt: "",
    fullDescription: "",
    // Set default category to match model default
    category: "Training", 
    audience: "Professionals", // Default Audience from model
    mode: "online",
    status: "scheduled",
    startDate: "",
    endDate: "",
    timezone: "Asia/Kolkata",
    capacity: "",
    price: '{"currency":"INR","value":0}',
    speakers: '[]',
    tags: "",
    imageAlt: "",
    registrationLink: "",
    recordingLink: "",
    slidesLink: "",
    featured: false
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Client-side excerpt length check
    if (name === "shortExcerpt" && value.length > MAX_EXCERPT_LENGTH) {
      setError(`Short excerpt cannot exceed ${MAX_EXCERPT_LENGTH} characters.`);
      return; // Stop updating state if validation fails
    }

    setValues((s) => ({ 
      ...s, 
      [name]: type === "checkbox" ? checked : value 
    }));
    // Clear error once user starts typing again
    if (error) setError(""); 
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setSubmitting(true);
     window.scrollTo({
          top: 0,
          behavior: 'smooth' 
      });
    setError("");

    // --- Client-Side Validation ---
    
    // 1. Image Check
    if (!file) {
      setError("Event image is required.");
      setSubmitting(false);
      return;
    }
    
    // 2. Required Fields Check
    if (!values.title || !values.startDate || !values.shortExcerpt) {
      setError("Title, start date, and excerpt are required.");
      setSubmitting(false);
      return;
    }

    // 3. Excerpt Length Check (redundant due to onChange, but good for submit protection)
    if (values.shortExcerpt.length > MAX_EXCERPT_LENGTH) {
      setError(`Short excerpt cannot exceed ${MAX_EXCERPT_LENGTH} characters.`);
      setSubmitting(false);
      return;
    }

    // --- Prepare FormData ---
    const fd = new FormData();
    
    Object.entries(values).forEach(([key, value]) => {
      if (key === "tags") {
        const tagsArray = value.split(",").map(t => t.trim()).filter(Boolean);
        fd.append(key, JSON.stringify(tagsArray));
      } else if (key === "capacity") {
        // Append capacity only if it's a valid number
        if (value && !isNaN(parseInt(value))) {
            fd.append(key, parseInt(value));
        }
      } else if (key === "featured") {
        fd.append(key, value.toString());
      } else {
        fd.append(key, value);
      }
    });
    
    fd.append("image", file);

    // --- API Call with Better Error Handling ---
    try {
      const response = await eventsAPI.create(fd);
      console.log("Create response:", response.data);
      
      alert("Event created successfully!");
      nav("/admin/events");
    } catch (err) {
      console.error("Creation failed:", err);
      // Enhanced Error Extraction: Try to get detailed message first
      let errorMessage = "Failed to create event.Internal server error.";


      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } 
      // Handle Mongoose Validation Errors (which often come back as status 400)
      else if (err.response && err.response.data && err.response.data.errors) {
         
         const validationErrors = err.response.data.errors;
         const firstKey = Object.keys(validationErrors)[0];
         errorMessage = `Validation Error: ${validationErrors[firstKey].message || validationErrors[firstKey]}`;
      }
      
      setError(errorMessage);
      window.scrollTo({
          top: 0,
          behavior: 'smooth' 
      });
      console.log("reason of failior creaction" ,errorMessage)


    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-black">
        <AdminHeader />
        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Create New Event
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Fill in the event details below to create a new event.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              🚨 **Error:** {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-6 max-w-4xl">
            {/* Basic Information */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Title *</label>
                  <input
                    name="title"
                    value={values.title}
                    onChange={onChange}
                    required
                    placeholder="Event Title"
                    className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Short Excerpt * ({values.shortExcerpt.length}/{MAX_EXCERPT_LENGTH})</label>
                  <textarea
                    name="shortExcerpt"
                    value={values.shortExcerpt}
                    onChange={onChange}
                    required
                    maxLength={MAX_EXCERPT_LENGTH} 
                    placeholder="Brief description of the event"
                    rows="3"
                    className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                  />
                  {/* Display client-side warning */}
                  {values.shortExcerpt.length > MAX_EXCERPT_LENGTH - 50 && (
                    <p className={`text-xs mt-1 ${values.shortExcerpt.length > MAX_EXCERPT_LENGTH ? 'text-red-500 font-bold' : 'text-yellow-500'}`}>
                        {MAX_EXCERPT_LENGTH - values.shortExcerpt.length} characters remaining.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Full Description</label>
                  <textarea
                    name="fullDescription"
                    value={values.fullDescription}
                    onChange={onChange}
                    placeholder="Detailed description of the event"
                    rows="6"
                    className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Meta Title</label>
                    <input
                      name="metaTitle"
                      value={values.metaTitle}
                      onChange={onChange}
                      placeholder="SEO Title"
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Meta Description</label>
                    <input
                      name="metaDescription"
                      value={values.metaDescription}
                      onChange={onChange}
                      placeholder="SEO Description"
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Category</label>
                    {/* --- CATEGORY DROPDOWN CHANGE --- */}
                    <select
                      name="category"
                      value={values.category}
                      onChange={onChange}
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {/* ---------------------------------- */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Audience</label>
                    <input
                      name="audience"
                      value={values.audience}
                      onChange={onChange}
                      placeholder="e.g., Developers, Students"
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Status</label>
                    <select
                      name="status"
                      value={values.status}
                      onChange={onChange}
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="postponed">Postponed</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Start Date & Time *</label>
                    <input
                      name="startDate"
                      value={values.startDate}
                      onChange={onChange}
                      type="datetime-local"
                      required
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">End Date & Time</label>
                    <input
                      name="endDate"
                      value={values.endDate}
                      onChange={onChange}
                      type="datetime-local"
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Mode</label>
                    <select
                      name="mode"
                      value={values.mode}
                      onChange={onChange}
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                    >
                      {/* Note: Your model had ["online", "in-person", "hybrid"]. I updated 'offline' to 'in-person' to match the model. */}
                      <option value="online">Online</option>
                      <option value="in-person">In-Person</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Capacity</label>
                    <input
                      name="capacity"
                      value={values.capacity}
                      onChange={onChange}
                      type="number"
                      placeholder="Maximum attendees"
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Timezone</label>
                    <input
                      name="timezone"
                      value={values.timezone}
                      onChange={onChange}
                      placeholder="e.g., Asia/Kolkata"
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information and Image upload sections follow here... (rest of your form) */}
            
            {/* ... (omitted for brevity, assume the rest of the form is here) ... */}

            {/* Additional Information */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Additional Links & Pricing</h3>
              <div className="space-y-4">
                {/* <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Registration Link</label>
                    <input
                      name="registrationLink"
                      value={values.registrationLink}
                      onChange={onChange}
                      placeholder="https://..."
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Recording Link</label>
                    <input
                      name="recordingLink"
                      value={values.recordingLink}
                      onChange={onChange}
                      placeholder="https://youtube.com/..."
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-300">Slides Link</label>
                    <input
                      name="slidesLink"
                      value={values.slidesLink}
                      onChange={onChange}
                      placeholder="https://drive.google.com/..."
                      className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                    />
                  </div>
                </div> */}
                
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Price (JSON format)</label>
                  <textarea
                    name="price"
                    value={values.price}
                    onChange={onChange}
                    placeholder='{"currency":"INR","value":0}'
                    rows="2"
                    className="border border-gray-700 bg-gray-800 text-cyan-400 px-3 py-2 rounded-lg w-full font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: {`{"currency":"INR","value":0}`}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Speakers (JSON format)</label>
                  <textarea
                    name="speakers"
                    value={values.speakers}
                    onChange={onChange}
                    placeholder='[{"name":"John Doe","title":"CEO","org":"Company"}]'
                    rows="3"
                    className="border border-gray-700 bg-gray-800 text-cyan-400 px-3 py-2 rounded-lg w-full font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: {`[{"name":"...","title":"...","org":"..."}]`}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-300">Tags (comma-separated)</label>
                  <input
                    name="tags"
                    value={values.tags}
                    onChange={onChange}
                    placeholder="genai, workshop, llm"
                    className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={values.featured}
                      onChange={onChange}
                      className="mr-2 h-4 w-4 text-cyan-600 focus:ring-2 focus:ring-cyan-500 bg-gray-800 border-gray-700 rounded"
                    />
                    <span className="text-sm font-medium text-gray-300">Featured Event</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="font-semibold text-white mb-4">Event Image</h3>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Upload Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-500/10 file:text-cyan-400
                    hover:file:bg-cyan-500/20 file:border file:border-cyan-500/30"
                />
                {file && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {file.name}
                  </p>
                )}
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1 text-gray-300">Image Alt Text</label>
                  <input
                    name="imageAlt"
                    value={values.imageAlt}
                    onChange={onChange}
                    placeholder="Descriptive alt text for the image"
                    className="border border-gray-700 bg-gray-800 text-white px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pb-6">
              <button
                type="submit"
                disabled={submitting}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating..." : "Create Event"}
              </button>
              <button
                type="button"
                onClick={() => nav("/admin/events")}
                disabled={submitting}
                className="px-6 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}