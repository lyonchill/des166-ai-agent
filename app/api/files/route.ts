import { NextRequest, NextResponse } from "next/server";
import { getAllCourseFiles } from "@/data/course-files";

/**
 * GET: Get all course files list
 * Files are managed locally - add files to public/files/course-materials/ 
 * and update data/course-files.ts manually
 */
export async function GET(request: NextRequest) {
  try {
    const files = getAllCourseFiles();
    return NextResponse.json({ files });
  } catch (error: any) {
    console.error("Error fetching files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

