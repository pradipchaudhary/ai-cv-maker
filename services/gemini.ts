import { GoogleGenAI, Type } from "@google/genai";
import { PassportData } from "../types";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("NEXT_PUBLIC_GEMINI_API_KEY is not set. Please ensure it's available in the environment.");
    }
    aiInstance = new GoogleGenAI({ apiKey: apiKey || "" });
  }
  return aiInstance;
}

export async function extractPassportData(base64Image: string): Promise<PassportData> {
  const ai = getAI();
  const model = "gemini-3-flash-preview";
  
  const prompt = `Extract the following information from this passport image. If it's a Nepali passport, ensure accuracy for Nepali names and dates. Return the data in JSON format.
  
  Fields to extract:
  - Full Name
  - Passport Number
  - Date of Birth
  - Gender
  - Nationality
  - Place of Birth
  - Date of Issue
  - Date of Expiry
  - Issuing Authority
  - Place of Issue (Look for "Ref" in latest Nepali passports or "Ref. No." in older versions)
  - Personal Number
  - Type (Passport Type)
  - Address (Look for permanent address or any address mentioned on the passport)`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          passportNumber: { type: Type.STRING },
          dateOfBirth: { type: Type.STRING },
          gender: { type: Type.STRING },
          nationality: { type: Type.STRING },
          placeOfBirth: { type: Type.STRING },
          dateOfIssue: { type: Type.STRING },
          dateOfExpiry: { type: Type.STRING },
          issuingAuthority: { type: Type.STRING },
          placeOfIssue: { type: Type.STRING },
          personalNumber: { type: Type.STRING },
          type: { type: Type.STRING },
          address: { type: Type.STRING },
        },
        required: ["fullName", "passportNumber"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as PassportData;
}
