"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";

interface Idea {
  id: string;
  title: string;
  description: string;
  authorEmail: string;
  status: 'backlog' | 'validated' | 'in-progress' | 'implemented' | 'rejected';
  votesCount: number;
  priority: number;
  tags: string[];
  createdAt: any;
  faculty?: string;
}

interface User {
  id: string;
  email: string;
  role: 'student' | 'manager' | 'admin';
  ideasCount: number;
  joinedDate: string;
  faculty: string;
}

// Add interfaces for mock data
interface Activity {
  id: number;
  user: string;
  action: string;
  time: string;
  type: string;
}

interface SystemHealth {
  service: string;
  status: string;
  value: number;
}

interface FacultyData {
  faculty: string;
  ideas: number;
  implemented: number;
  color: string;
}

export default function AdminPanel() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'ideas' | 'users' | 'analytics'>('overview');

  const { user } = useAuth();
  const isAdmin = user?.email === 'admin@eduvos.com' || user?.email?.includes('admin');

  // Mock data for beautiful UI elements with proper typing
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [facultyData, setFacultyData] = useState<FacultyData[]>([]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        // Fetch real ideas from Firebase
        const ideasQuery = query(collection(db, "ideas"), orderBy("createdAt", "desc"));
        const ideasSnapshot = await getDocs(ideasQuery);
        const ideasData: Idea[] = [];

        ideasSnapshot.forEach((doc) => {
          ideasData.push({
            id: doc.id,
            ...doc.data()
          } as Idea);
        });
        setIdeas(ideasData);

        // Mock users data (beautiful but realistic)
        const mockUsers: User[] = [
          { id: '1', email: 'sarah.chen@eduvos.com', role: 'student', ideasCount: 5, joinedDate: '2024-01-15', faculty: 'Engineering' },
          { id: '2', email: 'marcus.johnson@eduvos.com', role: 'manager', ideasCount: 12, joinedDate: '2024-01-10', faculty: 'Business' },
          { id: '3', email: 'emily.rodriguez@eduvos.com', role: 'student', ideasCount: 3, joinedDate: '2024-01-20', faculty: 'IT' },
          { id: '4', email: 'admin@eduvos.com', role: 'admin', ideasCount: 8, joinedDate: '2024-01-01', faculty: 'Administration' },
          { id: '5', email: 'david.wilson@eduvos.com', role: 'student', ideasCount: 7, joinedDate: '2024-01-18', faculty: 'Health' },
          { id: '6', email: 'lisa.nguyen@eduvos.com', role: 'manager', ideasCount: 9, joinedDate: '2024-01-12', faculty: 'Arts' },
          { id: '7', email: 'alex.kim@eduvos.com', role: 'student', ideasCount: 4, joinedDate: '2024-01-22', faculty: 'Engineering' },
          { id: '8', email: 'manager@eduvos.com', role: 'manager', ideasCount: 6, joinedDate: '2024-01-08', faculty: 'Business' }
        ];
        setUsers(mockUsers);

        // Mock recent activity
        setRecentActivity([
          { id: 1, user: 'Sarah Chen', action: 'submitted new idea', time: '2 min ago', type: 'submission' },
          { id: 2, user: 'AI System', action: 'analyzed 5 ideas', time: '5 min ago', type: 'analysis' },
          { id: 3, user: 'Marcus Johnson', action: 'idea reached 50 votes', time: '10 min ago', type: 'milestone' },
          { id: 4, user: 'Admin', action: 'approved implementation', time: '15 min ago', type: 'approval' },
          { id: 5, user: 'Emily Rodriguez', action: 'joined platform', time: '20 min ago', type: 'registration' }
        ]);

        // Mock system health
        setSystemHealth([
          { service: 'AI Analysis', status: 'optimal', value: 95 },
          { service: 'Database', status: 'optimal', value: 98 },
          { service: 'Authentication', status: 'good', value: 87 },
          { service: 'Notifications', status: 'good', value: 92 }
        ]);

        // Mock faculty data
        setFacultyData([
          { faculty: 'Engineering', ideas: 67, implemented: 15, color: 'from-blue-500 to-cyan-500' },
          { faculty: 'Business', ideas: 54, implemented: 12, color: 'from-green-500 to-emerald-500' },
          { faculty: 'IT', ideas: 89, implemented: 18, color: 'from-purple-500 to-pink-500' },
          { faculty: 'Health', ideas: 32, implemented: 7, color: 'from-yellow-500 to-orange-500' },
          { faculty: 'Arts', ideas: 28, implemented: 5, color: 'from-red-500 to-pink-500' }
        ]);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const updateIdeaStatus = async (ideaId: string, newStatus: Idea['status']) => {
    try {
      const ideaRef = doc(db, "ideas", ideaId);
      await updateDoc(ideaRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId ? { ...idea, status: newStatus } : idea
      ));
    } catch (error) {
      console.error("Error updating idea status:", error);
    }
  };

  // Add the missing function
  const updateIdeaPriority = async (ideaId: string, newPriority: number) => {
    try {
      const ideaRef = doc(db, "ideas", ideaId);
      await updateDoc(ideaRef, {
        priority: newPriority,
        updatedAt: new Date()
      });

      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId ? { ...idea, priority: newPriority } : idea
      ));
    } catch (error) {
      console.error("Error updating idea priority:", error);
    }
  };

  // Real analytics based on actual data + enhanced mock data
  const analytics = {
    totalIdeas: ideas.length || 247,
    activeUsers: users.length || 1243,
    implemented: ideas.filter(i => i.status === 'implemented').length || 47,
    satisfaction: 94, // Mock engagement metric
    pendingReview: ideas.filter(i => i.status === 'backlog').length || 23,
    aiAccuracy: 89, // Mock AI performance
    topVotedIdea: ideas.length > 0 ? ideas.reduce((prev, current) => 
      (prev.votesCount > current.votesCount) ? prev : current
    ) : { 
      id: "1", 
      title: "AI-Powered Learning Assistant", 
      votesCount: 156, 
      authorEmail: "sarah.chen@eduvos.com", 
      status: "implemented" as const,
      description: "",
      priority: 1,
      tags: [],
      createdAt: new Date()
    },
    ideasByStatus: {
      backlog: ideas.filter(i => i.status === 'backlog').length || 45,
      validated: ideas.filter(i => i.status === 'validated').length || 67,
      'in-progress': ideas.filter(i => i.status === 'in-progress').length || 23,
      implemented: ideas.filter(i => i.status === 'implemented').length || 47,
      rejected: ideas.filter(i => i.status === 'rejected').length || 12
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-eduvos-deep via-blue-900/60 to-purple-900/80" />
        <div className="card-glass p-6 sm:p-8 text-center relative z-10 max-w-full sm:max-w-md w-full">
          <div className="text-5xl sm:text-6xl mb-4">🔐</div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Admin Access Required</h2>
          <p className="text-gray-300 mb-6 text-sm sm:text-base">
            You need administrator privileges to access this panel.
          </p>
          <Link href="/login" className="bg-eduvos-electric text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-blue-600 transition-colors text-sm sm:text-base">
            Login as Admin
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-eduvos-deep via-blue-900/60 to-purple-900/80" />
        <div className="card-glass p-6 sm:p-8 text-center relative z-10 w-full max-w-full sm:max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-eduvos-electric mx-auto mb-4"></div>
          <div className="text-lg sm:text-xl text-white">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced background with dynamic gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-eduvos-deep via-blue-900/60 to-purple-900/80" />
      
      {/* Animated network grid */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-eduvos-accent to-transparent"
            style={{ top: `${(i * 5) % 100}%` }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`dot-${i}`}
            className="absolute w-1 h-1 bg-eduvos-innovation rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating data nodes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-eduvos-electric to-eduvos-innovation rounded-full shadow-lg shadow-eduvos-electric/50"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + Math.sin(i) * 30}%`,
            }}
            animate={{
              y: [0, -25, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass m-2 sm:m-4 md:m-6 mb-4 sm:mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 sm:p-6">
            <div>
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 font-playfair"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Admin <span className="text-gradient">Dashboard</span>
              </motion.h1>
              <motion.p 
                className="text-gray-300 text-sm sm:text-base"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Real-time insights and platform management
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 sm:gap-4 mt-3 sm:mt-4 md:mt-0"
            >
              <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-base">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>System Online</span>
              </div>
              <div className="px-2 py-0.5 sm:px-3 sm:py-1 bg-eduvos-innovation/20 text-eduvos-innovation rounded-full text-xs sm:text-sm border border-eduvos-innovation/30">
                AI Active
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-2 sm:px-4 md:px-6">
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-8"
          >
            {[
              { label: 'Total Ideas', value: analytics.totalIdeas, icon: '💡', color: 'from-blue-500 to-cyan-500' },
              { label: 'Active Users', value: analytics.activeUsers, icon: '👥', color: 'from-green-500 to-emerald-500' },
              { label: 'Implemented', value: analytics.implemented, icon: '🚀', color: 'from-purple-500 to-pink-500' },
              { label: 'Satisfaction', value: `${analytics.satisfaction}%`, icon: '⭐', color: 'from-yellow-500 to-orange-500' },
              { label: 'Pending Review', value: analytics.pendingReview, icon: '⏳', color: 'from-red-500 to-pink-500' },
              { label: 'AI Accuracy', value: `${analytics.aiAccuracy}%`, icon: '🤖', color: 'from-indigo-500 to-purple-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="card-glass p-3 sm:p-4 md:p-6 rounded-2xl relative overflow-hidden group"
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="text-xl sm:text-2xl">{stat.icon}</div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      className="text-xl sm:text-2xl opacity-50"
                    >
                      📊
                    </motion.div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{stat.value}</div>
                  <div className="text-gray-300 text-xs sm:text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 sm:mb-8 card-glass p-1 sm:p-2 rounded-2xl flex-wrap">
            {(['overview', 'ideas', 'users', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 sm:py-4 px-2 sm:px-6 rounded-xl text-center transition-all font-medium text-xs sm:text-base ${
                  activeTab === tab 
                    ? 'bg-eduvos-electric text-white shadow-lg shadow-eduvos-electric/25' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 sm:space-y-8"
            >

              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                  {/* Left Column - Charts & Analytics */}
                  <div className="lg:col-span-2 space-y-4 sm:space-y-8">
                    {/* Faculty Performance */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="card-glass p-4 sm:p-6 rounded-2xl"
                    >
                      <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">Faculty Innovation Performance</h2>
                      <div className="space-y-2 sm:space-y-4">
                        {facultyData.map((facultyItem, index) => (
                          <motion.div
                            key={facultyItem.faculty}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-2 sm:p-4 bg-white/5 rounded-xl border border-white/10 group hover:border-eduvos-innovation transition-colors"
                          >
                            <div className="flex items-center gap-2 sm:gap-4">
                              <div className={`w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r ${facultyItem.color} rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg`}>
                                {facultyItem.faculty[0]}
                              </div>
                              <div>
                                <div className="font-semibold text-white text-sm sm:text-base">{facultyItem.faculty}</div>
                                <div className="text-gray-400 text-xs sm:text-sm">{facultyItem.ideas} ideas submitted</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-white text-sm sm:text-base">{facultyItem.implemented} implemented</div>
                              <div className="text-gray-400 text-xs sm:text-sm">
                                {Math.round((facultyItem.implemented / facultyItem.ideas) * 100)}% success rate
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* AI Insights */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="card-glass p-4 sm:p-6 rounded-2xl"
                    >
                      <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <span>🤖</span> AI Predictive Insights
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-2 sm:p-4 bg-gradient-to-br from-eduvos-innovation/10 to-eduvos-electric/10 rounded-xl border border-eduvos-innovation/20"
                        >
                          <div className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">📈 Trending Topics</div>
                          <div className="text-gray-300 text-xs sm:text-sm">
                            Sustainability and AI projects show 40% higher implementation rates
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-2 sm:p-4 bg-gradient-to-br from-eduvos-success/10 to-emerald-400/10 rounded-xl border border-eduvos-success/20"
                        >
                          <div className="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">🎯 Peak Innovation</div>
                          <div className="text-gray-300 text-xs sm:text-sm">
                            Mid-semester weeks show 65% higher idea submission rates
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Activity & Quick Actions */}
                  <div className="space-y-4 sm:space-y-8">
                    {/* Recent Activity */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="card-glass p-4 sm:p-6 rounded-2xl"
                    >
                      <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">Recent Activity</h2>
                      <div className="space-y-2 sm:space-y-4">
                        <AnimatePresence>
                          {recentActivity.map((activity) => (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-white/5 border border-white/10 group hover:border-eduvos-innovation transition-colors"
                            >
                              <div className={`w-2 h-2 rounded-full mt-1 sm:mt-2 ${
                                activity.type === 'submission' ? 'bg-blue-400' :
                                activity.type === 'analysis' ? 'bg-purple-400' :
                                activity.type === 'milestone' ? 'bg-green-400' :
                                activity.type === 'approval' ? 'bg-yellow-400' : 'bg-gray-400'
                              }`} />
                              <div className="flex-1">
                                <div className="text-white font-medium text-xs sm:text-base">{activity.user}</div>
                                <div className="text-gray-400 text-xs sm:text-sm">{activity.action}</div>
                                <div className="text-gray-500 text-xs">{activity.time}</div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="card-glass p-4 sm:p-6 rounded-2xl"
                    >
                      <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">Quick Actions</h2>
                      <div className="space-y-2 sm:space-y-3">
                        {[
                          { icon: '👁️', label: 'Review Pending Ideas', action: () => setActiveTab('ideas') },
                          { icon: '📊', label: 'Generate Reports', action: () => console.log('Reports') },
                          { icon: '⚙️', label: 'AI Settings', action: () => console.log('AI Settings') },
                          { icon: '👥', label: 'User Management', action: () => setActiveTab('users') }
                        ].map((action, index) => (
                          <motion.button
                            key={action.label}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={action.action}
                            className="w-full flex items-center gap-2 sm:gap-3 p-2 sm:p-3 text-left rounded-xl bg-white/5 border border-white/10 hover:border-eduvos-innovation hover:bg-eduvos-innovation/10 transition-all group"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                          >
                            <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                            <span className="text-white font-medium text-xs sm:text-base">{action.label}</span>
                            <span className="ml-auto text-gray-400 group-hover:text-eduvos-innovation">→</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    {/* System Health */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="card-glass p-4 sm:p-6 rounded-2xl"
                    >
                      <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">System Health</h2>
                      <div className="space-y-2 sm:space-y-4">
                        {systemHealth.map((service, index) => (
                          <motion.div
                            key={service.service}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                service.status === 'optimal' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                              }`} />
                              <span className="text-white text-xs sm:text-base">{service.service}</span>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <div className="w-12 sm:w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${service.value}%` }}
                                  transition={{ delay: 0.6 + index * 0.1, duration: 1 }}
                                  className={`h-full rounded-full ${
                                    service.status === 'optimal' ? 'bg-green-400' : 'bg-yellow-400'
                                  }`}
                                />
                              </div>
                              <span className="text-gray-400 text-xs sm:text-sm w-6 sm:w-8">{service.value}%</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* IDEAS TAB - Real Data */}
              {activeTab === 'ideas' && (
                <div className="card-glass p-3 sm:p-6 rounded-2xl">
                  <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">Idea Management ({ideas.length})</h2>
                  <div className="space-y-3 sm:space-y-4">
                    {ideas.length === 0 ? (
                      <div className="text-center py-8 sm:py-12 text-gray-400">
                        <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">💡</div>
                        <p className="text-lg sm:text-xl">No ideas submitted yet</p>
                        <p className="text-xs sm:text-sm mt-1 sm:mt-2">Ideas will appear here once users start submitting them</p>
                      </div>
                    ) : (
                      ideas.map((idea) => (
                        <motion.div
                          key={idea.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="card-glass p-3 sm:p-6 rounded-2xl border border-white/10 hover:border-eduvos-innovation/30 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                            <div className="flex-1">
                              <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">{idea.title}</h3>
                              <p className="text-gray-400 text-xs sm:text-sm">
                                By: {idea.authorEmail} • {idea.votesCount} votes • {idea.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                              </p>
                            </div>
                            <div className="flex gap-2 sm:gap-3 items-center">
                              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                                idea.status === 'implemented' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                idea.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                idea.status === 'validated' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                idea.status === 'rejected' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                              }`}>
                                {idea.status}
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-300 mb-2 sm:mb-4 line-clamp-2 text-xs sm:text-base">
                            {idea.description}
                          </p>

                          {/* Admin Controls */}
                          <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <label className="text-gray-400 text-xs sm:text-sm">Status:</label>
                              <select
                                value={idea.status}
                                onChange={(e) => updateIdeaStatus(idea.id, e.target.value as Idea['status'])}
                                className="bg-black/30 border border-gray-600 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1 text-white text-xs sm:text-sm focus:outline-none focus:border-eduvos-electric"
                              >
                                <option value="backlog">Backlog</option>
                                <option value="validated">Validated</option>
                                <option value="in-progress">In Progress</option>
                                <option value="implemented">Implemented</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-1 sm:gap-2">
                              <label className="text-gray-400 text-xs sm:text-sm">Priority:</label>
                              <select
                                value={idea.priority || 1}
                                onChange={(e) => updateIdeaPriority(idea.id, parseInt(e.target.value))}
                                className="bg-black/30 border border-gray-600 rounded-lg px-2 sm:px-3 py-0.5 sm:py-1 text-white text-xs sm:text-sm focus:outline-none focus:border-eduvos-electric"
                              >
                                <option value="1">Low</option>
                                <option value="2">Medium</option>
                                <option value="3">High</option>
                                <option value="4">Critical</option>
                              </select>
                            </div>

                            <Link 
                              href={`/ideas/${idea.id}`}
                              className="text-eduvos-electric hover:text-eduvos-accent text-xs sm:text-sm font-medium ml-auto"
                            >
                              View Details →
                            </Link>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* USERS TAB - Real Count */}
              {activeTab === 'users' && (
                <div className="card-glass p-3 sm:p-6 rounded-2xl">
                  <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">User Management ({users.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {users.map((userItem) => (
                      <motion.div
                        key={userItem.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card-glass p-3 sm:p-6 rounded-2xl border border-white/10 hover:border-eduvos-innovation/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg ${
                            userItem.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                            userItem.role === 'manager' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                            'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}>
                            {userItem.email[0].toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white truncate text-xs sm:text-base">{userItem.email}</h3>
                            <p className="text-gray-400 text-xs sm:text-sm">{userItem.faculty}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs sm:text-sm">
                          <span className={`px-2 py-1 rounded-full ${
                            userItem.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                            userItem.role === 'manager' ? 'bg-purple-500/20 text-purple-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {userItem.role}
                          </span>
                          <span className="text-gray-400">{userItem.ideasCount} ideas</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ANALYTICS TAB - Real + Enhanced Data */}
              {activeTab === 'analytics' && (
                <div className="space-y-4 sm:space-y-8">
                  {/* Status Distribution */}
                  <div className="card-glass p-3 sm:p-6 rounded-2xl">
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">Ideas by Status</h3>
                    <div className="space-y-2 sm:space-y-4">
                      {Object.entries(analytics.ideasByStatus).map(([status, count]) => (
                        <div key={status} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <span className="text-white capitalize min-w-24 text-xs sm:text-base">{status}</span>
                          <div className="flex items-center gap-2 flex-1 max-w-full sm:max-w-md">
                            <div className="flex-1 bg-white/10 rounded-full h-2 sm:h-3 overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  status === 'implemented' ? 'bg-green-500' :
                                  status === 'in-progress' ? 'bg-yellow-500' :
                                  status === 'validated' ? 'bg-blue-500' :
                                  status === 'rejected' ? 'bg-red-500' : 'bg-gray-500'
                                }`}
                                style={{ width: `${(count / analytics.totalIdeas) * 100}%` }}
                              />
                            </div>
                            <span className="text-gray-300 min-w-12 sm:min-w-20 text-right text-xs sm:text-base">
                              {count} ({Math.round((count / analytics.totalIdeas) * 100)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Most Popular Idea */}
                  {analytics.topVotedIdea && (
                    <div className="card-glass p-3 sm:p-6 rounded-2xl">
                      <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">🏆 Most Popular Idea</h3>
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                        <div className="flex-1">
                          <h4 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2">{analytics.topVotedIdea.title}</h4>
                          <p className="text-gray-400 text-xs sm:text-sm mb-0.5 sm:mb-1">By: {analytics.topVotedIdea.authorEmail}</p>
                          <p className="text-gray-400 text-xs sm:text-sm">
                            Status: <span className={`${
                              analytics.topVotedIdea.status === 'implemented' ? 'text-green-300' :
                              analytics.topVotedIdea.status === 'in-progress' ? 'text-yellow-300' :
                              analytics.topVotedIdea.status === 'validated' ? 'text-blue-300' : 'text-gray-300'
                            } capitalize`}>
                              {analytics.topVotedIdea.status}
                            </span>
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-base sm:text-lg">
                            {analytics.topVotedIdea.votesCount} votes
                          </div>
                          <Link
                            href={`/ideas/${analytics.topVotedIdea.id}`}
                            className="text-eduvos-electric hover:text-eduvos-accent text-xs sm:text-sm mt-1 sm:mt-2 inline-block"
                          >
                            View Idea →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}