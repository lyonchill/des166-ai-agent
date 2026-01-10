# 學生互動記錄收集指南

## 功能說明

系統現在會自動記錄所有學生的問題和AI回答，存儲在 `data/interactions/` 目錄下，按月分組。

## 數據存儲位置

- **本地開發**: `data/interactions/interactions-YYYY-MM.json`
- **Render部署**: `data/interactions/interactions-YYYY-MM.json`（⚠️ 注意：Render的文件系統是臨時的）

## 記錄的數據

每次互動包含：
- 時間戳
- 學生問題
- AI回答
- 使用的AI模型
- 相關的QA ID
- 文件來源和頁碼
- 連結來源
- 匿名會話ID（基於IP和User-Agent）

## 查看記錄的方式

### 方式1：通過網頁界面（推薦）

訪問：`http://localhost:3011/admin/interactions` 或 `https://your-app.onrender.com/admin/interactions`

功能：
- 查看所有互動記錄
- 搜索問題和回答
- 查看統計信息
- **導出Excel文件**

### 方式2：通過API

```bash
# 獲取所有記錄
curl http://localhost:3011/api/interactions

# 搜索記錄
curl "http://localhost:3011/api/interactions?search=project"

# 導出Excel
curl http://localhost:3011/api/interactions/export -o interactions.xlsx
```

### 方式3：直接查看JSON文件

```bash
# 查看當前月份的記錄
cat data/interactions/interactions-2025-01.json
```

## ⚠️ Render部署的重要注意事項

### 問題：文件系統是臨時的

Render的文件系統在重啟後會重置，**互動記錄會丟失**。

### 解決方案

#### 方案A：定期導出（推薦）

1. **手動導出**：
   - 定期訪問 `/admin/interactions` 頁面
   - 點擊 "Export Excel" 下載數據
   - 保存到本地或GitHub

2. **自動導出腳本**：
   ```bash
   # 每天導出一次
   curl https://your-app.onrender.com/api/interactions/export -o interactions-$(date +%Y-%m-%d).xlsx
   ```

#### 方案B：使用GitHub Actions自動備份（最佳）

創建 `.github/workflows/backup-interactions.yml`：

```yaml
name: Backup Interactions

on:
  schedule:
    - cron: '0 2 * * *' # 每天凌晨2點
  workflow_dispatch: # 手動觸發

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download interactions
        run: |
          curl ${{ secrets.RENDER_URL }}/api/interactions/export -o interactions-backup.xlsx
      
      - name: Commit and push
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          git add interactions-backup.xlsx
          git commit -m "Backup interactions $(date +%Y-%m-%d)" || exit 0
          git push
```

#### 方案C：使用外部數據庫（長期方案）

考慮使用：
- **Supabase**（免費層可用）
- **MongoDB Atlas**（免費層可用）
- **Google Sheets API**（簡單但有限制）

## 當前實現

✅ **已實現**：
- 自動記錄所有互動
- JSON文件存儲（按月分組）
- 查看和搜索API
- Excel導出功能
- 簡單的查看頁面

⚠️ **限制**：
- Render上數據會丟失（需要定期導出）
- 沒有自動備份機制

## 建議的工作流程

1. **開發階段**：
   - 數據存儲在本地 `data/interactions/`
   - 可以隨時查看和導出

2. **生產環境（Render）**：
   - 每週或每天訪問 `/admin/interactions`
   - 導出Excel文件
   - 保存到GitHub或本地

3. **長期方案**：
   - 設置GitHub Actions自動備份
   - 或遷移到Supabase數據庫

## 數據分析建議

導出的Excel文件可以用於：
- 分析最常見的問題
- 識別需要改進的QA
- 了解學生的需求
- 優化AI回答質量

## 安全注意事項

- 互動記錄包含匿名會話ID（不包含個人信息）
- 建議定期清理舊數據
- 導出的Excel文件應妥善保管
