"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

interface UserIdea {
  id: string;
  title: string;
  status: string;
  votesCount: number;
  createdAt: any;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [userIdeas, setUserIdeas] = useState<UserIdea[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Set active tab based on URL parameter or default to 'profile'
  const initialTab = searchParams.get('tab') as 'profile' | 'ideas' | 'security' || 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'ideas' | 'security'>(initialTab);
  
  // Profile form state
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  
  // Security form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user's ideas
        const ideasQuery = query(
          collection(db, "ideas"),
          where("authorId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(ideasQuery);
        const ideasData: UserIdea[] = [];
        
        querySnapshot.forEach((doc) => {
          ideasData.push({
            id: doc.id,
            ...doc.data()
          } as UserIdea);
        });
        
        setUserIdeas(ideasData);
        
        // Set form values
        setDisplayName(user.displayName || "");
        setEmail(user.email || "");
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  // Update URL when tab changes
  useEffect(() => {
    const url = new URL(window.location.href);
    if (activeTab === 'profile') {
      url.searchParams.delete('tab');
    } else {
      url.searchParams.set('tab', activeTab);
    }
    window.history.replaceState({}, '', url.toString());
  }, [activeTab]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage("");

    try {
      if (user && user.email) {
        // Reauthenticate user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);
        
        setPasswordMessage("? Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      setPasswordMessage(`Error: ${error.message}`);
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem' }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // User stats
  const userStats = {
    totalIdeas: userIdeas.length,
    implementedIdeas: userIdeas.filter(idea => idea.status === 'implemented').length,
    totalVotes: userIdeas.reduce((sum, idea) => sum + idea.votesCount, 0),
    avgVotes: userIdeas.length > 0 ? (userIdeas.reduce((sum, idea) => sum + idea.votesCount, 0) / userIdeas.length).toFixed(1) : '0'
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          Your Profile
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your account settings and view your contributions
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Sidebar */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            position: 'sticky',
            top: '2rem'
          }}>
            {/* User Info */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#2563eb',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                margin: '0 auto 1rem'
              }}>
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.25rem' }}>
                {user.displayName || 'User'}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                {user.email}
              </p>
            </div>

            {/* Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>
                  {userStats.totalIdeas}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Ideas</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>
                  {userStats.implementedIdeas}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Implemented</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#d97706' }}>
                  {userStats.totalVotes}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Votes</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#7c3aed' }}>
                  {userStats.avgVotes}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Avg/idea</div>
              </div>
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {(['profile', 'ideas', 'security'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    background: activeTab === tab ? '#2563eb' : 'transparent',
                    color: activeTab === tab ? 'white' : '#374151',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>

            <button
              onClick={logout}
              style={{
                background: 'transparent',
                color: '#dc2626',
                border: '1px solid #dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                marginTop: '1rem',
                width: '100%',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
                Profile Information
              </h2>
              
              <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      color: '#111827'
                    }}
                    placeholder="Enter your display name"
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      color: '#111827'
                    }}
                    disabled
                  />
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                    Email cannot be changed in this demo version
                  </p>
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    alignSelf: 'flex-start'
                  }}
                >
                  Update Profile
                </button>
              </form>
            </div>
          )}

          {/* Ideas Tab */}
          {activeTab === 'ideas' && (
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
                Your Ideas ({userIdeas.length})
              </h2>
              
              {userIdeas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 2rem', color: '#6b7280' }}>
                  <p style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>You haven't submitted any ideas yet.</p>
                  <a 
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
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {userIdeas.map((idea) => (
                    <div key={idea.id} style={{
                      padding: '1.5rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: 'white'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                          {idea.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {idea.votesCount} votes
                          </span>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {idea.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={`/ideas/${idea.id}`}
                        style={{
                          color: '#2563eb',
                          textDecoration: 'none',
                          fontWeight: '500',
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                          marginLeft: '1rem'
                        }}
                      >
                        View Details ?
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div style={{
              background: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
                Security Settings
              </h2>
              
              <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
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

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

                <div>
                  <label style={{
                    display: 'block',
                    fontWeight: '500',
                    marginBottom: '0.5rem',
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                {passwordMessage && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.375rem',
                    background: passwordMessage.includes('?') ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${passwordMessage.includes('?') ? '#bbf7d0' : '#fecaca'}`,
                    color: passwordMessage.includes('?') ? '#16a34a' : '#dc2626',
                    fontSize: '0.875rem'
                  }}>
                    {passwordMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={passwordLoading}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: passwordLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    alignSelf: 'flex-start',
                    opacity: passwordLoading ? 0.5 : 1
                  }}
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
