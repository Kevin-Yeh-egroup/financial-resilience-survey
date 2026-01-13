"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { QuestionnaireResult, DimensionScores } from "@/types/questionnaire"
import { RefreshCw } from "lucide-react"
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
    description: "表面上具備一定收入或可求助的資源，但因管理能力不足、信心低落或啟動困難，這些資源無法被有效轉換為實際的安全網。遇到壓力時仍以被動承受為主，結構卡在「有可能改善，但尚未啟動」的狀態。",
    summary: "東西都有，卻用不起來的。",
    advantage: "其實身邊或環境中已有可用的資源與機會。只要能把方法與信心建立起來，改善的起點並不遠。",
    risk: "因缺乏方向感或實際做法，資源長期無法轉為真正的幫助。若持續停留在「知道有路，但走不出去」的狀態，壓力會慢慢累積。",
    image: "/有資源卻卡住的.png",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  supported: {
    name: "人脈承接",
    subtitle: "有人接住，但結構未必穩",
    description: "即使在收入、儲蓄或債務上承受壓力，家庭仍擁有可商量、可求助、可陪伴的支持網絡，加上內在仍保有行動信心與方向感，形成重要的「承接層」。風險不一定低，但不會孤立無援。",
    summary: "條件辛苦，但你不是獨自承擔。",
    advantage: "身邊有人可以討論、商量或在關鍵時刻提供支持。內心仍保有面對問題與調整的力量。",
    risk: "若長期只靠他人撐住，而沒有同步補強收入、儲備與管理能力，容易形成依賴，一旦支持減弱，壓力會一下子集中回自己身上。",
    image: "/有人接住的.png",
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  stable: {
    name: "日常穩定",
    subtitle: "多數家庭的基準狀態",
    description: "生活可正常運作，帳單繳得出來，對未來有基本方向感，也具備基礎管理能力與支持來源。然而儲備不厚、承接層數有限，整體仍屬「低緩衝穩定」，一旦遇到連續壓力事件，容易從穩定迅速轉為吃力。",
    summary: "有幾個支撐點，整體比較安心。",
    advantage: "生活運作大致穩定，收支與日常安排在可掌握範圍內。對未來有基本方向感，也具備一定的調整能力。",
    risk: "儲備與安全邊際不厚實，遇到連續的變動或突發事件時，容易從「還可以」很快變成「開始吃力」。",
    image: "/有很多依靠的.png",
    iconColor: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  growing: {
    name: "成長建構",
    subtitle: "結構逐漸成長，邁向穩健",
    description: "家庭已不再只是「撐著過日子」，而是開始有意識地整理方向、累積能力與建立第二層承接。內在動機與信心穩定，知道自己要往哪裡走，也開始嘗試把收入、支出、儲備與資源連結起來。雖然緩衝仍未厚實，但結構已進入「可成長、可建構」的上升軌道。",
    summary: "不只是撐著，而是正在長出來。",
    advantage: "已開始有計畫地整理財務、思考未來方向。內在動機與學習意願穩定，支持與工具也逐步到位。",
    risk: "若缺乏持續行動與制度化習慣，成長可能停留在嘗試階段。中途鬆手，容易退回原本只是撐著或日常穩定的狀態。",
    image: "/結構正在長出來的.png",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  mature: {
    name: "成熟穩健",
    subtitle: "多元資源承接，財務結構穩健",
    description: "家庭的穩定不是靠單一收入或單一關係撐住，而是由多個支柱共同承接：有足夠的緩衝儲備、有人可商量與動員、也有清楚的方向感與調整能力。即使某一面向短暫波動，其他結構仍能分攤衝擊，屬於安全邊際厚、承接網絡成熟、整體韌性穩健的狀態。",
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
    description: "你目前同時承受著多個層面的壓力，無論是儲蓄、債務、支持系統或心理狀態，都處在相當吃緊的狀況。像一隻縮成一團休息的貓，你的身體與內心都在提醒：現在已經沒有多餘的空間再承擔新的變動。生活中任何突發狀況，都可能讓原本勉強維持的平衡被打破。這並不代表你不努力，而是代表你已經撐了很久，系統性的緩衝與支撐變得很薄。此刻最重要的不是再要求自己多做一點，而是讓壓力被看見、讓資源與支持能夠進來，先讓整個人重新感到安全。",
    advantage: "對自身困境高度有感，對風險的警覺性高。一旦獲得適當支持，通常願意配合調整與求助。",
    risk: "多重壓力疊加，財務與心理脆弱度高。若缺乏即時介入與資源連結，容易快速惡化為急難或創傷狀態。",
    emoji: "🐱",
    image: "/貓.png",
    color: "text-red-600",
  },
  ant: {
    name: "努力拖著家的小螞蟻",
    subtitle: "透支撐持型",
    description: "你像一隻不停搬運食物的小螞蟻，家庭仍能運作，責任仍在肩上，帳單繳得出來、工作也還撐著，但幾乎沒有緩衝空間。儲蓄接近用盡，一有突發支出就會感到心驚，內心長期處在緊繃與疲勞中，也很少有可以分擔或討論的對象。你靠的是責任感與意志力在支撐日常，而不是充足的安全網。這是一種「還在跑，但已經在透支」的狀態，外表看起來穩定，其實內在非常消耗。",
    advantage: "責任感強、執行力高，能在壓力下維持家庭基本運作。對工作與家庭承諾度高，不輕易放棄。",
    risk: "緩衝極低，任何失業、疾病或意外都可能瞬間失衡。長期心理耗損，若未補充支持，容易出現身心俱疲或決策失誤。",
    emoji: "🐜",
    image: "/螞蟻.png",
    color: "text-orange-600",
  },
  elephant: {
    name: "站在細繩上的大象",
    subtitle: "結構型脆弱",
    description: "你就像一頭站在細繩上的大象，體型龐大、能力不弱，收入結構看似穩定，但實際支撐點卻非常狹窄。儲蓄不厚、心理壓力沉重，或是幾乎沒有可以依靠的支持網絡。整體看起來還站得住，其實平衡非常吃力，只要一點點風吹草動，就可能晃得很厲害。這是一種「表面穩定、底層支撐薄弱」的狀態。",
    advantage: "具備維持基本生活的經濟結構。短期內仍有運作能力，不易立即崩潰。",
    risk: "安全邊際極小，抗風險能力不足。心理或社會支持缺口大時，容易在突發事件下快速滑落。",
    emoji: "🐘",
    image: "/大象.png",
    color: "text-blue-600",
  },
  ox: {
    name: "努力負重的牛",
    subtitle: "高負荷撐持型",
    description: "你像一頭默默前行、背著重擔的牛，家庭運作穩定、責任清楚，外表看起來很能撐。但實際上儲備不算充足，支援網絡有限，所有重量幾乎都壓在自己身上。你不太喊累，習慣告訴自己再忍一下就好，卻在不知不覺中承受著長期高負荷。這是一種「穩定但很重」的狀態，結構還在，但彈性正在慢慢被消耗。",
    advantage: "穩定度高、責任感強，能長期維持家庭運作。心理尚能撐住，具備調整與持續前行的能力。",
    risk: "長期負荷集中於個人，缺乏支持與緩衝。若未補強儲備與資源，突發事件可能造成結構性斷裂。",
    emoji: "🐂",
    image: "/牛.png",
    color: "text-orange-600",
  },
  camel: {
    name: "撐很久的駱駝",
    subtitle: "慢性全面吃力型",
    description: "你像一隻在沙漠中長途跋涉的駱駝，沒有立即的危機，但也沒有真正的綠洲。收入、儲蓄、保障、管理、心理與支持網絡都處在「還撐得住，但很吃力」的狀態。生活能運作，卻幾乎沒有餘裕，任何額外的負擔都需要精打細算。你已經習慣在有限資源下忍耐與調適，外表看起來穩定，其實長期處在慢性耗損中。這是一種沒有崩潰、但也沒有安全感的持續消耗狀態。",
    advantage: "耐力高、適應力強，能在資源有限下長期維持運作。面對壓力時不易立即崩解。",
    risk: "長期慢性壓力累積，易出現身心與財務的同步耗竭。若缺乏補給與轉換機制，容易在看似穩定中突然失速。",
    emoji: "🐪",
    image: "/駱駝.png",
    color: "text-yellow-600",
  },
  otter: {
    name: "被照顧著的水獺",
    subtitle: "依賴型安全網",
    description: "你像漂浮在水面、被同伴托著的水獺，身邊有親友、制度或補助資源支持，讓生活不至於沉沒。當遇到困難時，總有人或系統能接住你，使基本安全得以維持。然而，自身的收入穩定度、儲蓄能力或金錢管理仍在建立中，內在的安全感很大一部分來自外界的照顧與支撐。只要支持網絡存在，你就能安心浮著；但一旦資源減弱，自我結構尚不足以讓你獨自游得很遠。",
    advantage: "支持網絡豐富，不易完全陷入孤立或斷援狀態。對外部協助的接受度高，較不排斥求助。",
    risk: "若長期停留在被支撐狀態，自立能力與財務韌性成長緩慢。當支持系統變動時，容易出現安全感快速下滑。",
    emoji: "🦭",
    image: "/水獺.png",
    color: "text-blue-600",
  },
  monkey: {
    name: "在樹間移動的猴子",
    subtitle: "社會韌性型",
    description: "你像在樹與樹之間靈活移動的猴子，經濟結構與金錢能力尚未完全穩定，但你並不孤單，也不僵住。你知道可以向外連結資源、尋求協助，心理上保有彈性與希望。當環境改變時，你懂得換一條路、找新的支點，而不是原地硬撐。你的韌性不只來自存款或收入，而是來自人際網絡與面對變動時的調整能力。",
    advantage: "支持網絡與心理調節力強，遇到困難較不易孤立。對變動的適應力高，願意嘗試不同解方。",
    risk: "若長期未補強財務結構與管理能力，可能形成「靠關係撐」而非「靠結構穩」的狀態。當支持資源同時受限時，抗風險力仍不足。",
    emoji: "🐒",
    image: "/猴子.png",
    color: "text-purple-600",
  },
  squirrel: {
    name: "躲在葉子下的小松鼠",
    subtitle: "保護網型受傷狀態",
    description: "你像一隻躲在葉子下的小松鼠，平時已準備好保險、制度性資源或支持網絡，這些就像樹洞與樹葉，能為你遮風避雨。但最近可能遭遇突發支出、健康事件或情緒衝擊，讓內心或儲蓄暫時受傷。你不是毫無防護，而是正在恢復與修補中。只要給自己時間與適當協助，這層保護網會成為重新站穩的重要基礎。",
    advantage: "制度性保障與支持系統完整，不易完全失去安全網。願意使用資源與求助，具備修復條件。",
    risk: "若長期停留在防禦與療傷狀態，可能延後重建行動與結構調整。過度依賴保護網，忽略儲備與能力的再累積。",
    emoji: "🐿️",
    image: "/松鼠.png",
    color: "text-yellow-600",
  },
  bear: {
    name: "慢慢探出頭的小熊",
    subtitle: "恢復中狀態",
    description: "你像剛從洞穴中探出頭的小熊，曾經經歷過寒冷或困難的時期，現在內心已逐漸回暖，重新對生活產生信心。你身邊有可以支持你的人與資源，心理上也開始看見方向，只是部分財務結構仍在修復中，例如儲蓄尚未累積回來、債務還在整理、或金錢管理習慣仍在重建。這是一個「心已準備好，結構還在補」的階段，只要持續調整，穩定感會慢慢回來。",
    advantage: "心理動能與支持系統穩定，具備實際重建的條件。願意面對問題並開始修復，復原力高。",
    risk: "若修復行動停滯，可能長期停留在準備狀態，無法真正累積結構性穩定。過度樂觀而低估財務結構修補所需時間。",
    emoji: "🐻",
    image: "/熊.png",
    color: "text-yellow-600",
  },
  dog: {
    name: "準備出發的小狗",
    subtitle: "心理啟動型",
    description: "你已經意識到需要改變，也開始對未來產生期待，心裡出現「想試試看、想重新來過」的動力。只是目前在儲蓄、預算或理財方法上還沒有清楚的工具與步驟。像一隻準備衝出去玩的小狗，內心充滿動能，但還需要項圈與方向。只要有人陪你整理現況、給你可行的小步驟，這股動機很容易轉化為實際行動。",
    advantage: "改變動機與信心已啟動。對新方法、新學習的接受度高。",
    risk: "若缺乏具體工具與支持，行動可能停留在想法與熱情階段。過快嘗試高風險決策，反而增加挫折感。",
    emoji: "🐕",
    image: "/小狗.png",
    color: "text-amber-600",
  },
  eagle: {
    name: "盤旋高空的老鷹",
    subtitle: "高能力、低安全網型",
    description: "你像在高空盤旋的老鷹，看得遠、判斷清楚，具備良好的分析與規劃能力，也懂得如何管理金錢與風險。然而，地面上的安全網仍不夠厚實，儲備不足、保障不完整，或可動用的支持資源有限。你靠能力在飛行，一旦遇到強風或突發變化，沒有足夠的緩衝高度來調整。這是一種「能力很強，但安全邊際仍薄」的狀態。",
    advantage: "理解力高、規劃能力佳，學習與調整速度快。面對問題時能理性分析並主動尋找解方。",
    risk: "過度仰賴個人能力，忽略建立制度性保障與儲備。一次重大事件可能造成快速且劇烈的下滑。",
    emoji: "🦅",
    image: "/老鷹.png",
    color: "text-blue-600",
  },
  turtle: {
    name: "穩定前行的烏龜",
    subtitle: "日常穩定型",
    description: "你像一隻穩定前行的烏龜，生活節奏不急不躁，收入、儲蓄、風險準備、金錢管理、支持網絡與心理狀態都維持在安全區間。也許沒有太多餘裕，但基本結構穩定，遇到一般程度的變動仍能調整與承受。你靠的是持續與耐心，而不是僥倖或硬撐。這是一種「過得去、站得住、慢慢累積」的狀態。",
    advantage: "基本結構完整，不易因小波動失衡。心理穩定，對生活具掌控感。",
    risk: "緩衝厚度有限，仍需逐步累積儲備與支持。若長期停留在最低穩定線，面對大型風險的彈性仍不足。",
    emoji: "🐢",
    image: "/烏龜.png",
    color: "text-green-600",
  },
  horse: {
    name: "穩健奔跑的馬",
    subtitle: "成熟韌性型",
    description: "你像一匹穩健奔跑的馬，不只站得住，還能持續前行。家庭的穩定不是仰賴單一收入或單一關係，而是由多個支柱共同承接：有足夠的儲備應付變動，有可以動員的支持網絡，也有清楚的方向感與調整能力。即使遇到突發事件，壓力也不會集中在某一個點，而能被分散與消化。這代表你的家庭已具備成熟的韌性，不只是撐過去，而是有能力轉彎、重整並持續向前。",
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
      feedback: "從你的填答來看，目前家庭在面對金錢壓力與突發狀況時，具備一定的穩定度與調整空間。\n即使遇到變動，通常仍有時間思考與因應。\n建議你留意目前已做得不錯的地方，未來可逐步為長期目標或風險再多做一些準備。",
    }
  } else if (score >= 60) {
    return {
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-yellow-200 dark:border-yellow-900",
      label: "接近韌性",
      feedback: "你的家庭已具備部分財務基礎，但在某些情境下仍容易感到吃力。\n目前正處於一個「很關鍵的階段」，只要針對幾個弱項做調整，就能實際降低未來的風險。\n建議先從分數較低的面向開始，一次專注改善一件事。",
    }
  } else if (score >= 40) {
    return {
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-900",
      label: "財務較脆弱",
      feedback: "你的填答顯示，家庭在面對突發事件或收入變動時，承受的壓力較大，選擇也相對有限。\n這並不代表你做得不好，而是目前真的承擔了很多現實壓力。\n若能有人陪你一起整理財務狀況，風險是可以被降低的。",
    }
  } else {
    return {
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-900",
      label: "高度脆弱",
      feedback: "目前家庭的財務與心理壓力偏高，很多事情可能只能先撐著。\n這樣的狀態，並不適合一個人獨自面對。\n建議儘早尋求可信任的專業或支持資源，一起找出可行的下一步。",
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

  // 準備雷達圖資料（包含使用者和平均值）
  const radarData = [
    {
      dimension: "收入穩定度",
      userValue: result.dimensionScores.收入穩定度,
      averageValue: averageScores?.收入穩定度 ?? 0,
      userScore: Math.round(result.dimensionScores.收入穩定度),
      averageScore: averageScores ? Math.round(averageScores.收入穩定度) : 0,
    },
    {
      dimension: "儲備應變力",
      userValue: result.dimensionScores.儲備應變力,
      averageValue: averageScores?.儲備應變力 ?? 0,
      userScore: Math.round(result.dimensionScores.儲備應變力),
      averageScore: averageScores ? Math.round(averageScores.儲備應變力) : 0,
    },
    {
      dimension: "債務與保障",
      userValue: result.dimensionScores.債務與保障,
      averageValue: averageScores?.債務與保障 ?? 0,
      userScore: Math.round(result.dimensionScores.債務與保障),
      averageScore: averageScores ? Math.round(averageScores.債務與保障) : 0,
    },
    {
      dimension: "金錢管理",
      userValue: result.dimensionScores.金錢管理,
      averageValue: averageScores?.金錢管理 ?? 0,
      userScore: Math.round(result.dimensionScores.金錢管理),
      averageScore: averageScores ? Math.round(averageScores.金錢管理) : 0,
    },
    {
      dimension: "資源連結",
      userValue: result.dimensionScores.資源連結,
      averageValue: averageScores?.資源連結 ?? 0,
      userScore: Math.round(result.dimensionScores.資源連結),
      averageScore: averageScores ? Math.round(averageScores.資源連結) : 0,
    },
    {
      dimension: "心理與規劃",
      userValue: result.dimensionScores.心理與規劃,
      averageValue: averageScores?.心理與規劃 ?? 0,
      userScore: Math.round(result.dimensionScores.心理與規劃),
      averageScore: averageScores ? Math.round(averageScores.心理與規劃) : 0,
    },
  ]

  const chartConfig = {
    userValue: {
      label: "您的分數",
    },
    averageValue: {
      label: "平均分數",
    },
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. 整體財務韌性分數 */}
      <Card className={`p-6 md:p-8 border-2 ${scoreConfig.borderColor} ${scoreConfig.bgColor}`}>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">整體財務韌性分數</h2>
          <div className={`text-6xl md:text-7xl font-bold mb-2 ${scoreConfig.color}`}>
            {result.totalScore}
          </div>
          <p className={`text-lg font-medium mb-8 ${scoreConfig.color}`}>{scoreConfig.label}</p>
          <div className="max-w-2xl mx-auto mt-8">
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
          {averageScores && statistics.totalCount > 0 && (
            <p className="text-sm text-muted-foreground text-center">
              與 {statistics.totalCount} 位使用者的平均分數比較
            </p>
          )}
        </div>
        <ChartContainer config={chartConfig} className="h-[450px] w-full">
          <RadarChart data={radarData} outerRadius="60%">
            <PolarGrid />
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
                    const userScore = Math.round(result.dimensionScores[dimensionKey])
                    const avgScore = averageScores ? Math.round(averageScores[dimensionKey]) : 0
                    data = {
                      dimension: payload.value,
                      userValue: result.dimensionScores[dimensionKey],
                      averageValue: averageScores?.[dimensionKey] ?? 0,
                      userScore,
                      averageScore: avgScore,
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
                          fontSize={13}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {data.userScore}
                        </text>
                        {averageScores && (
                          <text
                            x={labelX}
                            y={labelY + verticalSpacing * 2}
                            fill="#6b7280"
                            fontSize={11}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            平均 {data.averageScore}
                          </text>
                        )}
                      </>
                    ) : null}
                  </g>
                )
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            {/* 使用者的雷達圖 */}
            <Radar
              name="您的分數"
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
                name="平均分數"
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
                return (
                  <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <p className="font-semibold mb-2">{payload[0].payload.dimension}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f97316" }}></div>
                        <span>您的分數: {payload[0].value?.toFixed(1)}</span>
                      </div>
                      {averageScores && payload[1] && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#6b7280" }}></div>
                          <span>平均分數: {payload[1].value?.toFixed(1)}</span>
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
            <span className="text-muted-foreground">您的分數</span>
          </div>
          {averageScores && (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-dashed" style={{ backgroundColor: "#6b7280", borderColor: "#6b7280" }}></div>
              <span className="text-muted-foreground">平均分數（{statistics.totalCount} 位使用者）</span>
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
            以下是依據你的填答，
            <br />
            目前較值得被討論與整理的方向：
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

      {/* 7. 下一步行動按鈕 */}
      <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm border-2">
        <h3 className="text-xl font-semibold mb-4">下一步行動</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <Button variant="outline" className="w-full bg-transparent relative" disabled>
            <span className="mr-2">個人財務諮詢</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              開發中
            </span>
          </Button>
          <Button variant="outline" className="w-full bg-transparent relative" disabled>
            <span className="mr-2">問問 AI</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              開發中
            </span>
          </Button>
          <Button variant="outline" className="w-full bg-transparent relative" disabled>
            <span className="mr-2">紀錄本次測試結果</span>
            <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              開發中
            </span>
          </Button>
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
