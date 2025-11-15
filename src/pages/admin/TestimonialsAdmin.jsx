// src/pages/admin/TestimonialsAdmin.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import DataTable from "../../components/admin/AdminDataTable";
import { testimonialsAPI } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function TestimonialsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state for better UX
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await testimonialsAPI.list({ page: 1, limit: 50 });
      
      // 🐛 BUG FIX: Access res.data.data.testimonials for the array of items
      const testimonialList = res.data.data?.testimonials || []; 
      
      setItems(testimonialList);
    } catch (e) { 
      console.error("Failed to load testimonials:", e); 
      setItems([]); // Clear items on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await testimonialsAPI.delete(id);
      setItems((s) => s.filter((x) => x._id !== id));
      alert("Testimonial deleted successfully!");
    } catch (e) { 
      console.error("Delete failed:", e);
      alert("Delete failed"); 
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-slate-50"> {/* Added bg-slate-50 for consistency */}
        <AdminHeader />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Testimonials Management</h2> {/* Improved Heading */}
              <p className="text-sm text-slate-600 mt-1">Total: {items.length} testimonial{items.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex gap-2">
              <Link 
                to="/admin/testimonials/create" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Create Testimonial
              </Link>
              <button 
                onClick={load} 
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="bg-white border rounded-lg p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-blue-600"></div>
              <div className="mt-2 text-slate-600">Loading testimonials...</div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg shadow-sm">
              <DataTable
                data={items}
                columns={[
                  { 
                    key: "name", 
                    label: "Client",
                    // Added more detail to the list view
                    render: (r) => (
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-slate-500">{r.designation}</div>
                      </div>
                    )
                  },
                  { key: "company", label: "Company" },
                  { key: "rating", label: "Rating" },
                  { 
                    key: "featured", 
                    label: "Featured",
                    render: (r) => r.featured ? (
                        <span className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Yes</span>
                    ) : (
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">No</span>
                    )
                  },
                ]}
                
                actions={(row) => (
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => nav(`/admin/testimonials/${row._id}/edit`)} 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => del(row._id)} 
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                )}
              />
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}