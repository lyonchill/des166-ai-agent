# 如何使用 GitHub Actions 自動備份學生回覆

## 步驟1：設置 Render URL Secret

1. 訪問：https://github.com/lyonchill/des166-ai-agent/settings/secrets/actions
2. 點擊 **"New repository secret"**
3. 填寫：
   - **Name**: `RENDER_URL`
   - **Value**: 您的Render應用URL（例如：`https://des166-ai-agent.onrender.com`）
4. 點擊 **"Add secret"**

## 步驟2：手動觸發測試（推薦先測試）

1. 訪問：https://github.com/lyonchill/des166-ai-agent/actions
2. 在左側選擇 **"Backup Student Interactions"**
3. 點擊右上角的 **"Run workflow"** 按鈕
4. 選擇分支：`main`
5. 點擊 **"Run workflow"**

## 步驟3：查看備份結果

備份完成後：

1. 在Actions頁面查看運行記錄
2. 如果成功，會看到：
   - ✅ 綠色的勾號
   - 在 `backups/` 目錄中會有新的Excel文件

3. 查看備份文件：
   - 訪問：https://github.com/lyonchill/des166-ai-agent/tree/main/backups
   - 下載 `interactions-YYYY-MM-DD.xlsx` 文件

## 自動運行時間

設置完成後，工作流會：
- **每天自動運行**：UTC時間凌晨2點（台灣時間上午10點）
- **自動下載**：從Render應用下載所有互動記錄
- **自動提交**：將Excel文件提交到GitHub倉庫

## 故障排除

### 問題：備份失敗，顯示404錯誤
**解決方案**：
- 檢查 `RENDER_URL` secret是否正確
- 確認Render應用URL可以訪問
- 確認 `/api/interactions/export` 端點可以訪問

### 問題：備份失敗，顯示連接超時
**解決方案**：
- Render應用可能處於休眠狀態（Free Plan）
- 手動訪問應用URL喚醒它
- 或升級到Starter Plan（$7/月）確保應用持續運行

### 問題：備份成功但沒有文件
**解決方案**：
- 檢查是否有新的互動記錄
- 如果沒有互動記錄，不會生成文件（這是正常的）

## 查看互動記錄

### 方式1：通過網頁界面
訪問：`https://your-app.onrender.com/admin/interactions`

### 方式2：通過API
```bash
# 獲取所有記錄
curl https://your-app.onrender.com/api/interactions

# 導出Excel
curl https://your-app.onrender.com/api/interactions/export -o interactions.xlsx
```

### 方式3：從GitHub下載
訪問：https://github.com/lyonchill/des166-ai-agent/tree/main/backups

## 重要提醒

⚠️ **Render應用必須運行**：
- Free Plan會休眠，備份可能失敗
- 建議使用Starter Plan（$7/月）確保應用持續運行
- 或定期手動訪問應用URL喚醒它

⚠️ **數據存儲**：
- 互動記錄存儲在Render的文件系統中（臨時的）
- 備份文件存儲在GitHub倉庫中（永久的）
- 建議定期檢查備份是否成功
