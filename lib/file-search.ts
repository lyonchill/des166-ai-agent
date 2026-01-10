import { CourseFile, getAllCourseFiles } from "@/data/course-files";
import { TextChunk } from "@/lib/pdf-parser";

export type FileSearchResult = {
  file: CourseFile;
  chunks: TextChunk[];
  score: number;
};

/**
 * 在課程文件中搜索相關內容
 */
export function searchCourseFiles(
  query: string,
  topK: number = 5
): FileSearchResult[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower
    .split(/\s+/)
    .filter((word) => word.length > 2); // 過濾短詞

  const allFiles = getAllCourseFiles();
  const results: FileSearchResult[] = [];

  // 遍歷所有文件
  allFiles.forEach((file) => {
    if (!file.chunks || file.chunks.length === 0) {
      return; // 跳過沒有chunks的文件
    }

    const matchedChunks: TextChunk[] = [];
    let totalScore = 0;

    // 搜索每個chunk
    file.chunks.forEach((chunk) => {
      const chunkLower = chunk.content.toLowerCase();
      let chunkScore = 0;

      // 計算匹配分數
      queryWords.forEach((word) => {
        if (chunkLower.includes(word)) {
          // 完全匹配得分更高
          const exactMatch = chunkLower === word || chunkLower.includes(` ${word} `) || chunkLower.includes(`${word} `) || chunkLower.includes(` ${word}`);
          chunkScore += exactMatch ? 3 : 1;
        }
      });

      if (chunkScore > 0) {
        matchedChunks.push(chunk);
        totalScore += chunkScore;
      }
    });

    // 如果有匹配的chunks，添加到結果中
    if (matchedChunks.length > 0) {
      results.push({
        file,
        chunks: matchedChunks.slice(0, 3), // 每個文件最多返回3個最相關的chunks
        score: totalScore,
      });
    }
  });

  // 按分數排序並返回topK
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * 格式化文件搜索結果為文本，用於AI context
 */
export function formatFileSearchResults(results: FileSearchResult[]): string {
  return results
    .map((result) => {
      const chunksText = result.chunks
        .map(
          (chunk) =>
            `[${result.file.title}${chunk.pageNumber ? `, Page ${chunk.pageNumber}` : ""}]: ${chunk.content}`
        )
        .join("\n\n");
      return chunksText;
    })
    .join("\n\n");
}

