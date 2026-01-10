# File Management Guide

Since you're managing files locally in Cursor, here's how to add course files to the system:

## 推薦：使用 Markdown 文件

**為什麼選擇 Markdown？**
- ✅ **更精準**：直接讀取文本，無需解析，100%準確
- ✅ **無內存問題**：不需要PDF解析庫，不會出現內存錯誤
- ✅ **結構清晰**：Markdown格式讓AI更容易理解內容結構
- ✅ **易於維護**：可以直接編輯和更新
- ✅ **搜索更準確**：文本搜索比PDF解析更可靠

## Steps to Add a Markdown File

### 1. 創建或放置 Markdown 文件
將 Markdown 文件放在 `public/files/course-materials/` 目錄：
```
public/
  └── files/
      └── course-materials/
          └── calendar.md
```

### 2. 解析 Markdown 文件
運行腳本自動解析並生成chunks：

```bash
# 簡單模式（按字符數分割）
tsx scripts/parse-markdown.ts public/files/course-materials/calendar.md

# 智能模式（按標題和段落分割，推薦）
tsx scripts/parse-markdown.ts public/files/course-materials/calendar.md --smart
```

腳本會輸出chunks的JSON，可以直接複製使用。

### 3. 添加文件元數據到 `data/course-files.ts`

打開 `data/course-files.ts` 並添加文件：

```typescript
export const courseFiles: CourseFile[] = [
  {
    id: "file-calendar-2026",
    title: "DESIGN 166 WIN2026 Course Calendar",
    description: "Course calendar with schedule, due dates, and important dates",
    filePath: "/files/course-materials/calendar.md",
    category: "syllabus",
    uploadDate: new Date().toISOString(),
    fileType: "markdown",
    fileSize: 12345, // 文件大小（字節）
    chunks: [
      // 從 parse-markdown.ts 腳本複製的chunks
      {
        id: "calendar-chunk-1",
        fileId: "file-calendar-2026",
        content: "Week 1: ...",
        startIndex: 0,
        endIndex: 200,
      },
      // ... 更多chunks
    ],
  },
];
```

### 4. 提交和部署

```bash
git add public/files/course-materials/calendar.md
git add data/course-files.ts
git commit -m "Add course calendar as Markdown"
git push
```

## Steps to Add a PDF File（不推薦，有內存問題）

### 1. Place the PDF file
Put your PDF file in the `public/files/course-materials/` directory:
```
public/
  └── files/
      └── course-materials/
          └── your-file.pdf
```

### 2. Parse the PDF (optional but recommended)
Run this script to parse the PDF and extract text chunks:
```bash
node scripts/parse-pdf.js public/files/course-materials/your-file.pdf
```

Or manually parse it using the `parsePDF` function from `lib/pdf-parser.ts`.

### 3. Add file metadata to `data/course-files.ts`

Open `data/course-files.ts` and add your file to the `courseFiles` array:

```typescript
export const courseFiles: CourseFile[] = [
  {
    id: "file-1",
    title: "Course Syllabus",
    description: "DES166 course syllabus and requirements",
    filePath: "/files/course-materials/your-file.pdf",
    category: "syllabus",
    uploadDate: "2024-01-15T00:00:00Z",
    fileType: "pdf",
    chunks: [
      // Add parsed chunks here if you parsed the PDF
      // Each chunk should have: id, fileId, content, pageNumber, startIndex, endIndex
    ],
    fileSize: 123456, // File size in bytes
  },
  // ... other files
];
```

### 4. Parse PDF for RAG (Recommended)

To enable AI to search within the PDF content, you need to parse it and add chunks:

```typescript
import { parsePDF } from "@/lib/pdf-parser";

// In a script or during development
const result = await parsePDF("public/files/course-materials/your-file.pdf");
// result.chunks contains all the text chunks
```

Then add the chunks to your file metadata in `course-files.ts`.

### 5. Commit and Deploy

```bash
git add public/files/course-materials/your-file.pdf
git add data/course-files.ts
git commit -m "Add course file: your-file.pdf"
git push
```

Render will automatically deploy the changes.

## File Structure

- **PDF files**: `public/files/course-materials/*.pdf`
- **Metadata**: `data/course-files.ts`
- **Parsed chunks**: Stored in `course-files.ts` as part of file metadata

## Notes

- Files in `public/` are publicly accessible
- Make sure PDFs are text-based (not scanned images) for best parsing results
- File size limit: Recommended under 10MB
- The AI will search both QA database and PDF file content when answering questions
