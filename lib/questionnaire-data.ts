import type { Question } from "@/types/questionnaire"

export const questions: Question[] = [
  {
    id: 1,
    text: "如果家庭主要收入突然減少一半，三個月內的生活會是：",
    options: [
      { label: "A. 基本生活仍能維持，不需借錢", value: "A", score: 10 },
      { label: "B. 需要明顯縮減開支，但還撐得住", value: "B", score: 7 },
      { label: "C. 很快出現生活困難", value: "C", score: 3 },
      { label: "D. 幾乎立刻無法負擔生活", value: "D", score: 0 },
    ],
  },
  {
    id: 2,
    text: "目前家庭主要收入來源是：",
    options: [
      { label: "A. 穩定固定收入", value: "A", score: 10 },
      { label: "B. 大致穩定但偶有波動", value: "B", score: 7 },
      { label: "C. 臨時、接案或零工為主", value: "C", score: 3 },
      { label: "D. 目前沒有穩定收入", value: "D", score: 0 },
    ],
  },
  {
    id: 3,
    text: "若現在沒有收入，家庭儲蓄可支撐：",
    options: [
      { label: "A. 超過 3 個月生活費", value: "A", score: 10 },
      { label: "B. 1–3 個月", value: "B", score: 7 },
      { label: "C. 不到 1 個月", value: "C", score: 3 },
      { label: "D. 幾乎沒有儲蓄", value: "D", score: 0 },
    ],
  },
  {
    id: 4,
    text: "目前家庭的債務狀況是：",
    options: [
      { label: "A. 幾乎無債，或完全可掌控", value: "A", score: 10 },
      { label: "B. 有債務但可正常繳款", value: "B", score: 7 },
      { label: "C. 債務常影響生活安排", value: "C", score: 3 },
      { label: "D. 債務造成高度壓力或逾期", value: "D", score: 0 },
    ],
  },
  {
    id: 5,
    text: "若突然需要 NT$10,000–30,000 的緊急支出：",
    options: [
      { label: "A. 可用儲蓄或預備金處理", value: "A", score: 10 },
      { label: "B. 需向親友協助或調度", value: "B", score: 7 },
      { label: "C. 需借貸或刷卡", value: "C", score: 3 },
      { label: "D. 幾乎無法處理", value: "D", score: 0 },
    ],
  },
  {
    id: 6,
    text: "面對疾病、意外或重大風險時：",
    options: [
      { label: "A. 有足夠保險或安排，較安心", value: "A", score: 10 },
      { label: "B. 有基本保障，但仍擔心", value: "B", score: 7 },
      { label: "C. 只有健保", value: "C", score: 3 },
      { label: "D. 幾乎沒有任何準備", value: "D", score: 0 },
    ],
  },
  {
    id: 7,
    text: "使用銀行或金融服務的情況是：",
    options: [
      { label: "A. 熟悉轉帳、繳費、帳戶管理", value: "A", score: 10 },
      { label: "B. 會基本操作或有固定協助方式", value: "B", score: 7 },
      { label: "C. 不太會用，常覺得困難", value: "C", score: 3 },
      { label: "D. 幾乎沒有使用", value: "D", score: 0 },
    ],
  },
  {
    id: 8,
    text: "關於家庭用錢的管理方式：",
    options: [
      { label: "A. 有預算或清楚掌握支出", value: "A", score: 10 },
      { label: "B. 偶爾記錄或討論", value: "B", score: 7 },
      { label: "C. 大多憑感覺使用", value: "C", score: 3 },
      { label: "D. 經常月底才發現錢不夠", value: "D", score: 0 },
    ],
  },
  {
    id: 9,
    text: "當家庭遇到經濟困難時：",
    options: [
      { label: "A. 有可信任的人或單位可商量", value: "A", score: 10 },
      { label: "B. 有少數人可幫忙", value: "B", score: 7 },
      { label: "C. 幾乎沒有可依靠對象", value: "C", score: 3 },
      { label: "D. 完全只能自己承擔", value: "D", score: 0 },
    ],
  },
  {
    id: 10,
    text: "整體而言，你對家庭未來經濟的感受是：",
    options: [
      { label: "A. 雖有壓力，但有方向與希望", value: "A", score: 10 },
      { label: "B. 有些不安，但仍撐得住", value: "B", score: 7 },
      { label: "C. 常感焦慮、無力", value: "C", score: 3 },
      { label: "D. 對未來感到非常擔心或絕望", value: "D", score: 0 },
    ],
  },
]
