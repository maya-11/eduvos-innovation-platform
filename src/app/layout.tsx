"use client";

import { useAuth } from "@/lib/useAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <html lang="en">
      <head>
        <title>Eduvos Innovation Platform</title>
        <meta name="description" content="Submit, collaborate, and track innovative ideas" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: 'system-ui, sans-serif',
        backgroundColor: '#f9fafb',
        minHeight: '100vh'
      }}>
        {/* Navigation */}
        <nav style={{
          background: 'white',
          padding: '1rem 0',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <a href="/" style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#2563eb',
                textDecoration: 'none'
              }}>Eduvos Innovation</a>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="/ideas" style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>Browse Ideas</a>
                <a href="/ideas/new" style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>Submit Idea</a>
                <a href="/board" style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>Workflow Board</a>
                <a href="/dashboard" style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>Dashboard</a>
                <a href="/admin" style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>Admin</a>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <a href="/profile" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>Profile</a>
              <a href="/about" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>About</a>
              <a href="/login" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}>Login</a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1rem',
          minHeight: 'calc(100vh - 80px)'
        }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          padding: '2rem 1rem',
          marginTop: 'auto'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              © 2024 Eduvos Innovation Platform. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/about" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>About</a>
              <a href="/support" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Support</a>
              <a href="/terms" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Terms</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
