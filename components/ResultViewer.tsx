import React from 'react';
import { Download, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { GeneratedResult } from '../types';

interface ResultViewerProps {
  isLoading: boolean;
  result: GeneratedResult | null;
}

export const ResultViewer: React.FC<ResultViewerProps> = ({ isLoading, result }) => {
  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `smartlayout-${result.aspectRatio.replace(':','-')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[400px] bg-zinc-900 rounded-2xl border border-zinc-700 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Neon glow background effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-lime-400/10 blur-[50px] rounded-full animate-pulse"></div>
        
        <div className="relative z-10">
          <Loader2 className="w-12 h-12 text-lime-400 animate-spin" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-100 mt-6 animate-pulse">Recomposing Layout...</h3>
        <p className="text-zinc-500 text-sm mt-2 max-w-sm text-center">
          The Gemini 3 Pro model is analyzing your image and generating a new composition. This might take a moment.
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full h-full min-h-[400px] bg-zinc-900/30 rounded-2xl border border-zinc-800 flex flex-col items-center justify-center text-zinc-600 p-8">
        <div className="w-16 h-16 bg-zinc-800/50 border border-zinc-700 rounded-2xl flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 opacity-40" />
        </div>
        <p className="font-medium text-zinc-400">No Result Yet</p>
        <p className="text-sm opacity-60">Upload an image and click Generate to see the magic.</p>
      </div>
    );
  }

  // Calculate aspect ratio for the container to enforce the shape
  const [w, h] = result.aspectRatio.split(':').map(Number);
  const ratioValue = w / h;
  const isTall = ratioValue < 1;

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
      
      {/* Container wrapper that centers the result */}
      <div className="w-full flex justify-center bg-zinc-900/50 rounded-2xl border border-zinc-800 p-4 sm:p-8 backdrop-blur-sm">
        
        <div 
          className="relative group bg-zinc-950 rounded-lg overflow-hidden shadow-2xl ring-1 ring-zinc-800 transition-all duration-300"
          style={{
             // Force the container to respect the aspect ratio
             aspectRatio: `${w}/${h}`,
             // Constrain dimensions to fit viewport reasonably
             width: isTall ? 'auto' : '100%',
             height: isTall ? '100%' : 'auto',
             maxHeight: '70vh',
             maxWidth: '100%'
          }}
        >
          {/* Result Image - using object-cover to ensuring filling of the aspect ratio frame */}
          <img 
              src={result.imageUrl} 
              alt={`Generated ${result.aspectRatio}`} 
              className="w-full h-full object-cover"
          />

          {/* Overlays */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 z-20">
            <Button variant="secondary" onClick={handleDownload} className="shadow-lg backdrop-blur-md bg-black/70 hover:bg-black/90 text-lime-400 border border-lime-400/20">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-12 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider bg-lime-400 text-black px-2 py-1 rounded shadow-[0_0_10px_rgba(163,230,53,0.3)]">
                      {result.aspectRatio}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider bg-zinc-800 px-2 py-1 rounded text-zinc-300 border border-zinc-700">
                      {result.size}
                  </span>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
};