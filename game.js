const VIEW_WIDTH = 1600;
const VIEW_HEIGHT = 900;
const MAP_COLUMNS = 4;
const MAP_ROWS = 3;
const MAP_SEGMENTS = MAP_COLUMNS;
const CAMERA_ZOOM = 1.48;
const WORLD_WIDTH = VIEW_WIDTH * MAP_COLUMNS;
const WORLD_HEIGHT = VIEW_HEIGHT * MAP_ROWS;
const TILE = 50;
const COLS = WORLD_WIDTH / TILE;
const ROWS = WORLD_HEIGHT / TILE;
const STARTING_RANK_TARGET = 100;
const ELITE_AI_COUNT = 6;
const STARTING_NON_ELITE_AIS = 18;
const MAX_ACTIVE_AIS = 34;
const RANKED_SECONDS = 180;
const AI_DECISION_INTERVAL = 0.4;
const POWER_WARNING_SECONDS = 3;
const TOP_BOUNTY_BONUS = 2600;
const TOP_PELLET_MULTIPLIER = 0.8;
const POWER_SIZE_MULTIPLIER = 1.18;
const HIGH_SCORE_HUNT_FLOOR = 1200;
const MAX_HUNTERS_PER_TARGET = 4;
const PLAYER_PRESSURE_HUNTERS = 2;
const AI_HUNT_RANGE = 4200;
const AI_WEAPON_DETOUR_RANGE = 1650;
const GROWTH_CONFIG = {
  smallPelletGrowth: 1,
  coinGrowth: 2,
  powerPelletGrowth: 10,
  aiKillGrowth: 20,
  sentinelKillGrowth: 12,
  bountyKillGrowth: 30,
  massPerGrowth: 0.015,
  maxMass: 3.2,
  level2Mass: 1.3,
  level3Mass: 1.7,
  level4Mass: 2.2,
  level5Mass: 3,
  maxVisualScale: 1.55,
  pickupRadiusBase: 18,
  pickupRadiusPerMass: 8,
  bigPlayerBountyBonus: 300,
  giantPlayerBountyBonus: 500
};
const RANK_POINT_TIERS = [
  { min: 0, max: 199, name: "青铜海湾", stars: 1 },
  { min: 200, max: 399, name: "青铜海湾", stars: 2 },
  { min: 400, max: 699, name: "白银码头", stars: 1 },
  { min: 700, max: 999, name: "白银码头", stars: 2 },
  { min: 1000, max: 1399, name: "黄金港口", stars: 1 },
  { min: 1400, max: 1799, name: "黄金港口", stars: 2 },
  { min: 1800, max: 2299, name: "铂金海域", stars: 1 },
  { min: 2300, max: Infinity, name: "王者灯塔", stars: 2 }
];

const skinCatalog = {
  royal: { name: "Royal Chomper", cnName: "皇家咔咔兽", rarity: "Legendary", owned: true, equipped: true, price: 0 },
  pirate: { name: "Pirate Chomper", cnName: "海盗咔咔兽", rarity: "Rare", owned: false, price: 1200 },
  neon: { name: "Neon Chomper", cnName: "霓虹咔咔兽", rarity: "Epic", owned: false, price: 1800 },
  cowboy: { name: "Cowboy Chomper", cnName: "牛仔咔咔兽", rarity: "Rare", owned: false, price: 1200 }
};

const aiTemplates = [
  { name: "海风Ruby", skin: "crab", personality: "hunter" },
  { name: "Finn今天上分", skin: "fishman", personality: "farmer" },
  { name: "Otto在码头", skin: "octopus", personality: "raider" },
  { name: "船长阿凯", skin: "captain", personality: "hunter" },
  { name: "Bubble小号", skin: "blueMonster", personality: "coward" }
];

const eliteTemplates = [
  { name: "榜一·港口王", skin: "captain", personality: "elite" },
  { name: "榜二·金豆猎手", skin: "crab", personality: "elite" },
  { name: "榜三·浪花小陈", skin: "fishman", personality: "elite" },
  { name: "榜四·Otto大号", skin: "octopus", personality: "elite" },
  { name: "榜五·灯塔阿杰", skin: "blueMonster", personality: "elite" },
  { name: "榜六·南港船长", skin: "captain", personality: "elite" }
];

const wechatNameParts = {
  prefix: ["海风", "码头", "小鱼", "阿强", "南港", "月亮", "椰子", "咔咔", "今天", "老街", "晴天", "泡泡", "木桶", "灯塔", "浪花", "港口", "小陈", "阿杰", "小林", "鱼丸"],
  suffix: ["上分中", "不加班", "冲第一", "路过", "吃豆豆", "别追我", "开船啦", "微信用户", "今晚赢", "打卡", "慢慢来", "有护盾", "捡金币", "在迷宫", "别蹲我", "好运来"]
};

const toolTypes = [
  { type: "speed", label: "获得加速：移动速度提升！" },
  { type: "shield", label: "护盾启动：抵挡一次攻击！" },
  { type: "magnet", label: "磁吸启动：自动吸收豆子！" },
  { type: "freeze", label: "冰冻脉冲：附近敌人减速！" },
  { type: "cloak", label: "进入伪装：敌人暂时失去目标！" }
];

const app = document.getElementById("app");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const hud = document.getElementById("hud");
const controls = document.getElementById("controls");
const leaderboard = document.getElementById("leaderboard");
const leaderList = document.getElementById("leaderList");
const messageStack = document.getElementById("messageStack");
const boostCooldownEl = document.getElementById("boostCooldown");
const stick = document.getElementById("stick");
const joystick = document.getElementById("joystick");

const ui = {
  mainMenu: document.getElementById("mainMenu"),
  settingsScreen: document.getElementById("settingsScreen"),
  shopScreen: document.getElementById("shopScreen"),
  resultScreen: document.getElementById("resultScreen"),
  practiceBtn: document.getElementById("practiceBtn"),
  rankedBtn: document.getElementById("rankedBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsBackBtn: document.getElementById("settingsBackBtn"),
  settingsConfirmBtn: document.getElementById("settingsConfirmBtn"),
  layoutLeftBtn: document.getElementById("layoutLeftBtn"),
  layoutRightBtn: document.getElementById("layoutRightBtn"),
  musicToggle: document.getElementById("musicToggle"),
  sfxToggle: document.getElementById("sfxToggle"),
  shopBtn: document.getElementById("shopBtn"),
  shopBackBtn: document.getElementById("shopBackBtn"),
  skinGrid: document.getElementById("skinGrid"),
  walletCoins: document.getElementById("walletCoins"),
  shopCoins: document.getElementById("shopCoins"),
  rankStars: document.getElementById("rankStars"),
  againBtn: document.getElementById("againBtn"),
  homeBtn: document.getElementById("homeBtn"),
  resultTitle: document.getElementById("resultTitle"),
  resultLine: document.getElementById("resultLine"),
  resultRank: document.getElementById("resultRank"),
  resultScore: document.getElementById("resultScore"),
  resultKills: document.getElementById("resultKills"),
  resultCombo: document.getElementById("resultCombo"),
  resultCoins: document.getElementById("resultCoins"),
  resultStars: document.getElementById("resultStars"),
  starDeltaWrap: document.getElementById("starDeltaWrap")
};

const hudEls = {
  score: document.getElementById("hudScore"),
  hp: document.getElementById("hudHp"),
  combo: document.getElementById("hudCombo"),
  power: document.querySelector("#powerHud b"),
  coins: document.getElementById("hudCoins"),
  rank: document.getElementById("hudRank"),
  growth: document.getElementById("hudGrowth"),
  time: document.getElementById("hudTime"),
  mode: document.getElementById("hudMode"),
  bounty: document.getElementById("bountyLine")
};

const saveKey = "chomperRushSaveV1";
let save = loadSave();
let playerStats = createPlayerStats();
let images = {};
let grid = buildGrid();
let cells = collectWalkableCells();
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let viewportWidth = VIEW_WIDTH;
let viewportHeight = VIEW_HEIGHT;
let cameraX = 0;
let cameraY = 0;
let gameState = "menu";
let lastTime = performance.now();
let previewTime = 0;
let mode = "Endless";
let lastRank = 1;
let currentRank = 1;
let rankMap = new Map();
let finalRankSnapshot = null;
let rankedStarDelta = 0;
let lastBountyId = "";
let safeNoticeStep = -1;
let centerBonusNotice = false;

let player;
let aiPlayers = [];
let systemPlayers = [];
let sentinels = [];
let pellets = [];
let powerPellets = [];
let coins = [];
let tools = [];
let hotLootSpots = [];
let particles = [];
let elapsed = 0;
let rankedTimeLeft = RANKED_SECONDS;
let spawnToolTimer = 0;
let pelletRefreshTimer = 0;
let coinRefreshTimer = 0;
let powerRefreshTimer = 0;
let powerWarningTimer = 0;
let resourceHotspotTimer = 0;
let pendingPowerSpawns = [];
let joinTimer = 0;
let entrantSerial = 0;
let fieldBanner = { text: "", timer: 0, color: "#ffd66b" };

let joystickState = { active: false, id: null, x: 0, y: 0, dx: 0, dy: 0 };
let keyVector = { x: 0, y: 0 };
let audioEngine;
let resizeFrame = 0;
let resizeTimer = 0;

resize();
renderShop();
syncMeta();
bindEvents();
scheduleResize();
generatePickups();
requestAnimationFrame(loop);

function loadSave() {
  try {
    const parsed = JSON.parse(localStorage.getItem(saveKey) || "{}");
    return {
      coins: Number.isFinite(parsed.coins) ? parsed.coins : 3250,
      stars: Number.isFinite(parsed.stars) ? parsed.stars : 2,
      wins: Number.isFinite(parsed.wins) ? parsed.wins : 12,
      losses: Number.isFinite(parsed.losses) ? parsed.losses : 5,
      rankPoints: Number.isFinite(parsed.rankPoints) ? parsed.rankPoints : 320,
      bestRank: Number.isFinite(parsed.bestRank) ? parsed.bestRank : 6,
      equippedSkin: parsed.equippedSkin || "royal",
      ownedSkins: { royal: true, ...(parsed.ownedSkins || {}) },
      settings: {
        controlsLayout: parsed.settings?.controlsLayout === "right" ? "right" : "left",
        music: parsed.settings?.music !== false,
        sfx: parsed.settings?.sfx !== false
      }
    };
  } catch {
    return { coins: 3250, stars: 2, wins: 12, losses: 5, rankPoints: 320, bestRank: 6, equippedSkin: "royal", ownedSkins: { royal: true }, settings: { controlsLayout: "left", music: true, sfx: true } };
  }
}

function createPlayerStats() {
  return {
    wins: save.wins,
    losses: save.losses,
    rankPoints: save.rankPoints,
    coins: save.coins,
    bestRank: save.bestRank
  };
}

function syncPlayerStatsFromSave() {
  playerStats.wins = Number.isFinite(save.wins) ? save.wins : playerStats.wins;
  playerStats.losses = Number.isFinite(save.losses) ? save.losses : playerStats.losses;
  playerStats.rankPoints = Number.isFinite(save.rankPoints) ? save.rankPoints : playerStats.rankPoints;
  playerStats.coins = Number.isFinite(save.coins) ? save.coins : playerStats.coins;
  playerStats.bestRank = Number.isFinite(save.bestRank) ? save.bestRank : playerStats.bestRank;
  return playerStats;
}

function persistSave() {
  localStorage.setItem(saveKey, JSON.stringify(save));
  syncMeta();
}

function syncMeta() {
  const stats = syncPlayerStatsFromSave();
  const rank = getRankByPoints(stats.rankPoints);
  ui.walletCoins.textContent = formatNumber(stats.coins);
  if (ui.shopCoins) ui.shopCoins.textContent = formatNumber(stats.coins);
  ui.rankStars.textContent = `${rank.name} ${"★".repeat(rank.stars)}`;
  syncSettingsUI();
  applyControlLayout();
}

function buildGrid() {
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  const mark = (x, y) => {
    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) g[y][x] = 1;
  };
  const addH = (y, x1, x2, w = 1) => {
    for (let x = x1; x <= x2; x++) for (let yy = y - w; yy <= y + w; yy++) mark(x, yy);
  };
  const addV = (x, y1, y2, w = 1) => {
    for (let y = y1; y <= y2; y++) for (let xx = x - w; xx <= x + w; xx++) mark(xx, y);
  };
  const addRoom = (x1, y1, x2, y2) => {
    for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) mark(x, y);
  };

  addRoom(13, 7, 19, 10);
  addH(2, 2, 13); addV(2, 2, 10); addH(10, 2, 8); addV(8, 8, 15); addH(15, 8, 20);
  addV(20, 12, 15); addH(12, 16, 25); addV(25, 8, 12); addH(8, 22, 30); addV(30, 2, 14);
  addH(2, 20, 30); addV(20, 2, 6); addH(6, 14, 20); addV(14, 2, 6);
  addH(4, 5, 11); addV(11, 4, 10); addH(10, 11, 18); addV(18, 8, 12);
  addH(14, 21, 30); addV(5, 5, 12); addH(12, 5, 11); addV(14, 10, 15);
  addH(4, 22, 29); addV(23, 4, 8); addH(6, 23, 28); addV(28, 6, 14);
  addH(16, 2, 8); addH(16, 20, 29); addRoom(1, 12, 4, 15); addRoom(27, 3, 30, 6);
  addRoom(22, 13, 26, 15); addRoom(9, 2, 12, 4); addRoom(15, 14, 18, 16);
  const baseCols = VIEW_WIDTH / TILE;
  const baseRows = VIEW_HEIGHT / TILE;
  const baseCells = [];
  for (let y = 0; y < baseRows; y++) {
    for (let x = 0; x < baseCols; x++) {
      if (g[y][x]) baseCells.push({ x, y });
    }
  }

  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLUMNS; col++) {
      if (row === 0 && col === 0) continue;
      const ox = col * baseCols;
      const oy = row * baseRows;
      baseCells.forEach((cell) => mark(cell.x + ox, cell.y + oy));
    }
  }

  for (let row = 0; row < MAP_ROWS; row++) {
    const oy = row * baseRows;
    for (let col = 0; col < MAP_COLUMNS - 1; col++) {
      const seam = (col + 1) * baseCols;
      addH(oy + 2, seam - 2, seam + 2);
      addH(oy + 8, seam - 2, seam + 2);
      addH(oy + 12, seam - 2, seam + 2);
      addH(oy + 15, seam - 2, seam + 2);
    }
  }
  for (let row = 0; row < MAP_ROWS - 1; row++) {
    const seamY = (row + 1) * baseRows;
    for (let col = 0; col < MAP_COLUMNS; col++) {
      const ox = col * baseCols;
      addV(ox + 5, seamY - 2, seamY + 2);
      addV(ox + 14, seamY - 2, seamY + 2);
      addV(ox + 24, seamY - 2, seamY + 2);
      addV(ox + 30, seamY - 2, seamY + 2);
    }
  }
  return g;
}

function collectWalkableCells() {
  const list = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) if (grid[y][x]) list.push({ x, y, wx: x * TILE + TILE / 2, wy: y * TILE + TILE / 2 });
  }
  return list;
}

function bindEvents() {
  ui.practiceBtn.addEventListener("click", () => startBattle("Endless"));
  ui.rankedBtn.addEventListener("click", () => startBattle("Ranked"));
  ui.settingsBtn.addEventListener("click", showSettings);
  ui.settingsBackBtn.addEventListener("click", showMenu);
  ui.settingsConfirmBtn.addEventListener("click", showMenu);
  ui.layoutLeftBtn.addEventListener("click", () => setControlsLayout("left"));
  ui.layoutRightBtn.addEventListener("click", () => setControlsLayout("right"));
  ui.musicToggle.addEventListener("change", () => setMusicEnabled(ui.musicToggle.checked));
  ui.sfxToggle.addEventListener("change", () => setSfxEnabled(ui.sfxToggle.checked));
  if (ui.shopBtn) ui.shopBtn.addEventListener("click", showShop);
  if (ui.shopBackBtn) ui.shopBackBtn.addEventListener("click", showMenu);
  ui.homeBtn.addEventListener("click", showMenu);
  ui.againBtn.addEventListener("click", () => startBattle(mode));

  joystick.addEventListener("pointerdown", onJoyStart);
  window.addEventListener("pointermove", onJoyMove);
  window.addEventListener("pointerup", onJoyEnd);
  window.addEventListener("pointercancel", onJoyEnd);
  document.getElementById("boostBtn").addEventListener("pointerdown", activateBoost);

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") keyVector.x = -1;
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") keyVector.x = 1;
    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") keyVector.y = -1;
    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") keyVector.y = 1;
    if (event.code === "Space") activateBoost();
  });
  window.addEventListener("keyup", (event) => {
    if (["ArrowLeft", "ArrowRight", "a", "d"].includes(event.key.toLowerCase())) keyVector.x = 0;
    if (["ArrowUp", "ArrowDown", "w", "s"].includes(event.key.toLowerCase())) keyVector.y = 0;
  });
  window.addEventListener("resize", scheduleResize);
  window.addEventListener("orientationchange", scheduleResize);
  window.visualViewport?.addEventListener("resize", scheduleResize);
  window.addEventListener("pageshow", scheduleResize);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) scheduleResize();
  });
}

function showMenu() {
  gameState = "menu";
  stopMusic();
  setScreen(ui.mainMenu);
  hud.classList.add("hidden");
  controls.classList.add("hidden");
  leaderboard.classList.add("hidden");
}

function showSettings() {
  gameState = "settings";
  setScreen(ui.settingsScreen);
  hud.classList.add("hidden");
  controls.classList.add("hidden");
  leaderboard.classList.add("hidden");
  playSfx("button");
}

