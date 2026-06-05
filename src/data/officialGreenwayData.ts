export interface ProjectOverview {
  title: string;
  sourceName: string;
  sourceUrl: string;
  summary: string;
  keywords: string[];
}

export interface OfficialContextCard {
  title: string;
  description: string;
  sourceLabel: string;
  gameEffect: string;
}

export interface OfficialSpatialSegment {
  id: number;
  name: string;
  description: string;
  officialRelevance: string;
  possibleConflicts: string;
  relatedStakeholders: string[];
  gameParameters: {
    residentialMultiplier: number;
    commercialMultiplier: number;
    mobilityMultiplier: number;
    ecologicalMultiplier: number;
  };
}

export interface PlanningIssue {
  title: string;
  description: string;
  keyStruggle: string;
}

export interface SourceNotes {
  visibleNote: string;
  sourcesList: { name: string; url: string }[];
  technicalNotice: string;
}

export const projectOverview: ProjectOverview = {
  title: "台南綠園道共創計畫 / Tainan Greenway Co-Creation",
  sourceName: "台南綠園道官方推動小組 & 臺南市政府工務局",
  sourceUrl: "https://tainanparkway.org/",
  summary: "隨著台南鐵路地下化計畫的開展，原本阻隔都市發展的鐵軌地表空間將被釋放。本工程開闢長達 1.4 公里的線性開放綠園道，期盼藉由市民共創平台的意見收集與審議，引導綠廊朝向生態降溫、多元慢行、商業活力與鄰里安寧的平衡發展，促成台南百年歷史城區的都市綠色縫合。",
  keywords: ["鐵路地下化", "都市縫合", "線性綠園道", "參與式規劃", "生態降溫", "慢行交通"]
};

export const officialContextCards: OfficialContextCard[] = [
  {
    title: "鐵路地下化後的都市縫合",
    description: "消除百年來阻隔台南東西兩側發展的縱貫鐵軌障礙，將地面空間轉化為連續線性的市民公共開放走廊，縫合破碎的鄰里街道網絡。",
    sourceLabel: "臺南市政府工務局「園道開闢工程」公開資料",
    gameEffect: "影響「居住舒適」與「歷史記憶」基礎指標，提升縫合程度可活化周邊低效土地。"
  },
  {
    title: "線性綠園道與公共生活",
    description: "綠園道不只是一條通路，而是市民運動、慢跑、街區市集、兒童遊戲以及長者乘涼的線性客廳，串聯起日常生活的公共性。",
    sourceLabel: "台南綠園道官方網頁 (tainanparkway.org)",
    gameEffect: "決定「商業活力」與「居住舒適」之滿意度乘數，多元鋪面設計可提升公共生活參與率。"
  },
  {
    title: "公民參與與共創平台",
    description: "引導市民由下而上參與綠園道設計，透過「數位雙生」與線上審議機制，讓利害關係人在規劃階段進行溝通、表達立場並凝聚共識。",
    sourceLabel: "台南綠園道官方推動小組倡議文件",
    gameEffect: "解鎖協商會議籌碼，收集觀點卡越多，圓桌會議所獲得的共識指標起步得分越高。"
  },
  {
    title: "交通、慢行與開放空間整合",
    description: "整合台南火車站樞紐的轉乘需求，建立自行車慢速路網、YouBike 節點與人行優先步道系統，限制高污染運具，實現低碳運輸。",
    sourceLabel: "園道開闢工程規劃報告",
    gameEffect: "直接影響「交通效率」指標，人車分流與號誌優化能顯著減輕路口安全衝突。"
  },
  {
    title: "生態綠廊與降溫城市",
    description: "台南夏季高溫炎熱，綠園道定位為城市風道與保水基地，透過複層栽植、透水鋪面與雨水花園，能有效緩解熱島效應，為市中心降溫減碳。",
    sourceLabel: "台南綠園道官方網站生態保育專欄",
    gameEffect: "直接影響「生態棲地」指標，綠覆率與透水鋪面可降低地表輻射溫度 2~3°C。"
  }
];

