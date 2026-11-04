'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineHome
} from 'react-icons/hi';

export default function AdminLogin() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // Toggle theme
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (loginError) setLoginError('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in. Please try again.');
      }

      if (!data.token) {
        throw new Error('The login service did not return an authentication token.');
      }

      localStorage.setItem('adminInfo', JSON.stringify(data));
      localStorage.setItem('adminToken', data.token);
      sessionStorage.removeItem('adminToken');
      router.push('/urbancloths/admindashboard');
      
    } catch (error) {
      setLoginError(error.message || 'Unable to sign in. Please try again.');
      setIsLoading(false);
      
      const form = document.getElementById('login-form');
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
    }
  };

  // Floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));

  return (
    <div className={`min-h-screen pt-22 flex transition-colors duration-300 ${
      isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'
    }`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        
        body { font-family: 'Poppins', sans-serif; }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-amber-400/10 dark:bg-amber-400/5"
            style={{
              width: particle.size + 'px',
              height: particle.size + 'px',
              left: particle.x + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{ y: [-20, 20], opacity: [0, 0.5, 0] }}
            transition={{ duration: particle.duration, repeat: Infinity, delay: particle.delay }}
          />
        ))}
      </div>



      {/* Main Content */}
      <div className="w-full flex items-center justify-center p-4">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          
          {/* Left Side - Brand/Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-6 inline-block"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-400/20">
                <HiOutlineShieldCheck className="text-neutral-950" size={40} />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl lg:text-5xl font-black tracking-tighter mb-4"
            >
              <span className="text-amber-400">URBAN</span>
              <span className={isDarkMode ? 'text-white' : 'text-neutral-900'}>CLOTHES</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg mb-2 font-bold tracking-tight uppercase"
            >
              <span className={isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}>
                Admin Dashboard
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className={`text-sm ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'} max-w-md mx-auto lg:mx-0`}
            >
              Manage your products, orders, and analytics from one central dashboard.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="hidden lg:flex space-x-8 mt-8"
            >
              {[
                { number: "24/7", label: "Monitoring" },
                { number: "SSL", label: "Encrypted" },
                { number: "2FA", label: "Security" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {stat.number}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md"
          >
            <motion.div
              whileHover={{ boxShadow: isDarkMode ? "0 25px 50px rgba(251, 191, 36, 0.15)" : "0 25px 50px rgba(0, 0, 0, 0.1)" }}
              className={`rounded-3xl p-8 border backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-neutral-900/80 border-white/5 shadow-2xl' 
                  : 'bg-white border-neutral-200 shadow-2xl'
              }`}
            >
              {/* Form Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <div className={`w-16 h-16 rounded-full border-2 border-amber-400 flex items-center justify-center ${
                    isDarkMode ? 'bg-neutral-950' : 'bg-neutral-50'
                  }`}>
                    <HiOutlineLockClosed className="text-amber-400" size={28} />
                  </div>
                </motion.div>
                
                <h2 className={`text-2xl font-black tracking-tight mb-1 ${
                  isDarkMode ? 'text-white' : 'text-neutral-900'
                }`}>
                  Welcome Back
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Sign in to your admin account
                </p>
              </div>

              {/* Login Error Message */}
              <AnimatePresence>
                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3"
                  >
                    <HiOutlineExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-sm text-red-500">{loginError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form id="login-form" onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <HiOutlineMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      errors.email ? 'text-red-500' : isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
                    }`} size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your admin email"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none ${
                        errors.email
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : isDarkMode
                            ? 'border-white/10 bg-neutral-950 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                            : 'border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-neutral-400' : 'text-neutral-600'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <HiOutlineLockClosed className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      errors.password ? 'text-red-500' : isDarkMode ? 'text-neutral-500' : 'text-neutral-400'
                    }`} size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all outline-none ${
                        errors.password
                          ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : isDarkMode
                            ? 'border-white/10 bg-neutral-950 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                            : 'border-neutral-300 bg-neutral-50 text-neutral-900 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                        isDarkMode ? 'text-neutral-500 hover:text-white' : 'text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </motion.p>
                  )}
                </div>
                {/* Login Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className={`w-full py-3 rounded-xl font-bold tracking-wide transition-all flex items-center justify-center space-x-2 ${
                    isLoading
                      ? 'bg-amber-400/70 cursor-not-allowed text-neutral-900'
                      : 'bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-lg shadow-amber-400/20 hover:shadow-xl hover:shadow-amber-400/30'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full"
                      />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <HiOutlineArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Back to Site Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={() => router.push('/')}
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'text-neutral-500 hover:text-white' 
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  ← Back to Store
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}