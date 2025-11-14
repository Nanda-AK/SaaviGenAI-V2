// src/components/ArticleCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const slug = article.slug || (article._id && article._id);
  return (
    <article className="border rounded p-4 bg-white">
      <h3 className="font-semibold text-lg">
        <Link to={`/articles/${slug}`} className="hover:underline">{article.title}</Link>
      </h3>
      {article.excerpt && <p className="mt-2 text-slate-600 text-sm">{article.excerpt}</p>}
      <div className="mt-3 text-xs text-slate-500">By {article.author?.name || "SaaviGen"}</div>
    </article>
  );
}
