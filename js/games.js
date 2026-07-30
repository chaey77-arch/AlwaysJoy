// ===== 항상기쁨 — 추억의 게임 =====
//
// 어르신이 하실 수 있는 게임. 만드는 원칙을 먼저 적어 둔다.
//
//  1. 시간을 재지 않는다. 점수도 없다. 어르신에게 초시계는 즐거움이 아니라
//     압박이다. 천천히 하셔도 아무 일도 일어나지 않아야 한다.
//  2. '틀렸습니다' 라고 하지 않는다. 틀리면 "다시 한번 보실래요?" 정도로
//     넘긴다. 평생 시험을 겪어 오신 분들께 채점은 기쁨을 깎는다.
//  3. 이미 아시는 것을 물어본다. 새로 배워야 하는 게임은 재미가 없다.
//     찬송가 · 성경 인물은 수십 년 들어 오신 것이라 거의 다 맞히신다.
//     맞히는 경험이 쌓이는 게 이 게임의 목적이다.
//  4. 손가락이 정확하지 않아도 된다. 끌어다 놓기(드래그)는 쓰지 않고
//     누르기만 쓴다. 버튼은 크게 (최소 56px).
//  5. 끝에는 반드시 말씀 한 구절로 마친다. 놀이가 은혜로 이어지게.
//
// 세 가지를 담았다:
//   · 찬송가 이어 부르기 — 다음 줄을 고른다. 평생 부르신 노래라 강하다.
//   · 성경 인물 맞추기   — 설명을 보고 이름을 고른다.
//   · 짝 맞추기          — 뒤집어 놓은 카드에서 같은 짝을 찾는다 (3×4).

// ─── 성경 인물 문제 ───────────────────────────────────────
// 주일학교부터 들어 온 이야기들만 골랐다. 어려운 인물은 넣지 않았다.
const GAME_PEOPLE = [
  { name: '노아',     hint: '방주를 지어 홍수에서 가족과 짐승을 구했어요',        who: '창세기 · 무지개 언약' },
  { name: '아브라함', hint: '믿음의 조상, 백 세에 아들 이삭을 얻었어요',          who: '창세기 · 믿음의 조상' },
  { name: '요셉',     hint: '형들에게 팔려 갔지만 애굽의 총리가 되었어요',        who: '창세기 · 꿈을 꾼 사람' },
  { name: '모세',     hint: '홍해를 갈라 이스라엘을 애굽에서 이끌어 냈어요',      who: '출애굽기 · 십계명' },
  { name: '다윗',     hint: '물맷돌로 골리앗을 이긴 목동, 뒤에 왕이 되었어요',    who: '사무엘상 · 시편을 지은 왕' },
  { name: '솔로몬',   hint: '지혜를 구해 성전을 지은 왕이에요',                  who: '열왕기상 · 지혜의 왕' },
  { name: '다니엘',   hint: '사자 굴에 들어갔지만 하나님이 지켜 주셨어요',        who: '다니엘서 · 하루 세 번 기도' },
  { name: '요나',     hint: '큰 물고기 배 속에서 사흘을 지냈어요',               who: '요나서 · 니느웨' },
  { name: '엘리야',   hint: '까마귀가 먹여 주었고 불수레로 하늘에 올라갔어요',    who: '열왕기상 · 갈멜산' },
  { name: '룻',       hint: '"어머니의 하나님이 나의 하나님" 이라 한 효부예요',   who: '룻기 · 보아스의 아내' },
  { name: '사무엘',   hint: '어릴 때 "주여 말씀하소서" 하고 응답했어요',          who: '사무엘상 · 마지막 사사' },
  { name: '베드로',   hint: '어부였다가 제자가 되었고, 세 번 부인했다 회복됐어요', who: '복음서 · 반석' },
  { name: '바울',     hint: '다마스쿠스 길에서 예수님을 만나 완전히 변했어요',    who: '사도행전 · 이방인의 사도' },
  { name: '마리아',   hint: '천사의 말을 듣고 예수님을 낳은 어머니예요',          who: '누가복음 · 나사렛' },
  { name: '삭개오',   hint: '키가 작아 뽕나무에 올라가 예수님을 보았어요',        who: '누가복음 · 세리장' },
  { name: '아담',     hint: '하나님이 흙으로 지으신 첫 사람이에요',              who: '창세기 · 에덴동산' },
  { name: '여호수아', hint: '여리고 성을 돌아 무너뜨리고 가나안에 들어갔어요',    who: '여호수아 · 모세의 후계자' },
  { name: '에스더',   hint: '"죽으면 죽으리라" 하고 왕에게 나아가 백성을 구했어요', who: '에스더서 · 왕비' },
];

