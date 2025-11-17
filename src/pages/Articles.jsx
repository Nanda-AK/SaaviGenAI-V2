// src/pages/Articles.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ArticleCard from "../components/ArticleCard"
import { articlesAPI } from "../services/api";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await articlesAPI.list({  limit: 20, published: true });
        setArticles(res.data.data.articles || []);
      } catch (e) {
        console.error("Failed to load articles:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        article.title.toLowerCase().includes(query) ||
        article.excerpt?.toLowerCase().includes(query) ||
        article.category?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Category/Featured filter
    if (filter === "featured") {
      return article.featured === true;
    }
    if (filter !== "all") {
      return article.category?.toLowerCase() === filter.toLowerCase();
    }

    return true;
  });

  // Get unique categories
  const categories = ["all", "featured", ...new Set(articles.map((a) => a.category).filter(Boolean))];

  // Featured article (first featured or first article)
  const featuredArticle = articles.find((a) => a.featured) || articles[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-400">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
      
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Latest <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">Articles</span>
                </h2>
                <p className="text-gray-400">
                  Insights, tutorials, and updates from our team
                </p>
              </div>

              {/* Search */}
              <div className="relative max-w-md w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filter === cat
                      ? "bg-cyan-500 text-black"
                      : "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Articles Grid */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
              <p className="text-gray-400">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article._id || article.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
  );
}