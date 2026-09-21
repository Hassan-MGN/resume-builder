import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const templateDir = path.join(root, 'src/components/resume/preview/templates');
const expected = Array.from({ length: 11 }, (_, i) => `Template${i + 1}.jsx`);
const failures = [];
const globalCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');

for (const name of expected) {
  const file = path.join(templateDir, name);
  if (!fs.existsSync(file)) {
    failures.push(`${name}: missing`);
    continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  if (/(linkedin|website|link)/.test(text) && !/break-all|break-words|overflow-wrap/.test(text) && !/overflow-wrap:\s*anywhere/.test(globalCss)) {
    failures.push(`${name}: no long-link wrapping strategy found`);
  }
}

const preview = fs.readFileSync(path.join(root, 'src/components/resume/preview/Preview.jsx'), 'utf8');
for (const marker of ['resume-preview', 'resume-mobile-canvas', 'GlobalFontSizeControls', 'generateResumePdf']) {
  if (!preview.includes(marker)) failures.push(`Preview.jsx: missing ${marker}`);
}

for (const marker of ['@media print', '.resume-page', '.resume-entry-block', '.resume-section-heading', 'overflow-wrap: anywhere']) {
  if (!globalCss.includes(marker)) failures.push(`index.css: missing ${marker}`);
}

if (failures.length) {
  console.error('Template QA static checks failed:\n' + failures.map((x) => `- ${x}`).join('\n'));
  process.exit(1);
}

console.log(`Template QA static checks passed for ${expected.length} templates.`);
