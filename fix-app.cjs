const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
content = content.replace(
  /import Home from "\.\/pages\/Home";/,
  `import Home from "./pages/Home";\nimport PlatformDownloader from "./pages/PlatformDownloader";`
);

// Add route
content = content.replace(
  /<Route path="\/" element=\{<Home \/>\} \/>/,
  `<Route path="/" element={<Home />} />
          <Route path="/:platformSlug" element={<PlatformDownloader />} />`
);

fs.writeFileSync('src/App.tsx', content);
