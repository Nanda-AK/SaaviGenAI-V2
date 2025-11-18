import React, { memo, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FounderCard = memo(() => (
  <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
    {/* Glow */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-15" />

    <div className="relative">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 p-1">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-4xl">
              👤
            </div>
          </div>
          <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
        </div>
      </div>

      {/* Info */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-1">Nanda Kumar Kirubakaran</h3>
        <p className="text-cyan-400 font-semibold mb-2">Founder & CEO</p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Cybersecurity leader with 23+ years of experience. Focused on applied AI security, LLM red teaming, and resilient AI systems.
        </p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-300">
        {['Cisco', 'HPE-Aruba', 'ChargePoint'].map(company => (
          <span key={company} className="px-2 py-1 bg-gray-800/80 rounded-full border border-gray-700">
            {company}
          </span>
        ))}
      </div>
    </div>
  </div>
));

const AnimatedSection = ({ children, direction = 'left' }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
      });
    }
  }, [controls, inView]);

  const initialX = direction === 'left' ? -40 : 40;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: initialX }}
      animate={controls}
    >
      {children}
    </motion.div>
  );
};

export  function AboutSection() {
  return (
    <section id="about" className="relative py-20 md:py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-purple-900/5" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <AnimatedSection direction="left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
              <span className="text-purple-400 text-sm font-medium">About Us</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
                About SaaviGen.AI
              </span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              To democratize AI technology and help organizations harness the power of Generative AI responsibly and effectively. We believe in human-centered AI that augments human capabilities.
            </p>

            
          </AnimatedSection>

          {/* Right Content - Founder */}
          <AnimatedSection direction="right">
            <FounderCard />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}