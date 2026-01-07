/**
 * 問卷系統配置檔案
 * 
 * 這個檔案包含所有可自定義的配置，讓問卷系統可以在不同場景下重用。
 * 只需要修改這個檔案的內容，就可以創建不同主題的問卷。
 */

import type { Question } from "@/types/questionnaire"

// ==================== 基本設定 ====================

export const questionnaireConfig = {
  // 問卷標題
  title: "財務韌性快速檢視",
  
  // 問卷副標題
  subtitle: "透過 10 個簡單問題，了解您的家庭財務韌性",
  
  // 轉換動畫文字
  transitionText: {
    line1: "這不是一份評分表，",
    line2: "而是一張幫你找出",
    line3: "「哪些地方在撐你、哪些地方需要被接住」的地圖。",
  },
  
  // 結果頁標題
  resultsTitle: "您的評估結果",
  
  // 構面名稱（用於雷達圖）
  dimensions: [
    "收入穩定度",
    "儲備應變力",
    "債務與保障",
    "金錢管理",
    "資源連結",
    "心理與規劃",
  ] as const,
  
  // 構面與題目的對應關係（用於計算構面分數）
  dimensionMapping: {
    收入穩定度: [1, 2], // 對應題目 ID
    儲備應變力: [3, 5],
    債務與保障: [4, 6],
    金錢管理: [7, 8],
    資源連結: [9],
    心理與規劃: [10],
  },
  
  // 分數區間配置
  scoreRanges: {
    excellent: { min: 75, max: 100, label: "財務韌性良好", color: "emerald" },
    good: { min: 60, max: 74, label: "接近韌性", color: "yellow" },
    fair: { min: 40, max: 59, label: "財務較脆弱", color: "orange" },
    poor: { min: 0, max: 39, label: "高度脆弱", color: "red" },
  },
  
  // 分數區間回饋文字
  scoreFeedback: {
    excellent: "從你的填答來看，目前家庭在面對金錢壓力與突發狀況時，具備一定的穩定度與調整空間。\n即使遇到變動，通常仍有時間思考與因應。\n建議你留意目前已做得不錯的地方，未來可逐步為長期目標或風險再多做一些準備。",
    good: "你的家庭已具備部分財務基礎，但在某些情境下仍容易感到吃力。\n目前正處於一個「很關鍵的階段」，只要針對幾個弱項做調整，就能實際降低未來的風險。\n建議先從分數較低的面向開始，一次專注改善一件事。",
    fair: "你的填答顯示，家庭在面對突發事件或收入變動時，承受的壓力較大，選擇也相對有限。\n這並不代表你做得不好，而是目前真的承擔了很多現實壓力。\n若能有人陪你一起整理財務狀況，風險是可以被降低的。",
    poor: "目前家庭的財務與心理壓力偏高，很多事情可能只能先撐著。\n這樣的狀態，並不適合一個人獨自面對。\n建議儘早尋求可信任的專業或支持資源，一起找出可行的下一步。",
  },
  
  // 優先討論方向列表
  priorityOptions: [
    "緊急經濟援助",
    "債務管理",
    "儲蓄培養",
    "金融教育",
    "就業支持",
    "金融服務連結",
    "社會網絡建立",
    "心理支持",
  ] as const,
  
  // 優先方向判斷規則（題目 ID -> 優先方向）
  priorityRules: [
    { questionIds: [1, 5], priority: "緊急經濟援助", threshold: 3 },
    { questionIds: [4], priority: "債務管理", threshold: 3 },
    { questionIds: [3], priority: "儲蓄培養", threshold: 3 },
    { questionIds: [7, 8], priority: "金融教育", threshold: 3 },
    { questionIds: [2], priority: "就業支持", threshold: 3 },
    { questionIds: [6], priority: "金融服務連結", threshold: 3 },
    { questionIds: [9], priority: "社會網絡建立", threshold: 3 },
    { questionIds: [10], priority: "心理支持", threshold: 3 },
  ],
} as const

// ==================== 問卷題目 ====================
// 從 questionnaire-data.ts 導入，或在此處定義
export { questions } from "./questionnaire-data"

// ==================== 結構判讀形容詞配置（A-D） ====================

export const structureTypeConfig = {
  A: {
    name: "只能依靠自己的",
    subtitle: "單一支撐型｜高風險",
    description: "生活主要仰賴穩定但單一的收入來源，\n在儲蓄、支持系統與心理信心上相對不足，承接點高度集中。\n\n現況未必失序，但一旦關鍵支點變動，其他面向難以分攤衝擊。",
  },
  B: {
    name: "勉強撐著的",
    subtitle: "撐著型｜中高風險",
    description: "能維持基本運作，但在收入穩定度、儲蓄與管理上緩衝不足，\n對未來的掌握感與信心偏低。\n\n有努力、有行動，但突發事件易放大壓力，調整空間有限。",
  },
  C: {
    name: "有人接住的",
    subtitle: "人脈承接型｜中低風險",
    description: "即使收入不穩或債務壓力偏高，\n仍具備可討論、可求助的支持系統與行動信心。\n\n韌性來自關係與心理承接，調整潛力高於表面數字。",
  },
  D: {
    name: "有很多依靠的",
    subtitle: "多元支撐型｜低風險",
    description: "由多個面向共同支撐（儲蓄、支持、管理、信心），\n即使收入不特別高，整體仍具備良好彈性。\n\n壓力存在但不集中，任一面向變動仍可承接。",
  },
} as const

// ==================== 類型定義 ====================

export type QuestionnaireConfig = typeof questionnaireConfig
export type StructureType = keyof typeof structureTypeConfig


