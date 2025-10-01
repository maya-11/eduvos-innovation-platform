export default function Home() {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center',
      padding: '2rem 0'
    }}>
      <h1 style={{
        fontSize: '2.25rem',
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: '1rem'
      }}>Welcome to Eduvos Innovation Platform</h1>
      <p style={{
        fontSize: '1.125rem',
        color: '#6b7280',
        marginBottom: '2rem'
      }}>Submit, collaborate, and track innovative ideas from concept to implementation</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a href="/ideas/new" style={{
          background: '#2563eb',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: '500'
        }}>Submit an Idea</a>
        <a href="/ideas" style={{
          border: '1px solid #2563eb',
          color: '#2563eb',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontWeight: '500'
        }}>Browse Ideas</a>
      </div>
    </div>
  );
}
