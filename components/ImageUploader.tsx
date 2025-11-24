import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { ImageState } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface ImageUploaderProps {
  imageState: ImageState;
  onImageChange: (newState: ImageState) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageState, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    try {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      const base64 = await fileToBase64(file);
      
      onImageChange({
        file,
        previewUrl,
        base64,
        mimeType: file.type
      });
    } catch (error) {
      console.error("Error processing file", error);
    }
  };

  const clearImage = () => {
    if (imageState.previewUrl) {
      URL.revokeObjectURL(imageState.previewUrl);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange({
      file: null,
      previewUrl: null,
      base64: null,
      mimeType: null
    });
  };

  const triggerUpload = () => fileInputRef.current?.click();

  if (imageState.previewUrl) {
    return (
      <div className="relative group w-full h-full min-h-[300px] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-700 flex items-center justify-center shadow-inner">
        <img 
          src={imageState.previewUrl} 
          alt="Original" 
          className="max-h-full max-w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <button 
          onClick={clearImage}
          className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 p-2 rounded-full shadow-lg border border-zinc-600 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4 right-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="inline-block bg-black/70 text-lime-400 border border-lime-400/30 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                Original Image
            </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={triggerUpload}
      className="w-full h-full min-h-[300px] bg-zinc-900/50 border-2 border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-lime-500/50 hover:bg-zinc-900 transition-all duration-300 group p-8"
    >
      <div className="w-16 h-16 bg-zinc-800 text-zinc-500 group-hover:text-lime-400 group-hover:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 border border-zinc-700 group-hover:border-lime-400/30 shadow-lg">
        <Upload className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-zinc-100 mb-2">Upload Reference Image</h3>
      <p className="text-zinc-500 text-center max-w-xs text-sm group-hover:text-zinc-400 transition-colors">
        Drag & drop or click to upload. 
        <br/>Supports JPG, PNG, WEBP.
      </p>
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleFileChange}
      />
    </div>
  );
};