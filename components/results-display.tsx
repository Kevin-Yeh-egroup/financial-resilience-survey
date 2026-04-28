"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { QuestionnaireResult, DimensionScores } from "@/types/questionnaire"
import Link from "next/link"
import { ArrowRight, RefreshCw } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { calculateAverageScores, getStatistics } from "@/lib/storage"
interface ResultsDisplayProps {
  result: QuestionnaireResult
  onReset: () => void
}

// 結構判讀形容詞（優先覆蓋制，由最脆弱到最成熟）
const structureTypeConfig = {
  cycle: {
    name: "循環消耗",
    subtitle: "結構會吃掉改善成果",
    description: "緩衝不足、風險暴露高、調節能力低、支持薄弱，形成壓力反覆累積的自我耗損循環。即使短期有收入或協助挹注，結構本身仍會快速把改善吃掉。",
    summary: "怎麼調整都回到原來的。",
    advantage: "你對自己的困難其實很清楚，也知道現在真的很不容易。當有人願意陪你一起看清現況時，改變的可能性是存在的。",
    risk: "多個壓力同時存在，容易一件事接一件事發生。如果沒有外部協助與支持，情況可能會惡化得很快。",
    image: "/一直被拖回原點的.png",
    iconColor: "text-rose-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/20",
  },
  single: {
    name: "單一支撐",
    subtitle: "只靠單一支柱在撐",
    description: "家庭運作高度依賴單一支點，缺乏儲備、支持或心理緩衝作為第二、第三層承接。",
    summary: "現在撐得住，但所有重量都壓在同一個地方。",
    advantage: "你有一個相對穩定的支撐來源（多半是工作或固定收入）。生活目前還能維持基本運作。",
    risk: "太多事情都壓在同一個支點上，一旦這個支點出問題，影響會很大。需要慢慢建立儲備與第二層支持，避免所有風險集中在一處。",
    image: "/只能依靠自己的.png",
    iconColor: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
  struggling: {
    name: "吃力支撐",
    subtitle: "多面向邁入風險、但尚未崩潰",
    description: "生活仍可運作，但各面向緩衝與彈性不足，屬於長期壓力堆積、靠意志力與日常應付在撐的狀態。",
    summary: "一直在撐，但真的很難喘口氣。",
    advantage: "生活雖然吃力，但還沒有完全失去控制。你仍在努力維持秩序，也有調整的空間。",
    risk: "緩衝不夠，一次大的支出或變動就可能讓壓力明顯升高。長期這樣撐，容易身心疲累，卻來不及準備下一步。",
    image: "/勉強撐著的.png",
    iconColor: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  stuck: {
    name: "資源卡住",
    subtitle: "有資源，但無法動用",
    description: "具備一定收入或可求助資源，但因管理能力不足、信心低落或啟動困難，資源無法轉換為實際安全網。遇到壓力仍被動承受，卡在「有可能改善，但尚未啟動」的狀態。",
    summary: "東西都有，卻用不起來的。",
    advantage: "其實身邊或環境中已有可用的資源與機會。只要能把方法與信心建立起來，改善的起點並不遠。",
    risk: "因缺乏方向感或實際做法，資源長期無法轉為真正的幫助。若持續停留在「知道有路，但走不出去」的狀態，壓力會慢慢累積。",
    image: "/有資源卻卡住的.png",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  supported: {
    name: "人脈承接",
    subtitle: "有人接住，但結構尚未獨立穩定（被承接型）",
    description: "面對壓力時主要靠親友、社福或關係網絡即時承接，而非自身儲備或制度性分散風險。內在仍保有信心與行動方向，不致陷入孤立。穩定感來自「有人接住」，而非「自己站得穩」。",
    summary: "條件辛苦，但你不是獨自承擔。",
    advantage: "身邊有人可討論、陪伴與協助，不會獨自承擔。能在關鍵時刻動員資源，避免結構瞬間斷裂。心理韌性仍在，願意面對與調整。",
    risk: "若外部支持減弱，結構本身尚不足以獨立承接衝擊。安全邊際未制度化，容易反覆動用人情與支援。若未同步補強儲備、保障與金錢管理，可能長期停留在「被承接」狀態，難以邁入日常穩定與成長建構。",
    image: "/有人接住的.png",
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  stable: {
    name: "日常穩定",
    subtitle: "多數家庭的基準狀態",
    description: "生活可正常運作，帳單繳得出來，具備基礎管理能力與支持來源。但儲備不厚、承接層數有限，遇到連續壓力事件，容易從穩定迅速轉為吃力。",
    summary: "有幾個支撐點，整體比較安心。",
    advantage: "生活運作大致穩定，收支與日常安排在可掌握範圍內。對未來有基本方向感，也具備一定的調整能力。",
    risk: "儲備與安全邊際不厚實，遇到連續的變動或突發事件時，容易從「還可以」很快變成「開始吃力」。",
    image: "/日常穩定.png",
    iconColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  growing: {
    name: "成長建構",
    subtitle: "結構逐漸成長，邁向穩健",
    description: "不再只是撐著，已開始有意識地整理方向、累積能力與建立第二層承接。內在動機穩定，知道要往哪裡走，緩衝雖未厚實，但結構已進入可成長的上升軌道。",
    summary: "不只是撐著，而是正在長出來。",
    advantage: "已開始有計畫地整理財務、思考未來方向。內在動機與學習意願穩定，支持與工具也逐步到位。",
    risk: "若缺乏持續行動與制度化習慣，成長可能停留在嘗試階段。中途鬆手，容易退回原本只是撐著或日常穩定的狀態。",
    image: "/成長建構.png",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  mature: {
    name: "成熟穩健",
    subtitle: "多元資源承接，財務結構穩健",
    description: "穩定靠多個支柱共同承接：足夠的緩衝儲備、可商量與動員的支持、清楚的方向感與調整能力。某一面向短暫波動時，其他結構仍能分攤衝擊，安全邊際厚、韌性穩健。",
    summary: "多個支撐點，形成穩健的網狀結構。",
    advantage: "不只靠單一收入或單一對象，而是有儲備、有支持、有規劃，多個面向一起形成穩定的承接網。面對變動時，通常有時間與空間調整，不容易被一次事件打垮。",
    risk: "長期穩定下，可能對風險變化的警覺度降低。需要持續關注環境與家庭階段變化，避免過度依賴既有的穩定模式。",
    image: "/成熟穩健.png",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
  },
}

// 狀態理解動物（13 類）
const animalTypeConfig = {
  cat: {
    name: "縮成一團休息的貓",
    subtitle: "高風險疊加型",
    description: "多個層面同時承壓——儲蓄、債務、支持系統或心理狀態都在吃緊。身體與內心都在提醒：沒有多餘空間再承擔新的變動。這不代表你不努力，而是系統性緩衝已很薄。此刻最重要的，是讓壓力被看見、讓支持進來，先讓自己重新感到安全。",
    advantage: "對自身困境高度有感，對風險的警覺性高。一旦獲得適當支持，通常願意配合調整與求助。",
    risk: "多重壓力疊加，財務與心理脆弱度高。若缺乏即時介入與資源連結，容易快速惡化為急難或創傷狀態。",
    emoji: "🐱",
    image: "/貓.png",
    color: "text-red-600",
  },
  ant: {
    name: "努力拖著家的小螞蟻",
    subtitle: "透支撐持型",
    description: "帳單繳得出來、工作還撐著，但幾乎沒有緩衝空間。儲蓄接近用盡，一有突發支出就心驚，長期緊繃疲勞，也缺乏可分擔的對象。靠的是責任感與意志力，而非充足的安全網——外表穩定，其實正在透支。",
    advantage: "責任感強、執行力高，能在壓力下維持家庭基本運作。對工作與家庭承諾度高，不輕易放棄。",
    risk: "緩衝極低，任何失業、疾病或意外都可能瞬間失衡。長期心理耗損，若未補充支持，容易出現身心俱疲或決策失誤。",
    emoji: "🐜",
    image: "/螞蟻.png",
    color: "text-orange-600",
  },
  elephant: {
    name: "站在細繩上的大象",
    subtitle: "結構型脆弱",
    description: "收入結構看似穩定，但支撐點非常狹窄。儲蓄不厚、心理壓力沉重，支持網絡也近乎缺失。整體還站得住，但平衡十分吃力，稍有風吹草動就可能大幅晃動。",
    advantage: "具備維持基本生活的經濟結構。短期內仍有運作能力，不易立即崩潰。",
    risk: "安全邊際極小，抗風險能力不足。心理或社會支持缺口大時，容易在突發事件下快速滑落。",
    emoji: "🐘",
    image: "/大象.png",
    color: "text-blue-600",
  },
  ox: {
    name: "努力負重的牛",
    subtitle: "高負荷撐持型",
    description: "家庭運作穩定、責任清楚，但儲備不足、支援有限，所有重量幾乎都壓在自己身上。習慣忍耐、不喊累，卻在不知不覺中長期高負荷，結構仍在，彈性卻慢慢被消耗。",
    advantage: "穩定度高、責任感強，能長期維持家庭運作。心理尚能撐住，具備調整與持續前行的能力。",
    risk: "長期負荷集中於個人，缺乏支持與緩衝。若未補強儲備與資源，突發事件可能造成結構性斷裂。",
    emoji: "🐂",
    image: "/牛.png",
    color: "text-orange-600",
  },
  camel: {
    name: "撐很久的駱駝",
    subtitle: "慢性全面吃力型",
    description: "沒有立即危機，也沒有真正的綠洲。收入、儲蓄、保障、管理、心理與支持網絡全面吃力，生活能運作卻幾乎無餘裕，任何額外負擔都需精打細算。外表穩定，其實長期慢性耗損。",
    advantage: "耐力高、適應力強，能在資源有限下長期維持運作。面對壓力時不易立即崩解。",
    risk: "長期慢性壓力累積，易出現身心與財務的同步耗竭。若缺乏補給與轉換機制，容易在看似穩定中突然失速。",
    emoji: "🐪",
    image: "/駱駝.png",
    color: "text-yellow-600",
  },
  otter: {
    name: "被照顧著的水獺",
    subtitle: "依賴型安全網",
    description: "身邊有親友、制度或補助支持，讓生活不至於沉沒。困難時總有人能接住，基本安全得以維持。然而自身的收入、儲蓄或金錢管理仍在建立中，安全感多半來自外部支撐——一旦資源減弱，自我結構尚不足以獨立支撐。",
    advantage: "支持網絡豐富，不易完全陷入孤立或斷援狀態。對外部協助的接受度高，較不排斥求助。",
    risk: "若長期停留在被支撐狀態，自立能力與財務韌性成長緩慢。當支持系統變動時，容易出現安全感快速下滑。",
    emoji: "🦭",
    image: "/水獺.png",
    color: "text-blue-600",
  },
  monkey: {
    name: "在樹間移動的猴子",
    subtitle: "社會韌性型",
    description: "經濟結構尚未完全穩定，但你不孤單、不僵住。知道如何向外連結資源，面對環境改變時懂得換路找新支點。韌性不只來自存款，而是來自人際網絡與調整能力。",
    advantage: "支持網絡與心理調節力強，遇到困難較不易孤立。對變動的適應力高，願意嘗試不同解方。",
    risk: "若長期未補強財務結構與管理能力，可能形成「靠關係撐」而非「靠結構穩」的狀態。當支持資源同時受限時，抗風險力仍不足。",
    emoji: "🐒",
    image: "/猴子.png",
    color: "text-purple-600",
  },
  squirrel: {
    name: "躲在葉子下的小松鼠",
    subtitle: "保護網型受傷狀態",
    description: "已準備好保險、制度性資源或支持網絡，但最近遭遇突發支出、健康或情緒衝擊，讓內心或儲蓄暫時受傷。你不是毫無防護，而是正在修補中——給自己時間，這層保護網仍是重新站穩的基礎。",
    advantage: "制度性保障與支持系統完整，不易完全失去安全網。願意使用資源與求助，具備修復條件。",
    risk: "若長期停留在防禦與療傷狀態，可能延後重建行動與結構調整。過度依賴保護網，忽略儲備與能力的再累積。",
    emoji: "🐿️",
    image: "/松鼠.png",
    color: "text-yellow-600",
  },
  bear: {
    name: "慢慢探出頭的小熊",
    subtitle: "恢復中狀態",
    description: "曾經歷困難時期，現在內心逐漸回暖，身邊有支持的人與資源，心理也開始看見方向。只是部分財務結構仍在修復中——儲蓄、債務或管理習慣還在重建。這是「心已準備好，結構還在補」的階段，持續調整，穩定感會慢慢回來。",
    advantage: "心理動能與支持系統穩定，具備實際重建的條件。願意面對問題並開始修復，復原力高。",
    risk: "若修復行動停滯，可能長期停留在準備狀態，無法真正累積結構性穩定。過度樂觀而低估財務結構修補所需時間。",
    emoji: "🐻",
    image: "/熊.png",
    color: "text-yellow-600",
  },
  dog: {
    name: "準備出發的小狗",
    subtitle: "心理啟動型",
    description: "改變的動力已出現，對未來也開始產生期待。只是在儲蓄、預算或理財方法上還缺乏清楚的工具與步驟。內心充滿動能，只要有具體的小步驟引導，這股動機很容易轉化為實際行動。",
    advantage: "改變動機與信心已啟動。對新方法、新學習的接受度高。",
    risk: "若缺乏具體工具與支持，行動可能停留在想法與熱情階段。過快嘗試高風險決策，反而增加挫折感。",
    emoji: "🐕",
    image: "/小狗.png",
    color: "text-amber-600",
  },
  eagle: {
    name: "盤旋高空的老鷹",
    subtitle: "高能力、低安全網型",
    description: "看得遠、判斷清楚，具備良好的分析與規劃能力。然而安全網仍不夠厚實：儲備不足、保障不完整或可動用資源有限。靠能力飛行，一旦遇到突發變化，沒有足夠的緩衝高度應對。",
    advantage: "理解力高、規劃能力佳，學習與調整速度快。面對問題時能理性分析並主動尋找解方。",
    risk: "過度仰賴個人能力，忽略建立制度性保障與儲備。一次重大事件可能造成快速且劇烈的下滑。",
    emoji: "🦅",
    image: "/老鷹.png",
    color: "text-blue-600",
  },
  turtle: {
    name: "穩定前行的烏龜",
    subtitle: "日常穩定型",
    description: "各方面都維持在安全區間：收入、儲蓄、風險準備、金錢管理、支持網絡與心理狀態。沒有太多餘裕，但結構穩定，遇到一般變動仍能調整承受。靠的是持續與耐心，而非僥倖。",
    advantage: "基本結構完整，不易因小波動失衡。心理穩定，對生活具掌控感。",
    risk: "緩衝厚度有限，仍需逐步累積儲備與支持。若長期停留在最低穩定線，面對大型風險的彈性仍不足。",
    emoji: "🐢",
    image: "/烏龜.png",
    color: "text-green-600",
  },
  horse: {
    name: "穩健奔跑的馬",
    subtitle: "成熟韌性型",
    description: "不只站得住，還能持續前行。家庭穩定靠多個支柱共同承接：足夠的儲備、可動員的支持網絡、清楚的方向感與調整能力。突發事件的壓力能被分散消化，已具備成熟的韌性，有能力轉彎、重整並持續向前。",
    advantage: "抗風險能力高，不易因單一事件失衡。結構穩定、調節彈性佳，具備長期規劃能力。",
    risk: "長期穩定可能降低對新風險的警覺。需留意環境快速變化，持續更新保障與資源配置。",
    emoji: "🐎",
    image: "/馬.png",
    color: "text-emerald-600",
  },
}

// 分數區間配置
function getScoreConfig(score: number) {
  if (score >= 75) {
    return {
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
      borderColor: "border-emerald-200 dark:border-emerald-900",
      label: "財務韌性良好",
      feedback: "家庭面對金錢壓力與突發狀況時，具備一定的穩定度與調整空間，遇到變動通常仍有時間因應。可逐步為長期目標或潛在風險多做一些準備。",
    }
  } else if (score >= 60) {
    return {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-200 dark:border-yellow-900",
      label: "接近韌性",
      feedback: "已具備部分財務基礎，但某些情境下仍容易吃力。現在正是關鍵時刻：針對幾個弱項做調整，就能降低未來的風險。建議從分數較低的面向開始，一次專注一件事。",
    }
  } else if (score >= 40) {
    return {
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-900",
      label: "財務較脆弱",
      feedback: "面對突發事件或收入變動時，壓力較大、選擇有限。這不代表你做得不好，而是現實壓力確實很重。若有人陪你整理財務狀況，風險是可以被降低的。",
    }
  } else {
    return {
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-900",
      label: "高度脆弱",
      feedback: "家庭財務與心理壓力偏高，很多事情只能先撐著。這樣的狀態不適合獨自面對，建議儘早尋求可信任的支持資源，一起找出下一步。",
    }
  }
}

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const scoreConfig = getScoreConfig(result.totalScore)
  const [averageScores, setAverageScores] = useState<DimensionScores | null>(null)
  const [statistics, setStatistics] = useState({ totalCount: 0 })

  useEffect(() => {
    // 獲取平均分數和統計資訊
    const avg = calculateAverageScores()
    const stats = getStatistics()
    setAverageScores(avg)
    setStatistics(stats)
  }, [])

  // 根據 0-30 分制判斷燈號
  const getIndicatorLight = (score30: number): string => {
    if (score30 >= 0 && score30 <= 7) return "🔴"
    if (score30 >= 8 && score30 <= 15) return "🟠"
    if (score30 >= 16 && score30 <= 23) return "🟡"
    if (score30 >= 24 && score30 <= 30) return "🟢"
    return ""
  }

  // 準備雷達圖資料（使用 0-30 分制）
  // userValue 和 averageValue 直接使用 0-30 分制
  const radarData = [
    {
      dimension: "收入穩定度",
      userValue: result.dimensionScores.收入穩定度,
      averageValue: averageScores ? averageScores.收入穩定度 : 0,
      userScore: Math.round(result.dimensionScores.收入穩定度),
      averageScore: averageScores ? Math.round(averageScores.收入穩定度) : 0,
      userLight: getIndicatorLight(result.dimensionScores.收入穩定度),
      averageLight: averageScores ? getIndicatorLight(averageScores.收入穩定度) : "",
    },
    {
      dimension: "儲備應變力",
      userValue: result.dimensionScores.儲備應變力,
      averageValue: averageScores ? averageScores.儲備應變力 : 0,
      userScore: Math.round(result.dimensionScores.儲備應變力),
      averageScore: averageScores ? Math.round(averageScores.儲備應變力) : 0,
      userLight: getIndicatorLight(result.dimensionScores.儲備應變力),
      averageLight: averageScores ? getIndicatorLight(averageScores.儲備應變力) : "",
    },
    {
      dimension: "債務與保障",
      userValue: result.dimensionScores.債務與保障,
      averageValue: averageScores ? averageScores.債務與保障 : 0,
      userScore: Math.round(result.dimensionScores.債務與保障),
      averageScore: averageScores ? Math.round(averageScores.債務與保障) : 0,
      userLight: getIndicatorLight(result.dimensionScores.債務與保障),
      averageLight: averageScores ? getIndicatorLight(averageScores.債務與保障) : "",
    },
    {
      dimension: "金錢管理",
      userValue: result.dimensionScores.金錢管理,
      averageValue: averageScores ? averageScores.金錢管理 : 0,
      userScore: Math.round(result.dimensionScores.金錢管理),
      averageScore: averageScores ? Math.round(averageScores.金錢管理) : 0,
      userLight: getIndicatorLight(result.dimensionScores.金錢管理),
      averageLight: averageScores ? getIndicatorLight(averageScores.金錢管理) : "",
    },
    {
      dimension: "資源連結",
      userValue: result.dimensionScores.資源連結,
      averageValue: averageScores ? averageScores.資源連結 : 0,
      userScore: Math.round(result.dimensionScores.資源連結),
      averageScore: averageScores ? Math.round(averageScores.資源連結) : 0,
      userLight: getIndicatorLight(result.dimensionScores.資源連結),
      averageLight: averageScores ? getIndicatorLight(averageScores.資源連結) : "",
    },
    {
      dimension: "心理與規劃",
      userValue: result.dimensionScores.心理與規劃,
      averageValue: averageScores ? averageScores.心理與規劃 : 0,
      userScore: Math.round(result.dimensionScores.心理與規劃),
      averageScore: averageScores ? Math.round(averageScores.心理與規劃) : 0,
      userLight: getIndicatorLight(result.dimensionScores.心理與規劃),
      averageLight: averageScores ? getIndicatorLight(averageScores.心理與規劃) : "",
    },
  ]

  const chartConfig = {
    userValue: {
      label: "您的燈號",
    },
    averageValue: {
      label: "平均燈號",
    },
  }

  const isCamelDemo = result.animalType === "camel"

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. 財務韌性（自我評估）分數 */}
      <Card className={`p-6 md:p-8 border-2 ${scoreConfig.borderColor} ${scoreConfig.bgColor}`}>
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-background/60 border border-border/50 text-sm text-muted-foreground">
            <span>✅ 已完成 50%</span>
            <span className="text-border">·</span>
            <span>財務韌性自我評估</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">你的財務韌性（自我評估）</h2>
          <div className={`text-6xl md:text-7xl font-bold mb-2 ${scoreConfig.color}`}>
            {result.totalScore}
          </div>
          <p className={`text-lg font-medium ${scoreConfig.color}`}>{scoreConfig.label}</p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background/80 border border-orange-200 dark:border-orange-900">
            <span className="text-base">⏳</span>
            <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
              現實財務韌性評估尚未完成
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            完整評估後，才能知道你的財務是否真的穩定
          </p>
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-border/50 shadow-sm">
              <p className="text-base md:text-lg leading-relaxed text-foreground whitespace-pre-line text-center">
                {scoreConfig.feedback}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. 六構面雷達圖（含常態比較） */}
      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-center">六構面雷達圖</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <RadarChart data={radarData} outerRadius="60%">
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={(props) => {
                const { payload, x, y, cx, cy } = props
                
                // 確保所有標籤都顯示，即使座標異常
                if (!x && x !== 0 && !y && y !== 0) {
                  return null
                }
                
                // 先嘗試從 radarData 中查找
                let data = radarData.find((d) => d.dimension === payload.value)
                
                // 如果找不到，直接從 result.dimensionScores 中獲取（備用方案）
                if (!data && payload.value) {
                  const dimensionMap: Record<string, keyof DimensionScores> = {
                    "收入穩定度": "收入穩定度",
                    "儲備應變力": "儲備應變力",
                    "債務與保障": "債務與保障",
                    "金錢管理": "金錢管理",
                    "資源連結": "資源連結",
                    "心理與規劃": "心理與規劃",
                  }
                  const dimensionKey = dimensionMap[payload.value]
                  if (dimensionKey) {
                    const userScore30 = result.dimensionScores[dimensionKey]
                    const userScore = Math.round(userScore30)
                    const avgScore = averageScores ? Math.round(averageScores[dimensionKey]) : 0
                    data = {
                      dimension: payload.value,
                      userValue: convertTo100Scale(userScore30),
                      averageValue: averageScores ? convertTo100Scale(averageScores[dimensionKey]) : 0,
                      userScore,
                      averageScore: avgScore,
                      userLight: getIndicatorLight(userScore30),
                    }
                  }
                }
                
                // 獲取圖表中心點
                const centerX = cx ?? 0
                const centerY = cy ?? 0
                
                // 計算從中心到當前 tick 位置的向量
                const dx = x - centerX
                const dy = y - centerY
                const distance = Math.sqrt(dx * dx + dy * dy)
                
                // 計算單位向量（從中心指向軸線末端的方向）
                let unitX = 0
                let unitY = 0
                let angle = 0
                
                if (distance > 0.1) {
                  // 正常情況：使用實際的方向向量
                  unitX = dx / distance
                  unitY = dy / distance
                  angle = Math.atan2(dy, dx)
                } else {
                  // 異常情況：根據維度索引計算角度（確保標籤不消失）
                  const dataIndex = radarData.findIndex((d) => d.dimension === payload.value)
                  if (dataIndex >= 0) {
                    // 六個維度，每個間隔 60 度，從頂部（-90度）開始
                    angle = (dataIndex * 2 * Math.PI) / radarData.length - Math.PI / 2
                    unitX = Math.cos(angle)
                    unitY = Math.sin(angle)
                  } else {
                    // 最後的備用方案
                    unitX = 1
                    unitY = 0
                    angle = 0
                  }
                }
                
                // 根據角度調整偏移量，確保頂部和底部的標籤有足夠空間
                // 頂部（-90度附近）和底部（90度附近）需要更大的垂直偏移
                // 左右兩側需要更大的水平偏移
                const baseOffset = 50
                let offsetX = unitX * baseOffset
                let offsetY = unitY * baseOffset
                
                // 對於接近垂直方向的標籤（頂部和底部），增加垂直偏移
                const verticalThreshold = Math.abs(Math.cos(angle))
                if (verticalThreshold < 0.5) {
                  // 接近垂直方向（頂部或底部）
                  if (unitY < 0) {
                    // 頂部：向上偏移更多
                    offsetY -= 25
                  } else {
                    // 底部：向下偏移更多
                    offsetY += 25
                  }
                } else {
                  // 接近水平方向（左右兩側），增加水平偏移
                  if (unitX > 0) {
                    // 右側：向右偏移更多
                    offsetX += 15
                  } else {
                    // 左側：向左偏移更多
                    offsetX -= 15
                  }
                }
                
                // 針對特定維度進行特殊位置調整，確保完整顯示
                let verticalSpacing = 18 // 預設行距
                if (payload.value === "收入穩定度") {
                  // 收入穩定度：往下移更多，確保標題和分數都顯示
                  offsetY += 60
                  verticalSpacing = 20 // 增加行距
                } else if (payload.value === "金錢管理") {
                  // 金錢管理：往上移更多，確保標題和分數都顯示
                  offsetY -= 60
                  verticalSpacing = 20 // 增加行距
                }
                
                const labelX = x + offsetX
                const labelY = y + offsetY
                
                return (
                  <g>
                    <text
                      x={labelX}
                      y={labelY}
                      fill="currentColor"
                      fontSize={12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-foreground"
                    >
                      {payload.value}
                    </text>
                    {data ? (
                      <>
                        <text
                          x={labelX}
                          y={labelY + verticalSpacing}
                          fill="#f97316"
                          fontSize={16}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {data.userLight}
                        </text>
                      </>
                    ) : null}
                  </g>
                )
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 30]}
              ticks={[0, 10, 20, 30]}
              tick={false}
              axisLine={false}
            />
            {/* 使用者的雷達圖 */}
            <Radar
              name="您的燈號"
              dataKey="userValue"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.3}
              strokeWidth={2.5}
              dot={{ r: 5, fill: "#f97316", strokeWidth: 2, stroke: "#fff" }}
              isAnimationActive={true}
            />
            {/* 平均值的雷達圖 */}
            {averageScores && (
              <Radar
                name="平均燈號"
                dataKey="averageValue"
                stroke="#6b7280"
                fill="#6b7280"
                fillOpacity={0.2}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: "#6b7280", strokeWidth: 1, stroke: "#fff" }}
                isAnimationActive={true}
              />
            )}
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload
                return (
                  <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{data.dimension}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f97316" }}></div>
                        <span>您的燈號: {data.userLight}</span>
                      </div>
                      {averageScores && payload[1] && data.averageLight && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#6b7280" }}></div>
                          <span>平均燈號: {data.averageLight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }}
            />
          </RadarChart>
        </ChartContainer>
        {/* 圖例說明 */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f97316" }}></div>
            <span className="text-muted-foreground">您的燈號</span>
          </div>
          {averageScores && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-dashed" style={{ backgroundColor: "#6b7280", borderColor: "#6b7280" }}></div>
              <span className="text-muted-foreground">平均燈號（{statistics.totalCount} 位使用者）</span>
            </div>
          )}
        </div>
        {!averageScores && (
          <p className="mt-4 text-sm text-muted-foreground text-center">
            目前尚無足夠數據顯示平均分數，完成測驗後將開始累積統計數據
          </p>
        )}
      </Card>

      {/* 4. 狀態理解動物 */}
      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <h3 className="text-xl font-semibold mb-6">在財務狀態上，你可能像</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* 動物圖示 - 佔一半 */}
          <div className="w-full md:w-1/2 flex items-center justify-center rounded-lg bg-muted/50 p-4 min-h-[200px] md:min-h-[250px] relative">
            {animalTypeConfig[result.animalType].image ? (
              <>
                <img
                  src={animalTypeConfig[result.animalType].image!}
                  alt={animalTypeConfig[result.animalType].name}
                  className="w-full h-full max-w-[200px] max-h-[200px] object-contain"
                  onError={(e) => {
                    // 如果圖片載入失敗，隱藏圖片並顯示 emoji
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const emojiSpan = target.nextElementSibling as HTMLElement
                    if (emojiSpan) {
                      emojiSpan.style.display = "block"
                    }
                  }}
                />
                <span className="text-6xl md:text-7xl hidden">
                  {animalTypeConfig[result.animalType].emoji}
                </span>
              </>
            ) : (
              <span className="text-6xl md:text-7xl">
                {animalTypeConfig[result.animalType].emoji}
              </span>
            )}
          </div>
          {/* 文字內容 - 佔一半 */}
          <div className="w-full md:w-1/2 space-y-3">
            <div>
              <p className={`text-xl font-bold ${animalTypeConfig[result.animalType].color}`}>
                {animalTypeConfig[result.animalType].name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {animalTypeConfig[result.animalType].subtitle}
              </p>
            </div>
            <p className="text-base leading-relaxed text-foreground">
              {animalTypeConfig[result.animalType].description}
            </p>
          </div>
        </div>
        {/* 優勢與風險 - 放在圖片和敘述之下 */}
        <div className="mt-6 space-y-3">
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              優勢
            </p>
            <p className="text-base text-foreground">
              {animalTypeConfig[result.animalType].advantage}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500">
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">
              風險
            </p>
            <p className="text-base text-foreground">
              {animalTypeConfig[result.animalType].risk}
            </p>
          </div>
        </div>
      </Card>

      {/* 5. 結構判讀形容詞 */}
      <Card className={`p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2 ${structureTypeConfig[result.structureType].bgColor}`}>
        <h3 className="text-xl font-semibold mb-6">在財務結構上，你可能處於</h3>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* 插圖 - 佔一半 */}
          <div className="w-full md:w-1/2 flex items-center justify-center rounded-lg bg-muted/50 p-4 min-h-[200px] md:min-h-[250px]">
            {structureTypeConfig[result.structureType].image ? (
              <img
                src={structureTypeConfig[result.structureType].image!}
                alt={structureTypeConfig[result.structureType].name}
                className="w-full h-full max-w-[200px] max-h-[200px] object-contain"
              />
            ) : null}
          </div>
          {/* 文字內容 - 佔一半 */}
          <div className="w-full md:w-1/2 space-y-3">
            <div>
              <p className={`text-xl font-bold ${structureTypeConfig[result.structureType].iconColor}`}>
                {structureTypeConfig[result.structureType].name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {structureTypeConfig[result.structureType].subtitle}
              </p>
            </div>
            <p className="text-base leading-relaxed text-foreground whitespace-pre-line">
              {structureTypeConfig[result.structureType].description}
            </p>
            <div className="mt-4 p-4 rounded-lg bg-muted/30 border-l-4 border-primary">
              <p className="text-base font-medium text-foreground italic">
                {structureTypeConfig[result.structureType].summary}
              </p>
            </div>
          </div>
        </div>
        {/* 優勢與風險 - 放在圖片和敘述之下 */}
        {structureTypeConfig[result.structureType].advantage && (
          <div className="mt-6 space-y-3">
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                優勢
              </p>
              <p className="text-base text-foreground">
                {structureTypeConfig[result.structureType].advantage}
              </p>
            </div>
            {structureTypeConfig[result.structureType].risk && (
              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500">
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">
                  風險
                </p>
                <p className="text-base text-foreground">
                  {structureTypeConfig[result.structureType].risk}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 6. 目前可優先討論的方向（可複選） */}
      {result.priorities.length > 0 && (
        <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
          <h3 className="text-xl font-semibold mb-2">目前可優先討論的方向</h3>
          <p className="text-base text-muted-foreground mb-6">
            依據你的填答，以下方向值得優先整理：
          </p>
          <div className="space-y-3">
            {result.priorities.map((priority, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-accent/30 border border-border/50"
              >
                <span className="text-base font-medium">{priority}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 7. 你的評估還差一半 */}
      <Card className="p-6 md:p-8 border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="space-y-6">
          {/* 標題與進度 */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-semibold">你的評估還差一半</h3>
              {isCamelDemo && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">目前顯示：駱駝範例</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              你的感覺很重要，但完整的財務韌性，需要同時看見「實際狀況」
            </p>
          </div>

          {/* 50% 進度條 */}
          <div className="space-y-2 rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">✅</span>
              <div>
                <p className="font-medium text-sm">已完成：50% 財務韌性檢測（你的感受）</p>
                <p className="text-xs text-muted-foreground mt-0.5">自我評估・{result.totalScore} 分・{scoreConfig.label}</p>
              </div>
            </div>
            <div className="h-px bg-border/50 mx-1" />
            <div className="flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">⏳</span>
              <div>
                <p className="font-medium text-sm text-muted-foreground">還少：現實財務韌性評估（你的實際狀況）</p>
                <p className="text-xs text-muted-foreground mt-0.5">收入結構・緊急預備金・固定支出比例・債務風險</p>
              </div>
            </div>
          </div>

          {/* 情境問題 */}
          <div className="space-y-2">
            <p className="text-sm font-medium">先想一想：</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 border border-border/30 px-4 py-3">
                <span className="text-muted-foreground shrink-0 mt-0.5">→</span>
                <p className="text-sm">如果收入中斷 3 個月，你目前的狀況撐得住嗎？</p>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 border border-border/30 px-4 py-3">
                <span className="text-muted-foreground shrink-0 mt-0.5">→</span>
                <p className="text-sm">當臨時支出出現時，你會需要動用存款還是借貸？</p>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-muted/50 border border-border/30 px-4 py-3">
                <span className="text-muted-foreground shrink-0 mt-0.5">→</span>
                <p className="text-sm">有些人覺得自己穩定，但實際壓力已經在累積</p>
              </div>
            </div>
          </div>

          {/* CTA 按鈕 */}
          <div className="space-y-3">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/personal-center?tab=resilience">
                查看完整財務韌性
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              為了幫你保存評估結果與後續追蹤，點擊後請簡單登入（支援 Google 一鍵登入）
            </p>
          </div>
        </div>
      </Card>

      {/* 8. 個人中心工具介紹 */}
      <Card className="p-6 md:p-8 border-2 border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="space-y-5">
          <div>
            <h3 className="text-xl font-semibold">個人中心</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              把做過的評估、想用的工具都收在同一個地方，隨時回來看、隨時往前一步。
            </p>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            <div className="rounded-lg border bg-background/70 p-4">
              <p className="text-sm font-semibold">📒 財務生活記帳助理</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                錢花到哪裡去？一張圖就懂。AI 幫你看出消費習慣，不用自己硬算。
              </p>
            </div>
            <div className="rounded-lg border bg-background/70 p-4">
              <p className="text-sm font-semibold">🛡️ 詐騙防禦能力</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                急、熟、合理的情境最容易中招。先測出自己的防詐弱點，才能真的防住。
              </p>
            </div>
            <div className="rounded-lg border bg-background/70 p-4">
              <p className="text-sm font-semibold">😮‍💨 財務焦慮</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                帳單來了心跳加速？先搞懂自己的壓力反應模式，焦慮才有辦法調整。
              </p>
            </div>
            <div className="rounded-lg border bg-background/70 p-4">
              <p className="text-sm font-semibold">🌟 夢想達成財務管理</p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                買房、旅遊、換工作——大願望不只停在「好想喔」，拆成這個月做得到的小步驟。
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/personal-center">
                進入個人中心
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              不用一次做完，今天先看總覽也好，之後再回來用其他工具。
            </p>
          </div>
        </div>
      </Card>

      {/* 重新評估按鈕 */}
      <div className="text-center">
        <Button variant="ghost" onClick={onReset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          重新評估
        </Button>
      </div>
    </div>
  )
}
