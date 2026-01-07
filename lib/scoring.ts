import type { QuestionnaireResult, DimensionScores, StructureType, AnimalType } from "@/types/questionnaire"

export function calculateResult(answers: Record<number, number>): QuestionnaireResult {
  // 計算總分（0-100）
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)

  // 計算六構面分數（0-100）
  const dimensionScores: DimensionScores = {
    收入穩定度: ((answers[1] || 0) + (answers[2] || 0)) / 2 * 10,
    儲備應變力: ((answers[3] || 0) + (answers[5] || 0)) / 2 * 10,
    債務與保障: ((answers[4] || 0) + (answers[6] || 0)) / 2 * 10,
    金錢管理: ((answers[7] || 0) + (answers[8] || 0)) / 2 * 10,
    資源連結: (answers[9] || 0) * 10,
    心理與規劃: (answers[10] || 0) * 10,
  }

  // 判斷結構型（A-D）
  const structureType = determineStructureType(dimensionScores, answers)

  // 判斷狀態理解動物（5 類）
  const animalType = determineAnimalType(dimensionScores)

  // 判斷等級（用於顏色顯示）
  let level: QuestionnaireResult["level"]
  if (totalScore >= 75) {
    level = "resilient"
  } else if (totalScore >= 60) {
    level = "approaching"
  } else if (totalScore >= 40) {
    level = "fragile"
  } else {
    level = "highly-fragile"
  }

  const priorities = determinePriorities(answers)

  return {
    totalScore,
    level,
    priorities,
    dimensionScores,
    structureType,
    animalType,
  }
}

function determineStructureType(
  dimensions: DimensionScores,
  answers: Record<number, number>
): StructureType {
  const {
    收入穩定度,
    儲備應變力,
    債務與保障,
    金錢管理,
    資源連結,
    心理與規劃,
  } = dimensions

  // C型：有人接住的（人脈承接型）
  // 支持系統高、心理信心高（即使收入不穩或債務偏高）
  if (資源連結 >= 70 && 心理與規劃 >= 70) {
    return "C"
  }

  // A型：只能依靠自己的（單一支撐型）
  // 收入穩定度高，但儲蓄、支持系統、心理信心低
  const otherDimensions = [
    儲備應變力,
    資源連結,
    心理與規劃,
  ]
  const lowCount = otherDimensions.filter((d) => d < 50).length
  if (收入穩定度 >= 70 && lowCount >= 2) {
    return "A"
  }

  // B型：勉強撐著的（撐著型）
  // 收入普通或不穩，儲蓄低，管理能力中低，心理信心中低
  if (
    儲備應變力 < 50 &&
    金錢管理 < 50 &&
    心理與規劃 < 60
  ) {
    return "B"
  }

  // D型：有很多依靠的（多元支撐型）（預設）
  // 多個面向共同支撐（儲蓄、支持、管理、信心）
  return "D"
}

function determineAnimalType(dimensions: DimensionScores): AnimalType {
  const {
    收入穩定度,
    儲備應變力,
    債務與保障,
    金錢管理,
    資源連結,
    心理與規劃,
  } = dimensions

  // 🐱 縮成一團休息的貓（高風險疊加型）
  // 儲蓄低、債務壓力高、支持系統低、心理信心低
  if (
    儲備應變力 < 40 &&
    債務與保障 < 50 &&
    資源連結 < 50 &&
    心理與規劃 < 50
  ) {
    return "cat"
  }

  // 🐘 站在細繩上的大象（結構型脆弱）
  // 收入穩定高，儲蓄低，支持系統低，心理信心低
  if (
    收入穩定度 >= 70 &&
    儲備應變力 < 50 &&
    資源連結 < 50 &&
    心理與規劃 < 50
  ) {
    return "elephant"
  }

  // 🐒 在樹間移動的猴子（社會韌性型）
  // 收入穩定低，債務壓力高，管理能力低，但支持系統高，心理信心高
  if (
    收入穩定度 < 50 &&
    債務與保障 < 50 &&
    金錢管理 < 50 &&
    資源連結 >= 70 &&
    心理與規劃 >= 70
  ) {
    return "monkey"
  }

  // 🐕 準備出發的小狗（心理啟動型）
  // 心理信心高，但管理能力低，儲蓄低
  if (
    心理與規劃 >= 70 &&
    金錢管理 < 50 &&
    儲備應變力 < 50
  ) {
    return "dog"
  }

  // 🐢 穩定前行的烏龜（隱性韌性型）（預設）
  // 六構面皆中等，無特別高或低
  return "turtle"
}

function determinePriorities(answers: Record<number, number>): string[] {
  const priorities: string[] = []

  // 1. 緊急經濟援助（題1或題5顯示狀態較弱）
  if (answers[1] <= 3 || answers[5] <= 3) {
    priorities.push("緊急經濟援助")
  }

  // 2. 債務管理（題4顯示狀態較弱）
  if (answers[4] <= 3) {
    priorities.push("債務管理")
  }

  // 3. 儲蓄培養（題3顯示狀態較弱）
  if (answers[3] <= 3) {
    priorities.push("儲蓄培養")
  }

  // 4. 金融教育（題7或題8顯示狀態較弱）
  if (answers[7] <= 3 || answers[8] <= 3) {
    priorities.push("金融教育")
  }

  // 5. 就業支持（題2顯示狀態較弱）
  if (answers[2] <= 3) {
    priorities.push("就業支持")
  }

  // 6. 金融服務連結（題6顯示狀態較弱）
  if (answers[6] <= 3) {
    priorities.push("金融服務連結")
  }

  // 7. 社會網絡建立（題9顯示狀態較弱）
  if (answers[9] <= 3) {
    priorities.push("社會網絡建立")
  }

  // 8. 心理支持（題10顯示狀態較弱）
  if (answers[10] <= 3) {
    priorities.push("心理支持")
  }

  return priorities
}
