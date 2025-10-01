export default function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          About Eduvos Innovation Platform
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Empowering innovation through collaboration and structured workflow management
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Mission Section */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            ?? Our Mission
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '1rem' }}>
            The Eduvos Innovation Platform is designed to foster a culture of innovation by providing 
            students and staff with a structured environment to submit, collaborate on, and implement 
            creative ideas that drive positive change.
          </p>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
            We believe that great ideas can come from anywhere, and our platform ensures that every 
            voice is heard and every innovation has the opportunity to grow from concept to reality.
          </p>
        </div>

        {/* Features Section */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
            ?? Key Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Idea Submission
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Easily submit innovative ideas with detailed descriptions, tags, and attachments.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Collaborative Voting
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Community-driven voting system to identify the most promising ideas.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Workflow Management
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Track ideas through structured stages from submission to implementation.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Real-time Collaboration
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                Comment and discuss ideas in real-time with other community members.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
            ?? How It Works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                background: '#2563eb',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>1</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Submit Your Idea
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Share your innovative idea with the community. Add a clear title, detailed description, 
                  and relevant tags to help others understand your vision.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                background: '#2563eb',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>2</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Gather Feedback
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Receive votes and comments from the community. Collaborate with others to refine 
                  and improve your idea through constructive feedback.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                background: '#2563eb',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>3</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Progress Through Workflow
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Watch your idea move through structured stages: Backlog ? Validated ? In Progress ? Implemented. 
                  Managers and admins help guide promising ideas to completion.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                background: '#2563eb',
                color: 'white',
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0
              }}>4</div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  See Impact
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                  Track the implementation and impact of your ideas. Celebrate successful innovations 
                  that make a real difference in our community.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: '0.5rem',
          padding: '3rem 2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Ready to Make an Impact?
          </h2>
          <p style={{ marginBottom: '2rem', opacity: 0.9 }}>
            Join our innovation community and start sharing your ideas today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/ideas/new"
              style={{
                background: 'white',
                color: '#2563eb',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Submit Your First Idea
            </a>
            <a 
              href="/ideas"
              style={{
                background: 'transparent',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontWeight: '600',
                border: '2px solid white'
              }}
            >
              Browse Ideas
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
