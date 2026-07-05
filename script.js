/**
 * DefNotGames — script.js
 * Six hand-rolled browser games + site UI.
 * High scores persist in localStorage. No dependencies.
 */

'use strict';

/* ═══════════════════ Helpers & storage ═══════════════════ */

const $ = (s, r = document) => r.querySelector(s);

const store = {
  key: 'dng-best-v1',
  all() {
    try { return JSON.parse(localStorage.getItem(this.key)) || {}; }
    catch { return {}; }
  },
  get(id) { return this.all()[id]; },
  set(id, v) {
    const a = this.all();
    a[id] = v;
    localStorage.setItem(this.key, JSON.stringify(a));
  },
};

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ═══════════════════ Game registry ═══════════════════ */

const GAMES = [
  {
    id: 'snake', name: 'Snake', tag: 'arcade', emoji: '🐍',
    desc: 'The timeless classic. Eat, grow, and try not to bite yourself.',
    grad: 'linear-gradient(135deg, #065f46, #34d399)',
    controls: 'Arrow keys / WASD to steer · swipe on mobile',
    unit: 'pts', better: 'high', factory: (s, a) => snakeGame(s, a),
  },
  {
    id: '2048', name: '2048', tag: 'puzzle', emoji: '🔢',
    desc: 'Slide tiles, merge numbers, chase the mythical 2048 tile.',
    grad: 'linear-gradient(135deg, #92400e, #fbbf24)',
    controls: 'Arrow keys to slide · swipe on mobile',
    unit: 'pts', better: 'high', factory: (s, a) => game2048(s, a),
  },
  {
    id: 'breakout', name: 'Breakout', tag: 'arcade', emoji: '🧱',
    desc: 'Smash every brick. Three balls, rising speed, no mercy.',
    grad: 'linear-gradient(135deg, #9f1239, #fb7185)',
    controls: 'Move mouse / drag to steer · click or Space to launch',
    unit: 'pts', better: 'high', factory: (s, a) => breakoutGame(s, a),
  },
  {
    id: 'flappy', name: 'Flappy Byte', tag: 'arcade', emoji: '🐤',
    desc: 'One button. Infinite pipes. How far can you flap?',
    grad: 'linear-gradient(135deg, #0e7490, #67e8f9)',
    controls: 'Click, tap or Space to flap',
    unit: 'pipes', better: 'high', factory: (s, a) => flappyGame(s, a),
  },
  {
    id: 'memory', name: 'Memory Match', tag: 'puzzle', emoji: '🧠',
    desc: 'Flip the cards, find the pairs, train that beautiful brain.',
    grad: 'linear-gradient(135deg, #5b21b6, #c4b5fd)',
    controls: 'Click or tap cards to flip them',
    unit: 'moves', better: 'low', factory: (s, a) => memoryGame(s, a),
  },
  {
    id: 'ttt', name: 'Tic-Tac-Toe', tag: 'classic', emoji: '⭕',
    desc: 'You vs. a ruthless little AI. Good luck — you\'ll need it.',
    grad: 'linear-gradient(135deg, #1e3a8a, #93c5fd)',
    controls: 'Click or tap a square · you are X',
    unit: 'wins', better: 'high', factory: (s, a) => tttGame(s, a),
  },
];

/* ═══════════════════ Card grid ═══════════════════ */

function bestLabel(g) {
  const b = store.get(g.id);
  return b === undefined
    ? `Best <strong>—</strong>`
    : `Best <strong>${b}</strong> ${g.unit}`;
}

function renderGrid(filter = 'all') {
  const grid = $('#gamesGrid');
  grid.innerHTML = GAMES
    .filter(g => filter === 'all' || g.tag === filter)
    .map(g => `
      <button class="game-card" data-game="${g.id}" aria-label="Play ${g.name}">
        <div class="gc-thumb" style="background:${g.grad}">
          <span class="gc-emoji">${g.emoji}</span>
          <span class="gc-tag">${g.tag}</span>
        </div>
        <div class="gc-body">
          <div class="gc-name">${g.name}</div>
          <p class="gc-desc">${g.desc}</p>
          <div class="gc-foot">
            <span class="gc-best">${bestLabel(g)}</span>
            <span class="gc-play">Play →</span>
          </div>
        </div>
      </button>`)
    .join('');
}

