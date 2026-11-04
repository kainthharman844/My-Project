"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiLock, FiCheckCircle } from 'react-icons/fi';
import { FaPaypal } from 'react-icons/fa';

const PaymentPage = () => {
  const [activeTab, setActiveTab] = useState('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2)}`;
    }
    return value;
  };

  useEffect(() => {
    if (paymentSuccess) {
      const timer = setTimeout(() => {
        // Optional: Redirect to home or orders page after success
        // window.location.href = '/'; 
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [paymentSuccess]);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-[100px]">
      
      <div className="max-w-md w-full mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
            URBAN<span className="text-amber-400">.CLOTHES</span>
          </h1>
          <p className="mt-2 text-neutral-400 font-medium">Complete your purchase securely</p>
        </motion.div>

        {/* Card Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-neutral-900 rounded-3xl shadow-2xl border border-white/5 overflow-hidden"
        >
          {/* Payment Tabs */}
          <div className="border-b border-white/5 flex">
            <button
              onClick={() => setActiveTab('credit')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-wide transition-colors relative ${
                activeTab === 'credit' ? 'text-amber-400' : 'text-neutral-500 hover:text-white'
              }`}
            >
              <FiCreditCard className="w-4 h-4" />
              Credit Card
              {activeTab === 'credit' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('paypal')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold tracking-wide transition-colors relative ${
                activeTab === 'paypal' ? 'text-amber-400' : 'text-neutral-500 hover:text-white'
              }`}
            >
              <FaPaypal className="w-4 h-4" />
              PayPal
              {activeTab === 'paypal' && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
              )}
            </button>
          </div>

          {/* Payment Form Area */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              
              {/* SUCCESS STATE */}
              {paymentSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-500/10 mb-6"
                  >
                    <FiCheckCircle className="h-10 w-10 text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl font-black text-white mb-2">Payment Successful!</h3>
                  <p className="text-sm text-neutral-400 max-w-[250px] mx-auto">
                    Your order has been processed. You'll receive a confirmation email shortly.
                  </p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="mt-8 px-6 py-2.5 rounded-full bg-white/5 text-white font-bold text-sm hover:bg-white/10 transition-colors"
                  >
                    Return to Store
                  </button>
                </motion.div>

              /* PROCESSING STATE */
              ) : isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-bold text-white">Processing Payment</h3>
                  <p className="mt-2 text-sm text-neutral-400">Please do not close this window.</p>
                </motion.div>

              /* CREDIT CARD FORM */
              ) : activeTab === 'credit' ? (
                <motion.form
                  key="credit"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label htmlFor="card-number" className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="card-number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="block w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 transition-all font-mono"
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <FiCreditCard className="h-5 w-5 text-neutral-500" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="card-name" className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="card-name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="block w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 transition-all"
                      placeholder="JOHN DOE"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="block w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 transition-all font-mono"
                        placeholder="MM/YY"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="cvv" className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="cvv"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                          maxLength={4}
                          className="block w-full px-4 py-3 bg-neutral-950 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/60 transition-all font-mono"
                          placeholder="123"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <FiLock className="h-4 w-4 text-neutral-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full flex justify-center py-4 px-4 rounded-xl text-sm font-black text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
                    >
                      PAY NOW
                    </motion.button>
                  </div>
                </motion.form>

              /* PAYPAL FORM */
              ) : (
                <motion.div
                  key="paypal"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6 py-4"
                >
                  <div className="rounded-xl bg-neutral-950 border border-white/5 p-5">
                    <p className="text-sm text-neutral-400 text-center leading-relaxed">
                      You will be redirected to PayPal to complete your purchase securely.
                    </p>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setIsProcessing(true);
                      setTimeout(() => {
                        setIsProcessing(false);
                        setPaymentSuccess(true);
                      }, 2000);
                    }}
                    className="w-full flex justify-center items-center py-4 px-4 rounded-xl text-sm font-black text-white bg-[#0070ba] hover:bg-[#005ea6] transition-colors shadow-lg shadow-[#0070ba]/20"
                  >
                    <FaPaypal className="w-5 h-5 mr-2" />
                    PAY WITH PAYPAL
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500 font-medium"
        >
          <FiLock className="w-4 h-4" />
          <p>Secure 256-bit SSL encrypted payment processing.</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;