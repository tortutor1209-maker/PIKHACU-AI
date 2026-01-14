
import { GoogleGenAI, Type } from "@google/genai";
import { StoryRequest, StoryResult } from "../types";

// Always use new GoogleGenAI({apiKey: process.env.API_KEY}) directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStoryContent = async (req: StoryRequest): Promise<StoryResult> => {
  const { title, numScenes, visualStyle, language } = req;

  const systemInstruction = `
    You are PIKHACU.AI ULTIMATE v4, a professional cinematic storytelling architect.
    
    BRAIN RULES:
    1. NARRATION:
       - MUST be educational, dense, and meaningful.
       - ONLY Scene 1 MUST start with: "Apakah kamu tahu..." (ID) or "Did you know..." (EN).
       - Each narration: 2-4 sentences explaining facts.
    
    2. STRUCTURED JSON PROMPTING (CRITICAL):
       - For each scene, you MUST generate a 'structuredPrompt' object.
       - 'subject': Detailed character/object description. Keep features IDENTICAL across all scenes for consistency (e.g., "A 7-year-old boy named Budi, wearing a red hoodie, messy black hair, bright eyes").
       - 'action': Specific physical movement or expression optimized for Video AI (Kling/Runway).
       - 'environment': Setting details, background facts.
       - 'camera_movement': Cinematic camera terms (Dolly In, Pan, Orbit, Drone Shot).
       - 'lighting': Atmospheric lighting (Golden hour, Cyberpunk neon, Soft cinematic rim light).
       - 'visual_style_tags': Keywords specific to the chosen visual style. 
         (Example for 'Animasi 2D': flat colors, cel shaded, line art. 
          Example for 'Animasi 3D': Pixar-style, highly detailed textures, PBR. 
          Example for 'Stop Motion': tactile texture, slight frame jitter, physical material look.
          Example for 'Realistis': photorealistic, hyper-detailed, 8k, cinematic film.)

    3. OUTPUT FORMAT:
       - Strict JSON output.
       - Include TikTok Cover (9:16) and YouTube Cover (16:9) prompts.
       - Generate 5 specific hashtags: #TahuGakSih, #[VisualStyle]Story, #[Language]Edition, #[Topic], #EdukasiViral.
  `;

  const prompt = `
    Generate a high-quality cinematic storytelling script:
    Title: "${title}"
    Total Scenes: ${numScenes}
    Visual Aesthetic: ${visualStyle}
    Narration Language: ${language}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction,
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
                narration: { type: Type.STRING },
                tone: { type: Type.STRING },
                structuredPrompt: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    action: { type: Type.STRING },
                    environment: { type: Type.STRING },
                    camera_movement: { type: Type.STRING },
                    lighting: { type: Type.STRING },
                    visual_style_tags: { type: Type.STRING }
                  },
                  required: ['subject', 'action', 'environment', 'camera_movement', 'lighting', 'visual_style_tags']
                }
              },
              required: ['number', 'narration', 'tone', 'structuredPrompt']
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

  // Correctly accessing the text property on the response object (do not call as a method).
  const result = JSON.parse(response.text || '{}');
  return result as StoryResult;
};