$('#gamesGrid').addEventListener('click', e => {
  const card = e.target.closest('.game-card');
  if (card) openGame(card.dataset.game);
});

$('#filterChips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  $('#filterChips .active')?.classList.remove('active');
  chip.classList.add('active');
  renderGrid(chip.dataset.filter);
});

$('#luckyBtn').addEventListener('click', () => {
  openGame(GAMES[Math.floor(Math.random() * GAMES.length)].id);
});

$('#year').textContent = new Date().getFullYear();

/* ═══════════════════ Game modal ═══════════════════ */

const modal = $('#gameModal');
const stage = $('#gmStage');
let current = null;   // { game, instance }

function updateBestChip(g) {
  const b = store.get(g.id);
  const chip = $('#gmBest');
  chip.textContent = b === undefined ? 'Best —' : `Best ${b}`;
  chip.classList.remove('hidden');
}

function makeApi(g) {
  return {
    setScore(v) { $('#gmScore').textContent = typeof v === 'number' ? `Score ${v}` : v; },
    gameOver(finalScore, opts = {}) {
      const prev = store.get(g.id);
      const isRecord = finalScore !== null && (
        prev === undefined ||
        (g.better === 'high' ? finalScore > prev : finalScore < prev)
      );
      if (isRecord && finalScore !== null) {
        store.set(g.id, finalScore);
        updateBestChip(g);
      }
      const over = document.createElement('div');
      over.className = 'gm-over';
      over.innerHTML = `
        <h4>${opts.title || 'Game over'}</h4>
        ${finalScore !== null ? `<p class="go-score">${opts.scoreText || `Score: ${finalScore} ${g.unit}`}</p>` : ''}
        ${isRecord ? '<span class="go-record">★ New best!</span>' : ''}
        <button class="btn btn-primary">Play again</button>`;
      over.querySelector('button').addEventListener('click', () => restartGame());
      stage.appendChild(over);
      if (isRecord) toast(`🏆 New ${g.name} record: ${finalScore} ${g.unit}`);
    },
  };
}

function mount(g) {
  stage.innerHTML = '';
  $('#gmScore').textContent = 'Score 0';
  current = { game: g, instance: g.factory(stage, makeApi(g)) };
}

function openGame(id) {
  const g = GAMES.find(x => x.id === id);
  if (!g) return;
  $('#gmTitle').textContent = `${g.emoji} ${g.name}`;
  $('#gmControls').textContent = g.controls;
  updateBestChip(g);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  mount(g);
}

function restartGame() {
  if (current) mount(current.game);
}

function closeGame() {
  current?.instance?.destroy?.();
  current = null;
  stage.innerHTML = '';
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  renderGrid($('#filterChips .active')?.dataset.filter || 'all');
}

$('#gmBack').addEventListener('click', closeGame);
$('#gmRestart').addEventListener('click', restartGame);
modal.addEventListener('click', e => { if (e.target === modal) closeGame(); });
window.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeGame();
});

/* Shared: swipe detection */
function onSwipe(el, cb) {
  let sx = 0, sy = 0;
  const start = e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; };
  const end = e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    cb(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  };
  el.addEventListener('touchstart', start, { passive: true });
  el.addEventListener('touchend', end, { passive: true });
  return () => { el.removeEventListener('touchstart', start); el.removeEventListener('touchend', end); };
}

/* ═══════════════════ SNAKE ═══════════════════ */

