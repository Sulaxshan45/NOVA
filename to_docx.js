import fs from 'fs';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true });

const mdContent = fs.readFileSync('C:\\Users\\LOQ\\.gemini\\antigravity-ide\\brain\\3d629894-2a33-44d7-9714-2d4e02deb309\\research_paper.md', 'utf8');
let rawHtml = md.render(mdContent);

// Add width="600" to all img tags to constrain them in Word
rawHtml = rawHtml.replace(/<img /g, '<img width="600" ');

const htmlContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>Research Paper</title>
<style>
  @page {
      size: A4 portrait;
      margin: 1in;
  }
  body { 
      font-family: 'Times New Roman', Times, serif; 
      font-size: 12pt; 
      line-height: 2; 
      margin: 1in; 
  }
  h1 { font-size: 16pt; text-align: center; font-weight: bold; }
  h2 { font-size: 14pt; font-weight: bold; margin-top: 24pt; }
  h3 { font-size: 12pt; font-weight: bold; margin-top: 18pt; }
  img { 
      max-width: 600px; 
      height: auto; 
      display: block;
      margin: 20px auto;
  }
</style>
</head>
<body>
  ${rawHtml}
</body>
</html>
`;

fs.writeFileSync('NOVA_Research_Paper_Formatted.doc', htmlContent);
console.log('Successfully created constrained NOVA_Research_Paper_Formatted.doc');
