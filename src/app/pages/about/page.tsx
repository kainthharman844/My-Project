"use client"
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function About() {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <>
      <Head>
        <title>About LensCrafterHub | Your AI-Powered Content Creation Platform</title>
        <meta name="description" content="Learn more about LensCrafterHub and how we're revolutionizing content creation with AI" />
      </Head>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 pt-30"
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h1
              variants={slideUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            >
              About LensCrafterHub
            </motion.h1>
            <motion.p
              variants={slideUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Revolutionizing content creation with AI-powered tools for creators, marketers, and businesses.
            </motion.p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            variants={staggerContainer}
            className="bg-white rounded-3xl shadow-xl overflow-hidden mb-16"
          >
            <div className="md:flex">
              <motion.div
                variants={slideUp}
                className="md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center"
              >
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                  <p className="text-blue-100 text-lg">
                    To empower creators with intuitive AI tools that simplify the content creation process while maintaining artistic integrity and quality.
                  </p>
                </div>
              </motion.div>
              <motion.div
                variants={slideUp}
                className="md:w-1/2 p-8 md:p-12"
              >
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">AI-Powered Efficiency</h3>
                      <p className="mt-1 text-gray-600">
                        Leverage cutting-edge AI to reduce production time without compromising on quality.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Creator-First Approach</h3>
                      <p className="mt-1 text-gray-600">
                        Tools designed by creators, for creators - putting your creative needs first.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Seamless Integration</h3>
                      <p className="mt-1 text-gray-600">
                        Works with your existing workflow and tools to enhance your creative process.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            variants={staggerContainer}
            className="mb-16"
          >
            <motion.h2
              variants={slideUp}
              className="text-3xl font-bold text-center text-gray-900 mb-12"
            >
              Why Choose LensCrafterHub?
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Smart Content Generation",
                  description: "Our AI understands context and generates relevant content tailored to your needs.",
                  icon: "💡"
                },
                {
                  title: "Real-Time Collaboration",
                  description: "Work with your team in real-time, no matter where they're located.",
                  icon: "👥"
                },
                {
                  title: "Cross-Platform Support",
                  description: "Create content optimized for all social platforms from a single interface.",
                  icon: "🔄"
                },
                {
                  title: "Advanced Analytics",
                  description: "Get insights into what content performs best with our built-in analytics.",
                  icon: "📊"
                },
                {
                  title: "Custom Branding",
                  description: "Maintain consistent branding across all your content automatically.",
                  icon: "🎨"
                },
                {
                  title: "24/7 Support",
                  description: "Our team is always ready to help you with any questions or issues.",
                  icon: "🛟"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={slideUp}
                  whileHover={{ y: -5 }}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

         
          {/* CTA Section */}
          <motion.div
            variants={staggerContainer}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center"
          >
            <motion.h2
              variants={slideUp}
              className="text-3xl font-bold text-white mb-4"
            >
              Ready to Transform Your Content Creation?
            </motion.h2>
            <motion.p
              variants={slideUp}
              className="text-blue-100 text-xl mb-8 max-w-3xl mx-auto"
            >
              Join thousands of creators already using LensCrafterHub to elevate their content.
            </motion.p>
            <motion.div
              variants={slideUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full text-lg hover:bg-blue-50 transition-colors duration-300">
                Get Started Today
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}