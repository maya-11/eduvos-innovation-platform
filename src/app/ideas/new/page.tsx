'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';    
import { useRouter } from 'next/navigation';

// Add proper TypeScript interfaces
interface AIAnalysis {
  feasibility: number;
  impact: number;
  innovation: number;
  overall: number;
  strengths: string[];
  recommendations: string[];
  click?: number;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  attachments: File[];
}

export default function NewIdeaPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    tags: [],
    attachments: []
  });
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate AI analysis
  const analyzeIdea = async () => {
    setIsAnalyzing(true);
    setAiMessages(['🤔 Analyzing your idea...']);

    // Simulate AI thinking process
    const messages = [
      '🔍 Scanning for innovation potential...',
      '📊 Evaluating feasibility metrics...',
      '🎯 Assessing campus impact...',
      '💡 Generating recommendations...'
    ];

    for (let i = 0; i < messages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAiMessages(prev => [...prev, messages[i]]);
    }

    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setAnalysis({
      feasibility: Math.floor(Math.random() * 30) + 70,
      impact: Math.floor(Math.random() * 35) + 65,
      innovation: Math.floor(Math.random() * 40) + 60,
      overall: 85,
      strengths: ['High campus impact', 'Innovative approach', 'Student-focused'],
      recommendations: ['Consider technical resources', 'Engage faculty early'],
      click: 0
    });

    setIsAnalyzing(false);
    setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);

    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Success animation then redirect
    setTimeout(() => {
      router.push('/ideas');
    }, 3000);
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced background with multiple gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-eduvos-deep via-blue-900/50 to-purple-900/70" />

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-eduvos-innovation/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-eduvos-electric/20 via-transparent to-transparent" />
      </div>

      {/* Floating animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full border-2 border-eduvos-innovation/30"
            style={{
              width: Math.random() * 60 + 30,
              height: Math.random() * 60 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Floating triangles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`triangle-${i}`}
            className="absolute border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-eduvos-accent/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, 40, 0],
              rotate: [0, 90, 180, 270, 360],
            }}
            transition={{
              duration: 12 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
            }}
          />
        ))}

        {/* Interactive particles that follow mouse */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.sin(i) * 15, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Pulsing light orbs */}
      <motion.div
        className="absolute top-10 sm:top-20 left-4 sm:left-20 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-r from-eduvos-innovation/20 to-eduvos-electric/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute bottom-10 sm:bottom-20 right-4 sm:right-20 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-eduvos-electric/15 to-eduvos-innovation/15 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl"
        >
          {/* Progress Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-3 sm:mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Share Your <span className="text-gradient">Innovation</span>
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-secondary max-w-2xl mx-auto px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Let's bring your brilliant idea to life with AI-powered guidance
            </motion.p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mb-8 sm:mb-12 px-2"
          >
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <motion.div
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 font-semibold transition-all text-sm sm:text-base ${
                    step >= stepNum
                      ? 'bg-gradient-to-r from-eduvos-electric to-eduvos-innovation border-transparent text-white'
                      : 'bg-glass-white border-glass-border text-secondary'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {stepNum}
                </motion.div>
                {stepNum < 4 && (
                  <div className={`w-8 sm:w-12 md:w-16 h-1 mx-1 sm:mx-2 ${
                    step > stepNum ? 'bg-gradient-to-r from-eduvos-electric to-eduvos-innovation' : 'bg-glass-border'
                  }`} />
                )}
              </div>
            ))}
          </motion.div>

          {/* Main Form Container */}
          <motion.div
            layout
            className="card-glass p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border border-glass-border shadow-glass"
          >
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">What's Your Big Idea?</h2>
                  <p className="text-secondary mb-4 sm:mb-6 text-sm sm:text-base">Start with a clear title and description</p>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Idea Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., AI-Powered Campus Navigation System"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-glass-white border border-glass-border rounded-lg sm:rounded-xl text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-eduvos-innovation focus:border-transparent transition-all text-sm sm:text-base min-h-[44px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Description *
                      </label>
                      <textarea
                        placeholder="Describe your idea in detail. What problem does it solve? How will it benefit the Eduvos community?"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-glass-white border border-glass-border rounded-lg sm:rounded-xl text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-eduvos-innovation focus:border-transparent transition-all resize-none text-sm sm:text-base min-h-[120px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-glass-white border border-glass-border rounded-lg sm:rounded-xl text-primary focus:outline-none focus:ring-2 focus:ring-eduvos-innovation focus:border-transparent transition-all text-sm sm:text-base min-h-[44px]"
                      >
                        <option value="">Select a category</option>
                        <option value="technology">Technology & Innovation</option>
                        <option value="sustainability">Sustainability</option>
                        <option value="education">Education & Learning</option>
                        <option value="campus-life">Campus Life</option>
                        <option value="health-wellness">Health & Wellness</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    disabled={!formData.title || !formData.description}
                    className="w-full btn-primary py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6 min-h-[50px]"
                  >
                    Continue to AI Analysis →
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2: Tags & AI Analysis */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Enhance Your Idea</h2>
                  <p className="text-secondary mb-4 sm:mb-6 text-sm sm:text-base">Add tags and let AI analyze your concept</p>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                        {formData.tags.map((tag, index) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="inline-flex items-center px-2 sm:px-3 py-1 bg-eduvos-innovation/20 text-eduvos-innovation rounded-full text-xs sm:text-sm border border-eduvos-innovation/30"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="ml-1 sm:ml-2 hover:text-white transition-colors text-sm"
                            >
                              ×
                            </button>
                          </motion.span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add tags (press Enter)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-glass-white border border-glass-border rounded-lg sm:rounded-xl text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-eduvos-innovation focus:border-transparent transition-all text-sm sm:text-base min-h-[44px]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-primary mb-2">
                        Attachments (Optional)
                      </label>
                      <div
                        className="border-2 border-dashed border-glass-border rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center cursor-pointer hover:border-eduvos-innovation transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="text-2xl sm:text-3xl md:text-4xl mb-2">📎</div>
                        <p className="text-secondary text-sm sm:text-base">Drop files here or click to upload</p>
                        <p className="text-muted text-xs sm:text-sm mt-1">Supports images, PDFs, and documents</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setFormData(prev => ({
                              ...prev,
                              attachments: [...prev.attachments, ...files]
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(1)}
                      className="flex-1 btn-secondary py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg min-h-[50px]"
                    >
                      ← Back
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={analyzeIdea}
                      className="flex-1 btn-primary py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg flex items-center justify-center gap-2 min-h-[50px]"
                    >
                      <span>🤖</span>
                      Analyze with AI
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: AI Analysis Results */}
              {step === 3 && analysis && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">AI Analysis Complete! 🎉</h2>
                  <p className="text-secondary mb-4 sm:mb-6 text-sm sm:text-base">Here's what our AI thinks about your idea</p>

                  {/* AI Analysis Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="card-glass p-4 sm:p-6 rounded-lg sm:rounded-xl text-center"
                    >
                      <div className="text-3xl sm:text-4xl mb-2">📊</div>
                      <div className="text-2xl sm:text-3xl font-bold text-gradient mb-2">{analysis.overall}%</div>
                      <div className="text-primary font-semibold text-sm sm:text-base">Overall Score</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="card-glass p-4 sm:p-6 rounded-lg sm:rounded-xl"
                    >
                      <h3 className="font-semibold text-primary mb-3 text-sm sm:text-base">Detailed Breakdown</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-secondary">Feasibility</span>
                          <span className="text-primary font-semibold">{analysis.feasibility}%</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-secondary">Impact</span>
                          <span className="text-primary font-semibold">{analysis.impact}%</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-secondary">Innovation</span>
                          <span className="text-primary font-semibold">{analysis.innovation}%</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Strengths & Recommendations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="card-glass p-4 sm:p-6 rounded-lg sm:rounded-xl"
                    >
                      <h3 className="font-semibold text-primary mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <span>✨</span> Strengths
                      </h3>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength: string, index: number) => (
                          <motion.li
                            key={strength}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="text-secondary flex items-center gap-2 text-xs sm:text-sm"
                          >
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full" />
                            {strength}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="card-glass p-4 sm:p-6 rounded-lg sm:rounded-xl"
                    >
                      <h3 className="font-semibold text-primary mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <span>💡</span> Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec: string, index: number) => (
                          <motion.li
                            key={rec}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="text-secondary flex items-center gap-2 text-xs sm:text-sm"
                          >
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full" />
                            {rec}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(2)}
                      className="flex-1 btn-secondary py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg min-h-[50px]"
                    >
                      ← Revise Idea
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      className="flex-1 btn-primary py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg min-h-[50px]"
                    >
                      Submit Idea 🚀
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 sm:py-12"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6"
                  >
                    🎉
                  </motion.div>
                  <motion.h2
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Idea Submitted Successfully!
                  </motion.h2>
                  <motion.p
                    className="text-base sm:text-lg md:text-xl text-secondary mb-6 sm:mb-8 px-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Your innovation is now part of the Eduvos community.
                    The AI will continue analyzing while others discover your idea.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-muted text-sm sm:text-base"
                  >
                    Redirecting to ideas page...
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Analysis Loading State */}
            <AnimatePresence>
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-eduvos-deep/80 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center"
                >
                  <div className="text-center p-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-eduvos-innovation border-t-transparent rounded-full mx-auto mb-3 sm:mb-4"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-primary mb-3 sm:mb-4">
                      AI is analyzing your idea...
                    </h3>
                    <div className="space-y-1 sm:space-y-2">
                      {aiMessages.map((message, index) => (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="text-secondary text-sm sm:text-base"
                        >
                          {message}
                        </motion.p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}