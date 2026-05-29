export type RoleId = 'resident' | 'shop_owner' | 'commuter' | 'elderly' | 'environmentalist' | 'government';

export interface StakeholderRole {
  id: RoleId;
  name: string;
  coreValues: string;
  mainConcerns: string;
  quote: string;
}

export const roles: StakeholderRole[] = [
  {
    id: 'resident',
    name: '居民',
    coreValues: '隱私保護、安寧生活、鄰里記憶',
    mainConcerns: '高架自行車道避開二樓陽台、夜間活動噪音限制、視覺干擾防制',
    quote: '「如果高架自行車道離二樓陽台太近，每天都像被路人看進家裡，生活會很不自在。」',
  },
  {
    id: 'shop_owner',
    name: '在地店家',
    coreValues: '商業人流、物流裝卸通道、店面能見度',
    mainConcerns: '施工衝擊減輕、避免人流直接過境、停車位保留、暫停空間規劃',
    quote: '「如果騎士都從高架上通過，我們地面層的麵店、飲料店、土魠魚羹店就吃不到人流。」',
  },
  {
    id: 'commuter',
    name: '通勤與自行車族',
    coreValues: '通勤時效、騎行安全、路徑連續性、轉乘便利性',
    mainConcerns: '危險路口立體化、避免騎行路線中斷、人車分道設計',
    quote: '「我支持安全又連續的路線，但如果每一段都要上下坡，騎起來也會很累。」',
  },
  {
    id: 'elderly',
    name: '高齡步行者',
    coreValues: '遮陰綠蔭、無障礙通道、足夠座椅、慢速步行舒適度',
    mainConcerns: '夏季曝曬防護、避免過陡斜坡、避免與機車混行、缺乏休息節點',
    quote: '「下午四點後我才想出門散步，如果沒有樹蔭、椅子跟平緩的路，我根本不會用。」',
  },
  {
    id: 'environmentalist',
    name: '環保團體',
    coreValues: '生態廊道建構、都市減碳降溫、基地透水率、生物多樣性',
    mainConcerns: '過度水泥化、綠帶破碎化、風道被阻擋、缺乏保水設計',
    quote: '「綠園道不應該只是鋪面和設施，應該成為台南夏天的降溫廊道。」',
  },
  {
    id: 'government',
    name: '市府與景觀設計師',
    coreValues: '都市縫合、公共空間品質、防災滯洪、財政預算可行性',
    mainConcerns: '後續維護管理經費、施工期程、公眾意見整合、交通網絡銜接',
    quote: '「我們需要一個分段處理的方案，讓交通、安全、維護與地方生活都能被兼顧。」',
  },
];
