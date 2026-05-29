import React, { useState, useEffect, useRef } from 'react';
import { Choice, Round } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { Award, Activity, HelpCircle, ChevronRight, ChevronLeft, BookOpen, X, Sparkles } from 'lucide-react';

interface AdventureScreenProps {
  playerRole: StakeholderRole;
  rounds: Round[];
  scores: any;
  spatialActions: string[];
  onChoiceMade: (choice: Choice) => void;
  onComplete: () => void;
}

export const AdventureScreen: React.FC<AdventureScreenProps> = ({
  playerRole,
  rounds,
  scores,
  spatialActions,
  onChoiceMade,
  onComplete
}) => {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [showNotebook, setShowNotebook] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);

  const segments = [
    { id: 0, name: '住宅社區段', sta: 'STA 0+000 - 0+400', left: 12, npcs: ['resident', 'commuter'], roundIndex: 0 },
    { id: 1, name: '繁榮商業段', sta: 'STA 0+400 - 0+700', left: 32, npcs: ['shop_owner', 'commuter'], roundIndex: 1 },
    { id: 2, name: '台南車站樞紐', sta: 'STA 0+700', left: 52, npcs: ['government'], isInterlude: true },
    { id: 3, name: '幹道交叉路口', sta: 'STA 0+700 - 0+900', left: 70, npcs: ['commuter'], isInterlude: true },
    { id: 4, name: '綠意生態廊道', sta: 'STA 0+900 - 1+400', left: 88, npcs: ['environmentalist', 'elderly'], roundIndex: 2 }
  ];

  // Auto-scroll the map track to center the active segment
  useEffect(() => {
    if (mapRef.current) {
      const activeElement = mapRef.current.querySelector(`#segment-pin-${activeSegmentIndex}`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeSegmentIndex]);

  const getRoleAvatar = (id: string) => {
    switch (id) {
      case 'resident': return '/avatar_resident.png';
      case 'shop_owner': return '/avatar_shopowner.png';
      case 'commuter': return '/avatar_commuter.png';
      case 'elderly': return '/avatar_elderly.png';
      case 'environmentalist': return '/avatar_environmentalist.png';
      case 'government': return '/avatar_government.png';
      case 'player': return getRoleAvatar(playerRole.id);
      default: return '/avatar_resident.png';
    }
  };

  const getRoleName = (id: string) => {
    if (id === 'player') return `${playerRole.name} (您)`;
    const role = roles.find(r => r.id === id);
    return role ? role.name : '市民代表';
  };

  const getAvatarBg = (id: string) => {
    const speakerId = id === 'player' ? playerRole.id : id;
    switch (speakerId) {
      case 'resident': return 'bg-rose-100 border-[#eed1cd]';
      case 'shop_owner': return 'bg-orange-100 border-[#eedcbf]';
      case 'commuter': return 'bg-blue-100 border-[#d2e2eb]';
      case 'elderly': return 'bg-rose-100 border-[#eed1cd]';
      case 'environmentalist': return 'bg-emerald-100 border-[#cfe2d7]';
      case 'government': return 'bg-slate-200 border-[#e5dfd5]';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getBlobClass = (id: string) => {
    const speakerId = id === 'player' ? playerRole.id : id;
    switch (speakerId) {
      case 'resident': case 'elderly': return 'blob-avatar-1';
      case 'shop_owner': case 'environmentalist': return 'blob-avatar-2';
      default: return 'blob-avatar-3';
    }
  };

  // Dialogue Data Controller for each segment walk
  const getDialogue = (): { speakerId: string; text: string; isChoice?: boolean; choices?: Choice[]; buttonText?: string } => {
    const choiceId = selectedChoice?.id || '';

    // SEGMENT 0: Residential Area (Round 1 Decision)
    if (activeSegmentIndex === 0) {
      const r1 = rounds[0];
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'resident',
            text: '我們住宅社區段緊鄰老舊民房，高架自行車道如果太靠近二樓陽台，生活隱私和安寧都會受到嚴重干擾，非常不自在。',
            buttonText: '我瞭解了。那我們規劃小組有哪些替代策略？'
          };
        case 1:
          return {
            speakerId: 'resident',
            text: '這是目前提出的三種路廊配置。請您評估並做出決策提案：',
            isChoice: true,
            choices: r1.choices
          };
        case 2:
          return {
            speakerId: 'player',
            text: `我提案採用這項策略：『${selectedChoice?.text}』`,
            buttonText: '聽聽其他市民代表與官方的意見評議'
          };
        case 3:
          return {
            speakerId: 'resident',
            text: choiceId === '1a' 
              ? '（皺眉）這太令人失望了，隱私跟陽台前的壓迫感完全沒有被改善，每天都覺得有人在看我。' 
              : choiceId === '1b' 
                ? '（微笑）太感謝了！自行車道降至地面層，我們拉開了安全距離，陽台看出去舒服多了。' 
                : '（無奈）高架橋仍然立在陽台前，但有了厚實的綠化遮簾和防隱私板，比完全沒遮蔽好一些。',
            buttonText: '繼續聽取意見'
          };
        case 4:
          return {
            speakerId: 'commuter',
            text: choiceId === '1a' 
              ? '（點點頭）這樣規劃很棒！通勤動線最流暢，能保證最高速度，非常適合上班騎車。' 
              : choiceId === '1b' 
                ? '（嘆氣）降至地面意味着要停等更多巷口的紅綠燈，通勤騎行的時速可能會下降 30%。' 
                : '高架天橋的連續性被保留了，但裝了隔音板後視野變得比較狹窄，在天橋上騎車要放慢速度。',
            buttonText: '繼續聽取意見'
          };
        case 5:
          return {
            speakerId: 'environmentalist',
            text: choiceId === '1a' 
              ? '龐大的混凝土高架結構遮蔽了大半天光，對地面的綠化植栽生長非常不利。' 
              : choiceId === '1b' 
                ? '高架水泥結構減少了，對地面的綠化與植栽生長是好事，視野也更開闊。' 
                : '綠化遮簾可以稍微提供一些垂直綠化，但無法完全彌補大型高架結構對生態的切割。',
            buttonText: '繼續聽取意見'
          };
        case 6:
          return {
            speakerId: 'government',
            text: choiceId === '1a' 
              ? '維持高架可減少人車衝突，但需要增加隔音防隱私隔板的預算。' 
              : choiceId === '1b' 
                ? '降至地面會增加與橫向社區巷道的交叉衝突點，市府需在路口加強安全標誌與照明導引。' 
                : '這是一個兼顧通勤效率與隱私保護的折衷方案，雖然綠化維護費用會微幅上升。',
            buttonText: '結束住宅區規劃，往繁榮商業段走'
          };
        default:
          return { speakerId: 'player', text: '我們前行吧。' };
      }
    }

    // SEGMENT 1: Commercial Area (Round 2 Decision)
    if (activeSegmentIndex === 1) {
      const r2 = rounds[1];
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'shop_owner',
            text: '我們商業區店面林立。如果讓自行車騎士都從上面的高架天橋快速掠過，地面的店鋪完全吃不到人氣與客源，這對商家的生存打擊太大了。',
            buttonText: '這確實是商業活力的痛點，有什麼規劃替代方案？'
          };
        case 1:
          return {
            speakerId: 'shop_owner',
            text: '以下是規劃團隊設計的三個商業街區方案。請做出您的抉擇提案：',
            isChoice: true,
            choices: r2.choices
          };
        case 2:
          return {
            speakerId: 'player',
            text: `我提案採用這項策略：『${selectedChoice?.text}』`,
            buttonText: '聽聽沿途店家與高齡長輩的意見'
          };
        case 3:
          return {
            speakerId: 'shop_owner',
            text: choiceId === '2a' 
              ? '（反對）這太糟糕了！自行車騎士全都從二樓高度飄過去，我們的店面完全被跳過了！' 
              : choiceId === '2b' 
                ? '（高興）太棒了！自行車降至地面，騎士很容易停下來買杯飲料或進店逛逛，這對店家是好消息！' 
                : '（十分滿意）這是我最推崇的！共享街區和停靠點能吸引騎士和行人駐足停留，商業與休閒融為一體！',
            buttonText: '繼續聽取意見'
          };
        case 4:
          return {
            speakerId: 'elderly',
            text: choiceId === '2a' 
              ? '抬頭只看到冰冷的水泥橋，地面層光線陰暗且缺乏商業活力，走起來不舒服。' 
              : choiceId === '2b' 
                ? '地面人行道變寬且有了人氣，散步累了還可以到咖啡店坐坐，很好！' 
                : '（高興）有充足的樹蔭和路邊停靠長椅可以坐著乘涼，感覺很有人情味與休閒感。',
            buttonText: '繼續聽取意見'
          };
        case 5:
          return {
            speakerId: 'commuter',
            text: choiceId === '2a' 
              ? '在高架橋上通過商業區最安全，不會遇到隨意違停的汽機車或橫穿馬路的行人。' 
              : choiceId === '2b' 
                ? '降至地面必須隨時提防店門口的人流和違停車輛，速度會變得很慢，安全性也變低。' 
                : '雖然是慢速共享，但對休閒騎行很棒。通勤族可能需要繞道，不過整體很有活力。',
            buttonText: '繼續聽取意見'
          };
        case 6:
          return {
            speakerId: 'government',
            text: choiceId === '2a' 
              ? '這樣規劃保護了自行車流，但對鐵路地下化後的地面商業復甦幾乎沒有正面效益。' 
              : choiceId === '2b' 
                ? '自行車與商業人流混雜在地面層，市府必須劃設明確的步行區與自行車慢速道，避免人車擦撞。' 
                : '低速共享街區能降低交通事故，又能提供大面積遮蔭綠帶，是一個多方共贏的空間策略。',
            buttonText: '結束商業區規劃，往前走向車站樞紐'
          };
        default:
          return { speakerId: 'player', text: '我們前行吧。' };
      }
    }

    // SEGMENT 2: Station Hub (Narrative Interlude)
    if (activeSegmentIndex === 2) {
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'government',
            text: '（指向前方廣闊的空地）這裡就是歷史悠久的台南舊鐵道車站區，是這段綠園道的樞紐地景節點。',
            buttonText: '請問這段會如何保留歷史記憶？'
          };
        case 1:
          return {
            speakerId: 'government',
            text: '市府與景觀設計團隊決定保留日治時期的舊月台遺跡與部分鐵軌，打造成「鐵道記憶歷史廣場」，將歷史記憶融入現代市民休閒地景。',
            buttonText: '這是一項很有溫度的規劃！'
          };
        case 2:
          return {
            speakerId: 'player',
            text: '將鐵道文化記憶和公共廣場空間結合，既能提供豐富的休閒機能，又能讓後代子孫看見台南發展的軌跡。',
            buttonText: '結束參觀，繼續往前踏查路口'
          };
        default:
          return { speakerId: 'player', text: '我們前行吧。' };
      }
    }

    // SEGMENT 3: Crossing (Narrative Interlude)
    if (activeSegmentIndex === 3) {
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'commuter',
            text: '前方是綠園道與主要市區縱向幹道交叉的十字路口，平時上下班時間車流量極大，路況非常繁忙且複雜。',
            buttonText: '那我們要如何保障行人和單車騎士的安全？'
          };
        case 1:
          return {
            speakerId: 'government',
            text: '我們在此規畫了「立體交叉安全設計」，採用地下道或立體天橋路廊實現完全的人車分流，確保騎士與步行長者安全跨越幹道。',
            buttonText: '安全至上，立體分道是明智的選擇。'
          };
        case 2:
          return {
            speakerId: 'player',
            text: '立體人車分流可以徹底解決這個高風險節點的安全疑慮，讓大家走得更有安全感！',
            buttonText: '踏查完畢，前往最後的生態廊道路段'
          };
        default:
          return { speakerId: 'player', text: '我們前行吧。' };
      }
    }

    // SEGMENT 4: Ecological Corridor (Round 3 Decision)
    if (activeSegmentIndex === 4) {
      const r3 = rounds[2];
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'environmentalist',
            text: '這段是我們綠園道的生態核心。台南夏天氣溫非常高，如果都鋪設硬質水泥鋪面，整條廊道會變成發燙的城市熱島。我們需要大面積的透水鋪面與生態林蔭！',
            buttonText: '我們開始探討這段生態綠廊的規劃策略。'
          };
        case 1:
          return {
            speakerId: 'environmentalist',
            text: '以下是三種鋪面與生態設計策略。請做出您的抉擇提案：',
            isChoice: true,
            choices: r3.choices
          };
        case 2:
          return {
            speakerId: 'player',
            text: `我提案採用這項策略：『${selectedChoice?.text}』`,
            buttonText: '聽聽環保老師與市府代表的反饋'
          };
        case 3:
          return {
            speakerId: 'environmentalist',
            text: choiceId === '3a' 
              ? '（憤怒）這完全背離了生態綠園道的初衷！大面積硬質鋪面會加劇台南夏天的都市熱島效應！' 
              : choiceId === '3b' 
                ? '（讚成）太棒了！連續的林蔭與雨水花園，能保水透水，還給台南市區一個會呼吸的森林綠帶！' 
                : '（妥協）這是一個可接受的平衡。只要綠帶段的連續性與透水率有受到嚴格監管即可。',
            buttonText: '繼續聽取意見'
          };
        case 4:
          return {
            speakerId: 'elderly',
            text: choiceId === '3a' 
              ? '（嘆氣）大太陽下全是熱烘烘的硬鋪面，沒有樹蔭，我們老人家根本不敢來這裡散步。' 
              : choiceId === '3b' 
                ? '（開心）走在樹蔭下非常涼爽，雨水花園也很漂亮，感覺像是一座真正的生態公園。' 
                : '有廣場有公園，走累了有地方歇腳，這樣設計很均衡。',
            buttonText: '繼續聽取意見'
          };
        case 5:
          return {
            speakerId: 'commuter',
            text: choiceId === '3a' 
              ? '路面平坦好騎，但缺乏大樹遮蔭，騎在上面像在煎鍋上，非常痛苦。' 
              : choiceId === '3b' 
                ? '綠化很多確實舒服，但要注意落葉和雨天過後的路面濕滑與排水維護問題。' 
                : '既有活動廣場又有舒適綠意，對吸引人潮與休閒很有幫助。',
            buttonText: '繼續聽取意見'
          };
        case 6:
          return {
            speakerId: 'government',
            text: choiceId === '3a' 
              ? '硬質鋪面的維護成本較低，但確實對都市生態和防汛排水有負面衝擊，需要再斟酌。' 
              : choiceId === '3b' 
                ? '生態指標獲得最大提升，但市府需要投入較高的植栽養護與雨水花園疏濬預算。' 
                : '（滿意）這是非常務實的方案。在車站節點提供硬鋪面供市集活動使用，其餘路段保留大面積生態綠帶。',
            buttonText: '送審並簽署共創成果書 →'
          };
        default:
          return { speakerId: 'player', text: '我們前行吧。' };
      }
    }

    return { speakerId: 'player', text: '我們前行吧。' };
  };

  const currentDialogue = getDialogue();

  const handleNextDialogueStep = () => {
    const isInterlude = segments[activeSegmentIndex].isInterlude;
    const maxSteps = isInterlude ? 2 : 6;
    
    if (dialogueStep < maxSteps) {
      setDialogueStep(prev => prev + 1);
    } else {
      // Proceed to next segment
      if (activeSegmentIndex < segments.length - 1) {
        setActiveSegmentIndex(prev => prev + 1);
        setDialogueStep(0);
        setSelectedChoice(null);
      } else {
        // Game complete, go to results
        onComplete();
      }
    }
  };

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    onChoiceMade(choice);
    setDialogueStep(2); // Go to player speaking step
  };

  // Helper to determine active planning tendency
  const getPlanningTendency = () => {
    const scoreEntries = Object.entries(scores);
    let maxVal = -Infinity;
    let maxKey = '';
    
    for (const [key, val] of scoreEntries) {
      const numVal = val as number;
      if (numVal > maxVal) {
        maxVal = numVal;
        maxKey = key;
      }
    }
    
    const minVal = Math.min(...(Object.values(scores) as number[]));
    if (maxVal - minVal <= 10) return '多元平衡';

    switch (maxKey) {
      case 'residential': return '社區安寧優先';
      case 'commercial': return '街區經濟優先';
      case 'mobility': return '交通效率優先';
      case 'ecological': return '生態棲地優先';
      case 'cultural': return '歷史記憶優先';
      default: return '多元平衡';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full p-4 md:p-6 max-w-[1400px] mx-auto overflow-hidden relative">
      
      {/* Top Banner Bar */}
      <div className="mb-4 flex justify-between items-center bg-white border-2 border-[#e5dfd5] p-4 rounded-2xl shadow-soft-sm shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif font-extrabold text-base text-[var(--color-text-dark)]">
            台南綠園道共創：踏查冒險
          </span>
          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-[var(--color-brand-green)] text-[9px] font-bold rounded-full font-mono">
            GREENWAY QUEST RPG
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowNotebook(prev => !prev)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF6EE] border-2 border-[#ded8ce] hover:border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] rounded-full text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <BookOpen size={14} />
            {showNotebook ? '關閉規劃筆記' : '打開規劃筆記 (📖)'}
          </button>
        </div>
      </div>

      {/* Main Adventure Screen */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden relative min-h-0">
        
        {/* Map Scroll Track Area */}
        <div 
          ref={mapRef}
          className="h-72 w-full bg-[#FFFDF9] border-2 border-[#e5dfd5] rounded-[24px_28px_20px_26px] overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth relative shadow-soft shrink-0"
        >
          {/* Scrollable Illustration background */}
          <div className="inline-block min-w-[1400px] w-full h-full relative select-none">
            <img 
              src="/greenway_watercolor.png" 
              alt="Watercolor Greenway" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
            />
            
            {/* Dark gradient overlay for bottom text spacing */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            {/* Segment dividing lines and labels */}
            {segments.map((seg) => {
              const isActive = seg.id === activeSegmentIndex;
              return (
                <div 
                  key={seg.id}
                  id={`segment-pin-${seg.id}`}
                  style={{ left: `${seg.left}%` }}
                  className="absolute bottom-6 -translate-x-1/2 flex flex-col items-center justify-end z-10"
                >
                  {/* Segment Tag */}
                  <div className={`px-2.5 py-1 rounded-lg border-2 font-serif text-[10px] font-bold shadow-soft-sm transition-all duration-300 ${
                    isActive 
                      ? 'bg-[var(--color-brand-coral)] border-[var(--color-brand-coral)] text-white scale-105 -translate-y-1' 
                      : 'bg-white/90 border-[#e5dfd5] text-gray-500'
                  }`}>
                    {seg.name}
                  </div>
                  <span className="text-[8px] font-mono text-white/90 mt-1 opacity-70">{seg.sta}</span>
                </div>
              );
            })}

            {/* Render NPC tokens standing in their segments */}
            {segments.map((seg) => {
              const isCurrent = seg.id === activeSegmentIndex;
              return (
                <div 
                  key={`npcs-${seg.id}`}
                  style={{ left: `${seg.left - 2}%` }}
                  className="absolute bottom-20 -translate-x-1/2 flex gap-2.5"
                >
                  {seg.npcs.map((npcId) => {
                    const avatar = getRoleAvatar(npcId);
                    return (
                      <div 
                        key={npcId}
                        className={`w-10 h-10 rounded-full border-2 overflow-hidden bg-white shadow-soft relative transition-all duration-300 ${
                          isCurrent 
                            ? 'border-[var(--color-brand-yellow)] scale-110 -translate-y-1 ring-4 ring-[var(--color-brand-yellow)]/20' 
                            : 'border-[#e5dfd5] opacity-60'
                        }`}
                      >
                        <img src={avatar} alt={npcId} className="w-full h-full object-cover scale-110" />
                        {/* Conversation floating dot */}
                        {isCurrent && dialogueStep === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-ping" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* PLAYER CHARACTER TOKEN (Moving along the path) */}
            <div 
              style={{ 
                left: `${segments[activeSegmentIndex].left + 2}%`,
                transition: 'left 1s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
              className="absolute bottom-20 -translate-x-1/2 flex flex-col items-center z-20"
            >
              {/* Floating planning checkmark flag */}
              <div className="bg-[var(--color-brand-coral)] text-white text-[8px] font-bold px-2 py-0.5 rounded-full mb-1 animate-float shadow-soft-sm uppercase tracking-wider">
                您在這裡 / YOU
              </div>
              <div className={`w-12 h-12 rounded-full border-3 border-[var(--color-brand-coral)] overflow-hidden bg-white shadow-md ring-4 ring-[var(--color-brand-coral)]/20`}>
                <img 
                  src={getRoleAvatar(playerRole.id)} 
                  alt={playerRole.name} 
                  className="w-full h-full object-cover scale-110"
                />
              </div>
            </div>

          </div>
        </div>

        {/* RPG Dialogue Console */}
        <div className="flex-1 bg-[#FFFDF9] border-2 border-[#e5dfd5] rounded-[24px_28px_20px_26px] p-5 shadow-soft flex flex-col justify-between min-h-0 relative">
          
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex gap-5 items-start">
              
              {/* Speaker Avatar (Left) */}
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-16 h-16 ${getBlobClass(currentDialogue.speakerId)} ${getAvatarBg(currentDialogue.speakerId)} border-2 border-[#e5dfd5] overflow-hidden shadow-soft flex items-center justify-center`}>
                  <img 
                    src={getRoleAvatar(currentDialogue.speakerId)} 
                    alt={getRoleName(currentDialogue.speakerId)} 
                    className="w-full h-full object-cover scale-115"
                  />
                </div>
                <span className="mt-2 text-[10px] font-mono font-bold text-gray-400 bg-white border border-[#e5dfd5] px-2 py-0.5 rounded-full select-none shadow-soft-xs">
                  {getRoleName(currentDialogue.speakerId)}
                </span>
              </div>

              {/* Spoken Dialogue Area (Right) */}
              <div className="flex-1 min-h-[100px] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-gray-400 font-sans uppercase mb-1">
                    [ 路段踏查對話中 / CIVIC TALK ]
                  </div>
                  
                  {/* Speech dialogue bubble text */}
                  <p className="text-[#3a3530] text-sm md:text-base leading-relaxed font-serif animate-fade-in font-semibold bg-[#faf8f4] p-4 rounded-2xl border border-[#e5dfd5]/60 shadow-inner-sm">
                    {currentDialogue.text}
                  </p>
                </div>

                {/* Conflict card shown in Choice step (Segment 0, 1, 4) */}
                {currentDialogue.isChoice && (
                  <div className="mt-4 animate-fade-in-up flex items-center gap-4 bg-[#fffdf0] border border-[#eedcbf] p-3 rounded-xl max-w-lg">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#ded6c9] shrink-0">
                      <img 
                        src={activeSegmentIndex === 0 ? '/conflict_privacy.png' : activeSegmentIndex === 1 ? '/conflict_commerce.png' : '/conflict_ecology.png'} 
                        alt="Conflict visual"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-bold text-[#b37a3c] block">[ 本段關鍵空間衝突點 ]</span>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        {activeSegmentIndex === 0 ? '住宅區隱私與高架通勤通道的空間分配衝突。' : activeSegmentIndex === 1 ? '商業區店鋪人流與騎士快速越過天橋的衝突。' : '生態綠帶透水雨水花園與高強度水泥硬鋪面的衝突。'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Action Bar (Choices or Next Step buttons) */}
          <div className="mt-4 pt-4 border-t-2 border-[#e5dfd5] shrink-0">
            {currentDialogue.isChoice && currentDialogue.choices ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentDialogue.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice)}
                    className="text-left p-3.5 border-2 border-[#ded8ce] hover:border-[var(--color-brand-coral)] hover:bg-[#FFFFFC] bg-white rounded-xl shadow-soft-sm transition-all duration-200 cursor-pointer group flex flex-col justify-between h-full"
                  >
                    <div className="flex items-start mb-2">
                      <div className="w-6 h-6 rounded-full bg-gray-150 group-hover:bg-[var(--color-brand-coral)] text-gray-500 group-hover:text-white flex items-center justify-center font-bold text-[10px] mr-2 shrink-0 transition-colors font-mono">
                        {choice.id.replace(/[0-9]/g, '').toUpperCase()}
                      </div>
                      <span className="text-xs text-[var(--color-text-dark)] font-bold font-sans leading-relaxed group-hover:text-[var(--color-brand-coral)]">
                        {choice.text}
                      </span>
                    </div>
                    
                    {/* Visual indicators check */}
                    <div className="flex gap-1.5 text-[8px] font-bold flex-wrap mt-1">
                      {Object.entries(choice.effects).map(([key, val]) => {
                        if (val === 0) return null;
                        const label = getMetricLabel(key);
                        const style = getMetricColor(key);
                        return (
                          <span key={key} className={`px-1.5 py-0.2 rounded border ${style}`}>
                            {label}: {val > 0 ? '+' : ''}{val}
                          </span>
                        );
                      })}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={handleNextDialogueStep}
                className="w-full bg-[var(--color-brand-green)] hover:bg-[#4b6a58] text-white py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {currentDialogue.buttonText || '繼續對話'}
                <ChevronRight size={16} />
              </button>
            )}
          </div>

        </div>

        {/* Floating COLLAPSIBLE PLANNING NOTEBOOK PANEL (Left side slide) */}
        {showNotebook && (
          <div className="absolute inset-y-0 right-0 w-80 bg-transparent flex justify-end z-30 animate-fade-in">
            {/* Backboard overlay clicking out */}
            <div 
              className="absolute inset-0 bg-transparent" 
              onClick={() => setShowNotebook(false)}
            />
            
            {/* Notebook Panel */}
            <div className="w-72 bg-[#FFFDF9] border-l-2 border-y-2 border-[#e5dfd5] rounded-l-3xl p-5 shadow-2xl h-full flex flex-col justify-between relative transform translate-x-0 transition-transform duration-300">
              <button 
                onClick={() => setShowNotebook(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4 border-b border-[#e5dfd5] pb-3 shrink-0">
                  <Activity size={15} className="text-[var(--color-brand-blue)]" />
                  <h3 className="text-xs font-bold text-gray-500 font-sans">綠園道規劃筆記本</h3>
                </div>

                {/* Score Indicators List */}
                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  {[
                    { key: 'residential', label: '居住舒適', value: scores.residential, color: 'bg-[#d37b70]' },
                    { key: 'commercial', label: '商業活力', value: scores.commercial, color: 'bg-[#e2a968]' },
                    { key: 'mobility', label: '交通效率', value: scores.mobility, color: 'bg-[#6b8b9b]' },
                    { key: 'ecological', label: '生態棲地', value: scores.ecological, color: 'bg-[#5a7a68]' },
                    { key: 'cultural', label: '歷史記憶', value: scores.cultural, color: 'bg-stone-400' },
                  ].map((indicator) => {
                    const change = indicator.value - 50;
                    return (
                      <div key={indicator.key} className="space-y-1 font-sans text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">{indicator.label}</span>
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="font-bold text-[var(--color-text-dark)]">{indicator.value}</span>
                            {change > 0 && <span className="text-[9px] font-bold text-green-600 px-1 bg-green-50 border border-green-100 rounded">+{change}</span>}
                            {change < 0 && <span className="text-[9px] font-bold text-rose-500 px-1 bg-rose-50 border border-rose-100 rounded">{change}</span>}
                          </div>
                        </div>
                        {/* Progress Bar Track */}
                        <div className="brush-progress-track h-2.5 w-full bg-[#f3ede3]/60">
                          <div 
                            className={`brush-progress-fill h-full ${indicator.color}`}
                            style={{ width: `${Math.max(0, Math.min(100, indicator.value))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-dashed border-[#e5dfd5] shrink-0 font-sans text-[10px] text-gray-500">
                <div className="flex justify-between items-center mb-1">
                  <span>我的身分：</span>
                  <span className="font-bold text-[var(--color-text-dark)] font-serif">{playerRole.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>主要規劃傾向：</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 border border-emerald-100 text-[var(--color-brand-green)] font-bold">
                    {getPlanningTendency()}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const getMetricLabel = (key: string) => {
  switch (key) {
    case 'residential': return '居住';
    case 'commercial': return '商業';
    case 'mobility': return '交通';
    case 'ecological': return '生態';
    case 'cultural': return '歷史';
    default: return key;
  }
};

const getMetricColor = (key: string) => {
  switch (key) {
    case 'residential': return 'bg-rose-50 border-rose-100 text-[#c26257]';
    case 'commercial': return 'bg-amber-50 border-amber-100 text-[#b37a3c]';
    case 'mobility': return 'bg-blue-50 border-blue-100 text-[#4d7082]';
    case 'ecological': return 'bg-emerald-50 border-emerald-100 text-[#3e5f4c]';
    case 'cultural': return 'bg-stone-50 border-stone-100 text-stone-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};
