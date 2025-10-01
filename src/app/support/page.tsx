export default function Support() {
  const faqs = [
    {
      question: "How do I submit an idea?",
      answer: "Click on 'Submit Idea' in the navigation menu, fill out the form with your idea's title, description, and relevant tags, then click 'Submit Idea'."
    },
    {
      question: "Can I edit my idea after submitting?",
      answer: "Currently, ideas cannot be edited after submission to maintain the integrity of the voting and discussion process. You can add additional comments to provide updates."
    },
    {
      question: "How does the voting system work?",
      answer: "Each user can vote once per idea. Votes help identify the most popular and promising ideas for further development."
    },
    {
      question: "What happens after I submit an idea?",
      answer: "Your idea goes into the 'Backlog' where it can receive votes and comments. Managers and admins will review popular ideas and move them through the workflow stages."
    },
    {
      question: "How can I become a manager or admin?",
      answer: "Manager and admin roles are assigned by platform administrators. Contact your institution's innovation team for role assignment."
    },
    {
      question: "Is there a mobile app?",
      answer: "Yes! This is a Progressive Web App (PWA). You can install it on your mobile device by visiting the site in your browser and following the install prompt."
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
          Help & Support
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
          Get help with using the Eduvos Innovation Platform
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Quick Help Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>??</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Submit Ideas
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Learn how to submit and describe your innovative ideas effectively.
            </p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>??</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Track Progress
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Understand how ideas move through the workflow stages.
            </p>
          </div>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>??</div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              Collaborate
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Discover how to vote and comment on others' ideas.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1.5rem' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '0.75rem' }}>
                  {faq.question}
                </h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6', margin: 0 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
            Still Need Help?
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Contact our support team for additional assistance
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>??</div>
              <div style={{ fontWeight: '600', color: '#111827' }}>Email</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>innovation@eduvos.com</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>??</div>
              <div style={{ fontWeight: '600', color: '#111827' }}>Office</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Innovation Center, Campus</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>??</div>
              <div style={{ fontWeight: '600', color: '#111827' }}>Hours</div>
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Mon-Fri, 9AM-5PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
