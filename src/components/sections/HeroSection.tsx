// src/components/sections/HeroSection.tsx - UPDATED
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { IntelligentButton } from '../ui/IntelligentButton';
import { AnimatedBadge } from '../ui/AnimatedBadge';
import { useAnimation } from '../../hooks/useAnimation';
import { useEffect, useState } from 'react';

export const HeroSection = () => {
  const animationProps = useAnimation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Safe window access for floating nodes
  const floatingNodes = mounted ? [...Array(20)] : [];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-eduvos-deep via-purple-900/20 to-eduvos-deep" />
      
      {/* Floating Neural Network Nodes */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingNodes.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-eduvos-innovation rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: 0.3
            }}
            animate={{
              y: [null, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Hero Content */}
        <motion.div 
          ref={animationProps.ref}
          initial={animationProps.initial}
          animate={animationProps.animate}
          transition={animationProps.transition}
        >
          {/* AI-Powered Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" as const }}
            className="inline-block mb-6"
          >
            <AnimatedBadge text="🚀 AI-Powered Innovation Platform" type="ai" pulse />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="font-serif text-5xl md:text-7xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Where Eduvos Ideas
            <span className="block text-gradient mt-2">Evolve Into Reality</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Transform student concepts into implemented innovations with our intelligent platform. 
            <span className="text-eduvos-warm font-semibold"> Powered by AI analysis, gamified collaboration, and real impact.</span>
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <IntelligentButton variant="ai" className="text-lg px-8 py-4">
            🚀 Launch Innovation Platform
          </IntelligentButton>
          <IntelligentButton variant="secondary" className="text-lg px-8 py-4">
            📚 Student Portal Access
          </IntelligentButton>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6 text-center" hoverable animated>
            <div className="w-12 h-12 bg-gradient-to-r from-eduvos-electric to-eduvos-innovation rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">AI</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Smart Idea Analysis</h3>
            <p className="text-gray-400 text-sm">
              AI-powered validation and improvement suggestions in real-time
            </p>
          </GlassCard>

          <GlassCard className="p-6 text-center" hoverable animated>
            <div className="w-12 h-12 bg-gradient-to-r from-eduvos-success to-green-400 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">🎯</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Gamified Collaboration</h3>
            <p className="text-gray-400 text-sm">
              Earn badges, climb leaderboards, and track your innovation journey
            </p>
          </GlassCard>

          <GlassCard className="p-6 text-center" hoverable animated>
            <div className="w-12 h-12 bg-gradient-to-r from-eduvos-warm to-orange-400 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">📈</span>
            </div>
            <h3 className="font-semibold text-white mb-2">Real Implementation</h3>
            <p className="text-gray-400 text-sm">
              From concept to campus implementation with tracking and support
            </p>
          </GlassCard>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          {[
            { number: '250+', label: 'Ideas Submitted' },
            { number: '47', label: 'Implemented' },
            { number: '1.2k', label: 'Active Students' },
            { number: '94%', label: 'Satisfaction' }
          ].map((stat, index) => (
            <GlassCard key={index} className="p-4 text-center">
              <div className="text-2xl font-bold text-gradient">{stat.number}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </div>
  );
};