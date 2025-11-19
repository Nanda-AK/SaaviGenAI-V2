import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import upskillImage from "../../assets/AIUpskill.png"
import AIStratergyConsultingImage from "../../assets/AIStrategyConsulting.png"

// Services data 
const services = [
  {
    
    image: AIStratergyConsultingImage, 
    title: 'AI Strategy Consulting',
    description: 'Transform your business with strategic AI implementation guidance',
    features: [
      'AI Readiness Assessment',
      'AI Strategy Development',
      'Use Case Identification',
      'ROI Analysis & Planning'
    ],
    color: 'cyan',
    action: 'navigate',
    path: '/coming-soon'
  },
  {
    
    image: upskillImage, 
    title: 'AI Upskill',
    description: 'Upskill your team with comprehensive AI training',
    features: [
      'Fresh Graduate Bootcamps',
      'Corporate Upskilling Programs',
      'Executive Manager Workshops',
      'Technical Developer Training'
    ],
    color: 'teal',
    action: 'navigate',
    path: '/upskill'
  }
];

// Color gradients for each service (no changes needed here)
const colorClasses = {
  cyan: 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 group-hover:border-cyan-400',
  teal: 'from-teal-500/20 to-emerald-500/20 border-teal-500/30 group-hover:border-teal-400'
};

const iconColorClasses = {
  cyan: 'text-cyan-400',
  teal: 'text-teal-400'
};

// Service Card Component
const ServiceCard = ({ service, index, onLearnMore }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="group w-full"
    >
      <div
        className={`
          relative flex flex-col
          bg-[#0a0c0f] 
          rounded-2xl overflow-hidden 
          border border-white/5
          backdrop-blur-[2px]
          transition-all duration-300
          hover:-translate-y-2
          hover:shadow-[0_0_25px_rgba(0,255,255,0.2)]
          bg-gradient-to-br ${colorClasses[service.color]}
          max-w-[360px] mx-auto
        `}
      >
        {/* IMAGE */}
        <div className="w-full h-32 md:h-36 overflow-hidden relative">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
        </div>

        {/* CONTENT */}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-lg md:text-lg font-semibold text-white mb-1 tracking-tight">
            {service.title}
          </h3>

          <p className="text-gray-400 text-sm md:text-sm mb-4 leading-relaxed line-clamp-2">
            {service.description}
          </p>

          {/* FEATURES */}
          <ul className="space-y-2 flex-grow">
            {service.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                {/* Neon dot */}
                <span className="w-2 h-2 rounded-full mt-1 bg-cyan-400/80 shadow-[0_0_8px_rgba(0,255,255,0.7)]"></span>

                <span className="text-gray-300 text-sm md:sm">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* ACTION */}
          <button
            onClick={() => onLearnMore(service)}
            className="mt-5 p-2 flex items-center gap-1 text-cyan-400 text-sm md:text-base font-medium group-hover:text-cyan-300 transition"
          >
            Learn More
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};




// Main Services Section (unchanged logic)
export default function ServicesSection() {
  const navigate = useNavigate();

  const handleLearnMore = (service) => {
    if (service.action === 'navigate') {
      navigate(service.path);
    } 
  };

  return (
    <section className="relative py-16 md:py-24 mt-[-120px] bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,255,198,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4"
          >
            <span className="text-cyan-400 text-xs md:text-sm font-medium">Our Services</span>
          </motion.div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-white">Comprehensive </span>
            <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto">
            Tailored AI solutions designed to transform your business and drive innovation
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard 
              key={index} 
              service={service} 
              index={index}
              onLearnMore={handleLearnMore}
            />
          ))}
        </div>
      </div>
    </section>
  );
}