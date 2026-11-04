"use client"
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    // TODO: wire to your newsletter API
  };

  const socials = [
    { icon: FaFacebook, href: '#', label: 'Facebook' },
    { icon: FaTwitter,  href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: 'https://www.instagram.com/jot1877g/', label: 'Instagram' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
  ];

  // Only these six links
  const navLinks = [
    { name: 'HOME',        path: '/' },
    { name: 'SHOP',        path: '/pages/products-page' },
    { name: 'ABOUT',       path: '/pages/about' },

  ];

  return (
    <footer className="relative bg-neutral-950 text-white pt-16 pb-8 border-t border-white/5 overflow-hidden">
      {/* subtle glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[36rem] rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top: brand + newsletter ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-12 border-b border-white/10">
          <div className="space-y-4">
            <Link href="/" className="inline-block text-2xl sm:text-3xl font-black tracking-tighter">
              URBAN<span className="text-amber-400">.</span>CLOTHES
            </Link>
            <p className="text-neutral-400 max-w-md text-sm leading-relaxed">
              Premium urban apparel built for comfort, movement, and everyday city life.
              Bold fits, quality fabrics, and drops that keep up with the streets.
            </p>

            {/* Social icons */}
            <div className="flex gap-2 pt-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:bg-amber-400 hover:text-neutral-950 transition-colors"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>


        </div>

        {/* ── Navigation links ── */}
        <nav className="py-10">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.path}
                  className="text-neutral-300 hover:text-amber-400 font-medium transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Trust badges ── */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-6 border-t border-white/10 text-[11px] uppercase tracking-widest text-neutral-500">
          <span>Secure Checkout</span>
          <span className="text-amber-400/40">·</span>
          <span>Free Shipping ₹1500+</span>
          <span className="text-amber-400/40">·</span>
          <span>30-Day Returns</span>
          <span className="text-amber-400/40">·</span>
          <span>Made in India</span>
        </div>

        {/* ── Bottom copyright ── */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} UrbanClothes. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Cookies'].map((l) => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="hover:text-amber-400 transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;