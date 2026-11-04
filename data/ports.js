// 港口 / 据点 / 事件地点。role: haven=海盗据点, base=私掠/补给基地,
// target=目标商港, waypoint=中转航标, justice=缉捕与审判。
window.PORTS = [
  {
    id: "tortuga", nameZh: "托尔图加", nameEn: "Tortuga",
    role: "haven", lon: -72.66, lat: 19.99,
    active: "约 1640–1685", stage: 1, island: true,
    desc: "伊斯帕尼奥拉西北的小岛，法、英 buccaneers（以熏制野味得名）最早的据点，专事劫掠西班牙船只。",
    sources: ["Lane 1998", "Exquemelin 1678"]
  },
  {
    id: "portroyal", nameZh: "罗亚尔港", nameEn: "Port Royal",
    role: "haven", lon: -76.79, lat: 17.94,
    active: "1655–1692", stage: 1,
    desc: "牙买加海盗港，1660–80 年代被称为「世上最邪恶的城市」，是劫掠西班牙航运的补给与销赃中心；1692 年毁于地震。",
    sources: ["Cordingly 1995", "Lane 1998"]
  },
  {
    id: "nassau", nameZh: "拿骚（新普罗维登斯）", nameEn: "Nassau, New Providence",
    role: "haven", lon: -77.35, lat: 25.04,
    active: "约 1696–1718", stage: 3, island: true,
    desc: "巴哈马的海盗巢穴：1690 年代埃弗里曾在此遁迹，1715 年后再度成为「海盗共和国」的中心，直到 1718 年伍兹·罗杰斯任总督。",
    sources: ["Woodard 2007", "Rogoziński 2000"]
  },
  {
    id: "havana", nameZh: "哈瓦那", nameEn: "Havana",
    role: "target", lon: -82.37, lat: 23.11,
    active: "约 1550–1760", stage: 1,
    desc: "西班牙宝船队（Carrera de Indias）的集结港，白银经此编队横渡大西洋。",
    sources: ["Lane 1998"]
  },
  {
    id: "portobelo", nameZh: "波托贝洛", nameEn: "Portobelo",
    role: "target", lon: -79.65, lat: 9.55,
    active: "1597–1740", stage: 1,
    desc: "巴拿马地峡北岸的白银集市港，1668 年被摩根劫掠。",
    sources: ["Earle 2003"]
  },
  {
    id: "panama", nameZh: "巴拿马城", nameEn: "Panamá",
    role: "target", lon: -79.53, lat: 8.98,
    active: "1519–1671", stage: 1,
    desc: "太平洋侧的白银转运枢纽，1671 年被摩根越地峡攻占焚毁。",
    sources: ["Earle 2003"]
  },
  {
    id: "cartagena", nameZh: "卡塔赫纳", nameEn: "Cartagena",
    role: "target", lon: -75.55, lat: 10.40,
    active: "1533–1740", stage: 1,
    desc: "西班牙在加勒比南岸的设防港与宝船队中途站。",
    sources: ["Lane 1998"]
  },
  {
    id: "newport", nameZh: "纽波特", nameEn: "Newport, Rhode Island",
    role: "base", lon: -71.31, lat: 41.49,
    active: "约 1690s", stage: 2,
    desc: "北美殖民地的贸易港，托马斯·图等「海盗环航」者的出发与返航地。",
    sources: ["Rogoziński 2000"]
  },
  {
    id: "newyork", nameZh: "纽约", nameEn: "New York",
    role: "base", lon: -74.01, lat: 40.71,
    active: "约 1690s", stage: 2,
    desc: "基德的母港；其缉盗特许状背后即有纽约商人的投资。",
    sources: ["Ritchie 1986"]
  },
  {
    id: "cape", nameZh: "好望角", nameEn: "Cape of Good Hope",
    role: "waypoint", lon: 18.47, lat: -34.35,
    active: "1690s", stage: 2,
    desc: "「海盗环航」必经的中转，大西洋进入印度洋的门户。",
    sources: ["Rogoziński 2000"]
  },
  {
    id: "saintemarie", nameZh: "圣玛丽岛（马达加斯加）", nameEn: "Île Sainte-Marie",
    role: "haven", lon: 49.90, lat: -16.90,
    active: "约 1690–1715", stage: 2, island: true,
    desc: "印度洋海盗的主要据点与补给地。传说中平等的海盗共和国「利伯塔利亚」即设于此，学界多认为该共和国系虚构。",
    sources: ["Rogoziński 2000", "Johnson 1724"]
  },
  {
    id: "bab", nameZh: "曼德海峡 / 穆哈", nameEn: "Bab-el-Mandeb / Mocha",
    role: "waypoint", lon: 43.30, lat: 12.50,
    active: "1690s", stage: 2,
    desc: "红海口的猎场，莫卧儿朝圣与贸易船队必经，海盗在此守候。",
    sources: ["Rogoziński 2000"]
  },
  {
    id: "surat", nameZh: "苏拉特", nameEn: "Surat",
    role: "target", lon: 72.80, lat: 21.20,
    active: "约 1600–1720", stage: 2,
    desc: "莫卧儿帝国西海岸主要商港，「冈斯韦号」的母港。",
    sources: ["Rogoziński 2000"]
  },
  {
    id: "reunion", nameZh: "留尼汪（波旁）", nameEn: "Réunion / Bourbon",
    role: "waypoint", lon: 55.50, lat: -21.10,
    active: "1690s", stage: 2, island: true,
    desc: "西印度洋的岛屿，埃弗里部分船员在此分赃、躲藏。",
    sources: ["Rogoziński 2000"]
  },
  {
    id: "ocracoke", nameZh: "奥克拉科克", nameEn: "Ocracoke",
    role: "justice", lon: -75.98, lat: 35.11,
    active: "1718", stage: 3, island: true,
    desc: "1718 年 11 月黑胡子被海军中尉梅纳德击毙处。",
    sources: ["Woodard 2007"]
  },
  {
    id: "charleston", nameZh: "查尔斯顿", nameEn: "Charleston",
    role: "target", lon: -79.93, lat: 32.78,
    active: "1718", stage: 3,
    desc: "1718 年 5 月被黑胡子封锁、索要药箱的港口。",
    sources: ["Woodard 2007"]
  },
  {
    id: "capelopez", nameZh: "洛佩斯角", nameEn: "Cape Lopez",
    role: "justice", lon: 8.71, lat: -0.62,
    active: "1722", stage: 3,
    desc: "1722 年 2 月罗伯茨被皇家海军「燕子号」击毙处。",
    sources: ["Johnson 1724"]
  },
  {
    id: "london", nameZh: "伦敦绞刑码头", nameEn: "London, Execution Dock",
    role: "justice", lon: -0.04, lat: 51.50,
    active: "1701–1722", stage: 4,
    desc: "基德（1701）与罗伯茨船员（1722）等在此被公开绞死，是国家反海盗运动的象征地。",
    sources: ["Ritchie 1986", "Rediker 2004"]
  },
  {
    id: "capecoast", nameZh: "海岸角堡", nameEn: "Cape Coast Castle",
    role: "justice", lon: -1.24, lat: 5.10,
    active: "1722", stage: 4,
    desc: "1722 年罗伯茨的船员在此受审，数十人被成批绞死。",
    sources: ["Rediker 2004", "Johnson 1724"]
  }
];
