import { NextRequest, NextResponse } from "next/server";
import { qaData, categories } from "@/data/qa-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const onePerCategory = searchParams.get("onePerCategory") === "true";

    let filteredData = qaData;

    // Filter by category if provided
    if (category) {
      filteredData = qaData.filter((qa) => qa.category === category);
    } else if (onePerCategory) {
      // Return one question from each category
      const onePerCategoryList: typeof qaData = [];
      const seenCategories = new Set<string>();

      for (const qa of qaData) {
        if (!seenCategories.has(qa.category)) {
          seenCategories.add(qa.category);
          onePerCategoryList.push(qa);
        }
      }
      filteredData = onePerCategoryList;
    }

    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit, 10);
      filteredData = filteredData.slice(0, limitNum);
    }

    return NextResponse.json({
      data: filteredData,
      total: qaData.length,
      filtered: filteredData.length,
      categories: categories.map((cat) => ({
        ...cat,
        count: qaData.filter((qa) => qa.category === cat.id).length,
      })),
    });
  } catch (error: any) {
    console.error("QA API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch QA data" },
      { status: 500 }
    );
  }
}

