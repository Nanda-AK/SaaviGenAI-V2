import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader from "../../components/admin/AdminHeader";
import { articlesAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function ArticlesCreate() {
  const nav = useNavigate();
  
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: '{\n  "name": "",\n  "designation": ""\n}',
    published: false,
    featured: false,
    seo: '{\n  "metaTitle": "",\n  "metaDescription": "",\n  "metaKeywords": [],\n  "robots": "index,follow"\n}'
  });
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [showJsonHelper, setShowJsonHelper] = useState({ author: false, seo: false });

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview("");
    }
  };

  const quickFillAuthor = () => {
    const authorTemplate = {
      name: "Nanda Kumar",
      designation: "Founder & CEO, SaaviGen.AI"
    };
    setForm(s => ({ ...s, author: JSON.stringify(authorTemplate, null, 2) }));
  };

  const quickFillSEO = () => {
    if (!form.title || !form.excerpt) {
      alert("Please fill in title and excerpt first to auto-generate SEO");
      return;
    }
    
    const seoTemplate = {
      metaTitle: form.title + " | SaaviGen.AI",
      metaDescription: form.excerpt.slice(0, 160),
      metaKeywords: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      robots: "index,follow"
    };
    setForm(s => ({ ...s, seo: JSON.stringify(seoTemplate, null, 2) }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!form.excerpt.trim()) {
      setError("Excerpt is required");
      return false;
    }
    if (!form.content.trim()) {
      setError("Content is required");
      return false;
    }
    if (!form.category.trim()) {
      setError("Category is required");
      return false;
    }

    try {
      JSON.parse(form.author);
    } catch (e) {
      setError("Invalid JSON format in Author field");
      return false;
    }

    try {
      JSON.parse(form.seo);
    } catch (e) {
      setError("Invalid JSON format in SEO field");
      return false;
    }

    return true;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

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
      const response = await articlesAPI.create(fd);
      console.log("Create response:", response.data);
      console.log("Article created")
      
      alert("Article created successfully!");
      nav("/admin/articles");
    } catch (e) {
      console.error("Create failed:", e);
      setError(e.response?.data?.message || "Failed to create article");
      alert(e.response?.data?.message || "Failed to create article");
    } finally {
      setSubmitting(false);
    }
  };

  const loadTemplate = () => {
    const template = {
      title: "Understanding RAG in GenAI",
      excerpt: "A comprehensive guide to Retrieval Augmented Generation and how it enhances Large Language Models",
      content: `<h2>Introduction to RAG</h2>
<p>Retrieval Augmented Generation (RAG) is a powerful technique that combines the strengths of retrieval-based systems with generative AI models.</p>

<h3>What is RAG?</h3>
<p>RAG works by retrieving relevant information from a knowledge base and using it to augment the context provided to a language model. This approach helps reduce hallucinations and provides more accurate, up-to-date responses.</p>

<h3>Key Benefits</h3>
<ul>
  <li>Improved accuracy and reliability</li>
  <li>Access to up-to-date information</li>
  <li>Reduced hallucinations</li>
  <li>Domain-specific knowledge integration</li>
</ul>

<h3>How RAG Works</h3>
<p>The RAG process involves three main steps:</p>
<ol>
  <li><strong>Retrieval:</strong> Query relevant documents from a knowledge base</li>
  <li><strong>Augmentation:</strong> Combine retrieved context with user query</li>
  <li><strong>Generation:</strong> Generate response using LLM with augmented context</li>
</ol>

<h2>Conclusion</h2>
<p>RAG represents a significant advancement in making AI systems more reliable and useful for real-world applications.</p>`,
      category: "AI/ML",
      tags: "rag, genai, llm, ai, machine learning",
      author: JSON.stringify({
        name: "Nanda Kumar",
        designation: "Founder & CEO, SaaviGen.AI"
      }, null, 2),
      seo: JSON.stringify({
        metaTitle: "Understanding RAG in GenAI - Complete Guide | SaaviGen.AI",
        metaDescription: "Learn everything about Retrieval Augmented Generation and how it enhances Large Language Models. A comprehensive guide for developers and AI practitioners.",
        metaKeywords: ["rag", "genai", "retrieval augmented generation", "llm", "ai"],
        robots: "index,follow"
      }, null, 2)
    };
    
    setForm(s => ({ ...s, ...template }));
    alert("Template loaded! Feel free to customize it.");
  };

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        
        <main className="p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => nav("/admin/articles")}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-white">Create New Article</h1>
                  <p className="text-gray-400 mt-1">Share your knowledge with the world</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={loadTemplate}
                className="px-4 py-2 bg-purple-900/50 text-purple-300 hover:bg-purple-900/70 rounded-lg font-medium transition-colors flex items-center gap-2 border border-purple-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Load Template
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
              {/* Title & Content Card */}
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-blue-950/30 to-gray-900">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Article Content
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Article Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={change}
                      required
                      placeholder="Enter an engaging title for your article"
                      className="w-full px-4 py-3 text-lg bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow placeholder-gray-500"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">
                      {form.title.length} characters {form.title.length > 0 && form.title.length < 30 && "• Consider making it more descriptive (30-60 chars recommended)"}
                    </p>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Excerpt <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="excerpt"
                      value={form.excerpt}
                      onChange={change}
                      required
                      placeholder="Write a compelling summary that will appear in article listings and search results (160-200 characters recommended)"
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow resize-none placeholder-gray-500"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">
                      {form.excerpt.length} characters 
                      {form.excerpt.length > 0 && form.excerpt.length < 100 && " • Too short"}
                      {form.excerpt.length >= 100 && form.excerpt.length <= 200 && " • ✓ Good length"}
                      {form.excerpt.length > 200 && " • Consider shortening for better readability"}
                    </p>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Article Content (HTML) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={change}
                      required
                      placeholder="<h2>Introduction</h2>&#10;<p>Start writing your article content here. You can use HTML tags for formatting.</p>&#10;&#10;<h3>Key Points</h3>&#10;<ul>&#10;  <li>Point 1</li>&#10;  <li>Point 2</li>&#10;</ul>"
                      rows="18"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow font-mono text-sm resize-y placeholder-gray-600"
                    />
                    <div className="mt-2 p-3 bg-blue-950/30 rounded-lg border border-blue-900/50">
                      <p className="text-xs text-blue-300 font-medium mb-1">💡 HTML Tips:</p>
                      <p className="text-xs text-blue-400">Use &lt;h2&gt;, &lt;h3&gt; for headings • &lt;p&gt; for paragraphs • &lt;ul&gt;/&lt;ol&gt; for lists • &lt;strong&gt; for bold • &lt;em&gt; for italic • &lt;a href="..."&gt; for links</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Settings Card */}
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-green-950/30 to-gray-900">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      SEO Settings
                    </h2>
                    <button
                      type="button"
                      onClick={quickFillSEO}
                      className="text-xs px-3 py-1.5 bg-green-900/50 text-green-300 hover:bg-green-900/70 rounded-lg font-medium transition-colors border border-green-700"
                    >
                      Auto-generate SEO
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-300">
                      SEO Metadata (JSON)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowJsonHelper(s => ({ ...s, seo: !s.seo }))}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                    >
                      {showJsonHelper.seo ? "Hide" : "Show"} format guide
                    </button>
                  </div>
                  
                  {showJsonHelper.seo && (
                    <div className="mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-xs font-mono">
                      <pre className="text-cyan-400 whitespace-pre-wrap">{`{
  "metaTitle": "Article Title | SaaviGen.AI",
  "metaDescription": "Brief description (150-160 chars)",
  "metaKeywords": ["keyword1", "keyword2", "keyword3"],
  "robots": "index,follow"
}`}</pre>
                    </div>
                  )}
                  
                  <textarea
                    name="seo"
                    value={form.seo}
                    onChange={change}
                    rows="7"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Actions Card */}
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden sticky top-6">
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-purple-950/30 to-gray-900">
                  <h3 className="font-semibold text-white">Publish Article</h3>
                </div>
                <div className="p-4 space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create Article
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => nav("/admin/articles")}
                    disabled={submitting}
                    className="w-full px-4 py-2.5 border-2 border-gray-700 text-gray-300 hover:bg-gray-800 font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Publishing Options Card */}
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-amber-950/30 to-gray-900">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Visibility
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors border-2 border-transparent has-[:checked]:border-cyan-700 has-[:checked]:bg-cyan-950/30">
                    <input
                      type="checkbox"
                      name="published"
                      checked={form.published}
                      onChange={change}
                      className="w-5 h-5 text-cyan-600 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-cyan-500"
                    />
                    <div>
                      <div className="font-semibold text-white">Publish Now</div>
                      <div className="text-xs text-gray-400">Make article visible to readers immediately</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors border-2 border-transparent has-[:checked]:border-amber-700 has-[:checked]:bg-amber-950/30">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={change}
                      className="w-5 h-5 text-amber-600 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-amber-500"
                    />
                    <div>
                      <div className="font-semibold text-white">Feature Article</div>
                      <div className="text-xs text-gray-400">Display prominently on homepage</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Category & Tags Card */}
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-indigo-950/30 to-gray-900">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Categorization
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={change}
                      required
                      placeholder="e.g., AI/ML, Technology, Tutorial"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow placeholder-gray-500"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">Choose a primary category</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">
                      Tags
                    </label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={change}
                      placeholder="rag, genai, llm, ai, machine learning"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow placeholder-gray-500"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">Comma-separated keywords</p>
                    {form.tags && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {form.tags.split(",").map((tag, i) => (
                          tag.trim() && (
                            <span key={i} className="px-2 py-1 bg-indigo-900/50 text-indigo-300 text-xs rounded-full font-medium border border-indigo-700">
                              {tag.trim()}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Author Card */}
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-pink-950/30 to-gray-900">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Author
                    </h3>
                    <button
                      type="button"
                      onClick={quickFillAuthor}
                      className="text-xs px-3 py-1.5 bg-pink-900/50 text-pink-300 hover:bg-pink-900/70 rounded-lg font-medium transition-colors border border-pink-700"
                    >
                      Quick fill
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-300">
                      Author Info (JSON)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowJsonHelper(s => ({ ...s, author: !s.author }))}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                    >
                      {showJsonHelper.author ? "Hide" : "Show"} format
                    </button>
                  </div>
                  
                  {showJsonHelper.author && (
                    <div className="mb-3 p-3 bg-gray-800 rounded-lg border border-gray-700 text-xs font-mono">
                      <pre className="text-cyan-400">{`{
  "name": "John Doe",
  "designation": "CEO & Founder"
}`}</pre>
                    </div>
                  )}
                  
                  <textarea
                    name="author"
                    value={form.author}
                    onChange={change}
                    rows="4"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-cyan-400 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow font-mono text-sm"
                  />
                </div>
              </div>

              {/* Featured Image Card */}
              <div className="bg-gray-900 rounded-xl shadow-sm border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-cyan-950/30 to-gray-900">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Featured Image
                  </h3>
                </div>
                <div className="p-4">
                  {imagePreview && (
                    <div className="mb-4">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFile(null);
                            setImagePreview("");
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Preview</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2.5 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-cyan-900/50 file:text-cyan-300
                      hover:file:bg-cyan-900/70 cursor-pointer file:border file:border-cyan-700"
                  />
                  
                  {file && (
                    <div className="mt-3 p-3 bg-cyan-950/30 rounded-lg border border-cyan-900/50">
                      <p className="text-sm text-cyan-300 font-medium">
                        📎 {file.name}
                      </p>
                      <p className="text-xs text-cyan-400 mt-1">
                        {(file.size / 1024).toFixed(2)} KB • Ready to upload
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                    <p className="text-xs text-gray-400">
                      💡 <strong className="text-gray-300">Tip:</strong> Use high-quality images (1200x630px recommended) for best results on social media
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Tips Card */}
              <div className="bg-gradient-to-br from-violet-950/50 to-purple-950/50 rounded-xl shadow-sm border border-violet-800 overflow-hidden">
                <div className="p-4 border-b border-violet-800">
                  <h3 className="font-semibold text-violet-200 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Writing Tips
                  </h3>
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex gap-2">
                    <span className="text-violet-400 font-bold">1.</span>
                    <p className="text-violet-200">Write an attention-grabbing title (50-60 characters)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-violet-400 font-bold">2.</span>
                    <p className="text-violet-200">Keep excerpt concise and compelling (150-200 chars)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-violet-400 font-bold">3.</span>
                    <p className="text-violet-200">Structure content with clear headings (H2, H3)</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-violet-400 font-bold">4.</span>
                    <p className="text-violet-200">Use lists and examples for readability</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-violet-400 font-bold">5.</span>
                    <p className="text-violet-200">Add relevant tags for better discoverability</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}