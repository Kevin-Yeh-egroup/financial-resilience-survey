# 快速開始指南

## 🎯 5 分鐘快速自定義

### 1. 修改問卷標題（1 分鐘）

編輯 `lib/questionnaire-config.ts`：

```typescript
export const questionnaireConfig = {
  title: "您的問卷標題",  // 改這裡
  subtitle: "您的問卷副標題",  // 改這裡
  // ...
}
```

### 2. 修改問卷題目（2 分鐘）

編輯 `lib/questionnaire-data.ts`，修改或新增題目：

```typescript
export const questions: Question[] = [
  {
    id: 1,
    text: "您的問題？",  // 改這裡
    options: [
      { label: "選項 A", value: "A", score: 10 },
      { label: "選項 B", value: "B", score: 7 },
      // ...
    ],
  },
]
```

### 3. 修改回饋文字（2 分鐘）

編輯 `lib/questionnaire-config.ts` 中的 `scoreFeedback`：

```typescript
scoreFeedback: {
  excellent: "您的回饋文字...",  // 改這裡
  good: "您的回饋文字...",
  // ...
}
```

### 完成！

現在您可以運行 `npm run dev` 來查看您的自定義問卷。

## 📋 完整自定義清單

詳細的自定義步驟請參考 [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)



