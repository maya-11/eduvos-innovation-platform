"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AboutPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = [
    { number: '500+', label: 'Innovations Shared', icon: '💡' },
    { number: '10K+', label: 'Community Votes', icon: '❤️' },
    { number: '95%', label: 'Satisfaction Rate', icon: '⭐' },
    { number: '24/7', label: 'Active Community', icon: '🌍' }
  ];

  const team = [
    { name: 'Sumaya Abdirahman', role: 'Founder & CEO', emoji: '🚀', color: 'from-blue-500 to-cyan-500' },
    { name: 'Sarah Chen', role: 'Product Lead', emoji: '🎨', color: 'from-purple-500 to-pink-500' },
    { name: 'Marcus Rivera', role: 'Tech Architect', emoji: '⚡', color: 'from-green-500 to-emerald-500' },
    { name: 'Elena Petrova', role: 'Community Manager', emoji: '👥', color: 'from-yellow-500 to-orange-500' }
  ];

  // Eduvos Social Media Links
  const socialMedia = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com/eduvos', color: 'hover:bg-blue-500/20' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/eduvos', color: 'hover:bg-sky-500/20' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com/eduvos', color: 'hover:bg-pink-500/20' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/company/eduvos', color: 'hover:bg-blue-600/20' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com/eduvos', color: 'hover:bg-red-500/20' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E3D] via-blue-900/60 to-purple-900/80" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        {isMounted && [...Array(20)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute rounded-full bg-[#60A5FA]"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

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
                About <span className="text-gradient">Our Mission</span>
              </motion.h1>
              <motion.p 
                className="text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Empowering innovation through collaboration and community
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
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-glass p-8 rounded-2xl mb-12 text-center"
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              🌟
            </motion.div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Eduvos Innovation Platform
            </h2>
            <p className="text-gray-300 text-xl leading-relaxed max-w-3xl mx-auto mb-6">
              Where ideas evolve into reality. Empowering students to transform creative ideas 
              into tangible solutions through collaboration and innovation.
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-4 mt-6">
              {socialMedia.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.2, y: -5 }}
                  className={`w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl ${social.color} transition-all duration-300`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card-glass p-6 rounded-2xl text-center group"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Our Story & Vision */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="card-glass p-8 rounded-2xl"
            >
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Story</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                In 2025, our founder Sumaya Abdirahman noticed something profound happening 
                across Eduvos campuses - brilliant ideas were being born in lecture halls, 
                discussed in student lounges, and dreamed up during late-night study sessions, 
                but they rarely saw the light of day.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Inspired by the incredible potential she witnessed in her fellow students, 
                Sumaya envisioned a platform where every voice could be heard, where the quietest 
                student could share their groundbreaking idea alongside the most outspoken innovator.
              </p>
              <p className="text-gray-300 leading-relaxed">
                What started as a simple observation has grown into a vibrant ecosystem where 
                students don't just learn - they create, innovate, and shape the future together.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="card-glass p-8 rounded-2xl"
            >
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We believe that education shouldn't just be about absorbing knowledge - 
                it should be about creating it. Our vision is to transform every Eduvos 
                student from a learner into an innovator, equipped not just with degrees 
                but with real-world solutions.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                We're building a future where student ideas don't just get good grades - 
                they get implemented. Where classroom projects become startup ventures, 
                and academic assignments evolve into industry-changing innovations.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Through this platform, we're creating a new generation of African innovators 
                who will solve local challenges with global impact, starting right here at Eduvos.
              </p>
            </motion.div>
          </div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="card-glass p-8 rounded-2xl mb-12"
          >
            <h3 className="text-3xl font-bold text-white text-center mb-8">Meet Our Team</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${member.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {member.emoji}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{member.name}</h4>
                  <p className="text-gray-400 text-sm">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="card-glass p-8 rounded-2xl text-center border border-[#60A5FA]/20"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Join Our Innovation Journey</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Ready to share your ideas, support innovative projects, and be part of a community 
              that's shaping the future? Your journey starts here.
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
                Get Started Guide
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}