function showShop() {
  if (!ui.shopScreen) return;
  gameState = "shop";
  renderShop();
  setScreen(ui.shopScreen);
  hud.classList.add("hidden");
  controls.classList.add("hidden");
  leaderboard.classList.add("hidden");
}

function setControlsLayout(layout) {
  save.settings.controlsLayout = layout;
  persistSave();
  playSfx("button");
}

function setMusicEnabled(enabled) {
  save.settings.music = enabled;
  persistSave();
  if (enabled && gameState === "battle") startMusic();
  else stopMusic();
}

function setSfxEnabled(enabled) {
  save.settings.sfx = enabled;
  persistSave();
  if (enabled) playSfx("button");
}

function syncSettingsUI() {
  if (!ui.layoutLeftBtn) return;
  const isLeft = save.settings.controlsLayout !== "right";
  ui.layoutLeftBtn.classList.toggle("active", isLeft);
  ui.layoutRightBtn.classList.toggle("active", !isLeft);
  ui.musicToggle.checked = save.settings.music;
  ui.sfxToggle.checked = save.settings.sfx;
}

function applyControlLayout() {
  controls.classList.toggle("reversed", save.settings.controlsLayout === "right");
}

function ensureAudio() {
  if (!audioEngine) audioEngine = createAudioEngine();
  audioEngine.unlock();
}

function startMusic() {
  if (!save.settings.music) return;
  ensureAudio();
  audioEngine.startMusic();
}

function stopMusic() {
  if (audioEngine) audioEngine.stopMusic();
}

function playSfx(type) {
  if (!save.settings.sfx) return;
  ensureAudio();
  audioEngine.sfx(type);
}

function createAudioEngine() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return { unlock() {}, startMusic() {}, stopMusic() {}, sfx() {} };
  const ac = new AudioContext();
  const master = ac.createGain();
  master.gain.value = 0.28;
  master.connect(ac.destination);
  let musicTimer = 0;
  let beat = 0;
  const melody = [196, 247, 294, 330, 294, 247, 220, 247, 294, 392, 330, 294, 247, 220, 196, 165];
  const bass = [98, 98, 123, 123, 110, 110, 147, 147];

  const tone = (freq, time, duration, type = "square", gain = 0.12, dest = master, slideTo = 0) => {
    const osc = ac.createOscillator();
    const env = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), time + duration);
    env.gain.setValueAtTime(0.0001, time);
    env.gain.exponentialRampToValueAtTime(gain, time + 0.018);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(env);
    env.connect(dest);
    osc.start(time);
    osc.stop(time + duration + 0.03);
  };

  const noise = (time, duration, gain = 0.08) => {
    const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * duration), ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    const env = ac.createGain();
    src.buffer = buffer;
    env.gain.setValueAtTime(gain, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    src.connect(env);
    env.connect(master);
    src.start(time);
  };

  const startMusic = () => {
    if (musicTimer) return;
    const schedule = () => {
      if (ac.state === "suspended") return;
      const now = ac.currentTime + 0.04;
      const note = melody[beat % melody.length];
      const bassNote = bass[beat % bass.length];
      tone(note, now, 0.12, "square", 0.035);
      if (beat % 2 === 0) tone(bassNote, now, 0.18, "triangle", 0.05);
      if (beat % 4 === 0) noise(now, 0.035, 0.03);
      beat += 1;
    };
    schedule();
    musicTimer = window.setInterval(schedule, 145);
  };

  const stopMusic = () => {
    if (musicTimer) window.clearInterval(musicTimer);
    musicTimer = 0;
  };

  const sfx = (type) => {
    if (ac.state === "suspended") ac.resume();
    const now = ac.currentTime;
    if (type === "pellet") tone(660, now, 0.055, "sine", 0.045, master, 880);
    else if (type === "coin") {
      tone(880, now, 0.07, "triangle", 0.07);
      tone(1320, now + 0.055, 0.09, "triangle", 0.055);
    } else if (type === "power") {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, now + i * 0.045, 0.16, "square", 0.06));
    } else if (type === "hit") {
      tone(180, now, 0.24, "sawtooth", 0.12, master, 65);
      noise(now, 0.18, 0.09);
    } else if (type === "shield") {
      tone(440, now, 0.12, "triangle", 0.08, master, 220);
      tone(880, now + 0.02, 0.14, "sine", 0.055);
    } else if (type === "boost") {
      tone(260, now, 0.15, "sawtooth", 0.07, master, 720);
      noise(now, 0.08, 0.04);
    } else if (type === "defeat") {
      [330, 440, 660, 990].forEach((f, i) => tone(f, now + i * 0.04, 0.13, "square", 0.06));
    } else if (type === "grow") {
      tone(620, now, 0.07, "triangle", 0.045);
    } else if (type === "levelUp") {
      [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, now + i * 0.05, 0.14, "triangle", 0.055));
    } else if (type === "bounty") {
      tone(196, now, 0.16, "sawtooth", 0.08, master, 420);
      [784, 988, 1174].forEach((f, i) => tone(f, now + 0.08 + i * 0.045, 0.16, "square", 0.05));
    } else if (type === "button") {
      tone(330, now, 0.06, "triangle", 0.04);
    } else if (type === "tool") {
      tone(520, now, 0.09, "sine", 0.05);
      tone(760, now + 0.04, 0.09, "sine", 0.045);
    }
  };

  return {
    unlock() {
      if (ac.state === "suspended") ac.resume();
    },
    startMusic,
    stopMusic,
    sfx
  };
}

function setScreen(active) {
  [ui.mainMenu, ui.settingsScreen, ui.shopScreen, ui.resultScreen].filter(Boolean).forEach((screen) => screen.classList.remove("active"));
  active.classList.add("active");
}

function startBattle(selectedMode) {
  mode = selectedMode;
  gameState = "battle";
  ensureAudio();
  startMusic();
  playSfx("button");
  [ui.mainMenu, ui.settingsScreen, ui.shopScreen, ui.resultScreen].filter(Boolean).forEach((screen) => screen.classList.remove("active"));
  hud.classList.remove("hidden");
  controls.classList.remove("hidden");
  leaderboard.classList.remove("hidden");
  applyControlLayout();
  scheduleResize();

  elapsed = 0;
  rankedTimeLeft = RANKED_SECONDS;
  spawnToolTimer = 0;
  pelletRefreshTimer = 0;
  coinRefreshTimer = 0;
  powerRefreshTimer = 0;
  powerWarningTimer = 0;
  resourceHotspotTimer = 8;
  pendingPowerSpawns = [];
  joinTimer = 2;
  entrantSerial = 0;
  lastRank = STARTING_RANK_TARGET;
  currentRank = STARTING_RANK_TARGET;
  rankedStarDelta = 0;
  finalRankSnapshot = null;
  lastBountyId = "";
  safeNoticeStep = -1;
  centerBonusNotice = false;
  fieldBanner = { text: "吃豆变大，抢星星反杀，击败巨型玩家爆资源！", timer: 3.2, color: "#fff08a" };
  particles = [];
  hotLootSpots = [];

  const spawn = tileCenter(16, 9);
  player = {
    id: "you",
    name: "YOU",
    x: spawn.x,
    y: spawn.y,
    radius: 28,
    skin: save.equippedSkin,
    score: 0,
    coins: 0,
    kills: 0,
    hp: 1,
    combo: 0,
    maxCombo: 0,
    power: 0,
    shield: 0,
    magnet: 0,
    cloak: 0,
    speedBuff: 0,
    boostCooldown: 0,
    boostActive: 0,
    hitCooldown: 0,
    growth: 0,
    mass: 1,
    sizeLevel: 1,
    auraLevel: 1,
    lastSizeLevel: 1,
    growPulse: 0,
    levelPulse: 0,
    lastDir: { x: 1, y: 0 }
  };

  aiPlayers = [];
  systemPlayers = createSystemPlayers(ELITE_AI_COUNT + STARTING_NON_ELITE_AIS);
  eliteTemplates.forEach((template, index) => {
    aiPlayers.push(createAICompetitor(template, index, 90000 - index * 5200, {
      elite: true,
      rankSeed: index + 1,
      radius: 34,
      spawnPredicate: (cell) => cell.x > 48 && distance(cell.wx, cell.wy, player.x, player.y) > 1700 && isSpawnCellOpen(cell, 360)
    }));
  });
  for (let i = 0; i < STARTING_NON_ELITE_AIS; i++) {
    const template = i < aiTemplates.length ? aiTemplates[i] : makeEntrantTemplate(i + 80);
    aiPlayers.push(createAICompetitor(template, i + ELITE_AI_COUNT, Math.max(120, 150 + i * 42 + rand(-50, 140)), {
      spawnPredicate: (cell) => distance(cell.wx, cell.wy, player.x, player.y) > 560 && isSpawnCellOpen(cell, 285)
    }));
  }

  sentinels = [
    makeSentinel("sentinel-crab", "crab", [{ x: 3, y: 13 }, { x: 8, y: 13 }, { x: 8, y: 10 }, { x: 3, y: 10 }]),
    makeSentinel("sentinel-octopus", "octopus", [{ x: 14, y: 14 }, { x: 18, y: 14 }, { x: 18, y: 10 }, { x: 14, y: 10 }]),
    makeSentinel("sentinel-captain", "captain", [{ x: 24, y: 4 }, { x: 29, y: 4 }, { x: 29, y: 12 }, { x: 24, y: 12 }]),
    makeSentinel("sentinel-crab-east", "crab", [{ x: 36, y: 13 }, { x: 43, y: 13 }, { x: 43, y: 8 }, { x: 36, y: 8 }]),
    makeSentinel("sentinel-octopus-east", "octopus", [{ x: 50, y: 14 }, { x: 58, y: 14 }, { x: 58, y: 10 }, { x: 50, y: 10 }]),
    makeSentinel("sentinel-captain-deep", "captain", [{ x: 72, y: 4 }, { x: 93, y: 4 }, { x: 93, y: 12 }, { x: 72, y: 12 }])
  ];
  if (mode === "Endless") sentinels.splice(3);
  sentinels.push(
    makeSentinel("sentinel-center-crab", "crab", [{ x: 43, y: 15 }, { x: 49, y: 15 }, { x: 49, y: 22 }, { x: 43, y: 22 }]),
    makeSentinel("sentinel-center-captain", "captain", [{ x: 54, y: 14 }, { x: 61, y: 14 }, { x: 61, y: 24 }, { x: 54, y: 24 }])
  );

  generatePickups();
  for (let i = 0; i < 3; i++) spawnTool();
  updateLeaderboardUI();
}

function makeSentinel(id, type, routeTiles) {
  const start = tileCenter(routeTiles[0].x, routeTiles[0].y);
  return {
    id,
    type,
    name: type === "crab" ? "红色螃蟹守卫" : type === "octopus" ? "紫色章鱼守卫" : "绿色船长守卫",
    x: start.x,
    y: start.y,
    radius: 30,
    route: routeTiles.map((t) => tileCenter(t.x, t.y)),
    routeIndex: 1,
    state: "patrol",
    path: [],
    respawn: 0,
    frozen: 0,
    warned: false
  };
}

function spawnPowerGuard(x, y) {
  // Power stars get a visible patrol guard instead of an invisible instant hazard.
  if (sentinels.filter((s) => s.powerGuard && s.respawn <= 0).length >= 8) return;
  const anchor = nearestTile(x, y);
  const offsets = [[-2, 0], [0, -2], [2, 0], [0, 2], [-1, 1], [1, -1]];
  const route = offsets
    .map(([dx, dy]) => ({ x: clamp(anchor.x + dx, 0, COLS - 1), y: clamp(anchor.y + dy, 0, ROWS - 1) }))
    .filter((tile) => grid[tile.y]?.[tile.x] === 1)
    .slice(0, 4);
  if (route.length < 3) route.push(anchor);
  const guard = makeSentinel(`power-guard-${Date.now()}-${Math.floor(Math.random() * 9999)}`, Math.random() < 0.55 ? "crab" : "captain", route);
  guard.powerGuard = true;
  guard.anchorX = x;
  guard.anchorY = y;
  guard.radius = 27;
  sentinels.push(guard);
}

function createAICompetitor(template, index, score = 0, options = {}) {
  const cell = randomCell(options.spawnPredicate || ((c) => !player || (distance(c.wx, c.wy, player.x, player.y) > 520 && isSpawnCellOpen(c, 240))));
  const startingGrowth = options.elite ? Math.min(145, 55 + index * 8) : clamp(Math.floor(score / 52), 0, 38);
  const growthState = getGrowthState(startingGrowth);
  return {
    id: `ai-${Date.now()}-${index}-${Math.floor(Math.random() * 9999)}`,
    name: template.name,
    skin: template.skin,
    personality: template.personality,
    x: cell.wx,
    y: cell.wy,
    radius: options.radius || 27,
    score,
    elite: !!options.elite,
    rankSeed: options.rankSeed || 0,
    coins: 0,
    kills: 0,
    combo: 0,
    maxCombo: 0,
    power: 0,
    shield: 0,
    magnet: 0,
    cloak: 0,
    speedBuff: 0,
    attackDrive: 0,
    frozen: 0,
    growth: startingGrowth,
    mass: growthState.mass,
    sizeLevel: growthState.level,
    auraLevel: growthState.level,
    lastSizeLevel: growthState.level,
    growPulse: 0,
    levelPulse: 0,
    respawn: 0,
    path: [],
    think: 0,
    target: null,
    intent: "farm",
    focusTargetId: null,
    huntLock: 0,
    huntBias: Math.random(),
    lastDir: { x: 1, y: 0 }
  };
}

function createSystemPlayers(activeCompetitorCount = aiTemplates.length + ELITE_AI_COUNT) {
  const players = [];
  const abovePlayer = Math.max(40, STARTING_RANK_TARGET - 1 - activeCompetitorCount);
  for (let i = 0; i < abovePlayer; i++) {
    const progress = 1 - i / Math.max(1, abovePlayer - 1);
    const score = Math.max(260, Math.round(260 + Math.pow(progress, 2.35) * 52000 + rand(-90, 120)));
    players.push({
      id: `sys-${i}`,
      name: randomWechatName(i),
      score,
      drift: rand(1.8, 9.5),
      system: true
    });
  }
  for (let i = 0; i < 24; i++) {
    players.push({
      id: `sys-low-${i}`,
      name: randomWechatName(i + 200),
      score: Math.round(rand(18, 240)),
      drift: rand(0.35, 1.8),
      system: true
    });
  }
  return players;
}

function updateSystemPlayers(dt) {
  systemPlayers.forEach((entry) => {
    entry.score += entry.drift * dt;
  });
}

function randomWechatName(seed = Math.floor(Math.random() * 9999)) {
  const prefix = wechatNameParts.prefix[seed % wechatNameParts.prefix.length];
  const suffix = wechatNameParts.suffix[(seed * 7 + Math.floor(Math.random() * 6)) % wechatNameParts.suffix.length];
  const tail = Math.random() < 0.28 ? String(Math.floor(rand(6, 99))) : "";
  return `${prefix}${suffix}${tail}`;
}

function makeEntrantTemplate(seed = Math.floor(Math.random() * 9999)) {
  const skins = ["crab", "fishman", "octopus", "captain", "blueMonster"];
  const personalities = ["hunter", "hunter", "raider", "raider", "farmer", "coward"];
  return {
    name: randomWechatName(seed + Math.floor(Math.random() * 300)),
    skin: skins[Math.floor(Math.random() * skins.length)],
    personality: personalities[Math.floor(Math.random() * personalities.length)]
  };
}

function spawnIncomingPlayer() {
  entrantSerial += 1;
  const template = makeEntrantTemplate(entrantSerial + 200);
  const nearbyScore = Math.max(120, player.score + rand(80, mode === "Ranked" ? 980 : 760));
  const newcomer = createAICompetitor(template, entrantSerial + 20, nearbyScore, {
    spawnPredicate: (cell) => distance(cell.wx, cell.wy, player.x, player.y) > 620 && isSpawnCellOpen(cell, 300)
  });
  if (aiPlayers.length < MAX_ACTIVE_AIS) {
    aiPlayers.push(newcomer);
  } else {
    const replaceIndex = findReplaceableAIIndex();
    aiPlayers[replaceIndex] = newcomer;
  }
  addRing(newcomer.x, newcomer.y, 20, 78, "#ffd66b", 0.5);
  addDust(newcomer.x, newcomer.y, 10, "#e8c083");
}

