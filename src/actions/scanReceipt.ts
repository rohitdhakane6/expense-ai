"use server";

import { categoryOptions } from "@/db/schema";
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Scans a receipt image using the Gemini API and returns structured JSON data.
 * @param formData The form data containing the uploaded file.
 * @returns A promise that resolves to an object with the extracted receipt data or an error message.
 */
export async function scanReceipt(formData: FormData) {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { success: false, message: "No file uploaded." };
  }

  // Convert the file to a base64 string for the API request.
  const arrayBuffer = await file.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");

  // This detailed system prompt instructs the AI on its role, the exact output format,
  // and the rules for each field. This is crucial for getting consistent results.
  const systemPrompt = `You are a smart receipt scanner AI. Analyze receipt images and extract financial data into the exact JSON format below. Follow these rules strictly:

REQUIRED OUTPUT FORMAT:
{
  "amount": number,                  // Final total amount (numbers only, no currency symbols)
  "type": "expense",                 // Always "expense" for receipts (use "income" only for refunds/returns)
  "date": "YYYY-MM-DD",             // Receipt date in ISO format (use current date if not found)
  "name": "string",                 // Short item name (1-3 words max, e.g. "groceries", "coffee", "gas")
  "description": "string",          // Store/merchant name or brief description (optional)
  "category": "string"              // Must be one of the predefined categories below
}

VALID CATEGORIES:
${categoryOptions.map((cat) => `"${cat}"`).join(", ")}

description:
Physical stores: "description": "Starbucks"
Online purchases: "description": "Online purchase from Flipkart"

`;

  console.log("Generating content with Gemini...");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",

      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Here is a receipt image. Extract the transaction details.",
            },
            {
              inlineData: {
                mimeType: file.type,
                data: base64String,
              },
            },
          ],
        },
      ],
    });

    const result = response.text;

    console.log("AI Response:", result);

    if (result === undefined) {
      return { success: false, message: "No response from AI." };
    }

    // Check if the AI returned an empty object, indicating it's not a receipt.
    if (result.trim() === "{}") {
      return {
        success: false,
        message: "The uploaded image does not appear to be a receipt.",
      };
    }

    // Because we are using JSON mode, we can parse the result directly
    // without needing to clean up markdown or worry about syntax errors.
    const data = JSON.parse(result);
    console.log("Parsed Receipt Data:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Error processing receipt:", err);
    return {
      success: false,
      message: "Failed to process the receipt due to an API or parsing error.",
    };
  }
}
