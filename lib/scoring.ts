import type { QuestionnaireResult, DimensionScores } from "@/types/questionnaire"

export function calculateResult(answers: Record<number, number>): QuestionnaireResult {
  // 計算總分（0-100）
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)

  // 計算六構面分數（0-100）
  const dimensionScores: DimensionScores = {
    收入與穩定性: ((answers[1] || 0) + (answers[2] || 0)) / 2 * 10,
    儲蓄與突發應對: ((answers[3] || 0) + (answers[5] || 0)) / 2 * 10,
    債務壓力與風險保障: ((answers[4] || 0) + (answers[6] || 0)) / 2 * 10,
    金錢管理與金融使用: ((answers[7] || 0) + (answers[8] || 0)) / 2 * 10,
    支持資源與連結: (answers[9] || 0) * 10,
    心理韌性與未來感: (answers[10] || 0) * 10,
  }

  // 判斷結構型（A-E）
  const structureType = determineStructureType(dimensionScores, answers)

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
  }
}

function determineStructureType(
  dimensions: DimensionScores,
  answers: Record<number, number>
): "A" | "B" | "C" | "D" | "E" {
  const {
    收入與穩定性,
    儲蓄與突發應對,
    債務壓力與風險保障,
    金錢管理與金融使用,
    支持資源與連結,
    心理韌性與未來感,
  } = dimensions

  // E型：壓力集中結構（優先判斷，條件最嚴格）
  // 儲蓄低、債務高、支持資源低、心理韌性低（多項同時成立）
  if (
    儲蓄與突發應對 < 40 &&
    債務壓力與風險保障 < 50 &&
    支持資源與連結 < 50 &&
    心理韌性與未來感 < 50
  ) {
    return "E"
  }

  // C型：人脈承接結構
  // 支持資源高、心理韌性高
  if (支持資源與連結 >= 70 && 心理韌性與未來感 >= 70) {
    return "C"
  }

  // A型：單一支撐結構
  // 收入與穩定性偏高，其餘多數構面偏低或中低
  const otherDimensions = [
    儲蓄與突發應對,
    債務壓力與風險保障,
    金錢管理與金融使用,
    支持資源與連結,
    心理韌性與未來感,
  ]
  const lowCount = otherDimensions.filter((d) => d < 50).length
  if (收入與穩定性 >= 70 && lowCount >= 3) {
    return "A"
  }

  // B型：撐著運作結構
  // 儲蓄偏低、金錢管理偏低、心理韌性偏低或中低
  if (
    儲蓄與突發應對 < 50 &&
    金錢管理與金融使用 < 50 &&
    心理韌性與未來感 < 60
  ) {
    return "B"
  }

  // D型：多元支撐結構（預設）
  // 心理韌性、支持資源、金錢管理至少兩項為中高以上，無明顯疊加型低分
  return "D"
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
