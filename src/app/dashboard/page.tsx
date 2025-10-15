'use client';

import { motion } from 'framer-motion';
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from 'next/link';

interface UserStats {
  ideasSubmitted: number;
  votesReceived: number;
  ideasInProgress: number;
  ideasImplemented: number;
}

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    ideasSubmitted: 0,
    votesReceived: 0,
    ideasInProgress: 0,
    ideasImplemented: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch user-specific stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        const userIdeasQuery = query(
          collection(db, "ideas"),
          where("authorId", "==", user.uid)
        );
        const userIdeasSnapshot = await getDocs(userIdeasQuery);
        
        const userIdeas: any[] = [];
        let totalVotes = 0;
        let inProgressCount = 0;
        let implementedCount = 0;

        userIdeasSnapshot.forEach((doc) => {
          const ideaData = doc.data();
          userIdeas.push(ideaData);
          totalVotes += ideaData.votesCount || 0;
          
          if (ideaData.status === 'in-progress') {
            inProgressCount++;
          } else if (ideaData.status === 'implemented') {
            implementedCount++;
          }
        });

        setStats({
          ideasSubmitted: userIdeas.length,
          votesReceived: totalVotes,
          ideasInProgress: inProgressCount,
          ideasImplemented: implementedCount
        });

      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  if (authLoading || loading) {
    return <LoadingGate />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0A1E3D] via-purple-900/50 to-[#7C3AED]">
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-15"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              background: 'hsl(210, 70%, 60%)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, 20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-[#60A5FA] to-[#8B5CF6] bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Innovation Hub
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your gateway to creativity, collaboration, and groundbreaking ideas at Eduvos
          </motion.p>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group"
          >
            <div className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-white/30">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg"
                animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span className="text-2xl">💡</span>
              </motion.div>
              
              <h3 className="text-xl font-bold text-white text-center mb-2">
                Submit New Idea
              </h3>
              <p className="text-gray-400 text-center mb-4">
                Share your innovative ideas with the Eduvos community
              </p>
              
              <Link href="/ideas/new">
                <motion.button
                  className="w-full bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#1E40AF] rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group"
          >
            <div className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-white/30">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-[#10B981] to-[#047857] rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg"
                animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                <span className="text-2xl">🔍</span>
              </motion.div>
              
              <h3 className="text-xl font-bold text-white text-center mb-2">
                Browse Ideas
              </h3>
              <p className="text-gray-400 text-center mb-4">
                Explore innovative ideas from the community
              </p>
              
              <Link href="/ideas">
                <motion.button
                  className="w-full bg-gradient-to-r from-[#10B981] to-[#047857] text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#10B981] to-[#047857] rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative group"
          >
            <div className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-2xl p-6 h-full transition-all duration-300 group-hover:border-white/30">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg"
                animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <span className="text-2xl">📊</span>
              </motion.div>
              
              <h3 className="text-xl font-bold text-white text-center mb-2">
                My Submissions
              </h3>
              <p className="text-gray-400 text-center mb-4">
                Manage and track your submitted ideas
              </p>
              
              <Link href="/profile?tab=ideas">
                <motion.button
                  className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10" />
          </motion.div>
        </motion.section>

        {/* Stats Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
        >
          <div className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-2xl p-8">
            <motion.h2 
              className="text-3xl font-bold text-white mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Your Innovation Impact
            </motion.h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: '#3B82F6' }}
                />
                
                <motion.div
                  className="text-3xl mb-3"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  📝
                </motion.div>
                
                <motion.div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: '#3B82F6' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 1.1 }}
                >
                  {stats.ideasSubmitted}
                </motion.div>
                
                <div className="text-gray-300 text-sm font-medium">
                  Ideas Submitted
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: '#10B981' }}
                />
                
                <motion.div
                  className="text-3xl mb-3"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  👍
                </motion.div>
                
                <motion.div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: '#10B981' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 1.2 }}
                >
                  {stats.votesReceived}
                </motion.div>
                
                <div className="text-gray-300 text-sm font-medium">
                  Votes Received
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: '#F59E0B' }}
                />
                
                <motion.div
                  className="text-3xl mb-3"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  🔄
                </motion.div>
                
                <motion.div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: '#F59E0B' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 1.3 }}
                >
                  {stats.ideasInProgress}
                </motion.div>
                
                <div className="text-gray-300 text-sm font-medium">
                  In Progress
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 text-center relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: '#8B5CF6' }}
                />
                
                <motion.div
                  className="text-3xl mb-3"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                >
                  🎉
                </motion.div>
                
                <motion.div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: '#8B5CF6' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 1.4 }}
                >
                  {stats.ideasImplemented}
                </motion.div>
                
                <div className="text-gray-300 text-sm font-medium">
                  Implemented
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

// Loading Component
function LoadingGate() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1E3D] to-[#7C3AED]">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          className="w-32 h-32 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
        >
          <span className="text-5xl">🚀</span>
        </motion.div>
        <motion.h2 
          className="text-2xl font-bold text-white mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Preparing Your Dashboard...
        </motion.h2>
        <motion.div
          className="w-48 h-1 bg-white/20 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}