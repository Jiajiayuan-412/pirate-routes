// 航线。type: pirate=海盗航线（按年代上色）, target=被劫掠的商路（虚线背景）。
// path 为 [经度, 纬度] 折线，示意航线（非精确航迹）。
// direction: east/west/north/south/loop，用于船标朝向与箭头。
window.ROUTES = [
  {
    id: "tortuga-raids",
    type: "pirate",
    stage: 1,
    nameZh: "托尔图加海盗对西班牙航运的袭击",
    nameEn: "Tortuga buccaneers' raiding",
    start: 1650, end: 1670,
    direction: "southwest",
    path: [[-72.66, 19.99], [-73.0, 19.7], [-74.5, 18.6], [-76.0, 17.5], [-76.79, 17.94], [-78.5, 15.0], [-79.0, 12.0], [-79.65, 9.55]],
    desc: "以托尔图加、伊斯帕尼奥拉为基地的 buccaneers 沿加勒比海岸袭击西班牙航运，进犯古巴南岸与中美洲沿岸。",
    sources: ["Exquemelin 1678", "Lane 1998"],
    figures: ["exquemelin"]
  },
  {
    id: "morgan-raids",
    type: "pirate",
    stage: 1,
    nameZh: "亨利·摩根的劫掠（波托贝洛与巴拿马）",
    nameEn: "Henry Morgan's raids",
    start: 1668, end: 1671,
    direction: "southwest",
    path: [[-76.79, 17.94], [-80.5, 15.0], [-81.4, 13.35], [-79.65, 9.55], [-79.93, 9.32]],
    desc: "摩根从牙买加罗亚尔港出发，1668 年劫掠波托贝洛，1671 年越地峡火烧巴拿马城。",
    sources: ["Earle 2003", "Cordingly 1995"],
    figures: ["morgan"]
  },
  {
    id: "tew-1692",
    type: "pirate",
    stage: 2,
    nameZh: "托马斯·图的首次「海盗环航」",
    nameEn: "Thomas Tew's first Pirate Round",
    start: 1692, end: 1693,
    direction: "east",
    path: [[-64.8, 32.3], [-45, 20], [-30, 8], [-10, -20], [18.47, -34.35], [40, -26], [49.9, -16.9], [47, 0], [43.3, 12.5]],
    desc: "1692 年图自百慕大出发，绕好望角抵红海口劫掠莫卧儿商船，被视为「海盗环航」（Pirate Round）的开端。",
    sources: ["Johnson 1724", "Rogoziński 2000"],
    figures: ["tew"]
  },
  {
    id: "every-1694",
    type: "pirate",
    stage: 2,
    nameZh: "亨利·埃弗里的航程（俘获「冈斯韦号」）",
    nameEn: "Henry Every's voyage",
    start: 1694, end: 1696,
    direction: "east",
    path: [[-8.41, 43.36], [-16, 28], [-24, 15], [-10, -15], [18.47, -34.35], [49.9, -16.9], [65, 8], [72.8, 21.2]],
    desc: "1694 年埃弗里在拉科鲁尼亚哗变夺船，经好望角入印度洋，1695 年 9 月在印度沿岸俘获莫卧儿宝船「冈斯韦号」，随后逃往巴哈马。",
    sources: ["Johnson 1724", "Rogoziński 2000", "Earle 2003"],
    figures: ["every"]
  },
  {
    id: "kidd-1696",
    type: "pirate",
    stage: 2,
    nameZh: "威廉·基德的航程",
    nameEn: "William Kidd's voyage",
    start: 1696, end: 1699,
    direction: "east",
    path: [[-74.01, 40.71], [-45, 36], [-28, 38], [-10, -20], [18.47, -34.35], [49.9, -16.9], [65, 8], [76.3, 10.0]],
    desc: "基德受命缉捕海盗，1696 年自纽约绕好望角入印度洋，1698 年俘获印度商船后身陷海盗指控，1699 年回北美被捕。",
    sources: ["Ritchie 1986", "Zacks 2002"],
    figures: ["kidd"]
  },
  {
    id: "blackbeard-1716",
    type: "pirate",
    stage: 3,
    nameZh: "黑胡子的活动海域",
    nameEn: "Blackbeard's cruising ground",
    start: 1716, end: 1718,
    direction: "north",
    path: [[-77.35, 25.04], [-76, 28], [-74, 32], [-76, 35], [-78, 35.5], [-79.93, 32.78], [-77, 33], [-75.98, 35.11]],
    desc: "黑胡子以拿骚为基地沿北美东海岸劫掠，1718 年 5 月封锁查尔斯顿，同年 11 月在奥克拉科克被海军中尉梅纳德击毙。",
    sources: ["Woodard 2007", "Johnson 1724"],
    figures: ["teach"]
  },
  {
    id: "roberts-1719",
    type: "pirate",
    stage: 3,
    nameZh: "巴塞洛缪·罗伯茨的航程",
    nameEn: "Bartholomew Roberts's voyage",
    start: 1719, end: 1722,
    direction: "loop",
    path: [[-13, 7], [-40, -10], [-35, -8], [-60, 10], [-50, 30], [-55, 40], [-65, 45], [-75, 30], [-70, 15], [-50, 5], [-20, -5], [8.7, -0.62]],
    desc: "罗伯茨的航线横跨大西洋两岸：自西非至巴西、加勒比、纽芬兰，再返西非，1722 年在洛佩斯角被皇家海军「燕子号」击毙。",
    sources: ["Johnson 1724", "Rediker 2004"],
    figures: ["roberts"]
  },
  {
    id: "carrera",
    type: "target",
    stage: 1,
    nameZh: "西班牙宝船队航线（Carrera de Indias）",
    nameEn: "Spanish treasure fleet",
    start: 1650, end: 1730,
    direction: "east",
    path: [[-79.65, 9.55], [-75.55, 10.4], [-82.37, 23.11], [-79.5, 26.5], [-60, 30], [-40, 34], [-28, 38.5], [-6.3, 36.5]],
    desc: "白银自波托贝洛、巴拿马经卡塔赫纳运往哈瓦那，编成船队横渡大西洋抵塞维利亚——加勒比海盗的首要劫掠目标。",
    sources: ["Lane 1998", "Earle 2003"],
    figures: []
  },
  {
    id: "mughal-redsea",
    type: "target",
    stage: 2,
    nameZh: "莫卧儿朝圣 / 红海商路（被劫掠目标）",
    nameEn: "Mughal Red Sea shipping",
    start: 1650, end: 1720,
    direction: "west",
    path: [[72.8, 21.2], [66, 18], [58, 15], [50, 13], [43.3, 12.5]],
    desc: "莫卧儿帝国自苏拉特等港驶往红海吉达的朝圣与贸易船队，载有巨额财货，是印度洋海盗的头号目标。",
    sources: ["Rogoziński 2000", "Earle 2003"],
    figures: []
  }
];
