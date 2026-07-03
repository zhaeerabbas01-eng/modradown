import { Handler } from '@netlify/functions';
import { GoogleGenAI } from "@google/genai";

export const handler: Handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { tool, prompt, options, apiKey } = body;

    if (!tool || !prompt) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: "Tool and Prompt are required fields." })
      };
    }

    let aiClient: any = null;
    const keyToUse = apiKey || process.env.GEMINI_API_KEY;
    
    if (keyToUse) {
      aiClient = new GoogleGenAI({
        apiKey: keyToUse,
        httpOptions: {
          headers: {
            'User-Agent': "aistudio-build",
          },
        },
      });
    }

    let responseText = "";

    if (aiClient) {
      // Construct the prompt based on the specific tool
      let systemPrompt = "You are a professional social media marketing copywriter and content growth SEO consultant.";
      let finalPrompt = "";

      if (tool === "hashtag") {
        systemPrompt += " Generate 15-20 highly engaging visual tags, categorizing them by Top, Medium, and Niche size.";
        finalPrompt = `Generate optimized trending social media hashtags for: "${prompt}". Focus Platform: ${options?.platform || 'Instagram'}.`;
      } else if (tool === "caption") {
        systemPrompt += " Write a compelling caption including hook lines, call to actions, and custom formatting spacing.";
        finalPrompt = `Write an optimized caption for: "${prompt}". Tone: ${options?.tone || 'Professional'}, Platform: ${options?.platform || 'TikTok'}.`;
      } else if (tool === "title") {
        systemPrompt += " Produce 10 distinct clicking hooks and high CTR headline variations.";
        finalPrompt = `Generate video titles and hooks for the topic: "${prompt}". Video Goal: ${options?.goal || 'Viral View count'}.`;
      } else if (tool === "bio") {
        systemPrompt += " Create 3 completely distinct bio concepts with line breaks and custom emojis.";
        finalPrompt = `Create a social media profile biography for: "${prompt}". Style: ${options?.style || 'Creative'}, Platform: ${options?.platform || 'Instagram'}.`;
      } else if (tool === "idea") {
        systemPrompt += " Suggest 5 unique viral video concepts with outline, specific hook, and sound advice.";
        finalPrompt = `Analyze and list complete content idea outlines for: "${prompt}". Niche Category: ${options?.category || 'General Creator'}.`;
      } else if (tool === "tags") {
        systemPrompt += " Produce active tags formatted cleanly as a comma-separated list and direct checklist.";
        finalPrompt = `Generate search tags and key terms for YouTube upload: "${prompt}". Niche focus: ${options?.audience || 'General Discoverability'}.`;
      }

      const modelRes = await aiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: finalPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
        },
      });

      responseText = modelRes.text || "No response received from AI model.";
    } else {
      // Fallback generator for a key-less preview environment
      responseText = `[PREVIEW MODE - GEMINI KEY ABSENT]
Here is a high-quality preview response generated based on standard digital templates for: "${prompt}"

1. Core Strategy: Optimizing content with high-intent keywords relative to your target query.
2. Formatted Copy Proposal:
- "#${prompt.replace(/\s+/g, "")}Creator" 
- "#SocialTrend2026"
- "#ViralCreator"
- "#MediaTools"

3. Actionable Checklist: 
- Post during high-activity hours (11AM - 2PM, and 6PM - 8PM local time).
- Spark debate in the comments with binary options.
- Maintain consistent visual loops.

(Configure GEMINI_API_KEY inside Settings > Secrets to unlock live interactive smart generation!)`;
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ output: responseText })
    };

  } catch (e: any) {
    console.error("AI Generation endpoint crashed", e);
    let errMsg = e.message || "An error occurred during AI generation";
    if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("RESOURCE_EXHAUSTED")) {
        errMsg = "AI Generation quota exceeded. Please try again later. Wait about a minute for limits to refresh.";
    }
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: errMsg })
    };
  }
};