function snakeGame(stage, api) {
  const N = 20, CELL = 20;
  const cv = document.createElement('canvas');
  cv.width = cv.height = N * CELL;
  cv.style.maxWidth = '420px';
  cv.style.width = '100%';
  stage.appendChild(cv);
  const ctx = cv.getContext('2d');

  let snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
  let dir = { x: 1, y: 0 }, pending = dir;
  let food = spawnFood();
  let score = 0, dead = false, delay = 130, timer = null;

  function spawnFood() {
    let f;
    do { f = { x: (Math.random() * N) | 0, y: (Math.random() * N) | 0 }; }
    while (snake.some(s => s.x === f.x && s.y === f.y));
    return f;
  }

  function tick() {
    if (!(pending.x === -dir.x && pending.y === -dir.y)) dir = pending;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
      dead = true;
      clearInterval(timer);
      api.gameOver(score);
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      api.setScore(score);
      food = spawnFood();
      if (delay > 70) { delay -= 2; clearInterval(timer); timer = setInterval(tick, delay); }
    } else {
      snake.pop();
    }
    draw();
  }

  function draw() {
    ctx.fillStyle = '#090b16';
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    for (let i = 1; i < N; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, cv.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(cv.width, i * CELL); ctx.stroke();
    }
    // food
    ctx.shadowColor = '#f472b6'; ctx.shadowBlur = 14;
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // snake
    snake.forEach((s, i) => {
      const t = i / snake.length;
      ctx.fillStyle = i === 0 ? '#a7f3d0' : `rgb(${52 - 20 * t | 0}, ${211 - 90 * t | 0}, ${153 - 60 * t | 0})`;
      const pad = i === 0 ? 1 : 2;
      roundRect(ctx, s.x * CELL + pad, s.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, 5);
    });
  }

  function keys(e) {
    const map = {
      ArrowUp: [0, -1], KeyW: [0, -1],
      ArrowDown: [0, 1], KeyS: [0, 1],
      ArrowLeft: [-1, 0], KeyA: [-1, 0],
      ArrowRight: [1, 0], KeyD: [1, 0],
    };
    const m = map[e.code];
    if (m) { e.preventDefault(); pending = { x: m[0], y: m[1] }; }
  }
  window.addEventListener('keydown', keys);
  const offSwipe = onSwipe(cv, d => {
    pending = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[d];
  });

  draw();
  timer = setInterval(tick, delay);

  return {
    destroy() {
      clearInterval(timer);
      window.removeEventListener('keydown', keys);
      offSwipe();
    },
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
  ctx.fill();
}

/* ═══════════════════ 2048 ═══════════════════ */

function game2048(stage, api) {
  const board = document.createElement('div');
  board.className = 'board-2048';
  stage.appendChild(board);

  let grid = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  let score = 0, over = false, won = false;

  addTile(); addTile(); render();

  function addTile() {
    const empty = [];
    grid.forEach((row, r) => row.forEach((v, c) => { if (!v) empty.push([r, c]); }));
    if (!empty.length) return;
    const [r, c] = empty[(Math.random() * empty.length) | 0];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function render() {
    board.innerHTML = grid.flat()
      .map(v => `<div class="t2048" ${v ? `data-v="${v}"` : ''}>${v || ''}</div>`)
      .join('');
  }

  function slideRow(row) {
    const vals = row.filter(v => v);
    for (let i = 0; i < vals.length - 1; i++) {
      if (vals[i] === vals[i + 1]) {
        vals[i] *= 2;
        score += vals[i];
        if (vals[i] === 2048 && !won) { won = true; toast('🎉 You made 2048! Keep going…'); }
        vals.splice(i + 1, 1);
      }
    }
    while (vals.length < 4) vals.push(0);
    return vals;
  }

  function move(dirKey) {
    if (over) return;
    const before = JSON.stringify(grid);
    const rotate = g => g[0].map((_, c) => g.map(row => row[c]).reverse()); // CW
    let g = grid.map(r => [...r]);
    const rot = { left: 0, up: 3, right: 2, down: 1 }[dirKey];
    for (let i = 0; i < rot; i++) g = rotate(g);
    g = g.map(slideRow);
    for (let i = 0; i < (4 - rot) % 4; i++) g = rotate(g);
    if (JSON.stringify(g) === before) return;
    grid = g;
    addTile();
    api.setScore(score);
    render();
    if (!hasMoves()) { over = true; api.gameOver(score); }
  }

  function hasMoves() {
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) {
        if (!grid[r][c]) return true;
        if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
        if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
      }
    return false;
  }

  function keys(e) {
    const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
  }
  window.addEventListener('keydown', keys);
  const offSwipe = onSwipe(board, move);

  return {
    destroy() {
      window.removeEventListener('keydown', keys);
      offSwipe();
    },
  };
}

