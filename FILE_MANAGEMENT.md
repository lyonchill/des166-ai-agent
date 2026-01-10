# File Management Guide

Since you're managing files locally in Cursor, here's how to add PDF files to the system:

## Steps to Add a PDF File

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

