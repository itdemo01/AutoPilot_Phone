import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini client lazily to avoid crashing on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, prompt, history, imageBase64 } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action parameter" }, { status: 400 });
    }

    const ai = getGeminiClient();

    if (action === "chat") {
      // Operator assistant with human behavior intent recognition
      const systemInstruction = 
        "You are 'Koro', a human-like AI Assistant and phone operator co-pilot. " +
        "You can answer any user query, explain device states, and also operate the device. " +
        "To operate the device, you must output special tags at the very end of your response to trigger device states if the user asks you to:\n" +
        "- To open/navigate to Google Maps, output: [ACTION: OPEN_MAPS]\n" +
        "- To open/navigate to Chrome Browser, output: [ACTION: OPEN_CHROME]\n" +
        "- To perform a search query inside Chrome, output: [ACTION: SEARCH_CHROME: <query>]\n" +
        "- To open the Camera app, output: [ACTION: OPEN_CAMERA]\n" +
        "- To go back to the Home Screen, output: [ACTION: OPEN_HOME]\n" +
        "- To take a screenshot/capture screen, output: [ACTION: TAKE_SCREENSHOT]\n\n" +
        "Be friendly, conversational, and helpful. Act like a highly competent, responsive human co-pilot.";

      // Build contents incorporating history if available
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
          });
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: prompt || "Hello!" }],
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return NextResponse.json({ text: response.text });
    }

    if (action === "search") {
      // Real Web Search Grounding for the Integrated Browser
      if (!prompt) {
        return NextResponse.json({ error: "Query prompt is required for search" }, { status: 400 });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Search and summarize detailed information for: ${prompt}`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((chunk: any) => ({
        title: chunk.web?.title || "Search Result",
        uri: chunk.web?.uri || "",
      })).filter((source: any) => source.uri);

      return NextResponse.json({ text, sources });
    }

    if (action === "vision") {
      // AI Vision analysis of device screenshots
      if (!imageBase64) {
        return NextResponse.json({ error: "imageBase64 is required for vision mode" }, { status: 400 });
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const imagePart = {
        inlineData: {
          mimeType: "image/png",
          data: cleanBase64,
        },
      };

      const visionPrompt = prompt || "Analyze this device screen. Identify any key interactive elements and output a summary of what app is open and what is visible.";

      // We can ask Gemini to return both a natural language description AND bounding box predictions!
      const systemInstruction = 
        "You are an AI Vision system. Analyze the provided screenshot of the mobile screen. " +
        "Identify interactive elements (buttons, search bars, icons) and estimate their coordinate boxes. " +
        "Output your analysis in a clear conversational layout. " +
        "At the end, output a JSON block with detected nodes if applicable, formatted as: " +
        "```json\n" +
        "[\n" +
        "  { \"label\": \"Search Bar\", \"x\": 5, \"y\": 10, \"w\": 90, \"h\": 12, \"confidence\": 0.95 }\n" +
        "]\n" +
        "```\n" +
        "Coordinates must be standard percentages (0-100) relative to the screen dimensions.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, { text: visionPrompt }] },
        config: {
          systemInstruction,
        },
      });

      return NextResponse.json({ text: response.text });
    }

    if (action === "screen-share") {
      // Real-time Screen Sharing Narrator
      if (!imageBase64) {
        return NextResponse.json({ error: "imageBase64 is required for screen share mode" }, { status: 400 });
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const imagePart = {
        inlineData: {
          mimeType: "image/png",
          data: cleanBase64,
        },
      };

      const systemInstruction = 
        "You are 'Koro Screen Share Narrator'. You are actively watching the operator's shared device screen in real-time. " +
        "Provide a concise, professional 1-2 sentence human-like voiceover narration of the current view, active app, " +
        "and any pending notification or action. Keep it highly dynamic, direct, and conversational.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, { text: "Narrate this active screen briefly." }] },
        config: {
          systemInstruction,
        },
      });

      return NextResponse.json({ text: response.text });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });

  } catch (error: any) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to call Gemini API", 
      details: error.stack 
    }, { status: 500 });
  }
}
