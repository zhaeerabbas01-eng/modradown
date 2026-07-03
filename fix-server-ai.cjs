const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `
        const schema = {
          type: "OBJECT",
          properties: {
            sections: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  title: { type: "STRING" },
                  items: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        title: { type: "STRING" },
                        content: { type: "STRING" }
                      },
                      required: ["content"]
                    }
                  }
                },
                required: ["title", "items"]
              }
            }
          },
          required: ["sections"]
        };

        const modelRes = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: finalPrompt,
          config: {
            systemInstruction: systemPrompt + " MUST output JSON matching the required schema.",
            temperature: 0.8,
            responseMimeType: "application/json",
            responseSchema: schema
          },
        });

        responseText = modelRes.text || "{}";
      } else {
        // Fallback generator for a key-less preview environment
        const fallbackObj = {
          sections: [
            {
              title: "Preview Mode Hashtags",
              items: [
                { content: "#" + prompt.replace(/\\s+/g, "") + "Creator" },
                { content: "#SocialTrend2026" },
                { content: "#ViralCreator" },
                { content: "#MediaTools" }
              ]
            },
            {
              title: "Strategy",
              items: [
                { title: "Core Strategy", content: "Optimizing content with high-intent keywords relative to your target query." },
                { title: "Actionable", content: "Post during high-activity hours (11AM - 2PM, and 6PM - 8PM local time)." }
              ]
            }
          ]
        };
        responseText = JSON.stringify(fallbackObj);
`;

content = content.replace(
/const modelRes = await ai\.models\.generateContent\(\{[\s\S]*?responseText = `\[PREVIEW MODE - GEMINI KEY ABSENT\][\s\S]*?\(Configure GEMINI_API_KEY inside Settings > Secrets to unlock live interactive smart generation!\)\`;/,
replacement.trim()
);

fs.writeFileSync('server.ts', content);
