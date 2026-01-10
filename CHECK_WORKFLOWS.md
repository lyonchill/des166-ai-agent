# 檢查 GitHub Actions 工作流

## 如果看不到工作流，請按順序檢查：

### ✅ 步驟1：確認文件在GitHub上

訪問這些URL確認文件存在：
- https://github.com/lyonchill/des166-ai-agent/tree/main/.github/workflows
- https://github.com/lyonchill/des166-ai-agent/blob/main/.github/workflows/test.yml
- https://github.com/lyonchill/des166-ai-agent/blob/main/.github/workflows/backup-interactions.yml

### ✅ 步驟2：檢查Actions設置

1. 訪問：https://github.com/lyonchill/des166-ai-agent/settings/actions
2. 確認 "Actions permissions" 設置為：
   - ✅ "Allow all actions and reusable workflows" 
   - 或至少 ✅ "Allow local actions and reusable workflows"

### ✅ 步驟3：檢查倉庫可見性

- 如果是私有倉庫，確認您有管理員權限
- 如果是公開倉庫，應該沒問題

### ✅ 步驟4：強制刷新

1. 訪問：https://github.com/lyonchill/des166-ai-agent/actions
2. 按 `Cmd+Shift+R` (Mac) 或 `Ctrl+Shift+R` (Windows)
3. 或清除瀏覽器緩存

### ✅ 步驟5：直接訪問工作流URL

嘗試直接訪問：
- https://github.com/lyonchill/des166-ai-agent/actions/workflows/test.yml
- https://github.com/lyonchill/des166-ai-agent/actions/workflows/backup-interactions.yml
- https://github.com/lyonchill/des166-ai-agent/actions/workflows/simple-backup.yml

如果URL可以訪問，說明工作流已存在。

### ✅ 步驟6：檢查工作流文件語法

如果文件存在但看不到，可能是YAML語法問題。檢查：
- 縮進必須使用空格（不能使用Tab）
- 冒號後面必須有空格
- 確保沒有特殊字符問題

## 如果以上都檢查過了還是看不到

1. **等待10-15分鐘**：GitHub有時需要時間來識別新工作流
2. **檢查GitHub狀態**：https://www.githubstatus.com/
3. **嘗試創建一個最簡單的工作流**：
   ```yaml
   name: Test
   on: [push]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - run: echo "test"
   ```
   推送後看是否能顯示

## 常見問題

**Q: 為什麼看不到工作流？**
A: 最常見的原因是Actions功能未啟用。請檢查設置。

**Q: 文件在GitHub上但看不到工作流？**
A: 可能是語法錯誤或GitHub需要時間識別。等待10分鐘後重試。

**Q: 如何確認工作流是否正確？**
A: 直接訪問工作流URL，如果能打開說明工作流存在。
