"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { automateIdeaWorkflow, getDepartmentName } from "@/lib/workflowAutomation";
import { deepSeekAIService } from "@/lib/deepseekAI";
import type { AIAnalysis } from "@/types";

// Complete fallback analysis with all required properties
const getFallbackAnalysis = (): AIAnalysis => ({
  summary: "Demo summary: This is a fallback analysis while AI services are temporarily unavailable. Please review this idea manually.",
  confidence: 75,
  feasibility: 75,
  impact: 75,
  innovation: 75,
  resources: 75,
  scalability: 75,
  risk: 25,
  value: 75,
  alignment: 75,
  estimatedCost: 'medium',
  timeToImplement: 'medium',
  riskLevel: 'medium',
  strengths: ["Addresses identifiable need or opportunity"],
  considerations: ["Standard project management practices should be followed"],
  recommendations: ["Refine concept with additional research"],
  generatedAt: new Date(),
});

export default function NewIdeaPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  
  // Loading and error states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  
  // AI Analysis states
  const [analyzing, setAnalyzing] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Analyze idea with AI (DeepSeek only)
  const analyzeIdea = async () => {
    console.log("🧠 AI Analysis triggered");
    if (!user) {
      console.log("❌ No user for AI analysis");
      return;
    }
    if (!title.trim() || !description.trim()) {
      console.log("❌ Missing title or description");
      return;
    }
    
    setAnalyzing(true);
    setAiError("");
    try {
      console.log("🤖 Calling AI Service...");
      
      // Use DeepSeek AI directly
      const analysis = await deepSeekAIService.analyzeIdea(title, description, tags.split(',').map(t => t.trim()));
      console.log("✅ AI Analysis received");
      
      console.log("📊 Analysis results:", analysis);
      setAiAnalysis(analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error("❌ AI analysis failed:", error);
      setAiError("AI analysis unavailable. Using demo analysis.");
      // Use complete fallback analysis
      setAiAnalysis(getFallbackAnalysis());
      setShowAnalysis(true);
    } finally {
      setAnalyzing(false);
    }
  };

  // Calculate priority based on AI analysis
  const calculatePriority = (analysis: AIAnalysis): number => {
    const { feasibility, impact, innovation, resources } = analysis;
    const weightedScore = (impact * 0.4) + (feasibility * 0.3) + (innovation * 0.2) + (resources * 0.1);
    if (weightedScore >= 80) return 1;
    if (weightedScore >= 65) return 2;
    if (weightedScore >= 50) return 3;
    if (weightedScore >= 35) return 4;
    return 5;
  };

  // Get overall score from AI analysis
  const getOverallScore = (analysis: AIAnalysis): number => {
    return Math.round((analysis.feasibility + analysis.impact + analysis.innovation + analysis.resources) / 4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Form submission started");
    setSubmitError("");
    
    if (!user) {
      console.log("❌ No user for submission");
      setSubmitError("Please log in to submit ideas");
      return;
    }
    
    if (!title.trim() || !description.trim()) {
      console.log("❌ Missing required fields");
      setSubmitError("Please fill in title and description");
      return;
    }

    setSubmitting(true);
    try {
      // Calculate priority based on AI analysis
      const basicPriority = aiAnalysis 
        ? calculatePriority(aiAnalysis)
        : 3;

      // Get AI score
      const aiScoreValue = aiAnalysis ? getOverallScore(aiAnalysis) : null;

      // Run workflow automation
      console.log("🚀 Starting workflow automation...");
      const automationResult = automateIdeaWorkflow({
        title: title.trim(),
        description: description.trim(),
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        aiScore: aiScoreValue ? aiScoreValue / 100 : undefined // Convert to 0-1 scale
      });

      console.log("✅ Workflow automation completed:", automationResult);

      // Convert string priority to number for compatibility
      const priorityMap: { [key: string]: number } = {
        'critical': 5,
        'high': 4,
        'medium': 3,
        'low': 2
      };

      const finalPriority = priorityMap[automationResult.priority] || basicPriority;

      // Determine status - auto-validate if department assigned
      const finalStatus = automationResult.assignedDepartment ? 'validated' : 'backlog';

      const ideaData = {
        title: title.trim(),
        description: description.trim(),
        authorId: user.uid,
        authorEmail: user.email,
        status: finalStatus,
        votesCount: 0,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        priority: finalPriority,
        aiAnalysis: aiAnalysis || null,
        aiScore: aiScoreValue,
        
        // NEW WORKFLOW AUTOMATION FIELDS
        assignedDepartment: automationResult.assignedDepartment || null,
        workflowHistory: automationResult.workflowActions,
        automationScore: automationResult.automationScore,
        
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("📤 Submitting idea to Firestore:", ideaData);
      const docRef = await addDoc(collection(db, "ideas"), ideaData);
      console.log("✅ Idea submitted successfully with ID:", docRef.id);
      
      console.log("🔄 Redirecting to /ideas");
      router.push("/ideas");
      
    } catch (error: any) {
      console.error("❌ Error submitting idea:", error);
      setSubmitError(`Failed to submit idea: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.125rem' }}>Checking authentication...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.125rem' }}>Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>
        Submit New Idea
      </h1>

      {submitError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: '#dc2626'
        }}>
          ❌ {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Title Input */}
        <div>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
            Idea Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your innovative idea?"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              color: '#111827'
            }}
            required
          />
        </div>

        {/* Description Input */}
        <div>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
            Detailed Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your idea in detail. What problem does it solve? How would it work?"
            rows={6}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              color: '#111827',
              resize: 'vertical'
            }}
            required
          />
        </div>

        {/* Tags Input */}
        <div>
          <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', color: '#374151' }}>
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="campus, technology, sustainability, education"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              color: '#111827'
            }}
          />
        </div>

        {/* AI Analysis Section */}
        <div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={analyzeIdea}
              disabled={analyzing || !title.trim() || !description.trim()}
              style={{
                background: '#7c3aed',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: analyzing ? 'not-allowed' : 'pointer',
                opacity: (analyzing || !title.trim() || !description.trim()) ? 0.5 : 1,
                fontWeight: '500'
              }}
            >
              {analyzing ? '🤖 Analyzing with AI...' : '🧠 Get AI Analysis'}
            </button>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Powered by DeepSeek AI - Get intelligent feedback
            </span>
          </div>

          {aiError && (
            <div style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: '0.375rem',
              padding: '0.75rem',
              marginBottom: '1rem',
              color: '#92400e',
              fontSize: '0.875rem'
            }}>
              ⚠️ {aiError}
            </div>
          )}

          {showAnalysis && aiAnalysis && (
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginTop: '1rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0369a1', marginBottom: '1rem' }}>
                🤖 AI Analysis Results
              </h3>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  background: '#10b981',
                  color: 'white',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}>
                  {getOverallScore(aiAnalysis)}%
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                    Overall Score
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Confidence: {aiAnalysis.confidence}% • Powered by AI
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  📋 AI Analysis Summary
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>
                  {aiAnalysis.summary}
                </p>
              </div>

              {/* Workflow Automation Preview */}
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '0.375rem',
                padding: '1rem',
                marginTop: '1rem'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#065f46', marginBottom: '0.5rem' }}>
                  🔄 Workflow Automation Preview
                </h4>
                
                {(() => {
                  const previewAutomation = automateIdeaWorkflow({
                    title: title.trim(),
                    description: description.trim(),
                    tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                    aiScore: aiAnalysis ? getOverallScore(aiAnalysis) / 100 : undefined
                  });
                  
                  return (
                    <div style={{ fontSize: '0.875rem', color: '#047857' }}>
                      {previewAutomation.assignedDepartment && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          📍 <strong>Auto-assigned to:</strong> {getDepartmentName(previewAutomation.assignedDepartment)}
                        </div>
                      )}
                      <div style={{ marginBottom: '0.5rem' }}>
                        🎯 <strong>Auto-priority:</strong> {previewAutomation.priority}
                      </div>
                      <div>
                        📊 <strong>Automation Score:</strong> {(previewAutomation.automationScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div style={{ 
                background: '#fef3c7', 
                border: '1px solid #fcd34d',
                borderRadius: '0.375rem',
                padding: '0.75rem',
                marginTop: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#92400e' }}>
                  🎯 AI Auto-assigned Priority: {calculatePriority(aiAnalysis)}/5
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              opacity: submitting ? 0.5 : 1
            }}
          >
            {submitting ? 'Submitting Idea...' : 'Submit Idea'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              console.log("🚫 Cancelling - going to /ideas");
              router.push('/ideas');
            }}
            style={{
              background: 'transparent',
              color: '#6b7280',
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}