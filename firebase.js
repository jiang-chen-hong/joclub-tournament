const firebaseConfig = {
  apiKey: "AIzaSyC155z9wsFbpn3EzLBO-PrdULEA7xMNkR4",
  authDomain: "jo-club-td.firebaseapp.com",
  databaseURL: "https://jo-club-td-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jo-club-td",
  storageBucket: "jo-club-td.firebasestorage.app",
  messagingSenderId: "82744057017",
  appId: "1:82744057017:web:b0bbae521641ba5e790f68",
  measurementId: "G-GV7EX20XN6"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const stateRef = db.ref("tournament/state");
const defaultState = {
  eventName: "22,000 TURBO NIGHT", venueName: "揪友娛樂坊", startingStack: 500000,
  buyinAmount: 22000, rebuyPrice: 11000, entries: 0, remaining: 0, rebuyCount: 0,
  running: false, levelIndex: 0, secondsLeft: 5400,
  levels: [
    { name: "第一階段", smallBlind: "1K", bigBlind: "2K", ante: "", minutes: 90 },
    { name: "第二階段", smallBlind: "2K", bigBlind: "3K", ante: "", minutes: 90 }
  ]
};
function money(n){ return Number(n || 0).toLocaleString("en-US"); }
function blindText(l){ return l ? `${l.smallBlind||"-"} / ${l.bigBlind||"-"}${l.ante ? " / Ante " + l.ante : ""}` : "FINAL"; }
function formatTime(sec){ sec=Math.max(0,Math.floor(sec||0)); const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60; return h>0 ? `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}` : `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`; }
function averageStack(s){ const total=(Number(s.entries||0)+Number(s.rebuyCount||0))*Number(s.startingStack||0); return Number(s.remaining||0)>0 ? Math.round(total/Number(s.remaining)) : 0; }
function prizePool(s){ return Number(s.entries||0)*Number(s.buyinAmount||0)+Number(s.rebuyCount||0)*Number(s.rebuyPrice||0); }
function buyGroups(s){ return (Number(s.entries||0)+(Number(s.rebuyCount||0)*Number(s.rebuyPrice||0)/Math.max(1,Number(s.buyinAmount||1)))).toFixed(1).replace(".0",""); }
async function ensureState(){ const snap=await stateRef.get(); if(!snap.exists()) await stateRef.set(defaultState); }
function listenState(cb){ stateRef.on("value", snap=> cb({...defaultState,...(snap.val()||{})})); }
function updateState(patch){ return stateRef.update(patch); }
function setState(next){ return stateRef.set(next); }
