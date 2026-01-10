# Admin Panel Deployment Guide

## 部署選項

### 選項A：使用環境變數密碼保護（推薦）

這是推薦的方式，適合在Render上部署：

1. **設置環境變數**：
   - 在Render Dashboard中，添加環境變數：
     - `NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password-here`
   - 使用強密碼，不要使用默認值

2. **訪問管理頁面**：
   - 訪問：`https://your-app.onrender.com/admin/files`
   - 輸入設置的密碼即可訪問

3. **優點**：
   - 簡單易用
   - 不需要額外的認證服務
   - 密碼通過環境變數管理，安全可控

### 選項B：只在本地開發時使用（不推薦）

如果您只在本地開發時上傳文件，可以：

1. **修改代碼**：在 `app/admin/files/page.tsx` 中添加環境檢查
2. **限制訪問**：只在開發環境啟用管理界面
3. **缺點**：無法在生產環境上傳新文件

### 選項C：使用本地上傳（最簡單）

如果您只有自己會上傳文件，最簡單的方式是：

1. **在本地開發環境上傳**：
   - 在本地運行 `npm run dev`
   - 訪問 `http://localhost:3011/admin/files`
   - 上傳文件

2. **文件會存儲在**：
   - `public/files/course-materials/` 目錄
   - 這些文件會隨代碼一起部署到Render

3. **部署流程**：
   ```bash
   # 1. 在本地上傳文件
   npm run dev
   # 訪問 http://localhost:3011/admin/files 上傳文件
   
   # 2. 提交到Git
   git add public/files/
   git commit -m "Add course files"
   git push
   
   # 3. Render會自動部署
   ```

4. **優點**：
   - 最簡單，不需要額外配置
   - 文件版本控制
   - 不需要在生產環境暴露管理界面

## 推薦方案

**建議使用選項C（本地上傳）**，因為：
- 您只有自己會上傳文件
- 文件會隨代碼一起部署，版本可控
- 不需要在生產環境暴露管理界面
- 更安全

如果需要在生產環境也能上傳，則使用**選項A（環境變數保護）**。

## 安全注意事項

1. **如果使用選項A**：
   - 務必設置強密碼
   - 不要在代碼中硬編碼密碼
   - 定期更換密碼

2. **如果使用選項C**：
   - 確保 `public/files/` 目錄在 `.gitignore` 中（如果需要）
   - 或者確保敏感文件不會被提交

3. **文件大小限制**：
   - 當前限制為10MB
   - 大文件建議使用雲存儲（Supabase Storage或AWS S3）

## 環境變數設置

在Render Dashboard中設置：

```
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

或者在本地 `.env.local` 中：

```
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
```

