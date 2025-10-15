"use client";

import { motion } from 'framer-motion';
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SupportPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('general');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories = [
    { id: 'general', name: 'General Help', icon: '❓', color: 'from-blue-500 to-cyan-500' },
    { id: 'technical', name: 'Technical Issues', icon: '⚙️', color: 'from-purple-500 to-pink-500' },
    { id: 'account', name: 'Account Help', icon: '👤', color: 'from-green-500 to-emerald-500' },
    { id: 'ideas', name: 'Ideas & Voting', icon: '💡', color: 'from-yellow-500 to-orange-500' }
  ];

  const faqs = {
    general: [
      { question: 'How do I submit an idea?', answer: 'Click the "Share Your Idea" button on the ideas page, fill in your brilliant concept, and submit it for the community to see!' },
      { question: 'Can I edit my idea after posting?', answer: 'Currently, ideas cannot be edited after submission to maintain integrity. You can delete and repost if needed.' },
      { question: 'Is there a limit to how many ideas I can submit?', answer: 'No limits! We encourage all innovative thinking. Share as many ideas as you have.' }
    ],
    technical: [
      { question: 'The page is loading slowly. What can I do?', answer: 'Try refreshing the page or clearing your browser cache. If issues persist, contact our technical team.' },
      { question: 'I\'m experiencing display issues on mobile.', answer: 'Our platform is mobile-optimized. Ensure you\'re using an updated browser and check your internet connection.' },
      { question: 'How do I report a bug?', answer: 'Use the feedback form below or email support@innovationplatform.com with details about the issue.' }
    ],
    account: [
      { question: 'How do I reset my password?', answer: 'Click "Forgot Password" on the login page. You\'ll receive an email with reset instructions.' },
      { question: 'Can I change my email address?', answer: 'Email changes require verification. Contact support for assistance with email updates.' },
      { question: 'Why was my account suspended?', answer: 'Accounts may be suspended for violating community guidelines. Contact support for specific details.' }
    ],
    ideas: [
      { question: 'How does the voting system work?', answer: 'Each user gets one vote per idea. Votes help us identify the most popular and impactful innovations.' },
      { question: 'Can I vote for my own idea?', answer: 'Yes! Believing in your own innovation is encouraged. However, genuine community support matters most.' },
      { question: 'What happens to ideas with the most votes?', answer: 'Highly-voted ideas get priority review and increased visibility to potential implementers.' }
    ]
  };

  // Eduvos Social Media Links
  const socialMedia = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com/eduvos', color: 'hover:bg-blue-500/20' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/eduvos', color: 'hover:bg-sky-500/20' },
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com/eduvos', color: 'hover:bg-pink-500/20' },
    { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com/company/eduvos', color: 'hover:bg-blue-600/20' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com/eduvos', color: 'hover:bg-red-500/20' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1E3D] via-blue-900/60 to-purple-900/80" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        {isMounted && [...Array(12)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full border border-[#60A5FA]"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass m-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6">
            <div>
              <motion.h1 
                className="text-4xl font-bold text-white mb-2 font-playfair"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Support <span className="text-gradient">Center</span>
              </motion.h1>
              <motion.p 
                className="text-gray-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                We're here to help you innovate better
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 mt-4 md:mt-0"
            >
              <Link 
                href="/"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300"
              >
                ← Back Home
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-6 pb-12">
          {/* Quick Help Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`card-glass p-6 rounded-2xl text-center transition-all duration-300 ${
                  activeCategory === category.id 
                    ? 'border-2 border-[#60A5FA] bg-[#60A5FA]/10' 
                    : 'border border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <div className="text-white font-semibold">{category.name}</div>
              </motion.button>
            ))}
          </motion.div>

          {/* FAQ Section */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-2"
            >
              <div className="card-glass p-6 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span>💬</span>
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {faqs[activeCategory as keyof typeof faqs].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#60A5FA]/30 transition-all duration-300"
                    >
                      <h4 className="text-white font-semibold mb-2 flex items-start gap-3">
                        <span className="text-[#60A5FA] text-lg">•</span>
                        {faq.question}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed pl-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact & Resources */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-6"
            >
              {/* Contact Card */}
              <div className="card-glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span>📞</span>
                  Contact Support
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <span>📧</span>
                    <span>support@eduvos.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span>🕒</span>
                    <span>24/7 Response within 6 hours</span>
                  </div>
                </div>
              </div>

              {/* Quick Resources */}
              <div className="card-glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span>🚀</span>
                  Quick Resources
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Getting Started Guide', icon: '🎯', href: '/about' },
                    { name: 'Community Guidelines', icon: '📜', href: '/terms' },
                    { name: 'Idea Submission Tips', icon: '💡', href: '/ideas' },
                    { name: 'Voting Best Practices', icon: '❤️', href: '/ideas' }
                  ].map((resource, index) => (
                    <Link
                      key={resource.name}
                      href={resource.href}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#60A5FA]/30 transition-all duration-300 group"
                    >
                      <span className="text-lg">{resource.icon}</span>
                      <span className="text-white group-hover:text-[#60A5FA] transition-colors">
                        {resource.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="card-glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span>🌐</span>
                  Connect With Eduvos
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialMedia.map((social, index) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10 ${social.color} transition-all duration-300 group`}
                    >
                      <span className="text-lg">{social.icon}</span>
                      <span className="text-white text-sm group-hover:text-white transition-colors">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Emergency Help */}
              <div className="card-glass p-6 rounded-2xl border border-orange-500/20 bg-orange-500/5">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
                  <span>🚨</span>
                  Urgent Help Needed?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  For critical issues affecting platform access or security concerns.
                </p>
                <button className="w-full bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-200 py-2 rounded-lg transition-all duration-300">
                  Emergency Contact
                </button>
              </div>
            </motion.div>
          </div>

          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="card-glass p-8 rounded-2xl mt-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              📝 Still Need Help?
            </h3>
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#60A5FA] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#60A5FA] transition-colors"
                />
              </div>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#60A5FA] transition-colors">
                <option value="">Select Issue Type</option>
                <option value="technical">Technical Issue</option>
                <option value="account">Account Problem</option>
                <option value="idea">Idea Submission</option>
                <option value="other">Other</option>
              </select>
              <textarea
                placeholder="Describe your issue in detail..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#60A5FA] transition-colors resize-none"
              />
              <button className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Send Message
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}