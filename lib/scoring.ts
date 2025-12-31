import type { QuestionnaireResult } from "@/types/questionnaire"

export function calculateResult(answers: Record<number, number>): QuestionnaireResult {
  const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)

  let level: QuestionnaireResult["level"]
  if (totalScore >= 71) {
    level = "resilient"
  } else if (totalScore >= 51) {
    level = "approaching"
  } else if (totalScore >= 31) {
    level = "fragile"
  } else {
    level = "highly-fragile"
  }

  const priorities = determinePriorities(answers)

  return {
    totalScore,
    level,
    priorities,
  }
}

function determinePriorities(answers: Record<number, number>): string[] {
  const priorities: string[] = []

  // 1️⃣ 緊急經濟援助
  if (answers[1] <= 3 || answers[5] === 0) {
    priorities.push("緊急經濟援助")
  }

  // 2️⃣ 債務管理
  if (answers[4] <= 3) {
    priorities.push("債務管理")
  }

  // 3️⃣ 儲蓄培養
  if (answers[3] <= 3) {
    priorities.push("儲蓄培養")
  }

  // 4️⃣ 金融教育
  if (answers[7] <= 3 || answers[8] <= 3) {
    priorities.push("金融教育")
  }

  // 5️⃣ 就業支持
  if (answers[2] <= 3) {
    priorities.push("就業支持")
  }

  // 6️⃣ 金融服務連結
  if (answers[6] <= 3) {
    priorities.push("金融服務連結")
  }

  // 7️⃣ 社會網絡建立
  if (answers[9] <= 3) {
    priorities.push("社會網絡建立")
  }

  // 8️⃣ 心理支持
  if (answers[10] <= 3) {
    priorities.push("心理支持")
  }

  return priorities
}
