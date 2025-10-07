"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { aiAnalysisService, AIAnalysis } from "@/lib/aiAnalysis";

export default function NewIdea() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  // Analyze idea with AI
  const analyzeIdea = async () => {
    if (!title.trim() || !description.trim()) return;
    
    setAnalyzing(true);
    try {
      const analysis = await aiAnalysisService.analyzeIdea(title, description, tags.split(',').map(t => t.trim()));
      setAiAnalysis(analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error("AI analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title.trim() || !description.trim()) return;

    setLoading(true);
    try {
      // Calculate priority based on AI analysis or default to medium
      const priority = aiAnalysis 
        ? aiAnalysisService.calculatePriority(aiAnalysis)
        : 3;

      const ideaData = {
        title: title.trim(),
        description: description.trim(),
        authorId: user.uid,
        authorEmail: user.email,
        status: 'backlog',
        votesCount: 0,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        priority,
        aiAnalysis: aiAnalysis || null,
        aiScore: aiAnalysis ? aiAnalysisService.getOverallScore(aiAnalysis) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "ideas"), ideaData);
      console.log("Document written with ID: ", docRef.id);
      router.push("/ideas");
    } catch (error) {
      console.error("Error submitting idea:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>
        Submit New Idea
      </h1>

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
              {analyzing ? '🤖 Analyzing...' : '🧠 Get AI Analysis'}
            </button>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Get instant feedback on your idea's potential
            </span>
          </div>

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
              
              {/* Overall Score */}
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
                  {aiAnalysisService.getOverallScore(aiAnalysis)}%
                </div>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                    Overall Score
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Confidence: {aiAnalysis.confidence}%
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  📋 Analysis Summary
                </div>
                <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.5' }}>
                  {aiAnalysis.summary}
                </p>
              </div>

              {/* Auto-assigned Priority */}
              <div style={{ 
                background: '#fef3c7', 
                border: '1px solid #fcd34d',
                borderRadius: '0.375rem',
                padding: '0.75rem',
                marginTop: '1rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#92400e' }}>
                  🎯 Auto-assigned Priority: {aiAnalysisService.calculatePriority(aiAnalysis)}/5
                </div>
                <div style={{ fontSize: '0.75rem', color: '#92400e' }}>
                  (1 = Highest priority, 5 = Lowest priority)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            alignSelf: 'flex-start',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? 'Submitting...' : 'Submit Idea'}
        </button>
      </form>
    </div>
  );
}
