// pages/admin/login.js or app/admin/login/page.js (add "use client" for App Router)
'use client';
import { useState, useeffect } from 'react';
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
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // Toggle theme
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general login error
    if (loginError) {
      setLoginError('');
    }
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      // Simulate API call - Replace with your actual authentication logic
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Demo credentials check
          if (formData.email === 'admin@urbangear.com' && formData.password === 'admin123') {
            resolve({ success: true, token: 'demo-token-123' });
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 2000);
      });

      // Store auth token (if using JWT or similar)
      if (formData.rememberMe) {
        localStorage.setItem('adminToken', 'demo-token-123');
      } else {
        sessionStorage.setItem('adminToken', 'demo-token-123');
      }

      // Redirect to admin dashboard
      router.push('/urbancloths/dashboard');
      
    } catch (error) {
      setLoginError(error.message);
      setIsLoading(false);
      
      // Shake animation trigger
      const form = document.getElementById('login-form');
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 500);
    }
  };

  // Floating particles for background
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0A0A0A]' 
        : 'bg-[#F5F5F5]'
    }`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-[#E71D2B]/10 dark:bg-[#E71D2B]/5"
            style={{
              width: particle.size + 'px',
              height: particle.size + 'px',
              left: particle.x + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [-20, 20],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Theme Toggle & Home Button */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        {/* Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/')}
          className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-[#E5E5E5]/20 text-white hover:bg-white/20 transition-all"
          title="Back to Home"
        >
          <HiOutlineHome size={20} />
        </motion.button>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-[#E5E5E5]/20 text-white hover:bg-white/20 transition-all"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
        </motion.button>
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
              <div className="w-20 h-20 bg-gradient-to-br from-[#E71D2B] to-[#FF4D5A] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#E71D2B]/20">
                <HiOutlineShieldCheck className="text-white" size={40} />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl lg:text-5xl font-bold mb-4"
            >
              <span className="text-[#E71D2B]">URBAN</span>
              <span className={isDarkMode ? 'text-white' : 'text-[#111111]'}>GEAR</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg mb-2"
            >
              <span className={isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}>
                Admin Dashboard
              </span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className={`text-sm ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'} max-w-md mx-auto lg:mx-0`}
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
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#111111]'}`}>
                    {stat.number}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
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
              whileHover={{ boxShadow: isDarkMode ? "0 25px 50px rgba(231, 29, 43, 0.15)" : "0 25px 50px rgba(0, 0, 0, 0.1)" }}
              className={`rounded-[20px] p-8 border backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-[#151515]/80 border-[#2A2A2A] shadow-2xl' 
                  : 'bg-white border-[#E5E5E5] shadow-2xl'
              }`}
            >
              {/* Form Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <div className={`w-16 h-16 rounded-full border-2 border-[#E71D2B] flex items-center justify-center ${
                    isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F5F5F5]'
                  }`}>
                    <HiOutlineLockClosed className="text-[#E71D2B]" size={28} />
                  </div>
                </motion.div>
                
                <h2 className={`text-2xl font-bold mb-1 ${
                  isDarkMode ? 'text-white' : 'text-[#111111]'
                }`}>
                  Welcome Back
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
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
                    className="mb-6 p-4 bg-[#E71D2B]/10 border border-[#E71D2B]/30 rounded-xl flex items-start space-x-3"
                  >
                    <HiOutlineExclamationCircle className="text-[#E71D2B] mt-0.5 flex-shrink-0" size={20} />
                    <p className="text-sm text-[#E71D2B]">{loginError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Form */}
              <form id="login-form" onSubmit={handleLogin} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                  }`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <HiOutlineMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      errors.email ? 'text-[#E71D2B]' : isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                    }`} size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="admin@urbangear.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all outline-none ${
                        errors.email
                          ? 'border-[#E71D2B] focus:ring-2 focus:ring-[#E71D2B]/20'
                          : isDarkMode
                            ? 'border-[#2A2A2A] bg-[#0A0A0A] text-white focus:border-[#E71D2B] focus:ring-2 focus:ring-[#E71D2B]/20'
                            : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#111111] focus:border-[#E71D2B] focus:ring-2 focus:ring-[#E71D2B]/20'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#E71D2B] text-xs mt-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <HiOutlineLockClosed className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      errors.password ? 'text-[#E71D2B]' : isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                    }`} size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all outline-none ${
                        errors.password
                          ? 'border-[#E71D2B] focus:ring-2 focus:ring-[#E71D2B]/20'
                          : isDarkMode
                            ? 'border-[#2A2A2A] bg-[#0A0A0A] text-white focus:border-[#E71D2B] focus:ring-2 focus:ring-[#E71D2B]/20'
                            : 'border-[#E5E5E5] bg-[#F5F5F5] text-[#111111] focus:border-[#E71D2B] focus:ring-2 focus:ring-[#E71D2B]/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                        isDarkMode ? 'text-[#B0B0B0] hover:text-white' : 'text-[#666666] hover:text-[#111111]'
                      }`}
                    >
                      {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[#E71D2B] text-xs mt-1"
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div className={`w-5 h-5 rounded border-2 mr-2 flex items-center justify-center transition-all ${
                      formData.rememberMe
                        ? 'bg-[#E71D2B] border-[#E71D2B]'
                        : isDarkMode
                          ? 'border-[#2A2A2A]'
                          : 'border-[#E5E5E5]'
                    }`}>
                      {formData.rememberMe && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                    <span className={`text-sm ${
                      isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'
                    }`}>
                      Remember me
                    </span>
                  </label>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    className="text-sm text-[#E71D2B] hover:text-[#FF4D5A] font-medium"
                  >
                    Forgot Password?
                  </motion.button>
                </div>

                {/* Login Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center space-x-2 ${
                    isLoading
                      ? 'bg-[#E71D2B]/70 cursor-not-allowed'
                      : 'bg-[#E71D2B] hover:bg-[#FF4D5A] shadow-lg shadow-[#E71D2B]/20 hover:shadow-xl hover:shadow-[#E71D2B]/30'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
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

                {/* Demo Credentials */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className={`p-4 rounded-xl text-xs ${
                    isDarkMode ? 'bg-[#0A0A0A] border border-[#2A2A2A]' : 'bg-[#F5F5F5] border border-[#E5E5E5]'
                  }`}
                >
                  <p className={`font-medium mb-2 ${isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}`}>
                    🔑 Demo Credentials:
                  </p>
                  <div className="space-y-1">
                    <p className={isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}>
                      Email: <span className="text-[#E71D2B] font-mono">admin@urbangear.com</span>
                    </p>
                    <p className={isDarkMode ? 'text-[#B0B0B0]' : 'text-[#666666]'}>
                      Pass: <span className="text-[#E71D2B] font-mono">admin123</span>
                    </p>
                  </div>
                </motion.div>
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
                  className={`text-sm transition-colors ${
                    isDarkMode 
                      ? 'text-[#B0B0B0] hover:text-white' 
                      : 'text-[#666666] hover:text-[#111111]'
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