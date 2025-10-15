"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from "react";
import Link from "next/link";

export default function TermsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E3D] via-blue-900/60 to-purple-900/80" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        {isMounted && [...Array(15)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#60A5FA] to-transparent"
            style={{ top: `${(i * 10) % 100}%` }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* Floating Icons */}
      {isMounted && ['⚖️', '📝', '🔒', '👥', '💼', '🌐'].map((icon, i) => (
        <motion.div
          key={icon}
          className="absolute text-2xl opacity-10"
          style={{
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            delay: i * 2,
          }}
        >
          {icon}
        </motion.div>
      ))}

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass m-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6">
            <div>
              <motion.h1 
                className="text-4xl font-bold text-white mb-2 font-playfair"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Terms of <span className="text-gradient">Service</span>
              </motion.h1>
              <motion.p 
                className="text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mt-4 md:mt-0"
            >
              <Link 
                href="/"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300"
              >
                ← Back Home
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-6 pb-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            {/* Introduction */}
            <motion.div
              variants={itemVariants}
              className="card-glass p-8 rounded-2xl mb-8"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ⚖️
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Welcome to Our Innovation Platform
                </h2>
                <p className="text-gray-300 text-lg">
                  These terms govern your use of our idea-sharing platform. By using our services, 
                  you're joining a community dedicated to innovation and collaboration.
                </p>
              </div>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-6">
              {[
                {
                  icon: '🎯',
                  title: '1. Acceptance of Terms',
                  content: 'By accessing and using this platform, you accept and agree to be bound by these Terms of Service. If you disagree with any part, you may not access our services.'
                },
                {
                  icon: '💡',
                  title: '2. Idea Submission Guidelines',
                  content: 'You retain ownership of ideas submitted but grant us a license to display and share them. Submissions must be original, respectful, and comply with community guidelines.'
                },
                {
                  icon: '👥',
                  title: '3. Community Conduct',
                  content: 'Be respectful, constructive, and collaborative. Harassment, hate speech, or inappropriate content will not be tolerated and may result in account suspension.'
                },
                {
                  icon: '🔒',
                  title: '4. Privacy & Data',
                  content: 'We protect your personal information as outlined in our Privacy Policy. Your email and personal data will never be sold to third parties.'
                },
                {
                  icon: '📊',
                  title: '5. Voting & Engagement',
                  content: 'Voting should be based on merit, not personal relationships. Gaming the system or artificial inflation of votes is prohibited.'
                },
                {
                  icon: '⚡',
                  title: '6. Intellectual Property',
                  content: 'While ideas are shared openly, implementation and proprietary developments remain with their respective creators and organizations.'
                },
                {
                  icon: '🛡️',
                  title: '7. Account Responsibility',
                  content: 'You are responsible for maintaining the confidentiality of your account and password. Notify us immediately of any unauthorized use.'
                },
                {
                  icon: '🌐',
                  title: '8. Platform Modifications',
                  content: 'We reserve the right to modify or discontinue services at any time. Significant changes will be communicated to users in advance.'
                }
              ].map((section, index) => (
                <motion.div
                  key={section.title}
                  variants={itemVariants}
                  className="card-glass p-6 rounded-2xl border border-white/10 hover:border-[#60A5FA]/30 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="text-3xl flex-shrink-0"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {section.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#60A5FA] transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            <motion.div
              variants={itemVariants}
              className="card-glass p-8 rounded-2xl mt-8 text-center border border-[#60A5FA]/20"
            >
              <motion.div
                className="text-4xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🤝
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Innovate?
              </h3>
              <p className="text-gray-300 mb-6">
                By continuing to use our platform, you agree to these terms and our commitment to fostering innovation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/ideas"
                  className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Explore Ideas
                </Link>
                <Link
                  href="/support"
                  className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  Get Help
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}