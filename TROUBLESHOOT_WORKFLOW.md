# GitHub Actions 工作流不顯示 - 排查指南

## 可能的原因和解決方案

### 1. GitHub需要時間識別新工作流

**解決方案：**
- 等待5-10分鐘後刷新頁面
- 或者手動觸發一次工作流來強制GitHub識別

### 2. 檢查工作流文件是否正確推送

**確認步驟：**
1. 訪問：https://github.com/lyonchill/des166-ai-agent/tree/main/.github/workflows
2. 確認 `backup-interactions.yml` 文件存在
3. 點擊文件查看內容是否正確

### 3. 檢查文件路徑和名稱

**要求：**
- 文件必須在：`.github/workflows/` 目錄下
- 文件名必須以 `.yml` 或 `.yaml` 結尾
- 文件名：`backup-interactions.yml` ✅

### 4. 檢查YAML語法

**常見問題：**
- 縮進必須使用空格（不能使用Tab）
- 冒號後面必須有空格
- 字符串不需要引號（除非包含特殊字符）

### 5. 強制刷新GitHub Actions

**方法：**
1. 訪問：https://github.com/lyonchill/des166-ai-agent/actions
2. 按 `Cmd+Shift+R` (Mac) 或 `Ctrl+Shift+R` (Windows) 強制刷新
3. 清除瀏覽器緩存後重試

### 6. 檢查倉庫設置

**確認：**
1. 訪問：https://github.com/lyonchill/des166-ai-agent/settings/actions
2. 確認 "Actions" 功能已啟用
3. 確認工作流權限設置正確

### 7. 手動觸發工作流

**如果工作流存在但看不到：**
1. 訪問：https://github.com/lyonchill/des166-ai-agent/actions/workflows/backup-interactions.yml
2. 如果頁面存在，點擊 "Run workflow"

## 快速檢查清單

- [ ] 確認 `.github/workflows/backup-interactions.yml` 文件存在於GitHub
- [ ] 確認文件內容正確（沒有語法錯誤）
- [ ] 等待5-10分鐘後刷新
- [ ] 強制刷新瀏覽器（Cmd+Shift+R）
- [ ] 檢查Actions功能是否啟用
- [ ] 嘗試直接訪問工作流URL

## 直接訪問工作流URL

如果工作流已存在，可以直接訪問：
```
https://github.com/lyonchill/des166-ai-agent/actions/workflows/backup-interactions.yml
```

## 如果仍然看不到

1. **檢查文件是否真的推送了**：
   ```bash
   git ls-tree -r HEAD --name-only | grep workflow
   ```

2. **重新推送工作流文件**：
   ```bash
   git add .github/workflows/backup-interactions.yml
   git commit -m "Add workflow file"
   git push origin main
   ```

3. **創建一個簡單的測試工作流**：
   創建 `.github/workflows/test.yml`：
   ```yaml
   name: Test Workflow
   on:
     workflow_dispatch:
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - run: echo "Hello World"
   ```
   推送後看是否能顯示
