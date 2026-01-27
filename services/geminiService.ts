import { GoogleGenAI } from "@google/genai";

export const getElementFact = async (elementName: string): Promise<string> => {
  try {
    // Initialize inside the function to ensure the API key is current and avoids module-level load errors
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
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `The electronic structure of ${elementName} plays a critical role in standard model chemical bonding.`;
  }
};