import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { paginateResume } from '../src/utils/resumePagination.js';

const root = path.resolve(process.cwd());
const failures = [];
const templates = ['Professional', 'Modern', 'Minimal', 'Executive', 'Corporate', 'Strategic', 'CleanTech', 'Contemporary', 'Elegant', 'Refined', 'Classic'];

const stressResume = {
  summary: 'A professional summary '.repeat(120),
  experience: Array.from({ length: 8 }, (_, i) => ({
    company: `Company ${i}`,
    position: `Senior Role ${i}`,
    startDate: '2020',
    endDate: 'Present',
    description: 'Detailed work context '.repeat(65),
    responsibilities: Array.from({ length: 12 }, (_, j) => `Responsibility ${j} ${'detail '.repeat(16)}`),
  })),
  education: Array.from({ length: 5 }, (_, i) => ({ institution: `University ${i}`, degree: 'Degree in Something', startDate: '2010', endDate: '2014', description: 'Academic detail '.repeat(24) })),
  skills: Array.from({ length: 35 }, (_, i) => `Skill ${i}`),
  coreSkills: Array.from({ length: 20 }, (_, i) => `Core ${i}`),
  keyAchievements: Array.from({ length: 18 }, (_, i) => `Achievement ${i} ${'x'.repeat(90)}`),
  certificates: Array.from({ length: 12 }, (_, i) => ({ name: `Certificate ${i}`, issuer: 'Issuer', issueDate: '2024', expiryDate: '2026', credentialId: `ID-${i}`, credentialUrl: `https://example.com/c/${i}` })),
  languages: Array.from({ length: 10 }, (_, i) => ({ language: `Language ${i}`, proficiency: 'Fluent' })),
  hobbies: Array.from({ length: 12 }, (_, i) => `Hobby ${i}`),
  projects: Array.from({ length: 10 }, (_, i) => ({ name: `Project ${i}`, description: 'Project detail '.repeat(45), technologies: 'React, TypeScript, Node.js', link: `https://example.com/p/${i}` })),
  additionalInformation: Array.from({ length: 10 }, (_, i) => ({ heading: `Block ${i}`, content: 'Additional information '.repeat(40), bullets: ['Bullet '.repeat(24), 'Another '.repeat(24)] })),
};

for (const template of templates) {
  try {
    const pages = paginateResume({ resume: stressResume, layout: { fontSize: 100 }, template });
    assert.ok(pages.length > 0, `${template}: no pages generated`);
    assert.ok(pages.length < 200, `${template}: excessive page count (${pages.length})`);
    assert.equal(pages.filter((page) => !page.sections.length).length, 0, `${template}: empty page emitted`);

    const represented = new Set();
    for (const page of pages) {
      for (const section of page.sections) {
        const values = page.pageData?.[section];
        if (!Array.isArray(values)) continue;
        for (const item of values) {
          if (Number.isInteger(item?._globalIndex)) represented.add(`${section}:${item._globalIndex}`);
        }
      }
    }
    for (const section of ['experience', 'education', 'projects', 'certificates']) {
      const source = Array.isArray(stressResume[section]) ? stressResume[section] : [];
      for (let i = 0; i < source.length; i += 1) {
        assert.ok(represented.has(`${section}:${i}`), `${template}: lost ${section}[${i}] during pagination`);
      }
    }
  } catch (error) {
    failures.push(error.message);
  }
}

const splitResume = {
  summary: 'A concise professional summary that consumes most of the first-page body before experience begins.',
  experience: [{
    company: 'Tafsol Technology Pvt. Ltd.',
    position: 'Full-Stack Web Developer',
    startDate: 'January 2024',
    endDate: 'Present',
    description: 'Production web development across WordPress, Shopify, Laravel, React.js, and Next.js.',
    responsibilities: Array.from({ length: 9 }, (_, i) => `Responsibility ${i + 1}: ${'Detailed delivery work '.repeat(10)}`),
  }],
  skills: Array.from({ length: 16 }, (_, i) => `Skill ${i}`),
};

for (const template of ['Professional', 'Modern', 'Strategic']) {
  const pages = paginateResume({ resume: { ...splitResume, experience: [{ ...splitResume.experience[0], responsibilities: Array.from({ length: 18 }, (_, i) => `Responsibility ${i + 1}: ${'Detailed delivery work '.repeat(14)}`) }] }, layout: { fontSize: 100 }, template });
  assert.ok(pages.length >= 2, `${template}: split scenario should create continuation page`);
  const experiencePages = pages.filter((page) => Array.isArray(page.pageData?.experience) && page.pageData.experience.length);
  assert.ok(experiencePages.length >= 2, `${template}: experience should split across pages instead of moving the whole entry`);
  assert.ok(experiencePages.some((page) => page.continuationSections?.experience), `${template}: continuation marker missing for split experience`);
}

const pdfSource = fs.readFileSync(path.join(root, 'src/utils/ResumePdfDocument.jsx'), 'utf8');
for (const field of ['issueDate', 'expiryDate', 'credentialId', 'credentialUrl', 'proficiency']) {
  if (!pdfSource.includes(field)) failures.push(`PDF renderer missing field mapping: ${field}`);
}
for (const template of templates) {
  if (!pdfSource.includes(`${template}:`)) failures.push(`PDF template registry missing ${template}`);
}

const builderSource = fs.readFileSync(path.join(root, 'src/components/resume/Builder.jsx'), 'utf8');
if (!builderSource.includes('const normalizeTemplateId')) failures.push('Builder template normalization missing');
if (builderSource.includes('application/msword')) failures.push('Builder still advertises legacy .doc MIME type');

const telemetrySource = fs.readFileSync(path.join(root, 'src/utils/telemetry.js'), 'utf8');
if (telemetrySource.includes('window.location.href')) failures.push('Telemetry still sends the full URL');

const apiSource = fs.readFileSync(path.join(root, 'api/ai.js'), 'utf8');
if (apiSource.includes('contents: body.prompt')) failures.push('AI API still trusts client prompt directly');
if (apiSource.includes('responseSchema: body')) failures.push('AI API still accepts client response schemas');
if (!apiSource.includes('consume_ai_usage')) failures.push('AI API does not use durable quota RPC');

const sqlSource = fs.readFileSync(path.join(root, 'supabase/resume_documents.sql'), 'utf8');
for (const marker of ['revision bigint', 'deleted_at timestamptz', 'consume_ai_usage', 'grant execute on function public.consume_ai_usage']) {
  if (!sqlSource.includes(marker)) failures.push(`SQL hardening missing: ${marker}`);
}

const ignoreSource = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
if (ignoreSource.includes('package-lock.json')) failures.push('.gitignore still ignores package-lock.json');
if (!ignoreSource.includes('!.env.example')) failures.push('.gitignore does not preserve .env.example');

if (failures.length) {
  console.error('Regression QA failures:\n' + failures.map((x) => `- ${x}`).join('\n'));
  process.exit(1);
}

console.log(`Regression QA passed: ${templates.length} templates, pagination/data-preservation checks, PDF mappings, auth/AI hardening, telemetry, SQL, and repo configuration.`);
