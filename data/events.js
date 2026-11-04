// 编年事件。lon/lat 可为 null（无单一地点，仅出现在时间轴与年表）。
// stage: 1=加勒比私掠期, 2=印度洋海盗环航期, 3=加勒比复兴期, 4=终结期。
window.EVENTS = [
  {
    id: "1655-jamaica", year: 1655, yearLabel: "1655", stage: 1,
    lon: -76.79, lat: 17.94,
    titleZh: "英国夺取牙买加", titleEn: "English capture of Jamaica",
    desc: "克伦威尔「西方计划」期间英军攻占牙买加，罗亚尔港随之成为海盗与私掠者的补给、销赃中心。",
    significance: "为加勒比海盗提供了英国治下的长期据点，直接奠定海盗时代的舞台。",
    sources: ["Lane 1998", "Earle 2003"], figures: []
  },
  {
    id: "1668-portobelo", year: 1668, yearLabel: "1668", stage: 1,
    lon: -79.65, lat: 9.55,
    titleZh: "摩根劫掠波托贝洛", titleEn: "Morgan sacks Portobelo",
    desc: "摩根率众攻陷并劫掠西班牙白银集市港波托贝洛。",
    significance: "展示私掠时代对西班牙帝国的常态化攻击及其规模。",
    sources: ["Earle 2003", "Cordingly 1995"], figures: ["morgan"]
  },
  {
    id: "1670-madrid", year: 1670, yearLabel: "1670", stage: 1,
    lon: -3.70, lat: 40.42,
    titleZh: "《马德里条约》", titleEn: "Treaty of Madrid",
    desc: "英西和解，英国承认西班牙对美洲的主权并限制对西私掠。",
    significance: "大量持牌私掠者失业，部分转为无照海盗——「由私掠转海盗」的关键节点。",
    sources: ["Lane 1998"], figures: []
  },
  {
    id: "1671-panama", year: 1671, yearLabel: "1671", stage: 1,
    lon: -79.53, lat: 8.98,
    titleZh: "摩根火烧巴拿马城", titleEn: "Morgan burns Panamá",
    desc: "摩根率队越巴拿马地峡，攻占并焚毁巴拿马城。",
    significance: "海盗对西班牙帝国最大胆的陆上远征；事后摩根被捕受审，标志加勒比海盗高潮的转折。",
    sources: ["Earle 2003"], figures: ["morgan"]
  },
  {
    id: "1692-earthquake", year: 1692, yearLabel: "1692", stage: 1,
    lon: -76.79, lat: 17.94,
    titleZh: "罗亚尔港地震", titleEn: "Port Royal earthquake",
    desc: "6 月 7 日大地震与海啸使罗亚尔港大片沉入海中。",
    significance: "加勒比海盗的传统中心被摧毁，客观上促使海盗转向别处寻找据点。",
    sources: ["Cordingly 1995"], figures: []
  },
  {
    id: "1692-tew", year: 1692, yearLabel: "1692", stage: 2,
    lon: -64.80, lat: 32.30,
    titleZh: "托马斯·图首航印度洋", titleEn: "Thomas Tew's first Pirate Round",
    desc: "图自百慕大出发绕好望角入红海，劫掠一艘莫卧儿商船后返航，获利丰厚。",
    significance: "开启「海盗环航」，把海盗活动的重心引向印度洋。",
    sources: ["Johnson 1724", "Rogoziński 2000"], figures: ["tew"]
  },
  {
    id: "1695-ganjisawai", year: 1695, yearLabel: "1695", stage: 2,
    lon: 68.0, lat: 19.0,
    titleZh: "埃弗里俘获「冈斯韦号」", titleEn: "Every captures the Ganj-i-Sawai",
    desc: "9 月，埃弗里的「幻想号」在印度洋俘获莫卧儿朝圣船队旗舰「冈斯韦号」，其价值被当时视为史上最丰厚的战利品（具体数额记载差异极大）。",
    significance: "印度洋财富的轰动性证明，吸引大批海盗东来；莫卧儿皇帝施压英国东印度公司，促使国家反海盗升级。",
    sources: ["Johnson 1724", "Rogoziński 2000", "Earle 2003"], figures: ["every", "aurangzeb"]
  },
  {
    id: "1696-kidd", year: 1696, yearLabel: "1696", stage: 2,
    lon: -0.10, lat: 51.50,
    titleZh: "基德受命缉盗", titleEn: "Kidd's commission",
    desc: "基德受英王特许与纽约商人资助，出海缉捕海盗；其船队后自身卷入海盗行为。",
    significance: "国家以「以盗制盗」方式介入印度洋，反而凸显该海域秩序的真空。",
    sources: ["Ritchie 1986", "Zacks 2002"], figures: ["kidd"]
  },
  {
    id: "1697-ryswick", year: 1697, yearLabel: "1697", stage: 2,
    lon: 4.30, lat: 52.08,
    titleZh: "《里斯维克条约》", titleEn: "Treaty of Ryswick",
    desc: "结束九年战争（大同盟战争），欧洲各海军国家大规模裁撤海军与私掠船。",
    significance: "数万海员失业，成为海盗人力供给的源头，助推海盗环航的扩大。",
    sources: ["Rediker 1987", "Earle 2003"], figures: []
  },
  {
    id: "1701-kidd", year: 1701, yearLabel: "1701", stage: 2,
    lon: -0.04, lat: 51.50,
    titleZh: "基德被绞死", titleEn: "Kidd executed",
    desc: "基德在伦敦被判海盗罪与谋杀罪，5 月在绞刑码头处死，尸身示众多年。",
    significance: "国家反海盗立场的宣示，也标志着印度洋海盗潮开始退去。",
    sources: ["Ritchie 1986"], figures: ["kidd"]
  },
  {
    id: "1713-utrecht", year: 1713, yearLabel: "1713", stage: 3,
    lon: 5.12, lat: 52.09,
    titleZh: "《乌得勒支条约》", titleEn: "Treaty of Utrecht",
    desc: "结束西班牙王位继承战争，英国海军缩减、数以千计私掠者与海员被遣散。",
    significance: "海盗黄金时代复兴最直接的结构性原因：失业海员与无主私掠船大量涌入加勒比。",
    sources: ["Rediker 1987", "Woodard 2007"], figures: []
  },
  {
    id: "1715-treasure", year: 1715, yearLabel: "1715", stage: 3,
    lon: -80.0, lat: 27.5,
    titleZh: "西班牙宝船队沉没", titleEn: "Spanish treasure fleet wrecked",
    desc: "7 月，满载白银的西班牙船队在佛罗里达近海遭遇飓风沉没。",
    significance: "打捞与劫掠沉宝的风潮，直接点燃了巴哈马「海盗共和国」的兴起。",
    sources: ["Woodard 2007"], figures: []
  },
  {
    id: "1718-charleston", year: 1718, yearLabel: "1718", stage: 3,
    lon: -79.93, lat: 32.78,
    titleZh: "黑胡子封锁查尔斯顿", titleEn: "Blackbeard's blockade of Charleston",
    desc: "5 月，黑胡子率船封锁查尔斯顿，索取药箱与赎金后离去。",
    significance: "海盗对殖民地港口最张扬的一次武力要挟，显示其气焰达到顶点。",
    sources: ["Woodard 2007", "Johnson 1724"], figures: ["teach"]
  },
  {
    id: "1718-rogers", year: 1718, yearLabel: "1718", stage: 3,
    lon: -77.35, lat: 25.04,
    titleZh: "伍兹·罗杰斯任巴哈马总督", titleEn: "Woodes Rogers arrives in Nassau",
    desc: "罗杰斯携国王赦免抵拿骚任总督，以「海盗已除，贸易复归」为训，招抚与武力并举。",
    significance: "海盗共和国开始瓦解，国家重建加勒比海秩序的转折点。",
    sources: ["Woodard 2007"], figures: ["rogers"]
  },
  {
    id: "1718-teach-death", year: 1718, yearLabel: "1718", stage: 3,
    lon: -75.98, lat: 35.11,
    titleZh: "黑胡子被杀", titleEn: "Blackbeard killed at Ocracoke",
    desc: "11 月，海军中尉梅纳德在奥克拉科克突袭并击毙黑胡子。",
    significance: "黄金时代最著名海盗的死亡，标志海盗由盛转衰。",
    sources: ["Woodard 2007", "Johnson 1724"], figures: ["teach"]
  },
  {
    id: "1721-act", year: 1721, yearLabel: "1721", stage: 4,
    lon: -0.10, lat: 51.50,
    titleZh: "英国《反海盗法》", titleEn: "Piracy Act",
    desc: "议会立法严惩海盗，扩大审判管辖权并加重刑罚。",
    significance: "国家机器全面投入反海盗，制度性地终结海盗的生存空间。",
    sources: ["Rediker 2004", "Cordingly 1995"], figures: []
  },
  {
    id: "1722-roberts", year: 1722, yearLabel: "1722", stage: 3,
    lon: 8.71, lat: -0.62,
    titleZh: "罗伯茨被杀", titleEn: "Roberts killed at Cape Lopez",
    desc: "2 月，罗伯茨被皇家海军「燕子号」击毙；其船员随后在海岸角堡受审，数十人被绞死。",
    significance: "黄金时代最成功的海盗落幕；大规模审判与处决标志海盗潮的终结。",
    sources: ["Johnson 1724", "Rediker 2004"], figures: ["roberts"]
  },
  {
    id: "1726-end", year: 1726, yearLabel: "约 1726", stage: 4,
    lon: null, lat: null,
    titleZh: "海盗黄金时代落幕", titleEn: "End of the Golden Age of Piracy",
    desc: "随着大西洋两岸清剿与殖民地治理恢复，成规模的海盗活动基本消失。",
    significance: "海盗路线的转移与消退至此画上句号。",
    sources: ["Rediker 2004", "Cordingly 1995"], figures: []
  }
];
