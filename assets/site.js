/* Site behaviour: mobile menu, hero city simulation, image lightbox. No dependencies. */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Hero: a synthetic city living through one day ----------
     A small activity-based model. Every dot is a synthetic resident with a daily
     plan (home, work or school, sometimes a market, home again). Trips start at
     planned times, a simple mode choice picks walk, bus, car/two-wheeler or metro,
     and people travel on the street grid or the metro line. One resident is
     highlighted and their day is written out beneath the canvas. */
  var canvas = document.getElementById("city");
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var logEl = document.getElementById("city-log");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var MIN_PER_FRAME = 0.3, START = 6 * 60 + 40, TOP = 30;
    var SPEED = { walk: 1.3, bus: 3.0, car: 3.8, metro: 8.5 };
    var MODE_NAME = { walk: "on foot", bus: "by bus", car: "by two-wheeler or car", metro: "by metro" };
    var W, H, dpr, cols, rows, nodes, adj, metroRow, stations, cbdCol, markets, schools, people, hero, t, running = false, visible = true, raf = 0, dayLog;

    function rnd(a, b) { return a + Math.random() * (b - a); }
    function gauss(m, sd) { var u = 1 - Math.random(), v = Math.random(); return m + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
    function id(c, r) { return r * cols + c; }
    function hhmm(m) { m = Math.round(m) % 1440; var h = Math.floor(m / 60), mm = m % 60; return (h < 10 ? "0" : "") + h + ":" + (mm < 10 ? "0" : "") + mm; }

    function buildCity() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(9, Math.round(W / 46));
      rows = Math.max(4, Math.round((H - TOP - 16) / 40));
      var sx = W / cols, sy = (H - TOP - 16) / rows;
      nodes = []; adj = [];
      for (var rr = 0; rr < rows; rr++) for (var c = 0; c < cols; c++) {
        nodes.push({ c: c, r: rr, x: (c + 0.5) * sx + rnd(-0.14, 0.14) * sx, y: TOP + (rr + 0.5) * sy + rnd(-0.12, 0.12) * sy });
        adj.push([]);
      }
      function link(a, b) { adj[a].push(b); adj[b].push(a); }
      for (rr = 0; rr < rows; rr++) for (c = 0; c < cols; c++) {
        if (c < cols - 1) link(id(c, rr), id(c + 1, rr));
        if (rr < rows - 1) link(id(c, rr), id(c, rr + 1));
        if (c < cols - 1 && rr < rows - 1 && Math.random() < 0.12) link(id(c, rr), id(c + 1, rr + 1));
      }
      metroRow = Math.floor(rows / 2);
      stations = [];
      for (c = 1; c < cols - 1; c += 3) stations.push(c);
      cbdCol = Math.round(cols * 0.62);
      markets = []; schools = [];
      var nm = Math.max(3, Math.round(cols / 3)), ns = Math.max(2, Math.round(cols / 5));
      while (markets.length < nm) markets.push(Math.floor(Math.random() * nodes.length));
      while (schools.length < ns) schools.push(Math.floor(Math.random() * nodes.length));
    }

    function bfs(a, b) {
      if (a === b) return [a];
      var prev = new Array(nodes.length).fill(-1), q = [a], seen = {}; seen[a] = 1;
      while (q.length) {
        var u = q.shift();
        for (var i = 0; i < adj[u].length; i++) {
          var v = adj[u][i];
          if (seen[v]) continue;
          seen[v] = 1; prev[v] = u;
          if (v === b) { var path = [b]; while (path[0] !== a) path.unshift(prev[path[0]]); return path; }
          q.push(v);
        }
      }
      return [a, b];
    }
    function nearestStation(n) {
      var best = stations[0];
      for (var i = 1; i < stations.length; i++) if (Math.abs(stations[i] - nodes[n].c) < Math.abs(best - nodes[n].c)) best = stations[i];
      return id(best, metroRow);
    }
    function dist(a, b) { return Math.abs(nodes[a].c - nodes[b].c) + Math.abs(nodes[a].r - nodes[b].r); }

    function planTrip(p, from, to) {
      var mode, legs = [];
      var os = nearestStation(from), ds = nearestStation(to);
      var acc = dist(from, os), egr = dist(ds, to), line = Math.abs(nodes[os].c - nodes[ds].c);
      var metroOK = acc <= 2 && egr <= 2 && line >= 5;
      var d = dist(from, to);
      if (p.forceMetro && metroOK) mode = "metro";
      else if (metroOK && Math.random() < 0.7) mode = "metro";
      else if (d <= 3) mode = Math.random() < 0.85 ? "walk" : "car";
      else mode = Math.random() < p.busPref ? "bus" : "car";
      function pts(path) { return path.map(function (n) { return nodes[n]; }); }
      if (mode === "metro") {
        legs.push({ pts: pts(bfs(from, os)), v: SPEED.walk, m: "walk" });
        var step = nodes[ds].c > nodes[os].c ? 1 : -1, row = [];
        for (var c = nodes[os].c; c !== nodes[ds].c + step; c += step) row.push(nodes[id(c, metroRow)]);
        legs.push({ pts: row, v: SPEED.metro, m: "metro" });
        legs.push({ pts: pts(bfs(ds, to)), v: SPEED.walk, m: "walk" });
      } else {
        legs.push({ pts: pts(bfs(from, to)), v: SPEED[mode], m: mode });
      }
      return { mode: mode, legs: legs.filter(function (l) { return l.pts.length > 1; }) };
    }

    function pickHome() {
      for (var k = 0; k < 20; k++) {
        var n = Math.floor(Math.random() * nodes.length);
        if (Math.abs(nodes[n].c - cbdCol) > 1 || Math.random() < 0.15) return n;
      }
      return 0;
    }
    function pickWork() {
      if (Math.random() < 0.65) {
        var c = clamp(Math.round(gauss(cbdCol, cols * 0.08)), 0, cols - 1), r = Math.floor(Math.random() * rows);
        return id(c, r);
      }
      return Math.floor(Math.random() * nodes.length);
    }
    function closest(list, n) {
      var best = list[0];
      for (var i = 1; i < list.length; i++) if (dist(list[i], n) + Math.random() * 2 < dist(best, n)) best = list[i];
      return best;
    }

    function makePlan(p) {
      var plan = [];
      if (p.kind === "worker") {
        var leave = clamp(gauss(8 * 60 + 5, 40), 6 * 60 + 45, 10 * 60 + 30);
        plan.push({ to: p.work, at: leave, label: "work" });
        var back = clamp(leave + gauss(9 * 60, 35), 16 * 60, 21 * 60);
        if (Math.random() < 0.3) { var mk = closest(markets, p.home); plan.push({ to: mk, at: back, label: "the market" }); back += rnd(25, 60); }
        plan.push({ to: p.home, at: back, label: "home" });
      } else if (p.kind === "student") {
        var s = clamp(gauss(7 * 60 + 15, 15), 6 * 60 + 45, 8 * 60);
        plan.push({ to: p.work, at: s, label: "school" });
        plan.push({ to: p.home, at: clamp(gauss(14 * 60, 50), 12 * 60 + 30, 16 * 60 + 30), label: "home" });
      } else if (Math.random() < 0.6) {
        var m = clamp(gauss(11 * 60, 80), 8 * 60 + 30, 17 * 60);
        plan.push({ to: closest(markets, p.home), at: m, label: "the market" });
        plan.push({ to: p.home, at: m + rnd(50, 120), label: "home" });
      }
      return plan;
    }

    function initPeople() {
      people = [];
      var n = clamp(Math.round(W * (H - TOP) / 950), 70, 380);
      for (var i = 0; i < n; i++) {
        var k = Math.random(), kind = k < 0.62 ? "worker" : k < 0.85 ? "student" : "home";
        var p = { kind: kind, home: pickHome(), ox: rnd(-9, 9), oy: rnd(-8, 8), busPref: rnd(0.35, 0.75) };
        p.work = kind === "student" ? closest(schools, p.home) : pickWork();
        p.plan = makePlan(p); p.at = p.home; p.trip = null; p.step = 0;
        people.push(p);
      }
      // the highlighted resident: lives near a western metro station, works in the CBD
      var homeC = stations[0], workC = stations.reduce(function (b, s) { return Math.abs(s - cbdCol) < Math.abs(b - cbdCol) ? s : b; }, stations[0]);
      if (workC - homeC < 5) workC = stations[stations.length - 1];
      hero = { kind: "worker", hero: true, forceMetro: true, busPref: 0.9, ox: 0, oy: 0,
               home: id(homeC, clamp(metroRow + 1, 0, rows - 1)), work: id(workC, clamp(metroRow - 1, 0, rows - 1)) };
      var leave = 7 * 60 + 45, back = 18 * 60 + 10;
      var mk = markets.reduce(function (b, m) { return dist(m, hero.home) < dist(b, hero.home) && m !== hero.home ? m : b; }, markets[0]);
      hero.plan = [{ to: hero.work, at: leave, label: "work" }, { to: mk, at: back, label: "the market" }, { to: hero.home, at: back + 35, label: "home" }];
      hero.at = hero.home; hero.trip = null; hero.step = 0;
      people.push(hero);
      dayLog = [];
      writeLog();
    }

    function place(p) { return p.at === null ? null : { x: nodes[p.at].x + p.ox, y: nodes[p.at].y + p.oy }; }
    function labelOf(p, n) { return n === p.home ? "home" : n === p.work ? (p.kind === "student" ? "school" : "work") : "the market"; }

    function writeLog() {
      if (!logEl) return;
      if (!dayLog.length) { logEl.textContent = "At home, " + hhmm(t) + "."; return; }
      logEl.textContent = dayLog.map(function (e) {
        return e.dep + " " + e.from + " to " + e.to + " " + MODE_NAME[e.mode] + (e.arr ? ", arrived " + e.arr : ", on the way") + ".";
      }).join(" ");
    }

    function stepSim() {
      t += MIN_PER_FRAME;
      if (t >= 24 * 60) { t = START; initPeople(); return; }
      for (var i = 0; i < people.length; i++) {
        var p = people[i];
        if (!p.trip) {
          var nx = p.plan[p.step];
          if (nx && t >= nx.at && (p.readyAt === undefined || t >= p.readyAt)) {
            var tr = planTrip(p, p.at, nx.to);
            tr.leg = 0; tr.seg = 0; tr.pos = { x: nodes[p.at].x, y: nodes[p.at].y };
            if (!tr.legs.length) { p.at = nx.to; p.step++; continue; }
            p.trip = tr; p.from = p.at; p.at = null;
            if (p.hero) { dayLog.push({ dep: hhmm(t), from: labelOf(p, p.from), to: nx.label, mode: tr.mode }); writeLog(); }
          }
          continue;
        }
        var trp = p.trip, leg = trp.legs[trp.leg], move = leg.v;
        while (move > 0 && leg) {
          var target = leg.pts[trp.seg + 1];
          if (!target) { trp.leg++; trp.seg = 0; leg = trp.legs[trp.leg]; continue; }
          var dx = target.x - trp.pos.x, dy = target.y - trp.pos.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d <= move) { trp.pos = { x: target.x, y: target.y }; move -= d; trp.seg++; }
          else { trp.pos = { x: trp.pos.x + dx / d * move, y: trp.pos.y + dy / d * move }; move = 0; }
        }
        trp.mode_now = leg ? leg.m : null;
        if (!leg) {
          p.at = p.plan[p.step].to; p.trip = null; p.step++; p.readyAt = t + 15;
          if (p.hero) { dayLog[dayLog.length - 1].arr = hhmm(t); writeLog(); }
        }
      }
      if (hero && !hero.trip && !dayLog.length && Math.round(t) % 10 === 0) writeLog();
    }

    function daylight() { return clamp(Math.sin((t - 6 * 60) / (13 * 60) * Math.PI), 0, 1); }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var dl = daylight();
      // city blocks: brighter in the central business district
      var sx = W / cols, sy = (H - TOP - 16) / rows;
      for (var r = 0; r < rows - 1; r++) for (var c = 0; c < cols - 1; c++) {
        var a0 = nodes[id(c, r)], a1 = nodes[id(c + 1, r + 1)];
        var cbd = Math.max(0, 1 - Math.abs(c + 0.5 - cbdCol) / (cols * 0.12));
        ctx.fillStyle = "rgba(185,200,217," + (0.035 + 0.07 * cbd) + ")";
        ctx.fillRect(a0.x + 5, a0.y + 5, Math.max(0, a1.x - a0.x - 10), Math.max(0, a1.y - a0.y - 10));
      }
      ctx.font = "500 12px 'Barlow Semi Condensed', Arial, sans-serif";
      ctx.fillStyle = "rgba(143,163,184,.9)"; ctx.textAlign = "center";
      ctx.fillText("City centre", nodes[id(cbdCol, rows - 1)].x, Math.min(H - 2, nodes[id(cbdCol, rows - 1)].y + 22));
      ctx.textAlign = "left";
      // streets
      ctx.strokeStyle = "rgba(185,200,217," + (0.09 + 0.07 * dl) + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i < nodes.length; i++) for (var j = 0; j < adj[i].length; j++) {
        var k = adj[i][j]; if (k < i) continue;
        ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[k].x, nodes[k].y);
      }
      ctx.stroke();
      // metro line and stations
      ctx.strokeStyle = "rgba(111,168,220,.75)"; ctx.lineWidth = 3;
      ctx.beginPath();
      for (c = stations[0]; c <= stations[stations.length - 1]; c++) { var n = nodes[id(c, metroRow)]; c === stations[0] ? ctx.moveTo(n.x, n.y) : ctx.lineTo(n.x, n.y); }
      ctx.stroke();
      ctx.fillStyle = "#0E2A47"; ctx.strokeStyle = "rgba(210,228,245,.95)"; ctx.lineWidth = 1.5;
      stations.forEach(function (s) { var n = nodes[id(s, metroRow)]; ctx.beginPath(); ctx.arc(n.x, n.y, 3.6, 0, 7); ctx.fill(); ctx.stroke(); });
      // highlighted resident's anchors
      ctx.strokeStyle = "rgba(242,169,0,.8)"; ctx.lineWidth = 1.5;
      [hero.home, hero.work].forEach(function (n) { ctx.beginPath(); ctx.arc(nodes[n].x, nodes[n].y, 8, 0, 7); ctx.stroke(); });
      ctx.font = "600 11px 'Barlow Semi Condensed', Arial, sans-serif"; ctx.fillStyle = "rgba(242,169,0,.95)";
      ctx.fillText("Home", nodes[hero.home].x + 11, nodes[hero.home].y + 4);
      ctx.fillText("Work", nodes[hero.work].x + 11, nodes[hero.work].y + 4);
      // residents
      for (i = 0; i < people.length; i++) {
        var p = people[i]; if (p.hero) continue;
        if (p.trip) {
          var m = p.trip.mode_now;
          ctx.fillStyle = m === "metro" ? "#8EC3F2" : "rgba(236,242,248,.92)";
          ctx.beginPath(); ctx.arc(p.trip.pos.x, p.trip.pos.y, m === "walk" ? 1.6 : 2.2, 0, 7); ctx.fill();
        } else {
          var q = place(p);
          ctx.fillStyle = "rgba(185,200,217,.62)";
          ctx.fillRect(q.x - 1.2, q.y - 1.2, 2.4, 2.4);
        }
      }
      var hp = hero.trip ? hero.trip.pos : place(hero);
      ctx.fillStyle = "#F2A900"; ctx.beginPath(); ctx.arc(hp.x, hp.y, 4, 0, 7); ctx.fill();
      // clock
      ctx.font = "600 17px 'Barlow Semi Condensed', Arial, sans-serif";
      var label = hhmm(t), wid = ctx.measureText(label).width;
      var pad = Math.max(18, (W - 1140) / 2 + Math.min(40, Math.max(17.6, W * 0.04)));
      ctx.fillStyle = "rgba(232,238,245,.95)"; ctx.fillText(label, pad, 20);
      ctx.font = "500 13px 'Barlow Semi Condensed', Arial, sans-serif"; ctx.fillStyle = "rgba(143,163,184,.95)";
      ctx.fillText("simulated day, " + people.length + " residents", pad + wid + 10, 20);
    }

    function loop() { stepSim(); draw(); raf = requestAnimationFrame(loop); }
    function start() { if (!running && !reduce && visible && !document.hidden) { running = true; raf = requestAnimationFrame(loop); } }
    function stop() { running = false; cancelAnimationFrame(raf); }
    function init() {
      buildCity(); t = START; initPeople();
      if (reduce) { while (t < 8 * 60 + 20) stepSim(); }
      draw();
    }

    init(); start();
    var rt, lastW = W;
    window.addEventListener("resize", function () {
      clearTimeout(rt);
      rt = setTimeout(function () { if (Math.abs(canvas.getBoundingClientRect().width - lastW) < 2) return; lastW = canvas.getBoundingClientRect().width; stop(); init(); start(); }, 200);
    });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
    }
  }

  /* ---------- Lightbox (news + gallery) ---------- */
  var box = document.querySelector("dialog.lightbox");
  if (box && typeof box.showModal === "function") {
    var bImg = box.querySelector("img"), bCap = box.querySelector("p");
    document.querySelectorAll("[data-full]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        bImg.src = btn.getAttribute("data-full");
        bImg.alt = img ? img.alt : "";
        bCap.textContent = btn.getAttribute("data-caption") || (img ? img.alt : "");
        box.showModal();
      });
    });
    box.querySelector(".close").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
  }
})();
