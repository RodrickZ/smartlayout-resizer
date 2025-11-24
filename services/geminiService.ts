import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

// Helper to check API key status
export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

// Helper to trigger API key selection
export const promptApiKeySelection = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    console.error("AI Studio API helper not available.");
  }
};

export const generateResizedLayout = async (
  base64Data: string,
  mimeType: string,
  aspectRatio: AspectRatio,
  imageSize: ImageSize,
  promptText?: string
): Promise<string> => {
  // Always initialize a new client to pick up the latest selected API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const model = 'gemini-3-pro-image-preview';
  
  // Stronger prompt to ensure aspect ratio is respected during image-to-image generation
  const finalPrompt = promptText 
    ? `${promptText}. IMPORTANT: The output image MUST strictly adhere to a ${aspectRatio} aspect ratio. Crop or extend the image content to fill the ${aspectRatio} frame completely.` 
    : `Reframe and resize this image to strictly fit a ${aspectRatio} aspect ratio. Crop the sides or extend the background as necessary to fill the ${aspectRatio} frame. Maintain the main subject's integrity but adapt the composition to the new shape.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          parts: [
            {
              text: finalPrompt,
            },
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize,
        },
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Handle the specific error for missing key if possible
    if (error.message && error.message.includes("Requested entity was not found")) {
      throw new Error("API_KEY_MISSING");
    }
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};
