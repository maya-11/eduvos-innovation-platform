"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";

interface Idea {
  id: string;
  title: string;
  description: string;
  authorEmail: string;
  status: 'backlog' | 'validated' | 'in-progress' | 'implemented' | 'rejected';
  votesCount: number;
  priority: number;
  tags: string[];
  createdAt: any;
}

interface User {
  id: string;
  email: string;
  role: 'student' | 'manager' | 'admin';
  ideasCount: number;
}

export default function AdminPanel() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ideas' | 'users' | 'analytics'>('ideas');

  const { user } = useAuth();

  // Check if user is admin (for demo purposes - in real app, check Firebase claims)
  const isAdmin = user?.email === 'admin@eduvos.com' || user?.email?.includes('admin');

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        // Fetch ideas
        const ideasQuery = query(collection(db, "ideas"), orderBy("createdAt", "desc"));
        const ideasSnapshot = await getDocs(ideasQuery);
        const ideasData: Idea[] = [];

        ideasSnapshot.forEach((doc) => {
          ideasData.push({
            id: doc.id,
            ...doc.data()
          } as Idea);
        });
        setIdeas(ideasData);

        // For demo - create mock users (in real app, fetch from Firestore)
        const mockUsers: User[] = [
          { id: '1', email: 'student@eduvos.com', role: 'student', ideasCount: 3 },
          { id: '2', email: 'manager@eduvos.com', role: 'manager', ideasCount: 1 },
          { id: '3', email: 'admin@eduvos.com', role: 'admin', ideasCount: 2 },
          { id: '4', email: user?.email || 'current@eduvos.com', role: 'admin', ideasCount: ideasData.filter(i => i.authorEmail === user?.email).length }
        ];
        setUsers(mockUsers);

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, user]);

  const updateIdeaStatus = async (ideaId: string, newStatus: Idea['status']) => {
    try {
      const ideaRef = doc(db, "ideas", ideaId);
      await updateDoc(ideaRef, {
        status: newStatus,
        updatedAt: new Date()
      });

      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId ? { ...idea, status: newStatus } : idea
      ));
    } catch (error) {
      console.error("Error updating idea status:", error);
    }
  };

  const updateIdeaPriority = async (ideaId: string, newPriority: number) => {
    try {
      const ideaRef = doc(db, "ideas", ideaId);
      await updateDoc(ideaRef, {
        priority: newPriority,
        updatedAt: new Date()
      });

      setIdeas(prev => prev.map(idea => 
        idea.id === ideaId ? { ...idea, priority: newPriority } : idea
      ));
    } catch (error) {
      console.error("Error updating idea priority:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#92400e', marginBottom: '1rem' }}>🔐 Admin Access Required</h2>
          <p style={{ color: '#92400e', marginBottom: '1rem' }}>
            You need administrator privileges to access this panel.
          </p>
          <p style={{ color: '#92400e', fontSize: '0.875rem' }}>
            For demo purposes, login with an admin email (contains "admin").
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem' }}>Loading admin panel...</div>
        </div>
      </div>
    );
  }

  // Analytics data
  const analytics = {
    totalIdeas: ideas.length,
    implementedIdeas: ideas.filter(i => i.status === 'implemented').length,
    inProgressIdeas: ideas.filter(i => i.status === 'in-progress').length,
    topVotedIdea: ideas.reduce((prev, current) =>
      (prev.votesCount > current.votesCount) ? prev : current
    ),
    ideasByStatus: {
      backlog: ideas.filter(i => i.status === 'backlog').length,
      validated: ideas.filter(i => i.status === 'validated').length,
      'in-progress': ideas.filter(i => i.status === 'in-progress').length,
      implemented: ideas.filter(i => i.status === 'implemented').length,
      rejected: ideas.filter(i => i.status === 'rejected').length
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Admin Panel
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage ideas, users, and view platform analytics
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '2rem'
      }}>
        {(['ideas', 'users', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.75rem 1.5rem',
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
              color: activeTab === tab ? '#2563eb' : '#6b7280',
              fontWeight: activeTab === tab ? '600' : '400'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Ideas Management Tab */}
      {activeTab === 'ideas' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            Idea Management ({ideas.length})
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {ideas.map((idea) => (
              <div key={idea.id} style={{
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                      {idea.title}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      By: {idea.authorEmail} • {idea.votesCount} votes
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{
                      background:
                        idea.status === 'implemented' ? '#d1fae5' :
                        idea.status === 'in-progress' ? '#fef3c7' :
                        idea.status === 'validated' ? '#dbeafe' :
                        idea.status === 'rejected' ? '#fee2e2' :
                        '#f3f4f6',
                      color:
                        idea.status === 'implemented' ? '#065f46' :
                        idea.status === 'in-progress' ? '#92400e' :
                        idea.status === 'validated' ? '#1e40af' :
                        idea.status === 'rejected' ? '#991b1b' :
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
                </div>

                <p style={{ color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {idea.description.length > 200
                    ? `${idea.description.substring(0, 200)}...`
                    : idea.description
                  }
                </p>

                {/* Admin Controls */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', color: '#374151', marginRight: '0.5rem' }}>
                      Status:
                    </label>
                    <select
                      value={idea.status}
                      onChange={(e) => updateIdeaStatus(idea.id, e.target.value as Idea['status'])}
                      style={{
                        padding: '0.25rem 0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="validated">Validated</option>
                      <option value="in-progress">In Progress</option>
                      <option value="implemented">Implemented</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.875rem', color: '#374151', marginRight: '0.5rem' }}>
                      Priority:
                    </label>
                    <select
                      value={idea.priority || 1}
                      onChange={(e) => updateIdeaPriority(idea.id, parseInt(e.target.value))}
                      style={{
                        padding: '0.25rem 0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem'
                      }}
                    >
                      <option value="1">Low</option>
                      <option value="2">Medium</option>
                      <option value="3">High</option>
                      <option value="4">Critical</option>
                    </select>
                  </div>

                  <Link 
                    href={`/ideas/${idea.id}`}
                    style={{
                      fontSize: '0.875rem',
                      color: '#2563eb',
                      textDecoration: 'none',
                      fontWeight: '500'
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Management Tab */}
      {activeTab === 'users' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            User Management ({users.length})
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {users.map((user) => (
              <div key={user.id} style={{
                background: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                    {user.email}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {user.ideasCount} ideas submitted
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{
                    background:
                      user.role === 'admin' ? '#fef3c7' :
                      user.role === 'manager' ? '#dbeafe' :
                      '#f3f4f6',
                    color:
                      user.role === 'admin' ? '#92400e' :
                      user.role === 'manager' ? '#1e40af' :
                      '#374151',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {user.role}
                  </span>

                  <select
                    value={user.role}
                    onChange={(e) => {
                      // In real app, update user role in Firebase
                      console.log(`Update ${user.email} role to:`, e.target.value);
                    }}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="student">Student</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            Platform Analytics
          </h2>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>
                {analytics.totalIdeas}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Total Ideas</div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', marginBottom: '0.5rem' }}>
                {analytics.implementedIdeas}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Implemented</div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706', marginBottom: '0.5rem' }}>
                {analytics.inProgressIdeas}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>In Progress</div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', marginBottom: '0.5rem' }}>
                {users.length}
              </div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Active Users</div>
            </div>
          </div>

          {/* Status Distribution */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Ideas by Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Object.entries(analytics.ideasByStatus).map(([status, count]) => (
                <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    textTransform: 'capitalize',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    {status}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '60%' }}>
                    <div style={{
                      flex: 1,
                      background: '#f3f4f6',
                      borderRadius: '0.25rem',
                      height: '8px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background:
                          status === 'implemented' ? '#10b981' :
                          status === 'in-progress' ? '#f59e0b' :
                          status === 'validated' ? '#3b82f6' :
                          status === 'rejected' ? '#ef4444' :
                          '#6b7280',
                        width: `${(count / analytics.totalIdeas) * 100}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      minWidth: '3rem',
                      textAlign: 'right'
                    }}>
                      {count} ({Math.round((count / analytics.totalIdeas) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Voted Idea */}
          {analytics.topVotedIdea && (
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
                🏆 Most Popular Idea
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                    {analytics.topVotedIdea.title}
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    By: {analytics.topVotedIdea.authorEmail}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Status: <span style={{
                      textTransform: 'capitalize',
                      fontWeight: '500',
                      color:
                        analytics.topVotedIdea.status === 'implemented' ? '#065f46' :
                        analytics.topVotedIdea.status === 'in-progress' ? '#92400e' :
                        analytics.topVotedIdea.status === 'validated' ? '#1e40af' :
                        '#374151'
                    }}>
                      {analytics.topVotedIdea.status}
                    </span>
                  </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    fontSize: '1.125rem',
                    fontWeight: 'bold'
                  }}>
                    {analytics.topVotedIdea.votesCount} votes
                  </div>
                  <Link
                    href={`/ideas/${analytics.topVotedIdea.id}`}
                    style={{
                      fontSize: '0.875rem',
                      color: '#2563eb',
                      textDecoration: 'none',
                      marginTop: '0.5rem',
                      display: 'inline-block'
                    }}
                  >
                    View Idea →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}