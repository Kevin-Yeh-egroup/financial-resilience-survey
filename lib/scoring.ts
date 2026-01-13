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

  // 判斷結構型（優先覆蓋制，由最脆弱到最成熟）
  const structureType = determineStructureType(dimensionScores, answers)

  // 判斷狀態理解動物（8 類）
  const animalType = determineAnimalType(dimensionScores, answers)

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

  // 分數區間定義（燈號系統 v3.0）
  // 🔴 0–34：高度脆弱（紅燈）
  // 🟠 35–54：結構吃力（橘燈）
  // 🟡 55–74：接近穩定（黃燈）
  // 🟢 75–100：韌性良好（綠燈）

  // 輔助函數：判斷分數區間
  const isRed = (score: number) => score >= 0 && score <= 34
  const isOrange = (score: number) => score >= 35 && score <= 54
  const isYellow = (score: number) => score >= 55 && score <= 74
  const isGreen = (score: number) => score >= 75 && score <= 100
  const isOrangeOrRed = (score: number) => score >= 0 && score <= 54
  const isYellowOrGreen = (score: number) => score >= 55 && score <= 100

  const allDimensions = [收入穩定度, 儲備應變力, 債務與保障, 金錢管理, 資源連結, 心理與規劃]
  const redCount = allDimensions.filter((d) => isRed(d)).length
  const supportDimensions = [儲備應變力, 資源連結, 心理與規劃]

  // 優先覆蓋制：由最脆弱到最成熟依序檢查，符合即停止

  // 1. 循環消耗（cycle）
  // 燈號條件：儲備應變力🔴、債務與保障🔴、金錢管理🟠或🔴、心理與規劃🟠或🔴、資源連結🟠或🔴
  // （至少兩項紅燈，且必含儲備與債務）
  if (
    isRed(儲備應變力) &&
    isRed(債務與保障) &&
    isOrangeOrRed(金錢管理) &&
    isOrangeOrRed(心理與規劃) &&
    isOrangeOrRed(資源連結)
  ) {
    return "cycle"
  }

  // 2. 單一支撐（single）
  // 燈號條件：收入穩定度🟢、儲備應變力🟠或🔴、資源連結🟠或🔴、心理與規劃🟠或🔴
  // （上述三項中至少兩項成立）
  const lowSupportCount = supportDimensions.filter((d) => isOrangeOrRed(d)).length
  if (isGreen(收入穩定度) && lowSupportCount >= 2) {
    return "single"
  }

  // 3. 吃力支撐（struggling）
  // 燈號條件：儲備應變力🟠、金錢管理🟠、心理與規劃🟠～🟡、六大指標中🔴不得超過一項
  if (
    isOrange(儲備應變力) &&
    isOrange(金錢管理) &&
    (isOrange(心理與規劃) || isYellow(心理與規劃)) &&
    redCount <= 1
  ) {
    return "struggling"
  }

  // 4. 資源卡住（stuck）
  // 燈號條件：收入穩定度🟡～🟢、儲備應變力🟠或🔴、金錢管理🟠或🔴、心理與規劃🟠或🔴
  // （資源連結可為🟡或🟢，但未形成實質承接）
  if (
    (isYellow(收入穩定度) || isGreen(收入穩定度)) &&
    isOrangeOrRed(儲備應變力) &&
    isOrangeOrRed(金錢管理) &&
    isOrangeOrRed(心理與規劃)
  ) {
    return "stuck"
  }

  // 5. 人脈承接（supported）
  // 燈號條件：資源連結🟢、心理與規劃🟢、其餘四項中可有一至二項為🟠或🔴
  const otherDimensions = [收入穩定度, 儲備應變力, 債務與保障, 金錢管理]
  const otherLowCount = otherDimensions.filter((d) => isOrangeOrRed(d)).length
  if (isGreen(資源連結) && isGreen(心理與規劃) && otherLowCount <= 2) {
    return "supported"
  }

  // 6. 日常穩定（stable）
  // 燈號條件：收入穩定度🟡～🟢、金錢管理🟡、心理與規劃🟡、儲備應變力🟠～🟡、資源連結🟠～🟡、六大指標中🔴不得超過一項
  if (
    (isYellow(收入穩定度) || isGreen(收入穩定度)) &&
    isYellow(金錢管理) &&
    isYellow(心理與規劃) &&
    (isOrange(儲備應變力) || isYellow(儲備應變力)) &&
    (isOrange(資源連結) || isYellow(資源連結)) &&
    redCount <= 1
  ) {
    return "stable"
  }

  // 7. 成長建構（growing）
  // 燈號條件：心理與規劃🟢、金錢管理🟡～🟢、資源連結🟡～🟢、儲備應變力🟠～🟡、六大指標中🔴不得超過一項
  if (
    isGreen(心理與規劃) &&
    (isYellow(金錢管理) || isGreen(金錢管理)) &&
    (isYellow(資源連結) || isGreen(資源連結)) &&
    (isOrange(儲備應變力) || isYellow(儲備應變力)) &&
    redCount <= 1
  ) {
    return "growing"
  }

  // 8. 成熟穩健（mature）
  // 燈號條件：至少三項指標為🟢，且須包含以下兩類以上（儲備應變力、資源連結、心理與規劃），其餘指標至少為🟡，六大指標中🔴為0
  const greenCount = allDimensions.filter((d) => isGreen(d)).length
  const supportDimensionsGreen = supportDimensions.filter((d) => isGreen(d)).length
  const allAtLeastYellow = allDimensions.every((d) => isYellowOrGreen(d))
  if (
    greenCount >= 3 &&
    supportDimensionsGreen >= 2 &&
    allAtLeastYellow &&
    redCount === 0
  ) {
    return "mature"
  }

  // 預設返回日常穩定
  return "stable"
}

