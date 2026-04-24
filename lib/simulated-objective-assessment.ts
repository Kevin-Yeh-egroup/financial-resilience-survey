import { DEMO_VERCEL_ASSESSMENT_SCORES, type ObjectiveResilienceScores } from "@/lib/resilience-comparison-rows"

/** 與官網個人版示範「上次評估」一致（總分 40 / 100） */
export const SIMULATED_OBJECTIVE_PREVIOUS_SCORES: ObjectiveResilienceScores = {
  經濟資源: 9,
  應急能力: 5,
  金融包容性: 11,
  財務管理能力: 6,
  社會資本: 9,
  心理韌性: 0,
}

/**
 * 模擬：使用者已在評估平台完成問卷，本站「直接取得」的最新一筆結果。
 * 正式上線時改為呼叫施測平台 API／登入後同步，取代此常數。
 */
export const SIMULATED_FETCHED_ASSESSMENT = {
  /** 與 DEMO_VERCEL / 官網 58 分示範列一致 */
  scores: DEMO_VERCEL_ASSESSMENT_SCORES,
  previousScores: SIMULATED_OBJECTIVE_PREVIOUS_SCORES,
  total: 58,
  previousTotal: 40,
  levelLabel: "有風險",
  subtitleLabel: "財務脆弱",
  assessedAtIso: "2025-04-10T12:00:00.000+08:00",
  respondentDemoName: "王小明",
  attemptOrdinal: 2,
  sourceHref: "https://financial-resilience-assessment-too.vercel.app/personal",
} as const
