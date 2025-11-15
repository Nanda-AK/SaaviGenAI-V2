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
      
      // Extract events array from nested structure
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
        <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-500">No image</div>
      )
    },
    { 
      key: "title", 
      label: "Title", 
      render: (r) => (
        <div>
          <div className="font-medium">{r.title}</div>
          {r.featured && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Featured</span>
          )}
        </div>
      )
    },
    { 
      key: "category", 
      label: "Category",
      render: (r) => (
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
          {r.category}
        </span>
      )
    },
    { 
      key: "startDate", 
      label: "Start Date", 
      render: (r) => r.startDate ? (
        <div>
          <div className="text-sm">{new Date(r.startDate).toLocaleDateString()}</div>
          <div className="text-xs text-slate-500">{new Date(r.startDate).toLocaleTimeString()}</div>
        </div>
      ) : "-"
    },
    { 
      key: "status", 
      label: "Status",
      render: (r) => {
        const statusColors = {
          scheduled: "bg-green-100 text-green-800",
          completed: "bg-gray-100 text-gray-800",
          cancelled: "bg-red-100 text-red-800",
          ongoing: "bg-blue-100 text-blue-800"
        };
        return (
          <span className={`inline-block px-2 py-1 text-xs rounded ${statusColors[r.status] || "bg-slate-100 text-slate-800"}`}>
            {r.status}
          </span>
        );
      }
    },
    { 
      key: "mode", 
      label: "Mode",
      render: (r) => (
        <span className="capitalize text-sm">{r.mode}</span>
      )
    },
    { 
      key: "attendees", 
      label: "Attendees",
      render: (r) => (
        <div className="text-sm">
          {r.attendees || 0} / {r.capacity || "∞"}
        </div>
      )
    },
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-slate-50">
        <AdminHeader />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Events Management</h2>
              <p className="text-sm text-slate-600 mt-1">
                Total: {pagination.total} event{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Link 
                to="/admin/events/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Create Event
              </Link>
              <button 
                onClick={() => load(pagination.page)} 
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white border rounded-lg p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600"></div>
              <div className="mt-2 text-slate-600">Loading events...</div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white border rounded-lg p-8 text-center">
              <div className="text-slate-500 mb-4">No events found</div>
              <Link 
                to="/admin/events/create" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
                      className="text-sm text-blue-600 hover:text-blue-800 text-left"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => nav(`/admin/events/${row.slug}/edit`)} 
                      className="text-sm text-slate-600 hover:text-slate-800 text-left"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleFeatured(row._id)} 
                      className="text-sm text-amber-600 hover:text-amber-800 text-left"
                    >
                      {row.featured ? "Unfeature" : "Feature"}
                    </button>
                    <button 
                      onClick={() => handleDelete(row._id)} 
                      className="text-sm text-red-600 hover:text-red-800 text-left"
                    >
                      Delete
                    </button>
                  </div>
                )}
              />
              
              {/* Pagination Info */}
              {pagination.totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center bg-white border rounded-lg p-4">
                  <div className="text-sm text-slate-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => load(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => load(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages}
                      className="px-3 py-1 border rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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