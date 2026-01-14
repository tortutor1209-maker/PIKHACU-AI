
import { GoogleGenAI, Type } from "@google/genai";
import { StoryRequest, StoryResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStoryContent = async (req: StoryRequest): Promise<StoryResult> => {
  const { title, numScenes, visualStyle, language } = req;

  const prompt = `
    Generate a cinematic educational storytelling script for the title: "${title}".
    
    Total Scenes: ${numScenes}
    Visual Style: ${visualStyle}
    Language: ${language}

    RULES:
    1. Narration should NOT be limited by duration.
    2. Each scene must contain educational, dense, and meaningful narration.
    3. EVERY NARRATION MUST START WITH: "Apakah kamu tahu..." (Indonesian) or "Did you know..." (English).
    4. Each scene narration should be 2-4 sentences long.
    5. Character appearance must be consistent across all scenes.
    6. Output must include:
       - Scene details (Narration, Emotional Tone, Establishing Shot Prompt, Detail/Action Shot Prompt)
       - TikTok Cover Prompt
       - YouTube Cover Prompt
       - 5 Viral Hashtags
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          numScenes: { type: Type.NUMBER },
          visualStyle: { type: Type.STRING },
          language: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.NUMBER },
                narration: { type: Type.STRING, description: 'Must start with "Apakah kamu tahu..." or "Did you know..."' },
                tone: { type: Type.STRING },
                prompt1: { type: Type.STRING, description: 'Establishing Shot prompt' },
                prompt2: { type: Type.STRING, description: 'Detail/Action Shot prompt' }
              },
              required: ['number', 'narration', 'tone', 'prompt1', 'prompt2']
            }
          },
          tiktokCover: { type: Type.STRING },
          youtubeCover: { type: Type.STRING },
          hashtags: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ['title', 'numScenes', 'visualStyle', 'language', 'scenes', 'tiktokCover', 'youtubeCover', 'hashtags']
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  return result as StoryResult;
};