function determineAnimalType(
  dimensions: DimensionScores,
  answers: Record<number, number>
): AnimalType {
  const {
    收入穩定度,
    儲備應變力,
    債務與保障,
    金錢管理,
    資源連結,
    心理與規劃,
  } = dimensions

  // 分數區間定義（燈號系統 v3.0）
  // 🔴 0–34：高度脆弱（紅燈）
  // 🟠 35–54：結構吃力（橘燈）
  // 🟡 55–74：接近穩定（黃燈）
  // 🟢 75–100：韌性良好（綠燈）

  // 輔助函數：判斷分數區間
  const isRed = (score: number) => score >= 0 && score <= 34
  const isOrange = (score: number) => score >= 35 && score <= 54
  const isYellow = (score: number) => score >= 55 && score <= 74
  const isGreen = (score: number) => score >= 75 && score <= 100
  const isOrangeOrRed = (score: number) => score >= 0 && score <= 54
  const isYellowOrGreen = (score: number) => score >= 55 && score <= 100

  // 先定義六大指標陣列，用於檢查
  const allDimensions = [收入穩定度, 儲備應變力, 債務與保障, 金錢管理, 資源連結, 心理與規劃]

  // 🐱 1. 縮成一團的貓（高風險疊加型）
  // 符合以下任一即歸類：
  // - 六大指標中 🔴 ≥ 2 項，且其中至少包含「儲備應變力」
  // - 儲備應變力為 🔴，且在「債務與保障、資源連結、心理與規劃」中任一為 🔴
  // - 在「儲備、債務、資源、心理」四項中，🔴 ≥ 3 項
  const totalRedCount = allDimensions.filter((d) => isRed(d)).length
  const criticalDimensions = [儲備應變力, 債務與保障, 資源連結, 心理與規劃]
  const criticalRedCount = criticalDimensions.filter((d) => isRed(d)).length
  
  if (
    (totalRedCount >= 2 && isRed(儲備應變力)) ||
    (isRed(儲備應變力) && (isRed(債務與保障) || isRed(資源連結) || isRed(心理與規劃))) ||
    criticalRedCount >= 3
  ) {
    return "cat"
  }

  // 🐜 2. 努力拖家的小螞蟻（透支撐持型）
  // 同時符合：
  // - 收入穩定度 🟢
  // - 儲備應變力 🔴
  // - 心理與規劃 ≤ 🟠
  // - 資源連結 ≤ 🟠
  if (
    isGreen(收入穩定度) &&
    isRed(儲備應變力) &&
    isOrangeOrRed(心理與規劃) &&
    isOrangeOrRed(資源連結)
  ) {
    return "ant"
  }

  // 🐘 3. 站在細繩上的大象（結構型脆弱）
  // 同時符合：
  // - 收入穩定度 🟢
  // - 儲備應變力 🟠
  // - 且心理與規劃 或 資源連結 為 🔴
  if (
    isGreen(收入穩定度) &&
    isOrange(儲備應變力) &&
    (isRed(心理與規劃) || isRed(資源連結))
  ) {
    return "elephant"
  }

  // 🐂 4. 努力負重的牛（高負荷撐持型）
  // 同時符合：
  // - 收入穩定度 🟢
  // - 儲備應變力 🟠
  // - 心理與規劃 🟡
  // - 資源連結 ≤ 🟠
  if (
    isGreen(收入穩定度) &&
    isOrange(儲備應變力) &&
    isYellow(心理與規劃) &&
    isOrangeOrRed(資源連結)
  ) {
    return "ox"
  }

  // 🐪 5. 撐很久的駱駝（慢性全面吃力型）
  // 同時符合：
  // - 六大指標皆為 🟠，或五項為 🟠、一項為 🟡
  // - 無 🔴，但亦未達烏龜標準
  const hasRed = allDimensions.some((d) => isRed(d))
  const yellowCount = allDimensions.filter((d) => isYellow(d)).length
  const orangeCount = allDimensions.filter((d) => isOrange(d)).length
  const greenCount = allDimensions.filter((d) => isGreen(d)).length
  if (
    !hasRed &&
    greenCount === 0 &&
    yellowCount <= 1 &&
    orangeCount + yellowCount === 6
  ) {
    return "camel"
  }

  // 🦭 6. 被照顧著的水獺（依賴型安全網）
  // 同時符合：
  // - 資源連結 🟢
  // - 心理與規劃 ≥ 🟡
  // - 在「收入、儲備、金錢管理」中至少 2 項 ≤ 🟠
  const financialDimensions = [收入穩定度, 儲備應變力, 金錢管理]
  const lowFinancialCount = financialDimensions.filter((d) => isOrangeOrRed(d)).length
  if (
    isGreen(資源連結) &&
    isYellowOrGreen(心理與規劃) &&
    lowFinancialCount >= 2
  ) {
    return "otter"
  }

  // 🐒 7. 在樹間移動的猴子（社會韌性型）
  // 同時符合：
  // - 資源連結 🟢
  // - 心理與規劃 🟢
  // - 在「收入、儲備、金錢管理、債務與保障」四項中：≤ 🟠 至少 2 項
  const monkeyDimensions = [收入穩定度, 儲備應變力, 金錢管理, 債務與保障]
  const monkeyLowCount = monkeyDimensions.filter((d) => isOrangeOrRed(d)).length
  if (
    isGreen(資源連結) &&
    isGreen(心理與規劃) &&
    monkeyLowCount >= 2
  ) {
    return "monkey"
  }

  // 🐿️ 8. 躲在葉子下的小松鼠（保護網型受傷狀態）
  // 同時符合：
  // - 資源連結 🟢
  // - 債務與保障 🟢
  // - 儲備應變力 或 心理與規劃 為 🟠
  if (
    isGreen(資源連結) &&
    isGreen(債務與保障) &&
    (isOrange(儲備應變力) || isOrange(心理與規劃))
  ) {
    return "squirrel"
  }

  // 🐻 9. 慢慢探出頭的小熊（恢復中狀態）
  // 同時符合：
  // - 資源連結 🟢
  // - 心理與規劃 🟢
  // - 在「收入、儲備、金錢管理、債務與保障」中：≤ 🟠 至少 1 項，≥ 🟡 至少 1 項
  // - 且不符合猴子（避免重疊，猴子需要至少2項≤🟠）
  const bearDimensions = [收入穩定度, 儲備應變力, 金錢管理, 債務與保障]
  const bearLowCount = bearDimensions.filter((d) => isOrangeOrRed(d)).length
  const bearHighCount = bearDimensions.filter((d) => isYellowOrGreen(d)).length
  if (
    isGreen(資源連結) &&
    isGreen(心理與規劃) &&
    bearLowCount >= 1 &&
    bearHighCount >= 1 &&
    bearLowCount < 2  // 不符合猴子（猴子需要至少2項≤🟠）
  ) {
    return "bear"
  }

  // 🐶 10. 準備出發的小狗（心理啟動型）
  // 同時符合：
  // - 心理與規劃 🟢
  // - 儲備應變力 ≤ 🟠
  // - 金錢管理 ≤ 🟠
  // - 不要求資源連結為高
  if (
    isGreen(心理與規劃) &&
    isOrangeOrRed(儲備應變力) &&
    isOrangeOrRed(金錢管理)
  ) {
    return "dog"
  }

  // 🦅 11. 盤旋高空的老鷹（高能力低安全網型）
  // 同時符合：
  // - 心理與規劃 🟢
  // - 金錢管理 🟢
  // - 在「儲備、債務與保障、資源連結」中至少 1 項 ≤ 🟠
  if (
    isGreen(心理與規劃) &&
    isGreen(金錢管理) &&
    (isOrangeOrRed(儲備應變力) || isOrangeOrRed(債務與保障) || isOrangeOrRed(資源連結))
  ) {
    return "eagle"
  }

  // 🐢 12. 穩定前行的烏龜（日常穩定型，純黃燈層）
  // 同時符合：
  // - 六大指標中 🔴 = 0
  // - 🟢 = 0（不允許任何綠燈）
  // - 🟠 ≤ 1
  // - 其餘皆為 🟡（55–74）
  // - 核心三項（收入穩定度、儲備應變力、心理與規劃）皆 ≥ 🟡
  const greenCount = allDimensions.filter((d) => isGreen(d)).length
  const orangeCount = allDimensions.filter((d) => isOrange(d)).length
  const coreDimensions = [收入穩定度, 儲備應變力, 心理與規劃]
  const coreAllYellowOrGreen = coreDimensions.every((d) => isYellowOrGreen(d))
  
  if (
    !hasRed &&
    greenCount === 0 &&
    orangeCount <= 1 &&
    coreAllYellowOrGreen
  ) {
    return "turtle"
  }

  // 🐎 13. 穩健奔跑的馬（成熟韌性型）
  // 同時符合：
  // - 六大指標中 🟢 ≥ 4
  // - 且「儲備應變力、資源連結、心理與規劃」三項中至少 2 項為 🟢
  // - 無 🔴、無 🟠
  // - 其餘指標至少為 🟡
  const supportDimensions = [儲備應變力, 資源連結, 心理與規劃]
  const supportGreenCount = supportDimensions.filter((d) => isGreen(d)).length
  const allAtLeastYellow = allDimensions.every((d) => isYellowOrGreen(d))
  
  if (
    greenCount >= 4 &&
    supportGreenCount >= 2 &&
    !hasRed &&
    orangeCount === 0 &&
    allAtLeastYellow
  ) {
    return "horse"
  }

  // 預設返回烏龜（作為兜底類型，如果以上條件都不符合）
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
