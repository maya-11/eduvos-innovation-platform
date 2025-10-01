"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserStats {
  ideasSubmitted: number;
  votesReceived: number;
  ideasInProgress: number;
  ideasImplemented: number;
}

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>({
    ideasSubmitted: 0,
    votesReceived: 0,
    ideasInProgress: 0,
    ideasImplemented: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch user-specific stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        // Get all ideas submitted by this user
        const userIdeasQuery = query(
          collection(db, "ideas"),
          where("authorId", "==", user.uid)
        );
        const userIdeasSnapshot = await getDocs(userIdeasQuery);
        
        const userIdeas: any[] = [];
        let totalVotes = 0;
        let inProgressCount = 0;
        let implementedCount = 0;

        userIdeasSnapshot.forEach((doc) => {
          const ideaData = doc.data();
          userIdeas.push(ideaData);
          totalVotes += ideaData.votesCount || 0;
          
          if (ideaData.status === 'in-progress') {
            inProgressCount++;
          } else if (ideaData.status === 'implemented') {
            implementedCount++;
          }
        });

        setStats({
          ideasSubmitted: userIdeas.length,
          votesReceived: totalVotes,
          ideasInProgress: inProgressCount,
          ideasImplemented: implementedCount
        });

      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ fontSize: '1.125rem' }}>Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#374151' }}>Welcome, {user.email}</span>
          <button 
            onClick={logout}
            style={{
              background: '#dc2626',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Submit New Idea</h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Share your innovative ideas with the community</p>
          <a href="/ideas/new" style={{
            background: '#2563eb',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Submit Idea
          </a>
        </div>
        
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>Browse Ideas</h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Explore ideas submitted by others</p>
          <a href="/ideas" style={{
            background: '#059669',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            View Ideas
          </a>
        </div>
        
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>My Submissions</h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Manage your submitted ideas</p>
          <a href="/profile?tab=ideas" style={{
            background: '#7c3aed',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            display: 'inline-block',
            cursor: 'pointer'
          }}>
            My Submissions
          </a>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Your Quick Stats</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={{ textAlign: 'center', background: '#dbeafe', borderRadius: '0.375rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.ideasSubmitted}</div>
            <div style={{ fontSize: '0.875rem', color: '#374151' }}>Ideas Submitted</div>
          </div>
          <div style={{ textAlign: 'center', background: '#d1fae5', borderRadius: '0.375rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>{stats.votesReceived}</div>
            <div style={{ fontSize: '0.875rem', color: '#374151' }}>Votes Received</div>
          </div>
          <div style={{ textAlign: 'center', background: '#fef3c7', borderRadius: '0.375rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>{stats.ideasInProgress}</div>
            <div style={{ fontSize: '0.875rem', color: '#374151' }}>In Progress</div>
          </div>
          <div style={{ textAlign: 'center', background: '#f3e8ff', borderRadius: '0.375rem', padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#7c3aed' }}>{stats.ideasImplemented}</div>
            <div style={{ fontSize: '0.875rem', color: '#374151' }}>Implemented</div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={{
        background: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <a href="/board" style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            color: '#374151',
            textAlign: 'center',
            fontWeight: '500'
          }}>
             Workflow Board
          </a>
          <a href="/profile" style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            color: '#374151',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            Your Profile
          </a>
          <a href="/ideas/new" style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            padding: '1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            color: '#374151',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            New Idea
          </a>
          {user.email?.includes('admin') && (
            <a href="/admin" style={{
              background: '#fef3c7',
              border: '1px solid #fcd34d',
              padding: '1rem',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              color: '#92400e',
              textAlign: 'center',
              fontWeight: '500'
            }}>
              Admin Panel
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
