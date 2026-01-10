import { NextRequest, NextResponse } from "next/server";
import { getAllInteractions } from "@/lib/interaction-logger";
// @ts-ignore
const XLSX = require("xlsx");

/**
 * GET: 導出互動記錄為Excel文件
 */
export async function GET(request: NextRequest) {
  try {
    const interactions = await getAllInteractions();

    // 準備Excel數據
    const excelData = interactions.map((record) => ({
      "時間": new Date(record.timestamp).toLocaleString("zh-TW"),
      "問題": record.question,
      "回答": record.answer,
      "使用的AI模型": record.model || "未知",
      "會話ID": record.sessionId,
      "相關QA ID": record.relevantQAs?.join(", ") || "",
      "文件來源": record.fileSources?.map((f) => `${f.title}${f.pageNumber ? ` (Page ${f.pageNumber})` : ""}`).join("; ") || "",
      "連結來源": record.sources?.filter((s) => typeof s === "string" || s.type === "link").map((s) => typeof s === "string" ? s : s.url).join("; ") || "",
    }));

    // 創建Excel工作簿
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // 設置列寬
    const colWidths = [
      { wch: 20 }, // 時間
      { wch: 50 }, // 問題
      { wch: 80 }, // 回答
      { wch: 20 }, // 模型
      { wch: 20 }, // 會話ID
      { wch: 20 }, // QA ID
      { wch: 40 }, // 文件來源
      { wch: 40 }, // 連結來源
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "互動記錄");

    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // 返回文件
    const filename = `interactions-${new Date().toISOString().split("T")[0]}.xlsx`;
    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Error exporting interactions:", error);
    return NextResponse.json(
      { error: "Failed to export interactions" },
      { status: 500 }
    );
  }
}

