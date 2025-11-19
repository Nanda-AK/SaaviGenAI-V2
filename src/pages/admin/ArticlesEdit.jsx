//src/pages/admin/ArticlesEdit.jsx
import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { articlesAPI } from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ArticlesEdit() {
  const { id, slug } = useParams();
  const editing = id !== "create";
  const nav = useNavigate();
  
  const [loading, setLoading] = useState(editing);
  const [submitting, setSubmitting] = useState(false);
  const [articleId, setArticleId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: '{"name":"","designation":""}',
    published: false,
    featured: false,
    seo: '{"metaTitle":"","metaDescription":"","metaKeywords":[],"robots":"index,follow"}'
  });
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState("");
  const [showJsonHelper, setShowJsonHelper] = useState({ author: false, seo: false });

  useEffect(() => {
    if (editing) {
      loadArticle();
    }
  }, [id]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const res = await articlesAPI.getBySlug(slug);
      console.log("Loaded article:", res.data);
      
      const article = res.data.data || res.data;
      setArticleId(article._id);
      
      setForm({
        title: article.title || "",
        excerpt: article.excerpt || "",
        content: article.content || "",
        category: article.category || "",
        tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
        author: JSON.stringify(article.author || { name: "", designation: "" }, null, 2),
        published: article.published || false,
        featured: article.featured || false,
        seo: JSON.stringify(article.seo || {
          metaTitle: "",
          metaDescription: "",
          metaKeywords: [],
          robots: "index,follow"
        }, null, 2)
      });
      
      setCurrentImage(article.featuredImage?.url || "");
    } catch (err) {
      console.error("Failed to load article:", err);
      setError("Failed to load article data");
    } finally {
      setLoading(false);
    }
  };

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const quickFillAuthor = () => {
    const authorTemplate = {
      name: "Nanda Kumar",
      designation: "Founder & CEO, SaaviGen.AI"
    };
    setForm(s => ({ ...s, author: JSON.stringify(authorTemplate, null, 2) }));
  };

  const quickFillSEO = () => {
    const seoTemplate = {
      metaTitle: form.title + " | SaaviGen.AI",
      metaDescription: form.excerpt.slice(0, 160),
      metaKeywords: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      robots: "index,follow"
    };
    setForm(s => ({ ...s, seo: JSON.stringify(seoTemplate, null, 2) }));
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setSubmitting(true);
    setError("");

    // Validate JSON fields
    try {
      JSON.parse(form.author);
      JSON.parse(form.seo);
    } catch (e) {
      setError("Invalid JSON format in Author or SEO fields");
      setSubmitting(false);
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("excerpt", form.excerpt);
    fd.append("content", form.content);
    fd.append("category", form.category);
    
    const tagsArray = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    fd.append("tags", JSON.stringify(tagsArray));
    fd.append("author", form.author);
    fd.append("published", form.published.toString());
    fd.append("featured", form.featured.toString());
    fd.append("seo", form.seo);
    
    if (file) {
      fd.append("featuredImage", file);
    }

    try {
      let response;
      if (editing) {
        response = await articlesAPI.update(articleId, fd);
      } else {
        response = await articlesAPI.create(fd);
      }
      
      alert(editing ? "Article updated successfully!" : "Article created successfully!");
      nav("/admin/articles");
    } catch (e) {
      console.error("Save failed:", e);
      setError(e.response?.data?.message || "Failed to save article");
      alert(e.response?.data?.message || "Failed to save article");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-slate-50">
          <AdminHeader />
          <main className="p-6">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-blue-600 mb-4"></div>
                <p className="text-lg text-slate-600">Loading article...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

 return (
  <div className="flex min-h-screen bg-[#0b0b0e] text-slate-200">
    <AdminSidebar />
    <div className="flex-1 bg-[#0b0b0e]">
      <AdminHeader />

      <main className="p-8 max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => nav("/admin/articles")}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-white">
              {editing ? "Edit Article" : "Create New Article"}
            </h1>
          </div>

          <p className="text-slate-400 ml-8">
            {editing
              ? "Update your article content and settings"
              : "Create engaging content for your audience"}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0..." />
            </svg>
            <div>
              <p className="font-semibold text-red-300">Error</p>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Card - Content */}
            <div className="bg-[#111217] rounded-xl shadow border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-blue-900/40 to-transparent">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor">
                    <path d="..." />
                  </svg>
                  Content
                </h2>
              </div>

              <div className="p-6 space-y-5">

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={change}
                    required
                    placeholder="Enter an engaging title for your article"
                    className="w-full px-4 py-3 text-lg bg-[#0f0f12] border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">{form.title.length} characters</p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Excerpt <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={form.excerpt}
                    onChange={change}
                    required
                    placeholder="Write a compelling summary…"
                    rows="3"
                    className="w-full px-4 py-3 bg-[#0f0f12] border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1.5 text-xs text-slate-500">
                    {form.excerpt.length} characters {form.excerpt.length > 200 && "⚠️ Keep it under 200"}
                  </p>
                </div>

                {/* Content HTML */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Article Content (HTML) <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    name="content"
                    value={form.content}
                    onChange={change}
                    required
                    rows="16"
                    className="w-full px-4 py-3 bg-[#0f0f12] border border-slate-600 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="<h2>Introduction</h2>..."
                  />

                  <div className="mt-2 p-3 bg-blue-900/30 rounded-lg border border-blue-800">
                    <p className="text-xs text-blue-300 font-medium mb-1">💡 HTML Tips:</p>
                    <p className="text-xs text-blue-400">Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt; etc.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-[#111217] rounded-xl shadow border border-slate-700 overflow-hidden">
              <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-green-900/40 to-transparent flex justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor">
                    <path d="..." />
                  </svg>
                  SEO Settings
                </h2>

                <button
                  type="button"
                  onClick={quickFillSEO}
                  className="text-xs px-3 py-1.5 bg-green-900/40 text-green-300 hover:bg-green-800 rounded-lg"
                >
                  Auto-fill from content
                </button>
              </div>

              <div className="p-6">

                {/* Helper */}
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-300">
                    SEO Metadata (JSON)
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowJsonHelper(s => ({ ...s, seo: !s.seo }))}
                    className="text-xs text-blue-300 hover:text-blue-200 underline"
                  >
                    {showJsonHelper.seo ? "Hide" : "Show"} format guide
                  </button>
                </div>

                {showJsonHelper.seo && (
                  <div className="mb-3 p-3 bg-[#0f0f12] rounded-lg border border-slate-700 text-xs font-mono text-slate-300">
                    <pre>{`{\n  "metaTitle": "Article Title",\n  ...\n}`}</pre>
                  </div>
                )}

                <textarea
                  name="seo"
                  value={form.seo}
                  onChange={change}
                  rows="6"
                  className="w-full px-4 py-3 bg-[#0f0f12] border border-slate-600 rounded-lg text-white font-mono focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">

            {/* Actions */}
            <div className="bg-[#111217] rounded-xl shadow border border-slate-700 overflow-hidden sticky top-6">
              <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-purple-900/40 to-transparent">
                <h3 className="font-semibold text-white">Actions</h3>
              </div>

              <div className="p-4 space-y-3">

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="..." />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor">
                        <path d="..." />
                      </svg>
                      {editing ? "Update Article" : "Create Article"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => nav("/admin/articles")}
                  disabled={submitting}
                  className="w-full px-4 py-2.5 border border-slate-600 text-slate-300 hover:bg-[#1a1a21] rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Publishing */}
            <div className="bg-[#111217] rounded-xl shadow border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-amber-900/40 to-transparent">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor">
                    <path d="..." />
                  </svg>
                  Publishing
                </h3>
              </div>

              <div className="p-4 space-y-4">
                {/* Published */}
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a21] cursor-pointer">
                  <input
                    type="checkbox"
                    name="published"
                    checked={form.published}
                    onChange={change}
                    className="w-5 h-5 text-blue-500 rounded"
                  />
                  <div>
                    <div className="font-semibold text-white">Published</div>
                    <div className="text-xs text-slate-400">Make article visible</div>
                  </div>
                </label>

                {/* Featured */}
                <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1a1a21] cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={change}
                    className="w-5 h-5 text-amber-500 rounded"
                  />
                  <div>
                    <div className="font-semibold text-white">Featured</div>
                    <div className="text-xs text-slate-400">Show on homepage</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Category / Tags */}
            <div className="bg-[#111217] rounded-xl shadow border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-indigo-900/40 to-transparent">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-400" stroke="currentColor">
                    <path d="..." />
                  </svg>
                  Organization
                </h3>
              </div>

              <div className="p-4 space-y-4">

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={change}
                    required
                    className="w-full px-3 py-2 bg-[#0f0f12] border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                    placeholder="Tech, AI/ML, etc."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Tags</label>

                  <input
                    name="tags"
                    value={form.tags}
                    onChange={change}
                    className="w-full px-3 py-2 bg-[#0f0f12] border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                    placeholder="rag, genai, llm…"
                  />

                  <p className="mt-1.5 text-xs text-slate-500">Separate with commas</p>

                  {form.tags && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {form.tags.split(",").map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-indigo-900/50 text-indigo-300 text-xs rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Author Info */}
            <div className="bg-[#111217] rounded-xl shadow border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-pink-900/40 to-transparent flex justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-pink-400" stroke="currentColor">
                    <path d="..." />
                  </svg>
                  Author
                </h3>

                <button
                  type="button"
                  onClick={quickFillAuthor}
                  className="text-xs px-3 py-1.5 bg-pink-900/40 text-pink-300 hover:bg-pink-800 rounded-lg"
                >
                  Quick fill
                </button>
              </div>

              <div className="p-4">

                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-300">
                    Author Info (JSON)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowJsonHelper(s => ({ ...s, author: !s.author }))}
                    className="text-xs text-blue-300 hover:text-blue-200 underline"
                  >
                    {showJsonHelper.author ? "Hide" : "Show"} format
                  </button>
                </div>

                {showJsonHelper.author && (
                  <div className="mb-3 p-3 bg-[#0f0f12] border border-slate-700 rounded-lg text-xs font-mono text-slate-300">
                    <pre>{`{\n  "name": "John Doe",\n  "designation": "CEO"\n}`}</pre>
                  </div>
                )}

                <textarea
                  name="author"
                  value={form.author}
                  onChange={change}
                  rows="3"
                  className="w-full px-3 py-2 bg-[#0f0f12] border border-slate-600 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-[#111217] rounded-xl shadow border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700 bg-gradient-to-r from-cyan-900/40 to-transparent">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" stroke="currentColor">
                    <path d="..." />
                  </svg>
                  Featured Image
                </h3>
              </div>

              <div className="p-4">

                {currentImage && (
                  <div className="mb-4">
                    <img
                      src={currentImage}
                      className="w-full h-48 object-cover rounded-lg border border-slate-700"
                    />
                    <p className="text-xs text-slate-500 mt-2">Current image</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-400
                    file:mr-4 file:py-2.5 file:px-4
                    file:rounded-lg file:border-0
                    file:bg-cyan-900/40 file:text-cyan-300
                    hover:file:bg-cyan-800 cursor-pointer"
                />

                {file && (
                  <div className="mt-3 p-3 bg-cyan-900/30 border border-cyan-800 rounded-lg">
                    <p className="text-sm text-cyan-300 font-medium">📎 {file.name}</p>
                    <p className="text-xs text-cyan-400 mt-1">Ready to upload</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </form>
      </main>
    </div>
  </div>
);

}