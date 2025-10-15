"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Idea {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorEmail: string;
  status: string;
  votesCount: number;
  tags: string[];
  createdAt: any;
}

interface Comment {
  id: string;
  authorId: string;
  authorEmail: string;
  text: string;
  createdAt: any;
}

export default function IdeaDetail() {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const ideaId = params.id as string;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch idea data and comments
  useEffect(() => {
    if (!ideaId) return;

    const fetchIdea = async () => {
      try {
        const ideaDoc = await getDoc(doc(db, "ideas", ideaId));
        if (!ideaDoc.exists()) {
          router.push("/ideas");
          return;
        }

        const ideaData = {
          id: ideaDoc.id,
          ...ideaDoc.data()
        } as Idea;
        setIdea(ideaData);

        if (user) {
          const voteDoc = await getDoc(doc(db, "ideas", ideaId, "votes", user.uid));
          setHasVoted(voteDoc.exists());
        }

        const commentsQuery = query(
          collection(db, "ideas", ideaId, "comments"),
          orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
          const commentsData: Comment[] = [];
          snapshot.forEach((doc) => {
            commentsData.push({
              id: doc.id,
              ...doc.data()
            } as Comment);
          });
          setComments(commentsData);
        });

        setLoading(false);
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching idea:", error);
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId, user, router]);

  const handleVote = async () => {
    if (!user || !idea) return;

    try {
      const voteRef = doc(db, "ideas", ideaId, "votes", user.uid);
      const ideaRef = doc(db, "ideas", ideaId);

      if (hasVoted) {
        await deleteDoc(voteRef);
        await updateDoc(ideaRef, {
          votesCount: idea.votesCount - 1
        });
        setHasVoted(false);
        setIdea({ ...idea, votesCount: idea.votesCount - 1 });
      } else {
        await setDoc(voteRef, { voted: true });
        await updateDoc(ideaRef, {
          votesCount: idea.votesCount + 1
        });
        setHasVoted(true);
        setIdea({ ...idea, votesCount: idea.votesCount + 1 });
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setCommentLoading(true);
    try {
      await addDoc(collection(db, "ideas", ideaId, "comments"), {
        authorId: user.uid,
        authorEmail: user.email,
        text: newComment.trim(),
        createdAt: new Date()
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'from-green-400 to-emerald-600';
      case 'in-progress': return 'from-yellow-400 to-amber-600';
      case 'validated': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return '✅';
      case 'in-progress': return '🔄';
      case 'validated': return '🎯';
      default: return '💡';
    }
  };

  if (loading) {
    return <LoadingGate message="Loading brilliant idea..." />;
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1E3D] to-[#7C3AED]">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-4">Idea Not Found</div>
          <Link href="/ideas" className="text-[#60A5FA] hover:text-white transition-colors">
            ← Back to Ideas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0A1E3D] via-purple-900/50 to-[#7C3AED]">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {isMounted && [...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-15"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              background: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}

        {/* Floating Icons */}
        {isMounted && ['💡', '🚀', '🌟', '⚡', '🎯', '🔮'].map((icon, i) => (
          <motion.div
            key={icon}
            className="absolute text-xl opacity-20"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* Glowing Orbs */}
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-3xl opacity-10"
        animate={{
          scale: [1, 1.6, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-[#3B82F6] rounded-full filter blur-3xl opacity-10"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            href="/ideas" 
            className="inline-flex items-center gap-2 text-[#60A5FA] hover:text-white transition-colors group"
          >
            <motion.span
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ←
            </motion.span>
            Back to Ideas
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Idea Header Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/30 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-white leading-tight flex-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {idea.title}
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 shrink-0"
                >
                  <span className={`px-6 py-3 rounded-2xl text-sm font-bold bg-gradient-to-r ${getStatusColor(idea.status)} text-white shadow-lg capitalize flex items-center gap-2`}>
                    <span className="text-lg">{getStatusIcon(idea.status)}</span>
                    {idea.status.replace('-', ' ')}
                  </span>
                </motion.div>
              </div>

              {/* Voting Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 mb-8"
              >
                <motion.button
                  onClick={handleVote}
                  disabled={!user}
                  whileHover={{ scale: user ? 1.05 : 1 }}
                  whileTap={{ scale: user ? 0.95 : 1 }}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all ${
                    hasVoted 
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-lg' 
                      : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <motion.span
                    animate={hasVoted ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-xl"
                  >
                    {hasVoted ? '❤️' : '🤍'}
                  </motion.span>
                  <span>Support</span>
                  <span className="bg-white/20 px-2 py-1 rounded-lg text-sm">
                    {idea.votesCount}
                  </span>
                </motion.button>
                
                {!user && (
                  <span className="text-gray-400 text-sm">
                    Login to show your support
                  </span>
                )}
              </motion.div>

              {/* Idea Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span>📖</span>
                  The Vision
                </h3>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                    {idea.description}
                  </p>
                </div>
              </motion.div>

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                    <span>🏷️</span>
                    Innovation Tags
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {idea.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Comments Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-black/30 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl"
            >
              <motion.h2 
                className="text-3xl font-bold text-white mb-6 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span>💬</span>
                Community Thoughts
                <span className="text-xl bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-transparent bg-clip-text">
                  ({comments.length})
                </span>
              </motion.h2>

              {/* Add Comment Form */}
              {user ? (
                <motion.form 
                  onSubmit={handleCommentSubmit} 
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-1 mb-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your brilliant thoughts on this innovation..."
                      rows={4}
                      className="w-full px-4 py-3 bg-transparent border-none text-white placeholder-gray-400 focus:outline-none focus:ring-0 resize-none text-lg"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={commentLoading || !newComment.trim()}
                    whileHover={{ scale: commentLoading || !newComment.trim() ? 1 : 1.05 }}
                    whileTap={{ scale: commentLoading || !newComment.trim() ? 1 : 0.95 }}
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white py-3 px-8 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                  >
                    {commentLoading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        Share Insight
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center mb-8"
                >
                  <div className="text-4xl mb-3">🔐</div>
                  <p className="text-gray-300 mb-4">Join the conversation and share your insights</p>
                  <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white py-2 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Sign In to Comment
                  </Link>
                </motion.div>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">💭</div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Insights Yet</h3>
                    <p className="text-gray-400">Be the first to share your perspective on this innovation!</p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {comments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] rounded-xl flex items-center justify-center text-white font-bold text-sm">
                              {comment.authorEmail?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                {comment.authorEmail}
                              </div>
                              <div className="text-sm text-gray-400">
                                {comment.createdAt?.toDate?.().toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }) || 'Recently'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg">
                          {comment.text}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-black/30 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sticky top-8 shadow-2xl"
            >
              <motion.h3 
                className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span>📊</span>
                Innovation Stats
              </motion.h3>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold text-white mb-2">{idea.votesCount}</div>
                  <div className="text-gray-400">Supporters</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="text-gray-400 text-sm mb-2">Innovation Status</div>
                  <div className={`px-4 py-3 rounded-xl bg-gradient-to-r ${getStatusColor(idea.status)} text-white font-semibold text-center flex items-center justify-center gap-2`}>
                    <span className="text-lg">{getStatusIcon(idea.status)}</span>
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-gray-400 text-sm mb-2">Innovation Creator</div>
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] rounded-2xl flex items-center justify-center mx-auto mb-3 text-white font-bold text-xl">
                      {idea.authorEmail?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-white font-semibold truncate">{idea.authorEmail}</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-gray-400 text-sm mb-2">Launched</div>
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 text-center">
                    <div className="text-white font-semibold">
                      {idea.createdAt?.toDate?.().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) || 'Recently'}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Beautiful Loading Component
function LoadingGate({ message = "Loading brilliant idea..." }: { message?: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1E3D] to-[#7C3AED] relative overflow-hidden">
      {/* Animated background for loading */}
      <div className="absolute inset-0">
        {isMounted && [...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10"
      >
        <motion.div
          className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#60A5FA] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl relative"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          <motion.span
            className="text-5xl sm:text-6xl md:text-7xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💡
          </motion.span>
          <motion.div
            className="absolute -inset-2 sm:-inset-4 border-2 border-[#8B5CF6] rounded-2xl sm:rounded-3xl opacity-30"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        
        <motion.h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {message}
        </motion.h2>
        
        <motion.div
          className="w-48 h-2 sm:w-64 bg-white/20 rounded-full mx-auto overflow-hidden"
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