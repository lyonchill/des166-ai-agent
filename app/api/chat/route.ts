import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildRAGContext } from "@/lib/rag";
import { logInteraction, generateSessionId } from "@/lib/interaction-logger";

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

    // Search for relevant QAs and course files
    const { context, qaSources, fileSources } = buildRAGContext(message, 5, 3);

    // Extract links from relevant QAs
    const qaLinks = qaSources
      .flatMap((qa) => qa.links || [])
      .filter((link, index, self) => self.indexOf(link) === index); // Remove duplicates

    // Extract file links from course files
    // 優先使用 externalLink，如果沒有則使用 filePath
    const fileLinks = fileSources.map((result) => ({
      type: result.file.externalLink ? ("link" as const) : ("file" as const),
      title: result.file.title,
      url: result.file.externalLink || result.file.filePath,
      pageNumber: result.chunks[0]?.pageNumber,
    }));

    // Combine all sources
    const sources = [
      ...qaLinks.map((link) => ({ type: "link" as const, url: link })),
      ...fileLinks,
    ];

    // Create the system prompt
    const systemPrompt = `You are a helpful AI assistant for the UW DES166 course. Your role is to answer student questions based on the course's FAQ information and course materials.

Based on the following information (including QA records and course file excerpts), answer the student's question:

${context}

Guidelines:
1. Be friendly, clear, and well-organized in your responses
2. If the information is uncertain or not in the knowledge base, suggest contacting an academic advisor
3. Provide relevant links and file references when available
4. When referencing course files, mention the file name and page number if available
5. If the question is outside the scope of the available information, be honest about it
6. Keep responses concise but informative
7. Do not use Markdown formatting (no **bold** or other markdown syntax) - use plain text only
8. IMPORTANT: When providing dates, use the EXACT dates from the course materials. Dates are in format "Day, Month DD, YYYY" (e.g., "Monday, January 12, 2026"). Never guess or approximate dates - always use the exact dates provided in the course calendar.

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
            maxOutputTokens: 2000, // 增加到2000以支持完整回答
            topP: 0.95,
            topK: 40,
          },
    });

        const result = await model.generateContent(prompt);
        const response = result.response;
        
        // 獲取完整響應文本
        let responseMessage = "";
        try {
          responseMessage = response.text() || "";
        } catch (error) {
          console.error("Error extracting response text:", error);
          // 嘗試從candidates獲取
          const candidates = response.candidates;
          if (candidates && candidates.length > 0 && candidates[0].content) {
            responseMessage = candidates[0].content.parts
              .map((part: any) => part.text || "")
              .join("");
          }
        }
        
        // 如果仍然沒有內容，使用默認消息
        if (!responseMessage || responseMessage.trim().length === 0) {
          responseMessage = "I'm sorry, I couldn't generate a response. Please try again.";
        }
        
        // Remove Markdown formatting (bold markers **)
        responseMessage = responseMessage.replace(/\*\*(.*?)\*\*/g, '$1');
        
        // 確保響應不是空的或只有標題
        if (responseMessage.trim().length < 10) {
          responseMessage = "I'm sorry, I couldn't generate a complete response. Please try rephrasing your question.";
        }

        // Log interaction (async, don't block response)
        const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0] || 
                        request.headers.get("x-real-ip") || 
                        "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";
        const sessionId = generateSessionId(clientIp, userAgent);
        
        logInteraction(message, responseMessage, sessionId, {
          sources,
          fileSources: fileSources.map((f) => ({
            title: f.file.title,
            path: f.file.filePath,
            pageNumber: f.chunks[0]?.pageNumber,
          })),
          model: modelName,
          relevantQAs: qaSources.map((qa) => qa.id),
        }).catch((err) => {
          // 記錄失敗不應影響響應
          console.error("Failed to log interaction:", err);
        });

    return NextResponse.json({
      message: responseMessage,
      sources: sources.length > 0 ? sources : undefined,
      fileSources: fileSources.length > 0 ? fileSources.map((f) => ({
        title: f.file.title,
        path: f.file.filePath,
        pageNumber: f.chunks[0]?.pageNumber,
      })) : undefined,
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