function findReplaceableAIIndex() {
  let bestIndex = 0;
  let bestScore = Infinity;
  aiPlayers.forEach((ai, index) => {
    if (ai.elite) return;
    const far = distance(ai.x, ai.y, player.x, player.y) > 360;
    const score = ai.score + (far ? -600 : 600);
    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function generatePickups() {
  pellets = [];
  powerPellets = [];
  coins = [];
  const skip = new Set(["16,9", "15,9", "17,9", "16,8", "16,10"]);
  cells.forEach((cell) => {
    const zone = getResourceZone(cell.wx, cell.wy);
    const threshold = zone === "outer" ? 0.64 : zone === "middle" ? 0.78 : 0.9;
    if (!skip.has(`${cell.x},${cell.y}`) && Math.random() > threshold) {
      pellets.push({ type: "small", x: cell.wx, y: cell.wy, radius: 8, score: Math.round(12 * getZoneScoreMultiplier(cell.wx, cell.wy)), alive: true, pulse: Math.random() * 6 });
    }
  });

  powerPellets = [];
  refreshPowerPellets({ initial: true });

  for (let i = 0; i < 88; i++) {
    const c = randomZoneCell(i < 42 ? "outer" : i < 68 ? "middle" : "center");
    const zone = getResourceZone(c.wx, c.wy);
    coins.push({ x: c.wx + rand(-8, 8), y: c.wy + rand(-8, 8), radius: zone === "center" ? 13 : 10, alive: true, spin: Math.random() * 6, value: zone === "center" && Math.random() < 0.22 ? 3 : zone === "center" ? 2 : 1 });
  }
  tools = [];
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000 || 0.016);
  lastTime = now;
  previewTime += dt;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function update(dt) {
  if (gameState !== "battle") return;
  elapsed += dt;
  if (mode === "Ranked") {
    rankedTimeLeft = Math.max(0, rankedTimeLeft - dt);
    if (rankedTimeLeft <= 0) {
      endBattle(false);
      return;
    }
  }
  joinTimer -= dt;
  if (joinTimer <= 0) {
    joinTimer = mode === "Ranked" ? rand(1.8, 3.1) : rand(2.4, 4.2);
    spawnIncomingPlayer();
  }

  updatePlayer(dt);
  updateFieldBanner(dt);
  updateSystemPlayers(dt);
  aiPlayers.forEach((ai) => updateAI(ai, dt));
  sentinels.forEach((sentinel) => updateSentinel(sentinel, dt));
  updatePowerTrails(dt);
  updatePickups(dt);
  updateHotLootSpots(dt);
  updateCombat(dt);
  updateSafety(dt);
  updateParticles(dt);
  updateLeaderboardUI();
}

function updatePlayer(dt) {
  tickBuffs(player, dt);
  player.growPulse = Math.max(0, (player.growPulse || 0) - dt);
  player.levelPulse = Math.max(0, (player.levelPulse || 0) - dt);
  let vx = joystickState.dx || keyVector.x;
  let vy = joystickState.dy || keyVector.y;
  const len = Math.hypot(vx, vy);
  if (len > 1) {
    vx /= len;
    vy /= len;
  }
  if (len > 0.05) player.lastDir = { x: vx, y: vy };
  const boost = player.boostActive > 0 ? 2.45 : 1;
  const frozenSlow = player.frozen > 0 ? 0.32 : 1;
  const massSlow = getMassSpeedFactor(player);
  const speed = (220 + (player.speedBuff > 0 ? 70 : 0)) * boost * frozenSlow * massSlow;
  moveEntity(player, vx * speed * dt, vy * speed * dt);
  if (player.boostActive > 0) addDust(player.x - player.lastDir.x * 20, player.y - player.lastDir.y * 20, 1);
}

function tickBuffs(entity, dt) {
  ["power", "magnet", "cloak", "speedBuff", "attackDrive", "boostCooldown", "boostActive", "hitCooldown", "frozen"].forEach((key) => {
    if (entity[key] > 0) entity[key] = Math.max(0, entity[key] - dt);
  });
}

function updateAI(ai, dt) {
  if (ai.respawn > 0) {
    ai.respawn -= dt;
    if (ai.respawn <= 0) respawnCompetitor(ai);
    return;
  }
  tickBuffs(ai, dt);
  ai.huntLock = Math.max(0, (ai.huntLock || 0) - dt);
  ai.growPulse = Math.max(0, (ai.growPulse || 0) - dt);
  ai.levelPulse = Math.max(0, (ai.levelPulse || 0) - dt);
  if (ai.frozen > 0) return;
  ai.think -= dt;
  if (ai.think <= 0 || ai.path.length === 0) {
    ai.think = AI_DECISION_INTERVAL + rand(-0.06, 0.08);
    ai.target = chooseAITarget(ai);
    ai.path = pathTo(ai.x, ai.y, ai.target.x, ai.target.y);
  }
  const eliteBoost = ai.elite ? 1.22 : 1;
  const intentBoost = ai.intent === "hunt" ? 1.56 : ai.intent === "arm" ? 1.28 : 1;
  const hunterBoost = ai.intent === "hunt" && (ai.personality === "hunter" || ai.personality === "elite") ? 1.08 : 1;
  followPath(ai, dt, (145 + (ai.speedBuff > 0 ? 42 : 0) + (ai.power > 0 ? 22 : 0)) * (mode === "Ranked" ? 1.08 : 0.96) * eliteBoost * intentBoost * hunterBoost * getMassSpeedFactor(ai));
}

function updatePowerTrails(dt) {
  [player, ...aiPlayers].forEach((entity) => {
    if (!entity || entity.respawn > 0 || entity.power <= 0) return;
    const intensity = entity === player ? 5 : 3;
    for (let i = 0; i < intensity; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distanceFromBody = rand(entity.radius * 0.5, entity.radius * 1.45);
      particles.push({
        x: entity.x + Math.cos(angle) * distanceFromBody - (entity.lastDir?.x || 0) * rand(12, 34),
        y: entity.y + Math.sin(angle) * distanceFromBody - (entity.lastDir?.y || 0) * rand(12, 34),
        vx: Math.cos(angle) * rand(18, 70),
        vy: Math.sin(angle) * rand(18, 70),
        life: rand(0.28, 0.58),
        color: powerColor(previewTime + i * 0.8),
        size: rand(7, 13),
        star: true,
        spin: rand(0, Math.PI * 2)
      });
    }
  });
}

function chooseAITarget(ai) {
  const playerVisible = player.cloak <= 0;
  ai.intent = "farm";

  // Keep visible pressure on the real player even before they become a bounty target.
  const pressureTarget = getPlayerPressureTarget(ai, playerVisible);
  if (pressureTarget) return chooseHuntRoute(ai, pressureTarget);

  // High scorers attract several independent hunters. Unarmed hunters detour for combat tools first.
  const highScoreTarget = chooseHighScoreTarget(ai);
  if (highScoreTarget) return chooseHuntRoute(ai, highScoreTarget);

  // AI uses a small behavior tree every 400ms: survive, contest, ambush, then farm.
  const nearbyGiant = nearestGiantThreat(ai);
  if (nearbyGiant && ai.power <= 0 && (ai.mass || 1) + 0.45 < (nearbyGiant.mass || 1)) return farthestCellFrom(nearbyGiant.x, nearbyGiant.y);
  const weakerTarget = nearestWeakerCompetitor(ai, playerVisible);
  if ((ai.power > 0 || (ai.sizeLevel || 1) >= 3) && weakerTarget && Math.random() < 0.72) return { x: weakerTarget.x, y: weakerTarget.y };
  if (player.power > 0 && ai.power <= 0 && playerVisible) return farthestCellFrom(player.x, player.y);
  if (pendingPowerSpawns.length && ai.power <= 0 && Math.random() < 0.9) {
    const target = pendingPowerSpawns[Math.floor(Math.random() * pendingPowerSpawns.length)];
    ai.intent = "arm";
    return { x: target.wx + rand(-70, 70), y: target.wy + rand(-60, 60) };
  }
  if (ai.power > 0) {
    const rival = nearestHuntableCompetitor(ai, { includePlayer: playerVisible, includePowered: false, maxDistance: 1350, preferHighScore: true });
    if (rival) return assignHuntTarget(ai, rival);
  }
  if (shouldChasePlayer(ai, playerVisible)) return assignHuntTarget(ai, player);
  const urgentPower = nearestAlive(ai, powerPellets);
  if (urgentPower && ai.power <= 0 && distance(ai.x, ai.y, urgentPower.x, urgentPower.y) < 1250 && Math.random() < 0.88) {
    ai.intent = "arm";
    return { x: urgentPower.x, y: urgentPower.y };
  }
  if (ai.personality === "raider") {
    const ambush = nearestAmbushObjective(ai);
    if (ambush) {
      ai.intent = "arm";
      return ambush;
    }
  }
  if ((ai.score || 0) < 900) {
    return nearestAlive(ai, pellets) || nearestAlive(ai, coins) || randomCell();
  }
  const hotLoot = nearestHotLootSpot(ai);
  if (hotLoot && Math.random() < lootGreedChance(ai, hotLoot)) {
    return { x: hotLoot.x + rand(-36, 36), y: hotLoot.y + rand(-30, 30) };
  }
  const collisionRisk = nearestCollisionRisk(ai, 185);
  if (collisionRisk && ai.power <= 0 && collisionRisk.power <= 0 && !ai.shield && Math.random() < 0.86) {
    return farthestCellFrom(collisionRisk.x, collisionRisk.y);
  }
  if (ai.elite) {
    if (player.power > 0 && playerVisible) return farthestCellFrom(player.x, player.y);
    if (ai.power > 0) {
      const rival = nearestHuntableCompetitor(ai, { includePlayer: playerVisible, includePowered: false, maxDistance: 1250, preferHighScore: true });
      if (rival) return assignHuntTarget(ai, rival);
    }
    if (Math.random() < 0.32) {
      const rival = nearestHuntableCompetitor(ai, { includePlayer: playerVisible, lowerScoreBy: 500, maxDistance: 880, preferHighScore: true });
      if (rival) return { x: rival.x, y: rival.y };
    }
    if (Math.random() < 0.42) return farthestCellFrom(player.x - 900, player.y);
    return nearestAlive(ai, powerPellets) || randomCell((cell) => cell.x > 38);
  }
  if (mode === "Ranked" && isPlayerBounty() && ai.personality !== "coward" && playerVisible) return assignHuntTarget(ai, player);

  if ((ai.personality === "hunter" || ai.personality === "raider") && Math.random() < 0.58) {
    const rival = nearestHuntableCompetitor(ai, { includePlayer: playerVisible, lowerScoreBy: 140, maxDistance: 860, preferHighScore: true });
    if (rival) return assignHuntTarget(ai, rival);
  }
  if (ai.personality === "hunter" && playerVisible && player.power <= 0) return assignHuntTarget(ai, player);
  if (ai.personality === "raider") {
    const power = nearestAlive(ai, powerPellets);
    if (power) {
      ai.intent = "arm";
      return { x: power.x, y: power.y };
    }
    const tool = nearestAlive(ai, tools);
    if (tool) {
      ai.intent = "arm";
      return { x: tool.x, y: tool.y };
    }
  }
  if (ai.personality === "coward") {
    if (currentRank <= 25) return nearestAlive(ai, powerPellets) || nearestAlive(ai, coins) || randomCell();
    return Math.random() < 0.45 ? farthestCellFrom(player.x, player.y) : nearestAlive(ai, pellets) || randomCell();
  }
  return nearestAlive(ai, ai.personality === "farmer" && Math.random() < 0.36 ? coins : pellets) || randomCell();
}

function getPlayerPressureTarget(ai, playerVisible) {
  if (!playerVisible || player.power > 0 || ai.elite || ai.respawn > 0) return null;
  if (ai.personality !== "hunter" && ai.personality !== "raider") return null;
  if (ai.focusTargetId === player.id && ai.huntLock > 0) return player;
  const desiredPressure = mode === "Ranked" ? PLAYER_PRESSURE_HUNTERS + 1 : PLAYER_PRESSURE_HUNTERS;
  if (countAssignedHunters(player.id, ai) >= desiredPressure) return null;
  if (distance(ai.x, ai.y, player.x, player.y) > AI_HUNT_RANGE) return null;
  return player;
}

function chooseHighScoreTarget(ai) {
  const locked = findActiveCompetitor(ai.focusTargetId);
  if (locked && ai.huntLock > 0 && isHighScoreTarget(locked, ai)) return locked;

  let best = null;
  let bestValue = -Infinity;
  [player, ...aiPlayers].forEach((target) => {
    if (!target || target === ai || target.respawn > 0 || target.cloak > 0) return;
    if (!isHighScoreTarget(target, ai)) return;
    if (target.power > 0 && ai.power <= 0 && !nearestCombatPickup(ai, target)) return;
    const d = distance(ai.x, ai.y, target.x, target.y);
    if (d > AI_HUNT_RANGE) return;
    const pursuers = countAssignedHunters(target.id, ai);
    if (pursuers >= MAX_HUNTERS_PER_TARGET) return;
    const rank = getEntityRank(target);
    const rankValue = rank <= 6 ? 1800 - rank * 110 : rank <= 50 ? 620 - rank * 7 : 0;
    const scoreValue = Math.min(1250, Math.max(0, target.score || 0) / 65);
    const playerValue = target.id === "you" ? 180 : 0;
    const crowdPenalty = pursuers * 430;
    const value = rankValue + scoreValue + playerValue - d * 0.24 - crowdPenalty;
    if (value > bestValue) {
      bestValue = value;
      best = target;
    }
  });
  return best;
}

function isHighScoreTarget(target, ai) {
  if (!target || target.respawn > 0) return false;
  const rank = getEntityRank(target);
  const score = Math.max(0, target.score || 0);
  if (rank <= 6) return true;
  if (rank <= 50 && score >= HIGH_SCORE_HUNT_FLOOR) return true;
  return score >= HIGH_SCORE_HUNT_FLOOR && score >= Math.max(1, ai.score || 0) * 1.35;
}

function countAssignedHunters(targetId, excludingAI = null) {
  return aiPlayers.filter((other) =>
    other !== excludingAI &&
    other.respawn <= 0 &&
    other.focusTargetId === targetId &&
    (other.intent === "hunt" || other.intent === "arm")
  ).length;
}

function findActiveCompetitor(id) {
  if (!id) return null;
  return [player, ...aiPlayers].find((target) => target && target.id === id && target.respawn <= 0) || null;
}

function chooseHuntRoute(ai, target) {
  ai.focusTargetId = target.id;
  ai.huntLock = Math.max(ai.huntLock || 0, rand(2.4, 4.2));

  if (target.power > 0 && ai.power <= 0) {
    const weapon = nearestCombatPickup(ai, target);
    if (weapon) return assignWeaponTarget(ai, weapon, target);
    ai.intent = "evade";
    return farthestCellFrom(target.x, target.y);
  }

  if (!isCombatReady(ai) && (ai.personality !== "coward" || ai.huntBias < 0.34)) {
    const weapon = nearestCombatPickup(ai, target);
    if (weapon && (ai.personality === "raider" || ai.personality === "hunter" || distance(ai.x, ai.y, weapon.x, weapon.y) < 920)) {
      return assignWeaponTarget(ai, weapon, target);
    }
  }
  return assignHuntTarget(ai, target);
}

function isCombatReady(ai) {
  return ai.power > 0 || !!ai.shield || ai.speedBuff > 0 || ai.attackDrive > 0;
}

function nearestCombatPickup(ai, target = null) {
  let best = null;
  let bestScore = Infinity;
  const consider = (item, value) => {
    if (!item.alive) return;
    const d = distance(ai.x, ai.y, item.x, item.y);
    if (d > AI_WEAPON_DETOUR_RANGE) return;
    const routeCost = target ? distance(item.x, item.y, target.x, target.y) * 0.16 : 0;
    const score = d + routeCost - value;
    if (score < bestScore) {
      bestScore = score;
      best = item;
    }
  };
  powerPellets.forEach((item) => consider(item, 760));
  tools.forEach((item) => {
    const value = item.type === "shield" ? 620 : item.type === "freeze" ? 560 : item.type === "speed" ? 430 : 180;
    consider(item, value);
  });
  return best;
}

function assignWeaponTarget(ai, weapon, target) {
  ai.intent = "arm";
  ai.focusTargetId = target?.id || ai.focusTargetId;
  return { x: weapon.x, y: weapon.y };
}

function assignHuntTarget(ai, target) {
  ai.intent = "hunt";
  ai.focusTargetId = target.id;
  ai.huntLock = Math.max(ai.huntLock || 0, rand(2.2, 3.8));
  const d = distance(ai.x, ai.y, target.x, target.y);
  const lead = clamp(d * 0.08, 35, 150);
  return {
    x: target.x + (target.lastDir?.x || 0) * lead,
    y: target.y + (target.lastDir?.y || 0) * lead
  };
}

function nearestAmbushObjective(ai) {
  const power = nearestAlive(ai, powerPellets);
  const tool = nearestAlive(ai, tools);
  const target = power && (!tool || distance(ai.x, ai.y, power.x, power.y) < distance(ai.x, ai.y, tool.x, tool.y) + 260) ? power : tool;
  if (!target) return null;
  if (distance(ai.x, ai.y, target.x, target.y) < 260) {
    const offset = nearestTile(target.x + rand(-120, 120), target.y + rand(-100, 100));
    return tileCenter(offset.x, offset.y);
  }
  return { x: target.x, y: target.y };
}

function lootGreedChance(ai, spot) {
  let chance = 0.48;
  if (ai.personality === "farmer") chance += 0.24;
  if (ai.personality === "raider") chance += 0.2;
  if (ai.personality === "coward") chance += 0.12;
  if (ai.power > 0 || ai.shield) chance += 0.12;
  if ((spot.value || 0) > 3000) chance += 0.16;
  return clamp(chance, 0.35, 0.92);
}

function shouldChasePlayer(ai, playerVisible) {
  if (!playerVisible || player.power > 0 || ai.frozen > 0) return false;
  const d = distance(ai.x, ai.y, player.x, player.y);
  if (d > 1450) return false;
  if (ai.power > 0 || ai.shield) return true;
  const aiRank = getEntityRank(ai);
  let chance = 0.12;
  if (ai.elite || aiRank <= 6) chance += 0.42;
  else if (aiRank <= 50) chance += 0.28;
  if (ai.personality === "hunter") chance += 0.34;
  if (ai.personality === "raider") chance += 0.2;
  if (ai.personality === "coward") chance -= 0.08;
  if (player.score > ai.score) chance += 0.16;
  if (currentRank <= 50) chance += 0.12;
  if (d < 520) chance += 0.16;
  return Math.random() < clamp(chance, 0.06, 0.82);
}

function updateSentinel(sentinel, dt) {
  if (sentinel.respawn > 0) {
    sentinel.respawn -= dt;
    if (sentinel.respawn <= 0) {
      sentinel.x = sentinel.route[0].x;
      sentinel.y = sentinel.route[0].y;
      sentinel.routeIndex = 1;
    }
    return;
  }
  if (sentinel.frozen > 0) {
    sentinel.frozen -= dt;
    sentinel.state = "frozen";
    return;
  }
  const chaseTarget = chooseSentinelChaseTarget(sentinel);
  const d = distance(sentinel.x, sentinel.y, chaseTarget.x, chaseTarget.y);
  const topPressure = currentRank <= 6 ? 70 : currentRank <= 50 ? 35 : 0;
  const targetRank = getEntityRank(chaseTarget);
  const targetPressure = targetRank <= 6 ? 85 : targetRank <= 50 ? 35 : 0;
  const centerPressure = getResourceZone(chaseTarget.x, chaseTarget.y) === "center" ? 55 : 0;
  const guardPressure = sentinel.powerGuard ? 60 : 0;
  if (player.power > 0) sentinel.state = "vulnerable";
  else if (d < (sentinel.type === "captain" ? 270 : 215) + topPressure + targetPressure + centerPressure + guardPressure && chaseTarget.cloak <= 0) sentinel.state = "chase";
  else if (d < 340 + topPressure + targetPressure + guardPressure && chaseTarget.cloak <= 0) sentinel.state = "alert";
  else sentinel.state = "patrol";

  if (!sentinel.warned && d < 260) {
    sentinel.warned = true;
  }

  let target = sentinel.route[sentinel.routeIndex];
  if (sentinel.state === "chase") target = { x: chaseTarget.x, y: chaseTarget.y };
  if (sentinel.powerGuard && sentinel.state === "patrol" && Math.random() < 0.55) target = { x: sentinel.anchorX, y: sentinel.anchorY };
  if (sentinel.state === "vulnerable") target = farthestCellFrom(player.x, player.y);
  if (sentinel.state === "patrol" && distance(sentinel.x, sentinel.y, target.x, target.y) < 18) {
    sentinel.routeIndex = (sentinel.routeIndex + 1) % sentinel.route.length;
    target = sentinel.route[sentinel.routeIndex];
  }
  if (sentinel.path.length === 0 || Math.random() < 0.025) sentinel.path = pathTo(sentinel.x, sentinel.y, target.x, target.y);
  const base = sentinel.type === "captain" ? 125 : sentinel.type === "crab" ? 118 : 96;
  followPath(sentinel, dt, base * (sentinel.state === "chase" ? 1.35 : 1));
}

function chooseSentinelChaseTarget(sentinel) {
  let best = player;
  let bestScore = distance(sentinel.x, sentinel.y, player.x, player.y) - (currentRank <= 6 ? 180 : currentRank <= 50 ? 80 : 0);
  aiPlayers.forEach((ai) => {
    if (ai.respawn > 0 || ai.power > 0) return;
    const rank = getEntityRank(ai);
    if (rank > 50 && getResourceZone(ai.x, ai.y) !== "center") return;
    const score = distance(sentinel.x, sentinel.y, ai.x, ai.y) - (rank <= 6 ? 220 : rank <= 50 ? 90 : 40);
    if (score < bestScore) {
      bestScore = score;
      best = ai;
    }
  });
  return best;
}

function updatePickups(dt) {
  spawnToolTimer -= dt;
  pelletRefreshTimer -= dt;
  coinRefreshTimer -= dt;
  powerRefreshTimer -= dt;
  if (powerWarningTimer > 0) {
    powerWarningTimer -= dt;
    if (powerWarningTimer <= 0) spawnPendingPowerSpawns();
  }
  if (spawnToolTimer <= 0) {
    spawnToolTimer = mode === "Ranked" ? rand(9, 13) : rand(7, 11);
    const toolCap = mode === "Ranked" ? 4 : 5;
    while (tools.filter((t) => t.alive).length < toolCap) spawnTool();
  }
  if (pelletRefreshTimer <= 0) {
    pelletRefreshTimer = 2.8;
    refreshPellets(24);
  }
  if (coinRefreshTimer <= 0) {
    coinRefreshTimer = 6;
    refreshCoins(9);
  }
  if (powerRefreshTimer <= 0 && powerWarningTimer <= 0) {
    powerRefreshTimer = 18;
    beginPowerWarning();
  }
  resourceHotspotTimer -= dt;
  if (resourceHotspotTimer <= 0) {
    resourceHotspotTimer = 25;
    spawnResourceHotspot();
  }

  [player, ...aiPlayers.filter((ai) => ai.respawn <= 0)].forEach((entity) => {
    const pickupBonus = getPickupRadius(entity);
    const magnetRange = entity.magnet > 0 ? 160 + (entity.mass || 1) * 10 : 0;
    collectList(entity, pellets, pickupBonus, (collector, item) => {
      const topPenalty = getEntityTier(collector) === "top" ? TOP_PELLET_MULTIPLIER : 1;
      collector.score += Math.round(item.score * topPenalty);
      addGrowth(collector, GROWTH_CONFIG.smallPelletGrowth, "+1 Growth");
      burst(item.x, item.y, "#ffd66b", 5);
      if (collector === player) playSfx("pellet");
    }, magnetRange);
    collectList(entity, powerPellets, pickupBonus + 10, (collector, item) => {
      collector.score += 50;
      collector.power = 8;
      if (collector !== player) collector.attackDrive = 8;
      collector.combo = 0;
      addGrowth(collector, GROWTH_CONFIG.powerPelletGrowth, "+10 Growth");
      burst(item.x, item.y, "#fff08a", 16);
      starBurst(item.x, item.y, 18);
      if (collector === player) {
        playSfx("power");
        toast("星星无敌！可以反杀敌人！");
      }
    }, magnetRange);
    collectList(entity, coins, pickupBonus + 6, (collector, item) => {
      const value = item.value || 1;
      collector.coins += value;
      collector.score += Math.round(25 * value * getZoneScoreMultiplier(item.x, item.y));
      addGrowth(collector, GROWTH_CONFIG.coinGrowth * value, `+${GROWTH_CONFIG.coinGrowth * value} Growth`);
      burst(item.x, item.y, "#ffd66b", 8);
      if (collector === player) playSfx("coin");
    }, magnetRange);
    collectList(entity, tools, pickupBonus + 12, (collector, item) => applyTool(collector, item.type), 0);
  });
}

function updateFieldBanner(dt) {
  if (fieldBanner.timer > 0) fieldBanner.timer = Math.max(0, fieldBanner.timer - dt);
  if (isFinalCenterBonus() && !centerBonusNotice) {
    centerBonusNotice = true;
    showFieldBanner("最后30秒：中心奖励翻倍", "#fff08a", 3.2);
  }
}

function showFieldBanner(text, color = "#ffd66b", timer = 2.2) {
  fieldBanner = { text, color, timer };
}

function refreshPellets(count) {
  for (let i = 0; i < count; i++) {
    const c = randomZoneCell(Math.random() < 0.62 ? "outer" : Math.random() < 0.78 ? "middle" : "center");
    if (!pellets.some((p) => p.alive && distance(p.x, p.y, c.wx, c.wy) < 35)) {
      pellets.push({ type: "small", x: c.wx, y: c.wy, radius: 8, score: Math.round(12 * getZoneScoreMultiplier(c.wx, c.wy)), alive: true, pulse: Math.random() * 6 });
    }
  }
}

function refreshCoins(count) {
  if (coins.filter((coin) => coin.alive).length > 115) return;
  for (let i = 0; i < count; i++) {
    const c = randomZoneCell(Math.random() < 0.28 ? "center" : Math.random() < 0.68 ? "middle" : "outer");
    const zone = getResourceZone(c.wx, c.wy);
    coins.push({ x: c.wx + rand(-10, 10), y: c.wy + rand(-10, 10), radius: zone === "center" ? 13 : 10, alive: true, spin: Math.random() * 6, value: zone === "center" && Math.random() < 0.24 ? 3 : zone === "center" ? 2 : 1 });
  }
}

function randomZoneCell(zone) {
  return randomCell((cell) => getResourceZone(cell.wx, cell.wy) === zone);
}

function beginPowerWarning() {
  // Star power is announced before it appears so every player can contest it fairly.
  pendingPowerSpawns = choosePowerSpawnCells(3);
  if (!pendingPowerSpawns.length) {
    const fallback = randomCell((cell) => distance(cell.wx, cell.wy, player.x, player.y) > 700);
    if (fallback) pendingPowerSpawns = [fallback];
  }
  powerWarningTimer = POWER_WARNING_SECONDS;
  showFieldBanner("星星将在中心危险区刷新，所有玩家正在赶来", "#fff08a", POWER_WARNING_SECONDS);
  pendingPowerSpawns.forEach((cell) => addRing(cell.wx, cell.wy, 36, 180, "#fff08a", POWER_WARNING_SECONDS));
}

function spawnPendingPowerSpawns() {
  pendingPowerSpawns.forEach((cell) => spawnPowerStar(cell));
  pendingPowerSpawns = [];
  showFieldBanner("星星出现！窄口有守卫，小心抢夺", "#ff846b", 2.6);
}

function spawnResourceHotspot() {
  const cell = randomZoneCell(Math.random() < 0.68 ? "center" : "middle");
  if (!cell) return;
  const x = cell.wx;
  const y = cell.wy;
  for (let i = 0; i < 22; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = rand(24, 170);
    pellets.push({
      type: "small",
      x: x + Math.cos(a) * r,
      y: y + Math.sin(a) * r,
      radius: 8,
      score: Math.round(14 * getZoneScoreMultiplier(x, y)),
      alive: true,
      pulse: Math.random() * 6
    });
  }
  for (let i = 0; i < 6; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = rand(28, 150);
    coins.push({ x: x + Math.cos(a) * r, y: y + Math.sin(a) * r, radius: 11, alive: true, spin: Math.random() * 6, value: Math.random() < 0.35 ? 3 : 2 });
  }
  if (tools.filter((t) => t.alive).length < 6) spawnTool(x + rand(-90, 90), y + rand(-80, 80));
  if (powerPellets.filter((p) => p.alive).length < 9) spawnPowerStar(cell);
  addHotLootSpot(x, y, 5200);
  addRing(x, y, 54, 230, "#fff08a", 1.05);
  showFieldBanner("资源热点出现！所有玩家正在前往中心码头", "#fff08a", 3);
}

function refreshPowerPellets(options = {}) {
  const aliveCount = powerPellets.filter((p) => p.alive).length;
  const cap = options.initial ? 7 : 12;
  if (aliveCount >= cap) return;
  if (!options.initial) return beginPowerWarning();
  choosePowerSpawnCells(options.initial ? 7 : 3, options).forEach((cell) => spawnPowerStar(cell));
}

function choosePowerSpawnCells(count, options = {}) {
  const origin = player || { x: tileCenter(16, 9).x, y: tileCenter(16, 9).y };
  const minDistance = options.initial ? 1120 : Math.max(760, Math.min(viewportWidth, viewportHeight) * 0.92);
  const candidates = cells.filter((c) => {
    const zone = getResourceZone(c.wx, c.wy);
    if (zone !== "center" && zone !== "middle") return false;
    if (distance(c.wx, c.wy, origin.x, origin.y) < minDistance) return false;
    if (pointInCurrentView(c.wx, c.wy, 140)) return false;
    return !powerPellets.some((p) => p.alive && distance(p.x, p.y, c.wx, c.wy) < 360);
  });
  const fallbackCandidates = cells.filter((c) => distance(c.wx, c.wy, origin.x, origin.y) > 650 && !pointInCurrentView(c.wx, c.wy, 80));
  const picks = [];
  for (let i = 0; i < count; i++) {
    const pool = candidates.length ? candidates : fallbackCandidates;
    const picked = pool[Math.floor(Math.random() * pool.length)] || randomCell((cell) => distance(cell.wx, cell.wy, origin.x, origin.y) > 650);
    if (picked && !picks.some((p) => distance(p.wx, p.wy, picked.wx, picked.wy) < 320)) picks.push(picked);
  }
  return picks;
}

function spawnPowerStar(cell) {
  powerPellets.push({ x: cell.wx, y: cell.wy, radius: 17, alive: true, pulse: Math.random() * 6, guarded: true });
  spawnPowerGuard(cell.wx, cell.wy);
}

function pointInCurrentView(x, y, margin = 0) {
  if (gameState !== "battle" || !player) {
    const spawn = tileCenter(16, 9);
    return Math.abs(x - spawn.x) < viewportWidth / 2 + margin && Math.abs(y - spawn.y) < viewportHeight / 2 + margin;
  }
  return x >= cameraX - margin && x <= cameraX + viewportWidth + margin && y >= cameraY - margin && y <= cameraY + viewportHeight + margin;
}

function collectList(entity, list, radius, onCollect, magnetRange) {
  list.forEach((item) => {
    if (!item.alive) return;
    const d = distance(entity.x, entity.y, item.x, item.y);
    if (magnetRange && d < magnetRange) {
      item.x += (entity.x - item.x) * 0.12;
      item.y += (entity.y - item.y) * 0.12;
    }
    if (distance(entity.x, entity.y, item.x, item.y) < entity.radius + radius) {
      item.alive = false;
      onCollect(entity, item);
    }
  });
}

function spawnTool(x, y) {
  const c = x ? { wx: x, wy: y } : randomZoneCell(Math.random() < 0.24 ? "center" : "middle");
  const pick = toolTypes[Math.floor(Math.random() * toolTypes.length)];
  tools.push({ type: pick.type, x: c.wx, y: c.wy, radius: 16, alive: true, pulse: Math.random() * 6 });
}

function applyTool(entity, type) {
  if (type === "speed") entity.speedBuff = 5;
  if (type === "shield") {
    entity.shield = 1;
    addRing(entity.x, entity.y, 44, 110, "#9fe4ff", 0.55);
  }
  if (type === "magnet") {
    entity.magnet = 7;
    addRing(entity.x, entity.y, 35, 190, "#ff6b5a", 0.55);
  }
  if (type === "cloak") {
    entity.cloak = 6;
    addRing(entity.x, entity.y, 30, 150, "#a77bd8", 0.45);
    cloakMist(entity.x, entity.y, 22);
  }
  if (type === "freeze") {
    addRing(entity.x, entity.y, 40, 460, "#a5eaff", 0.82);
    [player, ...aiPlayers, ...sentinels].forEach((target) => {
      if (target !== entity && distance(entity.x, entity.y, target.x, target.y) < 460) {
        target.frozen = 3.8;
        iceBurst(target.x, target.y, 8);
      }
    });
    iceBurst(entity.x, entity.y, 30);
  }
  if (entity !== player && (type === "speed" || type === "shield" || type === "freeze")) {
    entity.attackDrive = Math.max(entity.attackDrive || 0, type === "freeze" ? 4.5 : 6);
  }
  if (entity === player) {
    playSfx("tool");
    toast(toolTypes.find((t) => t.type === type).label);
  }
}

function updateCombat(dt) {
  player.hitCooldown = Math.max(0, player.hitCooldown - dt);
  aiPlayers.forEach((ai) => {
    if (ai.respawn > 0) return;
    if (distance(player.x, player.y, ai.x, ai.y) < effectiveCollisionRadius(player) + effectiveCollisionRadius(ai) - 6) {
      resolvePlayerAIContact(ai);
    }
  });

  for (let i = 0; i < aiPlayers.length; i++) {
    for (let j = i + 1; j < aiPlayers.length; j++) {
      const a = aiPlayers[i];
      const b = aiPlayers[j];
      if (a.respawn > 0 || b.respawn > 0) continue;
      if (distance(a.x, a.y, b.x, b.y) < effectiveCollisionRadius(a) + effectiveCollisionRadius(b) - 4) {
        resolveAIContact(a, b);
      }
    }
  }

  sentinels.forEach((sentinel) => {
    if (sentinel.respawn > 0) return;
    if (distance(player.x, player.y, sentinel.x, sentinel.y) < effectiveCollisionRadius(player) + sentinel.radius - 5) {
      if (player.power > 0) defeatSentinel(sentinel, player);
      else damagePlayer("港口守卫");
    }
    aiPlayers.forEach((ai) => {
      if (ai.respawn > 0 || sentinel.respawn > 0) return;
      if (distance(ai.x, ai.y, sentinel.x, sentinel.y) < effectiveCollisionRadius(ai) + sentinel.radius - 5) {
        if (ai.power > 0) defeatSentinel(sentinel, ai);
        else eliminateCompetitor(ai, "#a5eaff");
      }
    });
  });
}

function resolvePlayerAIContact(ai) {
  if (player.power > 0 && ai.power > 0) {
    bumpApart(player, ai);
    addRing(player.x, player.y, 34, 86, "#fff08a", 0.35);
    return;
  }
  if (player.power > 0) {
    defeat(ai, player);
    return;
  }
  if (ai.power <= 0) {
    resolveNeutralPlayerAIContact(ai);
    return;
  }
  damagePlayer(ai.name);
}

function resolveAIContact(a, b) {
  if (a.power > 0 && b.power > 0) {
    bumpApart(a, b);
    addRing((a.x + b.x) / 2, (a.y + b.y) / 2, 28, 82, "#fff08a", 0.35);
    starBurst((a.x + b.x) / 2, (a.y + b.y) / 2, 7);
    return;
  }
  if (a.power > 0) {
    defeat(b, a);
    return;
  }
  if (b.power > 0) {
    defeat(a, b);
    return;
  }
  resolveNeutralAIContact(a, b);
}

function resolveNeutralPlayerAIContact(ai) {
  const playerShielded = !!player.shield;
  const aiShielded = !!ai.shield;
  if (aiShielded) blockAttack(ai, player);
  if (!aiShielded) eliminateCompetitor(ai, "#ff846b");
  if (!playerShielded) damagePlayer(ai.name);
  else damagePlayer(ai.name);
}

function resolveNeutralAIContact(a, b) {
  const aShielded = !!a.shield;
  const bShielded = !!b.shield;
  if (aShielded) blockAttack(a, b);
  if (bShielded) blockAttack(b, a);
  if (!aShielded) eliminateCompetitor(a, "#ff846b");
  if (!bShielded) eliminateCompetitor(b, "#ff846b");
  addRing((a.x + b.x) / 2, (a.y + b.y) / 2, 26, 112, "#ff846b", 0.45);
}

function defeat(defeated, victor) {
  if (defeated.respawn > 0) return;
  if (blockAttack(defeated, victor)) return;
  const bounty = getBountyTarget();
  const defeatedRank = getEntityRank(defeated);
  let gain = 200;
  if (bounty && defeated.id === bounty.id) gain += 500;
  if (defeatedRank <= 6) gain += TOP_BOUNTY_BONUS;
  if (defeated.elite) gain += 1400 + Math.max(0, (ELITE_AI_COUNT + 1 - defeated.rankSeed)) * 260;
  if ((defeated.sizeLevel || 1) >= 4) gain += (defeated.sizeLevel || 1) >= 5 ? GROWTH_CONFIG.giantPlayerBountyBonus : GROWTH_CONFIG.bigPlayerBountyBonus;
  const spilledScore = Math.max(0, Math.floor(defeated.score || 0));
  victor.combo = (victor.combo || 0) + 1;
  victor.maxCombo = Math.max(victor.maxCombo || 0, victor.combo);
  if (victor.combo === 2) gain += 50;
  if (victor.combo === 3) gain += 100;
  if (victor.combo >= 5) {
    gain += 200;
    shake();
  }
  victor.score += gain;
  victor.kills = (victor.kills || 0) + 1;
  const killGrowth = GROWTH_CONFIG.aiKillGrowth + (bounty && defeated.id === bounty.id ? GROWTH_CONFIG.bountyKillGrowth : 0);
  addGrowth(victor, killGrowth, `+${killGrowth} Growth`);
  dropScoreLoot(defeated.x, defeated.y, spilledScore, defeated);
  burst(defeated.x, defeated.y, victor === player ? "#fff08a" : "#ff846b", 22);
  addRing(defeated.x, defeated.y, 30, defeated.elite ? 180 : 125, victor === player ? "#fff08a" : "#ff846b", 0.55);
  if (defeated.elite || victor.power > 0) starBurst(defeated.x, defeated.y, defeated.elite ? 22 : 12);
  if ((defeated.sizeLevel || 1) >= 4) {
    showFloatingText(defeated.x, defeated.y - 20, "JACKPOT!", "#fff08a", 1.25);
    if (victor === player) {
      showFieldBanner(`逆袭！你击败了巨型玩家 ${defeated.name}`, "#fff08a", 2.8);
      playSfx("bounty");
    }
  }
  defeated.score = 0;
  resetGrowth(defeated);
  defeated.combo = 0;
  defeated.power = 0;
  defeated.shield = 0;
  defeated.magnet = 0;
  defeated.cloak = 0;
  defeated.speedBuff = 0;
  defeated.attackDrive = 0;
  defeated.intent = "farm";
  defeated.focusTargetId = null;
  defeated.huntLock = 0;
  defeated.path = [];
  defeated.respawn = 4.5;
  if (victor === player) playSfx("defeat");
}

function defeatSentinel(sentinel, victor) {
  victor.score += 150;
  victor.kills = (victor.kills || 0) + 1;
  victor.combo = (victor.combo || 0) + 1;
  victor.maxCombo = Math.max(victor.maxCombo || 0, victor.combo);
  addGrowth(victor, GROWTH_CONFIG.sentinelKillGrowth, `+${GROWTH_CONFIG.sentinelKillGrowth} Growth`);
  dropLoot(sentinel.x, sentinel.y);
  burst(sentinel.x, sentinel.y, "#fff08a", 24);
  addRing(sentinel.x, sentinel.y, 34, 135, "#fff08a", 0.55);
  starBurst(sentinel.x, sentinel.y, 12);
  sentinel.respawn = 5;
  if (victor === player) {
    playSfx("defeat");
  }
}

function eliminateCompetitor(defeated, color = "#ff846b") {
  if (defeated.respawn > 0) return;
  if (blockAttack(defeated, null, color)) return;
  const spilledScore = Math.max(0, Math.floor(defeated.score || 0));
  dropScoreLoot(defeated.x, defeated.y, spilledScore, defeated);
  burst(defeated.x, defeated.y, color, 22);
  addRing(defeated.x, defeated.y, 28, defeated.elite ? 160 : 116, color, 0.52);
  if (defeated.elite) starBurst(defeated.x, defeated.y, 18);
  defeated.score = 0;
  resetGrowth(defeated);
  defeated.combo = 0;
  defeated.power = 0;
  defeated.shield = 0;
  defeated.magnet = 0;
  defeated.cloak = 0;
  defeated.speedBuff = 0;
  defeated.attackDrive = 0;
  defeated.intent = "farm";
  defeated.focusTargetId = null;
  defeated.huntLock = 0;
  defeated.path = [];
  defeated.respawn = 4.5;
}

function blockAttack(defender, attacker, color = "#9fe4ff") {
  if (!defender.shield) return false;
  defender.shield = 0;
  defender.combo = 0;
  burst(defender.x, defender.y, "#9fe4ff", 14);
  addRing(defender.x, defender.y, 38, 120, color, 0.42);
  if (attacker) bumpApart(defender, attacker);
  return true;
}

function damagePlayer(source) {
  if (player.hitCooldown > 0) return;
  player.hitCooldown = 1.2;
  player.combo = 0;
  if (player.shield) {
    player.shield = 0;
    playSfx("shield");
    toast("护盾抵挡了一次攻击！");
    burst(player.x, player.y, "#9fe4ff", 16);
    return;
  }
  if (player.hp <= 1) finalRankSnapshot = getPlayerRankBeforeScoreDrop();
  player.hp -= 1;
  player.score = 0;
  shake();
  playSfx("hit");
  toast(`${source} 撞到了你，分数清零！`);
  if (player.hp <= 0) endBattle(true);
}

function getPlayerRankBeforeScoreDrop() {
  const standings = getStandings();
  const rank = standings.findIndex((p) => p.id === "you") + 1;
  return rank > 0 ? rank : currentRank;
}

function dropLoot(x, y) {
  for (let i = 0; i < 7; i++) pellets.push({ type: "small", x: x + rand(-45, 45), y: y + rand(-45, 45), radius: 8, score: 12, alive: true, pulse: Math.random() * 6 });
  if (Math.random() < 0.7) coins.push({ x: x + rand(-28, 28), y: y + rand(-28, 28), radius: 10, alive: true, spin: Math.random() * 6 });
  if (Math.random() < 0.34 && tools.filter((t) => t.alive).length < 5) spawnTool(x + rand(-34, 34), y + rand(-34, 34));
  addHotLootSpot(x, y, 420);
}

function dropScoreLoot(x, y, score, source = null) {
  const mass = source?.mass || 1;
  const level = source?.sizeLevel || 1;
  const basePellets = Math.floor(8 + mass * 8);
  const baseCoins = Math.floor(1 + mass * 2);
  const jackpot = level >= 4 || source?.elite;
  const pelletCount = jackpot ? clamp(Math.floor(rand(20, 36) + mass * 3), 20, 48) : clamp(Math.max(basePellets, Math.floor(score / 260)), 8, 34);
  const coinCount = jackpot ? clamp(Math.floor(rand(5, 11) + mass), 5, 14) : clamp(Math.max(baseCoins, Math.floor(score / 2200)), 1, 9);
  for (let i = 0; i < pelletCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = rand(18, Math.min(jackpot ? 240 : 170, 55 + score / 520 + mass * 18));
    pellets.push({
      type: "small",
      x: x + Math.cos(a) * r,
      y: y + Math.sin(a) * r,
      radius: 8,
      score: 12,
      alive: true,
      pulse: Math.random() * 6
    });
  }
  for (let i = 0; i < coinCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = rand(22, Math.min(jackpot ? 260 : 190, 65 + score / 620 + mass * 16));
    coins.push({
      x: x + Math.cos(a) * r,
      y: y + Math.sin(a) * r,
      radius: 10,
      alive: true,
      spin: Math.random() * 6
    });
  }
  if ((score > 8000 || jackpot) && tools.filter((t) => t.alive).length < 5) spawnTool(x + rand(-60, 60), y + rand(-60, 60));
  addHotLootSpot(x, y, score + pelletCount * 12 + coinCount * 25);
}

function addHotLootSpot(x, y, value) {
  hotLootSpots.push({ x, y, value, life: clamp(6 + value / 1500, 6, 18) });
  hotLootSpots = hotLootSpots
    .sort((a, b) => b.value - a.value)
    .slice(0, 12);
}

function updateHotLootSpots(dt) {
  hotLootSpots.forEach((spot) => {
    spot.life -= dt;
    spot.value *= 1 - Math.min(0.12, dt * 0.08);
  });
  hotLootSpots = hotLootSpots.filter((spot) => {
    if (spot.life <= 0) return false;
    const hasNearbyLoot =
      pellets.some((p) => p.alive && distance(p.x, p.y, spot.x, spot.y) < 190) ||
      coins.some((c) => c.alive && distance(c.x, c.y, spot.x, spot.y) < 210);
    return hasNearbyLoot;
  });
}

function nearestHotLootSpot(ai) {
  let best = null;
  let bestScore = Infinity;
  hotLootSpots.forEach((spot) => {
    const d = distance(ai.x, ai.y, spot.x, spot.y);
    if (d > 1500) return;
    const score = d - Math.min(520, (spot.value || 0) / 18);
    if (score < bestScore) {
      bestScore = score;
      best = spot;
    }
  });
  return best;
}

function updateSafety(dt) {
  if (dt < 0) addDust(player.x, player.y);
}

function centerBonusActive() {
  return false;
}

function getSafeZone() {
  return { x: 0, y: 0, w: WORLD_WIDTH, h: WORLD_HEIGHT };
}

function getResourceZone(x, y) {
  // Three-zone economy: outside farms safely, middle holds tools, center pays most but attracts danger.
  const cx = WORLD_WIDTH / 2;
  const cy = WORLD_HEIGHT / 2;
  const nx = Math.abs(x - cx) / (WORLD_WIDTH / 2);
  const ny = Math.abs(y - cy) / (WORLD_HEIGHT / 2);
  const d = Math.max(nx, ny);
  if (d < 0.24) return "center";
  if (d < 0.58) return "middle";
  return "outer";
}

function getZoneScoreMultiplier(x, y) {
  const zone = getResourceZone(x, y);
  let multiplier = zone === "center" ? 2.2 : zone === "middle" ? 1.35 : 1;
  if (zone === "center" && isFinalCenterBonus()) multiplier *= 2;
  return multiplier;
}

function isFinalCenterBonus() {
  return mode === "Ranked" && rankedTimeLeft <= 30;
}

function getCenterRect() {
  return {
    x: WORLD_WIDTH * 0.38,
    y: WORLD_HEIGHT * 0.32,
    w: WORLD_WIDTH * 0.24,
    h: WORLD_HEIGHT * 0.36
  };
}

function endBattle(defeated) {
  if (gameState !== "battle") return;
  gameState = "result";
  stopMusic();
  hud.classList.add("hidden");
  controls.classList.add("hidden");
  leaderboard.classList.add("hidden");
  const standings = getStandings();
  const liveRank = standings.findIndex((p) => p.id === "you") + 1;
  const rank = defeated && finalRankSnapshot ? finalRankSnapshot : liveRank;
  const coinsEarned = player.coins + Math.max(0, Math.floor(player.score / 750));
  save.coins += coinsEarned;
  rankedStarDelta = 0;
  if (mode === "Ranked") {
    if (rank === 1) rankedStarDelta = 3;
    else if (rank <= 10) rankedStarDelta = 2;
    else if (rank <= 30) rankedStarDelta = 1;
    else if (rank <= 80 && !defeated) rankedStarDelta = 0;
    else rankedStarDelta = -1;
    save.stars = Math.max(0, save.stars + rankedStarDelta);
    save.rankPoints = Math.max(0, (save.rankPoints || 0) + rankedStarDelta * 100);
  }
  save.wins = (save.wins || 0) + (rank === 1 ? 1 : 0);
  save.losses = (save.losses || 0) + (defeated ? 1 : 0);
  save.bestRank = Number.isFinite(save.bestRank) ? Math.min(save.bestRank, rank) : rank;
  persistSave();

  ui.resultTitle.textContent = mode === "Ranked" ? "排位结束" : "无尽模式结束";
  ui.resultLine.textContent = rank === 1 ? "港口王者！你统治了迷宫。" : rank <= 10 ? "高分上榜，段位继续冲。" : rank <= 30 ? "排名不错，再抢一波精英。" : "下一局抢到大能量豆，就有机会反杀。";
  ui.resultRank.textContent = `#${rank}`;
  ui.resultScore.textContent = formatNumber(Math.floor(player.score));
  ui.resultKills.textContent = player.kills;
  ui.resultCombo.textContent = `x${player.maxCombo}`;
  ui.resultCoins.textContent = coinsEarned;
  ui.resultStars.textContent = rankedStarDelta > 0 ? `+${rankedStarDelta}` : `${rankedStarDelta}`;
  ui.starDeltaWrap.style.display = mode === "Ranked" ? "block" : "none";
  setScreen(ui.resultScreen);
}

function updateLeaderboardUI() {
  const standings = getStandings();
  rankMap = new Map(standings.map((entry, index) => [entry.id, index + 1]));
  currentRank = standings.findIndex((p) => p.id === "you") + 1;
  if (currentRank !== lastRank) {
    lastRank = currentRank;
  }
  const bounty = getBountyTarget(standings);
  if (bounty && bounty.id !== lastBountyId) {
    lastBountyId = bounty.id;
  }

  const topRows = standings.slice(0, 6).map((p, index) => {
    const crown = index === 0 ? "♛" : `${index + 1}`;
    const classes = ["top-row", p.id === "you" ? "you" : "", p.elite ? "elite-row" : ""].filter(Boolean).join(" ");
    return `<li class="${classes}"><span>${crown}</span><span>${p.name}</span><b>${formatNumber(Math.floor(p.score))}</b></li>`;
  });
  const playerInTop = currentRank <= 6;
  if (!playerInTop) {
    topRows.push(`<li class="gap"><span>...</span><span>你的当前排名</span><b></b></li>`);
    topRows.push(`<li class="you"><span>${currentRank}</span><span>YOU</span><b>${formatNumber(Math.floor(player.score))}</b></li>`);
  }
  leaderList.innerHTML = topRows.join("");
  const leader = standings[0];
  const gap = leader && leader.id !== "you" ? Math.max(0, Math.floor(leader.score - player.score)) : 0;
  const giant = leader && (leader.sizeLevel || 1) >= 4 ? ` 当前巨兽：${leader.name}` : "";
  hudEls.bounty.textContent = leader?.id === "you"
    ? `你已登顶！全场悬赏开启${giant}`
    : gap <= 80
      ? `差一点登顶！只差 ${formatNumber(gap)} 分${giant}`
      : bounty
        ? `距离第一 ${formatNumber(gap)} 分 · 悬赏：${bounty.name} +${TOP_BOUNTY_BONUS}${giant}`
        : `距离第一 ${formatNumber(gap)} 分`;
  hudEls.score.textContent = formatNumber(Math.floor(player.score));
  hudEls.hp.textContent = player.hp;
  hudEls.combo.textContent = `x${player.combo}`;
  hudEls.power.textContent = `00:${String(Math.ceil(player.power)).padStart(2, "0")}`;
  hudEls.coins.textContent = formatNumber(player.coins);
  hudEls.rank.textContent = `#${currentRank}`;
  const growthState = getGrowthState(player.growth || 0);
  hudEls.growth.textContent = `Lv.${growthState.level} ${growthState.name} ${getGrowthProgress(player)}%`;
  hudEls.time.textContent = formatNumber(standings.length);
  hudEls.mode.textContent = mode === "Ranked" ? `排位 ${formatTime(rankedTimeLeft)}` : "无尽";
  boostCooldownEl.style.transform = `scaleY(${player.boostCooldown > 0 ? Math.min(1, player.boostCooldown / 3.5) : 0})`;
}

function getStandings() {
  return [player, ...aiPlayers, ...systemPlayers].filter(Boolean).sort((a, b) => b.score - a.score);
}

function getBountyTarget() {
  return [player, ...aiPlayers].filter(Boolean).sort((a, b) => b.score - a.score)[0];
}

function isPlayerBounty() {
  const bounty = getBountyTarget();
  return bounty && bounty.id === "you";
}

function activateBoost() {
  if (!player || gameState !== "battle" || player.boostCooldown > 0) return;
  player.boostActive = 0.22;
  player.boostCooldown = 3.5;
  playSfx("boost");
  addDust(player.x, player.y, 12);
}

function onJoyStart(event) {
  joystickState.active = true;
  joystickState.id = event.pointerId;
  updateJoy(event);
}

function onJoyMove(event) {
  if (!joystickState.active || event.pointerId !== joystickState.id) return;
  updateJoy(event);
}

function onJoyEnd(event) {
  if (event.pointerId !== joystickState.id) return;
  joystickState = { active: false, id: null, x: 0, y: 0, dx: 0, dy: 0 };
  stick.style.transform = "translate(-50%, -50%)";
}

function updateJoy(event) {
  const rect = joystick.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const max = rect.width * 0.31;
  let dx = event.clientX - cx;
  let dy = event.clientY - cy;
  const len = Math.hypot(dx, dy);
  if (len > max) {
    dx = (dx / len) * max;
    dy = (dy / len) * max;
  }
  joystickState.dx = dx / max;
  joystickState.dy = dy / max;
  stick.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateCamera();
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);
  ctx.translate(-cameraX, -cameraY);
  drawMap();
  if (gameState === "battle") {
    drawResourceZones();
    drawPickups();
    sentinels.forEach(drawSentinel);
    aiPlayers.forEach(drawCompetitor);
    drawCompetitor(player);
    drawParticles();
    drawSafety();
    drawFieldBanner();
    drawTopMapMarkers();
  } else {
    drawPreview();
  }
  ctx.restore();
}

function updateCamera() {
  const targetX = player && gameState === "battle" ? player.x - viewportWidth / 2 : 0;
  const targetY = player && gameState === "battle" ? player.y - viewportHeight / 2 : 0;
  cameraX = clamp(targetX, 0, Math.max(0, WORLD_WIDTH - viewportWidth));
  cameraY = clamp(targetY, 0, Math.max(0, WORLD_HEIGHT - viewportHeight));
}

function drawMap() {
  const img = images.mapEmpty;
  if (img) {
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLUMNS; col++) {
        ctx.drawImage(img, col * VIEW_WIDTH, row * VIEW_HEIGHT, VIEW_WIDTH, VIEW_HEIGHT);
      }
    }
    return;
  }

  ctx.fillStyle = "#17303a";
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  drawWater();
  drawWalkways();
  drawHarborProps();
  vignette();
}

