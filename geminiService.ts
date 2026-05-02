
import { GoogleGenAI, Type } from "@google/genai";
import { BrandDNA, Campaign, UserInput, Asset, GenerationStyle, AspectRatio, VideoQualityMode, Product } from "./types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBrandDNA = async (input: UserInput): Promise<BrandDNA> => {
  const ai = getAI();
  const prompt = `Act as a world-class brand strategist specialized in the African market. 
  Analyze this business: ${input.businessName} (URL: ${input.url}). 
  Description: ${input.description}. Location: ${input.country}.
  
  Extract a "Business DNA" that fuses modern professional branding with high-end African aesthetic markers (textures like Bogolan, Kente, Aso-Oke, or modern metropolitan African minimalism).
  
  Also provide 3 strategic insights into their current brand identity and 3 specific areas for improvement to better target the African market.
  
  Return valid JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          fonts: { type: Type.ARRAY, items: { type: Type.STRING } },
          tone: { type: Type.STRING },
          imageStyle: { type: Type.STRING },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          localContext: { type: Type.STRING },
          insights: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["name", "colors", "fonts", "tone", "imageStyle", "keywords", "localContext", "insights", "improvements"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const refineImageStyle = async (currentStyle: string, instruction: string, dna: BrandDNA): Promise<string> => {
  const ai = getAI();
  const prompt = `Refine the visual direction for brand "${dna.name}".
  Current Style: ${currentStyle}.
  Instruction: ${instruction}.
  Market Context: ${dna.localContext}.
  Return only the updated image style description string.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt
  });

  return response.text || currentStyle;
};

export const generateCampaigns = async (dna: BrandDNA, input: UserInput): Promise<Campaign[]> => {
  const ai = getAI();
  const demographicsStr = input.demographics 
    ? `Age: ${input.demographics.ageRange}. Locations: ${input.demographics.specificLocations.join(', ')}. Interests: ${input.demographics.interests.join(', ')}.`
    : '';

  const prompt = `Generate 3 high-impact marketing campaign ideas for ${dna.name} in ${input.country}.
  Audience: ${input.targetAudience}. 
  Detailed Demographics: ${demographicsStr}
  Tone: ${dna.tone}.
  Campaign Goal: ${input.campaignGoal}.
  
  Localization requirement: Use deep regional cultural hooks (e.g. specific slang like 'Chale', 'Sawa', or 'Nawa', local holidays, or market behaviors). 
  The campaigns should feel "high-end" and ultra-professional. 
  Assign a scheduledDate for each (YYYY-MM-DD format starting from today).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            concept: { type: Type.STRING },
            culturalHook: { type: Type.STRING },
            cta: { type: Type.STRING },
            goal: { type: Type.STRING },
            suggestedPlatforms: { type: Type.ARRAY, items: { type: Type.STRING } },
            videoScript: { type: Type.STRING },
            scheduledDate: { type: Type.STRING }
          },
          required: ["id", "title", "concept", "culturalHook", "cta", "goal", "suggestedPlatforms", "videoScript", "scheduledDate"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const generateAssetVisual = async (campaign: Campaign, dna: BrandDNA, assetType: string, style: GenerationStyle = 'natural', ratio: AspectRatio = '1:1', product?: Product): Promise<string> => {
  const ai = getAI();
  
  let styleInstruction = "";
  switch(style) {
    case 'anime': styleInstruction = "High-quality vibrant Anime art style, clean lines, expressive, cinematic lighting."; break;
    case 'manga': styleInstruction = "Detailed Manga illustration style, high-end professional comic art aesthetic."; break;
    case '3d-render': styleInstruction = "Premium 3D CGI render, Octane Render style, high detail, studio lighting, hyper-realistic materials."; break;
    case 'illustration': styleInstruction = "Elegant hand-drawn professional illustration, high-end brand editorial style."; break;
    case 'professional': styleInstruction = "Clean, corporate, professional studio photography with minimalist composition."; break;
    default: styleInstruction = "Hyper-realistic commercial photography, 8k resolution, authentic lighting."; break;
  }

  let prompt = `Marketing visual for ${dna.name} in ${dna.localContext}. 
  Format: ${assetType}. Aspect Ratio: ${ratio}.
  Context: ${campaign.concept}. 
  Style: ${styleInstruction}. 
  Visual Markers: ${dna.imageStyle}, luxury aesthetic, vibrant colors (${dna.colors.join(', ')}). 
  Setting: Modern authentic environment. No generic stock looks.`;

  if (product) {
    prompt += ` Feature Product: ${product.name} - ${product.description}. Make the product the hero of the image.`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: ratio }
    }
  });

  let imageUrl = '';
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  return imageUrl;
};

export const generateMagicAsset = async (prompt: string, campaign: Campaign, dna: BrandDNA, style: GenerationStyle = 'natural', ratio: AspectRatio = '1:1'): Promise<{ imageUrl: string, headline: string, caption: string }> => {
  const ai = getAI();
  
  let styleInstruction = "";
  switch(style) {
    case 'anime': styleInstruction = "High-quality vibrant Anime art style."; break;
    case 'manga': styleInstruction = "Detailed Manga illustration style."; break;
    case '3d-render': styleInstruction = "Premium 3D CGI render."; break;
    case 'illustration': styleInstruction = "Elegant hand-drawn professional illustration."; break;
    case 'professional': styleInstruction = "Clean, corporate, professional studio photography."; break;
    default: styleInstruction = "Hyper-realistic commercial photography."; break;
  }

  const visualPrompt = `Marketing visual for ${dna.name}. 
  User Request: ${prompt}.
  Context: ${campaign.concept}.
  Format: Social Media Post. Aspect Ratio: ${ratio}.
  Style: ${styleInstruction}. 
  Visual DNA: ${dna.imageStyle}, luxury aesthetic, vibrant colors (${dna.colors.join(', ')}). 
  Setting: Modern authentic African environment.`;

  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: visualPrompt }] },
    config: { imageConfig: { aspectRatio: ratio } }
  });

  let imageUrl = '';
  for (const part of imageResponse.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  const textPrompt = `Write high-converting marketing copy for ${dna.name} based on this request: "${prompt}".
  Campaign Context: ${campaign.title} - ${campaign.concept}.
  Tone: ${dna.tone}.
  Inject AUTHENTIC local African slang and cultural hooks.
  Format as JSON with "headline" and "caption".`;

  const textResponse = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: textPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          caption: { type: Type.STRING }
        },
        required: ["headline", "caption"]
      }
    }
  });

  const textResults = JSON.parse(textResponse.text || '{"headline": "", "caption": ""}');
  
  return { imageUrl, ...textResults };
};

export const generateAssetContent = async (campaign: Campaign, dna: BrandDNA, language: string, product?: Product): Promise<{ headline: string, caption: string }> => {
  const ai = getAI();
  let prompt = `Write high-converting marketing copy for an African PME.
  Campaign: ${campaign.title}. 
  Goal: ${campaign.goal}.
  Language: ${language}.
  Tone: ${dna.tone}.
  Inject AUTHENTIC local slang, regional nuances, and cultural idioms. 
  Format as JSON.`;

  if (product) {
    prompt += ` Focus on product: ${product.name}, Price: ${product.price}. Benefits: ${product.description}.`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          caption: { type: Type.STRING }
        },
        required: ["headline", "caption"]
      }
    }
  });

  return JSON.parse(response.text || '{"headline": "", "caption": ""}');
};

export const generateCarouselContent = async (campaign: Campaign, dna: BrandDNA, language: string, slidesCount: number = 5): Promise<{ slides: { headline: string, caption: string }[] }> => {
  const ai = getAI();
  const prompt = `Generate a ${slidesCount}-slide carousel marketing campaign for ${dna.name}.
  Campaign: ${campaign.title}. 
  Goal: ${campaign.goal}.
  Language: ${language}.
  Tone: ${dna.tone}.
  Inject AUTHENTIC local slang and cultural idioms. 
  Each slide should have a distinct headline and caption that follows a storytelling flow.
  Format as JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                caption: { type: Type.STRING }
              },
              required: ["headline", "caption"]
            }
          }
        },
        required: ["slides"]
      }
    }
  });

  return JSON.parse(response.text || '{"slides": []}');
};