// ─── 짝 맞추기 카드 ───────────────────────────────────────
// 그림글자와 이름을 같이 두어, 눈이 침침해도 형태로 구별되게 했다.
// 여섯 짝(카드 12장, 3×4)이면 화면에 한 번에 들어가고 부담이 적다.
const GAME_PAIRS = [
  { icon: '🕊️', name: '비둘기' },
  { icon: '🐟', name: '물고기' },
  { icon: '🌿', name: '올리브' },
  { icon: '✝️', name: '십자가' },
  { icon: '👑', name: '왕관' },
  { icon: '🍇', name: '포도' },
  { icon: '🐑', name: '어린 양' },
  { icon: '⛵', name: '배' },
  { icon: '🔥', name: '불' },
  { icon: '💧', name: '물' },
];

// ─── 게임을 마칠 때 드리는 말씀 ───────────────────────────
const GAME_BLESSINGS = [
  { text: '이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라', ref: '데살로니가전서 5:18' },
  { text: '여호와를 기뻐하는 것이 너희의 힘이니라', ref: '느헤미야 8:10' },
  { text: '내가 너를 잊지 아니하리라', ref: '이사야 49:15' },
  { text: '주의 앞에는 기쁨이 충만하고', ref: '시편 16:11' },
  { text: '항상 기뻐하라', ref: '데살로니가전서 5:16' },
];

const GameState = {
  kind: null,        // 'hymn' | 'people' | 'pair'
  round: 0,          // 지금 몇 번째 문제인지 (0부터)
  total: 5,          // 한 판에 다섯 문제 — 길면 지치신다
  right: 0,          // 맞힌 횟수 (칭찬에만 쓴다. 점수로 보여주지 않는다)
  quiz: [],          // 이번 판의 문제들
  answered: false,   // 지금 문제에 답했는지 (두 번 눌러도 안 넘어가게)

  // 짝 맞추기
  cards: [],         // { id, icon, name, open, done }
  openIdx: -1,       // 지금 뒤집혀 있는 카드 (짝을 기다리는 중)
  locking: false,    // 카드 두 장이 뒤집혀 되돌아가기를 기다리는 중
  found: 0,
};

// ─── 흔들어 섞기 ──────────────────────────────────────────
// 앱 안의 다른 곳처럼 Math.random 을 그대로 쓴다 (Fisher-Yates)
function gameShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── 기억 탭의 게임 카드 ──────────────────────────────────
function renderGames() {
  const el = document.getElementById('game-menu');
  if (!el) return;
  const best = Store.load('gamePlays', 0);
  el.innerHTML = `
    <div class="game-card" onclick="openGame('hymn')">
      <div class="game-card-icon">🎵</div>
      <div class="game-card-body">
        <div class="game-card-title">찬송가 이어 부르기</div>
        <div class="game-card-sub">다음 줄이 뭘까요? 평생 부르신 노래예요</div>
      </div>
    </div>
    <div class="game-card" onclick="openGame('people')">
      <div class="game-card-icon">👤</div>
      <div class="game-card-body">
        <div class="game-card-title">성경 인물 맞추기</div>
        <div class="game-card-sub">설명을 보고 누구인지 골라보세요</div>
      </div>
    </div>
    <div class="game-card" onclick="openGame('pair')">
      <div class="game-card-icon">🃏</div>
      <div class="game-card-body">
        <div class="game-card-title">짝 맞추기</div>
        <div class="game-card-sub">같은 그림 두 장을 찾아보세요</div>
      </div>
    </div>
    <div class="game-note">
      시간을 재지 않아요. 천천히 하셔도 됩니다 🌿
      ${best > 0 ? `<br>지금까지 ${best}번 즐기셨어요` : ''}
    </div>`;
}

// ─── 게임 열기 ────────────────────────────────────────────
function openGame(kind) {
  GameState.kind = kind;
  GameState.round = 0;
  GameState.right = 0;
  GameState.answered = false;

  if (kind === 'hymn') GameState.quiz = makeHymnQuiz();
  else if (kind === 'people') GameState.quiz = makePeopleQuiz();
  else GameState.quiz = [];

  // 문제를 못 만들었으면(자료가 모자라면) 조용히 알려 드리고 만다
  if (kind !== 'pair' && !GameState.quiz.length) {
    showToast('지금은 문제를 준비할 수 없어요');
    return;
  }
  GameState.total = kind === 'pair' ? 1 : GameState.quiz.length;

  const overlay = document.getElementById('game-modal');
  if (!overlay) return;
  overlay.classList.add('open');
  if (kind === 'pair') startPairGame();
  else renderQuizRound();
}