function drawWater() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x]) continue;
      const wx = x * TILE;
      const wy = y * TILE;
      ctx.fillStyle = seeded(x, y) > 0.5 ? "#183945" : "#14313b";
      ctx.fillRect(wx, wy, TILE, TILE);
      ctx.strokeStyle = "rgba(124, 168, 166, 0.16)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wx + 6, wy + 30 + seeded(y, x) * 8);
      ctx.quadraticCurveTo(wx + 25, wy + 18, wx + 44, wy + 29);
      ctx.stroke();
    }
  }
}

function drawWalkways() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!grid[y][x]) continue;
      const wx = x * TILE;
      const wy = y * TILE;
      ctx.fillStyle = seeded(x, y) > 0.45 ? "#b98a4c" : "#a87942";
      roundedRect(wx + 2, wy + 2, TILE - 4, TILE - 4, 7, true, false);
      ctx.strokeStyle = "#5a3a25";
      ctx.lineWidth = 2;
      ctx.strokeRect(wx + 3, wy + 3, TILE - 6, TILE - 6);
      if (seeded(x + 3, y + 8) > 0.62) {
        ctx.strokeStyle = "rgba(58, 35, 21, 0.32)";
        ctx.beginPath();
        ctx.moveTo(wx + 8, wy + 12);
        ctx.lineTo(wx + 38, wy + 10 + seeded(y, x) * 18);
        ctx.stroke();
      }
    }
  }
}

