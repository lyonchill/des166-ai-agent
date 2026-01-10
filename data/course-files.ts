import { TextChunk } from "@/lib/pdf-parser";

export type CourseFile = {
  id: string;
  title: string;
  description: string;
  filePath: string; // public/files/ 下的路徑
  category: string;
  uploadDate: string;
  fileType: "pdf" | "docx" | "markdown";
  chunks?: TextChunk[]; // 用於RAG的文本塊
  fileSize?: number; // 文件大小（字節）
};

// 課程文件數據庫
export const courseFiles: CourseFile[] = [
  {
    id: "file-calendar-2026",
    title: "DESIGN 166 WIN2026 Course Calendar",
    description: "Course calendar with schedule, due dates, and important dates for Winter 2026",
    filePath: "/files/course-materials/DESIGN 166_WIN2026_Calendar - Course Calendar (1).pdf",
    category: "syllabus",
    uploadDate: new Date().toISOString(),
    fileType: "pdf",
    fileSize: 62464, // ~61KB
    // 手動添加關鍵chunks，避免PDF解析的內存問題
    chunks: [
      {
        id: "calendar-chunk-1",
        fileId: "file-calendar-2026",
        content: "Week 1: 1.05 LECTURE - Introduction, Project 1: Visual Communication Design. DUE: Read Week 1 Files before 10am on FRI 1.10, Project 1 Design Brief due before class on MON 1.12, Project 1 Mindmap before class on MON 1.12",
        pageNumber: 1,
        startIndex: 0,
        endIndex: 200,
      },
      {
        id: "calendar-chunk-2",
        fileId: "file-calendar-2026",
        content: "Week 2: 1.12 LECTURE - Composition: Unity + Variety, Balance, Movement, Space. 1.16 CRITIQUE #1: Initial Cover Photos - Bring 6 different covers, each with a unique photo. Each cover should be 'hc11' and centered on an 11x17\" printout.",
        pageNumber: 1,
        startIndex: 200,
        endIndex: 400,
      },
      {
        id: "calendar-chunk-3",
        fileId: "file-calendar-2026",
        content: "Week 3: 1.19 MLK HOLIDAY. 1.23 CRITIQUE #2: Developed Cover Photos w/ Type - Bring 6 different covers, each with a unique visualization. Each cover should be 'hc11' and centered on an 11x17\" printout. Mount three covers for practice.",
        pageNumber: 1,
        startIndex: 400,
        endIndex: 600,
      },
      {
        id: "calendar-chunk-4",
        fileId: "file-calendar-2026",
        content: "Week 4: 1.30 CRITIQUE #3: Final Cover Designs - Bring six 'hc11' covers, centered and mounted on black 12x14\" Antigain paper. Submit Final Two Files for Grading on Canvas: Cover 1 and Cover 2, Submit Final Two Mounted Covers in person at START of lecture on Mon 2/2.",
        pageNumber: 1,
        startIndex: 600,
        endIndex: 800,
      },
      {
        id: "calendar-chunk-5",
        fileId: "file-calendar-2026",
        content: "Week 5: 2.02 LECTURE - Project Introduction: MOREN, PLEASE READ Project 2: Design Brief. 2.06 CRITIQUE #1: Sketches/Paper Models - Bring sketches for 3 different design concepts. Each sketch should be on a sheet of 11x17\" paper or two 8.5x11\" pages.",
        pageNumber: 1,
        startIndex: 800,
        endIndex: 1000,
      },
      {
        id: "calendar-chunk-6",
        fileId: "file-calendar-2026",
        content: "Week 6: 2.09 LECTURE - Cardboard Prototyping, Review Sketch Models. 2.13 CRITIQUE #2: Corrugated Prototypes - Bring three prototypes built from cardboard at 1/3 scale (8-flute preferred, but foraged cardboard OK).",
        pageNumber: 1,
        startIndex: 1000,
        endIndex: 1200,
      },
      {
        id: "calendar-chunk-7",
        fileId: "file-calendar-2026",
        content: "Week 7: 2.16 PRESIDENT'S DAY HOLIDAY. 2.20 CRITIQUE #3: Evolved Prototypes - Bring two prototypes built from 8 flute cardboard at 1/3 scale, no tape or glue. These should be variations on a single concept direction.",
        pageNumber: 1,
        startIndex: 1200,
        endIndex: 1400,
      },
      {
        id: "calendar-chunk-8",
        fileId: "file-calendar-2026",
        content: "Week 8: 2.23 LECTURE - Final Documentation Requirements: Photos, Net, Reflection. Introduce Project 3: IxD Journey Map and Design Solutions. 2.27 FINAL CRITIQUE #4: Final Refined Model - Bring at least two models to class.",
        pageNumber: 1,
        startIndex: 1400,
        endIndex: 1600,
      },
      {
        id: "calendar-chunk-9",
        fileId: "file-calendar-2026",
        content: "Week 9: 3.02 LECTURE - Transforming insights from your journey map into 'How Might We' Questions. Project 3: Final cardboard model + net documentation (if hand-drawn) due at lecture. 3.06 CRITIQUE #1: Slide Deck Draft - Bring a draft of your slide deck (on your laptop or iPad).",
        pageNumber: 1,
        startIndex: 1600,
        endIndex: 1800,
      },
      {
        id: "calendar-chunk-10",
        fileId: "file-calendar-2026",
        content: "Week 10: 3.09 LIVE CRITIQUE - Review of How Might We and Concept Cards with UW IxD faculty: James Pierce. 3.11 Final Advice on Project 3, Course End + Final Student Survey, UW Design Major Application Process. 3.12 CRITIQUE #2: Refined Slide Deck Draft - Final deck due next Thursday (during Finals Week).",
        pageNumber: 1,
        startIndex: 1800,
        endIndex: 2000,
      },
    ],
  },
];

/**
 * 根據ID獲取文件
 */
export function getCourseFileById(id: string): CourseFile | undefined {
  return courseFiles.find((file) => file.id === id);
}

/**
 * 根據分類獲取文件
 */
export function getCourseFilesByCategory(category: string): CourseFile[] {
  return courseFiles.filter((file) => file.category === category);
}

/**
 * 獲取所有文件
 */
export function getAllCourseFiles(): CourseFile[] {
  return courseFiles;
}

/**
 * 添加新文件
 */
export function addCourseFile(file: CourseFile): void {
  courseFiles.push(file);
}

/**
 * 刪除文件
 */
export function removeCourseFile(id: string): boolean {
  const index = courseFiles.findIndex((file) => file.id === id);
  if (index !== -1) {
    courseFiles.splice(index, 1);
    return true;
  }
  return false;
}

