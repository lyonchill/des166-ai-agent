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
    filePath: "/files/course-materials/DESIGN-166-WIN2026-Calendar.md",
    category: "syllabus",
    uploadDate: new Date().toISOString(),
    fileType: "markdown",
    fileSize: 7759, // ~7.6KB - Markdown文件比PDF小很多
    // 使用Markdown解析器自動生成的chunks，結構清晰且精準
    chunks: [
      {
        id: "file-calendar-2026-chunk-0",
        fileId: "file-calendar-2026",
        content: "# DESIGN 166 WIN2026 Course Calendar\n\n**Professor:** Karen Cheng (lecheng@uw.edu)  \n**Professor:** Dominic Muren (dmuren@uw.edu)  \n**Teaching Assistant:** Li Yuan Chou (lachou@uw.edu)  \n**Teaching Assistant:** Jeff Jiang (jefjiang@uw.edu)\n\n---",
        startIndex: 0,
        endIndex: 245,
      },
      {
        id: "file-calendar-2026-chunk-1",
        fileId: "file-calendar-2026",
        content: "## Week 1: Jan 5 - Jan 9",
        startIndex: 245,
        endIndex: 271,
      },
      {
        id: "file-calendar-2026-chunk-2",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Li Qieqiu, Awage\n- Project 1: Visual Communication Design\n- Photography Basics, Photographic Lighting",
        startIndex: 271,
        endIndex: 388,
      },
      {
        id: "file-calendar-2026-chunk-3",
        fileId: "file-calendar-2026",
        content: "### DUE DATES\n- **Read Week 1 Files** before 10am on Friday, January 10, 2026\n- **Project 1 Design Brief** due before class on Monday, January 12, 2026\n- **Project 1 Mindmap** before class on Monday, January 12, 2026",
        startIndex: 388,
        endIndex: 558,
      },
      {
        id: "file-calendar-2026-chunk-4",
        fileId: "file-calendar-2026",
        content: "### SMALL GROUP DISCUSSION\n- Exchange name/phone # with two peers\n- Pair activity: Photo mapping exercise for Project 1",
        startIndex: 558,
        endIndex: 679,
      },
      {
        id: "file-calendar-2026-chunk-5",
        fileId: "file-calendar-2026",
        content: "### SPECIAL\n- **DUE AT 5PM ON FRIDAY, JANUARY 9, 2026:** Syllabus Size, Student Info Survey\n\n---",
        startIndex: 679,
        endIndex: 762,
      },
      {
        id: "file-calendar-2026-chunk-6",
        fileId: "file-calendar-2026",
        content: "## Week 2: Jan 12 - Jan 16",
        startIndex: 762,
        endIndex: 790,
      },
      {
        id: "file-calendar-2026-chunk-7",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Composition: Unity + Variety\n- Composition: Balance, Movement, Space\n- Using Photoshop and Affinity Photo: 3DFF\n- Printing at URL CHENG\n- Literal vs. Metaphor: CHENG\n- Illustration + Collage: CHENG",
        startIndex: 790,
        endIndex: 1003,
      },
      {
        id: "file-calendar-2026-chunk-8",
        fileId: "file-calendar-2026",
        content: "### DUE BEFORE CLASS ON WEDNESDAY, JANUARY 14, 2026\n- Review Photoshop/Affinity/Tutorials\n- Read Week 1 Readings\n- Read Printing and Mounting Your Cover",
        startIndex: 1003,
        endIndex: 1138,
      },
      {
        id: "file-calendar-2026-chunk-9",
        fileId: "file-calendar-2026",
        content: "### CRITIQUE #1: Initial Cover Photos\n- Bring 6 different covers, each with a unique photo\n- Each cover should be 'hc11' and centered on an 11x17\" printout\n- No need to trim or mount for this critique\n- **DUE AT NOON:** Upload a grag of each cover to this Canvas assignment\n\n---",
        startIndex: 1138,
        endIndex: 1418,
      },
      {
        id: "file-calendar-2026-chunk-10",
        fileId: "file-calendar-2026",
        content: "## Week 3: Jan 19 - Jan 23",
        startIndex: 1418,
        endIndex: 1446,
      },
      {
        id: "file-calendar-2026-chunk-11",
        fileId: "file-calendar-2026",
        content: "### HOLIDAY\n- **MLK HOLIDAY**",
        startIndex: 1446,
        endIndex: 1477,
      },
      {
        id: "file-calendar-2026-chunk-12",
        fileId: "file-calendar-2026",
        content: "### DUE BEFORE CLASS ON WEDNESDAY, JANUARY 21, 2026\n- Read Week 1 Readings\n- Review: Illustrator/Affinity Designer Tutorials\n- Watch the Mounting Demo Video",
        startIndex: 1477,
        endIndex: 1616,
      },
      {
        id: "file-calendar-2026-chunk-13",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Project 1 Review\n- Type Placement\n- Typesetting in Illustrator + Affinity: LI YUAN",
        startIndex: 1616,
        endIndex: 1714,
      },
      {
        id: "file-calendar-2026-chunk-14",
        fileId: "file-calendar-2026",
        content: "### CRITIQUE #2: Developed Cover Photos w/ Type\n- Bring 6 different covers, each with a unique visualization\n- Each cover should be 'hc11' and centered on an 11x17\" printout\n- Place all required type on your covers, or indicate where type elements will be placed on your cover design with levers\n- Mount three covers for practice\n- **DUE AT NOON:** Upload a grag of each cover to this Canvas Assignment\n\n---",
        startIndex: 1714,
        endIndex: 2123,
      },
      {
        id: "file-calendar-2026-chunk-15",
        fileId: "file-calendar-2026",
        content: "## Week 4: Jan 26 - Jan 30",
        startIndex: 2123,
        endIndex: 2151,
      },
      {
        id: "file-calendar-2026-chunk-16",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Final Refinement of Project 1\n- Type Ideas\n- Awage Self-Reflection on Project 1",
        startIndex: 2151,
        endIndex: 2246,
      },
      {
        id: "file-calendar-2026-chunk-17",
        fileId: "file-calendar-2026",
        content: "### DUE BEFORE CLASS ON WEDNESDAY, JANUARY 28, 2026\n- Read Week 6 Readings",
        startIndex: 2246,
        endIndex: 2303,
      },
      {
        id: "file-calendar-2026-chunk-18",
        fileId: "file-calendar-2026",
        content: "### BREAKOUT INTO CRITIQUE SECTIONS\n- We will use lecture time for design feedback before next Monday's turn-in of Project 1\n- Bring as many prints as you wish for feedback from your peers and instructors",
        startIndex: 2303,
        endIndex: 2509,
      },
      {
        id: "file-calendar-2026-chunk-19",
        fileId: "file-calendar-2026",
        content: "### CRITIQUE #3: Final Cover Designs\n- Bring six 'hc11' covers, centered and mounted on black 12x14\" Antigain paper\n- If you like, you can select your two best covers and turn them in at the end of class\n- If you want to refine them over the weekend, you can turn in your final two covers at the **START of lecture on Monday, February 2, 2026**\n- **DUE AT NOON:** Upload a grag of each cover to this Canvas Assignment\n\n---",
        startIndex: 2509,
        endIndex: 2916,
      },
      {
        id: "file-calendar-2026-chunk-20",
        fileId: "file-calendar-2026",
        content: "## Week 5: Feb 2 - Feb 6",
        startIndex: 2916,
        endIndex: 2942,
      },
      {
        id: "file-calendar-2026-chunk-21",
        fileId: "file-calendar-2026",
        content: "### DUE AT START OF CLASS @ 12:30PM ON MONDAY, FEBRUARY 2, 2026\n- Submit Final Two Files for Grading on Canvas: Cover 1 and Cover 2\n- Submit Final Two Mounted Covers in person",
        startIndex: 2942,
        endIndex: 3091,
      },
      {
        id: "file-calendar-2026-chunk-22",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Improving Your Design Process: CHENG\n- Project Introduction: MOREN\n- **PLEASE READ Project 2: Design Brief**",
        startIndex: 3091,
        endIndex: 3215,
      },
      {
        id: "file-calendar-2026-chunk-23",
        fileId: "file-calendar-2026",
        content: "### DUE BEFORE CLASS ON WEDNESDAY, FEBRUARY 4, 2026\n- Read Week 5 Readings",
        startIndex: 3215,
        endIndex: 3272,
      },
      {
        id: "file-calendar-2026-chunk-24",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Solution for Project 2\n- Awage Box Tutorials",
        startIndex: 3272,
        endIndex: 3332,
      },
      {
        id: "file-calendar-2026-chunk-25",
        fileId: "file-calendar-2026",
        content: "### BEFORE MONDAY, FEBRUARY 9, 2026\n- Watch the three-part video series\n- Watch #1-4 of this Final Jackson video series\n- Watch the video on corrugated cardboard",
        startIndex: 3332,
        endIndex: 3479,
      },
      {
        id: "file-calendar-2026-chunk-26",
        fileId: "file-calendar-2026",
        content: "### SPECIAL WEDNESDAY, FEBRUARY 4, 2026 Q+A SESSION\n- With VCD, IxD, and ID majors\n- 6:30-8PM, HIGH RH TBD",
        startIndex: 3479,
        endIndex: 3567,
      },
      {
        id: "file-calendar-2026-chunk-27",
        fileId: "file-calendar-2026",
        content: "### CRITIQUE #1: Sketches/Paper Models\n- Bring sketches for 3 different design concepts\n- Each sketch should be on a sheet of 11x17\" paper or two 8.5x11\" pages\n- For each concept, create a 1/3 scale paper \"sketch\"/mode-up\n- **DUE AT NOON:** Upload scans of your sketches and photographs of your \"cardboard sketch\" prototypes to this Canvas Assignment\n\n---",
        startIndex: 3567,
        endIndex: 3924,
      },
      {
        id: "file-calendar-2026-chunk-28",
        fileId: "file-calendar-2026",
        content: "## Week 6: Feb 9 - Feb 13",
        startIndex: 3924,
        endIndex: 3951,
      },
      {
        id: "file-calendar-2026-chunk-29",
        fileId: "file-calendar-2026",
        content: "### DUE AT START OF CLASS @ 12:30PM ON MONDAY, FEBRUARY 9, 2026\n- Bring Box Tutorial to lecture\n- Also upload images of your box tutorial boxes to Canvas by noon\n- Submit Self-Reflection on Project 1 on Canvas before class",
        startIndex: 3951,
        endIndex: 4147,
      },
      {
        id: "file-calendar-2026-chunk-30",
        fileId: "file-calendar-2026",
        content: "### DUE BEFORE CLASS ON WEDNESDAY, FEBRUARY 11, 2026\n- Read Week 6 Readings",
        startIndex: 4147,
        endIndex: 4204,
      },
      {
        id: "file-calendar-2026-chunk-31",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Cardboard Prototyping (Dominic Recording)\n- Review Sketch Models\n- Photographing your cardboard model\n- 3-D Aesthetics",
        startIndex: 4204,
        endIndex: 4338,
      },
      {
        id: "file-calendar-2026-chunk-32",
        fileId: "file-calendar-2026",
        content: "### CRITIQUE #2: Corrugated Prototypes\n- Bring three prototypes built from cardboard at 1/3 scale (8-flute preferred, but foraged cardboard OK)\n- Tape and hot glue okay, but you should have tabs planned\n- Bring sketches as needed (only if your model has weaknesses—use sketches to communicate the concept more clearly)\n- **DUE AT NOON:** Upload photographs of your three stool prototypes along with updated sketches to this Canvas Assignment\n\n---",
        startIndex: 4338,
        endIndex: 4786,
      },
      {
        id: "file-calendar-2026-chunk-33",
        fileId: "file-calendar-2026",
        content: "## Week 7: Feb 16 - Feb 20",
        startIndex: 4786,
        endIndex: 4814,
      },
      {
        id: "file-calendar-2026-chunk-34",
        fileId: "file-calendar-2026",
        content: "### HOLIDAY\n- **PRESIDENT'S DAY HOLIDAY**",
        startIndex: 4814,
        endIndex: 4857,
      },
      {
        id: "file-calendar-2026-chunk-35",
        fileId: "file-calendar-2026",
        content: "### PROJECT 2 REVIEW: LIVE CRITIQUE\n- With UW 3D faculty: Jason Germany and Sang-gyoon Ahn\n- Bring your best prototype (see that you want feedback on) to class",
        startIndex: 4857,
        endIndex: 5018,
      },
      {
        id: "file-calendar-2026-chunk-36",
        fileId: "file-calendar-2026",
        content: "### CRITIQUE #3: Evolved Prototypes\n- Bring two prototypes built from 8 flute cardboard at 1/3 scale, no tape or glue\n- These should be variations on a single concept direction\n- **DUE AT NOON:** Upload photographs of your final prototypes to this Canvas assignment\n\n---",
        startIndex: 5018,
        endIndex: 5290,
      },
      {
        id: "file-calendar-2026-chunk-37",
        fileId: "file-calendar-2026",
        content: "## Week 8: Feb 23 - Feb 27",
        startIndex: 5290,
        endIndex: 5318,
      },
      {
        id: "file-calendar-2026-chunk-38",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Final Documentation Requirements: Photos, Net, Reflection\n- Introduce Project 3: IxD Journey Map and Design Solutions",
        startIndex: 5318,
        endIndex: 5451,
      },
      {
        id: "file-calendar-2026-chunk-39",
        fileId: "file-calendar-2026",
        content: "### DUE BEFORE CLASS ON WEDNESDAY, FEBRUARY 25, 2026\n- Read Week 8 Readings",
        startIndex: 5451,
        endIndex: 5508,
      },
      {
        id: "file-calendar-2026-chunk-40",
        fileId: "file-calendar-2026",
        content: "### BREAKOUT INTO CRITIQUE SECTIONS\n- We will use lecture time for a peer interviews to draft content for your IxD journey map",
        startIndex: 5508,
        endIndex: 5636,
      },
      {
        id: "file-calendar-2026-chunk-41",
        fileId: "file-calendar-2026",
        content: "### CRITIQUE #4: Final Refined Model\n- Bring at least two models to class\n- You should bring additional models or partial prototypes/variations as needed to get the necessary feedback to finalize your project\n- Ideally, your additional models allow instructors/peers to quickly determine if a particular option A or B is superior\n- **DUE AT NOON:** Upload what you brought to today's critique to this Canvas assignment\n\n---",
        startIndex: 5636,
        endIndex: 6061,
      },
      {
        id: "file-calendar-2026-chunk-42",
        fileId: "file-calendar-2026",
        content: "## Week 9: Mar 2 - Mar 6",
        startIndex: 6061,
        endIndex: 6087,
      },
      {
        id: "file-calendar-2026-chunk-43",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Transforming insights from your journey map into \"How Might We\" Questions\n- **Project 3:** Final cardboard model + net documentation (if hand-drawn) due at lecture",
        startIndex: 6087,
        endIndex: 6266,
      },
      {
        id: "file-calendar-2026-chunk-44",
        fileId: "file-calendar-2026",
        content: "### DUE BEFORE CLASS ON WEDNESDAY, MARCH 4, 2026\n- Read Week 9 Readings",
        startIndex: 6266,
        endIndex: 6323,
      },
      {
        id: "file-calendar-2026-chunk-45",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Drawn Visuals for the IxD Project\n- Review of \"How Might We\" questions and Brainstorming Solutions (Concept Can't Lee Critique)",
        startIndex: 6323,
        endIndex: 6466,
      },
      {
        id: "file-calendar-2026-chunk-46",
        fileId: "file-calendar-2026",
        content: "### CRITIQUE #1: Slide Deck Draft\n- Bring a draft of your slide deck (on your laptop or iPad) for small group critique\n- **DUE AT NOON:** Upload your current slide deck draft to this Canvas assignment\n- You should have the first 15 pages of the slide deck filled out:\n  - Your Journey map\n  - The nine \"How Might We\" Questions\n  - Three Initial Concepts\n\n---",
        startIndex: 6466,
        endIndex: 6826,
      },
      {
        id: "file-calendar-2026-chunk-47",
        fileId: "file-calendar-2026",
        content: "## Week 10: Mar 9 - Mar 12",
        startIndex: 6826,
        endIndex: 6854,
      },
      {
        id: "file-calendar-2026-chunk-48",
        fileId: "file-calendar-2026",
        content: "### LIVE CRITIQUE\n- Review of How Might We and Concept Cards with UW IxD faculty: James Pierce\n- **PLEASE PUT YOUR CONCEPT CARD INTO THIS GOOGLE SLIDE DECK**",
        startIndex: 6854,
        endIndex: 7013,
      },
      {
        id: "file-calendar-2026-chunk-49",
        fileId: "file-calendar-2026",
        content: "### LECTURE\n- Final Advice on Project 3\n- Prop for final by making a free Figma education account\n- Course End + Final Student Survey\n- UW Design Major Application Process",
        startIndex: 7013,
        endIndex: 7186,
      },
      {
        id: "file-calendar-2026-chunk-50",
        fileId: "file-calendar-2026",
        content: "### CRITIQUE #2: Refined Slide Deck Draft\n- Bring a refined draft of your slide deck (on your laptop or iPad) for small group critique\n- You should have a draft of your final solution in the slide deck\n- **NO CANVAS UPLOAD, AS FINAL DECK IS DUE NEXT THURSDAY (DURING FINALS WEEK)**\n\n---",
        startIndex: 7186,
        endIndex: 7474,
      },
      {
        id: "file-calendar-2026-chunk-51",
        fileId: "file-calendar-2026",
        content: "## Important Notes\n\n- All critiques require physical presence unless otherwise specified\n- Canvas uploads are typically due at noon on the critique day\n- Always check Canvas for the most up-to-date assignment details\n- Contact instructors or TAs if you have questions about assignments",
        startIndex: 7474,
        endIndex: 7759,
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