function drawHarborProps() {
  for (let row = 0; row < MAP_ROWS; row++) {
    for (let col = 0; col < MAP_COLUMNS; col++) {
      const segment = row * MAP_COLUMNS + col;
      const ox = col * VIEW_WIDTH;
      const oy = row * VIEW_HEIGHT;
      const names = ["INKWELL HARBOR", "DEEP DOCKS", "KING PIER", "LOWER PIER", "RUSTY CANAL", "CROWN BASIN"];
      drawSign(ox + 48, oy + 45, `STAGE ${7 + segment}`, names[segment] || "INKWELL HARBOR");
      drawSign(ox + 42, oy + 445, "DANGER", "港口守卫");
      const barrels = [[1330, 760], [590, 810], [1420, 110], [1320, 250], [290, 110], [1040, 45]];
      barrels.forEach(([x, y]) => drawBarrel(ox + x, oy + y));
      [[126, 360], [1450, 305], [80, 96], [1520, 650]].forEach(([x, y]) => drawLamp(ox + x, oy + y));
      [[360, 730], [760, 110], [1180, 780], [1510, 110]].forEach(([x, y]) => drawCrates(ox + x, oy + y));
    }
  }
}

function drawPickups() {
  const t = previewTime;
  pellets.forEach((p) => {
    if (!p.alive) return;
    const r = Math.max(8, p.radius) + Math.sin(t * 5 + p.pulse) * 1.6;
    ctx.save();
    ctx.globalAlpha = 0.48;
    ctx.strokeStyle = "#fff1a0";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    drawStar(p.x, p.y, r + 4, r * 0.55, "#fff4a8", "#d98c2d");
    glowCircle(p.x, p.y, r * 0.72, "#ffd66b", 24);
  });
  powerPellets.forEach((p) => {
    if (!p.alive) return;
    const r = p.radius + Math.sin(t * 3 + p.pulse) * 3;
    drawInvincibleStar(p.x, p.y, r, t + p.pulse);
  });
  coins.forEach((coin) => {
    if (!coin.alive) return;
    drawCoin(coin.x, coin.y, coin.spin + t * 5, coin.value || 1);
  });
  tools.forEach((tool) => {
    if (!tool.alive) return;
    drawTool(tool, t);
  });
}

