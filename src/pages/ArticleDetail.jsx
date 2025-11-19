// src/pages/ArticleDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { articlesAPI } from "../services/api";
import { useAuth } from "../context/authContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await articlesAPI.getBySlug(slug);
        setArticle(res.data.data);
      } catch (e) {
        console.error("Failed to load article:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await articlesAPI.delete(article._id || article.id);
      navigate("/articles");
    } catch (err) {
      console.error(err);
      alert("Failed to delete article");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-white mb-2">Article not found</h2>
          <p className="text-gray-400 mb-6">The article you're looking for doesn't exist</p>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-black">
      {/* Admin Controls */}
      {isAdmin() && (
        <div className="fixed bottom-8 right-8 z-50 flex gap-2">
          <button
            onClick={() => navigate(`/admin/articles/${slug}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 shadow-lg transition-all flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        {article.featuredImage && (
          <>
            <img
              src={article.featuredImage}
              alt={article.imageAlt || article.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </>
        )}

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Back Button */}
            <Link
                    to="/articles"
                    className="fixed top-28 right-6 z-50 inline-flex items-center gap-2 px-4 py-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 rounded-lg transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Articles
                  </Link>

            {/* Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {article.category && (
                <span className="px-4 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full">
                  {article.category}
                </span>
              )}
              {article.featured && (
                <span className="px-4 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                {article.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {/* Author */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-black font-bold">
                  {(article.author?.name || "SaaviGen").charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">
                    {article.author?.name || "SaaviGen"}
                  </div>
                  {article.publishedAt && (
                    <div>{dayjs(article.publishedAt).format("MMMM D, YYYY")}</div>
                  )}
                </div>
              </div>

              {/* Reading Time */}
              {article.readTime && (
                <>
                  <span className="text-gray-600">•</span>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {article.readTime} min read
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Content Card */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl">
              <div
                className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-p:text-gray-300 prose-p:leading-relaxed
                  prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-code:text-cyan-400 prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800
                  prose-ul:text-gray-300 prose-ol:text-gray-300
                  prose-li:marker:text-cyan-400
                  prose-blockquote:border-l-cyan-500 prose-blockquote:text-gray-400
                  prose-img:rounded-xl prose-img:shadow-2xl"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Share Section */}
            {/* <div className="mt-12 flex items-center justify-between flex-wrap gap-4 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl">
              <div className="text-gray-400">
                Share this article
              </div>
              <div className="flex gap-3">
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div> */}
          </motion.div>
        </div>
      </section>
    </article>
  );
}