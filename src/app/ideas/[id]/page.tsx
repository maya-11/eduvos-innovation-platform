"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Idea {
  id: string;
  title: string;
  description: string;
  authorId: string;
  authorEmail: string;
  status: string;
  votesCount: number;
  tags: string[];
  createdAt: any;
}

interface Comment {
  id: string;
  authorId: string;
  authorEmail: string;
  text: string;
  createdAt: any;
}

export default function IdeaDetail() {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const ideaId = params.id as string;

  // Fetch idea data and comments
  useEffect(() => {
    if (!ideaId) return;

    const fetchIdea = async () => {
      try {
        // Get idea data
        const ideaDoc = await getDoc(doc(db, "ideas", ideaId));
        if (!ideaDoc.exists()) {
          router.push("/ideas");
          return;
        }

        const ideaData = {
          id: ideaDoc.id,
          ...ideaDoc.data()
        } as Idea;
        setIdea(ideaData);

        // Check if user has voted
        if (user) {
          const voteDoc = await getDoc(doc(db, "ideas", ideaId, "votes", user.uid));
          setHasVoted(voteDoc.exists());
        }

        // Listen for real-time comments
        const commentsQuery = query(
          collection(db, "ideas", ideaId, "comments"),
          orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
          const commentsData: Comment[] = [];
          snapshot.forEach((doc) => {
            commentsData.push({
              id: doc.id,
              ...doc.data()
            } as Comment);
          });
          setComments(commentsData);
        });

        setLoading(false);
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching idea:", error);
        setLoading(false);
      }
    };

    fetchIdea();
  }, [ideaId, user, router]);

  // Handle voting
  const handleVote = async () => {
    if (!user || !idea) return;

    try {
      const voteRef = doc(db, "ideas", ideaId, "votes", user.uid);
      const ideaRef = doc(db, "ideas", ideaId);

      if (hasVoted) {
        // Remove vote
        await deleteDoc(voteRef);
        await updateDoc(ideaRef, {
          votesCount: idea.votesCount - 1
        });
        setHasVoted(false);
        setIdea({ ...idea, votesCount: idea.votesCount - 1 });
      } else {
        // Add vote
        await setDoc(voteRef, { voted: true });
        await updateDoc(ideaRef, {
          votesCount: idea.votesCount + 1
        });
        setHasVoted(true);
        setIdea({ ...idea, votesCount: idea.votesCount + 1 });
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setCommentLoading(true);
    try {
      await addDoc(collection(db, "ideas", ideaId, "comments"), {
        authorId: user.uid,
        authorEmail: user.email,
        text: newComment.trim(),
        createdAt: new Date()
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem' }}>Loading idea...</div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.125rem', color: '#dc2626' }}>Idea not found</div>
          <Link href="/ideas" style={{ color: '#2563eb', textDecoration: 'none' }}>? Back to Ideas</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Back Navigation */}
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/ideas" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}>
          ? Back to Ideas
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column - Idea Content */}
        <div>
          {/* Idea Header */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '2rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {idea.title}
              </h1>
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
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}>
                {idea.status}
              </span>
            </div>

            {/* Voting Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                onClick={handleVote}
                disabled={!user}
                style={{
                  background: hasVoted ? '#2563eb' : 'transparent',
                  color: hasVoted ? 'white' : '#374151',
                  border: `2px solid ${hasVoted ? '#2563eb' : '#d1d5db'}`,
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  cursor: user ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: user ? 1 : 0.5
                }}
              >
                <span style={{ fontSize: '1.125rem' }}>?</span>
                Vote {idea.votesCount > 0 && `(${idea.votesCount})`}
              </button>
              {!user && (
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Login to vote
                </span>
              )}
            </div>

            {/* Idea Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Description
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {idea.description}
              </p>
            </div>

            {/* Tags */}
            {idea.tags && idea.tags.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Tags
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {idea.tags.map((tag, index) => (
                    <span key={index} style={{
                      background: '#e5e7eb',
                      color: '#374151',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div style={{ 
            background: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '2rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
              Comments ({comments.length})
            </h2>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} style={{ marginBottom: '2rem' }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this idea..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    color: '#111827',
                    resize: 'vertical',
                    marginBottom: '1rem'
                  }}
                />
                <button
                  type="submit"
                  disabled={commentLoading || !newComment.trim()}
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: commentLoading ? 'not-allowed' : 'pointer',
                    opacity: commentLoading || !newComment.trim() ? 0.5 : 1
                  }}
                >
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </button>
              </form>
            ) : (
              <div style={{ 
                background: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '0.375rem',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <Link href="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>
                  Login to comment on this idea
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {comments.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  No comments yet. Be the first to share your thoughts!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '500', color: '#374151' }}>
                        {comment.authorEmail}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {comment.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Meta Information */}
        <div>
          <div style={{ 
            background: 'white', 
            borderRadius: '0.5rem', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            position: 'sticky',
            top: '2rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
              Idea Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Author</div>
                <div style={{ fontWeight: '500', color: '#374151' }}>{idea.authorEmail}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Status</div>
                <div style={{ 
                  fontWeight: '500',
                  color:
                    idea.status === 'implemented' ? '#065f46' :
                    idea.status === 'in-progress' ? '#92400e' :
                    idea.status === 'validated' ? '#1e40af' :
                    '#374151'
                }}>
                  {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Votes</div>
                <div style={{ fontWeight: '500', color: '#374151' }}>{idea.votesCount}</div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Created</div>
                <div style={{ fontWeight: '500', color: '#374151' }}>
                  {idea.createdAt?.toDate?.().toLocaleDateString() || 'Recently'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
