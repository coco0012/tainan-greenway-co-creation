export interface Effect {
  residential: number;
  commercial: number;
  mobility: number;
  ecological: number;
  cultural: number;
}

export interface Choice {
  id: string;
  text: string;
  effects: Effect;
  spatialAction: string;
}

export interface Round {
  id: number;
  title: string;
  question: string;
  choices: Choice[];
}

export const missionData = {
  id: 'm01',
  title: '任務 01｜台南綠園道是否應包含連續高架自行車道？',
  introduction: '為提升自行車騎行時速與交通安全，最初的空間設計提案建議沿著鐵路地下化後的台南綠園道興建一條連續的高架自行車道。然而，這項空間變更提案引發了通勤時效、居民隱私安寧、在地街區商業、生態棲地保護與日常步行舒適度之間的諸多價值衝突。',
  conflicts: [
    '通勤時效 與 居住隱私',
    '商業活力 與 快速通過',
    '生態綠意 與 水泥硬質基礎設施'
  ],
  rounds: [
    {
      id: 1,
      title: '通勤時效 與 居住隱私',
      question: '高架自行車道是否應直接穿過住宅密集的區段？',
      choices: [
        {
          id: '1a',
          text: '保持高架自行車道連續穿過住宅區，確保騎士快速通過。',
          effects: { residential: -15, commercial: 0, mobility: 15, ecological: 0, cultural: -10 },
          spatialAction: '住宅區保持高架自行車道'
        },
        {
          id: '1b',
          text: '在住宅區將自行車道降低至地面層，拉開與民房的距離。',
          effects: { residential: 15, commercial: 0, mobility: -10, ecological: 0, cultural: 10 },
          spatialAction: '住宅區自行車道降至地面層'
        },
        {
          id: '1c',
          text: '保留部分高架自行車道，但增設厚實的綠化遮簾與防隱私隔板。',
          effects: { residential: 10, commercial: 0, mobility: 10, ecological: -5, cultural: 0 },
          spatialAction: '住宅區增設綠化隱私遮簾'
        }
      ]
    },
    {
      id: 2,
      title: '商業活力 與 快速通過',
      question: '自行車路線應如何穿越店面林立的商業街區？',
      choices: [
        {
          id: '2a',
          text: '讓自行車保持在高架橋上通過，避免騎士與地面人車流發生衝突。',
          effects: { residential: 0, commercial: -15, mobility: 15, ecological: 0, cultural: 0 },
          spatialAction: '商業區維持高架快速通過'
        },
        {
          id: '2b',
          text: '引導自行車降至地面層穿過商業區，以活絡地面層沿線店家。',
          effects: { residential: 0, commercial: 15, mobility: -5, ecological: 0, cultural: 10 },
          spatialAction: '商業區導引自行車降至地面'
        },
        {
          id: '2c',
          text: '打造慢速人車共享街區，配合增設自行車停靠點與大面積遮蔭廣場。',
          effects: { residential: 10, commercial: 15, mobility: 0, ecological: 0, cultural: 10 },
          spatialAction: '商業區打造慢速共享街區與停靠站'
        }
      ]
    },
    {
      id: 3,
      title: '生態綠意 與 水泥硬質基礎設施',
      question: '綠園道應採取何種鋪面設計，以減緩熱島效應並提升散步舒適度？',
      choices: [
        {
          id: '3a',
          text: '使用高強度硬質鋪面以利大型節慶活動舉辦與自行車通行。',
          effects: { residential: 0, commercial: 10, mobility: 0, ecological: -15, cultural: 0 },
          spatialAction: '全線鋪設高強度硬鋪面廣場'
        },
        {
          id: '3b',
          text: '打造連續綠色林蔭冠層、雨水花園與大面積透水鋪面。',
          effects: { residential: 10, commercial: 0, mobility: -5, ecological: 20, cultural: 0 },
          spatialAction: '打造連續綠色林蔭與雨水花園'
        },
        {
          id: '3c',
          text: '採用混合型策略：在節點設置活動硬鋪面，其餘區段保留大片生態綠帶。',
          effects: { residential: 0, commercial: 10, mobility: 5, ecological: 15, cultural: 0 },
          spatialAction: '採用節點硬鋪面與生態綠帶混合策略'
        }
      ]
    }
  ]
};
