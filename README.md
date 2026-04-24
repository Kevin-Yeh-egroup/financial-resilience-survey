# 財務韌性問卷系統

一個可配置、可重用的問卷系統，支援動態結果分析、雷達圖視覺化和結構型判讀。

## ✨ 功能特色

- 📝 動態問卷表單（自動進度追蹤）
- 🎨 美觀的結果視覺化（雷達圖、分數區間）
- 📊 多維度分析（六構面評估）
- 🎯 結構型判讀（A-E 五種結構類型）
- 💡 智能優先方向推薦
- 🎬 流暢的轉換動畫
- 📱 響應式設計（支援手機、平板、桌面）

## 🚀 快速開始

### 安裝依賴

```bash
npm install
# 或
pnpm install
```

### 開發模式

```bash
npm run dev
```

### 構建生產版本

```bash
npm run build
npm start
```

## 📚 自定義指南

### 快速自定義（5 分鐘）

請參考 [docs/QUICK_START.md](./docs/QUICK_START.md)

### 完整自定義指南

請參考 [docs/CUSTOMIZATION_GUIDE.md](./docs/CUSTOMIZATION_GUIDE.md)

## 📁 專案結構

```
├── app/                          # Next.js 應用程式
│   ├── page.tsx                 # 主頁面
│   └── layout.tsx                # 佈局
├── components/                   # React 組件
│   ├── questionnaire-form.tsx    # 問卷表單
│   ├── results-display.tsx       # 結果顯示
│   └── transition-animation.tsx  # 轉換動畫
├── lib/                          # 核心邏輯
│   ├── questionnaire-config.ts   # ⭐ 配置檔案
│   ├── questionnaire-data.ts     # 問卷題目
│   └── scoring.ts                # 分數計算
├── types/                        # TypeScript 類型
│   └── questionnaire.ts
└── docs/                         # 文檔
    ├── CUSTOMIZATION_GUIDE.md    # 自定義指南
    └── QUICK_START.md            # 快速開始
```

## 🎯 如何複製到其他專案

### 方法 1: 直接複製（推薦）

1. **複製整個專案資料夾**
2. **重新命名為您的專案名稱**
3. **修改配置檔案** (`lib/questionnaire-config.ts`)
4. **更新問卷題目** (`lib/questionnaire-data.ts`)
5. **自定義樣式和文字**

### 方法 2: 作為 NPM 套件（進階）

如果您想將此系統作為可安裝的套件：

1. 將核心組件和邏輯提取到獨立套件
2. 發布到 NPM
3. 在其他專案中安裝使用

### 方法 3: Git Submodule

```bash
# 在主專案中
git submodule add <repository-url> questionnaire-system
```

## 🔧 技術棧

- **框架**: Next.js 16
- **UI 庫**: React 19
- **樣式**: Tailwind CSS
- **圖表**: Recharts
- **圖標**: Lucide React
- **類型**: TypeScript

## 📝 配置檔案說明

主要配置檔案位於 `lib/questionnaire-config.ts`，包含：

- 問卷標題和副標題
- 轉換動畫文字
- 構面設定
- 分數區間配置
- 回饋文字
- 優先方向設定
- 結構型判讀配置

## 🎨 自定義範例

### 修改問卷主題

```typescript
// lib/questionnaire-config.ts
export const questionnaireConfig = {
  title: "您的問卷標題",
  subtitle: "您的問卷副標題",
  // ...
}
```

### 添加新題目

```typescript
// lib/questionnaire-data.ts
export const questions: Question[] = [
  // ... 現有題目
  {
    id: 11,
    text: "新問題？",
    options: [
      { label: "選項 A", value: "A", score: 10 },
      // ...
    ],
  },
]
```

## 📖 文檔

- [快速開始指南](./docs/QUICK_START.md) - 5 分鐘快速自定義
- [完整自定義指南](./docs/CUSTOMIZATION_GUIDE.md) - 詳細的自定義說明

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License

## 💬 支援

如有問題或建議，請開啟 Issue。