function closeGame() {
  document.getElementById('game-modal')?.classList.remove('open');
  GameState.kind = null;
}

// ─── 찬송가 이어 부르기 ───────────────────────────────────
//
// 가사 한 줄을 보여주고 그 다음 줄을 고르게 한다.
// 오답은 '다른 찬송가의 줄' 에서 가져온다 — 같은 곡에서 가져오면
// 둘 다 맞는 것처럼 느껴져서 억울하다.
function makeHymnQuiz() {
  const hymns = (typeof DATA !== 'undefined' && DATA.hymns) || [];
  // 가사가 두 줄 이상 있는 곡만 쓴다
  const usable = hymns.filter(h => h.lyrics && h.lyrics.split('\n').filter(Boolean).length >= 2);
  if (usable.length < 2) return [];

  // 어르신께 익숙한 전통 찬송가를 먼저 쓰고, 모자라면 CCM 으로 채운다
  const trad = gameShuffle(usable.filter(h => h.tag === '찬송가'));
  const ccm = gameShuffle(usable.filter(h => h.tag !== '찬송가'));
  const pool = [...trad, ...ccm].slice(0, 5);

  // 오답으로 쓸 가사 줄 모음 (모든 곡에서)
  const allLines = [];
  usable.forEach(h => {
    h.lyrics.split('\n').map(s => s.trim()).filter(Boolean)
      .forEach(line => allLines.push({ line, id: h.id }));
  });

  const quiz = [];
  for (const h of pool) {
    const lines = h.lyrics.split('\n').map(s => s.trim()).filter(Boolean);
    // 첫 줄을 문제로 내면 곡 제목과 같아 너무 쉽다. 두 번째 줄부터 고른다.
    const maxStart = lines.length - 2;
    if (maxStart < 0) continue;
    const i = Math.min(Math.floor(Math.random() * (maxStart + 1)), Math.max(0, lines.length - 2));
    const ask = lines[i];
    const answer = lines[i + 1];
    if (!ask || !answer) continue;

    // 다른 곡의 줄에서 오답 둘을 뽑는다
    const wrongs = gameShuffle(allLines.filter(x => x.id !== h.id && x.line !== answer))
      .map(x => x.line);
    // 같은 글이 두 번 나오지 않게 (다른 곡에 같은 줄이 있을 수 있다)
    const uniq = [];
    for (const w of wrongs) { if (!uniq.includes(w) && w !== answer) uniq.push(w); if (uniq.length >= 2) break; }
    if (uniq.length < 2) continue;

    quiz.push({
      title: h.title,
      ask: ask,
      answer: answer,
      choices: gameShuffle([answer, ...uniq]),
      note: h.artist || '',
    });
  }
  return quiz;
}

// ─── 성경 인물 맞추기 ─────────────────────────────────────
function makePeopleQuiz() {
  const picked = gameShuffle(GAME_PEOPLE).slice(0, 5);
  return picked.map(p => {
    const wrongs = gameShuffle(GAME_PEOPLE.filter(x => x.name !== p.name))
      .slice(0, 2).map(x => x.name);
    return {
      title: '이분은 누구실까요?',
      ask: p.hint,
      answer: p.name,
      choices: gameShuffle([p.name, ...wrongs]),
      note: p.who,
    };
  });
}

// ─── 문제 화면 ────────────────────────────────────────────
function renderQuizRound() {
  const body = document.getElementById('game-body');
  const title = document.getElementById('game-modal-title');
  if (!body) return;

  const q = GameState.quiz[GameState.round];
  if (!q) { renderGameEnd(); return; }
  GameState.answered = false;

  if (title) {
    title.textContent = GameState.kind === 'hymn'
      ? '찬송가 이어 부르기 🎵' : '성경 인물 맞추기 👤';
  }

  // 몇 번째인지 점으로 — 숫자보다 부담이 적다
  const dots = GameState.quiz.map((_, i) =>
    `<span class="game-dot${i < GameState.round ? ' done' : ''}${i === GameState.round ? ' now' : ''}"></span>`
  ).join('');

  const askLabel = GameState.kind === 'hymn'
    ? '다음 줄은 무엇일까요?' : '설명을 읽어 보세요';

  body.innerHTML = `
    <div class="game-dots">${dots}</div>
    <div class="game-q">
      <div class="game-q-label">${escHtml(q.title)}</div>
      <div class="game-q-text" id="game-q-text"></div>
      <div class="game-q-ask">${escHtml(askLabel)}</div>
    </div>
    <div class="game-choices">
      ${q.choices.map((c, i) =>
        `<button type="button" class="game-choice" data-i="${i}"
           onclick="answerQuiz(${i})">${escHtml(c)}</button>`
      ).join('')}
    </div>
    <div class="game-feedback" id="game-feedback"></div>`;

  // 문제 글은 낱말 중간에서 갈리지 않게 넣는다 (가사 한 줄은 뜻 한 덩어리)
  setPhrase('game-q-text', GameState.kind === 'hymn' ? '"' + q.ask + '"' : q.ask);
  applyGameFontSize();
}

