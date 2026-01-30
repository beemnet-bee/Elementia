
import { GoogleGenAI } from "@google/genai";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getElementFact = async (elementName: string, retries = 2): Promise<string> => {
  try {
    // Initialize inside the function to ensure the API key is current
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me one mind-blowing, high-level scientific fact about the chemical element ${elementName}. Keep it under 150 characters. Be precise and sophisticated.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text?.trim() || `The atomic resonance of ${elementName} reveals unique properties in high-energy physics contexts.`;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Retry logic for transient 500 errors
    if (retries > 0 && (error.status === 500 || error.message?.includes('500'))) {
      await delay(1000);
      return getElementFact(elementName, retries - 1);
    }
    
    return `The electronic structure of ${elementName} plays a critical role in standard model chemical bonding.`;
  }
};
