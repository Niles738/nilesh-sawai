
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStudyTip = async (subject: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me a short, highly effective study tip for the subject: ${subject}. Keep it under 150 characters.`,
    });
    return response.text || "Keep focused and take regular breaks!";
  } catch (error) {
    console.error("Error generating study tip:", error);
    return "Study in short bursts for better retention.";
  }
};

export const getSmartCaption = async (subject: string, rawText: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite this study post caption to be more engaging and academic for StudyGram. Subject: ${subject}. Caption: ${rawText}. Add 3 relevant hashtags.`,
    });
    return response.text || rawText;
  } catch (error) {
    return rawText;
  }
};

export const askStudyAssistant = async (context: string, question: string, history: {role: string, content: string}[]): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are the StudyGram AI Assistant. Your goal is to help students understand study material. 
        Context provided: ${context}. 
        Answer questions accurately, concisely, and in a helpful academic tone. 
        If the question is unrelated to the study material or general learning, politely redirect the student.`,
      }
    });

    const response = await chat.sendMessage({ 
      message: question 
    });
    
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
  }
};
