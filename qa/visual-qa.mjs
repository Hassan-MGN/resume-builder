import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const output = path.resolve(process.env.QA_OUTPUT || 'qa/screenshots');
fs.mkdirSync(output, { recursive: true });

const templateNames = [
  'Professional', 'Modern', 'Minimal', 'Executive', 'Corporate', 'Strategic',
  'CleanTech', 'Contemporary', 'Elegant', 'Refined', 'Classic',
];

const cases = [
  ['landing-desktop', '/', { width: 1440, height: 1000 }],
  ['landing-mobile', '/', { width: 390, height: 844 }],
  ['dashboard-desktop', '/dashboard', { width: 1440, height: 1000 }],
  ['builder-mobile', '/builder/new?template=Modern', { width: 390, height: 844 }],
  ['builder-tablet', '/builder/new?template=Modern', { width: 768, height: 1024 }],
  ['templates-mobile', '/templates', { width: 390, height: 844 }],
  ['profile-mobile', '/profile', { width: 390, height: 844 }],
  ...templateNames.map((name) => [`template-${name.toLowerCase()}`, `/builder/new?template=${encodeURIComponent(name)}`, { width: 1440, height: 1000 }]),
];

const stressResume = {
  personal: {
    fullname: 'Alexandria Montgomery-Wellington',
    email: 'alexandria.montgomery.wellington@very-long-domain-example.co',
    phone: '+92 300 1234567', location: 'Islamabad, Pakistan',
    linkedin: 'https://www.linkedin.com/in/alexandria-montgomery-wellington',
    website: 'https://alexandria-montgomery-wellington.example.com/portfolio/projects',
    photo: '', title: 'Senior Product Designer & Design Systems Lead',
  },
  summary: 'Product designer with 9+ years building enterprise platforms, design systems, accessible workflows, and measurable product experiences across complex organizations. Experienced partnering with engineering, research, analytics, and executive leadership.',
  experience: Array.from({ length: 3 }, (_, i) => ({
    company: ['Northstar Technologies International', 'Blue Orchard Digital Transformation Group', 'Crescent Peak Labs'][i],
    position: ['Senior Product Designer & Design Systems Lead', 'Product Designer / UX Research Partner', 'UX Designer & Frontend Prototyping Specialist'][i],
    startDate: `${2019 - i * 3}-01`, endDate: i === 0 ? 'Present' : `${2021 - i * 2}-12`,
    description: `Led cross-functional initiatives from discovery through delivery. Improved product adoption, reduced task time, documented reusable patterns, mentored designers, and collaborated closely with engineering on accessible responsive interfaces.\n• Built and maintained a scalable design system across web applications.\n• Partnered with product and engineering to prioritize roadmap opportunities using research and analytics.\n• Delivered measurable improvements to activation, retention, and workflow completion.`,
  })),
  education: [
    { institution: 'National University of Sciences and Technology', degree: 'Bachelors in Computer Science & Human-Computer Interaction', startDate: '2013', endDate: '2017', description: 'Capstone on accessible enterprise workflow design.' },
    { institution: 'Institute of Digital Product Leadership', degree: 'Professional Certificate in Product Strategy', startDate: '2020', endDate: '2021', description: 'Product discovery, experimentation, and strategic prioritization.' },
  ],
  skills: ['Product Design','UX Research','Design Systems','Accessibility','Figma','Prototyping','Information Architecture','Responsive Design','Usability Testing','Stakeholder Management','Analytics','HTML/CSS','React'],
  coreSkills: ['Systems Thinking','Product Strategy','Cross-functional Leadership','Design Critique'],
  keyAchievements: ['Reduced onboarding completion time by 28% through workflow redesign','Introduced a shared design system used by 7 product teams','Mentored 4 designers into senior-level roles'],
  certificates: [
    { name: 'Certified Accessibility Specialist', issuer: 'International Accessibility Association', date: '2024' },
    { name: 'Advanced Product Strategy', issuer: 'Digital Product Institute', date: '2023' },
  ],
  languages: [{ language: 'English', proficiency: 'Fluent' }, { language: 'Urdu', proficiency: 'Native' }, { language: 'German', proficiency: 'Intermediate' }],
  hobbies: ['Photography', 'Typography', 'Travel Journaling', 'Open Source'],
  projects: [{ name: 'Enterprise Design System', description: 'A reusable system of tokens, components, patterns, guidelines, and accessibility standards adopted across multiple teams.', technologies: 'Figma, React, Storybook, TypeScript', link: 'https://github.com/example/enterprise-design-system-documentation' }],
  additionalInformation: [{ heading: 'Selected Talks', content: 'Designing for complexity; Scaling product design without scaling inconsistency.' }],
  layout: { sectionOrder: ['personal','summary','experience','projects','education','skills','coreSkills','keyAchievements','certificates','languages','hobbies','additionalInformation'], fontFamily: 'Inter', fontSize: 100, lineHeight: 1.5, sectionSpacing: 24, pageMargin: 40 },
};

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const context = process.env.STORAGE_STATE ? await browser.newContext({ storageState: process.env.STORAGE_STATE }) : await browser.newContext();
const page = await context.newPage();
const failures = [];

