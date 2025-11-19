# 部署到 Render 指南

本指南將幫助您將 DES166 AI Assistant 部署到 Render Web Service。

## 前置要求

- Render 帳號（免費註冊：https://render.com）
- GitHub/GitLab/Bitbucket 帳號
- Gemini API Key

## 步驟 1: 準備 Git 倉庫

### 1.1 確保代碼已提交

```bash
# 檢查當前狀態
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "準備部署到 Render"

# 推送到遠程倉庫
git push origin main
```

## 步驟 2: 在 Render 創建 Web Service

### 2.1 登入 Render Dashboard

1. 訪問 https://dashboard.render.com
2. 使用 GitHub/GitLab/Bitbucket 帳號登入

### 2.2 創建新的 Web Service

1. 點擊 "New +" 按鈕
2. 選擇 "Web Service"
3. 連接您的 Git 倉庫
4. 選擇包含此項目的倉庫

### 2.3 配置服務設置

**基本設置：**
- **Name**: `des166-ai-agent`（或您喜歡的名稱）
- **Region**: 選擇離您最近的區域（例如：Singapore）
- **Branch**: `main`
- **Root Directory**: 留空（如果項目在倉庫根目錄）
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free`（免費方案）

**環境變數設置：**
1. 在 "Environment Variables" 區塊點擊 "Add Environment Variable"
2. 添加以下環境變數：
   - **Key**: `GEMINI_API_KEY`
   - **Value**: 您的 Gemini API Key（從 Google AI Studio 獲取）
   - **Key**: `NODE_ENV`
   - **Value**: `production`

### 2.4 使用 render.yaml（可選）

如果您想使用 `render.yaml` 自動配置：

1. 確保 `render.yaml` 已提交到倉庫
2. 在創建服務時，Render 會自動檢測並使用該配置
3. 您仍然需要在 Dashboard 中手動設置 `GEMINI_API_KEY`

## 步驟 3: 部署

### 3.1 自動部署

- 點擊 "Create Web Service"
- Render 會自動開始構建和部署
- 首次部署可能需要 5-10 分鐘

### 3.2 監控部署進度

- 在 Dashboard 中查看 "Events" 標籤
- 查看構建日誌以確認沒有錯誤
- 等待部署完成

## 步驟 4: 驗證部署

### 4.1 訪問應用

部署完成後，您會獲得一個 URL，例如：
```
https://des166-ai-agent.onrender.com
```

### 4.2 測試功能

1. **訪問首頁**: 確認頁面正常載入
2. **測試 Chat 功能**: 發送一個問題，確認 AI 回應正常
3. **測試 FAQ Topics**: 切換到 FAQ Topics 頁面，確認問題列表正常顯示
4. **檢查 API**: 確認 `/api/chat` 和 `/api/qa` 路由正常

## 常見問題

### 問題 1: 構建失敗

**可能原因：**
- 缺少依賴
- Node.js 版本不兼容
- 環境變數未設置

**解決方案：**
- 檢查構建日誌中的錯誤訊息
- 確認 `package.json` 中的依賴正確
- 確認所有必需的環境變數已設置

### 問題 2: API 返回錯誤

**可能原因：**
- `GEMINI_API_KEY` 未設置或錯誤
- API 配額已用完

**解決方案：**
- 在 Render Dashboard 中檢查環境變數
- 確認 API Key 正確
- 檢查 Google AI Studio 中的配額

### 問題 3: 服務休眠

**說明：**
- Render 免費方案會在 15 分鐘無活動後休眠
- 首次請求可能需要 30-60 秒喚醒服務
- 這是正常行為，不影響功能

**解決方案：**
- 升級到付費方案可避免休眠
- 或使用外部服務定期 ping 您的應用以保持活躍

### 問題 4: 靜態資源無法載入

**可能原因：**
- 圖片路徑錯誤
- `public` 目錄未正確部署

**解決方案：**
- 確認圖片位於 `public` 目錄中
- 使用相對路徑引用圖片（例如：`/ask_me_des166_chat.png`）

## 更新部署

當您推送新的更改到 Git 倉庫時：

1. Render 會自動檢測更改
2. 觸發新的構建和部署
3. 部署完成後自動更新應用

您也可以在 Dashboard 中手動觸發重新部署。

## 環境變數管理

### 添加新的環境變數

1. 在 Render Dashboard 中選擇您的服務
2. 進入 "Environment" 標籤
3. 點擊 "Add Environment Variable"
4. 輸入 Key 和 Value
5. 點擊 "Save Changes"
6. 服務會自動重新部署

### 更新環境變數

1. 找到要更新的環境變數
2. 點擊 "Edit"
3. 更新 Value
4. 點擊 "Save Changes"
5. 服務會自動重新部署

## 監控和日誌

### 查看日誌

1. 在 Render Dashboard 中選擇您的服務
2. 點擊 "Logs" 標籤
3. 查看實時日誌

### 監控指標

Render 免費方案提供基本的監控指標：
- CPU 使用率
- 記憶體使用率
- 請求數量

## 安全建議

1. **不要提交敏感信息**：
   - 確保 `.env.local` 在 `.gitignore` 中
   - 不要在代碼中硬編碼 API Keys

2. **使用環境變數**：
   - 所有敏感配置都應通過環境變數設置

3. **定期更新依賴**：
   - 定期運行 `npm audit` 檢查安全漏洞
   - 更新有安全問題的依賴

## 支援資源

- Render 文檔：https://render.com/docs
- Next.js 部署文檔：https://nextjs.org/docs/deployment
- Render 社群支援：https://community.render.com

## 故障排除

如果遇到問題：

1. 檢查 Render Dashboard 中的日誌
2. 確認環境變數設置正確
3. 檢查構建日誌中的錯誤訊息
4. 確認 Node.js 版本兼容（建議 18+）
5. 查看 Render 狀態頁面：https://status.render.com

