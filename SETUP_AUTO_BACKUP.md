# 設置自動備份 - 詳細步驟

## 步驟1：獲取Render應用URL

1. 登錄 [Render Dashboard](https://dashboard.render.com)
2. 找到您的應用（des166-ai-agent）
3. 複製應用URL，例如：`https://des166-ai-agent.onrender.com`

## 步驟2：在GitHub設置Secret

1. 打開GitHub倉庫：`https://github.com/lyonchill/des166-ai-agent`
2. 點擊 **Settings**（設置）
3. 左側菜單選擇 **Secrets and variables** → **Actions**
4. 點擊 **New repository secret**
5. 添加以下Secret：

   **Name**: `RENDER_URL`
   **Value**: 您的Render應用URL（例如：`https://des166-ai-agent.onrender.com`）

6. 點擊 **Add secret**

## 步驟3：驗證工作流文件

確認 `.github/workflows/backup-interactions.yml` 文件已存在並正確。

## 步驟4：測試自動備份

### 方法A：手動觸發測試

1. 在GitHub倉庫，點擊 **Actions** 標籤
2. 左側選擇 **Backup Student Interactions**
3. 點擊 **Run workflow** 按鈕
4. 選擇分支（通常是 `main`）
5. 點擊 **Run workflow**

### 方法B：等待自動運行

工作流會每天UTC時間凌晨2點（台灣時間上午10點）自動運行。

## 步驟5：查看備份結果

1. 在GitHub倉庫，點擊 **Actions** 標籤
2. 查看最新的工作流運行記錄
3. 如果成功，會在 `backups/` 目錄看到新的Excel文件
4. 在倉庫中查看 `backups/` 目錄確認文件已提交

## 備份文件位置

備份的Excel文件會保存在：
- GitHub倉庫：`backups/interactions-YYYY-MM-DD.xlsx`
- 每個文件包含到該日期為止的所有互動記錄

## 注意事項

1. **Render應用必須運行**：
   - 如果Render應用處於休眠狀態，備份會失敗
   - 建議使用Starter Plan（$7/月）確保應用持續運行

2. **首次運行可能需要時間**：
   - 第一次運行可能需要幾分鐘
   - 如果失敗，檢查Actions日誌查看錯誤信息

3. **數據量**：
   - 如果互動記錄很多，Excel文件可能會很大
   - 建議定期清理舊的備份文件

## 故障排除

### 問題：備份失敗，顯示404錯誤
**解決方案**：
- 檢查 `RENDER_URL` secret是否正確
- 確認Render應用URL可以訪問
- 確認 `/api/interactions/export` 端點可以訪問

### 問題：備份失敗，顯示連接超時
**解決方案**：
- Render應用可能處於休眠狀態
- 嘗試手動訪問應用URL喚醒它
- 考慮升級到Starter Plan

### 問題：備份成功但文件沒有提交到GitHub
**解決方案**：
- 檢查GitHub Actions的權限設置
- 確認工作流有寫入權限
- 查看Actions日誌中的錯誤信息

## 驗證備份是否工作

運行以下命令檢查：

```bash
# 檢查工作流文件是否存在
ls -la .github/workflows/

# 檢查最近的備份文件
ls -la backups/
```

## 下一步

設置完成後：
1. 等待第一次自動備份運行（或手動觸發）
2. 確認 `backups/` 目錄中有Excel文件
3. 定期檢查備份是否正常運行
4. 可以下載Excel文件進行數據分析
