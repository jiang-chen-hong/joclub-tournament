
const STORAGE_KEY = "JO_CLUB_TD_PRO_V2";
const channel = ("BroadcastChannel" in window) ? new BroadcastChannel("jo_club_td_pro_v2") : null;

const defaultState = {
  eventName: "22,000 TURBO NIGHT",
  venueName: "揪友娛樂坊",
  startingStack: 500000,
  buyinAmount: 22000,
  entries: 0,
  remaining: 0,
  rebuyCount: 0,
  rebuyStackUnit: 1,
  running: false,
  levelIndex: 0,
  secondsLeft: 90 * 60,
  levels: [
    { name: "第一階段", smallBlind: "1K", bigBlind: "2K", ante: "", minutes: 90 },
    { name: "第二階段", smallBlind: "2K", bigBlind: "3K", ante: "", minutes: 90 }
  ],
  updatedAt: Date.now()
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(defaultState);
    const saved = JSON.parse(raw);
    return { ...structuredClone(defaultState), ...saved };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState(state) {
  state.updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (channel) channel.postMessage(state);
}

function subscribeState(callback) {
  window.addEventListener("storage", () => callback(loadState()));
  if (channel) channel.onmessage = (e) => callback(e.data);
}

function money(n) {
  return Number(n || 0).toLocaleString("en-US");
}

function blindText(level) {
  if (!level) return "FINAL";
  return `${level.smallBlind || "-"} / ${level.bigBlind || "-"}${level.ante ? " / Ante " + level.ante : ""}`;
}

function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec || 0));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return h > 0
    ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`
    : `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function averageStack(state) {
  const totalChips = (Number(state.entries || 0) + Number(state.rebuyCount || 0) * Number(state.rebuyStackUnit || 1)) * Number(state.startingStack || 0);
  const remaining = Number(state.remaining || 0);
  return remaining > 0 ? Math.round(totalChips / remaining) : 0;
}

function prizePool(state) {
  return Number(state.entries || 0) * Number(state.buyinAmount || 0) + Number(state.rebuyCount || 0) * Number(state.buyinAmount || 0) / 2;
}

function totalBuyGroups(state) {
  return Number(state.entries || 0) + Number(state.rebuyCount || 0) * 0.5;
}