/* ═══════════════════ BREAKOUT ═══════════════════ */

function breakoutGame(stage, api) {
  const W = 480, H = 400;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  cv.style.maxWidth = '480px';
  cv.style.width = '100%';
  stage.appendChild(cv);
  const ctx = cv.getContext('2d');

  const COLS = 8, ROWS = 5, BW = 47, BH = 16, GAP = 8, TOP = 46, SIDE = 24;
  const COLORS = ['#f472b6', '#fb7185', '#fbbf24', '#34d399', '#22d3ee'];

  let paddle = { w: 84, h: 12, x: W / 2 - 42 };
  let ball, bricks, score = 0, lives = 3, level = 1, speed = 4;
  let launched = false, raf = null, dead = false;

  function resetBall() {
    ball = { x: W / 2, y: H - 60, r: 7, dx: 0, dy: 0 };
    launched = false;
  }
  function buildBricks() {
    bricks = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        bricks.push({ x: SIDE + c * (BW + GAP), y: TOP + r * (BH + GAP), alive: true, color: COLORS[r] });
  }

  function launch() {
    if (launched || dead) return;
    launched = true;
    const angle = -Math.PI / 4 - Math.random() * Math.PI / 2;
    ball.dx = Math.cos(angle) * speed;
    ball.dy = Math.sin(angle) * speed;
  }

  function step() {
    if (launched) {
      ball.x += ball.dx; ball.y += ball.dy;
      if (ball.x - ball.r < 0) { ball.x = ball.r; ball.dx *= -1; }
      if (ball.x + ball.r > W) { ball.x = W - ball.r; ball.dx *= -1; }
      if (ball.y - ball.r < 0) { ball.y = ball.r; ball.dy *= -1; }
      // paddle
      const py = H - 26;
      if (ball.dy > 0 && ball.y + ball.r >= py && ball.y + ball.r <= py + paddle.h + 6 &&
          ball.x >= paddle.x - ball.r && ball.x <= paddle.x + paddle.w + ball.r) {
        const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
        const ang = hit * (Math.PI / 3);
        const sp = Math.hypot(ball.dx, ball.dy);
        ball.dx = Math.sin(ang) * sp;
        ball.dy = -Math.abs(Math.cos(ang) * sp);
        ball.y = py - ball.r;
      }
      // bricks
      for (const b of bricks) {
        if (!b.alive) continue;
        if (ball.x + ball.r > b.x && ball.x - ball.r < b.x + BW &&
            ball.y + ball.r > b.y && ball.y - ball.r < b.y + BH) {
          b.alive = false;
          score += 10;
          api.setScore(score);
          const overlapX = Math.min(ball.x + ball.r - b.x, b.x + BW - (ball.x - ball.r));
          const overlapY = Math.min(ball.y + ball.r - b.y, b.y + BH - (ball.y - ball.r));
          if (overlapX < overlapY) ball.dx *= -1; else ball.dy *= -1;
          break;
        }
      }
      if (bricks.every(b => !b.alive)) {
        level++;
        speed += 0.6;
        buildBricks();
        resetBall();
        toast(`🧱 Level ${level}! Speed up.`);
      }
      if (ball.y - ball.r > H) {
        lives--;
        if (lives <= 0) {
          dead = true;
          api.gameOver(score);
          return;
        }
        resetBall();
      }
    } else if (!dead) {
      ball.x = paddle.x + paddle.w / 2;
      ball.y = H - 40;
    }
    draw();
    raf = requestAnimationFrame(step);
  }

  function draw() {
    ctx.fillStyle = '#090b16';
    ctx.fillRect(0, 0, W, H);
    for (const b of bricks) {
      if (!b.alive) continue;
      ctx.fillStyle = b.color;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(b.x, b.y, BW, BH, 4) : ctx.rect(b.x, b.y, BW, BH);
      ctx.fill();
    }
    // paddle
    const g = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.w, 0);
    g.addColorStop(0, '#8b5cf6'); g.addColorStop(1, '#22d3ee');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(paddle.x, H - 26, paddle.w, paddle.h, 6) : ctx.rect(paddle.x, H - 26, paddle.w, paddle.h);
    ctx.fill();
    // ball
    ctx.shadowColor = '#eef0ff'; ctx.shadowBlur = 12;
    ctx.fillStyle = '#eef0ff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // lives + level
    ctx.font = '14px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#9aa1c0';
    ctx.textAlign = 'left';
    ctx.fillText('♥'.repeat(lives), 12, 24);
    ctx.textAlign = 'right';
    ctx.fillText(`LVL ${level}`, W - 12, 24);
    if (!launched && !dead) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#eef0ff';
      ctx.font = '16px "Space Grotesk", sans-serif';
      ctx.fillText('Click or press Space to launch', W / 2, H / 2 + 40);
    }
  }

  function setPaddle(clientX) {
    const rect = cv.getBoundingClientRect();
    const x = (clientX - rect.left) * (W / rect.width);
    paddle.x = Math.max(0, Math.min(W - paddle.w, x - paddle.w / 2));
  }
  const onMove = e => setPaddle(e.clientX);
  const onTouch = e => { setPaddle(e.touches[0].clientX); e.preventDefault(); };
  const onKey = e => { if (e.code === 'Space') { e.preventDefault(); launch(); } };
  cv.addEventListener('mousemove', onMove);
  cv.addEventListener('touchmove', onTouch, { passive: false });
  cv.addEventListener('touchstart', e => { onTouch(e); launch(); }, { passive: false });
  cv.addEventListener('click', launch);
  window.addEventListener('keydown', onKey);

  buildBricks();
  resetBall();
  raf = requestAnimationFrame(step);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    },
  };
}

