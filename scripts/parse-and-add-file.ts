#!/usr/bin/env node
// This script requires increased memory: NODE_OPTIONS="--max-old-space-size=4096" npx tsx scripts/parse-and-add-file.ts

import fs from "fs/promises";
import path from "path";
import { parsePDF } from "../lib/pdf-parser";

async function parseAndAddFile() {
  const fileName = process.argv[2];
  
  if (!fileName) {
    console.error("Please provide a file name");
    console.log("Usage: npx tsx scripts/parse-and-add-file.ts <filename.pdf>");
    process.exit(1);
  }

  const filePath = path.join(process.cwd(), "public", "files", "course-materials", fileName);
  
  try {
    // Check if file exists
    await fs.access(filePath);
    
    console.log(`Parsing PDF: ${fileName}...`);
    const result = await parsePDF(filePath);
    
    console.log(`\n✅ Successfully parsed PDF!`);
    console.log(`- Pages: ${result.numPages}`);
    console.log(`- Chunks: ${result.chunks.length}`);
    console.log(`- Text length: ${result.text.length} characters\n`);
    
    // Get file stats
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;
    
    // Generate file ID
    const fileId = `file-${Date.now()}`;
    const filePathForData = `/files/course-materials/${fileName}`;
    
    // Create file metadata
    const fileMetadata = {
      id: fileId,
      title: fileName.replace(/\.pdf$/i, "").replace(/_/g, " "),
      description: "DES166 Course Calendar",
      filePath: filePathForData,
      category: "syllabus",
      uploadDate: new Date().toISOString(),
      fileType: "pdf" as const,
      chunks: result.chunks,
      fileSize: fileSize,
    };
    
    // Output the metadata as JSON for easy copy-paste
    console.log("📋 File metadata to add to course-files.ts:\n");
    console.log(JSON.stringify(fileMetadata, null, 2));
    console.log("\n");
    
    // Also output as TypeScript format
    console.log("📝 TypeScript format:\n");
    const tsFormat = `{
  id: "${fileId}",
  title: "${fileMetadata.title}",
  description: "${fileMetadata.description}",
  filePath: "${filePathForData}",
  category: "syllabus",
  uploadDate: "${fileMetadata.uploadDate}",
  fileType: "pdf",
  chunks: ${JSON.stringify(result.chunks, null, 2).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')},
  fileSize: ${fileSize},
}`;
    console.log(tsFormat);
    
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

parseAndAddFile();

