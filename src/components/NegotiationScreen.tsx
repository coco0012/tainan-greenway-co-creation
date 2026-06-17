import React, { useState } from 'react';
import { Choice, Round, Effect } from '@/data/missionData';
import { StakeholderRole, roles } from '@/data/roles';
import { Sparkles, ChevronRight, CheckCircle, Info, BarChart2 } from 'lucide-react';

interface NegotiationScreenProps {
  playerRole: StakeholderRole;
  rounds: Round[];
  onChoiceMade: (choice: Choice) => void;
  onNegotiationComplete: () => void;
  collectedInsights: string[];
}

export const NegotiationScreen: React.FC<NegotiationScreenProps> = ({
  playerRole,
  rounds,
  onChoiceMade,
  onNegotiationComplete,
  collectedInsights
}) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [step, setStep] = useState(0); // 0: Intro, 1: Choice Selection, 2: Player proposal, 3: Resident feedback, 4: Commuter/Elderly feedback, 5: Environmentalist feedback, 6: Gov feedback
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  // Track choices made locally during negotiation to show live score changes
  const [roundChoices, setRoundChoices] = useState<Record<number, Choice>>({});

  const currentRound = rounds[roundIdx];
  const choiceId = selectedChoice?.id || '';

  const getRoleAvatar = (id: string) => {
    switch (id) {
      case 'resident': return '/avatar_resident.png';
      case 'shop_owner': return '/avatar_shopowner.png';
      case 'commuter': return '/avatar_commuter.png';
      case 'elderly': return '/avatar_elderly.png';
      case 'environmentalist': return '/avatar_environmentalist.png';
      case 'government': return '/avatar_government.png';
      default: return '/avatar_resident.png';
    }
  };

  const getRoleName = (id: string) => {
    const r = roles.find(item => item.id === id);
    return r ? r.name : '市民代表';
  };

  const getBlobBgClass = (id: string) => {
    switch (id) {
      case 'resident': return 'bg-blob-pink';
      case 'shop_owner': return 'bg-blob-yellow';
      case 'commuter': return 'bg-blob-blue';
      case 'elderly': return 'bg-blob-pink';
      case 'environmentalist': return 'bg-blob-green';
      case 'government': return 'bg-gray-200';
      default: return 'bg-gray-150';
    }
  };

  // Determine who is actively speaking in the round based on current step
  const getActiveSpeakerId = (): string => {
    if (step === 0) {
      if (roundIdx === 0) return 'resident';
      if (roundIdx === 1) return 'shop_owner';
      return 'environmentalist';
    }
    if (step === 2) return playerRole.id;
    if (step === 3) return roundIdx === 0 ? 'resident' : roundIdx === 1 ? 'shop_owner' : 'environmentalist';
    if (step === 4) return roundIdx === 0 ? 'commuter' : roundIdx === 1 ? 'elderly' : 'elderly';
    if (step === 5) return 'environmentalist';
    if (step === 6) return 'government';
    return '';
  };

  const activeSpeakerId = getActiveSpeakerId();

  // Dynamic live score calculator based on choices made in the roundtable
  const calculateLiveScores = (): Effect => {
    const live = { residential: 50, commercial: 50, mobility: 50, ecological: 50, cultural: 50 };
    Object.values(roundChoices).forEach(c => {
      live.residential += c.effects.residential || 0;
      live.commercial += c.effects.commercial || 0;
      live.mobility += c.effects.mobility || 0;
      live.ecological += c.effects.ecological || 0;
      live.cultural += c.effects.cultural || 0;
    });
    // clamp
    live.residential = Math.max(0, Math.min(100, live.residential));
    live.commercial = Math.max(0, Math.min(100, live.commercial));
    live.mobility = Math.max(0, Math.min(100, live.mobility));
    live.ecological = Math.max(0, Math.min(100, live.ecological));
    live.cultural = Math.max(0, Math.min(100, live.cultural));
    return live;
  };

  const liveScores = calculateLiveScores();

  // Roundtable dialog text mapping
  const getDialogue = (): { speakerId: string; text: string; buttonText: string } => {
    const isPlayer = activeSpeakerId === playerRole.id;

    if (roundIdx === 0) {
      switch (step) {
        case 0:
          return {
            speakerId: 'resident',
            text: '我們住宅段緊鄰許多老舊透天厝。自行車高架橋如果蓋得太高、太靠近我們的二樓陽台，居民每天的隱私和安寧都會受到嚴重干擾，生活變得很不自在。',
            buttonText: '我瞭解了，讓我們評估空間配置提案。'
          };
        case 2:
          return {
            speakerId: 'player',
            text: `作為市民代表，我提案採用這項策略：『${selectedChoice?.text}』。`,
            buttonText: '聆聽住宅代表阿明的反饋'
          };
        case 3:
          return {
            speakerId: 'resident',
            text: choiceId === '1a' 
              ? '（皺眉）這太令人失望了，隱私跟陽台前的壓迫感完全沒有被改善，每天都覺得有人在看我，真的很難過。' 
              : choiceId === '1b' 
                ? '（微笑）太感謝了！自行車道降至地面層，我們拉開了安全距離，陽台看出去舒服多了。' 
                : '（無奈）高架橋仍然立在陽台前，但有了厚實的綠化遮簾和防隱私板，比完全沒遮蔽好一些。',
            buttonText: '聆聽通勤族小宇的看法'
          };
        case 4:
          return {
            speakerId: 'commuter',
            text: choiceId === '1a' 
              ? '（點點頭）這樣規劃很棒！通勤動線最流暢，能保證最高速度，騎行起來最暢快，非常適合上班騎車。' 
              : choiceId === '1b' 
                ? '（嘆氣）降至地面層意味著騎士在住宅區要停等更多小巷的紅綠燈，通勤效率與速度會下降很多。' 
                : '高架天橋的連續性被保留了，但裝了隔音板後視野變得比較狹窄，在天橋上騎車要放慢速度。',
            buttonText: '聆聽環保代表綠野老師的看法'
          };
        case 5:
          return {
            speakerId: 'environmentalist',
            text: choiceId === '1a' 
              ? '龐大的混凝土高架結構遮蔽了大半天光，對地面的綠化與植栽生長非常不利，綠廊感覺像被攔腰斬斷。' 
              : choiceId === '1b' 
                ? '高架水泥結構減少了，對地面的綠化與植栽生長是好事，視野也更開闊，利於生態帶的連續。' 
                : '綠化遮簾可以稍微提供一些垂直綠化，但無法完全彌補大型高架結構對生態氣候的阻擋。',
            buttonText: '聆聽市府林科長的評估'
          };
        case 6:
          return {
            speakerId: 'government',
            text: choiceId === '1a' 
              ? '維持高架可減少平面的人車衝突，不過市府後續需要增加隔音防隱私隔板的預算。' 
              : choiceId === '1b' 
                ? '降至地面會增加與橫向社區巷道的交叉衝突點，市府需在路口加強安全標誌與照明導引。' 
                : '這是一個兼顧通勤效率與隱私保護的折衷方案，雖然綠化維護與保養費用會微幅上升。',
            buttonText: '【結束第一輪協商】進入下一輪會議'
          };
        default:
          return { speakerId: 'player', text: '', buttonText: '' };
      }
    } else if (roundIdx === 1) {
      switch (step) {
        case 0:
          return {
            speakerId: 'shop_owner',
            text: '我們商業段沿線店家林立。如果只讓自行車快速度從二樓高架橋飛越過去，地面的店鋪完全看不到人潮，對店家的生存打擊太大了。',
            buttonText: '我瞭解了，讓我們評估商業街區提案。'
          };
        case 2:
          return {
            speakerId: 'player',
            text: `作為市民代表，我提案採用這項策略：『${selectedChoice?.text}』。`,
            buttonText: '聆聽沿街商家莉雅的反饋'
          };
        case 3:
          return {
            speakerId: 'shop_owner',
            text: choiceId === '2a' 
              ? '（反對）這太糟糕了！自行車騎士全都從二樓高度飄過去，我們地面的小吃、飲料店完全吃不到客源！' 
              : choiceId === '2b' 
                ? '（高興）太棒了！自行車降至地面，騎士很容易停下來買杯飲料或進店逛逛，這對店家是好消息！' 
                : '（十分滿意）這是我最推崇的！共享街區和停靠點能吸引騎士和行人駐足停留，商業與休閒融為一體！',
            buttonText: '聆聽高齡長者陳伯伯的想法'
          };
        case 4:
          return {
            speakerId: 'elderly',
            text: choiceId === '2a' 
              ? '抬頭只看到冰冷的水泥橋，地面層光線陰暗且缺乏商業活力，走起來不舒服，也不敢走在那下面。' 
              : choiceId === '2b' 
                ? '地面人行道變寬且有了人氣，散步累了還可以到咖啡店坐坐，比起陰暗的高架底層好多了。' 
                : '（高興）有充足的樹蔭和路邊停靠長椅可以坐著乘涼，感覺很有人情味與休閒感，最適合老人家。',
            buttonText: '聆聽通勤族小宇的意見'
          };
        case 5:
          return {
            speakerId: 'commuter',
            text: choiceId === '2a' 
              ? '在高架橋上通過商業區最安全，不會遇到隨意違停的汽機車或橫穿馬路的行人，速度最快。' 
              : choiceId === '2b' 
                ? '降至地面必須隨時提防店門口的人流和違停車輛，速度會變得很慢，而且安全性也變低。' 
                : '雖然是慢速共享，但對休閒騎行很棒。通勤族可能需要繞道，不過整體很有街區活力。',
            buttonText: '聆聽市府林科長的評估'
          };
        case 6:
          return {
            speakerId: 'government',
            text: choiceId === '2a' 
              ? '這樣規劃保護了自行車流，但對鐵路地下化後的地面商業復甦幾乎沒有正面效益，不利於縫合。' 
              : choiceId === '2b' 
                ? '自行車與商業人流混雜在地面層，市府必須劃設明確的步行區與自行車慢速道，避免人車擦撞。' 
                : '低速共享街區能降低交通事故，又能提供大面積遮蔭綠帶，是一個多方共贏的空間策略。',
            buttonText: '【結束第二輪協商】進入下一輪會議'
          };
        default:
          return { speakerId: 'player', text: '', buttonText: '' };
      }
    } else {
      switch (step) {
        case 0:
          return {
            speakerId: 'environmentalist',
            text: '這段是我們綠園道的生態核心。台南夏天極度炎熱，鋪面設計如果過度水泥硬質化，會造成嚴重的熱島效應。我們需要高透水率和複層林蔭綠化！',
            buttonText: '我同意，讓我們評估生態廊道提案。'
          };
        case 2:
          return {
            speakerId: 'player',
            text: `作為市民代表，我提案採用這項策略：『${selectedChoice?.text}』。`,
            buttonText: '聆聽環保志工綠野老師的反饋'
          };
        case 3:
          return {
            speakerId: 'environmentalist',
            text: choiceId === '3a' 
              ? '（憤怒）這完全背離了生態綠園道的初衷！大面積硬質鋪面會加劇台南夏天的都市熱島效應，破壞棲地！' 
              : choiceId === '3b' 
                ? '（讚成）太棒了！連續的林蔭與雨水花園，能保水透水，還給台南市區一個會呼吸的森林綠帶！' 
                : '（妥協）這是一個可接受的平衡。只要綠帶段的連續性與透水率有受到嚴格監管即可。',
            buttonText: '聆聽高齡長者陳伯伯的想法'
          };
        case 4:
          return {
            speakerId: 'elderly',
            text: choiceId === '3a' 
              ? '（嘆氣）大太陽下全是熱烘烘的硬鋪面，沒有樹蔭，我們老人家根本不敢來這裡散步。' 
              : choiceId === '3b' 
                ? '（開心）走在樹蔭下非常涼爽，雨水花園也很漂亮，感覺像是一座真正的生態公園。' 
                : '有廣場有公園，走累了有地方歇腳，這樣設計很均衡。',
            buttonText: '聆聽通勤族小宇的看法'
          };
        case 5:
          return {
            speakerId: 'commuter',
            text: choiceId === '3a' 
              ? '路面平坦好騎，但缺乏大樹遮蔭，騎在上面像在煎鍋上，非常痛苦。' 
              : choiceId === '3b' 
                ? '綠化很多確實舒服，但要注意落葉和雨天過後的路面濕滑與排水維護問題。' 
                : '既有活動廣場又保有舒適綠意，對吸引人潮與休閒很有幫助。',
            buttonText: '聆聽市府林科長的評估'
          };
        case 6:
          return {
            speakerId: 'government',
            text: choiceId === '3a' 
              ? '硬質鋪面的維護成本較低，但確實對都市生態和防汛排水有負面衝擊，需要再斟酌。' 
              : choiceId === '3b' 
                ? '生態指標獲得最大提升，但市府需要投入較高的植栽養護與雨水花園疏濬預算。' 
                : '（滿意）這是非常務實的方案。在車站節點提供硬鋪面供市集活動使用，其餘路段保留大面積生態綠帶。',
            buttonText: '【結束所有協商會議】前往空間策略修訂工作台 ➔'
          };
        default:
          return { speakerId: 'player', text: '', buttonText: '' };
      }
    }
  };

  const currentDialogue = getDialogue();

  const handleNext = () => {
    if (step === 0) {
      setStep(1); // Show choices selection
    } else if (step >= 2 && step < 6) {
      setStep(prev => prev + 1); // Step through NPC dialogue reactions
    } else if (step === 6) {
      if (roundIdx < 2) {
        setRoundIdx(prev => prev + 1);
        setStep(0);
        setSelectedChoice(null);
      } else {
        onNegotiationComplete();
      }
    }
  };

  const handleChoiceSelect = (choice: Choice) => {
    setSelectedChoice(choice);
    onChoiceMade(choice);
    setRoundChoices(prev => ({
      ...prev,
      [roundIdx]: choice
    }));
    setStep(2);
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

  const parsedInsights = collectedInsights.map(insight => {
    const parts = insight.split('的觀點：');
    return {
      title: parts[0] || '公民觀點卡',
      text: parts[1] || insight
    };
  });

  return (
    <div className="flex-1 flex flex-col p-0 bg-[var(--color-bg-warm)] h-full overflow-hidden justify-center items-center">
      <div className="w-full h-full bg-[#FFFFFF] border-3 border-[#1f1d1b] rounded-xl p-5 shadow-flat-pop-lg flex flex-col justify-between overflow-hidden text-left relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-3 border-b-3 border-[#1f1d1b] pb-2.5 shrink-0">
          <span className="px-3 py-1 bg-blob-pink border-2 border-[#1f1d1b] text-[#1f1d1b] text-[10px] font-bold rounded shadow-[1.5px_1.5px_0px_0px_#1f1d1b] font-mono uppercase tracking-wider">
            【 PHASE 6 : 市民代表圓桌協商會議 】
          </span>
          <span className="text-xs font-mono font-bold text-gray-400">協商議題：{roundIdx + 1} / 3</span>
        </div>

        {/* Subtitle / Topic card */}
        <div className="shrink-0 mb-3 bg-gray-50 border-2 border-[#1f1d1b] p-3 rounded-xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xs md:text-sm font-extrabold text-[#1f1d1b] font-serif mb-1 flex items-center gap-1.5">
            <Sparkles className="text-[var(--color-brand-yellow)] w-4 h-4" />
            第 {roundIdx + 1} 輪議題：{currentRound.title}
          </h2>
          <p className="text-[11px] text-gray-600 font-sans leading-normal font-semibold">
            📌 討論焦點：{currentRound.question}
          </p>
        </div>

        {/* Main Roundtable Workspace */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden mb-2">
          
          {/* Left Column: Roundtable board + Dialogue Box */}
          <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
            
            {/* Roundtable board */}
            <div className="bg-[#FAF8F5] border-3 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop relative min-h-[170px] flex items-center justify-center shrink-0 mb-4 bg-[radial-gradient(rgba(31,29,27,0.04)_1px,transparent_1px)] bg-[size:15px_15px]">
              
              {/* Center table */}
              <div className="w-64 h-28 rounded-full border-4 border-[#1f1d1b] bg-[#e8e5db] shadow-[inset:3px_3px_0px_rgba(0,0,0,0.08)] flex items-center justify-center relative select-none">
                <span className="text-[#1f1d1b] font-serif font-black text-[9px] uppercase tracking-widest opacity-25">
                  臺南市民協商圓桌
                </span>
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#1f1d1b]/20 flex items-center justify-center" />
              </div>

              {/* Avatars surrounding the table */}
              {[
                { id: 'resident', name: '周邊居民 阿明', style: { left: '8%', top: '15%' } },
                { id: 'shop_owner', name: '在地店家 莉雅', style: { left: '8%', top: '60%' } },
                { id: 'commuter', name: '通勤/騎士 小宇', style: { right: '8%', top: '60%' } },
                { id: 'elderly', name: '高齡代表 陳伯伯', style: { right: '8%', top: '15%' } },
                { id: 'environmentalist', name: '環保代表 綠野', style: { left: '50%', top: '3%', transform: 'translateX(-50%)' } },
                { id: 'government', name: '市府代表 林科長', style: { left: '50%', top: '75%', transform: 'translateX(-50%)' } }
              ].map(member => {
                const isActive = activeSpeakerId === member.id;
                const isPlayer = playerRole.id === member.id;
                
                return (
                  <div 
                    key={member.id}
                    style={member.style}
                    className="absolute flex flex-col items-center transition-all duration-200 z-10"
                  >
                    <div className={`w-11 h-11 rounded-full border-2 border-[#1f1d1b] overflow-hidden flex items-center justify-center ${getBlobBgClass(member.id)} shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${
                      isActive 
                        ? 'scale-115 ring-3 ring-[var(--color-brand-coral)] border-[var(--color-brand-coral)] animate-pulse z-20' 
                        : 'opacity-75'
                    }`}>
                      <img src={getRoleAvatar(member.id)} alt={member.id} className="w-full h-full object-cover scale-110" />
                    </div>
                    <span className={`mt-1 text-[7.5px] px-1.5 py-0.2 rounded border font-bold ${
                      isActive 
                        ? 'bg-[var(--color-brand-coral)] text-white border-[#1f1d1b]' 
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}>
                      {member.name.split(' ')[1]} {isPlayer && '(您)'}
                    </span>
                  </div>
                );
              })}

            </div>

            {/* Conversation box */}
            <div className="flex-1 bg-white border-3 border-[#1f1d1b] p-4 rounded-xl shadow-flat-pop flex flex-col justify-between min-h-[150px] relative">
              {step !== 1 ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="overflow-y-auto flex-1 pr-1">
                    <div className="flex gap-3 items-center">
                      <div className={`w-11 h-11 rounded-full border-2 border-[#1f1d1b] overflow-hidden shrink-0 ${getBlobBgClass(activeSpeakerId)} shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]`}>
                        <img src={getRoleAvatar(activeSpeakerId)} alt={activeSpeakerId} className="w-full h-full object-cover scale-110" />
                      </div>
                      <div className="text-left">
                        <span className="text-[8px] font-mono font-bold text-gray-400 block uppercase">[ ACTIVE SPEAKER ]</span>
                        <h4 className="text-xs font-bold text-[#1f1d1b]">{getRoleName(activeSpeakerId)} {activeSpeakerId === playerRole.id && '(主角玩家)'}</h4>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-xs md:text-sm text-gray-700 leading-relaxed font-serif font-semibold bg-gray-50 border border-gray-200 p-3 rounded-lg">
                      {currentDialogue.text}
                    </p>
                  </div>

                  <button 
                    onClick={handleNext}
                    className="btn-flat-action w-full mt-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 font-bold shadow-flat-pop cursor-pointer"
                  >
                    {currentDialogue.buttonText}
                    <ChevronRight size={14} />
                  </button>
                </div>
              ) : (
                /* Choice Selection options cards */
                <div className="flex-1 flex flex-col justify-between text-left">
                  <div>
                    <span className="text-[8.5px] font-mono font-bold text-gray-400 block mb-2">[ 🗳️ 請代表您的市民立場，提交共創規劃提案 ]</span>
                    <div className="grid grid-cols-1 gap-2">
                      {currentRound.choices.map(choice => (
                        <button
                          key={choice.id}
                          onClick={() => handleChoiceSelect(choice)}
                          className="p-3 border-2 border-[#1f1d1b] hover:border-[var(--color-brand-coral)] hover:bg-[#FAF8F5] bg-white rounded-lg shadow-[2px_2px_0px_0px_#1f1d1b] transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div className="flex items-start">
                            <span className="w-4 h-4 rounded-full bg-gray-100 border border-[#1f1d1b] text-gray-700 flex items-center justify-center font-bold text-[8.5px] mr-2 shrink-0 font-mono">
                              {choice.id.slice(-1).toUpperCase()}
                            </span>
                            <span className="text-xs text-[#1f1d1b] font-bold leading-normal">{choice.text}</span>
                          </div>
                          
                          {/* Option impact values */}
                          <div className="flex gap-1.5 flex-wrap mt-1.5 border-t border-dashed border-gray-200 pt-1 text-[8px] font-bold">
                            {Object.entries(choice.effects).map(([key, val]) => {
                              if (val === 0) return null;
                              return (
                                <span key={key} className={`px-1.5 py-0.2 rounded border ${getMetricColor(key)}`}>
                                  {getMetricLabel(key)}: {val > 0 ? '+' : ''}{val}
                                </span>
                              );
                            })}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Dynamic indicator levels + Collected Evidence Cards */}
          <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0 overflow-y-auto max-h-48 lg:max-h-none text-left">
            
            {/* Live indicators block */}
            <div className="bg-gray-50 border-3 border-[#1f1d1b] p-3 rounded-xl shadow-flat-pop">
              <span className="text-[9.5px] font-bold text-[#1f1d1b] font-serif block mb-2 flex items-center gap-1">
                <BarChart2 size={12} className="text-blue-500" />
                [ 協商即時指標 / LIVE METRICS ]
              </span>
              <div className="space-y-1.5">
                {Object.entries(liveScores).map(([key, val]) => {
                  let barColor = 'bg-gray-400';
                  let labelZh = key;
                  if (key === 'residential') { barColor = 'bg-[#d37b70]'; labelZh = '居住'; }
                  else if (key === 'commercial') { barColor = 'bg-[#e2a968]'; labelZh = '商業'; }
                  else if (key === 'mobility') { barColor = 'bg-[#6b8b9b]'; labelZh = '交通'; }
                  else if (key === 'ecological') { barColor = 'bg-[#5a7a68]'; labelZh = '生態'; }
                  else if (key === 'cultural') { barColor = 'bg-stone-400'; labelZh = '歷史'; }

                  return (
                    <div key={key} className="text-[9px] font-sans">
                      <div className="flex justify-between items-center font-bold mb-0.5">
                        <span className="text-gray-700">{labelZh}</span>
                        <span className="font-mono text-gray-500">{val}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white border border-[#1f1d1b] rounded-sm overflow-hidden">
                        <div className={`h-full ${barColor}`} style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collected Insight Cards as Evidence */}
            <div className="bg-gray-50 border-3 border-[#1f1d1b] p-3 rounded-xl shadow-flat-pop flex-1 overflow-y-auto">
              <span className="text-[9.5px] font-bold text-[#1f1d1b] font-serif block mb-2 border-b border-gray-200 pb-1">
                [ 💡 卡包攜入證據 / EVIDENCE DECK ]
              </span>
              
              <div className="space-y-2">
                {parsedInsights.map((card, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-[#1f1d1b] p-2 rounded-lg shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
                  >
                    <span className="px-1.5 py-0.2 bg-[#deebf7] text-[#4a6b82] text-[7.5px] font-bold rounded border border-[#6b8b9b]">
                      {card.title}
                    </span>
                    <p className="mt-1 text-[9px] leading-relaxed text-gray-600 font-medium font-sans">
                      &quot;{card.text}&quot;
                    </p>
                  </div>
                ))}
                {parsedInsights.length === 0 && (
                  <div className="text-gray-400 italic text-[9.5px] p-4 text-center border border-dashed border-gray-300 rounded-lg">
                    未收集到觀點卡。
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