function answerQuiz(i) {
  if (GameState.answered) return;          // 두 번 눌러도 한 번만 센다
  const q = GameState.quiz[GameState.round];
  if (!q) return;
  const picked = q.choices[i];
  const right = picked === q.answer;
  const btns = document.querySelectorAll('.game-choice');
  const fb = document.getElementById('game-feedback');

  if (!right) {
    // 틀렸다고 하지 않는다. 그 칸만 조용히 흐려 두고 다시 고르게 한다.
    const b = btns[i];
    if (b) { b.classList.add('dim'); b.disabled = true; }
    if (fb) {
      fb.className = 'game-feedback show soft';
      fb.textContent = '다시 한번 보실래요? 천천히요 🌿';
    }
    return;
  }

  // 맞혔다 — 여기서 문제를 닫는다
  GameState.answered = true;
  GameState.right++;
  btns.forEach((b, k) => {
    b.disabled = true;
    if (q.choices[k] === q.answer) b.classList.add('right');
  });
  if (fb) {
    fb.className = 'game-feedback show good';
    fb.innerHTML = `<div class="game-fb-big">잘하셨어요! 🎉</div>`
      + (q.note ? `<div class="game-fb-sub">${escHtml(q.note)}</div>` : '')
      + `<button type="button" class="btn-primary game-next" onclick="nextQuizRound()">
           ${GameState.round + 1 >= GameState.quiz.length ? '다 했어요' : '다음 문제 →'}
         </button>`;
  }
}

function nextQuizRound() {
  GameState.round++;
  if (GameState.round >= GameState.quiz.length) renderGameEnd();
  else renderQuizRound();
}

// ─── 짝 맞추기 ────────────────────────────────────────────
function startPairGame() {
  const pairs = gameShuffle(GAME_PAIRS).slice(0, 6);
  // 같은 짝은 pid 로 묶는다 (그림글자로 비교하면 같은 그림이 겹칠 때 헷갈린다)
  const deck = [];
  pairs.forEach((p, pid) => {
    deck.push({ pid, icon: p.icon, name: p.name });
    deck.push({ pid, icon: p.icon, name: p.name });
  });
  GameState.cards = gameShuffle(deck).map((c, i) =>
    ({ ...c, id: i, open: false, done: false }));
  GameState.openIdx = -1;
  GameState.locking = false;
  GameState.found = 0;

  const title = document.getElementById('game-modal-title');
  if (title) title.textContent = '짝 맞추기 🃏';
  renderPairBoard();
}

function renderPairBoard() {
  const body = document.getElementById('game-body');
  if (!body) return;
  body.innerHTML = `
    <div class="game-q">
      <div class="game-q-ask">같은 그림 두 장을 찾아 눌러 보세요</div>
    </div>
    <div class="pair-grid" id="pair-grid"></div>
    <div class="game-feedback" id="game-feedback"></div>`;
  paintPairCards();
  applyGameFontSize();
}

// 카드는 다시 그리지 않고 겉모습만 바꾼다 — 다시 그리면 뒤집는 애니메이션이
// 끊기고, 누르는 순간 화면이 깜빡여서 어디를 눌렀는지 놓치신다.
function paintPairCards() {
  const grid = document.getElementById('pair-grid');
  if (!grid) return;
  if (!grid.children.length) {
    grid.innerHTML = GameState.cards.map(c =>
      `<button type="button" class="pair-card" data-id="${c.id}"
         onclick="flipPair(${c.id})" aria-label="카드">
         <span class="pair-back">✝</span>
         <span class="pair-face"><span class="pair-icon">${c.icon}</span>
         <span class="pair-name">${escHtml(c.name)}</span></span>
       </button>`).join('');
    return;
  }
  GameState.cards.forEach(c => {
    const el = grid.querySelector('.pair-card[data-id="' + c.id + '"]');
    if (!el) return;
    el.classList.toggle('open', c.open || c.done);
    el.classList.toggle('done', c.done);
    el.disabled = c.done;
  });
}