/* ═══════════════════ FLAPPY ═══════════════════ */

function flappyGame(stage, api) {
  const W = 360, H = 500;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  cv.style.maxWidth = '360px';
  cv.style.width = '100%';
  stage.appendChild(cv);
  const ctx = cv.getContext('2d');

  const GRAV = 0.45, FLAP = -7.6, GAP = 150, PW = 58, SPEED = 2.6;
  let bird, pipes, score, started, dead, raf = null, wobble = 0;

  function reset() {
    bird = { x: 90, y: H / 2, vy: 0, r: 14 };
    pipes = [];
    score = 0; started = false; dead = false;
    api.setScore(0);
  }

  function flap() {
    if (dead) return;
    if (!started) started = true;
    bird.vy = FLAP;
  }

  function step() {
    wobble += 0.08;
    if (started && !dead) {
      bird.vy += GRAV;
      bird.y += bird.vy;
      if (!pipes.length || pipes[pipes.length - 1].x < W - 210) {
        const top = 60 + Math.random() * (H - GAP - 180);
        pipes.push({ x: W + 20, top, passed: false });
      }
      for (const p of pipes) {
        p.x -= SPEED + Math.min(1.4, score * 0.03);
        if (!p.passed && p.x + PW < bird.x - bird.r) {
          p.passed = true;
          score++;
          api.setScore(score);
        }
      }
      pipes = pipes.filter(p => p.x > -PW - 10);
      // collisions
      const hitPipe = pipes.some(p =>
        bird.x + bird.r > p.x && bird.x - bird.r < p.x + PW &&
        (bird.y - bird.r < p.top || bird.y + bird.r > p.top + GAP));
      if (hitPipe || bird.y + bird.r > H - 24 || bird.y - bird.r < 0) {
        dead = true;
        api.gameOver(score, { scoreText: `You cleared ${score} pipe${score === 1 ? '' : 's'}` });
        return;
      }
    }
    draw();
    raf = requestAnimationFrame(step);
  }

  function draw() {
    // sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0b1026'); sky.addColorStop(1, '#122447');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    // stars
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 24; i++) {
      const sx = (i * 97 + 31) % W, sy = (i * 53 + 17) % (H - 100);
      ctx.fillRect(sx, sy, 2, 2);
    }
    // pipes
    for (const p of pipes) {
      const pg = ctx.createLinearGradient(p.x, 0, p.x + PW, 0);
      pg.addColorStop(0, '#0e7490'); pg.addColorStop(0.5, '#22d3ee'); pg.addColorStop(1, '#0e7490');
      ctx.fillStyle = pg;
      ctx.fillRect(p.x, 0, PW, p.top);
      ctx.fillRect(p.x, p.top + GAP, PW, H - p.top - GAP - 24);
      ctx.fillStyle = '#67e8f9';
      ctx.fillRect(p.x - 3, p.top - 10, PW + 6, 10);
      ctx.fillRect(p.x - 3, p.top + GAP, PW + 6, 10);
    }
    // ground
    ctx.fillStyle = '#1a1e3e';
    ctx.fillRect(0, H - 24, W, 24);
    // bird
    const by = started ? bird.y : bird.y + Math.sin(wobble) * 6;
    ctx.save();
    ctx.translate(bird.x, by);
    ctx.rotate(Math.max(-0.5, Math.min(0.9, bird.vy * 0.06)));
    ctx.font = '26px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐤', 0, 0);
    ctx.restore();
    // hint
    if (!started) {
      ctx.fillStyle = '#eef0ff';
      ctx.font = '17px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Tap / click / Space to flap', W / 2, H / 2 - 90);
    }
  }

  const onKey = e => { if (e.code === 'Space') { e.preventDefault(); flap(); } };
  const onDown = e => { e.preventDefault(); flap(); };
  window.addEventListener('keydown', onKey);
  cv.addEventListener('mousedown', onDown);
  cv.addEventListener('touchstart', onDown, { passive: false });

  reset();
  raf = requestAnimationFrame(step);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    },
  };
}

