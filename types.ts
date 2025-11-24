export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
  mimeType: string | null;
}

export interface GeneratedResult {
  imageUrl: string;
  aspectRatio: AspectRatio;
  size: ImageSize;
}

// Augment the global AIStudio interface. The 'aistudio' property on Window is already declared in the environment with type AIStudio.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}