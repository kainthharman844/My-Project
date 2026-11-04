"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ANNOUNCE_H = 'h-9';
const NAV_H      = 'h-16';
const TOTAL_TOP  = 'top-9';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const navLinks = [
    { name: 'HOME',        path: '/' },
    { name: 'SHOP',        path: '/pages/products-page' },
    { name: 'ABOUT',       path: '/pages/about' },

  ];

  return (
    <>
      {/* ── Announcement bar ── */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 inset-x-0 z-[60] ${ANNOUNCE_H} bg-amber-400 text-neutral-950 text-[11px] sm:text-xs font-bold tracking-widest uppercase flex items-center justify-center px-4`}
      >
        <span className="truncate">
          Free shipping on orders over ₹1500 · New drops every Friday
        </span>
      </motion.div>

      {/* ── Main nav ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className={`fixed ${TOTAL_TOP} inset-x-0 z-50 transition-colors duration-300 ${
          scrolled
            ? 'bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40'
            : 'bg-neutral-950/70 backdrop-blur-md border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 3-col grid: logo left | nav+actions right */}
          <div className={`grid grid-cols-[auto_1fr] items-center ${NAV_H}`}>

            {/* Logo — pinned left */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center shrink-0"
            >
              <Link
                href="/"
                className="text-lg sm:text-xl lg:text-2xl font-black tracking-tighter text-white leading-none"
              >
                URBAN<span className="text-amber-400">.</span>CLOTHES
              </Link>
            </motion.div>

            {/* Nav + actions cluster — pushed right via ml-auto */}
            <div className="flex items-center justify-end gap-4 ml-auto">

              {/* Desktop links */}
              <nav className="hidden lg:flex items-center gap-1 h-full">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.name}
                    onHoverStart={() => setActiveLink(link.name)}
                    onHoverEnd={() => setActiveLink(null)}
                    className="relative h-full flex items-center"
                  >
                    <Link
                      href={link.path}
                      className={`px-3 py-2 mb-2 text-sm font-medium leading-none transition-colors ${
                        activeLink === link.name
                          ? 'text-amber-400'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                    {activeLink === link.name && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute bottom-2 left-2 right-2 h-0.5 bg-amber-400 rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      />
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* Hamburger — right of everything on mobile */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden relative h-10 w-10 flex items-center justify-center text-white focus:outline-none rounded-full hover:bg-white/5 transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                <div className="relative h-4 w-6">
                  <motion.span
                    animate={
                      isOpen
                        ? { top: '50%', y: '-50%', rotate: 45 }
                        : { top: 0, y: 0, rotate: 0 }
                    }
                    transition={{ duration: 0.25 }}
                    className="absolute left-0 h-0.5 w-6 bg-white rounded"
                  />
                  <motion.span
                    animate={{ opacity: isOpen ? 0 : 1 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-6 bg-white rounded"
                  />
                  <motion.span
                    animate={
                      isOpen
                        ? { top: '50%', y: '-50%', rotate: -45 }
                        : { top: '100%', y: '-100%', rotate: 0 }
                    }
                    transition={{ duration: 0.25 }}
                    className="absolute left-0 h-0.5 w-6 bg-white rounded"
                  />
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: `calc(100dvh - 2.25rem - 4rem)` }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-y-auto bg-neutral-950/98 backdrop-blur-xl border-t border-white/10"
            >
              <div className="px-3 py-3 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.path}
                      className="flex items-center justify-between px-4 py-4 rounded-xl text-lg font-bold text-white hover:bg-white/5 hover:text-amber-400 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-neutral-500 shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}