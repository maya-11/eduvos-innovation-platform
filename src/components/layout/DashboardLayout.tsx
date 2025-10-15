'use client';
import { motion } from 'framer-motion';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0A1E3D] via-purple-900/50 to-[#7C3AED]">
      
      {/* ? Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-15"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              background: 'hsl(210, 70%, 60%)',
              left: '%',
              top: '%',
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

      <Navigation />
      <main className="relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
