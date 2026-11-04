"use client"
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useSpring } from 'framer-motion';

// ---------- Animation variants ----------
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

// ---------- Animated counter ----------
function Counter({ to, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (inView) spring.set(to);
  }, [inView, spring, to]);

  useEffect(() => {
    const unsub = spring.on('change', (v) => setVal(Math.round(v)));
    return () => unsub();
  }, [spring]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

// ---------- Floating background blobs ----------
function Blobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-amber-400/30 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-rose-400/20 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

const HomePage = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const uniqueFashionImages = [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1495385794356-15371f348c20?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1525201548906-7cde8f0d6dab?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1524499982526-69e2f037b4eb?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1521341057461-6eb5f40b07ab?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520955853033-4812f6d3390a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520692913637-53d51b0a4ff2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80',
  ];

  const fashionImages = {
    hero: uniqueFashionImages[0],
    lookbook: uniqueFashionImages[1],
    products: uniqueFashionImages.slice(2, 6),
    newArrivals: uniqueFashionImages.slice(6, 12),
    categories: uniqueFashionImages.slice(12, 18),
    social: uniqueFashionImages.slice(18, 24),
  };

  // Featured (popular)
  const products = [
    { _id: '1', name: 'Oversized Street Hoodie', brand: 'UrbanThread', price: 1499, images: [fashionImages.products[0]], tag: 'HOT' },
    { _id: '2', name: 'Graphic Print Tee',       brand: 'ConcreteCo',  price: 899,  images: [fashionImages.products[1]], tag: 'BESTSELLER' },
    { _id: '3', name: 'Utility Cargo Jacket',    brand: 'NorthSide',   price: 2799, images: [fashionImages.products[2]], tag: 'LIMITED' },
    { _id: '4', name: 'Tapered Jogger Pants',    brand: 'MotionWear',  price: 1199, images: [fashionImages.products[3]], tag: 'NEW' },
  ];

  // New Arrivals (more items for the longer section)
  const newArrivals = [
    { _id: '5', name: 'Washed Denim Jacket',    brand: 'RivetCo',    price: 3299, images: [fashionImages.newArrivals[0]], dropDate: 'Just dropped' },
    { _id: '6', name: 'Cropped Bomber',         brand: 'NightShift', price: 2499, images: [fashionImages.newArrivals[1]], dropDate: '2 days ago' },
    { _id: '7', name: 'Boxy Flannel Shirt',     brand: 'GridWorks',  price: 1699, images: [fashionImages.newArrivals[2]], dropDate: 'This week' },
    { _id: '8', name: 'Techwear Cargo Shorts',  brand: 'UtilityLabs',price: 1899, images: [fashionImages.newArrivals[3]], dropDate: 'This week' },
    { _id: '9', name: 'Chunky Knit Beanie',     brand: 'WoolStreet', price: 699,  images: [fashionImages.newArrivals[4]], dropDate: 'New' },
    { _id: '10', name: 'Reflective Windbreaker', brand: 'MotionWear', price: 3199, images: [fashionImages.newArrivals[5]], dropDate: 'New' },
  ];

  // Categories
  const categories = [
    { name: 'Hoodies',    count: 48, image: fashionImages.categories[0] },
    { name: 'Tees',       count: 92, image: fashionImages.categories[1] },
    { name: 'Jackets',    count: 34, image: fashionImages.categories[2] },
    { name: 'Joggers',    count: 61, image: fashionImages.categories[3] },
    { name: 'Denim',      count: 27, image: fashionImages.categories[4] },
    { name: 'Accessories',count: 73, image: fashionImages.categories[5] },
  ];

  const navLinks = ['Shop', 'New In', 'Collections', 'About'];

  return (
    <div className="min-h-screen pt-16 bg-neutral-950 text-white overflow-x-hidden">



      {/* ---------- HERO ---------- */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <Image src={fashionImages.hero} alt="Urban streetwear collection" fill priority quality={100}
            className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/40 to-neutral-950" />
        </motion.div>

        <Blobs />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs sm:text-sm font-medium tracking-widest uppercase"
          >
            New Season Drop
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]"
          >
            DEFINE YOUR{' '}
            <span className="relative inline-block text-amber-400">
              STREET
              <motion.svg
                viewBox="0 0 300 20"
                className="absolute -bottom-2 left-0 w-full"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <motion.path d="M2 14 Q 75 4 150 12 T 298 10" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </motion.svg>
            </span>{' '}
            STYLE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-6 max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-neutral-300"
          >
            Premium urban apparel built for comfort, movement, and everyday city life. Bold fits, quality fabrics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(251,191,36,0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/products')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-amber-400 text-neutral-950 font-bold text-sm tracking-wide"
            >
              Shop the Collection
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-white font-bold text-sm tracking-wide"
            >
              Explore Lookbook
            </motion.button>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" animate="visible"
            className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {[
              { label: 'Happy Customers', value: 12000, suffix: '+' },
              { label: 'Products', value: 250, suffix: '+' },
              { label: 'Cities', value: 45, suffix: '' },
            ].map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} custom={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-amber-400">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-neutral-400 text-xs"
        >
          SCROLL ↓
        </motion.div>
      </section>

      {/* ---------- MARQUEE ---------- */}
      <div className="relative py-6 border-y border-white/10 bg-neutral-900 overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap text-3xl sm:text-4xl font-black tracking-tighter text-neutral-700"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex gap-12">
              {['NEW DROPS', 'FREE SHIPPING', 'SUSTAINABLE', 'STREET READY', 'LIMITED EDITION'].map((t) => (
                <span key={t} className="flex items-center gap-12">
                  {t} <span className="text-amber-400">✦</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ---------- NEW ARRIVALS (horizontal scroll) ---------- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 text-amber-400 text-sm font-semibold uppercase tracking-widest">
                <motion.span
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-block h-2 w-2 rounded-full bg-amber-400"
                />
                Just Landed
              </span>
              <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
                New Arrivals
              </h2>
              <p className="mt-3 max-w-xl text-base sm:text-lg text-neutral-400">
                Fresh drops every week. Be the first to wear what the city is talking about.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/products?filter=new')}
              className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm whitespace-nowrap"
            >
              See All New
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Horizontal scroll strip */}
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 overflow-x-auto pb-4 scrollbar-hide">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex gap-6 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {newArrivals.map((product, i) => (
                <motion.div
                  key={product._id}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="snap-start shrink-0 w-64 sm:w-72 group relative bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-amber-400/40 transition-colors"
                >
                  <div className="aspect-square w-full relative bg-neutral-800 overflow-hidden">
                    <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                      <Image src={product.images[0]} alt={product.name} fill className="object-contain p-6"
                        sizes="(max-width: 640px) 70vw, 288px" />
                    </motion.div>
                    {/* NEW badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black tracking-widest uppercase">
                      NEW
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-neutral-950/80 text-neutral-300 text-[10px] font-medium">
                      {product.dropDate}
                    </div>
                    {/* Quick add — reveals on hover */}
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={() => router.push(`/product?id=${product._id}`)}
                        className="w-full py-2 rounded-full bg-white text-neutral-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                      >
                        Quick View
                      </button>
                    </motion.div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{product.brand}</p>
                    <h3 className="text-base font-semibold text-white mb-2 leading-tight">{product.name}</h3>
                    <p className="text-lg font-black text-amber-400">₹{product.price}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ---------- FEATURED PRODUCTS ---------- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 border-t border-white/5">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={fadeUp} className="text-center mb-12 sm:mb-16">
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">The Drops</span>
            <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
              Featured Collection
            </h2>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-neutral-400 mx-auto">
              Our most popular drops this season — limited quantities, unlimited attitude.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product._id}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 hover:border-amber-400/40 transition-colors"
              >
                <div className="aspect-square w-full relative bg-neutral-800 overflow-hidden">
                  <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="absolute inset-0">
                    <Image src={product.images[0]} alt={product.name} fill className="object-contain p-6"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  </motion.div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    {product.tag}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">{product.brand}</p>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    <button onClick={() => router.push(`/product?id=${product._id}`)}
                      className="text-left hover:text-amber-400 transition-colors">
                      {product.name}
                    </button>
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-black text-amber-400">₹{product.price}</p>
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => router.push(`/product?id=${product._id}`)}
                      className="h-9 w-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-amber-400 hover:text-neutral-950 transition-colors"
                      aria-label="View product"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-14 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-8 py-4 rounded-full bg-white text-neutral-950 font-bold text-sm tracking-wide hover:bg-amber-400 transition-colors"
            >
              View Full Collection
              <motion.svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
                animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </motion.svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------- CATEGORIES ---------- */}
      <section className="relative bg-neutral-900 py-20 sm:py-28 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Browse</span>
            <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">Shop by Category</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((cat, i) => (
              <motion.a
                key={cat.name}
                href="#"
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-800 border border-white/5 hover:border-amber-400/40 transition-colors"
              >
                <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <p className="text-sm font-bold text-white">{cat.name}</p>
                  <p className="text-[11px] text-neutral-400">{cat.count} items</p>
                </div>
                <motion.div
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- EDITORIAL / LOOKBOOK SPLIT ---------- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden"
          >
            <Image src={fashionImages.lookbook} alt="Urban lookbook" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
            <motion.div
              animate={{ rotate: [0, 3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 left-6 px-4 py-2 rounded-full bg-amber-400 text-neutral-950 text-xs font-black uppercase tracking-widest"
            >
              SS25 Lookbook
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Editorial</span>
            <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.95]">
              Built for the <span className="text-amber-400">city</span> you live in.
            </h2>
            <p className="mt-6 text-neutral-400 text-base sm:text-lg leading-relaxed">
              Every piece in our SS25 lookbook is designed around the rhythm of urban life — from morning commutes to late-night hangs. Considered cuts, functional details, and fabrics that move with you.
            </p>
            <ul className="mt-8 space-y-3">
              {['Water-resistant technical fabrics', 'Reinforced stitching at stress points', 'Reflective details for night visibility', 'Ethically sourced materials'].map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 text-sm text-neutral-300"
                >
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-10 px-8 py-4 rounded-full bg-white text-neutral-950 font-bold text-sm tracking-wide hover:bg-amber-400 transition-colors"
            >
              View Lookbook
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="relative bg-neutral-900 py-20 sm:py-28 overflow-hidden">
        <Blobs />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="lg:text-center"
          >
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
            <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">
              Urban Apparel, Done Right
            </h2>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-neutral-400 lg:mx-auto">
              We combine style, comfort, and durability to give you clothing that keeps up with city life.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { name: 'Premium Fabrics', description: 'Our pieces are crafted from heavyweight cotton, durable denim, and breathable blends for long-lasting wear.', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
              { name: 'Sustainable Production', description: 'Every drop is made with ethically sourced materials and low-impact manufacturing processes.', icon: 'M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z' },
              { name: 'Free Shipping', description: 'Enjoy free shipping on all orders over ₹1500 with our fast and reliable delivery service.', icon: 'M3 3a1 1 0 000 2h18a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3z' },
            ].map((feature, i) => (
              <motion.div
                key={feature.name}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -6 }}
                className="group relative p-8 rounded-2xl bg-neutral-950 border border-white/5 hover:border-amber-400/40 transition-colors"
              >
                <motion.div
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-amber-400 text-neutral-950 shadow-lg shadow-amber-400/30"
                >
                  <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </motion.div>
                <h3 className="mt-6 text-xl font-bold tracking-tight">{feature.name}</h3>
                <p className="mt-3 text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- TESTIMONIALS ---------- */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">Community</span>
          <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">What They're Saying</h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { quote: 'The hoodie fits like it was made for me. Heavyweight, zero shrink, and the colour is unreal.', name: 'Arjun M.', role: 'Mumbai', rating: 5 },
            { quote: 'Fast shipping, great packaging, and the joggers are my new daily driver. Already ordered a second pair.', name: 'Priya K.', role: 'Bengaluru', rating: 5 },
            { quote: 'Finally a brand that gets streetwear sizing right. Boxy where it should be, tapered where it matters.', name: 'Rahul S.', role: 'Delhi', rating: 5 },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl bg-neutral-900 border border-white/5 hover:border-amber-400/30 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <svg key={k} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-neutral-950 font-black text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------- INSTAGRAM / SOCIAL GRID ---------- */}
      <section className="relative bg-neutral-900 py-20 sm:py-28 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">On the Street</span>
            <h2 className="mt-2 text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter">#UrbanClothes</h2>
            <p className="mt-3 text-neutral-400">Tag us in your fit pics. We repost our favourites weekly.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.a
                key={i}
                href="#"
                variants={fadeUp}
                custom={i}
                whileHover={{ scale: 1.03 }}
                className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-800"
              >
                <Image src={fashionImages.social[i % fashionImages.social.length]} alt={`Community look ${i + 1}`} fill className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/40 transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default HomePage;