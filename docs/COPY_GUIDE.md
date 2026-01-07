# 複製問卷系統指南

本指南將幫助您將此問卷系統複製並應用到其他專案中。

## 🎯 三種複製方式

### 方式 1: 完整複製（最簡單）⭐ 推薦

**適用場景**：需要完整功能，快速開始新專案

**步驟**：

1. **複製整個專案資料夾**
   ```bash
   cp -r 財務韌性-初測 我的新問卷專案
   cd 我的新問卷專案
   ```

2. **安裝依賴**
   ```bash
   npm install
   # 或
   pnpm install
   ```

3. **修改配置檔案**
   - 編輯 `lib/questionnaire-config.ts`
   - 編輯 `lib/questionnaire-data.ts`
   - 根據需求調整其他檔案

4. **測試運行**
   ```bash
   npm run dev
   ```

**優點**：
- ✅ 最簡單快速
- ✅ 包含所有功能
- ✅ 立即可用

**缺點**：
- ⚠️ 會包含所有原始檔案
- ⚠️ 需要手動清理不需要的部分

---

### 方式 2: 提取核心組件（中等難度）

**適用場景**：已有專案，只需要問卷功能

**步驟**：

1. **複製核心檔案**
   ```bash
   # 複製組件
   cp -r components/questionnaire-form.tsx 您的專案/components/
   cp -r components/results-display.tsx 您的專案/components/
   cp -r components/transition-animation.tsx 您的專案/components/
   
   # 複製邏輯
   cp -r lib/questionnaire-config.ts 您的專案/lib/
   cp -r lib/questionnaire-data.ts 您的專案/lib/
   cp -r lib/scoring.ts 您的專案/lib/
   
   # 複製類型
   cp -r types/questionnaire.ts 您的專案/types/
   ```

2. **複製 UI 組件（如果需要）**
   ```bash
   cp -r components/ui/* 您的專案/components/ui/
   ```

3. **安裝依賴**
   ```bash
   npm install recharts lucide-react
   ```

4. **整合到您的專案**
   - 在您的頁面中導入組件
   - 根據您的路由系統調整

**優點**：
- ✅ 只包含需要的檔案
- ✅ 可以整合到現有專案

**缺點**：
- ⚠️ 需要手動整合
- ⚠️ 可能需要調整依賴

---

### 方式 3: 創建 NPM 套件（進階）

**適用場景**：需要在多個專案中重用，或想分享給他人

**步驟**：

1. **創建新套件專案**
   ```bash
   mkdir questionnaire-system-package
   cd questionnaire-system-package
   npm init
   ```

2. **提取核心代碼**
   - 將組件、邏輯、類型提取到套件中
   - 創建 `index.ts` 作為入口點
   - 配置 `package.json`

3. **發布到 NPM**
   ```bash
   npm publish
   ```

4. **在其他專案中使用**
   ```bash
   npm install questionnaire-system-package
   ```

**優點**：
- ✅ 可重用性高
- ✅ 易於維護和更新
- ✅ 可以分享給團隊

**缺點**：
- ⚠️ 需要更多設置工作
- ⚠️ 需要了解 NPM 發布流程

---

## 📋 複製後檢查清單

無論使用哪種方式，複製後請檢查：

- [ ] 所有依賴已安裝
- [ ] 配置檔案已更新
- [ ] 問卷題目已修改
- [ ] 文字內容已自定義
- [ ] 樣式符合需求
- [ ] 功能測試通過
- [ ] 構建成功（`npm run build`）

## 🔧 快速自定義

複製後，優先修改這些檔案：

1. **`lib/questionnaire-config.ts`** - 所有配置
2. **`lib/questionnaire-data.ts`** - 問卷題目
3. **`components/results-display.tsx`** - 結果頁樣式
4. **`app/globals.css`** - 顏色主題

詳細說明請參考 [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)

## 💡 最佳實踐

1. **保留原始專案作為參考**
   - 不要直接修改原始專案
   - 創建新專案進行自定義

2. **使用版本控制**
   ```bash
   git init
   git add .
   git commit -m "初始問卷系統"
   ```

3. **逐步自定義**
   - 先確保基本功能運作
   - 再逐步修改配置和樣式

4. **測試每個階段**
   - 修改後立即測試
   - 確保功能正常

## ❓ 常見問題

### Q: 複製後出現依賴錯誤？
A: 執行 `npm install` 重新安裝所有依賴。

### Q: 如何修改問卷題目數量？
A: 在 `questionnaire-data.ts` 中添加或刪除題目，並更新 `dimensionMapping`。

### Q: 可以移除某些功能嗎？
A: 可以，但需要確保相關的依賴和引用都已移除。

### Q: 如何改變顏色主題？
A: 修改 `app/globals.css` 中的 CSS 變數，或修改組件中的 Tailwind 類別。

## 📞 需要幫助？

- 查看 [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) 了解詳細自定義
- 查看 [QUICK_START.md](./QUICK_START.md) 快速開始
- 開啟 Issue 尋求協助


