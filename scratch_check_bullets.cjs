const fs = require('fs');
const path = require('path');

const dir = 'src/components/resume/preview/templates';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx')).map(f => path.join(dir, f));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  const caseRegex = /case\s+[\"']additionalInformation[\"'][\s\S]*?(?=case\s+[\"'][a-zA-Z]+[\"']|default:|\}$)/;
  const match = content.match(caseRegex);
  
  if (match) {
    if (!match[0].includes('bullets.map') && !match[0].includes('bullets')) {
      console.log('Missing bullets in', path.basename(file));
      // Let's also print the map variable
      const mapMatch = match[0].match(/additionalInformation\.map\(\(([^,]+),\s*([^)]+)\)\s*=>/);
      if (mapMatch) {
          console.log(`  Variable: ${mapMatch[1]}, Index: ${mapMatch[2]}`);
      }
    }
  }
}
