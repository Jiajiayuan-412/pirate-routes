// 四阶段叙事。year 为该阶段的代表年份（用于时间轴快进与上色）。
window.STAGES = [
  {
    id: 1,
    label: "第一阶段",
    titleZh: "加勒比私掠期",
    titleEn: "The Buccaneers, Caribbean",
    years: "约 1650–1680s",
    year: 1665,
    blurb: "西班牙宝船队把美洲白银经加勒比运回本土，托尔图加、罗亚尔港成为海盗与私掠者的据点。英西战争培育了一代 buccaneers，但 1670 年《马德里条约》与 1671 年巴拿马城被焚，标志这一阶段的由盛转衰。",
    events: ["1655-jamaica", "1668-portobelo", "1670-madrid", "1671-panama", "1692-earthquake"],
    figures: ["morgan", "exquemelin"]
  },
  {
    id: 2,
    label: "第二阶段",
    titleZh: "印度洋「海盗环航」",
    titleEn: "The Pirate Round, Indian Ocean",
    years: "约 1690–1700s",
    year: 1698,
    blurb: "加勒比遭到整顿、欧洲和平使海员失业，海盗转而东进：绕好望角入红海，劫掠富庶的莫卧儿朝圣与贸易船队。1695 年埃弗里俘获「冈斯韦号」轰动一时，马达加斯加成为新据点。",
    events: ["1692-tew", "1695-ganjisawai", "1696-kidd", "1697-ryswick", "1701-kidd"],
    figures: ["tew", "every", "kidd", "culliford", "aurangzeb"]
  },
  {
    id: 3,
    label: "第三阶段",
    titleZh: "加勒比复兴",
    titleEn: "The Golden Age Returns",
    years: "约 1716–1726",
    year: 1721,
    blurb: "1713 年《乌得勒支条约》遣散大批海员与私掠者，海盗在拿骚建立「共和国」，黑胡子、罗伯茨等肆虐大西洋两岸，气焰一时无两。",
    events: ["1713-utrecht", "1715-treasure", "1718-charleston", "1718-rogers", "1718-teach-death", "1722-roberts"],
    figures: ["teach", "roberts", "vane", "rogers", "bonny-read"]
  },
  {
    id: 4,
    label: "第四阶段",
    titleZh: "清剿与终结",
    titleEn: "Suppression and the End",
    years: "约 1720s–1730",
    year: 1726,
    blurb: "英国海军大规模清剿，《反海盗法》出台，成批海盗在伦敦与西非被绞死。海盗的生存空间被制度性地压缩，黄金时代落幕。",
    events: ["1721-act", "1722-roberts", "1726-end"],
    figures: ["rogers", "roberts"]
  }
];
