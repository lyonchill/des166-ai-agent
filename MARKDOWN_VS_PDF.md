# Markdown vs PDF：為什麼選擇 Markdown？

## 比較表

| 特性 | Markdown | PDF |
|------|----------|-----|
| **解析準確度** | ✅ 100% 準確（直接讀取文本） | ⚠️ 依賴PDF解析庫，可能有誤差 |
| **內存使用** | ✅ 極低（直接讀取文本） | ❌ 高（需要加載整個PDF到內存） |
| **解析速度** | ✅ 極快（毫秒級） | ⚠️ 較慢（需要解析PDF結構） |
| **內存錯誤** | ✅ 不會發生 | ❌ 大文件可能導致內存溢出 |
| **結構理解** | ✅ 保留Markdown結構（標題、列表等） | ⚠️ 結構可能丟失 |
| **搜索精度** | ✅ 精確匹配 | ⚠️ 可能因為解析誤差而漏掉內容 |
| **編輯維護** | ✅ 可以直接編輯 | ❌ 需要PDF編輯工具 |
| **版本控制** | ✅ Git友好（文本文件） | ⚠️ 二進制文件，Git diff無用 |

## 實際案例：課程日曆

### PDF 方式遇到的問題：
1. ❌ **內存溢出**：`FATAL ERROR: Ineffective mark-compacts near heap limit`
2. ❌ **解析不完整**：某些內容可能無法正確提取
3. ❌ **需要手動添加chunks**：因為解析失敗，只能手動輸入關鍵內容

### Markdown 方式的優勢：
1. ✅ **無內存問題**：直接讀取文本，不會溢出
2. ✅ **100%準確**：所有內容都能正確讀取
3. ✅ **自動解析**：使用 `parse-markdown.ts` 腳本自動生成chunks
4. ✅ **結構保留**：標題、列表等結構信息保留，AI更容易理解

## 使用建議

### 推薦使用 Markdown 的情況：
- ✅ 課程日曆和時間表
- ✅ 作業指南和要求
- ✅ 課程大綱和說明
- ✅ 任何可以轉換為文本的內容

### 仍可使用 PDF 的情況：
- 📄 包含大量圖表的文件（但需要手動添加關鍵文本）
- 📄 掃描版文件（但需要OCR，建議轉換為Markdown）
- 📄 已經存在的PDF文件（可以轉換為Markdown）

## 如何將 PDF 轉換為 Markdown

### 方法1：手動轉換（推薦）
1. 打開PDF文件
2. 複製文本內容
3. 創建 `.md` 文件
4. 使用Markdown格式整理內容（添加標題、列表等）

### 方法2：使用工具
- **Pandoc**：`pandoc input.pdf -o output.md`
- **在線工具**：如 PDF24、SmallPDF 等
- **Adobe Acrobat**：導出為文本，然後手動格式化為Markdown

## 範例：Markdown 格式的課程日曆

```markdown
# DESIGN 166 WIN2026 Course Calendar

## Week 1: Jan 5 - Jan 9

### LECTURE
- Li Qieqiu, Awage
- Project 1: Visual Communication Design

### DUE DATES
- Read Week 1 Files before 10am on Fri 1.10
- Project 1 Design Brief due before class on Mon 1.12
- Project 1 Mindmap before class on Mon 1.12

## Week 2: Jan 12 - Jan 16

### LECTURE
- Composition: Unity + Variety
- Composition: Balance, Movement, Space

### CRITIQUE #1: Initial Cover Photos
Bring 6 different covers, each with a unique photo.
Each cover should be 'hc11' and centered on an 11x17" printout.
```

這種格式：
- ✅ 結構清晰
- ✅ AI容易理解
- ✅ 搜索精準
- ✅ 易於維護

## 結論

**強烈建議使用 Markdown 格式**，特別是對於：
- 課程日曆
- 作業要求
- 課程說明
- 任何主要包含文本的內容

Markdown 不僅解決了PDF解析的技術問題，還提供了更好的可維護性和搜索精度。
