"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Idea {
  id: string;
  title: string;
  description: string;
  authorEmail: string;
  status: string;
  votesCount: number;
  tags: string[];
  createdAt: any;
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const ideasQuery = query(
          collection(db, "ideas"), 
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(ideasQuery);
        const ideasData: Idea[] = [];
        
        querySnapshot.forEach((doc) => {
          ideasData.push({
            id: doc.id,
            ...doc.data()
          } as Idea);
        });
        
        setIdeas(ideasData);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem' }}>Loading ideas...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Innovation Ideas</h1>
        <Link 
          href="/ideas/new"
          style={{
            background: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Submit New Idea
        </Link>
      </div>
      
      {ideas.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '1.125rem' }}>
            No ideas submitted yet. Be the first to share your innovation!
          </p>
          <Link 
            href="/ideas/new"
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            Submit Your First Idea
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {ideas.map((idea) => (
            <div key={idea.id} style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              borderLeft: `4px solid ${
                idea.status === 'implemented' ? '#10b981' :
                idea.status === 'in-progress' ? '#f59e0b' :
                idea.status === 'validated' ? '#3b82f6' :
                '#6b7280'
              }`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <Link 
                  href={`/ideas/${idea.id}`}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    textDecoration: 'none'
                  }}
                >
                  {idea.title}
                </Link>
                <span style={{
                  background: 
                    idea.status === 'implemented' ? '#d1fae5' :
                    idea.status === 'in-progress' ? '#fef3c7' :
                    idea.status === 'validated' ? '#dbeafe' :
                    '#f3f4f6',
                  color:
                    idea.status === 'implemented' ? '#065f46' :
                    idea.status === 'in-progress' ? '#92400e' :
                    idea.status === 'validated' ? '#1e40af' :
                    '#374151',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {idea.status}
                </span>
              </div>
              
              <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>
                {idea.description.length > 200 
                  ? `${idea.description.substring(0, 200)}...` 
                  : idea.description
                }
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    By: {idea.authorEmail}
                  </span>
                  {idea.tags && idea.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {idea.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} style={{
                          background: '#e5e7eb',
                          color: '#374151',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {idea.votesCount} votes
                  </span>
                  <Link 
                    href={`/ideas/${idea.id}`}
                    style={{
                      color: '#2563eb',
                      textDecoration: 'none',
                      fontWeight: '500',
                      fontSize: '0.875rem'
                    }}
                  >
                    View Details ?
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