function drawResourceZones() {
  const center = getCenterRect();
  ctx.save();
  ctx.globalAlpha = isFinalCenterBonus() ? 0.26 : 0.16;
  ctx.fillStyle = isFinalCenterBonus() ? "#ffd66b" : "#c74332";
  roundedRect(center.x, center.y, center.w, center.h, 24, true, false);
  ctx.globalAlpha = 0.72;
  ctx.strokeStyle = isFinalCenterBonus() ? "#fff08a" : "#ff846b";
  ctx.lineWidth = 6;
  ctx.setLineDash([22, 12]);
  roundedRect(center.x, center.y, center.w, center.h, 24, false, true);
  ctx.setLineDash([]);
  ctx.fillStyle = "#fff3bf";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 5;
  ctx.font = "900 24px Trebuchet MS";
  ctx.textAlign = "center";
  const label = isFinalCenterBonus() ? "CENTER x2" : "HIGH RISK";
  ctx.strokeText(label, center.x + center.w / 2, center.y + 36);
  ctx.fillText(label, center.x + center.w / 2, center.y + 36);
  ctx.restore();
}

function drawFieldBanner() {
  if (fieldBanner.timer <= 0) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sw = window.innerWidth;
  const alpha = Math.min(1, fieldBanner.timer / 0.4);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(23, 12, 7, 0.86)";
  roundedRect(sw / 2 - 210, 52, 420, 42, 8, true, false);
  ctx.strokeStyle = fieldBanner.color || "#ffd66b";
  ctx.lineWidth = 3;
  roundedRect(sw / 2 - 210, 52, 420, 42, 8, false, true);
  ctx.fillStyle = "#fff3bf";
  ctx.font = "900 20px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(fieldBanner.text, sw / 2, 79);
  ctx.restore();
}

