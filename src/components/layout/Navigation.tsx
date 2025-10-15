
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export const Navigation = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/ideas', label: 'Ideas', icon: '💡' },
    { href: '/board', label: 'Board', icon: '👥' },
    { href: '/profile', label: 'Profile', icon: '👤' },
    ...(user?.email?.includes('admin') ? [{ href: '/admin', label: 'Admin', icon: '⚙️' }] : []),
  ];

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">EI</span>
            </div>
            <span className="text-white font-bold text-xl">Eduvos Innovation</span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.span
                  className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 text-white hover:bg-white/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {pathname === item.href && (
                    <motion.div
                      className="absolute inset-0 border border-white/20 rounded-lg"
                      layoutId="activeNav"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-300 text-sm hidden sm:block">
                  Welcome, {user.email}
                </span>
                <Link href="/ideas/new">
                  <motion.button
                    className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white px-4 py-2 rounded-lg font-semibold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    + New Idea
                  </motion.button>
                </Link>
                <motion.button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg text-sm font-medium backdrop-blur-lg"
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgba(239, 68, 68, 0.3)"
                  }}
                >
                  Sign Out
                </motion.button>
              </>
            ) : (
              <Link href="/login">
                <motion.button
                  className="px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
