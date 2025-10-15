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
  tags: string[];
  createdAt: any;
}

const statusConfig = {
  'backlog': { 
    title: 'Backlog', 
    color: '#94a3b8', 
    icon: '📥',
    emoji: '💤',
    bgGradient: 'bg-gradient-to-br from-slate-500/10 to-slate-600/15',
    glow: 'shadow-slate-500/20'
  },
  'validated': { 
    title: 'Validated', 
    color: '#60a5fa', 
    icon: '✅',
    emoji: '🎯',
    bgGradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-600/15',
    glow: 'shadow-blue-500/25'
  },
  'in-progress': { 
    title: 'In Progress', 
    color: '#fbbf24', 
    icon: '🔄',
    emoji: '⚡',
    bgGradient: 'bg-gradient-to-br from-amber-500/10 to-orange-600/15',
    glow: 'shadow-amber-500/25'
  },
  'implemented': { 
    title: 'Implemented', 
    color: '#34d399', 
    icon: '🚀',
    emoji: '🏆',
    bgGradient: 'bg-gradient-to-br from-emerald-500/10 to-green-600/15',
    glow: 'shadow-emerald-500/25'
  },
  'rejected': { 
    title: 'Rejected', 
    color: '#f87171', 
    icon: '❌',
    emoji: '📝',
    bgGradient: 'bg-gradient-to-br from-rose-500/10 to-pink-600/15',
    glow: 'shadow-rose-500/25'
  }
};

