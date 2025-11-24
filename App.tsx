import React, { useState, useEffect } from 'react';
import { Sparkles, Layout, Settings, AlertTriangle, Key } from 'lucide-react';
import { ImageUploader } from './components/ImageUploader';
import { ResultViewer } from './components/ResultViewer';
import { Button } from './components/Button';
import { AspectRatio, ImageSize, ImageState, GeneratedResult } from './types';
import { ASPECT_RATIOS, IMAGE_SIZES } from './constants';
import { generateResizedLayout } from './services/geminiService';

const App: React.FC = () => {
  const [imageState, setImageState] = useState<ImageState>({
    file: null,
    previewUrl: null,
    base64: null,
    mimeType: null,
  });

  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('1:1');
  const [selectedSize, setSelectedSize] = useState<ImageSize>('1K');
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!imageState.base64 || !imageState.mimeType) {
      setError("Please upload an image first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null); // Clear previous result to show loading state

    try {
      // Create a fresh client and call API
      const generatedImageUrl = await generateResizedLayout(
        imageState.base64,
        imageState.mimeType,
        selectedRatio,
        selectedSize,
        prompt
      );

      setResult({
        imageUrl: generatedImageUrl,
        aspectRatio: selectedRatio,
        size: selectedSize,
      });
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };



  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center text-black shadow-[0_0_10px_rgba(163,230,53,0.3)]">
              <Layout className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">SmartLayout</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-zinc-900 text-lime-400 px-3 py-1.5 rounded-full border border-zinc-700">
              <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse shadow-[0_0_5px_#84cc16]"></span>
              Nano Banana Pro Active
            </div>
            <Button variant="ghost" size="sm" onClick={() => window.open('https://ai.google.dev', '_blank')}>
              API Docs
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-900/20 border border-red-900/50 rounded-lg p-4 flex items-start gap-3 text-red-300 animate-in slide-in-from-top-2">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1">
              <p className="font-medium text-red-200">Error</p>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-200"><span className="sr-only">Dismiss</span>×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN: Controls & Input */}
          <div className="lg:col-span-5 space-y-8">

            {/* 1. Upload */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-zinc-800 text-lime-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-zinc-700">1</span>
                <h2 className="text-lg font-semibold text-zinc-100">Input Image</h2>
              </div>
              <ImageUploader imageState={imageState} onImageChange={setImageState} />
            </section>

            {/* 2. Settings */}
            <section className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="bg-zinc-800 text-lime-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-zinc-700">2</span>
                <h2 className="text-lg font-semibold text-zinc-100">Configuration</h2>
              </div>

              {/* Aspect Ratio */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-lime-400" /> Target Aspect Ratio
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {ASPECT_RATIOS.map((ratio) => {
                    const Icon = ratio.icon;
                    const isSelected = selectedRatio === ratio.value;
                    return (
                      <button
                        key={ratio.value}
                        onClick={() => setSelectedRatio(ratio.value)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${isSelected
                            ? 'border-lime-500 bg-lime-400/10 text-lime-400 ring-1 ring-lime-500 shadow-[0_0_10px_rgba(163,230,53,0.1)]'
                            : 'border-zinc-700 bg-zinc-800/50 text-zinc-500 hover:border-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'
                          }`}
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-xs font-medium">{ratio.label}</span>
                        <span className={`text-[10px] ${isSelected ? 'opacity-80' : 'opacity-40'}`}>{ratio.value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-lime-400" /> Output Resolution
                </label>
                <div className="flex gap-2 p-1 bg-zinc-800/80 rounded-lg border border-zinc-700">
                  {IMAGE_SIZES.map((size) => {
                    const isSelected = selectedSize === size.value;
                    return (
                      <button
                        key={size.value}
                        onClick={() => setSelectedSize(size.value)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${isSelected
                            ? 'bg-lime-400 text-black shadow-lg shadow-lime-400/20'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50'
                          }`}
                      >
                        {size.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-zinc-500 mt-2 ml-1">
                  {IMAGE_SIZES.find(s => s.value === selectedSize)?.detail}
                </p>
              </div>

              {/* Optional Prompt */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Custom Instructions (Optional)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Make it look more cinematic, ensure the person is centered..."
                  className="w-full rounded-lg bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-600 shadow-sm focus:border-lime-500 focus:ring-lime-500 text-sm h-24 resize-none p-3 transition-colors"
                />
              </div>
            </section>

            {/* Action */}
            <Button
              onClick={handleGenerate}
              isLoading={isGenerating}
              disabled={!imageState.file}
              variant="primary"
              className="w-full h-14 text-lg"
            >
              {isGenerating ? 'Analyzing & Recomposing...' : 'Generate New Layout'}
              {!isGenerating && <Sparkles className="w-5 h-5 ml-2" />}
            </Button>
          </div>

          {/* RIGHT COLUMN: Result */}
          <div className="lg:col-span-7">
            <div className="sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-zinc-800 text-lime-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-zinc-700">3</span>
                <h2 className="text-lg font-semibold text-zinc-100">Result</h2>
              </div>
              <ResultViewer isLoading={isGenerating} result={result} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;