/**
 * 問卷系統配置範例檔案
 * 
 * 複製此檔案為 questionnaire-config.ts 並根據您的需求修改
 * 
 * cp lib/questionnaire-config.example.ts lib/questionnaire-config.ts
 */

import type { Question } from "@/types/questionnaire"

// ==================== 基本設定 ====================

export const questionnaireConfig = {
  // 問卷標題
  title: "您的問卷標題",
  
  // 問卷副標題
  subtitle: "透過 X 個簡單問題，了解您的狀況",
  
  // 轉換動畫文字
  transitionText: {
    line1: "這不是一份評分表，",
    line2: "而是一張幫你找出",
    line3: "「哪些地方在撐你、哪些地方需要被接住」的地圖。",
  },
  
  // 結果頁標題
  resultsTitle: "您的評估結果",
  
  // 構面名稱（用於雷達圖）
  // 根據您的問卷調整構面數量和名稱
  dimensions: [
    "構面一",
    "構面二",
    "構面三",
    "構面四",
    "構面五",
    "構面六",
  ] as const,
  
  // 構面與題目的對應關係（用於計算構面分數）
  // 格式：構面名稱: [題目 ID 陣列]
  dimensionMapping: {
    構面一: [1, 2],
    構面二: [3, 5],
    構面三: [4, 6],
    構面四: [7, 8],
    構面五: [9],
    構面六: [10],
  },
  
  // 分數區間配置
  scoreRanges: {
    excellent: { min: 75, max: 100, label: "優秀", color: "emerald" },
    good: { min: 60, max: 74, label: "良好", color: "yellow" },
    fair: { min: 40, max: 59, label: "普通", color: "orange" },
    poor: { min: 0, max: 39, label: "需改善", color: "red" },
  },
  
  // 分數區間回饋文字
  scoreFeedback: {
    excellent: "根據您的填答，您的狀況表現優秀。\n建議繼續保持，並可進一步優化。",
    good: "根據您的填答，您的狀況表現良好。\n仍有改進空間，建議針對弱項進行調整。",
    fair: "根據您的填答，您的狀況需要關注。\n建議尋求協助，逐步改善。",
    poor: "根據您的填答，您的狀況需要立即關注。\n建議儘早尋求專業協助。",
  },
  
  // 優先討論方向列表
  priorityOptions: [
    "優先方向一",
    "優先方向二",
    "優先方向三",
    // 根據您的需求添加更多方向
  ] as const,
  
  // 優先方向判斷規則
  // 格式：{ questionIds: [題目 ID], priority: "優先方向名稱", threshold: 分數閾值 }
  priorityRules: [
    { questionIds: [1, 5], priority: "優先方向一", threshold: 3 },
    { questionIds: [4], priority: "優先方向二", threshold: 3 },
    { questionIds: [3], priority: "優先方向三", threshold: 3 },
    // 根據您的需求添加更多規則
  ],
} as const

// ==================== 問卷題目 ====================
// 從 questionnaire-data.ts 導入，或在此處定義
export { questions } from "./questionnaire-data"

// ==================== 結構型判讀配置 ====================

export const structureTypeConfig = {
  A: {
    name: "結構類型 A",
    description: "結構類型 A 的描述文字。\n可以多行顯示。",
  },
  B: {
    name: "結構類型 B",
    description: "結構類型 B 的描述文字。\n可以多行顯示。",
  },
  C: {
    name: "結構類型 C",
    description: "結構類型 C 的描述文字。\n可以多行顯示。",
  },
  D: {
    name: "結構類型 D",
    description: "結構類型 D 的描述文字。\n可以多行顯示。",
  },
  E: {
    name: "結構類型 E",
    description: "結構類型 E 的描述文字。\n可以多行顯示。",
  },
} as const

// ==================== 類型定義 ====================

export type QuestionnaireConfig = typeof questionnaireConfig
export type StructureType = keyof typeof structureTypeConfig



