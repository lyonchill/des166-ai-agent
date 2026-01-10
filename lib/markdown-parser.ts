import fs from "fs/promises";
import path from "path";
import { TextChunk } from "./pdf-parser";

const CHUNK_SIZE = 1000; // 每個chunk約1000字符
const CHUNK_OVERLAP = 200; // chunk之間重疊200字符以保留上下文

/**
 * 解析Markdown文件並提取文本chunks
 * Markdown文件比PDF更容易解析，沒有內存問題，結構更清晰
 */
export async function parseMarkdown(filePath: string): Promise<{
  text: string;
  chunks: TextChunk[];
}> {
  try {
    // 讀取Markdown文件
    const fileContent = await fs.readFile(filePath, "utf-8");
    
    // 清理文本（移除Markdown語法但保留內容）
    const text = cleanMarkdownText(fileContent);
    
    // 將文本分割成chunks
    const chunks = splitTextIntoChunks(text, filePath);
    
    return {
      text,
      chunks,
    };
  } catch (error) {
    console.error(`Error parsing Markdown ${filePath}:`, error);
    throw new Error(`Failed to parse Markdown: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * 清理Markdown文本，移除語法標記但保留內容
 * 可以選擇保留或移除標記，這裡我們保留標記以便AI理解結構
 */
function cleanMarkdownText(markdown: string): string {
  // 保留Markdown結構，但清理多餘的空白
  return markdown
    .replace(/\r\n/g, "\n") // 統一換行符
    .replace(/\n{3,}/g, "\n\n") // 將多個換行替換為兩個換行
    .trim();
}

/**
 * 將文本分割成chunks，保留上下文
 */
function splitTextIntoChunks(
  text: string,
  fileId: string
): TextChunk[] {
  const chunks: TextChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + CHUNK_SIZE, text.length);
    const chunkText = text.slice(startIndex, endIndex);

    chunks.push({
      id: `${fileId}-chunk-${chunkIndex}`,
      fileId,
      content: chunkText.trim(),
      pageNumber: undefined, // Markdown沒有頁碼概念
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
 * 智能分割Markdown：按標題和段落分割，保留語義完整性
 * 這比簡單的字符分割更精準
 */
export async function parseMarkdownSmart(filePath: string): Promise<{
  text: string;
  chunks: TextChunk[];
}> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const text = cleanMarkdownText(fileContent);
    
    // 按標題和段落分割
    const sections = splitMarkdownBySections(text);
    
    const chunks: TextChunk[] = sections.map((section, index) => ({
      id: `${filePath}-section-${index}`,
      fileId: filePath,
      content: section.content,
      pageNumber: undefined,
      startIndex: section.startIndex,
      endIndex: section.endIndex,
    }));
    
    return {
      text,
      chunks,
    };
  } catch (error) {
    console.error(`Error parsing Markdown ${filePath}:`, error);
    throw new Error(`Failed to parse Markdown: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * 按Markdown標題和段落智能分割
 */
function splitMarkdownBySections(text: string): Array<{
  content: string;
  startIndex: number;
  endIndex: number;
}> {
  const sections: Array<{ content: string; startIndex: number; endIndex: number }> = [];
  
  // 按標題分割（# ## ### 等）
  const headingRegex = /^(#{1,6}\s+.+)$/gm;
  const matches = Array.from(text.matchAll(headingRegex));
  
  if (matches.length === 0) {
    // 沒有標題，按段落分割
    return splitByParagraphs(text);
  }
  
  // 有標題，按標題分割
  for (let i = 0; i < matches.length; i++) {
    const startIndex = matches[i].index!;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : text.length;
    const content = text.slice(startIndex, endIndex).trim();
    
    if (content.length > 0) {
      sections.push({
        content,
        startIndex,
        endIndex,
      });
    }
  }
  
  // 如果sections太大，進一步分割
  const maxChunkSize = CHUNK_SIZE;
  const finalSections: Array<{ content: string; startIndex: number; endIndex: number }> = [];
  
  sections.forEach((section) => {
    if (section.content.length <= maxChunkSize) {
      finalSections.push(section);
    } else {
      // 大section需要進一步分割
      const subSections = splitTextIntoChunksSimple(section.content, section.startIndex);
      finalSections.push(...subSections);
    }
  });
  
  return finalSections;
}

/**
 * 按段落分割文本
 */
function splitByParagraphs(text: string): Array<{
  content: string;
  startIndex: number;
  endIndex: number;
}> {
  const paragraphs = text.split(/\n\n+/);
  const sections: Array<{ content: string; startIndex: number; endIndex: number }> = [];
  let currentIndex = 0;
  
  paragraphs.forEach((para) => {
    if (para.trim().length > 0) {
      const startIndex = currentIndex;
      const endIndex = startIndex + para.length;
      sections.push({
        content: para.trim(),
        startIndex,
        endIndex,
      });
      currentIndex = endIndex + 2; // +2 for \n\n
    }
  });
  
  return sections;
}

/**
 * 簡單的文本分割（用於大section的進一步分割）
 */
function splitTextIntoChunksSimple(
  text: string,
  baseStartIndex: number
): Array<{ content: string; startIndex: number; endIndex: number }> {
  const chunks: Array<{ content: string; startIndex: number; endIndex: number }> = [];
  let startIndex = 0;
  
  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + CHUNK_SIZE, text.length);
    const chunkText = text.slice(startIndex, endIndex);
    
    chunks.push({
      content: chunkText.trim(),
      startIndex: baseStartIndex + startIndex,
      endIndex: baseStartIndex + endIndex,
    });
    
    startIndex = endIndex - CHUNK_OVERLAP;
  }
  
  return chunks;
}
