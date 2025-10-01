export default function Terms() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          Terms & Privacy
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Platform usage terms and privacy policy
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Terms of Use */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
            Terms of Use
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                1. Acceptance of Terms
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                By accessing and using the Eduvos Innovation Platform, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                2. User Responsibilities
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                3. Idea Submission
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                By submitting ideas to the platform, users grant Eduvos a license to use, evaluate, and potentially implement submitted ideas for educational and institutional purposes.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                4. Code of Conduct
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Users must maintain respectful and professional conduct. Harassment, spam, or inappropriate content will not be tolerated.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
            Privacy Policy
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Data Collection
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                We collect information you provide directly to us, including account information, submitted ideas, comments, votes, and platform usage data.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Data Usage
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Your data is used to operate the platform, facilitate innovation collaboration, improve our services, and communicate with you about platform updates.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Data Sharing
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                We do not sell your personal data. Idea content may be shared within the institution for evaluation and implementation purposes.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                Data Security
              </h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction.
              </p>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
            Intellectual Property
          </h2>
          <div style={{ color: '#6b7280', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '1rem' }}>
              Users retain ownership of their submitted ideas. However, by submitting ideas to the platform, users grant Eduvos a non-exclusive, royalty-free license to use, evaluate, and potentially implement the ideas for educational and institutional purposes.
            </p>
            <p>
              The platform software and associated intellectual property remain the property of Eduvos and its licensors.
            </p>
          </div>
        </div>

        {/* Contact for Questions */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '0.5rem',
          padding: '2rem',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            Questions?
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            If you have any questions about these terms or our privacy practices, please contact us.
          </p>
          <a 
            href="mailto:legal@eduvos.com"
            style={{
              color: '#2563eb',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            legal@eduvos.com
          </a>
        </div>
      </div>
    </div>
  );
}