export const officialSpatialSegments: OfficialSpatialSegment[] = [
  {
    id: 0,
    name: "住宅段",
    description: "周邊主要為住宅鄰里與老舊透天社區，沿線居民日常起居直接面向綠廊。",
    officialRelevance: "此段著重於綠園道與沿線民房立面的過渡，防範視覺干擾與生活噪音。",
    possibleConflicts: "高架自行車道高度可能直接正對居民二樓陽台，產生隱私侵犯，且夜間活動易產生安寧干擾。",
    relatedStakeholders: ["周邊居民", "高齡漫步者", "市府 / 設計師"],
    gameParameters: {
      residentialMultiplier: 1.5,
      commercialMultiplier: 0.5,
      mobilityMultiplier: 0.8,
      ecologicalMultiplier: 1.0
    }
  },
  {
    id: 1,
    name: "商業段",
    description: "店鋪、小吃店林立，與在地傳統生活街區（如青年路商圈）高度重合。",
    officialRelevance: "透過友善的地面層空間設計引導自行車與步行人流，活絡沿線商業店鋪能見度。",
    possibleConflicts: "若自行車道完全高架化，騎士快速過境不作停留，地面層商圈將失去縫合人潮的效益。",
    relatedStakeholders: ["在地店家", "通勤 / 騎士", "市府 / 設計師"],
    gameParameters: {
      residentialMultiplier: 0.6,
      commercialMultiplier: 1.8,
      mobilityMultiplier: 1.0,
      ecologicalMultiplier: 0.6
    }
  },
  {
    id: 2,
    name: "車站節點",
    description: "台南火車站舊軌道周邊，是步行、轉乘及歷史地景的交會核心。",
    officialRelevance: "整合大眾運輸轉乘樞紐、YouBike 停靠站與歷史軌道月台保存。",
    possibleConflicts: "快慢速通勤車流與行人漫步動線在樞紐交織，容易產生安全碰撞衝突。",
    relatedStakeholders: ["通勤 / 騎士", "高齡漫步者", "市府 / 設計師"],
    gameParameters: {
      residentialMultiplier: 0.8,
      commercialMultiplier: 1.2,
      mobilityMultiplier: 1.6,
      ecologicalMultiplier: 0.8
    }
  },
  {
    id: 3,
    name: "主要路口",
    description: "多條主要都市幹道（如青年路、東門路路口）橫向切斷綠園道的連續性。",
    officialRelevance: "進行橫向幹道的安全跨越設計，確保綠廊動線的連續性與人車分流安全。",
    possibleConflicts: "平面直接穿越有重大車流危險，但若設置立體高架自行車陸橋，易阻擋都市天際線並造成結構壓迫。",
    relatedStakeholders: ["通勤 / 騎士", "市府 / 設計師", "周邊居民"],
    gameParameters: {
      residentialMultiplier: 1.0,
      commercialMultiplier: 0.8,
      mobilityMultiplier: 1.8,
      ecologicalMultiplier: 0.5
    }
  },
  {
    id: 4,
    name: "生態綠帶段",
    description: "規劃為複層大樹密林與雨水花園，是市區的綠肺風脊與降溫核心。",
    officialRelevance: "發揮氣候適應力，建設海綿城市，多採自然鋪面、減少不透水硬質水泥鋪面。",
    possibleConflicts: "高密度大樹綠化會壓縮活動廣場的空間，且落葉維護與雨後濕滑可能對通勤速度造成限制。",
    relatedStakeholders: ["環保團體", "高齡漫步者", "通勤 / 騎士"],
    gameParameters: {
      residentialMultiplier: 1.2,
      commercialMultiplier: 0.5,
      mobilityMultiplier: 0.7,
      ecologicalMultiplier: 2.0
    }
  }
];

export const planningIssues: PlanningIssue[] = [
  {
    title: "遮蔭 vs 視野",
    description: "增加複層高大樹木可提供舒適綠蔭並降低路面地表輻射溫度，但可能會在特定路段遮擋沿線民房採光與天際線視野。",
    keyStruggle: "生態適應性與鄰里日照權的拉鋸。"
  },
  {
    title: "人流 vs 安寧",
    description: "引導人群與休閒活動（如假日市集）進入社區段以注入活力，但也可能帶來噪音與夜間安寧干擾。",
    keyStruggle: "街區商業活力與住宅社區安寧的衝突。"
  },
  {
    title: "效率 vs 安全",
    description: "通勤自行車需要連續、無阻斷且高騎行速度的專用道，這容易在交叉路口或車站樞紐與慢速漫步的行人產生擦撞衝突。",
    keyStruggle: "騎士通勤速度與行人（特別是高齡長者）步行安全的取捨。"
  },
  {
    title: "生態 vs 開發",
    description: "保留大面積透水土壤、雨水花園與自然棲地以涵養水源，但這會減少能鋪設水泥以供市集、廣場和停車用途的硬鋪面面積。",
    keyStruggle: "自然減碳降溫與多功能市民廣場建設的取捨。"
  },
  {
    title: "隱私 vs 高架移動",
    description: "為維護騎士免受路口紅綠燈干擾，將自行車道高架化，卻會直接看進沿線社區透天民房二樓，對居民隱私造成侵犯。",
    keyStruggle: "高架通勤便利性與社區生活私密性的對立。"
  },
  {
    title: "地面商業活力 vs 快速通過",
    description: "若自行車道全面高架飛越，會導致沿線店鋪失去商機；將車道降至地面層能帶動消費，但會減緩車速並增加路口交織衝突。",
    keyStruggle: "地面傳統店面商機縫合與快騎過境的價值矛盾。"
  }
];

export const sourceNotes: SourceNotes = {
  visibleNote: "依官方公開資訊整理之原型資料 / Source-informed prototype data",
  sourcesList: [
    { name: "台南綠園道官方推動網頁 (Tainan Parkway)", url: "https://tainanparkway.org/" },
    { name: "臺南市政府工務局公開工程資訊", url: "https://public.tainan.gov.tw/" }
  ],
  technicalNotice: "本系統為公民共創數位雙生 RPG 概念驗證原型，各路段環境參數、意見對白與指標變動邏輯，係參考上述公開專案之衝突本質進行量化整理，非即時關聯實體市政資料庫。"
};
