// 人物条目。events / ports / routes 通过 id 引用。
window.FIGURES = [
  {
    id: "morgan",
    nameZh: "亨利·摩根",
    nameEn: "Henry Morgan",
    dates: "约 1635–1688",
    role: "威尔士私掠者 / 海盗，后任牙买加副总督",
    bio: "加勒比海盗时代最著名的私掠者之一，1668 年劫掠波托贝洛、1671 年越地峡火烧巴拿马城。晚年受封并任牙买加副总督，转而镇压海盗。",
    sources: ["Cordingly 1995", "Earle 2003", "Lane 1998"]
  },
  {
    id: "exquemelin",
    nameZh: "亚历山大·埃克斯克梅林",
    nameEn: "Alexandre Exquemelin",
    dates: "约 1645–1707",
    role: "外科医生 / 编年史家",
    bio: "曾随加勒比海盗出海，1678 年出版《美洲海盗》，是了解 buccaneers 早期状况的一手史料。",
    sources: ["Exquemelin 1678", "Lane 1998"]
  },
  {
    id: "tew",
    nameZh: "托马斯·图",
    nameEn: "Thomas Tew",
    dates: "卒于 1695",
    role: "「海盗环航」开创者",
    bio: "1692 年自百慕大出发绕好望角入红海劫掠莫卧儿商船，被视为 Pirate Round 的开端；1695 年再度劫掠时死于红海。",
    sources: ["Johnson 1724", "Rogoziński 2000"]
  },
  {
    id: "every",
    nameZh: "亨利·埃弗里",
    nameEn: "Henry Every",
    dates: "约生于 1659",
    role: "印度洋海盗",
    bio: "1694 年哗变夺船，1695 年 9 月俘获莫卧儿宝船「冈斯韦号」（Ganj-i-Sawai），被当时视为史上最丰厚的战利品；此后遁逃失踪，成为全球追缉对象。",
    sources: ["Johnson 1724", "Rogoziński 2000", "Earle 2003"]
  },
  {
    id: "kidd",
    nameZh: "威廉·基德",
    nameEn: "William Kidd",
    dates: "约 1654–1701",
    role: "受命缉盗的船长，后沦为海盗",
    bio: "1696 年受英王特许出海缉捕海盗，1698 年俘获印度商船后身陷海盗指控，1699 年被捕，1701 年在伦敦绞刑码头处死。",
    sources: ["Ritchie 1986", "Zacks 2002"]
  },
  {
    id: "culliford",
    nameZh: "罗伯特·卡利福德",
    nameEn: "Robert Culliford",
    dates: "活跃于 1690s",
    role: "印度洋海盗",
    bio: "印度洋海盗群体的一员，与基德在圣玛丽岛一度会面；其活动反映印度洋据点的海盗社群。",
    sources: ["Rogoziński 2000"]
  },
  {
    id: "teach",
    nameZh: "爱德华·蒂奇（黑胡子）",
    nameEn: "Edward Teach, “Blackbeard”",
    dates: "卒于 1718",
    role: "加勒比复兴期海盗",
    bio: "1716–1718 年以拿骚为基地肆虐北美沿岸，1718 年 5 月封锁查尔斯顿，同年 11 月在奥克拉科克被海军中尉梅纳德击毙。",
    sources: ["Woodard 2007", "Johnson 1724"]
  },
  {
    id: "roberts",
    nameZh: "巴塞洛缪·罗伯茨",
    nameEn: "Bartholomew Roberts",
    dates: "1682–1722",
    role: "黄金时代劫获最多的海盗",
    bio: "1719 年起辗转西非、巴西、加勒比与纽芬兰，劫获船只数量为黄金时代之最；1722 年 2 月在洛佩斯角被皇家海军「燕子号」击毙。",
    sources: ["Johnson 1724", "Rediker 2004"]
  },
  {
    id: "vane",
    nameZh: "查尔斯·范恩",
    nameEn: "Charles Vane",
    dates: "卒于 1721",
    role: "拿骚海盗共和国首领之一",
    bio: "拿骚海盗社群的核心人物，拒绝接受国王赦免，1721 年被处决。",
    sources: ["Woodard 2007"]
  },
  {
    id: "rogers",
    nameZh: "伍兹·罗杰斯",
    nameEn: "Woodes Rogers",
    dates: "约 1679–1732",
    role: "巴哈马总督（1718）",
    bio: "1718 年携国王赦免赴拿骚任总督，以「海盗已除，贸易复归」（Expulsis Piratis, Restituta Commercia）为座右铭，扫荡海盗共和国。",
    sources: ["Woodard 2007"]
  },
  {
    id: "bonny-read",
    nameZh: "安妮·邦妮与玛丽·里德",
    nameEn: "Anne Bonny & Mary Read",
    dates: "活跃于 1718–1720",
    role: "拿骚时期女海盗",
    bio: "与「印花布杰克」拉克姆同船，1720 年被俘，是黄金时代少数留下姓名的女性海盗。",
    sources: ["Johnson 1724", "Rediker 2004"]
  },
  {
    id: "aurangzeb",
    nameZh: "奥朗则布",
    nameEn: "Aurangzeb",
    dates: "1618–1707",
    role: "莫卧儿皇帝（背景人物）",
    bio: "冈斯韦号被劫后向英国东印度公司施压、一度中止英商贸易，推动英国政府把缉捕海盗上升为国家行动。",
    sources: ["Rogoziński 2000"]
  }
];
