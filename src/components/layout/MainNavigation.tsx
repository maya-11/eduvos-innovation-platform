'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainNavigation() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/ideas', label: 'Ideas' },
    { href: '/board', label: 'Board' },
    { href: '/admin', label: 'Admin' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="glass-morphism border-b border-glass-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-eduvos-electric to-eduvos-innovation rounded-lg" />
            <span className="font-bold text-white text-xl">
              Eduvos<span className="text-eduvos-innovation">Innovate</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-eduvos-innovation text-white'
                    : 'text-gray-300 hover:text-white hover:bg-glass-dark'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Login/User Area */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/ideas/new" 
              className="bg-eduvos-innovation text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              + New Idea
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
