import { NextRequest, NextResponse } from "next/server";
import {
  getAllInteractions,
  getInteractionsByDateRange,
  searchInteractions,
} from "@/lib/interaction-logger";

/**
 * GET: 獲取互動記錄
 * 查詢參數：
 * - search: 搜索關鍵字
 * - startDate: 開始日期 (ISO格式)
 * - endDate: 結束日期 (ISO格式)
 * - limit: 限制返回數量
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = searchParams.get("limit");

    let interactions;

    if (search) {
      // 搜索模式
      interactions = await searchInteractions(search);
    } else if (startDate && endDate) {
      // 日期範圍模式
      interactions = await getInteractionsByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      // 獲取所有記錄
      interactions = await getAllInteractions();
    }

    // 應用限制
    if (limit) {
      const limitNum = parseInt(limit, 10);
      interactions = interactions.slice(0, limitNum);
    }

    return NextResponse.json({
      interactions,
      total: interactions.length,
    });
  } catch (error: any) {
    console.error("Error fetching interactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch interactions" },
      { status: 500 }
    );
  }
}

