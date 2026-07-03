const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/if \(cobaltData && \(cobaltData.url \|\| cobaltData.picker \|\| cobaltData.status === "redirect" \|\| cobaltData.status === "stream" \|\| cobaltData.status === "success" \|\| cobaltData.status === "picker"\)\) \{[\s\S]*?picker: \[\{ url: cobaltData.url, quality: 'Auto Best' \}\]\s*\}\s*;/g, `if (cobaltData && (cobaltData.url || cobaltData.picker || cobaltData.status === "redirect" || cobaltData.status === "stream" || cobaltData.status === "success" || cobaltData.status === "picker")) {
                 let bestUrl = cobaltData.url || (cobaltData.picker && cobaltData.picker[0]?.url) || "";
                 let picker = cobaltData.picker ? cobaltData.picker.map((p) => ({ url: p.url, quality: 'Media' })) : [{ url: bestUrl, quality: 'Auto Best' }];
                 mediaData = {
                     title: "Extracted Media",
                     url: bestUrl,
                     tunnel: bestUrl,
                     thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=600",
                     description: "Extracted via Cobalt API",
                     duration: "Unknown",
                     viewCount: "N/A",
                     likeCount: "N/A",
                     picker: picker
                 };`);

fs.writeFileSync('server.ts', code);
