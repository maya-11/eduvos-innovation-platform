'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';       

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    ideas: 0,
    implemented: 0,
    students: 0,
    satisfaction: 94,
  });

  // Fixed positions to prevent hydration mismatch
  const fixedPositions = [
    { x: 100, y: 200 }, { x: 300, y: 150 }, { x: 500, y: 400 }, 
    { x: 200, y: 600 }, { x: 700, y: 300 }, { x: 400, y: 500 }, 
    { x: 800, y: 200 }, { x: 150, y: 450 }, { x: 600, y: 350 }, 
    { x: 250, y: 250 }, { x: 750, y: 550 }, { x: 350, y: 300 }, 
    { x: 900, y: 400 }, { x: 450, y: 150 }, { x: 650, y: 250 },
    { x: 50, y: 350 }, { x: 850, y: 100 }, { x: 950, y: 500 },
    { x: 150, y: 100 }, { x: 550, y: 600 }
  ];

  useEffect(() => {
    setMounted(true);

    async function fetchStats() {
      try {
        const ideasSnapshot = await getDocs(collection(db, 'ideas'));
        const ideas = ideasSnapshot.size;
        const implemented = ideasSnapshot.docs.filter(
          doc => doc.data().status === 'implemented'
        ).length;

        const usersSnapshot = await getDocs(collection(db, 'users'));
        const students = usersSnapshot.size;

        setStats({ ideas, implemented, students, satisfaction: 94 });
      } catch (error) {
        console.log('Using default stats:', error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🌟 Enhanced Multi-Layer Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-eduvos-deep via-purple-900/40 to-blue-900/60" />

      {/* ✨ Animated Gradient Overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-eduvos-innovation/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-eduvos-electric/10 via-transparent to-transparent" />
      </div>

      {/* 🎯 Fixed Floating Particles - No Hydration Issues */}
      <div className="absolute inset-0 overflow-hidden">
        {fixedPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-eduvos-innovation to-eduvos-electric rounded-full opacity-25"
            initial={{ x: pos.x, y: pos.y, opacity: 0.2 }}
            animate={mounted ? {
              y: [pos.y, pos.y - 60, pos.y],
              x: [pos.x, pos.x + (i % 2 === 0 ? 30 : -30), pos.x],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
            } : {}}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* 🌈 Pulsing Energy Orbs */}
      <motion.div
        className="absolute top-10 sm:top-20 left-4 sm:left-10 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-to-r from-eduvos-innovation/30 to-purple-600/20 rounded-full blur-3xl"
        animate={mounted ? {
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
        } : {}}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-r from-blue-600/20 to-eduvos-electric/30 rounded-full blur-3xl"
        animate={mounted ? {
          scale: [1.3, 1, 1.3],
          opacity: [0.3, 0.1, 0.3],
        } : {}}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* 🚀 Floating Innovation Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {['💡', '🚀', '🌟', '⚡', '🎯', '🔮', '✨', '🔥'].map((icon, i) => (
          <motion.div
            key={icon}
            className="absolute text-2xl sm:text-3xl opacity-40"
            style={{
              left: `${10 + i * 12}%`,
              top: `${5 + (i % 3) * 30}%`,
            }}
            animate={mounted ? {
              y: [0, -50, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.2, 0.8],
            } : {}}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">

        {/* 🎪 Epic Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="flex items-center justify-center mb-6 sm:mb-8"
        >
          <motion.div
            className="relative"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-eduvos-electric via-eduvos-innovation to-purple-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl shadow-eduvos-innovation/50 relative overflow-hidden">
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={mounted ? {
                  x: ['-100%', '200%'],
                } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 2,
                }}
              />
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl sm:text-3xl md:text-4xl">🚀</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 🏆 Main Title with Glow Effect */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 sm:mb-6"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-3 sm:mb-4"
            animate={mounted ? {
              backgroundPosition: ['0%', '100%', '0%'],
            } : {}}
            transition={{ duration: 5, repeat: Infinity }}
            style={{
              background: 'linear-gradient(45deg, #60A5FA, #8B5CF6, #F59E0B, #10B981)',
              backgroundSize: '300% 300%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Welcome
          </motion.h1>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            to <span className="text-gradient bg-gradient-to-r from-eduvos-electric to-eduvos-innovation bg-clip-text text-transparent">Eduvos Innovate</span>
          </motion.h2>
        </motion.div>

        {/* 💫 Epic Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <motion.p
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 mb-4 sm:mb-6 max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto leading-relaxed font-light px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Where <span className="font-bold text-eduvos-accent">student ideas</span> transform into{' '}
            <span className="font-bold text-eduvos-innovation">real campus innovations</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-eduvos-innovation/20 to-eduvos-electric/20 rounded-xl sm:rounded-2xl border border-eduvos-innovation/30 backdrop-blur-lg max-w-xs sm:max-w-none"
          >
            <span className="text-xl sm:text-2xl">🎓</span>
            <span className="text-sm sm:text-lg font-semibold text-white text-center">
              Only for Eduvos students with <span className="text-eduvos-accent">@vossie.net</span> emails!
            </span>
          </motion.div>
        </motion.div>

        {/* 🎨 Feature Cards with Hover Effects */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 w-full max-w-4xl lg:max-w-5xl"
        >
          {[
            {
              icon: '💡',
              title: 'Submit Brilliant Ideas',
              desc: 'Share your innovative concepts with AI-powered analysis',
              gradient: 'from-yellow-500/20 to-amber-500/20',
              border: 'border-yellow-500/30'
            },
            {
              icon: '👥',
              title: 'Collaborate Globally',
              desc: 'Get feedback from peers and mentors across campuses',
              gradient: 'from-blue-500/20 to-cyan-500/20',
              border: 'border-blue-500/30'
            },
            { 
              icon: '🚀',
              title: 'Launch Innovations',
              desc: 'See your ideas become real campus solutions',
              gradient: 'from-purple-500/20 to-pink-500/20',
              border: 'border-purple-500/30'
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 backdrop-blur-lg border ${item.border} bg-gradient-to-br ${item.gradient} shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-300`}
            >
              {/* Background shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
              <div className="relative z-10">
                <motion.div
                  className="text-3xl sm:text-4xl mb-3 sm:mb-4"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 🎯 Action Buttons with Amazing Effects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 w-full max-w-sm sm:max-w-md"
        >
          <Link href="/login" className="relative group w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden w-full"
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-eduvos-electric via-eduvos-innovation to-purple-600 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
              <button className="relative bg-gradient-to-r from-eduvos-electric to-eduvos-innovation text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-2xl font-bold text-base sm:text-lg md:text-xl shadow-2xl group-hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 w-full min-h-[50px]">
                <motion.span
                  animate={mounted ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🔑
                </motion.span>
                Launch Your Journey
              </button>
            </motion.div>
          </Link>

          <Link href="/about" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-lg text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-2xl font-bold text-base sm:text-lg md:text-xl border-2 border-white/20 hover:border-white/40 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 w-full min-h-[50px] shadow-2xl hover:shadow-3xl"
            >
              <span>✨</span>
              Discover More
            </motion.button>
          </Link>
        </motion.div>

        {/* 📊 Live Stats with Counting Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl"
        >
          <motion.h3
            className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            Our Innovation Impact
          </motion.h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { label: 'Brilliant Ideas', value: stats.ideas, icon: '💡', color: 'from-yellow-400 to-amber-500' },
              { label: 'Implemented', value: stats.implemented, icon: '🚀', color: 'from-green-400 to-emerald-500' },
              { label: 'Innovators', value: stats.students, icon: '👥', color: 'from-blue-400 to-cyan-500' },
              { label: 'Satisfaction', value: `${stats.satisfaction}%`, icon: '⭐', color: 'from-purple-400 to-pink-500' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.7 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center group"
              >
                <div className={`bg-gradient-to-br ${item.color} rounded-xl sm:rounded-2xl p-1 shadow-lg mb-3 sm:mb-4 inline-block`}>
                  <div className="bg-eduvos-deep/90 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-lg">
                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{item.icon}</div>
                    <motion.div
                      className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2 + i * 0.2, type: "spring" }}
                    >
                      {item.value}
                    </motion.div>
                  </div>
                </div>
                <div className="text-gray-300 font-medium text-xs sm:text-sm">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 🌟 Floating Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          transition={{ delay: 2 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <motion.p
            className="text-base sm:text-lg text-gray-400 mb-3 sm:mb-4"
            animate={mounted ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Ready to make your mark?
          </motion.p>
          <motion.div
            animate={mounted ? { y: [0, -10, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xl sm:text-2xl">👇</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}