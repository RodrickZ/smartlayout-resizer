import { AspectRatio, ImageSize } from './types';
import { Square, RectangleVertical, RectangleHorizontal, Smartphone, Monitor } from 'lucide-react';

export const ASPECT_RATIOS: { value: AspectRatio; label: string; icon: any; description: string }[] = [
  { value: '1:1', label: 'Square', icon: Square, description: 'Social media posts, avatars' },
  { value: '3:4', label: 'Portrait', icon: RectangleVertical, description: 'Standard photography' },
  { value: '4:3', label: 'Landscape', icon: RectangleHorizontal, description: 'Classic screen' },
  { value: '9:16', label: 'Story', icon: Smartphone, description: 'Mobile full screen' },
  { value: '16:9', label: 'Cinematic', icon: Monitor, description: 'Video thumbnails, desktop' },
];

export const IMAGE_SIZES: { value: ImageSize; label: string; detail: string }[] = [
  { value: '1K', label: 'Standard (1K)', detail: 'Fast generation, good for web' },
  { value: '2K', label: 'High Res (2K)', detail: 'Print quality, detailed view' },
  { value: '4K', label: 'Ultra Res (4K)', detail: 'Maximum detail, pro usage' },
];
