//  src/pages/admin/ArticlesAdmin.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import DataTable from "../../components/admin/AdminDataTable";
import { articlesAPI } from "../../services/api";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ArticlesAdmin() {
  const [articles, setArticles] = useState([]);
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
      const res = await articlesAPI.list({ page, limit: 50 });
      console.log("Articles API Response:", res.data);
      
      const articlesData = res.data.data?.articles || res.data.articles || [];
      const paginationData = res.data.data?.pagination || {};
      
      setArticles(articlesData);
      setPagination(paginationData);
    } catch (e) {
      console.error("Failed to load articles:", e);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    
    try {
      await articlesAPI.delete(id);
      setArticles((prevArticles) => prevArticles.filter((a) => a._id !== id));
      alert("Article deleted successfully");
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Failed to delete article");
    }
  };

  const featuredToggle = async (id) => {
    try {
      await articlesAPI.featuredToggle(id);
      await load(pagination.page);
    } catch (e) {
      console.error("Toggle featured failed:", e);
      alert("Failed to update featured status");
    }
  };

  const columns = [
    {
      key: "featuredImage",
      label: "Image",
      render: (r) => r.featuredImage?(
        
        <img 
          src={r.featuredImage} 
          alt={r.title} 
          className="w-16 h-16 object-cover rounded"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-800 rounded flex items-center justify-center text-xs text-gray-500">
          No image
          {console.log(r.featuredImage)}
        </div>
      )
    },
    {
      key: "title",
      label: "Title",
      render: (r) => (
        <div>
          <div className="font-medium text-white">{r.title}</div>
          <div className="flex gap-2 mt-1">
            {r.published && (
              <span className="inline-block px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
                Published
              </span>
            )}
            {r.featured && (
              <span className="inline-block px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
                Featured
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: "category",
      label: "Category",
      render: (r) => (
        <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
          {r.category}
        </span>
      )
    },
    {
      key: "author",
      label: "Author",
      render: (r) => (
        <div className="text-sm">
          <div className="text-white">{r.author?.name || "Unknown"}</div>
          {r.author?.designation && (
            <div className="text-xs text-gray-400">{r.author.designation}</div>
          )}
        </div>
      )
    },
 
    {
      key: "createdAt",
      label: "Created",
      render: (r) => (
        <div className="text-sm text-gray-400">
          {new Date(r.createdAt).toLocaleDateString()}
        </div>
      )
    }
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen bg-black">
        <AdminHeader />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white">Articles Management</h2>
              <p className="text-sm text-gray-400 mt-1">
                Total: {pagination.total} article{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/admin/articles/create"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Create Article
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
              <div className="mt-2 text-gray-400">Loading articles...</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">No articles found</div>
              <Link
                to="/admin/articles/create"
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Create Your First Article
              </Link>
            </div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={articles}
                actions={(row) => (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => nav(`/articles/${row.slug}`)}
                      className="text-sm text-cyan-400 hover:text-cyan-300 text-left"
                    >
                      View
                    </button>
                    <button
                      onClick={() => nav(`/admin/articles/${row.slug}/edit`)}
                      className="text-sm text-gray-400 hover:text-white text-left"
                    >
                      Edit
                    </button>
                    
                    <button
                      onClick={() => featuredToggle(row._id)}
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