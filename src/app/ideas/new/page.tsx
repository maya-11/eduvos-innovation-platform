"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NewIdea() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.125rem' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '1.125rem' }}>Redirecting to login...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      
      const ideaData = {
        title: title.trim(),
        description: description.trim(),
        authorId: user.uid,
        authorEmail: user.email,
        status: "backlog",
        votesCount: 0,
        tags: tagsArray,
        priority: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "ideas"), ideaData);
      console.log("Document written with ID: ", docRef.id);
      
      setSuccess("Idea submitted successfully! Redirecting...");
      
      setTimeout(() => {
        router.push("/ideas");
      }, 1500);
      
    } catch (error: any) {
      console.error("Full error details:", error);
      setError("Failed to submit idea: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <a href="/ideas" style={{ color: '#2563eb', textDecoration: 'none' }}>? Back to Ideas</a>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>Submit New Idea</h1>
        <p style={{ color: '#6b7280' }}>Share your innovative idea with the Eduvos community</p>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {success && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#16a34a',
            padding: '0.75rem 1rem',
            borderRadius: '0.375rem',
            marginBottom: '1rem'
          }}>
            <strong>Success!</strong> {success}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            Idea Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              color: '#111827'
            }}
            placeholder="What's your innovative idea?"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            Detailed Description *
          </label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              color: '#111827',
              resize: 'vertical'
            }}
            placeholder="Describe your idea in detail. What problem does it solve? How would it work?"
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: '#374151',
            fontSize: '0.875rem'
          }}>
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              color: '#111827'
            }}
            placeholder="technology, education, sustainability (separate with commas)"
          />
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>Add relevant tags to help categorize your idea</p>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a
              href="/ideas"
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                color: '#374151',
                textDecoration: 'none'
              }}
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.5rem 1.5rem',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                cursor: 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? "Submitting..." : "Submit Idea"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
