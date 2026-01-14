
export enum VisualStyle {
  Animasi2D = 'Animasi 2D (Dua Dimensi)',
  Animasi3D = 'Animasi 3D (Tiga Dimensi)',
  StopMotion = 'Animasi Stop Motion',
  MotionGraphics = 'Motion Graphics',
  Claymation = 'Animasi Clay (Claymation)',
  Realistis = 'Realistis'
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