function drawInvincibleStar(x, y, radius, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(t * 2.4) * 0.12);
  ctx.globalCompositeOperation = "lighter";
  glowCircle(0, 0, radius * 0.72, "#fff08a", 42);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = powerColor(t);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, radius + 15 + Math.sin(t * 4) * 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  drawStar(0, 0, radius + 13, radius * 0.56, "#ffe66b", "#1b1008");
  ctx.fillStyle = "#fff6b8";
  drawStar(-radius * 0.18, -radius * 0.12, radius * 0.18, radius * 0.08, "#fff6b8", "#fff6b8");
  ctx.fillStyle = "#15100b";
  ctx.beginPath();
  ctx.ellipse(-radius * 0.24, -radius * 0.08, radius * 0.08, radius * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(radius * 0.24, -radius * 0.08, radius * 0.08, radius * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTopMapMarkers() {
  // Map-edge rank tags were visually noisy on mobile, so rankings stay in the leaderboard only.
}

function drawCompetitor(entity) {
  if (!entity || entity.respawn > 0) return;
  const rank = getEntityRank(entity);
  const tier = getEntityTier(entity, rank);
  ctx.save();
  ctx.translate(entity.x, entity.y);
  const pulse = Math.sin(previewTime * 8) * 0.06;
  const facing = entity.lastDir?.x < -0.15 ? -1 : 1;
  const visualScale = getTierVisualScale(tier) * getMassVisualScale(entity);
  drawGrowthAura(entity, tier, rank);
  drawTierAura(entity, tier, rank);
  ctx.scale(facing * visualScale, visualScale);
  if (entity.power > 0) {
    drawPowerAura(entity.radius, pulse);
  }
  if (entity.shield) {
    ctx.strokeStyle = "#9fe4ff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, entity.radius + 17, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (entity.magnet > 0) drawMagnetAura(entity.radius);
  if (entity.frozen > 0) drawFrozenShell(entity.radius);
  if (entity.cloak > 0) drawCloakAura(entity.radius);
  if (entity.cloak > 0) ctx.globalAlpha = 0.55;

  const skinImg = entity.id === "you" ? images[`skin:${entity.skin}`] : images[`enemy:${entity.skin}`];
  if (skinImg) {
    ctx.drawImage(skinImg, -entity.radius * 1.55, -entity.radius * 1.55, entity.radius * 3.1, entity.radius * 3.1);
    if (entity.power > 0) drawPowerOverlay(entity.radius);
  } else {
    drawCharacterFallback(entity);
  }
  ctx.restore();

  if (entity.id === "you") drawPlayerLocator(entity);
  drawNameLabel(entity, tier, rank);
}

function getEntityRank(entity) {
  if (!entity) return Infinity;
  if (rankMap.has(entity.id)) return rankMap.get(entity.id);
  if (entity.elite && entity.rankSeed) return entity.rankSeed;
  return Infinity;
}

function getEntityTier(entity, rank = getEntityRank(entity)) {
  if (rank <= 6 || entity.elite) return "top";
  if (rank <= 50) return "rising";
  return "normal";
}

function getTierVisualScale(tier) {
  if (tier === "top") return 1.24;
  if (tier === "rising") return 1.08;
  return 0.88;
}

function getGrowthState(growth = 0) {
  const mass = clamp(1 + Math.max(0, growth) * GROWTH_CONFIG.massPerGrowth, 1, GROWTH_CONFIG.maxMass);
  const level =
    mass >= GROWTH_CONFIG.level5Mass ? 5 :
    mass >= GROWTH_CONFIG.level4Mass ? 4 :
    mass >= GROWTH_CONFIG.level3Mass ? 3 :
    mass >= GROWTH_CONFIG.level2Mass ? 2 : 1;
  const names = ["", "小不点", "发育中", "强势者", "巨型玩家", "港口巨兽"];
  return { mass, level, name: names[level] };
}

function getGrowthProgress(entity) {
  const growth = Math.max(0, entity?.growth || 0);
  const currentLevel = getGrowthState(growth).level;
  const thresholds = [0, 20, 47, 80, 134, Math.ceil((GROWTH_CONFIG.maxMass - 1) / GROWTH_CONFIG.massPerGrowth)];
  const start = thresholds[currentLevel - 1] || 0;
  const end = thresholds[currentLevel] || thresholds[thresholds.length - 1];
  const percent = currentLevel >= 5 ? 100 : clamp(((growth - start) / Math.max(1, end - start)) * 100, 0, 100);
  return Math.round(percent);
}

function addGrowth(entity, amount, label = "") {
  if (!entity || amount <= 0) return;
  const beforeLevel = entity.sizeLevel || 1;
  entity.growth = Math.max(0, (entity.growth || 0) + amount);
  const state = getGrowthState(entity.growth);
  entity.mass = state.mass;
  entity.sizeLevel = state.level;
  entity.auraLevel = state.level;
  entity.growPulse = 0.34;
  if (entity === player && label && amount >= 2) showFloatingText(entity.x, entity.y - entity.radius - 26, label, "#fff08a", 0.82);
  if (state.level > beforeLevel) {
    entity.levelPulse = 1;
    showFloatingText(entity.x, entity.y - entity.radius - 42, `LEVEL UP! ${state.name}`, "#7ee7ff", 1.1);
    addRing(entity.x, entity.y, entity.radius + 22, entity.radius + 115, "#fff08a", 0.75);
    if (entity === player) {
      playSfx("levelUp");
      showFieldBanner(`LEVEL UP! ${state.name}`, "#fff08a", 2.1);
    } else if (state.level >= 4) {
      showFieldBanner(`巨型玩家 ${entity.name} 出现！`, "#ff846b", 2.4);
    }
  } else if (entity === player && amount >= GROWTH_CONFIG.coinGrowth) {
    playSfx("grow");
  }
}

function resetGrowth(entity) {
  if (!entity) return;
  entity.growth = 0;
  entity.mass = 1;
  entity.sizeLevel = 1;
  entity.auraLevel = 1;
  entity.lastSizeLevel = 1;
  entity.growPulse = 0;
  entity.levelPulse = 0;
}

function getMassVisualScale(entity) {
  const mass = entity?.mass || 1;
  const pulse = (entity?.growPulse || 0) > 0 ? Math.sin((entity.growPulse / 0.34) * Math.PI) * 0.08 : 0;
  return clamp(1 + (mass - 1) * 0.28 + pulse, 1, GROWTH_CONFIG.maxVisualScale);
}

function getMassSpeedFactor(entity) {
  return 1 - Math.min(((entity?.mass || 1) - 1) * 0.08, 0.22);
}

function getPickupRadius(entity) {
  return GROWTH_CONFIG.pickupRadiusBase + (entity?.mass || 1) * GROWTH_CONFIG.pickupRadiusPerMass;
}

function drawGrowthAura(entity, tier, rank) {
  const level = entity.sizeLevel || 1;
  const r = entity.radius * getMassVisualScale(entity);
  const t = previewTime;
  ctx.save();
  if (level >= 2 || entity.id === "you") {
    const alpha = entity.id === "you" ? 0.62 : level >= 4 ? 0.45 : 0.28;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = entity.id === "you" ? "#fff08a" : level >= 4 ? "#ff624d" : "#ffd66b";
    ctx.lineWidth = entity.id === "you" ? 6 : level >= 4 ? 5 : 3;
    ctx.setLineDash(entity.id === "you" ? [14, 8] : []);
    ctx.beginPath();
    ctx.arc(0, 0, r + 18 + Math.sin(t * 5 + rank) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (level >= 5) {
    ctx.globalAlpha = 0.2;
    const glow = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r + 105);
    glow.addColorStop(0, "rgba(255, 95, 58, 0.55)");
    glow.addColorStop(1, "rgba(255, 95, 58, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, r + 105, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPlayerLocator(entity) {
  const r = entity.radius * getMassVisualScale(entity);
  const y = entity.y - r - 62;
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "900 18px Trebuchet MS";
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#120c08";
  ctx.fillStyle = "#fff08a";
  ctx.strokeText("YOU", entity.x, y - 9);
  ctx.fillText("YOU", entity.x, y - 9);
  ctx.fillStyle = "#fff08a";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(entity.x, y + 8);
  ctx.lineTo(entity.x - 12, y - 10);
  ctx.lineTo(entity.x + 12, y - 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawTierAura(entity, tier, rank) {
  if (tier === "normal") return;
  const r = entity.radius;
  const t = previewTime;
  ctx.save();
  if (tier === "rising") {
    ctx.globalAlpha = 0.82;
    ctx.strokeStyle = "#7ee7ff";
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, r + 19 + Math.sin(t * 4 + rank) * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.42;
    ctx.strokeStyle = "#ffd66b";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(0, 0, r + 28 + Math.sin(t * 5) * 2, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
    ctx.globalAlpha = 0.75;
    for (let i = 0; i < 3; i++) {
      const a = t * 2.2 + i * 2.09;
      drawStar(Math.cos(a) * (r + 31), Math.sin(a) * (r + 31), 5.5, 2.4, "#eaffff", "#7ee7ff");
    }
  }
  if (tier === "top") {
    const glow = ctx.createRadialGradient(0, 0, r * 0.35, 0, 0, r + 72);
    glow.addColorStop(0, "rgba(255, 230, 132, 0.42)");
    glow.addColorStop(0.52, "rgba(255, 194, 64, 0.2)");
    glow.addColorStop(1, "rgba(255, 194, 64, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, r + 72, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 0.92;
    ctx.strokeStyle = "#ff3434";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, r + 20 + Math.sin(t * 7) * 3, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.92;
    ctx.lineWidth = 9;
    ctx.strokeStyle = "#ffd66b";
    ctx.setLineDash([18, 10]);
    ctx.beginPath();
    ctx.arc(0, 0, r + 27 + Math.sin(t * 4 + rank) * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.globalAlpha = 0.48;
    ctx.lineWidth = 15;
    ctx.strokeStyle = "#fff3a7";
    ctx.beginPath();
    ctx.arc(0, 0, r + 44 + Math.sin(t * 3) * 5, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();

    ctx.globalAlpha = 1;
    for (let i = 0; i < 6; i++) {
      const a = -Math.PI / 2 + i * (Math.PI * 2 / 6) + Math.sin(t * 2) * 0.1;
      const size = i % 2 === 0 ? 8 : 6;
      drawStar(Math.cos(a) * (r + 48), Math.sin(a) * (r + 48), size, size * 0.42, "#fff8bf", "#d98c2d");
    }

    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "rgba(32, 17, 9, 0.7)";
    ctx.beginPath();
    ctx.ellipse(0, r + 18, r + 33, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCharacterFallback(entity) {
  if (["crab", "fishman", "octopus", "captain", "blueMonster"].includes(entity.skin)) {
    drawMonsterSkin(entity.skin, entity.power > 0);
  } else {
    drawPlayerSkin(entity.skin, entity.power > 0);
  }
}

function drawPowerAura(radius, pulse) {
  const t = previewTime;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = 0.55 - i * 0.11;
    ctx.strokeStyle = powerColor(t + i * 0.8);
    ctx.lineWidth = 8 - i * 1.6 + pulse * 12;
    ctx.beginPath();
    ctx.arc(0, 0, radius + 15 + i * 10 + Math.sin(t * 8 + i) * 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let i = 0; i < 8; i++) {
    const a = t * 3.5 + (i / 8) * Math.PI * 2;
    const r = radius + 34 + Math.sin(t * 5 + i) * 5;
    drawStar(Math.cos(a) * r, Math.sin(a) * r, 8, 3.4, "#fff8b8", powerColor(t + i));
  }
  ctx.restore();
}

function drawPowerOverlay(radius) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = 0.42;
  ctx.fillStyle = powerColor(previewTime * 1.25);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.45, 0, Math.PI * 2);
  ctx.fill();
  drawBodySparkles(radius);
  ctx.restore();
}

function drawMagnetAura(radius) {
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = "#ff6b5a";
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, radius + 36 + Math.sin(previewTime * 8) * 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "#ff6b5a";
  ctx.font = "900 22px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("U", 0, -radius - 28);
  ctx.restore();
}

function drawFrozenShell(radius) {
  ctx.save();
  ctx.globalAlpha = 0.82;
  ctx.strokeStyle = "#a5eaff";
  ctx.fillStyle = "rgba(165, 234, 255, 0.18)";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, 0, radius + 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + previewTime;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * (radius + 4), Math.sin(a) * (radius + 4));
    ctx.lineTo(Math.cos(a) * (radius + 26), Math.sin(a) * (radius + 26));
    ctx.stroke();
  }
  ctx.restore();
}

function drawCloakAura(radius) {
  ctx.save();
  ctx.globalAlpha = 0.74;
  ctx.strokeStyle = "#b58cff";
  ctx.fillStyle = "rgba(88, 52, 111, 0.22)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(0, 3, radius + 22, radius + 15, Math.sin(previewTime * 2) * 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#eadcff";
  ctx.font = "900 20px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("MASK", 0, -radius - 26);
  ctx.restore();
}

function drawBodySparkles(radius) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 5; i++) {
    const a = previewTime * 5 + i * 1.7;
    const r = radius * (0.25 + (i % 3) * 0.18);
    drawStar(Math.cos(a) * r, Math.sin(a * 1.1) * r, 6.5, 2.5, "#fffbd0", powerColor(previewTime + i));
  }
  ctx.restore();
}

function drawPlayerSkin(skin, powered) {
  const body = powered ? powerColor(previewTime) : "#121111";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#120c08";
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 2, 31, 29, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  if (powered) drawBodySparkles(30);
  drawEyes(2, -11, 1.1);
  drawMouth(2, 9, true);
  drawTinyLimbs();
  if (skin === "royal") drawCrown(-5, -39);
  if (skin === "pirate") drawPirateHat(-2, -35);
  if (skin === "neon") drawHeadphones();
  if (skin === "cowboy") drawCowboyHat(-3, -35);
}

function drawMonsterSkin(skin, powered) {
  const colors = { crab: "#d94b32", fishman: "#3e8ca0", octopus: "#8742a5", captain: "#567d39", blueMonster: "#3d7890" };
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#120c08";
  ctx.fillStyle = powered ? powerColor(previewTime) : colors[skin];
  if (skin === "octopus") {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * 24, 20 + Math.sin(a) * 10, 13, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
  }
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 30, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  if (powered) drawBodySparkles(34);
  if (skin === "crab") {
    drawClaw(-38, 4); drawClaw(38, 4);
    drawSailorCap(-5, -36);
  }
  if (skin === "captain") {
    drawHorns(); drawTopHat(-5, -39);
  }
  if (skin === "fishman") drawSailorCap(-5, -38);
  if (skin === "blueMonster") drawSailorCap(-4, -35);
  drawEyes(0, -10, 0.9);
  drawMouth(0, 10, false);
}

function drawSentinel(sentinel) {
  if (sentinel.respawn > 0) return;
  ctx.save();
  ctx.translate(sentinel.x, sentinel.y);
  if (sentinel.state === "alert" || sentinel.state === "chase" || sentinel.powerGuard) {
    ctx.globalAlpha = sentinel.state === "chase" ? 0.72 : 0.46;
    ctx.strokeStyle = sentinel.state === "chase" ? "#ff4b3a" : "#ffb35a";
    ctx.lineWidth = sentinel.state === "chase" ? 7 : 5;
    ctx.setLineDash(sentinel.state === "chase" ? [] : [12, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, sentinel.radius + (sentinel.powerGuard ? 58 : 42) + Math.sin(previewTime * 6) * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  if (sentinel.state === "vulnerable") {
    ctx.strokeStyle = "#fff08a";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, sentinel.radius + 12, 0, Math.PI * 2);
    ctx.stroke();
  }
  if (sentinel.state === "frozen") {
    ctx.globalAlpha = 0.66;
    ctx.strokeStyle = "#a5eaff";
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(0, 0, sentinel.radius + 8, 0, Math.PI * 2);
    ctx.stroke();
    drawFrozenShell(sentinel.radius);
  }
  drawMonsterSkin(sentinel.type, sentinel.state === "vulnerable");
  ctx.restore();
  drawNameLabel({ ...sentinel, name: "Sentinel", score: 0, id: sentinel.id, radius: sentinel.radius });
}

function drawPreview() {
  const demo = [
    { id: "preview1", skin: "royal", x: 760 + Math.sin(previewTime) * 40, y: 455, radius: 34, power: 0, shield: 0, cloak: 0, name: "YOU", score: 0, lastDir: { x: 1, y: 0 } },
    { id: "preview2", skin: "crab", x: 420, y: 620 + Math.cos(previewTime * 0.8) * 25, radius: 30, power: 0, shield: 0, cloak: 0, name: "Ruby", score: 0, lastDir: { x: 1, y: 0 } },
    { id: "preview3", skin: "captain", x: 1210, y: 300, radius: 30, power: 0, shield: 0, cloak: 0, name: "Sentinel", score: 0, lastDir: { x: -1, y: 0 } }
  ];
  pellets.slice(0, 90).forEach((p) => p.alive && glowCircle(p.x, p.y, 4, "#ffd66b", 10));
  demo.forEach(drawCompetitor);
}

function drawSafety() {
  if (mode !== "Ranked") return;
  const zone = getSafeZone();
  if (zone.x <= 0) return;
  ctx.save();
  ctx.fillStyle = "rgba(128, 23, 22, 0.36)";
  ctx.fillRect(0, 0, WORLD_WIDTH, zone.y);
  ctx.fillRect(0, zone.y + zone.h, WORLD_WIDTH, WORLD_HEIGHT - zone.y - zone.h);
  ctx.fillRect(0, zone.y, zone.x, zone.h);
  ctx.fillRect(zone.x + zone.w, zone.y, WORLD_WIDTH - zone.x - zone.w, zone.h);
  ctx.strokeStyle = "rgba(255, 214, 107, 0.84)";
  ctx.setLineDash([18, 14]);
  ctx.lineWidth = 5;
  ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
  ctx.restore();
}

function renderShop() {
  if (!ui.skinGrid) return;
  ui.skinGrid.innerHTML = "";
  Object.entries(skinCatalog).forEach(([key, skin]) => {
    const owned = !!save.ownedSkins[key];
    const equipped = save.equippedSkin === key;
    const card = document.createElement("article");
    card.className = "skin-card";
    const preview = document.createElement("canvas");
    preview.className = "skin-preview";
    preview.width = 260;
    preview.height = 150;
    drawSkinPreview(preview, key);
    const btnText = equipped ? "已装备" : owned ? "装备" : `${skin.price} 金币`;
    const buyClass = owned ? "" : "buy";
    card.innerHTML = `<h3>${skin.cnName}</h3><p>${skin.rarity} · ${skin.name}</p><button class="${buyClass}">${btnText}</button>`;
    card.prepend(preview);
    card.querySelector("button").addEventListener("click", () => buyOrEquip(key));
    ui.skinGrid.append(card);
  });
  syncMeta();
}

function drawSkinPreview(previewCanvas, key) {
  const c = previewCanvas.getContext("2d");
  c.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  c.fillStyle = "#402515";
  c.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
  const glow = c.createRadialGradient(130, 78, 10, 130, 78, 95);
  glow.addColorStop(0, "rgba(255, 224, 133, 0.7)");
  glow.addColorStop(1, "rgba(255, 224, 133, 0)");
  c.fillStyle = glow;
  c.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
  c.save();
  c.translate(previewCanvas.width / 2, previewCanvas.height / 2 + 8);
  c.scale(1.55, 1.55);
  drawPreviewChomper(c, key);
  c.restore();
}

function drawPreviewChomper(c, skin) {
  c.lineWidth = 5;
  c.strokeStyle = "#120c08";
  c.fillStyle = skin === "neon" ? "#181321" : "#121111";
  c.beginPath();
  c.ellipse(0, 2, 31, 29, 0, 0, Math.PI * 2);
  c.fill();
  c.stroke();
  c.fillStyle = "#fff8d8";
  [-10, 12].forEach((dx) => {
    c.beginPath();
    c.ellipse(dx, -11, 11, 15, 0.1, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.fillStyle = "#17140f";
    c.beginPath();
    c.ellipse(dx + 2, -9, 4, 8, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = "#fff8d8";
  });
  c.fillStyle = "#170908";
  c.beginPath();
  c.ellipse(2, 9, 23, 16, 0, 0, Math.PI);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = "#fff4ce";
  for (let i = -2; i <= 2; i++) {
    c.beginPath();
    c.moveTo(2 + i * 8, 8);
    c.lineTo(6 + i * 8, 17);
    c.lineTo(-2 + i * 8, 17);
    c.closePath();
    c.fill();
  }
  c.fillStyle = "#d94635";
  c.beginPath();
  c.ellipse(7, 21, 9, 5, -0.2, 0, Math.PI * 2);
  c.fill();
  if (skin === "royal") {
    c.fillStyle = "#f3c652";
    c.beginPath();
    c.moveTo(-27, -17);
    c.lineTo(-23, -41);
    c.lineTo(-11, -27);
    c.lineTo(-3, -46);
    c.lineTo(7, -27);
    c.lineTo(18, -41);
    c.lineTo(18, -17);
    c.closePath();
    c.fill();
    c.stroke();
  }
  if (skin === "pirate") {
    c.fillStyle = "#11100d";
    c.beginPath();
    c.moveTo(-37, -17);
    c.quadraticCurveTo(0, -53, 37, -17);
    c.quadraticCurveTo(16, -5, -18, -11);
    c.closePath();
    c.fill();
    c.stroke();
    c.fillStyle = "#d74732";
    c.fillRect(-22, -16, 44, 8);
  }
  if (skin === "neon") {
    c.strokeStyle = "#7f4cff";
    c.lineWidth = 7;
    c.beginPath();
    c.arc(0, -7, 38, Math.PI * 1.05, Math.PI * 1.95);
    c.stroke();
  }
  if (skin === "cowboy") {
    c.fillStyle = "#7d4b22";
    c.beginPath();
    c.ellipse(0, -11, 40, 12, 0, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.beginPath();
    c.roundRect(-18, -37, 36, 27, 8);
    c.fill();
    c.stroke();
  }
}

function buyOrEquip(key) {
  const skin = skinCatalog[key];
  if (!save.ownedSkins[key]) {
    if (save.coins < skin.price) return toast("金币不足，再去迷宫里抢一些！");
    save.coins -= skin.price;
    save.ownedSkins[key] = true;
  }
  save.equippedSkin = key;
  persistSave();
  renderShop();
}

// iOS Safari may report the old portrait viewport for a frame after rotation.
function scheduleResize() {
  cancelAnimationFrame(resizeFrame);
  clearTimeout(resizeTimer);
  resizeFrame = requestAnimationFrame(() => {
    resizeFrame = requestAnimationFrame(resize);
  });
  resizeTimer = window.setTimeout(resize, 260);
}

function resize() {
  const dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
  const appRect = app.getBoundingClientRect();
  const w = Math.max(1, Math.round(appRect.width || window.visualViewport?.width || window.innerWidth));
  const h = Math.max(1, Math.round(appRect.height || window.visualViewport?.height || window.innerHeight));
  const pixelWidth = Math.floor(w * dpr);
  const pixelHeight = Math.floor(h * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
  }
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  viewportWidth = VIEW_WIDTH / CAMERA_ZOOM;
  viewportHeight = VIEW_HEIGHT / CAMERA_ZOOM;
  scale = Math.min(w / viewportWidth, h / viewportHeight);
  offsetX = (w - viewportWidth * scale) / 2;
  offsetY = (h - viewportHeight * scale) / 2;
}

function moveEntity(entity, dx, dy) {
  if (!dx && !dy) return;
  const radius = effectiveCollisionRadius(entity);
  const nx = entity.x + dx;
  if (canStand(nx, entity.y, radius)) entity.x = nx;
  const ny = entity.y + dy;
  if (canStand(entity.x, ny, radius)) entity.y = ny;
}

function effectiveCollisionRadius(entity) {
  const massCollision = 1 + Math.min(((entity?.mass || 1) - 1) * 0.15, 0.28);
  return entity.radius * (entity.power > 0 ? POWER_SIZE_MULTIPLIER : 1) * massCollision;
}

function followPath(entity, dt, speed) {
  if (!entity.path || entity.path.length === 0) return;
  const target = entity.path[0];
  const dx = target.x - entity.x;
  const dy = target.y - entity.y;
  const d = Math.hypot(dx, dy);
  if (d < 10) {
    entity.path.shift();
    return;
  }
  entity.lastDir = { x: dx / d, y: dy / d };
  moveEntity(entity, (dx / d) * speed * dt, (dy / d) * speed * dt);
}

function canStand(x, y, radius) {
  const samples = [[0, 0], [radius * 0.7, 0], [-radius * 0.7, 0], [0, radius * 0.7], [0, -radius * 0.7]];
  return samples.every(([sx, sy]) => {
    const tx = Math.floor((x + sx) / TILE);
    const ty = Math.floor((y + sy) / TILE);
    return grid[ty]?.[tx] === 1;
  });
}

function pathTo(x, y, tx, ty) {
  const start = nearestTile(x, y);
  const end = nearestTile(tx, ty);
  const queue = [start];
  const prev = new Map();
  const seen = new Set([tileKey(start)]);
  while (queue.length) {
    const cur = queue.shift();
    if (cur.x === end.x && cur.y === end.y) break;
    for (const nb of neighbors(cur)) {
      const k = tileKey(nb);
      if (!seen.has(k)) {
        seen.add(k);
        prev.set(k, cur);
        queue.push(nb);
      }
    }
  }
  const endKey = tileKey(end);
  if (!seen.has(endKey)) return [tileCenter(end.x, end.y)];
  const path = [];
  let cur = end;
  while (tileKey(cur) !== tileKey(start)) {
    path.push(tileCenter(cur.x, cur.y));
    cur = prev.get(tileKey(cur));
  }
  return path.reverse().slice(0, 14);
}

function neighbors(tile) {
  return [[1, 0], [-1, 0], [0, 1], [0, -1]]
    .map(([dx, dy]) => ({ x: tile.x + dx, y: tile.y + dy }))
    .filter((n) => grid[n.y]?.[n.x] === 1);
}

function nearestTile(x, y) {
  let tx = clamp(Math.floor(x / TILE), 0, COLS - 1);
  let ty = clamp(Math.floor(y / TILE), 0, ROWS - 1);
  if (grid[ty]?.[tx]) return { x: tx, y: ty };
  let best = cells[0];
  let bestD = Infinity;
  cells.forEach((c) => {
    const d = Math.abs(c.x - tx) + Math.abs(c.y - ty);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  });
  return { x: best.x, y: best.y };
}

function respawnCompetitor(ai) {
  const c = randomCell((cell) => distance(cell.wx, cell.wy, player.x, player.y) > 520 && isSpawnCellOpen(cell, 280));
  ai.x = c.wx;
  ai.y = c.wy;
  ai.power = 0;
  ai.attackDrive = 0;
  ai.combo = 0;
  ai.intent = "farm";
  ai.focusTargetId = null;
  ai.huntLock = 0;
  ai.path = [];
}

function randomCell(predicate = () => true) {
  for (let i = 0; i < 100; i++) {
    const c = cells[Math.floor(Math.random() * cells.length)];
    if (predicate(c)) return c;
  }
  return cells[Math.floor(Math.random() * cells.length)];
}

function isSpawnCellOpen(cell, minDistance = 250) {
  const wx = cell.wx ?? cell.x * TILE + TILE / 2;
  const wy = cell.wy ?? cell.y * TILE + TILE / 2;
  const occupants = [player, ...aiPlayers].filter((entity) => entity && entity.respawn <= 0);
  return occupants.every((entity) => distance(wx, wy, entity.x, entity.y) >= minDistance);
}

function farthestCellFrom(x, y) {
  let best = cells[0];
  let bestD = -1;
  for (let i = 0; i < 40; i++) {
    const c = randomCell();
    const d = distance(c.wx, c.wy, x, y);
    if (d > bestD) {
      bestD = d;
      best = c;
    }
  }
  return { x: best.wx, y: best.wy };
}

function nearestAlive(entity, list) {
  let best = null;
  let bestD = Infinity;
  list.forEach((item) => {
    if (!item.alive) return;
    const d = distance(entity.x, entity.y, item.x, item.y);
    if (d < bestD) {
      bestD = d;
      best = item;
    }
  });
  return best;
}

function nearestHuntableCompetitor(ai, options = {}) {
  const includePlayer = options.includePlayer !== false;
  const includePowered = options.includePowered !== false;
  const lowerScoreBy = options.lowerScoreBy || 0;
  const maxDistance = options.maxDistance || Infinity;
  const preferHighScore = !!options.preferHighScore;
  let best = null;
  let bestD = Infinity;
  const candidates = [...aiPlayers, ...(includePlayer ? [player] : [])];
  candidates.forEach((target) => {
    if (!target || target === ai || target.respawn > 0) return;
    if (!includePowered && target.power > 0) return;
    if (target.cloak > 0) return;
    if (lowerScoreBy && (target.score || 0) + lowerScoreBy > (ai.score || 0)) return;
    const d = distance(ai.x, ai.y, target.x, target.y);
    if (d > maxDistance) return;
    const rankBias = target.elite ? -260 : target.id === "you" ? -80 : 0;
    const scoreBias = preferHighScore ? -Math.min(420, Math.max(0, target.score || 0) / 180) : 0;
    const score = d + rankBias + scoreBias;
    if (score < bestD) {
      bestD = score;
      best = target;
    }
  });
  return best;
}

function nearestCollisionRisk(ai, maxDistance = 180) {
  let best = null;
  let bestD = Infinity;
  [player, ...aiPlayers].forEach((target) => {
    if (!target || target === ai || target.respawn > 0 || target.cloak > 0) return;
    const d = distance(ai.x, ai.y, target.x, target.y);
    if (d < maxDistance && d < bestD) {
      bestD = d;
      best = target;
    }
  });
  return best;
}

function nearestGiantThreat(ai, maxDistance = 760) {
  let best = null;
  let bestScore = Infinity;
  [player, ...aiPlayers].forEach((target) => {
    if (!target || target === ai || target.respawn > 0 || target.cloak > 0) return;
    if ((target.sizeLevel || 1) < 4 && (target.mass || 1) < (ai.mass || 1) + 0.65) return;
    const d = distance(ai.x, ai.y, target.x, target.y);
    if (d < maxDistance && d < bestScore) {
      bestScore = d;
      best = target;
    }
  });
  return best;
}

function nearestWeakerCompetitor(ai, includePlayer = true, maxDistance = 860) {
  let best = null;
  let bestScore = Infinity;
  [...aiPlayers, ...(includePlayer ? [player] : [])].forEach((target) => {
    if (!target || target === ai || target.respawn > 0 || target.power > 0 || target.cloak > 0) return;
    if ((target.mass || 1) > (ai.mass || 1) - 0.25 && ai.power <= 0) return;
    const d = distance(ai.x, ai.y, target.x, target.y);
    if (d > maxDistance) return;
    const score = d - Math.max(0, (target.score || 0) / 260);
    if (score < bestScore) {
      bestScore = score;
      best = target;
    }
  });
  return best;
}

function tileCenter(x, y) {
  return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
}

function tileKey(tile) {
  return `${tile.x},${tile.y}`;
}

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function bumpApart(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const d = Math.hypot(dx, dy) || 1;
  moveEntity(a, (dx / d) * 4, (dy / d) * 4);
  moveEntity(b, (-dx / d) * 4, (-dy / d) * 4);
}

function toast(text) {
  const div = document.createElement("div");
  div.className = "toast";
  div.textContent = text;
  messageStack.append(div);
  setTimeout(() => div.remove(), 1650);
}

function updateParticles(dt) {
  particles.forEach((p) => {
    p.life -= dt;
    if (p.ring) {
      p.radius += p.grow * dt;
    } else if (p.text) {
      p.y += p.vy * dt;
    } else {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 35 * dt;
    }
  });
  particles = particles.filter((p) => p.life > 0);
}

function addDust(x, y, count = 1, color = "#e8c083") {
  for (let i = 0; i < count; i++) particles.push({ x: x + rand(-12, 12), y: y + rand(-8, 8), vx: rand(-45, 45), vy: rand(-55, 20), life: rand(0.25, 0.55), color, size: rand(4, 9) });
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = rand(70, 210);
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.35, 0.75), color, size: rand(4, 10) });
  }
}

function showFloatingText(x, y, text, color = "#fff08a", life = 0.9) {
  particles.push({ x, y, vy: -42, life, startLife: life, color, text });
}

function addRing(x, y, radius, maxRadius, color, life = 0.6) {
  particles.push({
    x,
    y,
    radius,
    grow: (maxRadius - radius) / life,
    maxRadius,
    life,
    startLife: life,
    color,
    ring: true
  });
}

function iceBurst(x, y, count) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = rand(45, 160);
    particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: rand(0.35, 0.75),
      color: "#a5eaff",
      size: rand(5, 11),
      star: true,
      spin: rand(0, Math.PI * 2)
    });
  }
}

function cloakMist(x, y, count) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = rand(20, 90);
    particles.push({
      x: x + rand(-20, 20),
      y: y + rand(-18, 18),
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 20,
      life: rand(0.55, 1),
      color: "#a77bd8",
      size: rand(8, 18),
      mist: true
    });
  }
}

function starBurst(x, y, count) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = rand(110, 270);
    particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: rand(0.42, 0.8),
      color: powerColor(i * 0.8),
      size: rand(8, 16),
      star: true,
      spin: rand(0, Math.PI * 2)
    });
  }
}

