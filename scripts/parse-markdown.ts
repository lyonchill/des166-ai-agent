#!/usr/bin/env tsx
/**
 * 解析Markdown文件並生成chunks
 * 
 * 使用方法：
 * tsx scripts/parse-markdown.ts <markdown-file-path> [--smart]
 * 
 * 範例：
 * tsx scripts/parse-markdown.ts public/files/course-materials/calendar.md
 * tsx scripts/parse-markdown.ts public/files/course-materials/calendar.md --smart
 */

import { parseMarkdown, parseMarkdownSmart } from "../lib/markdown-parser";
import path from "path";

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error("請提供Markdown文件路徑");
    console.log("使用方法：tsx scripts/parse-markdown.ts <markdown-file-path> [--smart]");
    process.exit(1);
  }
  
  const filePath = args[0];
  const useSmart = args.includes("--smart");
  
  try {
    console.log(`正在解析 Markdown 文件: ${filePath}`);
    console.log(`使用模式: ${useSmart ? "智能分割（按標題和段落）" : "簡單分割（按字符數）"}`);
    
    const result = useSmart 
      ? await parseMarkdownSmart(filePath)
      : await parseMarkdown(filePath);
    
    console.log("\n✅ 解析成功！");
    console.log(`總字符數: ${result.text.length}`);
    console.log(`Chunks 數量: ${result.chunks.length}`);
    console.log("\n前3個chunks預覽：\n");
    
    result.chunks.slice(0, 3).forEach((chunk, index) => {
      console.log(`--- Chunk ${index + 1} ---`);
      console.log(`ID: ${chunk.id}`);
      console.log(`長度: ${chunk.content.length} 字符`);
      console.log(`內容預覽: ${chunk.content.substring(0, 200)}...`);
      console.log("");
    });
    
    // 輸出完整的chunks JSON（可以用於複製到 course-files.ts）
    console.log("\n完整的chunks JSON（可以複製到 data/course-files.ts）：\n");
    console.log(JSON.stringify(result.chunks, null, 2));
    
  } catch (error) {
    console.error("❌ 解析失敗:", error);
    process.exit(1);
  }
}

main();
