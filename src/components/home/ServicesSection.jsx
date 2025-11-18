import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import documentPDF from "../../assets/document.pdf";

// Services data - Only 2 services now
const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
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
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'AI Upskill',
    description: 'Upskill your team with comprehensive AI training',
    features: [
      'Fresh Graduate Bootcamps',
      'Corporate Upskilling Programs',
      'Executive Manager Workshops',
      'Technical Developer Training'
    ],
    color: 'teal',
    action: 'download',
    path: documentPDF
  }
];

// Color gradients for each service
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Card */}
      <div className={`
        relative h-full
        bg-gradient-to-br from-gray-900/50 to-black/50
        backdrop-blur-sm
        border
        ${colorClasses[service.color]}
        rounded-xl p-5 md:p-6
        transition-all duration-300
        hover:shadow-2xl hover:shadow-${service.color}-500/10
        hover:-translate-y-2
      `}>
        {/* Glow effect on hover */}
        <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorClasses[service.color].split(' ')[0]} rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
        
        <div className="relative">
          {/* Icon */}
          <div className={`
            w-12 h-12 
            bg-gradient-to-br ${colorClasses[service.color].split(' ')[0]}
            rounded-lg
            flex items-center justify-center
            mb-4
            border ${colorClasses[service.color].split(' ')[1]}
            ${iconColorClasses[service.color]}
            group-hover:scale-110 transition-transform duration-300
          `}>
            {service.icon}
          </div>

          {/* Title */}
          <h3 className="text-lg md:text-xl font-bold text-white mb-2">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 leading-relaxed">
            {service.description}
          </p>

          {/* Features */}
          <ul className="space-y-2">
            {service.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                className="flex items-start gap-2"
              >
                <div className={`
                  w-4 h-4 rounded-full 
                  bg-gradient-to-br ${colorClasses[service.color].split(' ')[0]}
                  flex items-center justify-center
                  flex-shrink-0 mt-0.5
                `}>
                  <svg className={`w-2.5 h-2.5 ${iconColorClasses[service.color]}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300 text-xs md:text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* Learn More Link */}
          <motion.button
            whileHover={{ x: 5 }}
            onClick={() => onLearnMore(service)}
            className={`
              mt-5 flex items-center gap-2
              ${iconColorClasses[service.color]}
              font-semibold text-xs md:text-sm
              group/link
              cursor-pointer
            `}
          >
            Learn More
            <svg className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Services Section
export default function ServicesSection() {
  const navigate = useNavigate();

  const handleLearnMore = (service) => {
    if (service.action === 'navigate') {
      // Navigate to Coming Soon page
      navigate(service.path);
    } else if (service.action === 'download') {
      // Download PDF
      const link = document.createElement('a');
      link.href = service.path;
      link.download = 'AI_Upskill_Program.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
            className="inline-flex items-center  gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full mb-4"
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

        {/* Services Grid - 2 columns, both visible without scrolling */}
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