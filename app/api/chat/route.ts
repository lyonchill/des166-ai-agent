import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchRelevantQAs } from "@/lib/rag";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    // Search for relevant QAs from the knowledge base
    const relevantQAs = searchRelevantQAs(message);

    // Build context from relevant QAs
    const context = relevantQAs
      .map((qa) => `Q: ${qa.question}\nA: ${qa.answer}`)
      .join("\n\n");

    // Extract links from relevant QAs
    const sources = relevantQAs
      .flatMap((qa) => qa.links || [])
      .filter((link, index, self) => self.indexOf(link) === index); // Remove duplicates

    // Create the system prompt
    const systemPrompt = `You are a helpful AI assistant for the UW DES166 course. Your role is to answer student questions based on the course's FAQ information.

Based on the following QA records, answer the student's question:

${context}

Guidelines:
1. Be friendly, clear, and well-organized in your responses
2. If the information is uncertain or not in the knowledge base, suggest contacting an academic advisor
3. Provide relevant links when available
4. If the question is outside the scope of the available information, be honest about it
5. Keep responses concise but informative
6. Do not use Markdown formatting (no **bold** or other markdown syntax) - use plain text only

Remember: You are an assistant to help students, but for important decisions they should always consult with their academic advisor.`;

    // Check if API key is set
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key-here") {
      return NextResponse.json(
        { error: "Gemini API key is not configured. Please set GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const prompt = `${systemPrompt}\n\nUser question: ${message}`;
    
    // Try multiple models with fallback - prioritize gemini-2.5-flash
    const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
    let lastError: any = null;
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        });
        
        const result = await model.generateContent(prompt);
        const response = result.response;
        let responseMessage = response.text() || 
          "I'm sorry, I couldn't generate a response. Please try again.";
        
        // Remove Markdown formatting (bold markers **)
        responseMessage = responseMessage.replace(/\*\*(.*?)\*\*/g, '$1');

        return NextResponse.json({
          message: responseMessage,
          sources: sources.length > 0 ? sources : undefined,
        });
      } catch (error: any) {
        lastError = error;
        // If it's a 503 or overload error, try next model
        if (error?.message?.includes("503") || error?.message?.includes("overloaded")) {
          console.warn(`Model ${modelName} is overloaded, trying next model...`);
          continue;
        }
        // For other errors, throw immediately
        throw error;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error("All models are currently unavailable");

  } catch (error: any) {
    console.error("API Error:", error);
    
    // Provide user-friendly error messages
    let errorMessage = "Sorry, I'm having trouble connecting to the AI service right now.";
    let statusCode = 500;
    
    if (error?.message?.includes("503") || error?.message?.includes("overloaded")) {
      errorMessage = "The AI service is currently overloaded. Please try again in a few moments.";
      statusCode = 503;
    } else if (error?.message?.includes("API key") || error?.message?.includes("authentication")) {
      errorMessage = "API authentication failed. Please check your API key configuration.";
      statusCode = 401;
    } else if (error?.message?.includes("quota") || error?.message?.includes("rate limit")) {
      errorMessage = "API rate limit exceeded. Please try again later.";
      statusCode = 429;
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error?.message : undefined
      },
      { status: statusCode }
    );
  }
}