/* ═══════════════════ MEMORY MATCH ═══════════════════ */

function memoryGame(stage, api) {
  const EMOJI = ['🚀', '🌵', '🍕', '🎧', '🐙', '🌈', '⚡', '🎲'];
  const deck = [...EMOJI, ...EMOJI]
    .map(e => ({ e, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(x => x.e);

  const board = document.createElement('div');
  board.className = 'board-mem';
  board.innerHTML = deck
    .map((e, i) => `
      <div class="mem-card" data-i="${i}" data-e="${e}">
        <div class="mem-inner">
          <div class="mem-face mem-front">?</div>
          <div class="mem-face mem-back">${e}</div>
        </div>
      </div>`)
    .join('');
  stage.appendChild(board);

  let flipped = [], moves = 0, matched = 0, lock = false;
  api.setScore('Moves 0');

  function onClick(e) {
    const card = e.target.closest('.mem-card');
    if (!card || lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    flipped.push(card);
    if (flipped.length < 2) return;
    moves++;
    api.setScore(`Moves ${moves}`);
    const [a, b] = flipped;
    flipped = [];
    if (a.dataset.e === b.dataset.e) {
      a.classList.add('matched'); b.classList.add('matched');
      a.classList.remove('flipped'); b.classList.remove('flipped');
      matched++;
      if (matched === EMOJI.length) {
        setTimeout(() => api.gameOver(moves, {
          title: 'You matched them all! 🎉',
          scoreText: `Finished in ${moves} moves`,
        }), 450);
      }
    } else {
      lock = true;
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        lock = false;
      }, 750);
    }
  }
  board.addEventListener('click', onClick);

  return { destroy() { board.removeEventListener('click', onClick); } };
}

/* ═══════════════════ TIC-TAC-TOE ═══════════════════ */

function tttGame(stage, api) {
  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  const HU = 'X', AI = 'O';
  let board, turn, done, wins = 0, losses = 0, draws = 0;

  const wrap = document.createElement('div');
  wrap.className = 'ttt-wrap';
  wrap.innerHTML = `
    <div class="ttt-status" id="tttStatus">Your move — you're X</div>
    <div class="board-ttt" id="tttBoard">
      ${Array.from({ length: 9 }, (_, i) => `<button class="ttt-cell" data-i="${i}"></button>`).join('')}
    </div>
    <button class="btn btn-ghost" id="tttNext" style="visibility:hidden">Next round →</button>`;
  stage.appendChild(wrap);
  const cells = [...wrap.querySelectorAll('.ttt-cell')];
  const status = wrap.querySelector('#tttStatus');
  const nextBtn = wrap.querySelector('#tttNext');

  function newRound() {
    board = Array(9).fill(null);
    turn = HU; done = false;
    cells.forEach(c => {
      c.textContent = '';
      c.disabled = false;
      c.className = 'ttt-cell';
    });
    status.textContent = "Your move — you're X";
    nextBtn.style.visibility = 'hidden';
  }

  function winner(b) {
    for (const [a, m, z] of LINES)
      if (b[a] && b[a] === b[m] && b[a] === b[z]) return { p: b[a], line: [a, m, z] };
    return b.every(v => v) ? { p: 'draw' } : null;
  }

  function minimax(b, player, depth) {
    const w = winner(b);
    if (w) {
      if (w.p === AI) return { score: 10 - depth };
      if (w.p === HU) return { score: depth - 10 };
      return { score: 0 };
    }
    let best = null;
    for (let i = 0; i < 9; i++) {
      if (b[i]) continue;
      b[i] = player;
      const r = minimax(b, player === AI ? HU : AI, depth + 1);
      b[i] = null;
      if (!best ||
          (player === AI && r.score > best.score) ||
          (player === HU && r.score < best.score)) {
        best = { score: r.score, move: i };
      }
    }
    return best;
  }

  function endRound(w) {
    done = true;
    cells.forEach(c => (c.disabled = true));
    if (w.line) w.line.forEach(i => cells[i].classList.add('win'));
    if (w.p === HU) { wins++; status.textContent = '🎉 You win!'; }
    else if (w.p === AI) { losses++; status.textContent = '🤖 The AI wins.'; }
    else { draws++; status.textContent = '🤝 Draw.'; }
    api.setScore(`W ${wins} · L ${losses} · D ${draws}`);
    if (w.p === HU) {
      const prev = store.get('ttt');
      if (prev === undefined || wins > prev) {
        store.set('ttt', wins);
        updateBestChip(GAMES.find(g => g.id === 'ttt'));
      }
    }
    nextBtn.style.visibility = 'visible';
  }

  function place(i, p) {
    board[i] = p;
    cells[i].textContent = p;
    cells[i].classList.add(p === HU ? 'x' : 'o');
    cells[i].disabled = true;
  }

  function onCell(e) {
    const cell = e.target.closest('.ttt-cell');
    if (!cell || done || turn !== HU || board[cell.dataset.i]) return;
    place(+cell.dataset.i, HU);
    let w = winner(board);
    if (w) return endRound(w);
    turn = AI;
    status.textContent = 'AI is thinking…';
    setTimeout(() => {
      // first AI move: pick randomly among decent openings so games vary
      const empties = board.filter(v => !v).length;
      let move;
      if (empties === 8 && Math.random() < 0.5) {
        const options = [0, 2, 4, 6, 8].filter(i => !board[i]);
        move = options[(Math.random() * options.length) | 0];
      } else {
        move = minimax([...board], AI, 0).move;
      }
      place(move, AI);
      w = winner(board);
      if (w) return endRound(w);
      turn = HU;
      status.textContent = 'Your move';
    }, 420);
  }

  wrap.querySelector('#tttBoard').addEventListener('click', onCell);
  nextBtn.addEventListener('click', newRound);
  api.setScore(`W 0 · L 0 · D 0`);
  newRound();

  return { destroy() {} };
}

/* ═══════════════════ Init ═══════════════════ */

renderGrid();

// Deep links: #play-<id> opens a game directly (e.g. index.html#play-snake)
const hashGame = location.hash.match(/^#play-(.+)$/);
if (hashGame) openGame(hashGame[1]);
