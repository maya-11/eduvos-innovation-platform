"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from "firebase/auth";

interface UserIdea {
  id: string;
  title: string;
  status: string;
  votesCount: number;
  createdAt: any;
}

export default function Profile() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [userIdeas, setUserIdeas] = useState<UserIdea[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const initialTab = searchParams.get('tab') as 'profile' | 'ideas' | 'security' || 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'ideas' | 'security'>(initialTab);
  
  // Profile form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  
  // Security form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user && !authLoading) {
      fetchUserData();
    }
  }, [user, authLoading, router]);

  const fetchUserData = async () => {
    try {
      const ideasQuery = query(
        collection(db, "ideas"),
        where("authorId", "==", user!.uid)
      );
      const querySnapshot = await getDocs(ideasQuery);
      const ideasData: UserIdea[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ideasData.push({
          id: doc.id,
          title: data.title || "Untitled Idea",
          status: data.status || "backlog",
          votesCount: data.votesCount || 0,
          createdAt: data.createdAt
        } as UserIdea);
      });
      
      ideasData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setUserIdeas(ideasData);
      setDisplayName(user!.displayName || "");
      setEmail(user!.email || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeTab === 'profile') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', activeTab);
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      setProfileMessage("Display name cannot be empty");
      return;
    }

    setProfileLoading(true);
    setProfileMessage("");

    try {
      if (user) {
        await updateProfile(user, {
          displayName: displayName.trim()
        });
        
        setProfileMessage("✅ Profile updated successfully!");
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setProfileMessage(`Error: ${error.message}`);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage("");

    try {
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        
        setPasswordMessage("✅ Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      setPasswordMessage(`Error: ${error.message}`);
    } finally {
      setPasswordLoading(false);
    }
  };

  // Loading states
  if (authLoading) {
    return <LoadingGate message="Checking authentication..." />;
  }

  if (dataLoading && user) {
    return <LoadingGate message="Loading your magnificent profile..." />;
  }

  if (!user) {
    return null;
  }

  // User stats
  const userStats = {
    totalIdeas: userIdeas.length,
    implementedIdeas: userIdeas.filter(idea => idea.status === 'implemented').length,
    totalVotes: userIdeas.reduce((sum, idea) => sum + idea.votesCount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'from-green-400 to-emerald-600';
      case 'in-progress': return 'from-yellow-400 to-amber-600';
      case 'validated': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'implemented': return 'Implemented';
      case 'in-progress': return 'In Progress';
      case 'validated': return 'Validated';
      default: return 'Backlog';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0A1E3D] via-purple-900/50 to-[#7C3AED]">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              background: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-[#3B82F6] rounded-full filter blur-3xl opacity-10"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
            Your Innovation Profile
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Showcasing your journey as an Eduvos innovator
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sticky top-8"
            >
              {/* User Avatar */}
              <motion.div 
                className="text-center mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative inline-block">
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
                    animate={{ 
                      rotate: [0, 5, 0, -5, 0],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <span className="text-3xl font-bold text-white">
                      {(user.displayName || user.email?.charAt(0) || 'U').toUpperCase()}
                    </span>
                  </motion.div>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] rounded-2xl opacity-20 blur-lg -z-10"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
                
                <motion.h3 
                  className="text-xl font-bold text-white mb-1 truncate px-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {user.displayName || 'Innovation Star'}
                </motion.h3>
                <p className="text-gray-400 text-sm truncate px-2">
                  {user.email}
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { value: userStats.totalIdeas, label: 'Ideas', color: 'from-blue-500 to-cyan-500' },
                  { value: userStats.implementedIdeas, label: 'Done', color: 'from-green-500 to-emerald-500' },
                  { value: userStats.totalVotes, label: 'Votes', color: 'from-purple-500 to-pink-500' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className={`bg-gradient-to-r ${stat.color} text-white p-3 rounded-xl shadow-lg`}>
                      <div className="text-lg font-bold">{stat.value}</div>
                      <div className="text-xs opacity-90">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Navigation */}
              <nav className="space-y-2">
                {(['profile', 'ideas', 'security'] as const).map((tab) => (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-3 rounded-xl font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="capitalize">{tab}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Logout Button */}
              <motion.button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl font-semibold hover:bg-red-500/30 transition-all"
              >
                🚪 Sign Out
              </motion.button>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-2xl p-8"
                >
                  <motion.h2 
                    className="text-3xl font-bold text-white mb-6 flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span>👤</span>
                    Profile Information
                  </motion.h2>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-white font-semibold mb-3">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent backdrop-blur-lg"
                        placeholder="Enter your display name"
                        maxLength={50}
                      />
                      <div className="text-right text-sm text-gray-400 mt-1">
                        {displayName.length}/50 characters
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-white font-semibold mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-gray-400 cursor-not-allowed backdrop-blur-lg truncate"
                        disabled
                      />
                      <p className="text-gray-400 text-sm mt-2">
                        Email cannot be changed for security reasons
                      </p>
                    </motion.div>

                    {profileMessage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-xl backdrop-blur-lg ${
                          profileMessage.includes('✅') 
                            ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                            : 'bg-red-500/20 border border-red-500/50 text-red-200'
                        }`}
                      >
                        {profileMessage}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={profileLoading}
                      whileHover={{ scale: profileLoading ? 1 : 1.02 }}
                      whileTap={{ scale: profileLoading ? 1 : 0.98 }}
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {profileLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Updating...
                        </span>
                      ) : (
                        '✨ Update Profile'
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Ideas Tab */}
              {activeTab === 'ideas' && (
                <motion.div
                  key="ideas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-2xl p-8"
                >
                  <motion.h2 
                    className="text-3xl font-bold text-white mb-6 flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span>💡</span>
                    Your Innovation Portfolio ({userIdeas.length})
                  </motion.h2>
                  
                  {userIdeas.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="text-6xl mb-4">🌱</div>
                      <h3 className="text-2xl font-bold text-white mb-2">No Ideas Yet</h3>
                      <p className="text-gray-400 mb-6">Start your innovation journey by submitting your first brilliant idea!</p>
                      <motion.a
                        href="/ideas/new"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        🚀 Launch First Idea
                      </motion.a>
                    </motion.div>
                  ) : (
                    <div className="grid gap-4">
                      {userIdeas.map((idea, index) => (
                        <motion.div
                          key={idea.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white/10 backdrop-blur-lg border border-white/15 rounded-xl p-6 hover:border-white/30 transition-all group"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 min-w-0">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#60A5FA] transition-colors truncate">
                                {idea.title}
                              </h3>
                              <div className="flex flex-wrap gap-3 items-center">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getStatusColor(idea.status)} text-white shadow-lg whitespace-nowrap`}>
                                  {getStatusText(idea.status)}
                                </span>
                                <span className="text-gray-300 text-sm flex items-center gap-1 whitespace-nowrap">
                                  ❤️ {idea.votesCount} {idea.votesCount === 1 ? 'vote' : 'votes'}
                                </span>
                                <span className="text-gray-400 text-sm whitespace-nowrap">
                                  {idea.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                                </span>
                              </div>
                            </div>
                            <motion.a
                              href={`/ideas/${idea.id}`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg font-semibold transition-all border border-white/30 hover:border-white/50 flex items-center gap-2 whitespace-nowrap shrink-0"
                            >
                              View Details
                              <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                →
                              </motion.span>
                            </motion.a>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-black/25 backdrop-blur-xl border border-white/15 rounded-2xl p-8"
                >
                  <motion.h2 
                    className="text-3xl font-bold text-white mb-6 flex items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span>🔒</span>
                    Security Settings
                  </motion.h2>
                  
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    {[
                      {
                        label: 'Current Password',
                        value: currentPassword,
                        onChange: setCurrentPassword,
                        type: 'password'
                      },
                      {
                        label: 'New Password',
                        value: newPassword,
                        onChange: setNewPassword,
                        type: 'password'
                      },
                      {
                        label: 'Confirm New Password',
                        value: confirmPassword,
                        onChange: setConfirmPassword,
                        type: 'password'
                      }
                    ].map((field, index) => (
                      <motion.div
                        key={field.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <label className="block text-white font-semibold mb-3">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent backdrop-blur-lg"
                          required
                        />
                      </motion.div>
                    ))}

                    {passwordMessage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-xl backdrop-blur-lg ${
                          passwordMessage.includes('✅') 
                            ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                            : 'bg-red-500/20 border border-red-500/50 text-red-200'
                        }`}
                      >
                        {passwordMessage}
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={passwordLoading}
                      whileHover={{ scale: passwordLoading ? 1 : 1.02 }}
                      whileTap={{ scale: passwordLoading ? 1 : 0.98 }}
                      className="bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Securing...
                        </span>
                      ) : (
                        '🛡️ Update Password'
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Loading Component
function LoadingGate({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1E3D] to-[#7C3AED]">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          className="w-32 h-32 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          <span className="text-5xl">🌟</span>
        </motion.div>
        <motion.h2 
          className="text-2xl font-bold text-white mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.h2>
        <motion.div
          className="w-48 h-1 bg-white/20 rounded-full mx-auto overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}