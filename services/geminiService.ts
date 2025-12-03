import { GoogleGenAI, Type, Schema } from "@google/genai";
import { VideoScript, Language, SearchResult } from "../types";

// Schema for the video script output
const videoScriptSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Catchy YouTube video title" },
    description: { type: Type.STRING, description: "YouTube video description with SEO keywords" },
    script: { type: Type.STRING, description: "Full spoken script for the video voiceover" },
    hashtags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 5-10 relevant hashtags" },
    thumbnailPrompt: { type: Type.STRING, description: "A detailed visual description for an AI image generator to create a thumbnail" },
    bgMusicType: { type: Type.STRING, description: "Suggested mood/genre for background music" }
  },
  required: ["title", "description", "script", "hashtags", "thumbnailPrompt", "bgMusicType"]
};

export const generateVideoContent = async (topic: string, language: Language): Promise<VideoScript> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = language === 'zh-TW' 
    ? "你是一個專業的 YouTube 自動化專家。請根據提供的主題生成高品質的影片腳本、標題和描述。請使用繁體中文回答。"
    : "You are a professional YouTube automation expert. Generate a high-quality video script, title, and description based on the provided topic. Answer in English.";

  const prompt = `Create a complete video package for the topic: "${topic}". 
  Include a viral title, an SEO-optimized description, a script for a 60-second short, hashtags, a prompt for the thumbnail, and music suggestions.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: videoScriptSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as VideoScript;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const searchTrends = async (query: string, language: Language): Promise<SearchResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  
  // System instruction to act as a researcher
  const systemInstruction = language === 'zh-TW'
    ? "你是一個 YouTube 趨勢研究員。請根據使用者的搜尋查詢，利用 Google 搜尋尋找相關的最新資訊，並總結對影片創作者有用的重點。"
    : "You are a YouTube trend researcher. Use Google Search to find the latest information based on the user's query and summarize key points useful for video creators.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction
      }
    });

    const text = response.text || "";
    // Extract grounding chunks from the response metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Map web sources if available
    const sources = chunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web)
      .map((web: any) => ({ title: web.title, uri: web.uri }));

    return { text, sources };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};