import fs from "fs/promises";
import path from "path";
// pdf-parse exports PDFParse class
// @ts-ignore
const { PDFParse } = require("pdf-parse");

export type TextChunk = {
  id: string;
  fileId: string;
  content: string;
  pageNumber?: number;
  startIndex: number;
  endIndex: number;
};

const CHUNK_SIZE = 1000; // 每個chunk約1000字符
const CHUNK_OVERLAP = 200; // chunk之間重疊200字符以保留上下文

/**
 * 解析PDF文件並提取文本
 */
export async function parsePDF(filePath: string): Promise<{
  text: string;
  numPages: number;
  chunks: TextChunk[];
}> {
  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // Use PDFParse class to parse the PDF
    const parser = new PDFParse({ data: fileBuffer });
    const result = await parser.getText();
    
    const text = result.text;
    const numPages = result.pages?.length || 1;

    // 將文本分割成chunks
    const chunks = splitTextIntoChunks(text, filePath, numPages);

    return {
      text,
      numPages,
      chunks,
    };
  } catch (error) {
    console.error(`Error parsing PDF ${filePath}:`, error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * 將文本分割成chunks，保留上下文
 */
function splitTextIntoChunks(
  text: string,
  fileId: string,
  totalPages: number
): TextChunk[] {
  const chunks: TextChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + CHUNK_SIZE, text.length);
    const chunkText = text.slice(startIndex, endIndex);

    // 估算頁碼（簡單估算，不精確）
    const estimatedPage = Math.floor((startIndex / text.length) * totalPages) + 1;

    chunks.push({
      id: `${fileId}-chunk-${chunkIndex}`,
      fileId,
      content: chunkText.trim(),
      pageNumber: estimatedPage,
      startIndex,
      endIndex,
    });

    // 移動到下一個chunk，保留重疊部分
    startIndex = endIndex - CHUNK_OVERLAP;
    chunkIndex++;
  }

  return chunks;
}

/**
 * 清理文本，移除多餘的空白字符
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, " ") // 將多個空白字符替換為單個空格
    .replace(/\n{3,}/g, "\n\n") // 將多個換行替換為兩個換行
    .trim();
}

