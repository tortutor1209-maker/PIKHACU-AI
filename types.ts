
export enum VisualStyle {
  Realistis = 'Realistis',
  Claymations3DPixar = 'Claymations 3D Pixar Style',
  Stylized3DClay = 'Stylized 3D Clay Look (Clay-Inspired Pixar-Style CGI)',
  Render3D = '3D Render (PBR / stylized 3D)',
  Pixar3D = '3D Pixar Style',
  AnimeComic = '2D Anime Comic',
  Lego = 'Lego Style'
}

export enum Language {
  Indonesian = 'Bahasa Indonesia',
  English = 'English'
}

export interface StructuredPrompt {
  subject: string;
  action: string;
  environment: string;
  camera_movement: string;
  lighting: string;
  visual_style_tags: string;
}

export interface Scene {
  number: number;
  narration: string;
  tone: string;
  structuredPrompt: StructuredPrompt;
}

export interface StoryResult {
  title: string;
  numScenes: number;
  visualStyle: string;
  language: string;
  scenes: Scene[];
  tiktokCover: string;
  youtubeCover: string;
  hashtags: string[];
}

export interface StoryRequest {
  title: string;
  numScenes: number;
  visualStyle: VisualStyle;
  language: Language;
}
