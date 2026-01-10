# 快速設置自動備份

## 3步完成設置

### ✅ 步驟1：推送代碼到GitHub

代碼已經準備好，只需要推送：

```bash
git add .
git commit -m "Add interaction logging and auto-backup"
git push origin main
```

### ✅ 步驟2：在GitHub設置Secret

1. 打開：https://github.com/lyonchill/des166-ai-agent/settings/secrets/actions
2. 點擊 **New repository secret**
3. **Name**: `RENDER_URL`
4. **Value**: 您的Render應用URL（例如：`https://des166-ai-agent.onrender.com`）
5. 點擊 **Add secret**

### ✅ 步驟3：測試備份

1. 打開：https://github.com/lyonchill/des166-ai-agent/actions
2. 選擇 **Backup Student Interactions**
3. 點擊 **Run workflow** → **Run workflow**

## 完成！

設置完成後：
- ✅ 每天自動備份（UTC 2:00 AM，台灣時間 10:00 AM）
- ✅ 備份文件保存在 `backups/` 目錄
- ✅ 可以隨時手動觸發備份

## 查看備份

備份文件會自動提交到GitHub：
- 路徑：`backups/interactions-YYYY-MM-DD.xlsx`
- 可以在GitHub倉庫中直接下載

## 重要提醒

⚠️ **Render應用必須運行**：
- Free Plan會休眠，備份可能失敗
- 建議使用Starter Plan（$7/月）確保應用持續運行
- 或定期手動訪問應用URL喚醒它
