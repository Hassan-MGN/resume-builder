import { Link } from 'react-router-dom';

const copy = {
  privacy: {
    label: 'Privacy',
    title: 'Privacy Policy',
    intro: 'This starter policy explains the categories of information Resummetry is designed to handle. Review it with qualified legal counsel and update the placeholders before launch.',
    sections: [
      ['Information we handle', 'Resummetry may store account details, resume content, templates, drafts, completed resume records, and exported PDF files so the service can provide its core functionality.'],
      ['How we use information', 'We use information to authenticate users, save and restore resumes, provide editing and export features, and improve reliability. We do not need resume content for unrelated advertising purposes.'],
      ['Storage and security', 'Authenticated document access is protected with database and storage policies. Production credentials, server secrets, and service-role keys must remain outside the browser.'],
      ['Your choices', 'Users should be able to access, rename, export, and delete their resumes and request account deletion.'],
      ['Contact', 'Replace this section with your real support/privacy contact before launch.'],
    ],
  },
  terms: {
    label: 'Terms', title: 'Terms of Service',
    intro: 'This is a product-ready draft outline, not legal advice. Have the final text reviewed before publishing.',
    sections: [
      ['Using Resummetry', 'You may use Resummetry to create and manage resumes for lawful personal or professional purposes. You are responsible for the information you submit.'],
      ['AI-assisted features', 'AI suggestions are editing assistance. You remain responsible for reviewing content and ensuring every statement in a resume is accurate and truthful.'],
      ['Availability', 'The service may change, be temporarily unavailable, or contain defects. Production terms should describe support, maintenance, and any service limitations.'],
      ['Content and deletion', 'You retain responsibility for your resume content. Production terms should explain account termination and how document deletion works.'],
      ['Contact', 'Replace this section with your real support contact before launch.'],
    ],
  },
};

export default function LegalPage({ type = 'privacy' }) {
  const page = copy[type] || copy.privacy;
  return (
    <main style={{ minHeight: '100vh', background: '#f7f7f5', color: '#151719' }}>
      <header style={{ padding: '22px 6vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e1e3e4', background: 'rgba(247,247,245,.94)' }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 800, letterSpacing: '-.03em', fontSize: 22 }}>Resummetry</Link>
        <Link to="/" style={{ color: '#626870', textDecoration: 'none', fontWeight: 600 }}>Back home</Link>
      </header>
      <article style={{ width: 'min(900px, 88vw)', margin: '0 auto', padding: '80px 0 110px' }}>
        <p style={{ color: '#087cb8', textTransform: 'uppercase', letterSpacing: '.16em', fontWeight: 800, fontSize: 12 }}>{page.label}</p>
        <h1 style={{ fontSize: 'clamp(44px, 7vw, 78px)', lineHeight: .95, letterSpacing: '-.06em', margin: '16px 0 24px' }}>{page.title}</h1>
        <p style={{ maxWidth: 700, color: '#626870', fontSize: 18, lineHeight: 1.7 }}>{page.intro}</p>
        <div style={{ marginTop: 56, display: 'grid', gap: 30 }}>
          {page.sections.map(([heading, text]) => (
            <section key={heading} style={{ paddingTop: 26, borderTop: '1px solid #dfe2e4' }}>
              <h2 style={{ fontSize: 22, margin: '0 0 10px' }}>{heading}</h2>
              <p style={{ margin: 0, color: '#626870', lineHeight: 1.8 }}>{text}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
