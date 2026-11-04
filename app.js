(function () {
  "use strict";

  // ================= 常量与索引 =================
  const YEAR_MIN = 1650, YEAR_MAX = 1730;
  const W = 1000, H = 520, TAU = Math.PI * 2;

  const RAMP_LIGHT = ["#86b6ef", "#6da7ec", "#5598e7", "#3987e5", "#2a78d6", "#256abf", "#1c5cab", "#184f95"];
  const RAMP_DARK  = ["#3987e5", "#4f93ea", "#6da7ec", "#86b6ef", "#a3c9f5", "#c2dcf8", "#d9e9fb", "#eef6fe"];

  const FIGURE_MAP = {}, PORT_MAP = {}, ROUTE_MAP = {}, EVENT_MAP = {}, BIB_MAP = {}, STAGE_MAP = {};
  FIGURES.forEach(f => FIGURE_MAP[f.id] = f);
  PORTS.forEach(p => PORT_MAP[p.id] = p);
  ROUTES.forEach(r => ROUTE_MAP[r.id] = r);
  EVENTS.forEach(e => EVENT_MAP[e.id] = e);
  BIBLIOGRAPHY.forEach(b => BIB_MAP[b.key] = b);
  STAGES.forEach(s => STAGE_MAP[s.id] = s);

  const PIRATE_ROUTES = ROUTES.filter(r => r.type === "pirate");
  const TARGET_ROUTES = ROUTES.filter(r => r.type === "target");

  const ROLE_LABEL = {
    haven: "海盗据点", base: "出发 / 补给港", target: "目标商港",
    waypoint: "中转 / 航标", justice: "缉捕 · 审判"
  };

  // ================= 颜色工具 =================
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function hexToRgb(hex) {
    const m = hex.replace("#", "");
    return { r: parseInt(m.slice(0, 2), 16), g: parseInt(m.slice(2, 4), 16), b: parseInt(m.slice(4, 6), 16) };
  }
  function rgbToHex(r, g, b) {
    const h = v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
    return "#" + h(r) + h(g) + h(b);
  }
  function yearColor(year, theme) {
    const ramp = theme === "dark" ? RAMP_DARK : RAMP_LIGHT;
    const t = clamp((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN), 0, 1);
    const pos = t * (ramp.length - 1);
    const i = Math.floor(pos), j = Math.min(i + 1, ramp.length - 1), f = pos - i;
    const a = hexToRgb(ramp[i]), b = hexToRgb(ramp[j]);
    return rgbToHex(a.r + (b.r - a.r) * f, a.g + (b.g - a.g) * f, a.b + (b.b - a.b) * f);
  }
  function lighten(hex, t) { const c = hexToRgb(hex); return rgbToHex(c.r + (255 - c.r) * t, c.g + (255 - c.g) * t, c.b + (255 - c.b) * t); }
  function darken(hex, t) { const c = hexToRgb(hex); return rgbToHex(c.r * (1 - t), c.g * (1 - t), c.b * (1 - t)); }
  function flowColor(hex) { return theme === "dark" ? lighten(hex, 0.6) : darken(hex, 0.35); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ================= 主题 =================
  const MAP_THEME = {
    dark: { ocean: "#0b0e14", land: "#252a32", coast: "#454c58", graticule: "#1a1f27",
      labelRegion: "#7d8491", labelPlace: "#d5dae3", markerInk: "#f2f4f7", markerRing: "#0b0e14",
      target: "#5c574e", shipStroke: "#0b0e14", accent: "#3987e5" },
    light: { ocean: "#eef2f6", land: "#e9e5da", coast: "#c8c2b4", graticule: "#dfe3e6",
      labelRegion: "#8a8b88", labelPlace: "#55544f", markerInk: "#141414", markerRing: "#fcfcfb",
      target: "#9a8f7d", shipStroke: "#141414", accent: "#2a78d6" }
  };
  let theme = "dark";
  const mTheme = () => MAP_THEME[theme];

  // ================= DOM =================
  const mainCanvas = document.getElementById("map");
  const mainCtx = mainCanvas.getContext("2d");
  const mapWrap = document.getElementById("map-wrap");
  const tooltipEl = document.getElementById("tooltip");
  const detailEl = document.getElementById("detail");
  const detailBody = document.getElementById("detail-body");
  const yearLabel = document.getElementById("year-label");
  const slider = document.getElementById("slider");
  const btnPlay = document.getElementById("btn-play");
  const btnTheme = document.getElementById("btn-theme");
  const btnMusic = document.getElementById("btn-music");
  const btnTable = document.getElementById("btn-table");
  const stageChips = document.getElementById("stage-chips");
  const stagesEl = document.getElementById("stages");
  const legendEl = document.getElementById("legend");
  const eventTicksEl = document.getElementById("event-ticks");
  const tableEl = document.getElementById("events-table");
  const biblioEl = document.getElementById("bibliography");
  const tableView = document.getElementById("table-view");
  const stageTitle = document.getElementById("stage-title");
  const stKicker = document.getElementById("st-kicker");
  const stTitle = document.getElementById("st-title");
  const stSub = document.getElementById("st-sub");
  const tourProgress = document.getElementById("tour-progress");
  const tourProgressFill = document.getElementById("tour-progress-fill");

  // ================= 投影与几何 =================
  const proj = d3.geoNaturalEarth1().fitSize([W, H], { type: "Sphere" });
  const pathGen = d3.geoPath(proj);
  const landPath = new Path2D(pathGen(NE_LAND));
  const graticulePath = new Path2D(pathGen(d3.geoGraticule().step([30, 30])));

  function resample(pts, step) {
    if (!pts.length) return [];
    const out = [pts[0].slice()];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const len = Math.hypot(dx, dy);
      const n = Math.max(1, Math.round(len / step));
      for (let k = 1; k <= n; k++) out.push([a[0] + dx * k / n, a[1] + dy * k / n]);
    }
    return out;
  }
  function tangentRad(pts, i) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    return Math.atan2(b[1] - a[1], b[0] - a[0]);
  }

  ROUTES.forEach(r => {
    r.pts = resample(r.path.map(p => proj(p)), 2.5);
    r.mid = (r.start + r.end) / 2;
  });
  PORTS.forEach(p => { p.xy = proj([p.lon, p.lat]); });

  const REGION_LABELS = [
    { text: "大西洋", en: "Atlantic", lon: -38, lat: 24, size: 15 },
    { text: "印度洋", en: "Indian Ocean", lon: 62, lat: -25, size: 15 },
    { text: "太平洋", en: "Pacific", lon: -142, lat: -8, size: 14 },
    { text: "加勒比海", en: "", lon: -78, lat: 15.5, size: 11 },
    { text: "墨西哥湾", en: "", lon: -90, lat: 25.5, size: 9.5 },
    { text: "红海", en: "", lon: 37.5, lat: 20.5, size: 9.5 },
    { text: "阿拉伯海", en: "", lon: 64, lat: 14, size: 9.5 },
    { text: "西非", en: "", lon: 3, lat: 6, size: 9.5, land: true },
    { text: "马达加斯加", en: "", lon: 47, lat: -19.6, size: 9.5, land: true },
    { text: "莫卧儿帝国", en: "Mughal", lon: 77, lat: 26, size: 10, land: true }
  ].map(rl => { const xy = proj([rl.lon, rl.lat]); rl.xy = xy; return rl; });

  const PLACE_LABELS = {
    tortuga: { dx: 11, dy: -3, anchor: "left" }, portroyal: { dx: 0, dy: -12, anchor: "center" },
    nassau: { dx: 12, dy: 0, anchor: "left" }, havana: { dx: -12, dy: -9, anchor: "right" },
    saintemarie: { dx: 13, dy: -7, anchor: "left" }, surat: { dx: 9, dy: -9, anchor: "left" },
    cape: { dx: 11, dy: 7, anchor: "left" }
  };
  const LABELED_PORTS = Object.keys(PLACE_LABELS).map(id => {
    const p = PORT_MAP[id]; const off = PLACE_LABELS[id];
    return { p, off };
  });

  TARGET_ROUTES.forEach(r => {
    r.chevrons = [];
    for (let i = 10; i < r.pts.length - 2; i += 26) r.chevrons.push({ x: r.pts[i][0], y: r.pts[i][1], a: tangentRad(r.pts, i) });
  });

  // ================= 镜头 =================
  const camera = { x: 0, y: 0, k: 1 };
  let camTarget = { x: 0, y: 0, k: 1 };
  function cam(lon, lat, k) {
    const p = proj([lon, lat]);
    return { x: W / 2 - p[0] * k, y: H / 2 - p[1] * k, k };
  }
  const STAGE_CAMS = { 1: cam(-74, 16, 2.7), 2: cam(35, -12, 2.1), 3: cam(-40, 20, 1.6), 4: cam(-5, 22, 1.8) };

  // ================= 画布 =================
  let baseCanvas, dpr = 1, cssW = 0, cssH = 0, viewScale = 1, viewOX = 0, viewOY = 0;

  function resize() {
    const rect = mainCanvas.getBoundingClientRect();
    cssW = Math.max(1, rect.width); cssH = Math.max(1, rect.height);
    dpr = Math.min(2, window.devicePixelRatio || 1);
    mainCanvas.width = Math.round(cssW * dpr);
    mainCanvas.height = Math.round(cssH * dpr);
    viewScale = Math.min(cssW / W, cssH / H);
    viewOX = (cssW - W * viewScale) / 2;
    viewOY = (cssH - H * viewScale) / 2;
  }
  function buildBase() {
    const R = 2, m = mTheme();
    baseCanvas = document.createElement("canvas");
    baseCanvas.width = W * R; baseCanvas.height = H * R;
    const bc = baseCanvas.getContext("2d");
    bc.scale(R, R);
    bc.strokeStyle = m.graticule; bc.lineWidth = 0.6;
    bc.stroke(graticulePath);
    bc.fillStyle = m.land; bc.strokeStyle = m.coast; bc.lineWidth = 0.5;
    bc.fill(landPath); bc.stroke(landPath);
  }

  // ================= 状态 =================
  const state = { year: 1650, stage: 0, tour: false, segIdx: 0, segStart: 0 };
  let hoverPort = null, hoverRoute = null, hoverKey = null;
  let bootTimer = null, titleTimer = null, flowOffset = 0, pingT = 0;

  function routeOpacity(r) {
    if (state.stage !== 0 && r.stage !== state.stage) return 0.05;
    const inWin = state.year >= r.start && state.year <= r.end;
    return inWin ? 1 : 0.16;
  }

  // ================= 绘制 =================
  function trace(c, pts) {
    c.beginPath();
    pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
  }
  function drawWorld(c, m) {
    c.drawImage(baseCanvas, 0, 0, W, H);

    // 目标商路（虚线 + 箭头）
    TARGET_ROUTES.forEach(r => {
      const o = (state.stage === 0 || r.stage === state.stage) ? 0.5 : 0.05;
      c.globalAlpha = o; c.strokeStyle = m.target; c.lineWidth = 1.3;
      c.setLineDash([5, 5]); trace(c, r.pts); c.stroke(); c.setLineDash([]);
      c.fillStyle = m.target; c.globalAlpha = o * 1.4;
      r.chevrons.forEach(ch => {
        c.save(); c.translate(ch.x, ch.y); c.rotate(ch.a);
        c.beginPath(); c.moveTo(3.4, 0); c.lineTo(-3, 2.1); c.lineTo(-3, -2.1); c.closePath(); c.fill();
        c.restore();
      });
    });

    // 海盗航线（底色）
    PIRATE_ROUTES.forEach(r => {
      const o = hoverRoute === r ? 1 : routeOpacity(r);
      if (o <= 0.02) return;
      c.globalAlpha = o; c.strokeStyle = yearColor(r.mid, theme);
      c.lineWidth = hoverRoute === r ? 4 : (o === 1 ? 2.4 : 1.5);
      c.lineJoin = "round"; c.lineCap = "round";
      trace(c, r.pts); c.stroke();
    });

    // 流动光带
    PIRATE_ROUTES.forEach(r => {
      const active = routeOpacity(r) === 1 && hoverRoute !== r;
      if (!active) return;
      c.globalAlpha = 0.95; c.strokeStyle = flowColor(yearColor(r.mid, theme));
      c.lineWidth = 2.6; c.lineCap = "round";
      c.shadowColor = flowColor(yearColor(r.mid, theme)); c.shadowBlur = 8;
      c.setLineDash([7, 22]); c.lineDashOffset = flowOffset;
      trace(c, r.pts); c.stroke();
      c.setLineDash([]); c.shadowBlur = 0;
    });

    // 港口
    PORTS.forEach(p => {
      const x = p.xy[0], y = p.xy[1];
      if (hoverPort === p) {
        c.strokeStyle = m.accent; c.lineWidth = 2;
        c.beginPath(); c.arc(x, y, 8, 0, TAU); c.stroke();
      }
      if (state.stage > 0 && p.stage === state.stage) {
        const ph = (pingT / 1800) % 1;
        c.globalAlpha = (1 - ph) * 0.85; c.strokeStyle = m.accent; c.lineWidth = 2;
        c.beginPath(); c.arc(x, y, 4.5 + ph * 9, 0, TAU); c.stroke(); c.globalAlpha = 1;
      }
      drawPortShape(c, p.role, x, y, m);
    });

    // 船标
    PIRATE_ROUTES.forEach(r => {
      const inWin = state.year >= r.start && state.year <= r.end;
      if (!(inWin && (state.stage === 0 || r.stage === state.stage))) return;
      const t = clamp((state.year - r.start) / (r.end - r.start), 0, 1);
      const idx = Math.round(t * (r.pts.length - 1));
      const xy = r.pts[idx], era = yearColor(r.mid, theme);
      c.save(); c.translate(xy[0], xy[1]); c.rotate(tangentRad(r.pts, idx));
      c.shadowColor = era; c.shadowBlur = 10;
      c.globalAlpha = 0.30; c.fillStyle = era;
      c.beginPath(); c.arc(0, 0, 10, 0, TAU); c.fill(); c.globalAlpha = 1;
      c.fillStyle = era; c.strokeStyle = m.shipStroke; c.lineWidth = 0.6;
      c.beginPath(); c.moveTo(-5, 1); c.lineTo(5, 1); c.lineTo(3.2, 4); c.lineTo(-3.2, 4); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = lighten(era, 0.45);
      c.beginPath(); c.moveTo(-0.6, -0.5); c.lineTo(-0.6, -9); c.lineTo(4.5, -0.5); c.closePath(); c.fill(); c.stroke();
      c.shadowBlur = 0; c.restore();
    });

    // 标签（常尺寸，反缩放）
    const s = 1 / camera.k;
    c.textBaseline = "middle";
    REGION_LABELS.forEach(rl => {
      c.save(); c.translate(rl.xy[0], rl.xy[1]); c.scale(s, s);
      c.font = "italic " + rl.size + "px system-ui, sans-serif";
      c.textAlign = "center";
      c.fillStyle = rl.land ? m.labelPlace : m.labelRegion;
      c.fillText(rl.en ? rl.text + " " + rl.en : rl.text, 0, 0);
      c.restore();
    });
    LABELED_PORTS.forEach(({ p, off }) => {
      c.save(); c.translate(p.xy[0] + off.dx, p.xy[1] + off.dy); c.scale(s, s);
      c.font = "600 10.5px system-ui, sans-serif";
      c.textAlign = off.anchor;
      c.fillStyle = m.labelPlace;
      c.fillText(p.nameZh, 0, 0);
      c.restore();
    });
    c.globalAlpha = 1;
  }

  function drawPortShape(c, role, x, y, m) {
    const ink = m.markerInk, ring = m.markerRing;
    c.fillStyle = ink;
    if (role === "haven") {
      c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fill();
      c.lineWidth = 2; c.strokeStyle = ring; c.stroke();
    } else if (role === "target") {
      c.strokeStyle = ink; c.lineWidth = 1.8;
      c.beginPath(); c.arc(x, y, 4.5, 0, TAU); c.stroke();
    } else if (role === "base") {
      c.beginPath(); c.moveTo(x, y - 5.5); c.lineTo(x + 5, y + 3.5); c.lineTo(x - 5, y + 3.5); c.closePath(); c.fill();
      c.lineWidth = 1.3; c.strokeStyle = ring; c.stroke();
    } else if (role === "waypoint") {
      c.beginPath(); c.moveTo(x, y - 5); c.lineTo(x + 4.5, y); c.lineTo(x, y + 5); c.lineTo(x - 4.5, y); c.closePath(); c.fill();
      c.lineWidth = 1.3; c.strokeStyle = ring; c.stroke();
    } else if (role === "justice") {
      c.fillRect(x - 4, y - 4, 8, 8);
      c.lineWidth = 1.3; c.strokeStyle = ring; c.strokeRect(x - 4, y - 4, 8, 8);
    }
  }

  function draw() {
    const c = mainCtx, m = mTheme();
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.fillStyle = m.ocean; c.fillRect(0, 0, cssW, cssH);
    c.translate(viewOX, viewOY); c.scale(viewScale, viewScale);
    c.save();
    c.translate(camera.x, camera.y); c.scale(camera.k, camera.k);
    drawWorld(c, m);
    c.restore();
  }

  // ================= 命中检测 =================
  function mouseToWorld(mx, my) {
    return [(mx - viewOX) / viewScale - camera.x, (my - viewOY) / viewScale - camera.y].map(v => v / camera.k);
  }
  function nearestPortHit(wx, wy) {
    let best = null, bd = 1e9;
    PORTS.forEach(p => { const d = Math.hypot(p.xy[0] - wx, p.xy[1] - wy); if (d < bd) { bd = d; best = p; } });
    return bd * camera.k < 15 ? best : null;
  }
  function distSeg(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
    let t = l2 ? ((px - ax) * dx + (py - ay) * dy) / l2 : 0;
    t = clamp(t, 0, 1);
    return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
  }
  function hitRoute(wx, wy) {
    let best = null, bd = 1e9;
    PIRATE_ROUTES.forEach(r => {
      for (let i = 0; i < r.pts.length - 1; i++) {
        const d = distSeg(wx, wy, r.pts[i][0], r.pts[i][1], r.pts[i + 1][0], r.pts[i + 1][1]);
        if (d < bd) { bd = d; best = r; }
      }
    });
    return bd * camera.k < 7 ? best : null;
  }

  // ================= tooltip =================
  function showTooltip(x, y, html) {
    tooltipEl.innerHTML = html;
    tooltipEl.hidden = false;
    positionTooltip(x, y);
  }
  function positionTooltip(x, y) {
    const w = tooltipEl.offsetWidth, h = tooltipEl.offsetHeight;
    const mw = mapWrap.clientWidth, mh = mapWrap.clientHeight;
    let left = x + 16, top = y + 14;
    if (left + w > mw - 8) left = x - w - 16;
    if (top + h > mh - 8) top = y - h - 14;
    tooltipEl.style.left = Math.max(6, left) + "px";
    tooltipEl.style.top = Math.max(6, top) + "px";
  }
  function hideTooltip() { tooltipEl.hidden = true; }

  // ================= 详情卡 =================
  function sourcesHtml(keys) {
    if (!keys || !keys.length) return "";
    return '<h3>出处</h3>' + keys.map(k => {
      const b = BIB_MAP[k];
      return '<div class="d-sources"><b>' + esc(k) + '</b> ' + (b ? esc(b.full) : esc(k)) + '</div>';
    }).join("");
  }
  function figuresHtml(ids) {
    if (!ids || !ids.length) return "";
    return '<h3>相关人物</h3>' + ids.map(id => {
      const f = FIGURE_MAP[id]; if (!f) return "";
      return '<details><summary>' + esc(f.nameZh) + ' <span class="d-en">' + esc(f.nameEn) + '</span>（' + esc(f.dates) + '）</summary>' +
        '<p>' + esc(f.bio) + '</p>' + sourcesHtml(f.sources) + '</details>';
    }).join("");
  }
  function eventsHtml(ids) {
    if (!ids || !ids.length) return "";
    return '<h3>相关事件</h3><div class="d-events">' + ids.map(id => {
      const e = EVENT_MAP[id]; if (!e) return "";
      return '<a data-event="' + esc(id) + '">' + esc(e.yearLabel) + ' · ' + esc(e.titleZh) + '</a>';
    }).join("") + '</div>';
  }
  function nearestPort(lon, lat) {
    let best = null, bd = 1e9;
    PORTS.forEach(p => { const d = Math.hypot(p.lon - lon, p.lat - lat); if (d < bd) { bd = d; best = p; } });
    return bd < 1.0 ? best : null;
  }
  function showDetail(kind, id) {
    const body = detailBody;
    if (kind === "port") {
      const p = PORT_MAP[id]; if (!p) return;
      const evs = EVENTS.filter(e => e.lon != null && Math.hypot(e.lon - p.lon, e.lat - p.lat) < 1.0).map(e => e.id);
      body.innerHTML = '<h2>' + esc(p.nameZh) + '</h2><div class="d-en">' + esc(p.nameEn) + '</div>' +
        '<div class="d-meta">' + esc(ROLE_LABEL[p.role] || "") + ' · ' + esc(p.active) + '</div>' +
        '<div class="d-desc">' + esc(p.desc) + '</div>' + sourcesHtml(p.sources) + eventsHtml(evs);
    } else if (kind === "route") {
      const r = ROUTE_MAP[id]; if (!r) return;
      const evs = EVENTS.filter(e => e.year >= r.start && e.year <= r.end).map(e => e.id);
      body.innerHTML = '<h2>' + esc(r.nameZh) + '</h2><div class="d-en">' + esc(r.nameEn) + '</div>' +
        '<div class="d-meta">' + (r.type === "pirate" ? "海盗航线" : "被劫掠的商路") + ' · ' + esc(r.start) + '–' + esc(r.end) + '</div>' +
        '<div class="d-desc">' + esc(r.desc) + '</div>' + figuresHtml(r.figures) + eventsHtml(evs) + sourcesHtml(r.sources);
    } else if (kind === "event") {
      const e = EVENT_MAP[id]; if (!e) return;
      const loc = (e.lon != null) ? nearestPort(e.lon, e.lat) : null;
      body.innerHTML = '<h2>' + esc(e.titleZh) + '</h2><div class="d-en">' + esc(e.titleEn) + '</div>' +
        '<div class="d-meta">' + esc(e.yearLabel) + ' · 第' + esc(String(e.stage)) + '阶段' + (loc ? ' · ' + esc(loc.nameZh) : '') + '</div>' +
        '<div class="d-desc">' + esc(e.desc) + '</div>' +
        (e.significance ? '<div class="d-sig">' + esc(e.significance) + '</div>' : '') +
        figuresHtml(e.figures) + sourcesHtml(e.sources);
    } else if (kind === "figure") {
      const f = FIGURE_MAP[id]; if (!f) return;
      body.innerHTML = '<h2>' + esc(f.nameZh) + '</h2><div class="d-en">' + esc(f.nameEn) + '</div>' +
        '<div class="d-meta">' + esc(f.dates) + ' · ' + esc(f.role) + '</div>' +
        '<div class="d-desc">' + esc(f.bio) + '</div>' + sourcesHtml(f.sources);
    }
    detailEl.hidden = false;
    detailBody.querySelectorAll("[data-event]").forEach(a => a.addEventListener("click", () => jumpToEvent(a.getAttribute("data-event"))));
  }

  // ================= 渲染（HTML） =================
  function render() {
    yearLabel.textContent = Math.round(state.year);
    slider.value = Math.round(state.year);
    stageCardEls.forEach((o, id) => o.el.classList.toggle("active", id === state.stage));
    stageChipEls.forEach((o, id) => o.el.classList.toggle("active", id === state.stage));
  }

  function applyTheme() {
    buildBase();
    stageCardEls.forEach((o, id) => o.el.style.setProperty("--stage-accent", yearColor(STAGE_MAP[id].year, theme)));
    stageChipEls.forEach((o, id) => {
      const c = yearColor(STAGE_MAP[id].year, theme);
      o.el.style.setProperty("--stage-accent", c);
      o.dot.style.background = c;
    });
    buildLegend();
    render();
  }

  // ================= 侧栏 / 图例 / 年表 =================
  const stageCardEls = new Map();
  const stageChipEls = new Map();
  function buildStages() {
    STAGES.forEach(s => {
      const card = document.createElement("div");
      card.className = "stage-card";
      card.style.setProperty("--stage-accent", yearColor(s.year, theme));
      const figChips = s.figures.map(id => {
        const f = FIGURE_MAP[id];
        return f ? '<button class="figure-chip" data-figure="' + esc(id) + '">' + esc(f.nameZh) + '</button>' : "";
      }).join("");
      const evLinks = s.events.map(id => {
        const e = EVENT_MAP[id];
        return e ? '<span class="event-link" data-event="' + esc(id) + '">' + esc(e.yearLabel) + ' ' + esc(e.titleZh) + '</span>' : "";
      }).join("");
      card.innerHTML = '<h3><span class="stage-label">' + esc(s.label) + '</span>' + esc(s.titleZh) + '<span class="stage-years">' + esc(s.years) + '</span></h3>' +
        '<div class="stage-en">' + esc(s.titleEn) + '</div><p class="blurb">' + esc(s.blurb) + '</p>' +
        (figChips ? '<div class="figures-row">' + figChips + '</div>' : "") +
        (evLinks ? '<div class="event-row">' + evLinks + '</div>' : "");
      card.addEventListener("click", ev => {
        if (ev.target.closest("[data-figure]")) { stopTour(); showDetail("figure", ev.target.closest("[data-figure]").getAttribute("data-figure")); return; }
        if (ev.target.closest("[data-event]")) { stopTour(); jumpToEvent(ev.target.closest("[data-event]").getAttribute("data-event")); return; }
        toggleStage(s.id);
      });
      stagesEl.appendChild(card);
      stageCardEls.set(s.id, { el: card });
      const chip = document.createElement("button");
      chip.className = "stage-chip";
      chip.setAttribute("data-stage", s.id);
      chip.innerHTML = '<span class="dot"></span>' + esc(s.titleZh);
      chip.addEventListener("click", () => toggleStage(s.id));
      stageChips.appendChild(chip);
      stageChipEls.set(s.id, { el: chip, dot: chip.querySelector(".dot") });
    });
  }
  function toggleStage(id) {
    stopTour();
    state.stage = (state.stage === id) ? 0 : id;
    if (state.stage !== 0) { state.year = STAGE_MAP[state.stage].year; camTarget = STAGE_CAMS[state.stage]; }
    else camTarget = { x: 0, y: 0, k: 1 };
    render();
  }
  function jumpToEvent(id) {
    const e = EVENT_MAP[id]; if (!e) return;
    stopTour();
    if (e.year != null) state.year = e.year;
    state.stage = 0;
    if (e.lon != null) camTarget = cam(e.lon, e.lat, 2.6);
    render();
    showDetail("event", id);
  }

  function buildLegend() {
    const steps = [];
    for (let i = 0; i <= 8; i++) steps.push(yearColor(YEAR_MIN + (YEAR_MAX - YEAR_MIN) * i / 8, theme));
    legendEl.innerHTML =
      '<h4>航线年代（' + (theme === "dark" ? "颜色越亮年代越晚" : "颜色越深年代越晚") + '）</h4>' +
      '<div class="ramp-bar" style="background: linear-gradient(to right,' + steps.join(",") + ')"></div>' +
      '<div class="ramp-ticks"><span>1650</span><span>1690</span><span>1730</span></div>' +
      '<div class="legend-row"><span class="swatch-line"></span>海盗航线（实线）</div>' +
      '<div class="legend-row"><span class="swatch-line dashed"></span>被劫掠的商路（虚线）</div>' +
      '<h4>地点类型</h4>' +
      shapeLegendRow("haven", "海盗据点") + shapeLegendRow("target", "目标商港") +
      shapeLegendRow("base", "出发 / 补给港") + shapeLegendRow("waypoint", "中转 / 航标") +
      shapeLegendRow("justice", "缉捕 · 审判");
    const m = mTheme();
    legendEl.querySelectorAll(".legend-shape-slot").forEach(slot => {
      const role = slot.getAttribute("data-role");
      const g = d3.select(slot).append("svg").attr("class", "legend-shape").attr("viewBox", "0 0 12 12");
      const gg = g.append("g").attr("transform", "translate(6,6)");
      drawLegendShape(gg, role, m);
    });
  }
  function drawLegendShape(g, role, m) {
    g.selectAll("*").remove();
    const ink = m.markerInk, ring = m.markerRing;
    if (role === "haven") { g.append("circle").attr("r", 5).attr("fill", ink).attr("stroke", ring).attr("stroke-width", 2); }
    else if (role === "target") { g.append("circle").attr("r", 4.5).attr("fill", "none").attr("stroke", ink).attr("stroke-width", 1.8); }
    else if (role === "base") { g.append("path").attr("d", "M0,-5.5 L5,3.5 L-5,3.5 Z").attr("fill", ink).attr("stroke", ring).attr("stroke-width", 1.3); }
    else if (role === "waypoint") { g.append("path").attr("d", "M0,-5 L4.5,0 L0,5 L-4.5,0 Z").attr("fill", ink).attr("stroke", ring).attr("stroke-width", 1.3); }
    else if (role === "justice") { g.append("rect").attr("x", -4).attr("y", -4).attr("width", 8).attr("height", 8).attr("fill", ink).attr("stroke", ring).attr("stroke-width", 1.3); }
  }
  function shapeLegendRow(role, label) {
    return '<div class="legend-row"><span class="swatch-shape legend-shape-slot" data-role="' + role + '"></span>' + esc(label) + '</div>';
  }

  function buildEventTicks() {
    EVENTS.forEach(e => {
      const tick = document.createElement("div");
      tick.className = "event-tick";
      tick.style.left = ((e.year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN) * 100) + "%";
      tick.title = e.yearLabel + " · " + e.titleZh;
      tick.addEventListener("click", ev => { ev.stopPropagation(); jumpToEvent(e.id); });
      eventTicksEl.appendChild(tick);
    });
  }
  function buildTable() {
    const sorted = EVENTS.slice().sort((a, b) => a.year - b.year);
    const rows = sorted.map(e => {
      const loc = e.lon != null ? nearestPort(e.lon, e.lat) : null;
      return '<tr><td class="year">' + esc(e.yearLabel) + '</td>' +
        '<td class="title" data-event="' + esc(e.id) + '">' + esc(e.titleZh) + '</td>' +
        '<td>第' + esc(String(e.stage)) + '阶段</td><td>' + (loc ? esc(loc.nameZh) : "—") + '</td>' +
        '<td>' + esc((e.sources || []).join("; ")) + '</td></tr>';
    }).join("");
    tableEl.innerHTML = '<thead><tr><th>年份</th><th>事件</th><th>阶段</th><th>地点</th><th>出处</th></tr></thead><tbody>' + rows + '</tbody>';
    tableEl.querySelectorAll("[data-event]").forEach(a => a.addEventListener("click", () => jumpToEvent(a.getAttribute("data-event"))));
    biblioEl.innerHTML = BIBLIOGRAPHY.map(b =>
      '<li><b>' + esc(b.key) + '</b> — ' + esc(b.full) + '<span class="bib-type">' + esc(b.type) + '</span></li>'
    ).join("");
  }

  // ================= 导览引擎 =================
  const TOUR = [
    { from: 1650, to: 1690, stage: 1, dur: 12000 },
    { from: 1690, to: 1712, stage: 2, dur: 13000 },
    { from: 1712, to: 1722, stage: 3, dur: 11000 },
    { from: 1722, to: 1730, stage: 4, dur: 9000 }
  ];
  function startTour() {
    state.tour = true; state.segIdx = 0; state.segStart = performance.now();
    const s = TOUR[0];
    state.stage = s.stage; camTarget = STAGE_CAMS[s.stage];
    showStageTitle(s); tourProgress.classList.add("on"); setPlayLabel();
  }
  function stopTour() {
    if (!state.tour) return;
    state.tour = false; tourProgress.classList.remove("on"); setPlayLabel();
  }
  function showStageTitle(seg) {
    const s = STAGE_MAP[seg.stage];
    stKicker.textContent = s.label; stTitle.textContent = s.titleZh;
    stSub.textContent = s.titleEn + " · " + s.years;
    stageTitle.classList.add("show");
    clearTimeout(titleTimer);
    titleTimer = setTimeout(() => stageTitle.classList.remove("show"), 3000);
  }
  function advanceTour(now, dt) {
    const seg = TOUR[state.segIdx];
    const p = Math.min(1, (now - state.segStart) / seg.dur);
    state.year = seg.from + (seg.to - seg.from) * p;
    if (state.stage !== seg.stage) { state.stage = seg.stage; camTarget = STAGE_CAMS[seg.stage]; showStageTitle(seg); }
    tourProgressFill.style.width = (100 * (state.segIdx + p) / TOUR.length) + "%";
    if (p >= 1) {
      state.segIdx = (state.segIdx + 1) % TOUR.length;
      state.segStart = now;
      const ns = TOUR[state.segIdx];
      state.stage = ns.stage; camTarget = STAGE_CAMS[ns.stage]; showStageTitle(ns);
    }
    const act = activeRoutes();
    if (act.length) camTarget = fitRoutesCam(act);
    render();
  }
  function setPlayLabel() {
    btnPlay.textContent = state.tour ? "⏸ 暂停" : "▶ 导览";
    btnPlay.setAttribute("aria-pressed", state.tour ? "true" : "false");
  }

  // ================= 音乐（WebAudio 程序生成） =================
  const MELODY = [440, 523.25, 659.25, 783.99, 659.25, 523.25, 440, 587.33, 523.25, 440, 392.00, 440, 523.25, 587.33, 659.25, 587.33, 523.25, 440, 329.63, 392.00, 440, 523.25, 440, 0];
  const DRONE = [[110, 220, 329.63], [87.31, 174.61, 261.63]];
  const music = {
    ctx: null, master: null, on: false, timer: null, mi: 0, di: 0, nextM: 0, nextD: 0,
    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = 0; this.master.connect(this.ctx.destination);
      // 海浪氛围（滤波噪声 + 慢速 LFO）
      const len = 4, buf = this.ctx.createBuffer(1, this.ctx.sampleRate * len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const filt = this.ctx.createBiquadFilter(); filt.type = "lowpass"; filt.frequency.value = 380; filt.Q.value = 0.6;
      const wg = this.ctx.createGain(); wg.gain.value = 0.05;
      const lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.07;
      const lfoG = this.ctx.createGain(); lfoG.gain.value = 160;
      lfo.connect(lfoG); lfoG.connect(filt.frequency);
      src.connect(filt); filt.connect(wg); wg.connect(this.master);
      src.start(); lfo.start();
    },
    pluck(t, f) {
      const o = this.ctx.createOscillator(); o.type = "triangle"; o.frequency.value = f;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 1.3);
    },
    drone(t, freqs, dur) {
      freqs.forEach(f => {
        const o = this.ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.055, t + 1.6);
        g.gain.linearRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur);
      });
    },
    schedule() {
      const t = this.ctx.currentTime;
      while (this.nextM < t + 0.6) {
        const f = MELODY[this.mi % MELODY.length]; this.mi++;
        if (f > 0) this.pluck(this.nextM, f);
        this.nextM += 0.5;
      }
      while (this.nextD < t + 1.0) {
        this.drone(this.nextD, DRONE[this.di % 2], 6.0); this.di++;
        this.nextD += 6.0;
      }
    },
    enable() {
      if (!this.ctx) this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setValueAtTime(this.master.gain.value, this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 1.0);
      this.on = true; this.mi = 0; this.di = 0;
      this.nextM = this.ctx.currentTime + 0.1; this.nextD = this.ctx.currentTime + 0.1;
      this.timer = setInterval(() => this.schedule(), 200);
    },
    disable() {
      if (!this.ctx) return;
      clearInterval(this.timer); this.timer = null; this.on = false;
      this.master.gain.cancelScheduledValues(this.ctx.currentTime);
      this.master.gain.setValueAtTime(this.master.gain.value, this.ctx.currentTime);
      this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
    }
  };
  function toggleMusic() {
    if (music.on) { music.disable(); btnMusic.textContent = "♪ 音乐"; btnMusic.setAttribute("aria-pressed", "false"); }
    else { music.enable(); btnMusic.textContent = "♪ 音乐（开）"; btnMusic.setAttribute("aria-pressed", "true"); }
  }

  // ================= 主循环 =================
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(50, now - last); last = now;
    if (state.tour) advanceTour(now, dt);
    const f = 1 - Math.exp(-dt / 300);
    camera.x += (camTarget.x - camera.x) * f;
    camera.y += (camTarget.y - camera.y) * f;
    camera.k += (camTarget.k - camera.k) * f;
    flowOffset -= dt * 0.06;
    pingT = now;
    draw();
    requestAnimationFrame(frame);
  }

  // ================= 交互 =================
  function fitRoutesCam(routes) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    routes.forEach(r => r.path.forEach(([lon, lat]) => {
      x0 = Math.min(x0, lon); x1 = Math.max(x1, lon);
      y0 = Math.min(y0, lat); y1 = Math.max(y1, lat);
    }));
    const span = Math.max(x1 - x0, (y1 - y0) * 1.6);
    return cam((x0 + x1) / 2, (y0 + y1) / 2, clamp(3.6 - span / 50, 1.4, 3.2));
  }
  function fitRoute(r) { camTarget = fitRoutesCam([r]); }
  function activeRoutes() {
    return PIRATE_ROUTES.filter(r => state.year >= r.start && state.year <= r.end && (state.stage === 0 || r.stage === state.stage));
  }
  function bind() {
    slider.addEventListener("input", () => { stopTour(); state.year = +slider.value; render(); });
    btnPlay.addEventListener("click", () => { state.tour ? stopTour() : startTour(); });
    btnTheme.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", theme);
      btnTheme.textContent = theme === "dark" ? "浅色模式" : "深色模式";
      applyTheme();
    });
    btnMusic.addEventListener("click", toggleMusic);
    btnTable.addEventListener("click", () => {
      const open = tableView.hidden;
      tableView.hidden = !open;
      btnTable.setAttribute("aria-pressed", open ? "true" : "false");
    });
    document.getElementById("detail-close").addEventListener("click", () => { detailEl.hidden = true; });
    detailEl.addEventListener("click", ev => { if (ev.target === detailEl) detailEl.hidden = true; });

    mainCanvas.addEventListener("mousemove", ev => {
      const rect = mainCanvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      const [wx, wy] = mouseToWorld(mx, my);
      const hp = nearestPortHit(wx, wy);
      const hr = hp ? null : hitRoute(wx, wy);
      const key = hp ? "p" + hp.id : (hr ? "r" + hr.id : null);
      const changed = key !== hoverKey;
      hoverKey = key; hoverPort = hp; hoverRoute = hr;
      if (changed) {
        if (hp) showTooltip(mx, my, '<div class="tt-name">' + esc(hp.nameZh) + '</div><div class="tt-sub">' + esc(hp.nameEn) + '</div><div class="tt-sub">' + esc(ROLE_LABEL[hp.role] || "") + ' · ' + esc(hp.active) + '</div>');
        else if (hr) showTooltip(mx, my, '<div class="tt-name">' + esc(hr.nameZh) + '</div><div class="tt-sub">' + esc(hr.nameEn) + '</div><div class="tt-sub">' + esc(hr.start) + '–' + esc(hr.end) + '</div>');
        else hideTooltip();
      } else if (hp || hr) positionTooltip(mx, my);
      mainCanvas.style.cursor = key ? "pointer" : "default";
    });
    mainCanvas.addEventListener("mouseleave", () => { hoverKey = null; hoverPort = null; hoverRoute = null; hideTooltip(); });
    mainCanvas.addEventListener("click", ev => {
      const rect = mainCanvas.getBoundingClientRect();
      const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      const [wx, wy] = mouseToWorld(mx, my);
      const hp = nearestPortHit(wx, wy);
      if (hp) { stopTour(); camTarget = cam(hp.lon, hp.lat, 3.2); showDetail("port", hp.id); return; }
      const hr = hitRoute(wx, wy);
      if (hr) { stopTour(); fitRoute(hr); showDetail("route", hr.id); return; }
      detailEl.hidden = true;
    });
  }

  // ================= 初始化 =================
  document.documentElement.setAttribute("data-theme", theme);
  btnTheme.textContent = "浅色模式";
  resize();
  buildBase();
  buildStages();
  buildEventTicks();
  buildTable();
  bind();
  applyTheme();
  window.addEventListener("resize", () => { resize(); draw(); });
  requestAnimationFrame(frame);
  bootTimer = setTimeout(startTour, 1100);
})();
