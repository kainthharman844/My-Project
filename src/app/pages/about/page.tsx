"use client"
import { motion } from 'framer-motion';

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen bg-neutral-950 text-white pt-[100px] pb-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HERO ── */}
        <motion.div variants={staggerContainer} className="text-center pt-12 mb-16 relative">
          {/* ambient glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute -top-24 left-1/4 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-rose-400/10 blur-3xl"
              animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <motion.span
            variants={slideUp}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-bold tracking-widest uppercase"
          >
            Our Story
          </motion.span>

          <motion.h1
            variants={slideUp}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-6"
          >
            ABOUT <span className="text-amber-400">URBAN</span>CLOTHES
          </motion.h1>

          <motion.p
            variants={slideUp}
            className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed"
          >
            A college project turned full-concept e-commerce experience — built to prove that
            premium urban apparel can be sold with the same care it's designed with.
          </motion.p>
        </motion.div>

        {/* ── PROJECT INFO (student / course details) ── */}
        <motion.div
          variants={staggerContainer}
          className="bg-neutral-900 border border-white/5 rounded-3xl p-6 sm:p-10 mb-16"
        >
          <motion.div variants={slideUp} className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">
              Project <span className="text-amber-400">Details</span>
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Built as part of academic coursework — all product data is for demonstration only.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Project Title', value: 'UrbanClothes E-Commerce' },
              { label: 'Course',        value: 'Full Stack Web Development' },
              { label: 'Student',       value: 'Your Name Here' },
              { label: 'Institution',   value: 'Your College Name' },
              { label: 'Semester',      value: 'Semester 6 · 2025' },
              { label: 'Guide',         value: 'Prof. Your Guide\'s Name' },
              { label: 'Category',      value: 'Frontend + UI/UX' },
              { label: 'Deployment',    value: 'Vercel' },
            ].map((info, i) => (
              <motion.div
                key={info.label}
                variants={slideUp}
                custom={i}
                className="p-4 rounded-xl bg-neutral-950 border border-white/5"
              >
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  {info.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-white leading-snug">
                  {info.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── MISSION ── */}
        <motion.div
          variants={staggerContainer}
          className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden mb-16"
        >
          <div className="md:flex">
            <motion.div
              variants={slideUp}
              className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center text-neutral-950"
            >
              <div>
                <h2 className="text-3xl font-black tracking-tighter mb-4">Our Mission</h2>
                <p className="text-neutral-900 text-base sm:text-lg leading-relaxed font-medium">
                  To show that great streetwear and great web experiences go hand in hand —
                  delivering premium urban apparel through a storefront that's fast, accessible,
                  and built with the same attention to detail as the clothes themselves.
                </p>
              </div>
            </motion.div>

            <motion.div variants={slideUp} className="md:w-1/2 p-8 md:p-12">
              <div className="space-y-6">
                {[
                  {
                    title: 'Design-First Thinking',
                    desc: 'Every screen, animation, and interaction was designed to feel as considered as the apparel we sell.',
                    icon: (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Performance Matters',
                    desc: 'Optimized images, code-split routes, and smooth 60fps animations — because slow sites lose customers.',
                    icon: (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                  },
                  {
                    title: 'Real-World Patterns',
                    desc: 'Authentication, cart, product filtering, admin panel — the app mimics a production e-commerce stack.',
                    icon: (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    ),
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-400/10 text-amber-400 p-2.5 rounded-xl">
                      {item.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-bold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── WHAT MAKES IT STAND OUT ── */}
        <motion.div variants={staggerContainer} className="mb-16">
          <motion.div variants={slideUp} className="text-center mb-12">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
              Features
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">
              What makes UrbanClothes <span className="text-amber-400">different</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Smooth Animations',
                description: 'Framer Motion powers every reveal, hover, and scroll effect — no jarring transitions.',
                icon: '✨',
              },
              {
                title: 'Mobile-First Design',
                description: 'Every layout is responsive from 320px up. Tested on real devices.',
                icon: '📱',
              },
              {
                title: 'Dark Aesthetic',
                description: 'A premium dark palette that makes product photography pop.',
                icon: '🌙',
              },
              {
                title: 'Real Product Filtering',
                description: 'Category, gender, and size filters combine with pagination and search.',
                icon: '🔍',
              },
              {
                title: 'Accessible by Default',
                description: 'Semantic HTML, keyboard navigation, and ARIA labels throughout.',
                icon: '♿',
              },
              {
                title: 'Built to Scale',
                description: 'Clean component architecture, reusable animations, API-driven data.',
                icon: '🏗️',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={slideUp}
                whileHover={{ y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-neutral-900 p-8 rounded-2xl border border-white/5 hover:border-amber-400/40 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── TECH STACK (exam-friendly!) ── */}
        <motion.div
          variants={staggerContainer}
          className="bg-neutral-900 border border-white/5 rounded-3xl p-8 sm:p-12 mb-16"
        >
          <motion.div variants={slideUp} className="text-center mb-10">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
              Built With
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tighter">
              Tech <span className="text-amber-400">Stack</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 14',     role: 'App Router · SSR' },
              { name: 'React 18',       role: 'UI Library' },
              { name: 'Tailwind CSS',   role: 'Styling' },
              { name: 'Framer Motion',  role: 'Animations' },
              { name: 'MongoDB',        role: 'Database' },
              { name: 'Mongoose',       role: 'ORM' },
              { name: 'NextAuth',       role: 'Authentication' },
              { name: 'React Icons',    role: 'Iconography' },
            ].map((tech, i) => (
              <motion.div
                key={tech.name}
                variants={slideUp}
                custom={i}
                whileHover={{ y: -3, scale: 1.02 }}
                className="p-4 rounded-xl bg-neutral-950 border border-white/5 hover:border-amber-400/40 transition-colors text-center"
              >
                <p className="text-sm font-bold text-white">{tech.name}</p>
                <p className="text-[11px] text-neutral-500 mt-1 uppercase tracking-wider">{tech.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* ── CTA ── */}
        <motion.div
          variants={staggerContainer}
          className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-8 md:p-12 text-center text-neutral-950"
        >
          <motion.div
            className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.h2
            variants={slideUp}
            className="relative text-3xl sm:text-4xl font-black tracking-tighter mb-4"
          >
            Explore the Collection
          </motion.h2>
          <motion.p
            variants={slideUp}
            className="relative text-neutral-800 text-base sm:text-lg mb-8 max-w-2xl mx-auto font-medium"
          >
            Browse the products, try the filters, and see the animations in action.
          </motion.p>
          <motion.div
            variants={slideUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-block"
          >
            <a
              href="/pages/products-page"
              className="inline-block bg-neutral-950 text-white font-bold px-8 py-3 rounded-full text-base hover:bg-neutral-800 transition-colors"
            >
              Shop Now →
            </a>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}