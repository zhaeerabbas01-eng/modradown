const fs = require('fs');
let content = fs.readFileSync('src/pages/PlatformDownloader.tsx', 'utf8');

// Generate schema object based on the platform config
content = content.replace(
  /canonicalUrl=\{\`https:\/\/modradown\.com\/\$\{platformSlug\}\`\}/,
  `canonicalUrl={\`https://modradown.com/\${platformSlug}\`}
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": \`\${config.name} Downloader\`,
          "operatingSystem": "Any",
          "applicationCategory": "MultimediaApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}`
);

fs.writeFileSync('src/pages/PlatformDownloader.tsx', content);