export default function WorkflowBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIdea, setDraggedIdea] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  
  const { user } = useAuth();

  // Fetch all ideas
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const ideasQuery = query(
          collection(db, "ideas"), 
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(ideasQuery);
        const ideasData: Idea[] = [];
        
        querySnapshot.forEach((doc) => {
          ideasData.push({
            id: doc.id,
            ...doc.data()
          } as Idea);
        });
        
        setIdeas(ideasData);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, ideaId: string) => {
    setDraggedIdea(ideaId);
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', ideaId);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedIdea(null);
    setActiveColumn(null);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, status?: string) => {
    e.preventDefault();
    if (status) setActiveColumn(status);
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    const relatedTarget = e.relatedTarget as Node;
    const currentTarget = e.currentTarget as Node;
    
    if (!currentTarget.contains(relatedTarget)) {
      setActiveColumn(null);
    }
  };

  // Handle drop - FIXED: Only accepts DragEvent
  const handleDrop = async (e: React.DragEvent, newStatus: Idea['status']) => {
    e.preventDefault();
    if (!draggedIdea || !user) return;

    try {
      const ideaRef = doc(db, "ideas", draggedIdea);
      await updateDoc(ideaRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      setIdeas(prevIdeas => 
        prevIdeas.map(idea => 
          idea.id === draggedIdea ? { ...idea, status: newStatus } : idea
        )
      );

      setDraggedIdea(null);
      setIsDragging(false);
      setActiveColumn(null);
    } catch (error) {
      console.error("Error updating idea status:", error);
    }
  };

  // Group ideas by status
  const ideasByStatus = {
    'backlog': ideas.filter(idea => idea.status === 'backlog'),
    'validated': ideas.filter(idea => idea.status === 'validated'),
    'in-progress': ideas.filter(idea => idea.status === 'in-progress'),
    'implemented': ideas.filter(idea => idea.status === 'implemented'),
    'rejected': ideas.filter(idea => idea.status === 'rejected')
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eduvos-deep via-purple-900/80 to-blue-900/60">
        <div className="card-glass p-8 text-center backdrop-blur-xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-eduvos-electric border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-xl text-white font-light">Loading Innovation Board...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eduvos-deep via-purple-900/80 to-blue-900/60">
      {/* Simple static background */}
      <div className="fixed inset-0 bg-gradient-to-br from-eduvos-electric/5 via-eduvos-innovation/5 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass m-6 mb-8 border border-white/10 backdrop-blur-xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 font-playfair">
                Innovation Workflow
              </h1>
              <p className="text-gray-300">
                Visualize and manage your innovation pipeline
                {!user && ' • Login to interact'}
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>{ideas.length} Active Ideas</span>
              </div>
              <div className="px-3 py-1 bg-eduvos-innovation/20 text-eduvos-innovation rounded-full text-sm border border-eduvos-innovation/30">
                Live Board
              </div>
            </div>
          </div>
        </motion.div>

        <div className="container mx-auto px-6 pb-12">
          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          >
            {Object.entries(statusConfig).map(([status, config], index) => (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`card-glass p-4 text-center backdrop-blur-xl border border-white/5 ${config.bgGradient} rounded-xl`}
              >
                <div className="text-2xl mb-2">{config.emoji}</div>
                <div className="text-2xl font-bold text-white mb-1">
                  {ideasByStatus[status as keyof typeof ideasByStatus].length}
                </div>
                <div className="text-gray-300 text-sm font-medium">{config.title}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Kanban Board */}
          <div className={`flex gap-4 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent ${
            isDragging ? 'scale-95' : 'scale-100'
          } transition-all duration-300`}>
            <AnimatePresence>
              {Object.entries(statusConfig).map(([status, config]) => (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-shrink-0 w-72"
                >
                  {/* Column Header */}
                  <motion.div 
                    className={`card-glass p-4 mb-4 border-l-4 backdrop-blur-xl rounded-xl ${config.bgGradient} ${
                      activeColumn === status ? 'ring-2 ring-white/20' : ''
                    } transition-all duration-200`}
                    style={{ borderLeftColor: config.color }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg shadow-lg"
                          style={{ backgroundColor: config.color }}
                        >
                          {config.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{config.title}</h3>
                          <p className="text-gray-400 text-sm">
                            {ideasByStatus[status as keyof typeof ideasByStatus].length} items
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">
                        {ideasByStatus[status as keyof typeof ideasByStatus].length}
                      </div>
                    </div>
                  </motion.div>

                  {/* Column Body - FIXED: Removed onClick handler */}
                  <motion.div
                    onDragOver={(e) => handleDragOver(e, status)}
                    onDrop={(e) => handleDrop(e, status as Idea['status'])}
                    onDragLeave={handleDragLeave}
                    className={`min-h-[600px] rounded-2xl p-3 backdrop-blur-xl border-2 border-dashed transition-all duration-300 ${
                      activeColumn === status 
                        ? `bg-gradient-to-br ${config.bgGradient} shadow-xl border-[${config.color}]/50` 
                        : 'card-glass border-white/10'
                    }`}
                  >
                    <div className="space-y-3 h-full">
                      <AnimatePresence mode="popLayout">
                        {ideasByStatus[status as keyof typeof ideasByStatus].map((idea) => (
                          <motion.div
                            key={idea.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            draggable={!!user}
                            drag={!!user}
                            className={`card-glass p-4 rounded-xl border border-white/10 cursor-grab active:cursor-grabbing group backdrop-blur-lg ${
                              draggedIdea === idea.id 
                                ? 'opacity-50 scale-95' 
                                : 'opacity-100 hover:scale-105'
                            } transition-all duration-200 shadow-lg hover:shadow-xl ${config.glow}`}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onPointerDown={() => user && setDraggedIdea(idea.id)}
                            onPointerUp={handleDragEnd}
                          >
                            {/* Idea Card */}
                            <div className="space-y-3">
                              {/* Header with votes */}
                              <div className="flex items-start justify-between">
                                <h4 className="font-semibold text-white text-sm leading-tight flex-1 pr-3 line-clamp-2">
                                  {idea.title}
                                </h4>
                                <div className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-1 border border-white/20">
                                  <span className="text-yellow-400 text-xs">▲</span>
                                  <span className="text-white text-sm font-bold">{idea.votesCount}</span>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
                                {idea.description}
                              </p>

                              {/* Tags */}
                              {idea.tags && idea.tags.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {idea.tags.slice(0, 2).map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="px-2 py-1 bg-white/10 text-gray-300 rounded-full text-xs border border-white/20"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                  {idea.tags.length > 2 && (
                                    <span className="px-2 py-1 bg-white/10 text-gray-300 rounded-full text-xs border border-white/20">
                                      +{idea.tags.length - 2}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Footer */}
                              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-eduvos-electric to-eduvos-innovation rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {idea.authorEmail[0].toUpperCase()}
                                  </div>
                                  <span className="text-gray-400 text-xs">
                                    {idea.authorEmail.split('@')[0]}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <Link 
                                    href={`/ideas/${idea.id}`}
                                    className="text-eduvos-electric hover:text-eduvos-accent text-xs font-medium transition-colors"
                                  >
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Empty State */}
                      {ideasByStatus[status as keyof typeof ideasByStatus].length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12 text-gray-400 rounded-xl border-2 border-dashed border-white/10"
                        >
                          <div className="text-3xl mb-2 opacity-50">{config.emoji}</div>
                          <p className="text-sm font-medium">No items</p>
                          <p className="text-xs mt-1 opacity-75">Drop ideas here</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Instructions */}
          <AnimatePresence>
            {user ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass p-6 mt-8 border-l-4 border-l-eduvos-electric rounded-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">How to use the board</h3>
                    <p className="text-gray-300 text-sm">
                      Drag ideas between columns to update their status. 
                      The flow is: <span className="text-eduvos-electric">Backlog</span> → 
                      <span className="text-blue-400"> Validated</span> → 
                      <span className="text-yellow-400"> In Progress</span> → 
                      <span className="text-green-400"> Implemented</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-glass p-6 mt-8 border-l-4 border-l-amber-400 bg-amber-400/10 rounded-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🔐</div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Login Required</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      You need to be logged in to manage the workflow board.
                    </p>
                    <Link 
                      href="/login" 
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-eduvos-electric to-eduvos-innovation text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                    >
                      <span>Login to Continue</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}