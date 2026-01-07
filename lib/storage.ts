/**
 * 數據儲存工具
 * 用於儲存和讀取使用者的評估結果，計算平均值
 */

import type { DimensionScores } from "@/types/questionnaire"

const STORAGE_KEY = "questionnaire_results"

export interface StoredResult {
  dimensionScores: DimensionScores
  timestamp: number
}

/**
 * 儲存使用者的評估結果
 */
export function saveResult(dimensionScores: DimensionScores): void {
  if (typeof window === "undefined") return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const results: StoredResult[] = stored ? JSON.parse(stored) : []
    
    // 添加新結果
    results.push({
      dimensionScores,
      timestamp: Date.now(),
    })
    
    // 儲存（最多保留 1000 筆記錄）
    const maxRecords = 1000
    const trimmedResults = results.slice(-maxRecords)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedResults))
  } catch (error) {
    console.error("Failed to save result:", error)
  }
}

/**
 * 讀取所有歷史結果
 */
export function getAllResults(): StoredResult[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to read results:", error)
    return []
  }
}

/**
 * 計算所有使用者的平均構面分數
 */
export function calculateAverageScores(): DimensionScores | null {
  const results = getAllResults()
  
  if (results.length === 0) {
    return null
  }
  
  // 初始化累加器
  const totals: DimensionScores = {
    收入穩定度: 0,
    儲備應變力: 0,
    債務與保障: 0,
    金錢管理: 0,
    資源連結: 0,
    心理與規劃: 0,
  }
  
  // 累加所有分數
  results.forEach((result) => {
    totals.收入穩定度 += result.dimensionScores.收入穩定度
    totals.儲備應變力 += result.dimensionScores.儲備應變力
    totals.債務與保障 += result.dimensionScores.債務與保障
    totals.金錢管理 += result.dimensionScores.金錢管理
    totals.資源連結 += result.dimensionScores.資源連結
    totals.心理與規劃 += result.dimensionScores.心理與規劃
  })
  
  // 計算平均值
  const count = results.length
  return {
    收入穩定度: Math.round((totals.收入穩定度 / count) * 10) / 10,
    儲備應變力: Math.round((totals.儲備應變力 / count) * 10) / 10,
    債務與保障: Math.round((totals.債務與保障 / count) * 10) / 10,
    金錢管理: Math.round((totals.金錢管理 / count) * 10) / 10,
    資源連結: Math.round((totals.資源連結 / count) * 10) / 10,
    心理與規劃: Math.round((totals.心理與規劃 / count) * 10) / 10,
  }
}

/**
 * 獲取統計資訊
 */
export function getStatistics(): {
  totalCount: number
  averageScores: DimensionScores | null
} {
  const results = getAllResults()
  const averageScores = calculateAverageScores()
  
  return {
    totalCount: results.length,
    averageScores,
  }
}

/**
 * 清除所有歷史數據（用於測試或重置）
 */
export function clearAllResults(): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear results:", error)
  }
}