await page.goto(`${baseURL}/`, { waitUntil: 'domcontentloaded' }).catch(() => null);
await page.waitForLoadState('networkidle').catch(() => null);

const authUserId = await page.evaluate(() => {
  for (const key of Object.keys(localStorage)) {
    if (!key.includes('-auth-token')) continue;
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      const user = parsed?.user || parsed?.currentSession?.user || parsed?.session?.user || parsed?.currentSession?.user?.id;
      const id = typeof user === 'string' ? user : user?.id;
      if (id) return id;
    } catch { /* ignore unrelated localStorage values */ }
  }
  return null;
}).catch(() => null);

if (authUserId) {
  await page.evaluate(({ resume, userId }) => {
    const now = new Date().toISOString();
    localStorage.setItem(`resumepro-drafts:${userId}`, JSON.stringify([{ id: 'qa-stress-draft', title: 'Stress Test Resume', template: 'Modern', mode: 'scratch', source: 'qa', resume, createdAt: now, updatedAt: now }]));
    localStorage.setItem(`resumepro-current-draft:${userId}`, 'qa-stress-draft');
  }, { resume: stressResume, userId: authUserId });
} else {
  console.log('Visual QA: no authenticated storage state detected; protected routes will be skipped to avoid false positives.');
}

for (const [name, route, viewport] of cases) {
  const protectedRoute = ['/dashboard', '/builder', '/templates', '/profile'].some((prefix) => route.startsWith(prefix));
  if (protectedRoute && !authUserId) continue;

  await page.setViewportSize(viewport);
  const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'networkidle' }).catch(() => null);
  if (!response || response.status() >= 500) {
    failures.push(`${name}: route did not load`);
    continue;
  }

  const expectedPath = new URL(route, baseURL).pathname;
  const actualPath = new URL(page.url()).pathname;
  if (protectedRoute && actualPath !== expectedPath) {
    failures.push(`${name}: redirected from ${expectedPath} to ${actualPath}; authenticated QA state is invalid`);
    continue;
  }

  if (route.startsWith('/builder')) {
    const builderReady = await page.locator('body').evaluate((body) => body.innerText.includes('Resume') || body.innerText.includes('How would you like to begin?')).catch(() => false);
    if (!builderReady) failures.push(`${name}: builder UI did not render expected content`);
  }

  const overflow = await page.evaluate(() => ({
    body: document.body.scrollWidth > document.documentElement.clientWidth + 1,
    document: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  if (viewport.width <= 768 && (overflow.body || overflow.document)) failures.push(`${name}: horizontal document overflow at ${viewport.width}px`);

  await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
}

await context.close();
await browser.close();

if (failures.length) {
  console.error('Visual QA failures:\n' + failures.map((x) => `- ${x}`).join('\n'));
  process.exit(1);
}
console.log(`Visual QA captured ${cases.length} route/viewport screenshots in ${output}`);
