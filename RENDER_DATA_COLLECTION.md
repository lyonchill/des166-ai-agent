# Render部署後的數據收集方案

## 問題

Render的文件系統是**臨時的**，重啟後數據會丟失。互動記錄存儲在 `data/interactions/` 目錄，但這些文件在Render重啟後會消失。

## 解決方案

### ✅ 方案1：定期手動導出（最簡單）

**步驟：**
1. 定期訪問：`https://your-app.onrender.com/admin/interactions`
2. 點擊 "Export Excel" 按鈕
3. 下載Excel文件到本地
4. 保存到GitHub或本地備份

**頻率建議：**
- 每週一次（如果使用量不大）
- 每天一次（如果使用量大）

### ✅ 方案2：GitHub Actions自動備份（推薦）

創建自動備份工作流，每天自動下載並提交到GitHub。

**創建文件：`.github/workflows/backup-interactions.yml`**

```yaml
name: Backup Student Interactions

on:
  schedule:
    - cron: '0 2 * * *' # 每天UTC時間凌晨2點（台灣時間上午10點）
  workflow_dispatch: # 允許手動觸發

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Download interactions from Render
        run: |
          curl -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
               ${{ secrets.RENDER_URL }}/api/interactions/export \
               -o backups/interactions-$(date +%Y-%m-%d).xlsx
      
      - name: Commit and push backup
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          mkdir -p backups
          git add backups/
          git commit -m "Auto-backup interactions $(date +%Y-%m-%d)" || exit 0
          git push
```

**設置Secrets：**
1. 在GitHub倉庫設置中添加：
   - `RENDER_URL`: 你的Render應用URL（例如：`https://your-app.onrender.com`）
   - `RENDER_API_KEY`: Render API Key（如果需要認證）

### ✅ 方案3：使用Supabase數據庫（最佳長期方案）

將互動記錄存儲在Supabase數據庫中，數據永久保存。

**優點：**
- 數據永久保存
- 不需要手動備份
- 可以進行複雜查詢和分析
- 免費層可用

**實施步驟：**
1. 創建Supabase項目
2. 創建interactions表
3. 修改 `lib/interaction-logger.ts` 使用Supabase而不是文件系統

### ✅ 方案4：使用環境變數控制記錄（開發/生產分離）

只在生產環境記錄，開發環境跳過：

```typescript
// 在 lib/interaction-logger.ts 中
if (process.env.NODE_ENV === "production" && process.env.ENABLE_LOGGING !== "false") {
  // 記錄互動
}
```

## 當前實現狀態

✅ **已實現：**
- 自動記錄所有互動到JSON文件
- 查看頁面：`/admin/interactions`
- Excel導出功能：`/api/interactions/export`
- 搜索和過濾功能

⚠️ **需要注意：**
- Render上數據會丟失（需要定期導出）
- JSON文件已添加到 `.gitignore`（不會提交到Git）

## 推薦工作流程

### 短期（現在）
1. 每週訪問 `/admin/interactions` 導出Excel
2. 保存Excel文件到本地或GitHub

### 中期（1-2週內）
1. 設置GitHub Actions自動備份
2. 每天自動下載並提交到GitHub

### 長期（如果使用量大）
1. 遷移到Supabase數據庫
2. 實現完整的數據分析儀表板

## 數據分析建議

導出的Excel可以用於：
- 分析最常見的問題
- 識別需要添加的QA
- 了解學生的需求模式
- 優化AI回答質量

## 快速開始

**立即測試：**
1. 訪問：`http://localhost:3011/admin/interactions`
2. 問AI幾個問題
3. 刷新頁面查看記錄
4. 點擊 "Export Excel" 測試導出

**生產環境：**
1. 部署到Render後，訪問：`https://your-app.onrender.com/admin/interactions`
2. 定期導出Excel文件
3. 考慮設置自動備份

