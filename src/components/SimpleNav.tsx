'use client';
import Link from 'next/link';

export default function SimpleNav() {
  return (
    <nav className="glass-morphism rounded-2xl p-4 mb-8">
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/" className="text-white hover:text-eduvos-innovation transition-colors px-4 py-2 rounded-lg glass-morphism">
          Home
        </Link>
        <Link href="/admin" className="text-white hover:text-eduvos-innovation transition-colors px-4 py-2 rounded-lg glass-morphism">
          Admin
        </Link>
        <Link href="/board" className="text-white hover:text-eduvos-innovation transition-colors px-4 py-2 rounded-lg glass-morphism">
          Board
        </Link>
        <Link href="/profile" className="text-white hover:text-eduvos-innovation transition-colors px-4 py-2 rounded-lg glass-morphism">
          Profile
        </Link>
        <Link href="/about" className="text-white hover:text-eduvos-innovation transition-colors px-4 py-2 rounded-lg glass-morphism">
          About
        </Link>
      </div>
    </nav>
  );
}
