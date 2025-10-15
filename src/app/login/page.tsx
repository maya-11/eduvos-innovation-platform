
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { signIn, signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const db = getFirestore();

  // Fixed positions for particles to prevent hydration errors
  const fixedPositions = [
    { x: 100, y: 200 }, { x: 300, y: 150 }, { x: 500, y: 400 }, 
    { x: 200, y: 600 }, { x: 700, y: 300 }, { x: 400, y: 500 },
    { x: 800, y: 200 }, { x: 150, y: 450 }, { x: 600, y: 350 },
    { x: 250, y: 250 }, { x: 750, y: 550 }, { x: 350, y: 300 },
    { x: 900, y: 400 }, { x: 450, y: 150 }, { x: 650, y: 250 },
    { x: 50, y: 350 }, { x: 850, y: 100 }, { x: 950, y: 500 },
    { x: 150, y: 100 }, { x: 550, y: 600 }, { x: 950, y: 300 },
    { x: 250, y: 700 }, { x: 750, y: 650 }, { x: 350, y: 800 },
    { x: 850, y: 750 }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) await signIn(email, password);
      else await signUp(email, password);
      console.log("✅ Auth successful! Redirect pending...");
    } catch (error: any) {
      console.log("❌ Auth error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Smart redirect logic - Only redirect to existing pages
  useEffect(() => {
    const redirectUser = async () => {
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        
        if (snap.exists()) {
          const data = snap.data();
          
          // Only redirect to pages that exist in your app
          if (data?.role === "admin" || user.email?.includes('admin')) {
            router.push("/admin"); // This exists in your app
          } else {
            router.push("/"); // Redirect to homepage (welcome page) which exists
          }
        } else {
          // New user or no user data - redirect to homepage
          router.push("/");
        }
      } catch (err) {
        console.error("Redirect error, going to homepage:", err);
        router.push("/"); // Always fallback to homepage
      }
    };
    
    redirectUser();
  }, [user, db, router]);

  // 🌀 Enhanced loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-eduvos-deep via-blue-900/50 to-eduvos-innovation">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
          />
          <div>
            <p className="text-xl font-semibold text-white mb-2">
              {authLoading ? "Checking authentication..." : "Signing you in..."}
            </p>
            <p className="text-blue-200 text-sm">
              Preparing your Eduvos Innovation experience...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 🌟 Enhanced Multi-Layer Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-eduvos-deep to-purple-900" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1),transparent_50%)]" />

      {/* ✨ Fixed Animated Particles - No Hydration Errors */}
      <div className="absolute inset-0 overflow-hidden">
        {fixedPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-eduvos-accent to-eduvos-innovation rounded-full opacity-30"
            initial={{ x: pos.x, y: pos.y, opacity: 0.2 }}
            animate={mounted ? {
              y: [pos.y, pos.y - 80, pos.y],
              x: [pos.x, pos.x + (i % 2 === 0 ? 40 : -40), pos.x],
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.4, 1],
            } : {}}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* 🌈 Pulsing Energy Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-eduvos-electric/30 to-blue-600/20 rounded-full blur-3xl"
        animate={mounted ? {
          scale: [1, 1.6, 1],
          opacity: [0.1, 0.3, 0.1],
        } : {}}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-eduvos-innovation/30 rounded-full blur-3xl"
        animate={mounted ? {
          scale: [1.4, 1, 1.4],
          opacity: [0.2, 0.1, 0.2],
        } : {}}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* 🎓 Floating Eduvos Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {['🎓', '💡', '🚀', '⭐', '📚', '🏆', '✨', '🔬'].map((icon, i) => (
          <motion.div
            key={icon}
            className="absolute text-2xl opacity-30"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
            }}
            animate={mounted ? {
              y: [0, -60, 0],
              rotate: [0, 180, 360],
              scale: [0.8, 1.3, 0.8],
            } : {}}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 1.2,
            }}
          >
            {icon}
          </motion.div>
        ))}
      </div>

      {/* 🎪 Main Auth Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-md"
        >
          {/* 💎 Enhanced Glass Card */}
          <div className="relative">
            {/* Card Background Shine */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-eduvos-electric/20 to-eduvos-innovation/20 rounded-3xl blur-xl"
              animate={mounted ? {
                opacity: [0.3, 0.6, 0.3],
              } : {}}
              transition={{ duration: 4, repeat: Infinity }}
            />
            
            <div className="relative card-glass shadow-2xl p-8 rounded-3xl border border-white/20 backdrop-blur-xl bg-white/5">
              
              {/* 🏆 Header Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                {/* Animated Logo */}
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-eduvos-electric via-eduvos-innovation to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={mounted ? {
                      x: ['-100%', '200%'],
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: 1,
                    }}
                  />
                  <span className="text-3xl relative z-10">🎓</span>
                </motion.div>

                <motion.h1
                  className="text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {isLogin ? "Welcome Back" : "Join Eduvos"}
                </motion.h1>
                <motion.p
                  className="text-blue-100 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {isLogin
                    ? "Continue your innovation journey"
                    : "Start your educational revolution"}
                </motion.p>
              </motion.div>

              {/* 📝 Enhanced Form */}
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/20 border border-red-500/40 text-red-100 px-4 py-3 rounded-xl text-sm backdrop-blur-lg flex items-center gap-3"
                  >
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-semibold text-blue-100 mb-3 flex items-center gap-2">
                    <span>📧</span>
                    Eduvos Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@eduvos.ac.za"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-blue-200/70 focus:outline-none focus:ring-2 focus:ring-eduvos-innovation focus:border-transparent transition-all backdrop-blur-lg"
                    required
                  />
                </motion.div>

                {/* Password Input */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="block text-sm font-semibold text-blue-100 mb-3 flex items-center gap-2">
                    <span>🔒</span>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your secure password"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-blue-200/70 focus:outline-none focus:ring-2 focus:ring-eduvos-electric focus:border-transparent transition-all backdrop-blur-lg"
                    required
                    minLength={6}
                  />
                </motion.div>

                {/* Enhanced Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden group"
                >
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-eduvos-electric via-eduvos-innovation to-purple-600 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300" />
                  
                  <div className="relative bg-gradient-to-r from-eduvos-electric to-eduvos-innovation py-4 rounded-2xl font-bold text-lg text-white shadow-2xl group-hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">{isLogin ? '🚀' : '🎓'}</span>
                        <span>{isLogin ? 'Access Innovation Hub' : 'Start Your Journey'}</span>
                      </>
                    )}
                  </div>
                </motion.button>
              </motion.form>

              {/* 🔄 Toggle Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-center mt-8 space-y-4"
              >
                <div className="flex items-center justify-center">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="px-4 text-blue-200 text-sm">or</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                <p className="text-blue-200">
                  {isLogin ? "New to Eduvos Innovate?" : "Already part of our community?"}{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-eduvos-accent font-bold hover:text-white transition-colors relative group"
                  >
                    {isLogin ? "Join Now →" : "Sign In →"}
                    <motion.div
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-eduvos-accent"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                </p>

                {/* Official Link */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <Link
                    href="https://www.eduvos.com"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-xs text-blue-300 hover:text-white transition-all group"
                  >
                    <span>🏫</span>
                    <span>Visit Official Eduvos Website</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* 💫 Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="text-center mt-6"
          >
            <p className="text-blue-300/70 text-sm">
              {isLogin 
                ? "✨ Your next breakthrough awaits inside..." 
                : "🎯 Join thousands of Eduvos innovators"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
