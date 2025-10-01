"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";

interface Idea {
  id: string;
  title: string;
  description: string;
  authorEmail: string;
  status: 'backlog' | 'validated' | 'in-progress' | 'implemented' | 'rejected';
  votesCount: number;
  tags: string[];
  createdAt: any;
}

const statusConfig = {
  'backlog': { title: 'Backlog', color: '#6b7280', bgColor: '#f3f4f6' },
  'validated': { title: 'Validated', color: '#1e40af', bgColor: '#dbeafe' },
  'in-progress': { title: 'In Progress', color: '#92400e', bgColor: '#fef3c7' },
  'implemented': { title: 'Implemented', color: '#065f46', bgColor: '#d1fae5' },
  'rejected': { title: 'Rejected', color: '#991b1b', bgColor: '#fee2e2' }
};

export default function WorkflowBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIdea, setDraggedIdea] = useState<string | null>(null);
  
  const { user } = useAuth();

  // Fetch all ideas
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

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, ideaId: string) => {
    setDraggedIdea(ideaId);
    e.dataTransfer.setData('text/plain', ideaId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = async (e: React.DragEvent, newStatus: Idea['status']) => {
    e.preventDefault();
    if (!draggedIdea || !user) return;

    try {
      // Update idea status in Firestore
      const ideaRef = doc(db, "ideas", draggedIdea);
      await updateDoc(ideaRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      // Update local state
      setIdeas(prevIdeas => 
        prevIdeas.map(idea => 
          idea.id === draggedIdea ? { ...idea, status: newStatus } : idea
        )
      );

      setDraggedIdea(null);
    } catch (error) {
      console.error("Error updating idea status:", error);
    }
  };

  // Group ideas by status
  const ideasByStatus = {
    'backlog': ideas.filter(idea => idea.status === 'backlog'),
    'validated': ideas.filter(idea => idea.status === 'validated'),
    'in-progress': ideas.filter(idea => idea.status === 'in-progress'),
    'implemented': ideas.filter(idea => idea.status === 'implemented'),
    'rejected': ideas.filter(idea => idea.status === 'rejected')
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem' }}>Loading workflow board...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Innovation Workflow Board
        </h1>
        <p style={{ color: '#6b7280' }}>
          Drag and drop ideas between columns to update their status. 
          {!user && ' Login to manage ideas.'}
        </p>
      </div>

      {/* Kanban Board */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {Object.entries(statusConfig).map(([status, config]) => (
          <div 
            key={status}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status as Idea['status'])}
            style={{
              background: '#f8fafc',
              borderRadius: '0.5rem',
              padding: '1rem',
              minHeight: '600px',
              border: '2px dashed #e2e8f0'
            }}
          >
            {/* Column Header */}
            <div style={{ 
              background: config.bgColor, 
              color: config.color,
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {config.title} ({ideasByStatus[status as keyof typeof ideasByStatus].length})
            </div>

            {/* Ideas in this column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ideasByStatus[status as keyof typeof ideasByStatus].map((idea) => (
                <div
                  key={idea.id}
                  draggable={!!user}
                  onDragStart={(e) => handleDragStart(e, idea.id)}
                  style={{
                    background: 'white',
                    borderRadius: '0.375rem',
                    padding: '1rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    border: '1px solid #e5e7eb',
                    cursor: user ? 'grab' : 'default',
                    opacity: draggedIdea === idea.id ? 0.5 : 1,
                    transition: 'all 0.2s'
                  }}
                >
                  <h3 style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600', 
                    color: '#111827',
                    marginBottom: '0.5rem',
                    lineHeight: '1.4'
                  }}>
                    {idea.title}
                  </h3>
                  
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {idea.description}
                  </p>

                  {/* Idea Meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        By: {idea.authorEmail}
                      </span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        {idea.votesCount} ?
                      </span>
                    </div>

                    {idea.tags && idea.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {idea.tags.slice(0, 2).map((tag, index) => (
                          <span 
                            key={index}
                            style={{
                              background: '#e5e7eb',
                              color: '#374151',
                              padding: '0.125rem 0.375rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.625rem'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                        {idea.tags.length > 2 && (
                          <span style={{
                            background: '#e5e7eb',
                            color: '#374151',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.625rem'
                          }}>
                            +{idea.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <a 
                        href={`/ideas/${idea.id}`}
                        style={{
                          fontSize: '0.75rem',
                          color: '#2563eb',
                          textDecoration: 'none',
                          fontWeight: '500'
                        }}
                      >
                        View ?
                      </a>
                      {user && (
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Drag to move
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state for column */}
              {ideasByStatus[status as keyof typeof ideasByStatus].length === 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#9ca3af',
                  padding: '2rem 1rem',
                  fontSize: '0.875rem',
                  fontStyle: 'italic'
                }}>
                  No ideas in {config.title.toLowerCase()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      {user && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#0369a1', margin: 0, fontSize: '0.875rem' }}>
            ?? <strong>How to use:</strong> Drag ideas between columns to update their status. 
            Ideas flow from Backlog ? Validated ? In Progress ? Implemented.
          </p>
        </div>
      )}

      {!user && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '0.375rem',
          padding: '1rem',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#92400e', margin: 0, fontSize: '0.875rem' }}>
            ?? <strong>Login required:</strong> You need to be logged in to manage the workflow board.
            <a href="/login" style={{ color: '#dc2626', marginLeft: '0.5rem', textDecoration: 'none' }}>
              Login here
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
