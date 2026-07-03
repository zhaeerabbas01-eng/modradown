const fs = require('fs');
let content = fs.readFileSync('src/components/AdPlacement.tsx', 'utf8');

content = content.replace(
  /<div className="w-full mb-6 flex flex-col items-center justify-center overflow-hidden">/,
  `<div className="w-full flex flex-col items-center justify-center overflow-hidden">`
);

content = content.replace(
  /<div className="mb-12">/,
  `<div className="mb-8">`
);

fs.writeFileSync('src/components/AdPlacement.tsx', content);

let contentAITools = fs.readFileSync('src/pages/AITools.tsx', 'utf8');
contentAITools = contentAITools.replace(
  /<div className="mb-12">/,
  `<div className="mb-8">`
);
fs.writeFileSync('src/pages/AITools.tsx', contentAITools);

let contentHome = fs.readFileSync('src/pages/Home.tsx', 'utf8');
contentHome = contentHome.replace(
  /<div className="mb-12">/,
  `<div className="mb-8">`
);
fs.writeFileSync('src/pages/Home.tsx', contentHome);

