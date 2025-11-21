// src/pages/UpSkill.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    title: "Beyond ChatGPT",
    files: [
      { label: "Course Brochure", file: "/pdfs/Beyond_ChatGPT/Brochure_Beyond_ChatGPT.pdf" },
      { label: "Business Proposal", file: "/pdfs/Beyond_ChatGPT/Business_Proposal_Beyond_ChatGPT.pdf" },
      { label: "Pre & Pro Assessment", file: "/pdfs/Beyond_ChatGPT/Pre_Pro_AI_Assessment.pdf" },
      { label: "Session Framework", file: "/pdfs/Beyond_ChatGPT/Session_Framework_Beyond ChatGPT.pdf" },
    ],
  },
  {
    title: "Applied LLM",
    files: [
      { label: "Course Brochure", file: "/pdfs/Applied_LLM/Brochure_Applied LLM.pdf" },
      { label: "Business Proposal", file: "/pdfs/beyond_proposal.pdf" },
      { label: "Pre & Pro Assessment", file: "/pdfs/beyond_assessment.pdf" },
      { label: "Session Framework", file: "/pdfs/beyond_framework.pdf" },
    ],
  },
  {
    title: "Enterprise LLM Security",
    files: [
      { label: "Course Brochure", file: "/pdfs/LLM_Security/Brochure_Enterprise_LLM_Security.pdf" },
      { label: "Business Proposal", file: "/pdfs/beyond_proposal.pdf" },
      { label: "Pre & Pro Assessment", file: "/pdfs/beyond_assessment.pdf" },
      { label: "Session Framework", file: "/pdfs/beyond_framework.pdf" },
    ],
  },
];

export default function UpSkill() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">

      {/* ---- Back Button ---- */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group z-20"
      >
        <svg
          className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* ---- Background Effects ---- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(29,78,216,0.18),transparent_60%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      {/* Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-blue-700/30 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-purple-700/30 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-32">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-4xl font-bold text-center mb-16"
        >
          <span className="text-cyan-500">UpSkill</span> With AI
          <h4 className="p-3">Courses And Download Center</h4>
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              className="group relative p-[2px] rounded-2xl bg-gradient-to-br from-blue-600/40 to-purple-600/40 hover:from-blue-500 hover:to-purple-500 transition"
            >
              <div className="rounded-2xl p-6 bg-black/70 backdrop-blur-xl h-full">
                <h2 className="text-2xl font-semibold mb-6">{course.title}</h2>

                <div className="flex flex-col gap-4">
                  {course.files.map((f, i) => (
                    <a
                      key={i}
                      href={f.file}
                      download
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 
                      transition border border-white/10 hover:border-blue-400 
                      hover:shadow-[0_0_15px_#3b82f6] text-sm"
                    >
                      {f.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 transition blur-xl bg-blue-500/40 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
