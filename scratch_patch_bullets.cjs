const fs = require('fs');
const path = require('path');

const dir = 'src/components/resume/preview/templates';
const filesToPatch = ['Template4.jsx', 'Template5.jsx', 'Template6.jsx', 'Template7.jsx', 'Template8.jsx', 'Template9.jsx'];

for (const fileName of filesToPatch) {
  const filePath = path.join(dir, fileName);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const caseRegex = /(case\s+[\"']additionalInformation[\"'][\s\S]*?)(?=case\s+[\"'][a-zA-Z]+[\"']|default:|\}$)/;
  
  const match = content.match(caseRegex);
  if (!match) {
    console.log(`Could not find additionalInformation block in ${fileName}`);
    continue;
  }
  
  let block = match[1];
  
  if (block.includes('proj.bullets')) {
      console.log(`${fileName} already patched.`);
      continue;
  }
  
  const mapMatch = block.match(/additionalInformation\.map\(\(([^,]+),\s*([^)]+)\)\s*=>/);
  if (!mapMatch) {
      console.log(`Could not find map variable in ${fileName}`);
      continue;
  }
  const itemVar = mapMatch[1];
  const indexVar = mapMatch[2]; 
  
  const injectionCode = `
                    {Array.isArray(${itemVar}.bullets) && ${itemVar}.bullets.length > 0 && (
                      <ul className="mt-2 list-disc pl-4 text-[0.875em] leading-[1.6]" style={{ color: colors.text }}>
                        {${itemVar}.bullets.map((b, bIndex) => (
                          <li key={bIndex}>
                            <EditableText elementId={\`additionalInformation.\${${indexVar}}.bullets.\${bIndex}\`} value={b} onChange={(v) => update(["additionalInformation", ${indexVar}, "bullets", bIndex], v)} />
                          </li>
                        ))}
                      </ul>
                    )}`;
                    
  // Fix the regex: allow any characters, but stop at /> }
  // We can just match the literal `elementId={\`additionalInformation.\${i}.description\`}`
  // and then `/>}`
  const escapedElementId = `elementId={\`additionalInformation.\\\$\\{${indexVar}\\}\\.description\`}`;
  // Wait, in Template4 it's `elementId={\`additionalInformation.\${i}.description\`}`
  const descRegex = new RegExp(`({${itemVar}\\.description\\s*&&\\s*<EditableText[^>]+elementId={\`additionalInformation\\.\\\$\\{${indexVar}\\}\\.description\`}[\\s\\S]*?/>\\s*})`);
  
  if (block.match(descRegex)) {
      block = block.replace(descRegex, `$1${injectionCode}`);
      content = content.replace(match[1], block);
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`Successfully patched ${fileName}`);
  } else {
      console.log(`Could not find description injection point in ${fileName}`);
  }
}
