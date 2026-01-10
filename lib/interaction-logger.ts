import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export type InteractionRecord = {
  id: string;
  timestamp: string;
  question: string;
  answer: string;
  sources?: (string | { type: "file" | "link"; url?: string; title?: string; pageNumber?: number })[];
  fileSources?: { title: string; path: string; pageNumber?: number }[];
  model?: string;
  sessionId: string;
  relevantQAs?: number[]; // QA IDs that were used
};

const INTERACTIONS_DIR = path.join(process.cwd(), "data", "interactions");

/**
 * 確保interactions目錄存在
 */
async function ensureInteractionsDir() {
  try {
    await fs.mkdir(INTERACTIONS_DIR, { recursive: true });
  } catch (error) {
    // 目錄已存在，忽略錯誤
  }
}

/**
 * 生成匿名session ID（基於IP和User-Agent）
 */
export function generateSessionId(ip: string, userAgent: string): string {
  const combined = `${ip}-${userAgent}`;
  return crypto.createHash("sha256").update(combined).digest("hex").substring(0, 16);
}

/**
 * 獲取當前月份的JSON文件路徑
 */
function getCurrentMonthFile(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return path.join(INTERACTIONS_DIR, `interactions-${year}-${month}.json`);
}

/**
 * 記錄互動（異步，不阻塞）
 */
export async function logInteraction(
  question: string,
  answer: string,
  sessionId: string,
  options?: {
    sources?: InteractionRecord["sources"];
    fileSources?: InteractionRecord["fileSources"];
    model?: string;
    relevantQAs?: number[];
  }
): Promise<void> {
  try {
    await ensureInteractionsDir();

    const record: InteractionRecord = {
      id: `interaction-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      question,
      answer,
      sessionId,
      sources: options?.sources,
      fileSources: options?.fileSources,
      model: options?.model,
      relevantQAs: options?.relevantQAs,
    };

    const filePath = getCurrentMonthFile();

    // 讀取現有記錄
    let records: InteractionRecord[] = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      records = JSON.parse(fileContent);
    } catch (error) {
      // 文件不存在或格式錯誤，從空數組開始
      records = [];
    }

    // 添加新記錄
    records.push(record);

    // 寫回文件
    await fs.writeFile(filePath, JSON.stringify(records, null, 2), "utf-8");
  } catch (error) {
    // 記錄失敗不應影響API響應
    console.error("Failed to log interaction:", error);
  }
}

/**
 * 獲取所有互動記錄
 */
export async function getAllInteractions(): Promise<InteractionRecord[]> {
  try {
    await ensureInteractionsDir();
    const files = await fs.readdir(INTERACTIONS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json"));

    const allRecords: InteractionRecord[] = [];

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(INTERACTIONS_DIR, file);
        const content = await fs.readFile(filePath, "utf-8");
        const records = JSON.parse(content);
        allRecords.push(...records);
      } catch (error) {
        console.error(`Failed to read ${file}:`, error);
      }
    }

    // 按時間排序（最新的在前）
    return allRecords.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error("Failed to get interactions:", error);
    return [];
  }
}

/**
 * 獲取指定日期範圍的互動記錄
 */
export async function getInteractionsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<InteractionRecord[]> {
  const allRecords = await getAllInteractions();
  return allRecords.filter((record) => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= startDate && recordDate <= endDate;
  });
}

/**
 * 搜索互動記錄
 */
export async function searchInteractions(query: string): Promise<InteractionRecord[]> {
  const allRecords = await getAllInteractions();
  const queryLower = query.toLowerCase();

  return allRecords.filter((record) => {
    return (
      record.question.toLowerCase().includes(queryLower) ||
      record.answer.toLowerCase().includes(queryLower)
    );
  });
}

