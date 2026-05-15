const fs = require('fs');
const path = require('path');

function fixComponent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Supprimer styleUrls
  content = content.replace(/styleUrls:\s*\[[^\]]*\]\s*,?\s*/g, '');
  content = content.replace(/styleUrl:\s*['"][^'"]*['"]\s*,?\s*/g, '');
  
  // Ajouter styles: [] si le décorateur n'en a pas
  if (content.includes('@Component') && !content.includes('styles:')) {
    content = content.replace(
      /(@Component\(\{\s*)([^}]*)(\}\))/,
      (match, open, body, close) => {
        if (!body.includes('styles:')) {
          return `${open}${body}  styles: []\n${close}`;
        }
        return match;
      }
    );
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed: ${filePath}`);
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.ts') && file !== 'main.ts' && !file.includes('.spec')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('@Component') && (content.includes('styleUrl') || content.includes('styleUrls'))) {
        fixComponent(filePath);
      }
    }
  }
}

walkDir('src/app');
console.log('✅ Tous les composants ont été corrigés');
