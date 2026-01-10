# PDF解析內存問題說明

## 問題描述

在解析PDF文件時出現 `JavaScript heap out of memory` 錯誤，這是因為：

1. **pdf-parse庫的內存需求**：
   - pdf-parse使用pdfjs庫來解析PDF
   - 需要將整個PDF文件加載到內存中
   - 解析過程中會創建大量臨時對象
   - 對於複雜的PDF（包含圖片、表格等），內存需求會急劇增加

2. **Node.js默認內存限制**：
   - Node.js默認堆內存限制約為1.5-2GB
   - 解析大型PDF時可能超過這個限制

## 當前影響

### ✅ 不影響的功能
- **文件連結顯示**：AI仍然可以在回答中提供PDF文件的下載連結
- **文件元數據**：文件標題、描述、分類等信息正常顯示
- **基本搜索**：可以通過文件名和描述搜索文件

### ❌ 受影響的功能
- **RAG搜索**：AI無法搜索PDF文件內的具體內容
- **內容引用**：AI無法引用PDF中的具體段落或頁碼
- **語義搜索**：無法根據問題內容在PDF中找到相關信息

## 解決方案

### 方案1：增加Node.js內存限制（快速解決）

在運行解析腳本時增加內存：

```bash
# 增加到4GB內存
NODE_OPTIONS="--max-old-space-size=4096" npx tsx scripts/parse-and-add-file.ts "filename.pdf"

# 或者在package.json中添加腳本
"scripts": {
  "parse-pdf": "NODE_OPTIONS='--max-old-space-size=4096' tsx scripts/parse-and-add-file.ts"
}
```

### 方案2：優化解析方式（推薦）

修改解析邏輯，只解析文本內容，跳過圖片和複雜格式：

```typescript
// 在 lib/pdf-parser.ts 中
const parser = new PDFParse({ 
  data: fileBuffer,
  verbosity: 0, // 減少輸出
  // 只提取文本，跳過圖片
});
```

### 方案3：分批處理（適合大文件）

對於大文件，可以逐頁解析：

```typescript
// 只解析前幾頁或特定頁面
const result = await parser.getText({
  first: 1,
  last: 5, // 只解析前5頁
});
```

### 方案4：使用更輕量的PDF庫

考慮使用其他PDF解析庫：
- `pdfjs-dist`（更輕量，但需要更多配置）
- `pdf2json`（專注於文本提取）

### 方案5：手動提取關鍵內容（最簡單）

對於課程日曆這種結構化文檔，可以手動提取關鍵信息：

```typescript
// 在 course-files.ts 中手動添加關鍵chunks
chunks: [
  {
    id: "calendar-chunk-1",
    fileId: "file-calendar-2026",
    content: "Week 1: Project 1 due dates...",
    pageNumber: 1,
    startIndex: 0,
    endIndex: 100,
  },
  // ...
]
```

## 建議

**對於當前情況（課程日曆PDF）：**

1. **短期方案**：使用方案1增加內存限制，嘗試解析
2. **中期方案**：如果解析成功，但chunks太多，可以只保留關鍵chunks
3. **長期方案**：考慮使用Supabase + 向量搜索，將PDF內容存儲在數據庫中

## 測試建議

先測試小文件：
```bash
# 測試61KB的日曆文件
NODE_OPTIONS="--max-old-space-size=4096" npx tsx scripts/parse-and-add-file.ts "DESIGN 166_WIN2026_Calendar - Course Calendar (1).pdf"
```

如果成功，再嘗試其他文件。

## 當前狀態

目前文件已添加到系統中，但**沒有chunks**，這意味著：
- ✅ 學生可以看到文件連結
- ✅ AI可以告訴學生"請查看課程日曆PDF"
- ❌ AI無法直接從PDF中提取具體日期或信息
- ❌ 無法搜索PDF內容

**這對課程日曆來說可能足夠**，因為學生通常需要查看完整的日曆，而不是讓AI讀取所有內容。