function flipPair(id) {
  if (GameState.locking) return;                  // 되돌아가기를 기다리는 중
  const c = GameState.cards.find(x => x.id === id);
  if (!c || c.done || c.open) return;

  c.open = true;
  paintPairCards();

  // 첫 장이면 짝을 기다린다
  if (GameState.openIdx < 0) { GameState.openIdx = id; return; }

  const first = GameState.cards.find(x => x.id === GameState.openIdx);
  GameState.openIdx = -1;
  if (!first) return;

  if (first.pid === c.pid) {
    first.done = true; c.done = true;
    GameState.found++;
    paintPairCards();
    const fb = document.getElementById('game-feedback');
    if (GameState.found >= 6) {
      GameState.right = 6;
      // 다 찾으셨으면 잠시 보여드리고 마침 화면으로
      setTimeout(() => renderGameEnd(), 900);
    } else if (fb) {
      fb.className = 'game-feedback show good';
      fb.textContent = '짝을 찾으셨어요! 🎉 (' + GameState.found + ' / 6)';
    }
    return;
  }

  // 다른 짝이면 잠깐 보여드리고 다시 덮는다. 1.1초는 어르신이 두 장을
  // 눈으로 확인하기에 충분하고, 기다리기 답답하지 않은 정도다.
  GameState.locking = true;
  const fb = document.getElementById('game-feedback');
  if (fb) { fb.className = 'game-feedback show soft'; fb.textContent = '다른 짝이네요. 다시 볼까요? 🌿'; }
  setTimeout(() => {
    first.open = false; c.open = false;
    GameState.locking = false;
    paintPairCards();
    const f2 = document.getElementById('game-feedback');
    if (f2) { f2.className = 'game-feedback'; f2.textContent = ''; }
  }, 1100);
}

// ─── 마침 화면 ────────────────────────────────────────────
// 점수를 매기지 않는다. 몇 개를 맞혔는지가 아니라 '하셨다' 는 것을 칭찬한다.
function renderGameEnd() {
  const body = document.getElementById('game-body');
  const title = document.getElementById('game-modal-title');
  if (!body) return;
  if (title) title.textContent = '오늘도 잘하셨어요 🌿';

  // 몇 번 즐기셨는지만 세어 둔다 (기록은 이것뿐 — 성적은 남기지 않는다)
  const plays = Store.load('gamePlays', 0) + 1;
  Store.save('gamePlays', plays);

  const b = GAME_BLESSINGS[Math.floor(Math.random() * GAME_BLESSINGS.length)];
  const again = GameState.kind;
  body.innerHTML = `
    <div class="game-end">
      <div class="game-end-icon">🎉</div>
      <div class="game-end-title" id="game-end-title"></div>
      <div class="game-end-sub" id="game-end-sub"></div>
      <div class="game-end-verse">
        <div class="game-end-verse-text" id="game-end-verse-text"></div>
        <div class="game-end-verse-ref">${escHtml(b.ref)}</div>
      </div>
      <button type="button" class="btn-primary" onclick="openGame('${again}')">한 번 더 할까요</button>
      <button type="button" class="btn-secondary" onclick="closeGame()">그만할래요</button>
    </div>`;
  // 문구는 낱말이 갈리지 않게 넣는다
  setPhrase('game-end-title', '끝까지 하셨어요');
  setPhrase('game-end-sub', '하나님이 주신 기쁨이\n오늘도 함께합니다');
  setPhrase('game-end-verse-text', '"' + b.text + '"');
  applyGameFontSize();
}

// ─── 게임 글씨 크기 ───────────────────────────────────────
// 다른 곳과 같은 3단계. 게임은 보기 칸의 글을 읽어야 하니 더 중요하다.
const GAME_SIZES = [
  { v: '16px', label: '보통' },
  { v: '20px', label: '크게' },
  { v: '24px', label: '아주 크게' }
];

function cycleGameFontSize() {
  State.gameFontIdx = ((State.gameFontIdx || 0) + 1) % GAME_SIZES.length;
  Store.save('gameFontIdx', State.gameFontIdx);
  applyGameFontSize();
}

function applyGameFontSize() {
  const size = GAME_SIZES[State.gameFontIdx || 0] || GAME_SIZES[0];
  const sheet = document.getElementById('game-modal');
  if (sheet) sheet.style.setProperty('--game-fs', size.v);
  const btn = document.getElementById('game-size-btn');
  if (btn) btn.textContent = '글씨 ' + size.label;
}
