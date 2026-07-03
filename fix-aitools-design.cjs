const fs = require('fs');
let content = fs.readFileSync('src/pages/AITools.tsx', 'utf8');

// Replace the resultsRef wrapper
content = content.replace(
  /<div ref=\{resultsRef\} className="bg-white dark:bg-\[#050816\]\/80 border border-gray-200 dark:border-white\/10 rounded-2xl overflow-hidden animate-fade-in shadow-2xl backdrop-blur-xl ring-1 ring-white\/5">/,
  `<div ref={resultsRef} className="relative rounded-2xl animate-fade-in shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/30 via-transparent to-brand-secondary/30 rounded-2xl"></div>
                <div className="absolute inset-[1px] bg-white dark:bg-[#050816]/90 backdrop-blur-3xl rounded-[15px] z-0"></div>
                <div className="relative z-10 rounded-2xl overflow-hidden">`
);

// close the div
content = content.replace(
  /                  \}\)\}\n                <\/div>\n\n              <\/div>/,
  `                  }))}
                </div>
                </div>
              </div>`
);

fs.writeFileSync('src/pages/AITools.tsx', content);