function drawParticles() {
  particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life * 1.8);
    if (p.ring) {
      const alpha = Math.max(0, p.life / p.startLife);
      ctx.globalAlpha = alpha * 0.72;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 7 * alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.text) {
      const alpha = Math.max(0, p.life / (p.startLife || p.life || 1));
      ctx.globalAlpha = alpha;
      ctx.font = "900 18px Trebuchet MS";
      ctx.textAlign = "center";
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#120c08";
      ctx.fillStyle = p.color;
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillText(p.text, p.x, p.y);
    } else if (p.star) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.spin || 0) + previewTime * 5);
      drawStar(0, 0, p.size, p.size * 0.42, "#fffbd0", p.color);
      ctx.restore();
    } else {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
}

function shake() {
  canvas.animate([
    { transform: "translate(0,0)" },
    { transform: "translate(7px,-4px)" },
    { transform: "translate(-5px,5px)" },
    { transform: "translate(0,0)" }
  ], { duration: 230, easing: "ease-out" });
}

function drawNameLabel(entity, tier = "normal", rank = Infinity) {
  ctx.save();
  const isTop = tier === "top";
  const isRising = tier === "rising";
  ctx.font = `900 ${isTop ? 20 : isRising ? 17 : 15}px Trebuchet MS`;
  ctx.textAlign = "center";
  ctx.lineWidth = isTop ? 7 : 5;
  ctx.strokeStyle = "#120c08";
  ctx.fillStyle = entity.id === "you" ? "#fff08a" : isTop ? "#ffe16f" : isRising ? "#bff6ff" : "#fff1be";
  const visualRadius = entity.radius * getMassVisualScale(entity) * getTierVisualScale(tier);
  const y = entity.y - visualRadius - (isTop ? 18 : isRising ? 15 : 12);
  if (isTop || isRising) {
    const text = isTop ? `${entity.name}` : `${entity.name}`;
    const w = Math.min(isTop ? 128 : 112, Math.max(isTop ? 82 : 68, ctx.measureText(text).width + 18));
    ctx.globalAlpha = isTop ? 0.72 : 0.58;
    ctx.fillStyle = isTop ? "rgba(82, 39, 12, 0.82)" : "rgba(15, 55, 64, 0.78)";
    ctx.strokeStyle = isTop ? "#ffd66b" : "#7ee7ff";
    ctx.lineWidth = isTop ? 3 : 2;
    roundedRect(entity.x - w / 2, y - 18, w, isTop ? 25 : 22, 7, true, true);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#120c08";
    ctx.lineWidth = isTop ? 6 : 5;
    ctx.fillStyle = entity.id === "you" ? "#fff08a" : isTop ? "#ffe16f" : "#bff6ff";
  }
  ctx.strokeText(entity.name, entity.x, y);
  ctx.fillText(entity.name, entity.x, y);
  ctx.restore();
}

function drawBountyMark(x, y) {
  drawCrownAt(x, y - 14, 0.75);
  ctx.save();
  ctx.fillStyle = "#c74332";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x + 24, y + 4, 14, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#fff1be";
  ctx.font = "900 15px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("赏", x + 24, y + 9);
  ctx.restore();
}

function drawEliteMark(x, y, rankSeed) {
  drawTopRankMark(x, y, rankSeed);
}

function drawTopRankMark(x, y, rankSeed) {
  ctx.save();
  ctx.translate(x, y);
  const rank = Number.isFinite(rankSeed) ? rankSeed : 6;
  ctx.fillStyle = "#ffd66b";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 5;
  roundedRect(-47, -19, 94, 31, 7, true, true);
  ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
  roundedRect(-40, -15, 80, 8, 4, true, false);
  drawCrownAt(-38, -25, 0.42);
  ctx.fillStyle = "#211208";
  ctx.font = "900 15px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(formatRankCn(rank), 8, 1);
  ctx.restore();
}

function formatRankCn(rank) {
  const labels = ["榜一", "榜二", "榜三", "榜四", "榜五", "榜六"];
  return labels[Math.max(0, Math.min(5, rank - 1))] || `榜${rank}`;
}

function drawRisingMark(x, y, rank) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#7ee7ff";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  roundedRect(-39, -14, 78, 24, 6, true, true);
  ctx.fillStyle = "#12333b";
  ctx.font = "900 12px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(rank <= 30 ? `TOP ${rank}` : "TOP 50", 0, 2);
  ctx.fillStyle = "#fff1a0";
  ctx.beginPath();
  ctx.moveTo(-48, -2);
  ctx.lineTo(-40, -10);
  ctx.lineTo(-40, 6);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(48, -2);
  ctx.lineTo(40, -10);
  ctx.lineTo(40, 6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawEyes(x, y, scaleFactor) {
  ctx.fillStyle = "#fff8d8";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  [-10, 12].forEach((dx) => {
    ctx.beginPath();
    ctx.ellipse(x + dx, y, 10 * scaleFactor, 15 * scaleFactor, 0.1, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#17140f";
    ctx.beginPath();
    ctx.ellipse(x + dx + 2, y + 2, 4 * scaleFactor, 8 * scaleFactor, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff8d8";
  });
}

function drawMouth(x, y, happy) {
  ctx.fillStyle = "#170908";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(x, y, 23, happy ? 16 : 14, 0, 0, Math.PI);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#fff4ce";
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * 8, y - 1);
    ctx.lineTo(x + i * 8 + 4, y + 8);
    ctx.lineTo(x + i * 8 - 4, y + 8);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = "#d94635";
  ctx.beginPath();
  ctx.ellipse(x + 5, y + 12, 9, 5, -0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawTinyLimbs() {
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 5;
  ctx.fillStyle = "#15120f";
  [[-24, 20], [25, 19], [-28, 2], [29, 1]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.ellipse(x, y, 9, 14, 0.8, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
  });
}

function drawCrown(x, y) {
  ctx.fillStyle = "#f3c652";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 22, y + 22);
  ctx.lineTo(x - 18, y - 2);
  ctx.lineTo(x - 6, y + 12);
  ctx.lineTo(x + 2, y - 7);
  ctx.lineTo(x + 12, y + 12);
  ctx.lineTo(x + 23, y - 2);
  ctx.lineTo(x + 23, y + 22);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
}

function drawCrownAt(x, y, s) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  drawCrown(0, 0);
  ctx.restore();
}

function drawPirateHat(x, y) {
  ctx.fillStyle = "#11100d";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x - 35, y + 18);
  ctx.quadraticCurveTo(x, y - 18, x + 36, y + 18);
  ctx.quadraticCurveTo(x + 16, y + 30, x - 18, y + 24);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#d74732";
  ctx.fillRect(x - 22, y + 19, 44, 8);
}

function drawCowboyHat(x, y) {
  ctx.fillStyle = "#7d4b22";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(x, y + 24, 40, 12, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(x - 18, y - 2, 36, 27, 8);
  ctx.fill(); ctx.stroke();
}

function drawSailorCap(x, y) {
  ctx.fillStyle = "#fff0c5";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(x, y + 12, 28, 12, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(x - 18, y - 6, 36, 18, 7);
  ctx.fill(); ctx.stroke();
}

function drawTopHat(x, y) {
  ctx.fillStyle = "#1e1d1c";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(x, y + 29, 36, 10, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(x - 19, y, 38, 30, 6);
  ctx.fill(); ctx.stroke();
}

function drawHeadphones() {
  ctx.strokeStyle = "#7f4cff";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, -7, 38, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();
  ctx.fillStyle = "#40dfff";
  [-34, 34].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, -2, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}

function drawHorns() {
  ctx.fillStyle = "#ead7a2";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  [-33, 33].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, -20);
    ctx.quadraticCurveTo(x * 1.25, -38, x * 1.1, -54);
    ctx.quadraticCurveTo(x * 0.75, -39, x * 0.72, -21);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  });
}

function drawClaw(x, y) {
  ctx.fillStyle = "#d94b32";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0.2, Math.PI * 1.75);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill(); ctx.stroke();
}

function drawTool(tool, t) {
  ctx.save();
  ctx.translate(tool.x, tool.y + Math.sin(t * 4 + tool.pulse) * 3);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#120c08";
  if (tool.type === "speed") {
    ctx.fillStyle = "#49a7ff";
    ctx.beginPath(); ctx.moveTo(-6, -19); ctx.lineTo(13, -4); ctx.lineTo(2, -2); ctx.lineTo(9, 18); ctx.lineTo(-14, 1); ctx.lineTo(-2, -1); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  if (tool.type === "shield") {
    ctx.shadowColor = "#9fe4ff";
    ctx.shadowBlur = 18;
    ctx.fillStyle = "#9fe4ff";
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(23, -12);
    ctx.lineTo(17, 18);
    ctx.lineTo(0, 28);
    ctx.lineTo(-17, 18);
    ctx.lineTo(-23, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(0, 14);
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();
  }
  if (tool.type === "magnet") {
    ctx.shadowColor = "#ff6b5a";
    ctx.shadowBlur = 16;
    ctx.strokeStyle = "#120c08";
    ctx.lineWidth = 15;
    ctx.beginPath();
    ctx.arc(0, -2, 24, 0, Math.PI);
    ctx.stroke();
    ctx.strokeStyle = "#e34639";
    ctx.lineWidth = 11;
    ctx.beginPath();
    ctx.arc(0, -2, 24, 0, Math.PI);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#f4f0d4";
    ctx.strokeStyle = "#120c08";
    ctx.lineWidth = 3;
    ctx.fillRect(-29, -4, 12, 16);
    ctx.strokeRect(-29, -4, 12, 16);
    ctx.fillRect(17, -4, 12, 16);
    ctx.strokeRect(17, -4, 12, 16);
  }
  if (tool.type === "freeze") {
    drawStar(0, 0, 23, 8, "#a5eaff", "#3c8cc8");
  }
  if (tool.type === "cloak") {
    ctx.fillStyle = "#7f4b9a";
    ctx.beginPath(); ctx.ellipse(0, 0, 20, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#120c08";
    ctx.beginPath(); ctx.arc(-7, -2, 4, 0, Math.PI * 2); ctx.arc(7, -2, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawCoin(x, y, spin, value = 1) {
  ctx.save();
  ctx.translate(x, y);
  if (value > 1) {
    ctx.fillStyle = "#7d4b22";
    ctx.strokeStyle = "#120c08";
    ctx.lineWidth = 4;
    roundedRect(-15, -11, 30, 24, 5, true, true);
    ctx.fillStyle = "#ffd66b";
    ctx.beginPath();
    ctx.arc(0, -9 + Math.sin(spin) * 2, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#fff1a0";
    ctx.font = "900 12px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(`x${value}`, 0, 8);
    ctx.restore();
    return;
  }
  ctx.scale(Math.max(0.28, Math.abs(Math.cos(spin))), 1);
  ctx.fillStyle = "#ffd66b";
  ctx.strokeStyle = "#7d471b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 0, 11, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#9e6324";
  ctx.font = "900 13px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("$", 0, 5);
  ctx.restore();
}

function glowCircle(x, y, r, color, glow) {
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = glow;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStar(x, y, outer, inner, fill, stroke) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outer : inner;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 4;
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

function powerColor(t) {
  const hue = Math.floor((t * 120) % 360);
  return `hsl(${hue}, 96%, 66%)`;
}

function drawSign(x, y, line1, line2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.03);
  ctx.fillStyle = "#efd492";
  ctx.strokeStyle = "#23140c";
  ctx.lineWidth = 5;
  roundedRect(0, 0, 210, 86, 8, true, true);
  ctx.fillStyle = "#211208";
  ctx.font = "900 29px Trebuchet MS";
  ctx.fillText(line1, 22, 36);
  ctx.font = "900 24px Trebuchet MS";
  ctx.fillText(line2, 16, 67);
  ctx.restore();
}

function drawBarrel(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#8a5428";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-28, -35, 56, 70, 10);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle = "rgba(255,214,107,0.35)";
  ctx.fillRect(-25, -17, 50, 8);
  ctx.fillRect(-25, 14, 50, 8);
  ctx.restore();
}

function drawLamp(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 60); ctx.stroke();
  glowCircle(0, 36, 16, "#ffe59d", 22);
  ctx.strokeRect(-17, 20, 34, 32);
  ctx.restore();
}

function drawCrates(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#7a4525";
  ctx.strokeStyle = "#120c08";
  ctx.lineWidth = 4;
  for (let i = 0; i < 2; i++) {
    ctx.strokeRect(i * 42, 0, 38, 38);
    ctx.fillRect(i * 42, 0, 38, 38);
    ctx.beginPath();
    ctx.moveTo(i * 42, 0);
    ctx.lineTo(i * 42 + 38, 38);
    ctx.moveTo(i * 42 + 38, 0);
    ctx.lineTo(i * 42, 38);
    ctx.stroke();
  }
  ctx.restore();
}

function roundedRect(x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function vignette() {
  const gradient = ctx.createRadialGradient(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 220, WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 880);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.48)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
}

function formatNumber(n) {
  return Math.floor(n).toLocaleString("en-US");
}

function getRankByPoints(points) {
  const score = Math.max(0, Number.isFinite(points) ? points : 0);
  return RANK_POINT_TIERS.find((tier) => score >= tier.min && score <= tier.max) || RANK_POINT_TIERS[0];
}

function formatRankTitle(stars) {
  const tier = stars >= 16 ? "港口王者" : stars >= 11 ? "黄金码头" : stars >= 6 ? "白银船坞" : "青铜海湾";
  const shownStars = Math.max(1, Math.min(5, stars || 1));
  return `${tier} ${"★".repeat(shownStars)}`;
}

function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function seeded(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}
