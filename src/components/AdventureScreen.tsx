import React, { useState, useEffect, useRef } from 'react';
import { Choice, Round } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { Award, Activity, ChevronRight, BookOpen, X, Sparkles, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';

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
  // Game exploration states
  const [playerX, setPlayerX] = useState(6); // horizontal coordinate on the map scroll (5% to 95%)
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  
  const [completedSegments, setCompletedSegments] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false
  });
  
  const [showNotebook, setShowNotebook] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const segments = [
    { id: 0, name: '住宅社區段', sta: 'STA 0+000 - 0+400', left: 20, npcs: ['resident', 'commuter'], roundIndex: 0 },
    { id: 1, name: '繁榮商業段', sta: 'STA 0+400 - 0+700', left: 40, npcs: ['shop_owner', 'commuter'], roundIndex: 1 },
    { id: 2, name: '台南車站樞紐', sta: 'STA 0+700', left: 56, npcs: ['government'], isInterlude: true },
    { id: 3, name: '幹道交叉路口', sta: 'STA 0+700 - 0+900', left: 72, npcs: ['commuter'], isInterlude: true },
    { id: 4, name: '綠意生態廊道', sta: 'STA 0+900 - 1+400', left: 88, npcs: ['environmentalist', 'elderly'], roundIndex: 2 }
  ];

  // Helper to check if player is near any NPC
  const getNearNpc = () => {
    for (const seg of segments) {
      if (Math.abs(playerX - seg.left) < 3.5) {
        return seg;
      }
    }
    return null;
  };

  const nearNpc = getNearNpc();

  // Helper to check if previous segments are completed
  const canTalkToNpc = (segId: number) => {
    for (let i = 0; i < segId; i++) {
      if (!completedSegments[i]) return false;
    }
    return true;
  };

  const allCompleted = completedSegments[0] && completedSegments[1] && completedSegments[2] && completedSegments[3] && completedSegments[4];

  // Auto scroll map track to keep player centered in view
  useEffect(() => {
    if (mapRef.current) {
      const containerWidth = mapRef.current.clientWidth;
      const scrollWidth = mapRef.current.scrollWidth;
      const playerPixelPosition = (playerX / 100) * scrollWidth;
      
      mapRef.current.scrollLeft = playerPixelPosition - containerWidth / 2;
    }
  }, [playerX]);

  // Keyboard Event Listeners for Movement and Spacebar Dialogues
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If dialogue is open, SPACE or ENTER progresses dialog (unless choices are shown)
      if (isDialogueOpen) {
        if (e.key === ' ' || e.key === 'Enter') {
          const currentDialogue = getDialogue();
          if (!currentDialogue.isChoice) {
            e.preventDefault();
            handleNextDialogueStep();
          }
        }
        return;
      }

      if (showNotebook) return;

      // Player Movement using AD / ArrowKeys
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setPlayerX(prev => Math.max(5, prev - 1.5));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setPlayerX(prev => Math.min(96, prev + 1.5));
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        // Trigger talk
        if (nearNpc) {
          if (canTalkToNpc(nearNpc.id) && !completedSegments[nearNpc.id]) {
            setSelectedChoice(null);
            setDialogueStep(0);
            setActiveSegmentIndex(nearNpc.id);
            setIsDialogueOpen(true);
          }
        } else if (playerX >= 94) {
          if (allCompleted) {
            onComplete();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerX, isDialogueOpen, activeSegmentIndex, dialogueStep, selectedChoice, showNotebook, completedSegments]);

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

  const getBlobBgClass = (id: string) => {
    const speakerId = id === 'player' ? playerRole.id : id;
    switch (speakerId) {
      case 'resident': return 'bg-blob-pink';
      case 'shop_owner': return 'bg-blob-yellow';
      case 'commuter': return 'bg-blob-blue';
      case 'elderly': return 'bg-blob-pink';
      case 'environmentalist': return 'bg-blob-green';
      case 'government': return 'bg-gray-200';
      default: return 'bg-gray-150';
    }
  };

  // Dialogue Content Matrix for visual novel walk-and-chat flow
  const getDialogue = (): { speakerId: string; text: string; isChoice?: boolean; choices?: Choice[]; buttonText?: string } => {
    const choiceId = selectedChoice?.id || '';

    // SEGMENT 0: Residential Area (Round 1 Decision)
    if (activeSegmentIndex === 0) {
      const r1 = rounds[0];
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'resident',
            text: '我們住宅社區段緊鄰許多老舊透天厝。自行車高架橋如果蓋得太高、太靠近我們的陽台，居民每天的隱私和安寧都會受到嚴重干擾，生活變得很不自在。',
            buttonText: '我瞭解了。那我們規劃小組有什麼空間對策可以提案？'
          };
        case 1:
          return {
            speakerId: 'resident',
            text: '這是針對住宅路段設計的三種替代方案。請您評估並代表市民做出空間配置提案：',
            isChoice: true,
            choices: r1.choices
          };
        case 2:
          return {
            speakerId: 'player',
            text: `我決定提交這項提案：『${selectedChoice?.text}』`,
            buttonText: '聽聽其他代表對本路段提案的意見評議'
          };
        case 3:
          return {
            speakerId: 'resident',
            text: choiceId === '1a' 
              ? '（皺眉）這太令人失望了，隱私跟陽台前的壓迫感完全沒有被改善，每天都覺得有人在看我。' 
              : choiceId === '1b' 
                ? '（微笑）太感謝了！自行車道降至地面層，我們拉開了安全距離，陽台看出去舒服多了。' 
                : '（無奈）高架橋仍然立在陽台前，但有了厚實的綠化遮簾和防隱私板，比完全沒遮蔽好一些。',
            buttonText: '聽取通勤族小宇的看法'
          };
        case 4:
          return {
            speakerId: 'commuter',
            text: choiceId === '1a' 
              ? '（點點頭）這樣規劃很棒！通勤動線最流暢，能保證最高速度，非常適合上班騎車。' 
              : choiceId === '1b' 
                ? '（嘆氣）降至地面層意味著騎士在住宅區要停等更多小巷的紅綠燈，時速可能會下降不少。' 
                : '高架天橋的連續性被保留了，但裝了隔音板後視野變得比較狹窄，在天橋上騎車要放慢速度。',
            buttonText: '聽取生態界綠野老師的看法'
          };
        case 5:
          return {
            speakerId: 'environmentalist',
            text: choiceId === '1a' 
              ? '龐大的混凝土高架結構遮蔽了大半天光，對地面的綠化植栽生長非常不利。' 
              : choiceId === '1b' 
                ? '高架水泥結構減少了，對地面的綠化與植栽生長是好事，視野也更開闊。' 
                : '綠化遮簾可以稍微提供一些垂直綠化，但無法完全彌補大型高架結構對生態的切割。',
            buttonText: '聽取市府林科長的評估'
          };
        case 6:
          return {
            speakerId: 'government',
            text: choiceId === '1a' 
              ? '維持高架可減少人車衝突，但需要增加隔音防隱私隔板的預算。' 
              : choiceId === '1b' 
                ? '降至地面會增加與橫向社區巷道的交叉衝突點，市府需在路口加強安全標誌與照明導引。' 
                : '這是一個兼顧通勤效率與隱私保護的折衷方案，雖然綠化維護費用會微幅上升。',
            buttonText: '【完成本段協商】結束對話，繼續踏查'
          };
        default:
          return { speakerId: 'player', text: '本段協商完成，我們往前走吧。' };
      }
    }

    // SEGMENT 1: Commercial Area (Round 2 Decision)
    if (activeSegmentIndex === 1) {
      const r2 = rounds[1];
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'shop_owner',
            text: '我們商業區店家林立。如果只讓自行車快速度從高架橋飛越過去，地面的店鋪完全看不到人潮，對店家的生存打擊太大了。',
            buttonText: '這確實會跳過地面街區商業，有什麼規劃替代方案？'
          };
        case 1:
          return {
            speakerId: 'shop_owner',
            text: '以下是規劃小組設計的三個方案。請做出您的抉擇提案：',
            isChoice: true,
            choices: r2.choices
          };
        case 2:
          return {
            speakerId: 'player',
            text: `我決定提交這項提案：『${selectedChoice?.text}』`,
            buttonText: '聽聽沿街商家莉雅的反饋'
          };
        case 3:
          return {
            speakerId: 'shop_owner',
            text: choiceId === '2a' 
              ? '（反對）這太糟糕了！自行車騎士全都從二樓高度飄過去，我們的店面完全被跳過了！' 
              : choiceId === '2b' 
                ? '（高興）太棒了！自行車降至地面，騎士很容易停下來買杯飲料或進店逛逛，這對店家是好消息！' 
                : '（十分滿意）這是我最推崇的！共享街區和停靠點能吸引騎士和行人駐足停留，商業與休閒融為一體！',
            buttonText: '聽取高齡長者陳伯伯的想法'
          };
        case 4:
          return {
            speakerId: 'elderly',
            text: choiceId === '2a' 
              ? '抬頭只看到冰冷的水泥橋，地面層光線陰暗且缺乏商業活力，走起來不舒服。' 
              : choiceId === '2b' 
                ? '地面人行道變寬且有了人氣，散步累了還可以到咖啡店坐坐，很好！' 
                : '（高興）有充足的樹蔭和路邊停靠長椅可以坐著乘涼，感覺很有人情味與休閒感。',
            buttonText: '聽取通勤族小宇的想法'
          };
        case 5:
          return {
            speakerId: 'commuter',
            text: choiceId === '2a' 
              ? '在高架橋上通過商業區最安全，不會遇到隨意違停的汽機車或橫穿馬路的行人。' 
              : choiceId === '2b' 
                ? '降至地面必須隨時提防店門口的人流和違停車輛，速度會變得很慢，安全性也變低。' 
                : '雖然是慢速共享，但對休閒騎行很棒。通勤族可能需要繞道，不過整體很有活力。',
            buttonText: '聽取市府林科長的想法'
          };
        case 6:
          return {
            speakerId: 'government',
            text: choiceId === '2a' 
              ? '這樣規劃保護了自行車流，但對鐵路地下化後的地面商業復甦幾乎沒有正面效益。' 
              : choiceId === '2b' 
                ? '自行車與商業人流混雜在地面層，市府必須劃設明確的步行區與自行車慢速道，避免人車擦撞。' 
                : '低速共享街區能降低交通事故，又能提供大面積遮蔭綠帶，是一個多方共贏的空間策略。',
            buttonText: '【完成本段協商】結束對話，往前踏查'
          };
        default:
          return { speakerId: 'player', text: '本段協商完成，我們往前走吧。' };
      }
    }

    // SEGMENT 2: Station Hub (Narrative Interlude)
    if (activeSegmentIndex === 2) {
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'government',
            text: '（指著前方保留的月台）這裡就是歷史悠久的台南舊車站鐵路區段，是這條綠園道的樞紐地景節點。',
            buttonText: '這裡的鐵軌和舊月台會如何融入綠園道？'
          };
        case 1:
          return {
            speakerId: 'government',
            text: '市府與設計師決定保留舊月台遺跡與鐵軌，整理周邊植栽，打造一座「鐵道記憶歷史廣場」，將市民的集體記憶保留在地景之中。',
            buttonText: '這是一項富有溫度的都市缝合規劃！'
          };
        case 2:
          return {
            speakerId: 'player',
            text: '將鐵道文化遺跡和公共廣場空間結合，既能提供散步休閒廣場，又能讓後代看見台南發展的軌跡。',
            buttonText: '【結束本段踏查】繼續往前走'
          };
        default:
          return { speakerId: 'player', text: '踏查完成，往前走吧。' };
      }
    }

    // SEGMENT 3: Crossing (Narrative Interlude)
    if (activeSegmentIndex === 3) {
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'commuter',
            text: '前方是綠園道穿越縱向主要幹道的十字路口，平時上下班時間車流量非常龐大，路況十分危險且複雜。',
            buttonText: '那我們要如何確保自行車與行人的安全？'
          };
        case 1:
          return {
            speakerId: 'government',
            text: '我們在這裡規劃了「立體交叉安全設計」，採用地下道或立體天橋路廊，實現完全的人車分道，確保騎士與步行長輩安全跨越幹道。',
            buttonText: '安全第一，立體分流確實是明智之舉。'
          };
        case 2:
          return {
            speakerId: 'player',
            text: '立體化設計可以徹底解決高風險路口的衝突，讓騎士與行人都走得更有安全感！',
            buttonText: '【結束本段踏查】往前走向最後的廊道'
          };
        default:
          return { speakerId: 'player', text: '踏查完成，往前走吧。' };
      }
    }

    // SEGMENT 4: Ecological Corridor (Round 3 Decision)
    if (activeSegmentIndex === 4) {
      const r3 = rounds[2];
      switch (dialogueStep) {
        case 0:
          return {
            speakerId: 'environmentalist',
            text: '這段是我們綠園道的生態核心。台南夏天極度炎熱，鋪面設計如果過度水泥硬質化，會造成嚴重的熱島效應。我們需要高透水率和複層林蔭綠化！',
            buttonText: '我同意。那我們這段鋪面應該如何規劃？'
          };
        case 1:
          return {
            speakerId: 'environmentalist',
            text: '這是針對生態綠廊設計的三種鋪面策略。請做出您的抉擇提案：',
            isChoice: true,
            choices: r3.choices
          };
        case 2:
          return {
            speakerId: 'player',
            text: `我決定提交這項提案：『${selectedChoice?.text}』`,
            buttonText: '聽聽生態界與高齡長輩的意見回饋'
          };
        case 3:
          return {
            speakerId: 'environmentalist',
            text: choiceId === '3a' 
              ? '（憤怒）這完全背離了生態綠園道的初衷！大面積硬質鋪面會加劇台南夏天的都市熱島效應！' 
              : choiceId === '3b' 
                ? '（讚成）太棒了！連續的林蔭與雨水花園，能保水透水，還給台南市區一個會呼吸的森林綠帶！' 
                : '（妥協）這是一個可接受的平衡。只要綠帶段的連續性與透水率有受到嚴格監管即可。',
            buttonText: '聽取高齡長者陳伯伯的想法'
          };
        case 4:
          return {
            speakerId: 'elderly',
            text: choiceId === '3a' 
              ? '（嘆氣）大太陽下全是熱烘烘的硬鋪面，沒有樹蔭，我們老人家根本不敢來這裡散步。' 
              : choiceId === '3b' 
                ? '（開心）走在樹蔭下非常涼爽，雨水花園也很漂亮，感覺像是一座真正的生態公園。' 
                : '有廣場有公園，走累了有地方歇腳，這樣設計很均衡。',
            buttonText: '聽取通勤族小宇的想法'
          };
        case 5:
          return {
            speakerId: 'commuter',
            text: choiceId === '3a' 
              ? '路面平坦好騎，但缺乏大樹遮蔭，騎在上面像在煎鍋上，非常痛苦。' 
              : choiceId === '3b' 
                ? '綠化很多確實舒服，但要注意落葉和雨天過後的路面濕滑與排水維護問題。' 
                : '既有活動廣場又有舒適綠意，對吸引人潮與休閒很有幫助。',
            buttonText: '聽取市府林科長的想法'
          };
        case 6:
          return {
            speakerId: 'government',
            text: choiceId === '3a' 
              ? '硬質鋪面的維護成本較低，但確實對都市生態和防汛排水有負面衝擊，需要再斟酌。' 
              : choiceId === '3b' 
                ? '生態指標獲得最大提升，但市府需要投入較高的植栽養護與雨水花園疏濬預算。' 
                : '（滿意）這是非常務實的方案。在車站節點提供硬鋪面供市集活動使用，其餘路段保留大面積生態綠帶。',
            buttonText: '【完成所有踏查協商】送交市府審查共創成果書 →'
          };
        default:
          return { speakerId: 'player', text: '本段協商完成，送審成果。' };
      }
    }

    return { speakerId: 'player', text: '踏查中，往前走吧。' };
  };

  const currentDialogue = getDialogue();

  const handleNextDialogueStep = () => {
    const isInterlude = segments[activeSegmentIndex].isInterlude;
    const maxSteps = isInterlude ? 2 : 6;
    
    if (dialogueStep < maxSteps) {
      setDialogueStep(prev => prev + 1);
    } else {
      // Complete this segment
      setCompletedSegments(prev => ({ ...prev, [activeSegmentIndex]: true }));
      setIsDialogueOpen(false);
      
      // Let the player token stand just after the NPC to continue walking
      setPlayerX(segments[activeSegmentIndex].left + 3.5);
    }
  };

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    onChoiceMade(choice);
    setDialogueStep(2); // Progress to Player speaking proposal
  };

  const handleMoveLeft = () => {
    if (isDialogueOpen) return;
    setPlayerX(prev => Math.max(5, prev - 2));
  };

  const handleMoveRight = () => {
    if (isDialogueOpen) return;
    setPlayerX(prev => Math.min(96, prev + 2));
  };

  const handleStartTalk = () => {
    if (nearNpc && canTalkToNpc(nearNpc.id) && !completedSegments[nearNpc.id]) {
      setSelectedChoice(null);
      setDialogueStep(0);
      setActiveSegmentIndex(nearNpc.id);
      setIsDialogueOpen(true);
    }
  };

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
      <div className="mb-4 flex justify-between items-center bg-white border-3 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif font-extrabold text-base text-[#1f1d1b]">
            台南綠園道共創：空間踏查
          </span>
          <span className="px-2.5 py-0.5 bg-blob-green border-2 border-[#1f1d1b] text-[#1f1d1b] text-[9px] font-bold rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] font-mono">
            GREENWAY ADVENTURE RPG
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowNotebook(prev => !prev)}
            className="btn-flat-action flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs"
          >
            <BookOpen size={14} />
            {showNotebook ? '關閉規劃筆記' : '打開規劃筆記 (📖)'}
          </button>
        </div>
      </div>

      {/* Main Adventure Screen Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden relative min-h-0">
        
        {/* Map Scroll Track Area */}
        <div 
          ref={mapRef}
          className="h-72 w-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth relative shadow-flat-pop shrink-0"
        >
          {/* Scrollable Illustration background */}
          <div className="inline-block min-w-[1400px] w-full h-full relative select-none">
            <img 
              src="/greenway_watercolor.png" 
              alt="Watercolor Greenway Scroll" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
            />
            
            {/* Dark gradient overlay for bottom text spacing */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            {/* Segment dividing lines and labels */}
            {segments.map((seg) => {
              const isCompleted = completedSegments[seg.id];
              return (
                <div 
                  key={seg.id}
                  id={`segment-pin-${seg.id}`}
                  style={{ left: `${seg.left}%` }}
                  className="absolute bottom-6 -translate-x-1/2 flex flex-col items-center justify-end z-10"
                >
                  {/* Segment Tag */}
                  <div className={`px-2.5 py-1 border-2 border-[#1f1d1b] font-serif text-[10px] font-bold shadow-[2px_2px_0px_0px_rgba(31,29,27,1)] transition-all duration-300 rounded ${
                    isCompleted 
                      ? 'bg-blob-green text-[#3e5f4c]' 
                      : 'bg-white text-gray-500'
                  }`}>
                    {seg.name} {isCompleted && '✓'}
                  </div>
                  <span className="text-[8px] font-mono text-white mt-1 opacity-80 bg-[#1f1d1b] px-1 rounded">{seg.sta}</span>
                </div>
              );
            })}

            {/* Render NPC tokens standing in their segments */}
            {segments.map((seg) => {
              const isTalked = completedSegments[seg.id];
              const isTarget = nearNpc?.id === seg.id;
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
                        className={`w-10 h-10 rounded-full border-2 border-[#1f1d1b] overflow-hidden bg-white shadow-soft relative transition-all duration-300 ${
                          isTarget && !isTalked
                            ? 'scale-110 -translate-y-1 ring-3 ring-[var(--color-brand-yellow)] bg-blob-yellow' 
                            : 'opacity-80'
                        }`}
                      >
                        <img src={avatar} alt={npcId} className="w-full h-full object-cover scale-110" />
                        {/* Conversation ready floating dot */}
                        {isTarget && !isTalked && (
                          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[var(--color-brand-yellow)] border border-[#1f1d1b] rounded-full flex items-center justify-center text-[8px] font-bold text-[#1f1d1b] animate-bounce">
                            !
                          </div>
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
                left: `${playerX}%`,
                transition: 'left 0.2s ease-out'
              }}
              className="absolute bottom-20 -translate-x-1/2 flex flex-col items-center z-20"
            >
              {/* Floating state flags */}
              <div className="bg-[var(--color-brand-coral)] border-2 border-[#1f1d1b] text-white text-[8px] font-bold px-2 py-0.5 rounded shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] mb-1 animate-float uppercase tracking-wider">
                您在這裡 / YOU
              </div>
              <div className={`w-12 h-12 rounded-full border-3 border-[#1f1d1b] overflow-hidden bg-[#FFFFFF] shadow-md`}>
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
        <div className="flex-1 bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-2xl p-5 shadow-flat-pop flex flex-col justify-between min-h-0 relative">
          
          {isDialogueOpen ? (
            /* ACTIVE CONVERSATION HUD */
            <div className="flex-1 flex flex-col justify-between min-h-0">
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="flex gap-5 items-start">
                  
                  {/* Speaker Avatar (Left) */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-16 h-16 rounded-full border-3 border-[#1f1d1b] blob-avatar-memphis ${getBlobBgClass(currentDialogue.speakerId)} overflow-hidden flex items-center justify-center`}>
                      <img 
                        src={getRoleAvatar(currentDialogue.speakerId)} 
                        alt={getRoleName(currentDialogue.speakerId)} 
                        className="w-full h-full object-cover scale-115"
                      />
                    </div>
                    <span className="mt-2 text-[10px] font-bold text-[#1f1d1b] bg-white border-2 border-[#1f1d1b] px-2.5 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] select-none">
                      {getRoleName(currentDialogue.speakerId)}
                    </span>
                  </div>

                  {/* Dialogue Bubble Text (Right) */}
                  <div className="flex-1 min-h-[100px] flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 font-sans uppercase mb-1">
                        [ 🗣️ 規劃踏查現場交談中 / CONVERSATION ]
                      </div>
                      
                      <p className="text-[#1f1d1b] text-sm md:text-base leading-relaxed font-serif animate-fade-in font-semibold bg-[#FAF8F5] border-2 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop">
                        「{currentDialogue.text}」
                      </p>
                    </div>

                    {/* Conflict Card display during choices */}
                    {currentDialogue.isChoice && (
                      <div className="mt-4 animate-fade-in-up flex items-center gap-4 bg-blob-yellow/20 border-2 border-[#1f1d1b] p-3 rounded-xl max-w-lg shadow-[2px_2px_0px_0px_#1f1d1b]">
                        <div className="w-14 h-14 rounded-lg overflow-hidden border-2 border-[#1f1d1b] shrink-0">
                          <img 
                            src={activeSegmentIndex === 0 ? '/conflict_privacy.png' : activeSegmentIndex === 1 ? '/conflict_commerce.png' : '/conflict_ecology.png'} 
                            alt="Conflict visual"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-[#b37a3c] block">[ 本路段空間爭執點 ]</span>
                          <p className="text-[11px] text-gray-500 leading-snug">
                            {activeSegmentIndex === 0 ? '住宅密集成區，面臨騎士通勤時效與民房居住隱私的空間拉鋸。' : activeSegmentIndex === 1 ? '繁榮店鋪廊帶，高架自行車天橋可能會完全略過地面的零售人潮。' : '生態綠帶保護區，硬質水泥大廣場與大面積保水林蔭雨水花園的抉擇。'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Action Buttons inside Dialogue */}
              <div className="mt-4 pt-4 border-t-2 border-[#1f1d1b] shrink-0">
                {currentDialogue.isChoice && currentDialogue.choices ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {currentDialogue.choices.map((choice) => (
                      <button
                        key={choice.id}
                        onClick={() => handleChoiceSelect(choice)}
                        className="text-left p-3 border-2 border-[#1f1d1b] hover:border-[var(--color-brand-coral)] hover:bg-[#FAF8F5] bg-white rounded-xl shadow-flat-pop transition-all duration-200 cursor-pointer group flex flex-col justify-between h-full"
                      >
                        <div className="flex items-start mb-2">
                          <div className="w-6 h-6 rounded-full bg-gray-150 border-2 border-[#1f1d1b] text-gray-700 group-hover:bg-[var(--color-brand-coral)] group-hover:text-white flex items-center justify-center font-bold text-[10px] mr-2 shrink-0 transition-colors font-mono">
                            {choice.id.replace(/[0-9]/g, '').toUpperCase()}
                          </div>
                          <span className="text-xs text-[#1f1d1b] font-bold leading-normal">
                            {choice.text}
                          </span>
                        </div>
                        
                        {/* Option impacts */}
                        <div className="flex gap-1 flex-wrap mt-1 border-t border-dashed border-gray-200 pt-1 text-[8px] font-bold">
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
                    className="btn-flat-action w-full py-3 rounded-xl text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-flat-pop"
                  >
                    {currentDialogue.buttonText || '繼續對話'}
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* KEYBOARD WALKING / CONTROLLER HUD */
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Instructions Board */}
              <div className="bg-[#FAF8F5] border-2 border-[#1f1d1b] p-4 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles size={14} className="text-[var(--color-brand-yellow)]" />
                  <span className="text-xs font-bold text-[#1f1d1b] font-serif">[ 🎮 空間踏查操作說明 / CONTROLLER ]</span>
                </div>
                <div className="text-xs text-[#5c554e] leading-relaxed space-y-2 font-sans">
                  <p>
                    1. **移動角色**：按下鍵盤的 <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-bold shadow-xs">←</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-bold shadow-xs">→</kbd> 鍵，或 <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-bold shadow-xs">A</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded font-bold shadow-xs">D</kbd> 鍵，在頂部的畫卷地圖上自由行走。
                  </p>
                  <p>
                    2. **發起協商**：當走近 NPC 市民代表時，上方會浮現黃色對話泡，按下鍵盤的 <kbd className="px-5 py-0.5 bg-white border border-gray-300 rounded font-bold shadow-xs">空白鍵 (SPACE)</kbd> 或點擊對話提示即可開啟交談！
                  </p>
                  <p>
                    3. **完成提交**：完成沿途所有市民路段的協商規劃後，請一路往右行走到最右側終點（95% 以上處），按下 <kbd className="px-5 py-0.5 bg-white border border-gray-300 rounded font-bold shadow-xs">空白鍵 (SPACE)</kbd> 送審共創成果！
                  </p>
                </div>
              </div>

              {/* Game Controller Buttons (For touchscreen/mouse play) */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                
                {/* On-screen movement buttons */}
                <div className="flex gap-3">
                  <button 
                    onClick={handleMoveLeft}
                    className="btn-flat-action px-5 py-3 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> ◀ 向左移動 (A)
                  </button>
                  <button 
                    onClick={handleMoveRight}
                    className="btn-flat-action px-5 py-3 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    向右移動 (D) ▶ <ArrowRight size={14} />
                  </button>
                </div>

                {/* Status bubble */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {nearNpc ? (
                    completedSegments[nearNpc.id] ? (
                      <span className="px-4 py-2 border-2 border-[#1f1d1b] bg-blob-green text-xs font-bold rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#3e5f4c] text-center w-full">
                        本段踏查完工 ✓
                      </span>
                    ) : canTalkToNpc(nearNpc.id) ? (
                      <button 
                        onClick={handleStartTalk}
                        className="btn-flat-action w-full sm:w-auto px-6 py-3 bg-[var(--color-brand-yellow)] hover:bg-[#f7d67b] text-[#1f1d1b] text-xs flex items-center justify-center gap-1.5 animate-bounce shadow-flat-pop"
                      >
                        <MessageSquare size={14} /> 按空白鍵交談 (SPACE)
                      </button>
                    ) : (
                      <span className="px-4 py-2 border-2 border-[#1f1d1b] bg-blob-pink text-xs font-bold rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#c26257] text-center w-full">
                        ⚠️ 請先完成前段協商
                      </span>
                    )
                  ) : playerX >= 94 ? (
                    allCompleted ? (
                      <button 
                        onClick={onComplete}
                        className="btn-flat-action w-full sm:w-auto px-6 py-3 bg-[var(--color-brand-coral)] hover:bg-[#c06a5f] text-white text-xs flex items-center justify-center gap-1.5 animate-pulse shadow-flat-pop"
                      >
                        🏆 送交共創規劃審查 (SPACE)
                      </button>
                    ) : (
                      <span className="px-4 py-2 border-2 border-[#1f1d1b] bg-blob-pink text-xs font-bold rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#c26257] text-center w-full">
                        ⚠️ 尚未完成沿途踏查
                      </span>
                    )
                  ) : (
                    <span className="px-5 py-2.5 border-2 border-[#1f1d1b] bg-gray-50 text-xs font-semibold text-gray-500 rounded-xl text-center w-full">
                      🔍 左右移動以尋找市民協商...
                    </span>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Floating COLLAPSIBLE PLANNING NOTEBOOK PANEL */}
        {showNotebook && (
          <div className="absolute inset-y-0 right-0 w-80 bg-transparent flex justify-end z-35 animate-fade-in">
            <div className="absolute inset-0 bg-transparent" onClick={() => setShowNotebook(false)} />
            
            <div className="w-72 bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-l-2xl p-5 shadow-flat-pop-lg h-full flex flex-col justify-between relative">
              <button onClick={() => setShowNotebook(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X size={18} />
              </button>

              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1f1d1b] pb-3 shrink-0">
                  <Activity size={15} className="text-[var(--color-brand-blue)]" />
                  <h3 className="text-xs font-bold text-[#1f1d1b] font-serif">綠園道規劃手札</h3>
                </div>

                {/* Indicator metrics progress bars */}
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
                            <span className="font-bold text-[#1f1d1b]">{indicator.value}</span>
                            {change > 0 && <span className="text-[9px] font-bold text-green-600 px-1 bg-green-50 border border-green-100 rounded">+{change}</span>}
                            {change < 0 && <span className="text-[9px] font-bold text-rose-500 px-1 bg-rose-50 border border-rose-100 rounded">{change}</span>}
                          </div>
                        </div>
                        <div className="memphis-progress-track h-2.5 w-full bg-gray-150">
                          <div className={`memphis-progress-fill h-full ${indicator.color}`} style={{ width: `${Math.max(0, Math.min(100, indicator.value))}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer footer status */}
              <div className="mt-4 pt-3 border-t-2 border-[#1f1d1b] shrink-0 font-sans text-[10px] text-gray-500">
                <div className="flex justify-between items-center mb-1">
                  <span>我的協商身分：</span>
                  <span className="font-bold text-[#1f1d1b] font-serif">{playerRole.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>規劃核心傾向：</span>
                  <span className="px-2 py-0.5 rounded bg-blob-green border-2 border-[#1f1d1b] text-[#3e5f4c] font-bold">
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
