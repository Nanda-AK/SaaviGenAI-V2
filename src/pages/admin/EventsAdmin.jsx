// src/pages/admin/EventsAdmin.jsx
import React, { useEffect, useState } from "react";
import { eventsAPI } from "../../services/api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import DataTable from "../../components/admin/AdminDataTable";
import { Link, useNavigate } from "react-router-dom";

export default function EventsAdmin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0
  });
  const nav = useNavigate();

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await eventsAPI.list({ page, limit: 50 });
      console.log("API Response:", res.data);
      
      const eventsData = res.data.data?.events || res.data.events || [];
      const paginationData = res.data.data?.pagination || {};
      
      setEvents(eventsData);
      setPagination(paginationData);
    } catch (e) {
      console.error("Failed to load events:", e);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await eventsAPI.delete(id);
      setEvents((prevEvents) => prevEvents.filter((e) => e._id !== id));
      alert("Event deleted successfully");
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Failed to delete event");
    }
  };

  const toggleFeatured = async (id) => {
    try {
      await eventsAPI.toggleFeatured(id);
      await load(pagination.page);
    } catch (e) { 
      console.error("Toggle featured failed:", e);
      alert("Failed to update featured status");
    }
  };

  const columns = [
    { 
      key: "image", 
      label: "Image", 
      render: (r) => r.image ? (
        <img src={r.image} alt={r.imageAlt || r.title} className="w-16 h-16 object-cover rounded" />
      ) : (
        <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">No image</div>
      )
    },
    { 
      key: "title", 
      label: "Title", 
      render: (r) => (
        <div>
          <div className="font-medium text-white">{r.title}</div>
          {r.featured && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">Featured</span>
          )}
        </div>
      )
    },
    { 
      key: "category", 
      label: "Category",
      render: (r) => (
        <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded border border-purple-500/30">
          {r.category}
        </span>
      )
    },
    { 
      key: "startDate", 
      label: "Start Date", 
      render: (r) => r.startDate ? (
        <div>
          <div className="text-sm text-white">{new Date(r.startDate).toLocaleDateString()}</div>
          <div className="text-xs text-gray-400">{new Date(r.startDate).toLocaleTimeString()}</div>
        </div>
      ) : "-"
    },
    { 
      key: "status", 
      label: "Status",
      render: (r) => {
        const statusColors = {
          scheduled: "bg-green-500/20 text-green-400 border-green-500/30",
          completed: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
          ongoing: "bg-blue-500/20 text-blue-400 border-blue-500/30"
        };
        return (
          <span className={`inline-block px-2 py-1 text-xs rounded border ${statusColors[r.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
            {r.status}
          </span>
        );
      }
    },
    { 
      key: "mode", 
      label: "Mode",
      render: (r) => (
        <span className="capitalize text-sm text-cyan-400">{r.mode}</span>
      )
    },
    
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-black">
        <AdminHeader />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Events Management</h2>
              <p className="text-sm text-gray-400 mt-1">
                Total: {pagination.total} event{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Link 
                to="/admin/events/create" 
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Create Event
              </Link>
              <button 
                onClick={() => load(pagination.page)} 
                className="px-4 py-2 border border-gray-700 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-700 border-t-cyan-500"></div>
              <div className="mt-2 text-gray-400">Loading events...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">No events found</div>
              <Link 
                to="/admin/events/create" 
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create Your First Event
              </Link>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={events}
                actions={(row) => (
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => nav(`/events/${row.slug || row._id}`)} 
                      className="text-sm text-cyan-400 hover:text-cyan-300 text-left"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => nav(`/admin/events/${row.slug}/edit`)} 
                      className="text-sm text-gray-400 hover:text-white text-left"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleFeatured(row._id)} 
                      className="text-sm text-yellow-400 hover:text-yellow-300 text-left"
                    >
                      {row.featured ? "Unfeature" : "Feature"}
                    </button>
                    <button 
                      onClick={() => handleDelete(row._id)} 
                      className="text-sm text-red-400 hover:text-red-300 text-left"
                    >
                      Delete
                    </button>
                  </div>
                )}
              />
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="text-sm text-gray-400">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => load(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1 border border-gray-700 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => load(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1 border border-gray-700 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}