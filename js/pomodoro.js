/* =============================================================================
   pomodoro.js — Minuteur Pomodoro (S4, Lot 4). 25 min travail / 5 min pause
   courte / 15 min pause longue (tous les 4 cycles), anneau de progression SVG,
   bip de fin (WebAudio) et compteur de pomodoros du jour (localStorage
   `syntaxe-pomodoro`). 100 % file://. Page : pages/pomodoro.html.
   ============================================================================= */
(function () {
  "use strict";

  var DUR = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
  var LABEL = { work: "Travail", short: "Pause courte", long: "Pause longue" };
  var KEY = "syntaxe-pomodoro";
  var RADIUS = 116;
  var CIRC = 2 * Math.PI * RADIUS;

  var modesEl = document.getElementById("pomo-modes");
  var timeEl = document.getElementById("pomo-time");
  var ringFill = document.getElementById("pomo-ring-fill");
  var startBtn = document.getElementById("pomo-start");
  var skipBtn = document.getElementById("pomo-skip");
  var resetBtn = document.getElementById("pomo-reset");
  var countEl = document.getElementById("pomo-count");
  if (!timeEl || !ringFill || !startBtn) return;

  var mode = "work";
  var remaining = DUR.work;
  var running = false;
  var timer = null;
  var cycles = 0;

  function ymd() {
    var d = new Date(),
      m = d.getMonth() + 1,
      j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" + m : m) + "-" + (j < 10 ? "0" + j : j);
  }
  function todayCount() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
      return a[ymd()] || 0;
    } catch (e) {
      return 0;
    }
  }
  function addPomodoro() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
      a[ymd()] = (a[ymd()] || 0) + 1;
      localStorage.setItem(KEY, JSON.stringify(a));
    } catch (e) {}
  }

  function fmt(s) {
    var m = Math.floor(s / 60),
      ss = s % 60;
    return (m < 10 ? "0" + m : m) + ":" + (ss < 10 ? "0" + ss : ss);
  }
  function beep() {
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      var ctx = new Ctx();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 660;
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
  }

  function paint() {
    timeEl.textContent = fmt(remaining);
    var frac = remaining / DUR[mode];
    ringFill.style.strokeDasharray = CIRC;
    ringFill.style.strokeDashoffset = CIRC * (1 - frac);
    ringFill.setAttribute("data-mode", mode);
    document.title = (running ? fmt(remaining) + " · " : "") + LABEL[mode] + " — Pomodoro";
    countEl.textContent =
      "Pomodoros aujourd'hui : " + todayCount() + " · cycle en cours : " + (cycles % 4 || (cycles ? 4 : 0));
  }

  function stop() {
    running = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    startBtn.textContent = remaining < DUR[mode] ? "Reprendre" : "Démarrer";
  }
  function setMode(m, autostart) {
    mode = m;
    remaining = DUR[m];
    stop();
    startBtn.textContent = "Démarrer";
    var btns = modesEl.querySelectorAll(".pomo-mode");
    for (var i = 0; i < btns.length; i++) {
      var sel = btns[i].getAttribute("data-mode") === m;
      btns[i].classList.toggle("is-active", sel);
      btns[i].setAttribute("aria-selected", sel ? "true" : "false");
    }
    paint();
    if (autostart) start();
  }

  function complete() {
    stop();
    beep();
    if (mode === "work") {
      cycles++;
      addPomodoro();
      setMode(cycles % 4 === 0 ? "long" : "short", false);
    } else {
      setMode("work", false);
    }
    paint();
  }

  function tick() {
    remaining--;
    if (remaining <= 0) {
      remaining = 0;
      paint();
      complete();
      return;
    }
    paint();
  }
  function start() {
    if (running) return;
    if (remaining <= 0) remaining = DUR[mode];
    running = true;
    startBtn.textContent = "Pause";
    timer = window.setInterval(tick, 1000);
    paint();
  }

  startBtn.addEventListener("click", function () {
    if (running) stop();
    else start();
  });
  skipBtn.addEventListener("click", function () {
    if (mode === "work") {
      setMode(cycles % 4 === 3 ? "long" : "short", false);
    } else {
      setMode("work", false);
    }
  });
  resetBtn.addEventListener("click", function () {
    setMode(mode, false);
  });
  modesEl.addEventListener("click", function (e) {
    var b = e.target && e.target.closest ? e.target.closest("[data-mode]") : null;
    if (b) setMode(b.getAttribute("data-mode"), false);
  });

  setMode("work", false);
})();