export const editAssetWithNL = async (asset: Asset, command: string, dna: BrandDNA): Promise<Asset> => {
  const ai = getAI();
  const prompt = `Refine the marketing copy: "${command}".
  Current Headline: ${asset.headline}.
  Current Caption: ${asset.caption}.
  Context: Local African market (${dna.localContext}).
  Maintain the brand tone: ${dna.tone}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          caption: { type: Type.STRING }
        },
        required: ["headline", "caption"]
      }
    }
  });

  const results = JSON.parse(response.text || '{}');
  return { ...asset, ...results };
};

export const generateCustomCampaign = async (dna: BrandDNA, input: UserInput, prompt: string): Promise<Campaign> => {
  const ai = getAI();
  const fullPrompt = `Generate a high-impact marketing campaign idea for ${dna.name} in ${input.country} based on this specific request: "${prompt}".
  Audience: ${input.targetAudience}. 
  Tone: ${dna.tone}.
  Localization requirement: Use deep regional cultural hooks. 
  The campaign should feel "high-end" and ultra-professional. 
  Assign a scheduledDate (YYYY-MM-DD format).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: fullPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          concept: { type: Type.STRING },
          culturalHook: { type: Type.STRING },
          cta: { type: Type.STRING },
          goal: { type: Type.STRING },
          suggestedPlatforms: { type: Type.ARRAY, items: { type: Type.STRING } },
          videoScript: { type: Type.STRING },
          scheduledDate: { type: Type.STRING }
        },
        required: ["id", "title", "concept", "culturalHook", "cta", "goal", "suggestedPlatforms", "videoScript", "scheduledDate"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateVideoAd = async (campaign: Campaign, dna: BrandDNA, ratio: AspectRatio = '9:16', mode: VideoQualityMode = 'fast'): Promise<string> => {
  // Always create a new instance with the latest API key from env (which might be injected via window.aistudio)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = mode === 'high-quality' ? 'veo-3.1-generate-preview' : 'veo-3.1-fast-generate-preview';
  
  let veoRatio = ratio;
  if (ratio === '1:1' || ratio === '4:5') veoRatio = '9:16'; 
  if (ratio === '1.91:1') veoRatio = '16:9'; 
  
  const prompt = `High-end social media commercial video for ${dna.name}. 
  Concept: ${campaign.concept}. 
  Style: Luxury modern African aesthetic. 
  Vibrant colors: ${dna.colors.join(', ')}. 
  Desired Output Aspect Ratio: ${ratio}.
  (Technical: Generating in ${veoRatio}).`;

  let operation = await ai.models.generateVideos({
    model: modelName,
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: mode === 'high-quality' ? '1080p' : '720p',
      aspectRatio: veoRatio as any
    }
  });

  while (!operation.done) {
    // Polling interval
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed.");

  const fetchResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await fetchResponse.blob();
  return URL.createObjectURL(blob);
};
