// ===== 항상기쁨 App Logic =====
// 살전 5:16-18 · Life Model Works: 기쁨은 훈련 가능하다

const State = {
  user: null,
  lang: 'ko',   // 'ko' | 'en'
  activeTab: 'home',
  currentVerseIdx: 0,
  currentHymnIdx: 0,
  isPlaying: false,
  selectedVerseTopicIdx: 0,
  selectedPrayerType: null,
  gratitude: [],
  prayers: [],
  immanuel: [],           // 임마누엘 일기 — 주님과 함께한 하루를 단계별로 적은 것
  immFontIdx: 0,          // 임마누엘 일기 글씨 크기 단계
  favFontIdx: 0,          // 좋아하는 말씀 목록 글씨 크기 단계
  gameFontIdx: 0,         // 추억의 게임 글씨 크기 단계
  memories: { people: [], myVerses: [], myFaith: { baptism: '', church: '', note: '' } },
  lastActivity: Date.now(),

  // 말씀 탭 — 주제별 말씀 · 성경읽기 · 설교 유튜브
  wordSub: 'topic',
  // 성경읽기 (기본은 요한복음 1장 — 처음 읽는 분께 권하는 곳)
  bibleBook: 43,
  bibleChapter: 1,
  bibleLast: null,        // 마지막에 읽던 곳
  bibleFontIdx: 0,        // 글씨 크기 단계
  bibleLoadedOnce: false, // 성경읽기 탭을 한 번이라도 열었는지
  bibleReqToken: 0,       // 늦게 온 응답이 화면을 덮어쓰지 않게 하는 번호
};

const Store = {
  save(k, v) { try { localStorage.setItem('ajoy_' + k, JSON.stringify(v)); } catch(e) {} },
  load(k, d) { try { const v = localStorage.getItem('ajoy_' + k); return v ? JSON.parse(v) : d; } catch(e) { return d; } }
};

// 서버에 올릴 것을 저장한 뒤 부른다. 로그인 전이거나 인터넷이 없으면
// 아무 일도 하지 않고, 다음에 로그인할 때 한꺼번에 올라간다.
function cloudQueue() {
  if (typeof Cloud !== 'undefined' && Cloud.queueSync) Cloud.queueSync();
}

// 기기에서 만드는 식별자 — 같은 기록이 서버에 두 번 올라가는 걸 막는다
function newClientId() {
  return 'c' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
}

// ─── Init ────────────────────────────────────────────────
function init() {
  State.user = Store.load('user', null);
  State.lang = Store.load('lang', 'ko');
  State.gratitude = Store.load('gratitude', []);
  State.prayers = Store.load('prayers', []);
  State.immanuel = Store.load('immanuel', []);
  // 글씨 크기는 곳마다 따로 기억한다 — 한 곳에서 키웠다고 다른 곳까지
  // 커지면 어르신이 "왜 갑자기 바뀌었지" 하고 당황한다
  State.immFontIdx = Store.load('immFontIdx', 0);
  State.favFontIdx = Store.load('favFontIdx', 0);
  State.gameFontIdx = Store.load('gameFontIdx', 0);
  State.memories = Store.load('memories', { people: [], myVerses: [], myFaith: { baptism:'', church:'', note:'' } });
  State.currentVerseIdx = getTodayVerseIdx();
  // 성경읽기 — 마지막에 읽던 곳과 글씨 크기를 되살린다
  State.bibleFontIdx = Store.load('bibleFontIdx', 0);
  State.bibleLast = Store.load('bibleLast', null);
  if (State.bibleLast) {
    State.bibleBook = State.bibleLast.n;
    State.bibleChapter = State.bibleLast.c;
  }
  applyCharacter();
  // 성경 읽음 기록 복원
  const savedRead = Store.load('readEras', []);
  StoryState.readEras = new Set(savedRead);
  // 역사 이야기 글씨 크기 복원 (성경읽기와 따로 기억한다)
  StoryState.storyFontIdx = Store.load('storyFontIdx', 0);

  // ?preview=<tab> — 색상 시안 비교용. 온보딩을 건너뛰고 해당 탭을 바로 보여준다.
  // 서비스워커는 등록하지 않는다 (미리보기 iframe 이 캐시를 오염시키지 않도록)
  const preview = new URLSearchParams(location.search).get('preview');
  if (preview) {
    if (preview === 'onboard') {
      showScreen('onboard');
      applyLangUI();
      return;
    }
    if (!State.user) State.user = { name: '홍길동', ageGroup: 'senior', joinDate: new Date().toISOString() };
    showScreen('main');
    renderAll();
    switchTab(preview);
    return;
  }

  if (State.user) {
    showScreen('main');
    renderAll();
    startCompanion();
  } else {
    showScreen('onboard');
    // 저장된 언어 설정을 온보딩 화면에도 반영 (renderAll 을 타지 않으므로 직접 호출)
    applyLangUI();
  }
  registerSW();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');

  // 화면을 바꾸면 항상 맨 위에서 시작한다.
  // 온보딩에서 스크롤을 내린 채 "시작하기" 를 누르면 그 위치가 남아
  // 홈이 중간부터 보이기 때문에, 창과 탭 내부 스크롤을 둘 다 되돌린다.
  scrollToTop();
}

// 창 스크롤 + 현재 탭의 내부 스크롤을 맨 위로
// (탭 본문은 .tab-content 가 자체 overflow-y 를 가져 창 스크롤과 별개다)
function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document.querySelectorAll('.tab-content').forEach(c => { c.scrollTop = 0; });
}

function switchTab(tab) {
  // 다른 탭으로 이동하면 TTS 정지
  if (tab !== 'story' && StoryState.ttsActive) stopTts();
  // 마이크와 기도 읽어주기도 함께 멈춘다 — 탭을 옮긴 뒤에도 마이크가 켜져
  // 있으면 어르신은 그걸 모르고 계속 켜 둔 채 다니시게 된다
  if (typeof Voice !== 'undefined' && Voice.listening()) Voice.stop();
  if (typeof PrayerVoice !== 'undefined' && PrayerVoice.active) PrayerVoice.stop();
  State.activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + tab));
  // 탭을 옮기면 새 탭 맨 위부터 — 이전 탭에서 내려둔 위치가 남지 않게
  scrollToTop();
  State.lastActivity = Date.now();
}

// ─── Onboarding ──────────────────────────────────────────
function bindOnboard() {
  let selectedAge = 'senior';
  document.querySelectorAll('.ob-age-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ob-age-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAge = btn.dataset.age;
    });
  });

  document.getElementById('btn-start')?.addEventListener('click', () => {
    const name = (document.getElementById('onboard-name')?.value || '').trim();
    if (!name) { document.getElementById('onboard-name')?.focus(); showToast(t('obNameRequired')); return; }
    State.user = { name, ageGroup: selectedAge, joinDate: new Date().toISOString() };
    Store.save('user', State.user);
    showScreen('main');
    renderAll();
    startCompanion();
    setTimeout(() => showCompanionBanner('morning'), 1400);
  });
}

// ─── Render all ──────────────────────────────────────────
function renderAll() {
  applyLangUI();
  renderHeader();
  renderHome();
  renderWord();
  renderHymn();
  renderPrayer();
  renderGratitude();
  renderImmanuel();
  renderAlbum();
  renderStory();
  // 말로 쓰기 — 입력칸이 다 그려진 뒤에 붙인다. 쓸 수 없는 폰에서는
  // voice.js 가 스스로 아무것도 붙이지 않는다 (안 되는 버튼을 두지 않는다)
  if (typeof attachAllMics === 'function') attachAllMics();
  // 카드 바인딩 이후의 재렌더에서만 동작 (최초 boot 시엔 no-op)
  if (typeof updateCollapseHints === 'function') updateCollapseHints();
}

// 낱말이 줄 끝에서 쪼개지지 않게 묶어 준다.
// 한글은 기본 줄바꿈 규칙이 음절 단위라 '주님 안에서' 가 '주님 안' / '에서' 로
// 갈린다. CSS 의 word-break: keep-all 이 낱말 중간은 막아 주지만, 어느 낱말
// 사이에서 끊을지는 못 정한다. 붙여 두고 싶은 덩어리는 낱말 사이 공백을
// 줄바꿈 없는 공백( )으로 바꿔 한 낱말처럼 만든다.
function nbsp(s) { return String(s == null ? '' : s).replace(/ /g, ' '); }

// 낱말은 묶되, 끝에 붙은 그림글자(🌿 ☀️ 🌳)는 떼어 낸다.
//
// 아주 좁은 폰(280px, 갤럭시 폴드 접은 상태)에서는 '주님이 함께하십니다 🌿'
// 를 통째로 묶으면 그 덩어리가 한 줄보다 넓어져, 브라우저가 어쩔 수 없이
// 낱말 중간을 쪼갠다 ('함께하십니 / 다'). 그림글자는 뜻이 없는 장식이라
// 그 앞에서 끊는 편이 훨씬 낫다 — '주님이 함께하십니다' / '🌿'.
// 그래서 글자끼리는 붙여 두고 그림글자 앞만 보통 공백으로 남긴다.
function nbspKeepEmoji(s) {
  const str = String(s == null ? '' : s);
  const m = str.match(/^(.*\S)\s+([\p{Extended_Pictographic}️‍]+)$/u);
  return m ? nbsp(m[1]) + ' ' + m[2] : nbsp(str);
}

function renderHeader() {
  const name = State.user?.name || '';
  // '차정윤님,' 과 '주님 안에서 🌿' 는 각각 통째로 — 이름과 인사말 사이에서만
  // 줄이 갈리게 한다. 이렇게 하면 '주님 안 / 에서' 같은 끊김이 안 생긴다.
  const suffix = State.lang === 'en'
    ? nbspKeepEmoji('in the Lord 🌿') : nbspKeepEmoji('주님 안에서 🌿');
  const head = State.lang === 'en' ? (name ? name + ',' : '') : (name ? name + '님,' : '');
  setEl('header-name', head ? head + ' ' + suffix : suffix);
  setEl('header-date', formatDate(new Date()));
}

// ─── 캐릭터 ──────────────────────────────────────────────
const CHAR_NAMES = {
  sun:    { ko: '햇살이', en: 'Sunny' },
  forest: { ko: '쉴만한 숲', en: 'Restful Forest' },
  jesus:  { ko: '예수님', en: 'Jesus' },
  dove:   { ko: '기쁨이', en: 'Joy' },
  grape:  { ko: '포도알', en: 'Grapey' },
};

// 하루 세 번 바뀐다 — 아침 해 · 점심 미니숲 · 저녁 예수님
// 새벽(0–4시)은 저녁 시간대의 연장으로 보고 예수님을 유지한다
function getTimeChar(h) {
  if (h >= 5 && h < 11) return 'sun';     // 05–10시  아침
  if (h >= 11 && h < 17) return 'forest'; // 11–16시  점심
  return 'jesus';                         // 17–04시  저녁·밤
}

// ?char=... 이 있으면 그걸로 고정(미리보기), 없으면 시간대에 따라 자동
function applyCharacter() {
  const q = new URLSearchParams(location.search).get('char');
  const name = CHAR_NAMES[q] ? q : getTimeChar(new Date().getHours());
  const alt = (CHAR_NAMES[name] || {})[State.lang === 'en' ? 'en' : 'ko'] || '캐릭터';
  ['ob-char-img', 'greet-char-img'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.src = `icons/char-${name}.svg`; el.alt = alt; }
  });
}

// ─── Home ────────────────────────────────────────────────
function renderGreeting() {
  const h = new Date().getHours();
  const key = h < 6  ? 'greetNight'
            : h < 12 ? 'greetMorning'
            : h < 18 ? 'greetAfternoon'
            : h < 22 ? 'greetEvening'
            : 'greetNight';
  const name = State.user?.name || '';
  const hi = t(key);
  // 이름을 붙여 말을 걸어주는 느낌 — 언어별 어순 반영.
  // 이름 뒤에서만 줄이 갈리게 한다: '차정윤님,' / '좋은 저녁이에요!' 처럼
  // 인사말은 통째로 아래 줄로 내려간다 ('좋은 저 / 녁이에요' 방지).
  setPhrase('greet-hi', name
    ? (State.lang === 'en' ? `${hi.replace('!', '')}, ${name}!` : `${name}님,\n${hi}`)
    : hi);
  // 지금 보이는 캐릭터에 맞춘 한마디 (없으면 기본 문구)
  // t() 는 없는 키를 그대로 돌려주므로 ui 객체를 직접 확인한다
  const q = new URLSearchParams(location.search).get('char');
  const charKey = CHAR_NAMES[q] ? q : getTimeChar(h);
  const msgKey = 'greetMsg' + charKey.charAt(0).toUpperCase() + charKey.slice(1);
  const ui = DATA.ui[State.lang] || DATA.ui.ko;
  // 문구 안의 \n 이 끊어도 되는 자리 — 그 사이 낱말은 붙어서 움직인다
  setPhrase('greet-msg', ui[msgKey] || ui.greetMsg);
}

function renderHome() {
  renderGreeting();
  const verseList = State.lang === 'en' ? DATA.dailyVersesEn : DATA.dailyVerses;
  const verse = verseList[State.currentVerseIdx] || verseList[0];
  setEl('home-verse-text', verse.text);
  setEl('home-verse-ref', verse.ref);

  const streak = calcStreak();
  setEl('home-streak-num', streak.toString());
  const streakText = streak > 0
    ? (State.lang === 'en' ? `${streak}-day gratitude streak 🔥` : `일째 감사 중 🔥`)
    : t('streakStart');
  setEl('home-streak-text', streakText);

  // 빠른 이동 라벨
  setEl('quick-label-word', t('quickWord'));
  setEl('quick-label-hymn', t('quickHymn'));
  setEl('quick-label-prayer', t('quickPrayer'));
  setEl('quick-label-gratitude', t('quickGratitude'));

  // 세 가지 명령
  setEl('cmd1-title', t('cmd1')); setEl('cmd1-ref', t('cmd1ref'));
  setEl('cmd2-title', t('cmd2')); setEl('cmd2-ref', t('cmd2ref'));
  setEl('cmd3-title', t('cmd3')); setEl('cmd3-ref', t('cmd3ref'));
}

// ─── Word ────────────────────────────────────────────────
function renderWord() {
  const verseList = State.lang === 'en' ? DATA.dailyVersesEn : DATA.dailyVerses;
  const verse = verseList[State.currentVerseIdx] || verseList[0];
  setEl('word-verse-text', verse.text);
  setEl('word-verse-ref', verse.ref);

  // 주제 칩
  const chips = document.getElementById('verse-topic-chips');
  if (chips) {
    chips.innerHTML = DATA.verseTopics.map((t, i) =>
      `<button class="chip ${i === State.selectedVerseTopicIdx ? 'active' : ''}" onclick="selectVerseTopic(${i})">${t.icon} ${t.label}</button>`
    ).join('');
  }
  renderVerseTopicContent();
  renderBibleRead();
  renderBibleProgress();
  updateFavDailyBtn();

  // 영상 목록 — youtubeSearch 기반
  const videoList = document.getElementById('video-list');
  if (videoList) {
    videoList.innerHTML = DATA.videos.flatMap(cat =>
      cat.items.map(v => {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(v.searchQuery || v.title)}`;
        return `<a class="video-item" href="${searchUrl}" target="_blank" rel="noopener">
          <div class="video-thumb">${v.thumb}</div>
          <div class="video-body">
            <div class="video-title">${v.title}</div>
            <div class="video-ch">${v.channel} · ${cat.category}</div>
          </div>
          <div class="video-arrow">▶</div>
        </a>`;
      })
    ).join('');
  }
}

function selectVerseTopic(idx) {
  State.selectedVerseTopicIdx = idx;
  document.querySelectorAll('#verse-topic-chips .chip').forEach((b, i) => b.classList.toggle('active', i === idx));
  renderVerseTopicContent();
}

function renderVerseTopicContent() {
  const topic = DATA.verseTopics[State.selectedVerseTopicIdx];
  const el = document.getElementById('verse-topic-content');
  if (!el || !topic) return;
  el.innerHTML = topic.verses.map(v =>
    `<div class="topic-verse">
      <div class="topic-verse-text">${v.text}</div>
      <div class="topic-verse-row">
        <div class="topic-verse-ref">${v.ref}</div>
        ${favBtnHtml(v.text, v.ref, 'topic')}
      </div>
    </div>`
  ).join('');
}

// ─── 좋아하는 말씀 ────────────────────────────────────────
// 읽는 자리에서 바로 담을 수 있게 — 앨범에서 손으로 옮겨 적지 않아도 된다.
// 같은 구절을 두 번 담지 않도록 본문+출처로 짝을 찾는다.
function favKey(text, ref) {
  return (String(ref || '').trim() + '|' + String(text || '').trim().replace(/\s+/g, ' '));
}

function favIndexOf(text, ref) {
  const k = favKey(text, ref);
  return State.memories.myVerses.findIndex(v => favKey(v.text, v.ref) === k);
}

function isFavorited(text, ref) { return favIndexOf(text, ref) >= 0; }

// 버튼 하나를 그린다. 눌린 상태면 채워진 하트로 보여준다.
// 본문·출처는 onclick 문자열이 아니라 data 속성에 담는다 — 따옴표나
// 특수문자가 든 구절도 깨지지 않고, 다시 읽어올 때 파싱이 필요 없다.
function favBtnHtml(text, ref, kind) {
  const on = isFavorited(text, ref);
  return `<button class="fav-btn${on ? ' on' : ''}" data-kind="${escHtml(kind || '')}"
    data-fav-text="${escHtml(text)}" data-fav-ref="${escHtml(ref)}"
    aria-label="${on ? '좋아하는 말씀에서 빼기' : '좋아하는 말씀에 담기'}"
    aria-pressed="${on}">${on ? '♥' : '♡'}</button>`;
}

// 하트는 위임으로 한 번만 묶는다 — 본문을 다시 그려도 계속 동작한다
function bindFavButtons() {
  if (document.body.dataset.favBound) return;
  document.body.dataset.favBound = '1';
  document.body.addEventListener('click', e => {
    const btn = e.target.closest && e.target.closest('.fav-btn');
    if (!btn) return;
    toggleFavVerse(btn.dataset.favText || '', btn.dataset.favRef || '');
  });
}

function toggleFavVerse(text, ref) {
  const idx = favIndexOf(text, ref);
  if (idx >= 0) {
    State.memories.myVerses.splice(idx, 1);
    showToast('좋아하는 말씀에서 뺐습니다');
  } else {
    State.memories.myVerses.push({ text: String(text || '').trim(), ref: String(ref || '').trim(), at: Date.now() });
    showToast('좋아하는 말씀에 담았습니다 ♥');
  }
  Store.save('memories', State.memories);
  cloudQueue();
  refreshFavButtons();
  renderAlbum();
  // 앨범 창이 열려 있으면 목록도 같이 맞춰준다
  if (document.getElementById('memory-modal')?.classList.contains('open')
      && document.getElementById('m-verse-text')) {
    openMemoryModal('verses');
  }
}

// 화면에 떠 있는 하트들을 다시 칠한다 (본문 전체를 다시 그리면
// 읽던 자리가 흔들리기 때문에 버튼만 바꾼다)
function refreshFavButtons() {
  document.querySelectorAll('.fav-btn').forEach(btn => {
    const on = isFavorited(btn.dataset.favText || '', btn.dataset.favRef || '');
    btn.classList.toggle('on', on);
    btn.textContent = on ? '♥' : '♡';
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? '좋아하는 말씀에서 빼기' : '좋아하는 말씀에 담기');
  });
  updateFavDailyBtn();
}

// 오늘의 말씀 담기 버튼
function currentDailyVerse() {
  const list = State.lang === 'en' ? DATA.dailyVersesEn : DATA.dailyVerses;
  return list[State.currentVerseIdx] || list[0];
}
function favDailyVerse() {
  const v = currentDailyVerse();
  if (v) toggleFavVerse(v.text, v.ref);
}
function updateFavDailyBtn() {
  const btn = document.getElementById('fav-daily-btn');
  const v = currentDailyVerse();
  if (!btn || !v) return;
  const on = isFavorited(v.text, v.ref);
  btn.classList.toggle('on', on);
  btn.textContent = on ? '♥ 담아둔 말씀' : '♡ 이 말씀 담아두기';
  btn.setAttribute('aria-pressed', String(on));
}

// ─── 말씀 탭 안의 서브탭 ─────────────────────────────────
function switchWordSub(sub) {
  State.wordSub = sub;
  document.querySelectorAll('#word-subtabs .subtab').forEach(b =>
    b.classList.toggle('active', b.dataset.sub === sub));
  document.querySelectorAll('#tab-word .subpanel').forEach(p =>
    p.classList.toggle('active', p.id === 'wordsub-' + sub));
  // 성경읽기를 처음 열 때 본문을 불러온다 (탭을 안 열면 통신하지 않는다)
  if (sub === 'read' && !State.bibleLoadedOnce) {
    State.bibleLoadedOnce = true;
    loadBibleChapter();
  }
}

// ─── 성경읽기 ────────────────────────────────────────────
// 글씨 크기 3단계 — 어르신이 직접 키울 수 있게
const BIBLE_SIZES = [
  { v: '17px', label: '가' },
  { v: '21px', label: '가' },
  { v: '25px', label: '가' }
];

function renderBibleRead() {
  // 책 선택
  const bookSel = document.getElementById('bible-book');
  if (bookSel && !bookSel.options.length) {
    // 구약/신약을 묶어 보여준다 (66권을 평평하게 늘어놓으면 찾기 어렵다)
    let html = '';
    ['구약', '신약'].forEach(part => {
      const gs = BIBLE.groups.filter(g => g.part === part).map(g => g.g);
      const books = BIBLE.books.filter(b => gs.includes(b.g));
      html += `<optgroup label="${part} (${books.length}권)">` +
        books.map(b => `<option value="${b.n}">${b.t}</option>`).join('') +
        `</optgroup>`;
    });
    bookSel.innerHTML = html;
  }
  if (bookSel) bookSel.value = String(State.bibleBook);

  renderBibleChapterOptions();
  renderBibleStarters();
  renderBibleResume();

  // 번역 출처 표기 — 퍼블릭 도메인이라도 어디서 왔는지 밝힌다
  setEl('bible-credit', `${BIBLE.meta.fullName} · ${BIBLE.meta.license} · ${BIBLE.meta.source}`);
  applyBibleFontSize();
}

function renderBibleChapterOptions() {
  const sel = document.getElementById('bible-chapter');
  const book = BIBLE.books.find(b => b.n === State.bibleBook);
  if (!sel || !book) return;
  // 책이 바뀌면 장 목록을 다시 만든다
  if (sel.dataset.book !== String(book.n)) {
    sel.innerHTML = Array.from({ length: book.c }, (_, i) =>
      `<option value="${i + 1}">${i + 1}장</option>`).join('');
    sel.dataset.book = String(book.n);
  }
  sel.value = String(State.bibleChapter);
}

function renderBibleStarters() {
  const el = document.getElementById('bible-starters');
  if (!el) return;
  el.innerHTML = BIBLE.starters.map(s =>
    `<button class="bible-starter" onclick="openBible(${s.n}, ${s.c})">
      ${s.label} <em>${s.why}</em>
    </button>`).join('');
}

// 마지막에 읽던 곳 — 지금 보고 있는 곳과 다를 때만 보여준다
function renderBibleResume() {
  const el = document.getElementById('bible-resume');
  if (!el) return;
  const last = State.bibleLast;
  if (!last || (last.n === State.bibleBook && last.c === State.bibleChapter)) {
    el.innerHTML = '';
    return;
  }
  const book = BIBLE.books.find(b => b.n === last.n);
  if (!book) { el.innerHTML = ''; return; }
  el.innerHTML =
    `<button class="bible-resume-btn" onclick="openBible(${last.n}, ${last.c})">
      <div class="bible-resume-icon">📖</div>
      <div class="bible-resume-body">
        <div class="bible-resume-label">이어서 읽기</div>
        <div class="bible-resume-where">${book.t} ${last.c}장</div>
      </div>
      <div class="bible-resume-arrow">→</div>
    </button>`;
}

function onBibleBookChange() {
  const sel = document.getElementById('bible-book');
  if (!sel) return;
  State.bibleBook = parseInt(sel.value, 10);
  State.bibleChapter = 1;          // 다른 책으로 옮기면 1장부터
  renderBibleChapterOptions();
  loadBibleChapter();
}

function onBibleChapterChange() {
  const sel = document.getElementById('bible-chapter');
  if (!sel) return;
  State.bibleChapter = parseInt(sel.value, 10);
  loadBibleChapter();
}

// 특정 곳을 열기 (권하는 곳 · 이어읽기에서 호출)
function openBible(n, c) {
  State.bibleBook = n;
  State.bibleChapter = c;
  // 새 장은 1절부터 — 아래에서 다음 장을 눌렀는데 그 자리에 그대로 있으면
  // 새 본문의 중간이 보여 어디가 시작인지 알 수 없다. 넘김은 즉시 올린다.
  // 본문을 그리기 전에 올려서, 그리다 실패해도 위에서 시작하게 한다.
  bibleScrollTop(false);
  const bookSel = document.getElementById('bible-book');
  if (bookSel) bookSel.value = String(n);
  renderBibleChapterOptions();
  loadBibleChapter();
}

// 본문 불러오기 — 받아오는 동안, 실패했을 때를 모두 화면에 알려준다
async function loadBibleChapter() {
  const book = BIBLE.books.find(b => b.n === State.bibleBook);
  const ch = State.bibleChapter;
  const body = document.getElementById('bible-body');
  if (!book || !body) return;

  setEl('bible-title', `${book.t} ${ch}장`);
  updateBibleNavBtns();
  renderBibleResume();

  // 읽던 곳 저장 — 앱을 닫았다 열어도 이어서 읽을 수 있게
  State.bibleLast = { n: book.n, c: ch };
  Store.save('bibleLast', State.bibleLast);
  cloudQueue();
  markBibleRead(book.n, ch);

  const cached = BibleFetch.cached(book.n, ch);
  if (!cached) {
    body.innerHTML = `<div class="bible-state">${book.t} ${ch}장을 불러오는 중입니다…</div>`;
  }

  // 늦게 도착한 응답이 새로 고른 장을 덮어쓰지 않도록 요청에 번호를 매긴다
  const token = (State.bibleReqToken = (State.bibleReqToken || 0) + 1);

  try {
    const verses = await BibleFetch.chapter(book.n, ch);
    if (token !== State.bibleReqToken) return;   // 그 사이 다른 장으로 옮겼다
    // 절마다 하트 — 읽다가 마음에 닿은 절을 그 자리에서 담을 수 있게.
    // 출처는 '요한복음 3:16' 꼴로 만들어 앨범에서 알아볼 수 있게 한다.
    body.innerHTML = verses.map(v =>
      `<div class="bible-verse">
        <div class="bible-verse-num">${v.v}</div>
        <div class="bible-verse-text">${escHtml(v.t)}</div>
        ${favBtnHtml(v.t, `${book.t} ${ch}:${v.v}`, 'bible')}
      </div>`).join('');
    document.getElementById('wordsub-read')?.scrollIntoView({ block: 'nearest' });
  } catch (e) {
    if (token !== State.bibleReqToken) return;
    body.innerHTML =
      `<div class="bible-state">
        본문을 불러오지 못했습니다.<br>인터넷 연결을 확인해 주세요.
        <br><button class="bible-retry" onclick="loadBibleChapter()">다시 시도</button>
      </div>`;
  }
}

// ─── 성경 읽기 진도 ──────────────────────────────────────
// 읽은 장을 하나씩 남긴다. "창세기 12/50장" 같은 진도를 보여줄 수 있고,
// 로그인하면 폰을 바꿔도 이어진다.
function markBibleRead(n, c) {
  const reads = Store.load('bibleReads', []);
  if (reads.some(r => r.n === n && r.c === c)) return;   // 이미 읽은 장
  reads.push({ n, c, at: Date.now() });
  Store.save('bibleReads', reads);
  renderBibleProgress();
  if (typeof Cloud !== 'undefined') Cloud.queueSync();
}

// 이 책을 몇 장까지 읽었는지 보여준다
function renderBibleProgress() {
  const el = document.getElementById('bible-progress');
  if (!el) return;
  const book = BIBLE.books.find(b => b.n === State.bibleBook);
  if (!book) { el.textContent = ''; return; }
  const reads = Store.load('bibleReads', []);
  const done = reads.filter(r => r.n === book.n).length;
  const total = reads.length;
  el.innerHTML =
    `<div class="bible-progress-bar"><span style="width:${Math.round(done / book.c * 100)}%"></span></div>
     <div class="bible-progress-text">${book.t} ${done}/${book.c}장 읽음 · 전체 ${total}/1189장</div>`;
}

function updateBibleNavBtns() {
  const book = BIBLE.books.find(b => b.n === State.bibleBook);
  const prev = document.getElementById('bible-prev');
  const next = document.getElementById('bible-next');
  if (!book) return;
  // 첫 권 1장 / 마지막 권 마지막 장에서만 막는다 (책 사이는 이어서 넘어간다)
  if (prev) prev.disabled = (book.n === 1 && State.bibleChapter === 1);
  if (next) next.disabled = (book.n === 66 && State.bibleChapter === book.c);
}

// 맨 위로 — 스크롤은 창이 아니라 .tab-content 가 갖고 있어서 그걸 올린다
// (창 스크롤만 0 으로 두면 아무 일도 일어나지 않는다)
function bibleScrollTop(smooth) {
  const pane = document.getElementById('tab-word');
  if (pane) {
    if (smooth !== false && typeof pane.scrollTo === 'function') {
      pane.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      pane.scrollTop = 0;
    }
  }
  // 창 자체가 스크롤되는 경우(작은 화면·구형 브라우저)도 함께 올린다
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// 장 넘기기 — 책의 끝에서 다음 책으로 자연스럽게 이어진다
function bibleNextChapter() {
  const book = BIBLE.books.find(b => b.n === State.bibleBook);
  if (!book) return;
  if (State.bibleChapter < book.c) {
    openBible(book.n, State.bibleChapter + 1);
  } else if (book.n < 66) {
    openBible(book.n + 1, 1);
  }
}

function biblePrevChapter() {
  const book = BIBLE.books.find(b => b.n === State.bibleBook);
  if (!book) return;
  if (State.bibleChapter > 1) {
    openBible(book.n, State.bibleChapter - 1);
  } else if (book.n > 1) {
    const prev = BIBLE.books.find(b => b.n === book.n - 1);
    if (prev) openBible(prev.n, prev.c);
  }
}

// 글씨 크기 — 누를 때마다 보통 → 크게 → 아주 크게 → 보통
function cycleBibleFontSize() {
  State.bibleFontIdx = ((State.bibleFontIdx || 0) + 1) % BIBLE_SIZES.length;
  Store.save('bibleFontIdx', State.bibleFontIdx);
  applyBibleFontSize();
}

function applyBibleFontSize() {
  const idx = State.bibleFontIdx || 0;
  const body = document.getElementById('bible-body');
  if (body) body.style.setProperty('--v', BIBLE_SIZES[idx].v);
  // 버튼에 지금 단계를 보여준다 — 글자 수로 크기를 짐작할 수 있게
  const btn = document.getElementById('bible-size-btn');
  if (btn) {
    const names = ['보통', '크게', '아주 크게'];
    btn.textContent = '글씨 ' + names[idx];
  }
}

function prevVerse() {
  State.currentVerseIdx = (State.currentVerseIdx - 1 + DATA.dailyVerses.length) % DATA.dailyVerses.length;
  renderWord(); renderHome();
}
function nextVerse() {
  State.currentVerseIdx = (State.currentVerseIdx + 1) % DATA.dailyVerses.length;
  renderWord(); renderHome();
}

// ─── Hymn ────────────────────────────────────────────────
let hymnFilter = 'all';

function filterHymns(filter) {
  hymnFilter = filter;
  document.querySelectorAll('#hymn-filter-chips .chip').forEach(c => {
    c.classList.toggle('active', c.dataset.filter === filter);
  });
  renderHymnList();
}

function renderHymn() {
  const hymn = DATA.hymns[State.currentHymnIdx];
  setEl('hymn-title', hymn.title);
  setEl('hymn-artist', (hymn.tag ? '[' + hymn.tag + '] ' : '') + hymn.artist);
  setEl('hymn-lyrics', hymn.lyrics);
  setEl('hymn-note', hymn.note);
  updatePlayBtn();
  renderHymnList();
}

function renderHymnList() {
  const list = document.getElementById('hymn-list');
  if (!list) return;
  // 필터는 분류(CCM/찬송가)와 만든 이(손경민/예람워십) 두 가지로 걸린다.
  // 손경민·예람워십 곡도 tag 는 'CCM' 이므로 artist 까지 함께 본다.
  const filtered = DATA.hymns.filter(h =>
    hymnFilter === 'all' || h.tag === hymnFilter || (h.artist || '').includes(hymnFilter)
  );
  list.innerHTML = filtered.map(h => {
    const realIdx = DATA.hymns.indexOf(h);
    const playing = realIdx === State.currentHymnIdx;
    return `<div class="hymn-row ${playing ? 'playing' : ''}" onclick="selectHymn(${realIdx})">
      <div class="hymn-row-num">${realIdx + 1}</div>
      <div class="hymn-row-body">
        <div class="hymn-row-title">${h.title}</div>
        <div class="hymn-row-note">${h.tag ? '[' + h.tag + '] ' : ''}${h.note}</div>
      </div>
      <div class="hymn-row-badge">${playing ? '🎵' : ''}</div>
    </div>`;
  }).join('');
}

function selectHymn(idx) {
  State.currentHymnIdx = idx;
  State.isPlaying = false;
  renderHymn();
}
function prevHymn() { selectHymn((State.currentHymnIdx - 1 + DATA.hymns.length) % DATA.hymns.length); }
function nextHymn() { selectHymn((State.currentHymnIdx + 1) % DATA.hymns.length); }

function togglePlay() {
  const hymn = DATA.hymns[State.currentHymnIdx];
  const query = encodeURIComponent(hymn.youtubeSearch || hymn.title + ' 찬양');
  window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  State.isPlaying = !State.isPlaying;
  updatePlayBtn();
  State.lastActivity = Date.now();
}

function updatePlayBtn() {
  const btn = document.getElementById('play-btn');
  if (btn) btn.textContent = State.isPlaying ? '⏸' : '▶';
}

// ─── Prayer ──────────────────────────────────────────────
function renderPrayer() {
  const grid = document.getElementById('prayer-type-grid');
  if (grid) {
    grid.innerHTML = DATA.prayerGuides.map(g =>
      `<div class="prayer-type-card ${State.selectedPrayerType === g.type ? 'selected' : ''}" onclick="selectPrayerType('${g.type}')">
        <div class="prayer-type-icon">${g.icon}</div>
        <div class="prayer-type-label">${g.title}</div>
      </div>`
    ).join('');
  }
  renderPrayerGuide();

  const saved = document.getElementById('prayer-saved-list');
  if (saved) {
    if (!State.prayers.length) {
      saved.innerHTML = '<div class="empty"><div class="empty-icon">🙏</div><div class="empty-text">아직 기도제목이 없어요</div></div>';
    } else {
      saved.innerHTML = State.prayers.slice(-10).reverse().map(p => {
        const guide = DATA.prayerGuides.find(g => g.type === p.type);
        return `<div class="prayer-saved-row">
          <div class="prayer-saved-meta">${formatDate(new Date(p.date))} · ${guide?.title || '기도'}</div>
          <div class="prayer-saved-text">${escHtml(p.text)}</div>
        </div>`;
      }).join('');
    }
  }
}

function selectPrayerType(type) {
  State.selectedPrayerType = type;
  document.querySelectorAll('.prayer-type-card').forEach(el => {
    el.classList.toggle('selected', el.onclick?.toString().includes(`'${type}'`));
  });
  renderPrayerGuide();
}

function renderPrayerGuide() {
  const el = document.getElementById('prayer-guide-box');
  if (!el) return;
  const guide = DATA.prayerGuides.find(g => g.type === State.selectedPrayerType);
  if (!guide) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="prayer-guide-box">
    ${guide.guide.map(line => `<div class="prayer-guide-line">${line}</div>`).join('')}
  </div>`;
}

function savePrayer() {
  // 받아쓰는 중이면 먼저 멈춘다 — 켜 둔 채 저장하면 저장 뒤에도 빈 칸에
  // 계속 받아적혀서 어르신은 왜 글자가 생기는지 알 수 없다
  if (typeof Voice !== 'undefined' && Voice.listening()) Voice.stop();
  const ta = document.getElementById('prayer-textarea');
  const text = (ta?.value || '').trim();
  if (!text) { showToast('기도 내용을 입력해 주세요 🙏'); return; }
  State.prayers.push({ cid: newClientId(), date: new Date().toISOString(), type: State.selectedPrayerType || 'free', text });
  Store.save('prayers', State.prayers);
  cloudQueue();
  if (ta) ta.value = '';
  renderPrayer();
  // 방금 저장한 기도가 접힌 카드에 가려지지 않도록 펼친다
  revealCard(document.getElementById('prayer-saved-list'));
  updateCollapseHints();
  showToast('기도제목이 저장되었습니다 🙏');
}

// ─── Gratitude ───────────────────────────────────────────
function renderGratitude() {
  const streak = calcStreak();
  setEl('streak-num', streak.toString());
  setEl('streak-label', streak > 0 ? `일째 감사 중 🔥` : `오늘 첫 감사를 써볼까요?`);

  const history = document.getElementById('gratitude-history');
  if (!history) return;
  if (!State.gratitude.length) {
    history.innerHTML = '<div class="empty"><div class="empty-icon">💛</div><div class="empty-text">감사한 일을 적어보세요<br>범사에 감사하라 · 살전 5:18</div></div>';
  } else {
    history.innerHTML = State.gratitude.slice(-14).reverse().map(g =>
      `<div class="g-history-day">
        <div class="g-history-date">${formatDate(new Date(g.date))}</div>
        ${(g.items || []).filter(Boolean).map(item =>
          `<div class="g-history-item">${escHtml(item)}</div>`
        ).join('')}
      </div>`
    ).join('');
  }
}

function saveGratitude() {
  if (typeof Voice !== 'undefined' && Voice.listening()) Voice.stop();
  const items = [1,2,3].map(n => (document.getElementById(`g-input-${n}`)?.value || '').trim()).filter(Boolean);
  if (!items.length) { showToast('감사한 일을 하나라도 써주세요 💛'); return; }
  const today = todayKey();
  const idx = State.gratitude.findIndex(g => g.date === today);
  const entry = { date: today, items };
  if (idx >= 0) State.gratitude[idx] = entry; else State.gratitude.push(entry);
  Store.save('gratitude', State.gratitude);
  cloudQueue();
  [1,2,3].forEach(n => { const el = document.getElementById(`g-input-${n}`); if (el) el.value = ''; });
  renderGratitude(); renderHome();
  revealCard(document.getElementById('gratitude-history'));
  updateCollapseHints();
  showToast('감사 일기를 저장했습니다 💛');
  setTimeout(() => showCompanionBanner('praise'), 1200);
}

// ─── 임마누엘 일기 ────────────────────────────────────────
// '하나님이 우리와 함께 계시다'(임마누엘). 감사일기가 무엇을 감사했는지
// 적는 것이라면, 이건 주님이 지금 나를 어떻게 보고 계신지를 순서대로
// 따라가며 적는다 (Life Model Works 의 Immanuel Journaling).
//
// 어르신 입력 부담을 줄이려고 단계마다 예시를 두고, 한 칸만 적어도
// 저장되게 했다. 빈 칸은 아예 저장하지 않는다.

// 임마누엘 일기 글씨 크기 — 역사 이야기와 같은 3단계.
// 다섯 칸을 다 읽어야 하는 화면이라 어르신이 직접 키울 수 있어야 한다.
const IMM_SIZES = [
  { v: '14px', label: '보통' },
  { v: '17px', label: '크게' },
  { v: '20px', label: '아주 크게' }
];

function cycleImmFontSize() {
  State.immFontIdx = ((State.immFontIdx || 0) + 1) % IMM_SIZES.length;
  Store.save('immFontIdx', State.immFontIdx);
  applyImmFontSize();
}

function applyImmFontSize() {
  const size = IMM_SIZES[State.immFontIdx || 0] || IMM_SIZES[0];
  // 입력칸·질문·기록을 한꺼번에 키운다. --imm-fs 는 CSS 가 읽어 간다
  const pane = document.getElementById('tab-gratitude');
  if (pane) pane.style.setProperty('--imm-fs', size.v);
  const btn = document.getElementById('imm-size-btn');
  if (btn) btn.textContent = '글씨 ' + size.label;
}

// 오늘 이미 쓴 일기가 있으면 그것을 이어서 고칠 수 있게 불러온다
function todayImmanuel() {
  const today = todayKey();
  return State.immanuel.find(e => e.date === today) || null;
}

function renderImmanuel() {
  const steps = DATA.immanuelSteps || [];
  const wrap = document.getElementById('imm-steps');

  // 곁에 두는 말씀 — 날마다 바뀌게 (감사일기 스트릭처럼 날짜로 고른다)
  const verses = DATA.immanuelVerses || [];
  if (verses.length) {
    const v = verses[getTodayVerseIdx() % verses.length];
    setPhrase('imm-verse-text', '"' + v.text + '"');
    setEl('imm-verse-ref', v.ref);
  }

  // 입력칸은 한 번만 그린다 — 다시 그리면 쓰던 글이 날아간다
  if (wrap && !wrap.dataset.built) {
    wrap.dataset.built = '1';
    wrap.innerHTML = steps.map((s, i) => `
      <div class="imm-step">
        <div class="imm-step-head">
          <span class="imm-step-num">${i + 1}</span>
          <span class="imm-step-icon">${s.icon}</span>
          <span class="imm-step-title">${escHtml(s.title)}</span>
        </div>
        <div class="imm-step-ask">${escHtml(s.ask)}</div>
        <textarea class="imm-input" id="imm-input-${s.key}" rows="2"
          placeholder="${escHtml(s.hint)}"></textarea>
      </div>`).join('');

    // 다섯 칸에 말로 쓰기를 붙인다 — 칸을 방금 만들었으니 여기서 해야 한다
    if (typeof attachAllMics === 'function') attachAllMics();

    // 오늘 쓴 게 있으면 채워 둔다 (이어서 고쳐 쓰게)
    const today = todayImmanuel();
    if (today) {
      steps.forEach(s => {
        const el = document.getElementById('imm-input-' + s.key);
        if (el && today.answers && today.answers[s.key]) el.value = today.answers[s.key];
      });
      // 오늘 붙여 둔 사진도 되살린다
      if (today.photos && today.photos.length) {
        immPendingPhotos = [...today.photos];
        renderImmPhotoPreview().catch(() => {});
      }
    }
  }

  // 사진을 못 쓰는 브라우저에서는 사진 칸을 아예 숨긴다 —
  // 눌러도 아무 일이 없는 버튼을 두면 고장난 줄 아신다
  const photoBox = document.getElementById('imm-photo-box');
  if (photoBox && !Photos.available()) photoBox.style.display = 'none';

  renderImmanuelHistory();
  applyImmFontSize();
}

function renderImmanuelHistory() {
  const hist = document.getElementById('imm-history');
  if (!hist) return;
  const steps = DATA.immanuelSteps || [];
  const byKey = {};
  steps.forEach(s => { byKey[s.key] = s; });

  if (!State.immanuel.length) {
    hist.innerHTML = '<div class="empty"><div class="empty-icon">🌿</div>'
      + '<div class="empty-text">주님과 함께한 하루를 적어보세요<br>'
      + '임마누엘 · 하나님이 우리와 함께 계시다</div></div>';
    return;
  }

  // 최근 14개, 새 것부터
  hist.innerHTML = State.immanuel.slice(-14).reverse().map(e => {
    const rows = Object.entries(e.answers || {})
      .filter(([, v]) => v && v.trim())
      // 저장 순서가 아니라 단계 순서대로 보여준다
      .sort((a, b) => steps.findIndex(s => s.key === a[0]) - steps.findIndex(s => s.key === b[0]))
      .map(([k, v]) => {
        const s = byKey[k];
        return `<div class="imm-hist-row">
          <div class="imm-hist-label">${s ? s.icon + ' ' + escHtml(s.title) : escHtml(k)}</div>
          <div class="imm-hist-text">${escHtml(v)}</div>
        </div>`;
      }).join('');
    // 사진은 자리만 심어 두고 아래에서 따로 붙인다 —
    // IndexedDB 읽기는 비동기라 innerHTML 문자열 안에서 못 기다린다
    const ids = e.photos || [];
    const photo = ids.length
      ? `<div class="imm-photo-grid">${ids.map(id =>
          `<div class="imm-hist-photo" data-photo="${escHtml(id)}"></div>`).join('')}</div>`
      : '';
    return `<div class="imm-hist-day">
      <div class="imm-hist-date">${formatDate(new Date(e.date))}</div>
      ${rows}
      ${photo}
    </div>`;
  }).join('');

  attachHistoryPhotos(hist);
}

// 기록 목록의 사진을 하나씩 붙인다.
// 만든 blob 주소는 다시 그릴 때 모두 풀어 준다 (안 풀면 메모리가 쌓인다).
let immHistUrls = [];
async function attachHistoryPhotos(hist) {
  immHistUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) {} });
  immHistUrls = [];
  if (!Photos.available()) return;

  for (const slot of hist.querySelectorAll('.imm-hist-photo[data-photo]')) {
    const url = await Photos.url(slot.dataset.photo).catch(() => null);
    if (!url) { slot.remove(); continue; }   // 사진이 사라졌으면 빈 칸을 없앤다
    immHistUrls.push(url);
    const img = document.createElement('img');
    img.className = 'imm-photo';
    img.src = url;
    img.alt = '그날의 사진';
    img.loading = 'lazy';
    slot.appendChild(img);
  }
}

// ─── 임마누엘 일기의 사진 ─────────────────────────────────
// 글로 적기 어려운 날에도 사진으로 하루를 남길 수 있게. 하루 다섯 장까지.
// 사진은 IndexedDB(Photos)에 담고 일기에는 그 id 만 적는다 —
// localStorage 는 앱 전체가 5MB 라 사진을 넣으면 그 한 장에 한도가 찬다.
//
// 다섯 장이면 하루 대략 1MB, 매일 써도 1년에 350MB 남짓이다. 폰에는 여유가
// 있지만 무한정은 아니라 상한을 둔다 — 상한이 없으면 앨범을 통째로 넣는
// 일이 생기고, 그러면 목록을 열 때마다 느려진다.
const IMM_PHOTO_MAX = 5;

// 아직 저장 안 한 채로 골라 둔 사진들 (저장 버튼을 누를 때 일기에 붙는다)
let immPendingPhotos = [];
// 화면에 띄운 blob 주소들 — 다시 그릴 때마다 풀어야 메모리가 안 샌다
let immPreviewUrls = [];

async function pickImmPhoto(input) {
  const files = [...(input?.files || [])];
  if (input) input.value = '';        // 같은 사진을 다시 골라도 change 가 뜨게
  if (!files.length) return;

  if (!Photos.available()) {
    showToast('이 브라우저에서는 사진을 넣을 수 없습니다');
    return;
  }

  const room = IMM_PHOTO_MAX - immPendingPhotos.length;
  if (room <= 0) {
    showToast(`사진은 ${IMM_PHOTO_MAX}장까지 넣을 수 있어요`);
    return;
  }

  // 한 번에 여러 장을 고를 수 있으니, 남은 자리만큼만 받는다
  const take = files.filter(f => /^image\//.test(f.type)).slice(0, room);
  if (!take.length) { showToast('사진 파일만 넣을 수 있어요'); return; }
  const overflow = files.length - take.length;

  showToast(take.length > 1 ? `사진 ${take.length}장을 준비하고 있어요...` : '사진을 준비하고 있어요...');

  let added = 0, bytes = 0, tooBig = 0, failed = 0;
  for (const file of take) {
    try {
      // 폰에서 미리 줄여 담는다 (원본 4MB → 대략 200KB)
      const saved = await Photos.put(file);
      immPendingPhotos.push(saved.id);
      added++; bytes += saved.size;
    } catch (e) {
      if (e && e.message === 'TOO_BIG') tooBig++;
      else { failed++; console.warn('[photos] 담기 실패', e); }
    }
  }

  await renderImmPhotoPreview();

  if (added) {
    let msg = `사진 ${added}장을 넣었어요 (${formatBytes(bytes)})`;
    // 못 담은 게 있으면 조용히 넘기지 않고 알려준다
    if (overflow) msg += ` · ${IMM_PHOTO_MAX}장까지만 담겨요`;
    if (tooBig) msg += ` · ${tooBig}장은 너무 커요`;
    if (failed) msg += ` · ${failed}장 실패`;
    showToast(msg);
  } else if (tooBig) showToast('사진이 너무 커요. 다른 사진을 골라주세요');
  else showToast('사진을 넣지 못했어요');
}

async function renderImmPhotoPreview() {
  const box = document.getElementById('imm-photo-preview');
  const btn = document.getElementById('imm-photo-btn');
  if (!box) return;

  // 이전 주소들을 반드시 풀어 준다
  immPreviewUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) {} });
  immPreviewUrls = [];

  const ids = immPendingPhotos;
  if (!ids.length) {
    box.innerHTML = '';
    if (btn) btn.textContent = '📷 사진 고르기';
    return;
  }

  // 사진이 사라진 id 는 조용히 걸러낸다
  const items = [];
  for (const id of ids) {
    const url = await Photos.url(id).catch(() => null);
    if (url) { immPreviewUrls.push(url); items.push({ id, url }); }
  }
  immPendingPhotos = items.map(i => i.id);

  box.innerHTML = `<div class="imm-photo-grid">${items.map(it => `
    <div class="imm-photo-wrap">
      <img class="imm-photo" src="${it.url}" alt="오늘의 사진"/>
      <button class="imm-photo-del" onclick="removeImmPhoto('${it.id}')"
        aria-label="이 사진 빼기">✕</button>
    </div>`).join('')}</div>
    <div class="imm-photo-size">${items.length} / ${IMM_PHOTO_MAX}장</div>`;

  if (btn) {
    const full = items.length >= IMM_PHOTO_MAX;
    btn.textContent = full ? `📷 ${IMM_PHOTO_MAX}장까지 넣었어요` : '📷 사진 더 고르기';
    btn.disabled = full;
  }
}

async function removeImmPhoto(id) {
  if (!id) return;
  // 이미 저장된 일기에 붙은 사진이면 저장소에서 지우지 않는다 —
  // 저장 버튼을 누르기 전에 마음을 바꿀 수 있어야 한다
  const today = todayImmanuel();
  const kept = today?.photos || [];
  if (!kept.includes(id)) await Photos.remove(id).catch(() => {});

  immPendingPhotos = immPendingPhotos.filter(p => p !== id);
  await renderImmPhotoPreview();
  showToast('사진을 빼냈어요');
}

function saveImmanuel() {
  if (typeof Voice !== 'undefined' && Voice.listening()) Voice.stop();
  const steps = DATA.immanuelSteps || [];
  const answers = {};
  steps.forEach(s => {
    const v = (document.getElementById('imm-input-' + s.key)?.value || '').trim();
    if (v) answers[s.key] = v;
  });

  // 사진만 넣어도 하루가 남는다 — 글이 없어도 저장을 막지 않는다
  if (!Object.keys(answers).length && !immPendingPhotos.length) {
    showToast('한 칸이라도 적거나 사진을 넣어주세요 🌿');
    return;
  }

  // 하루에 하나 — 같은 날 다시 쓰면 덮어쓴다 (감사일기와 같은 규칙)
  const today = todayKey();
  const idx = State.immanuel.findIndex(e => e.date === today);
  const prev = idx >= 0 ? State.immanuel[idx] : null;
  const entry = {
    date: today,
    cid: prev?.cid || newClientId(),
    answers,
    photos: [...immPendingPhotos].slice(0, IMM_PHOTO_MAX)
  };
  // 빼낸 사진은 저장소에서도 지운다 — 안 그러면 폰에 계속 쌓인다
  (prev?.photos || []).forEach(id => {
    if (!entry.photos.includes(id)) Photos.remove(id).catch(() => {});
  });
  if (idx >= 0) State.immanuel[idx] = entry; else State.immanuel.push(entry);

  Store.save('immanuel', State.immanuel);
  cloudQueue();
  renderImmanuelHistory();
  revealCard(document.getElementById('imm-history'));
  updateCollapseHints();
  showToast('임마누엘 일기를 저장했습니다 🌿');
}

// ─── Album ───────────────────────────────────────────────
function renderAlbum() {
  setEl('album-people-count', State.memories.people.length + '명');
  setEl('album-verse-count', State.memories.myVerses.length + '개');
  // 추억의 게임 — games.js 가 없어도 앨범 탭은 그대로 열려야 한다
  if (typeof renderGames === 'function') renderGames();
}

function openMemoryModal(type) {
  const overlay = document.getElementById('memory-modal');
  const title = document.getElementById('memory-modal-title');
  const body = document.getElementById('memory-modal-body');
  if (!overlay) return;

  if (type === 'people') {
    title.textContent = '소중한 분들 👨‍👩‍👧';
    body.innerHTML = `
      <input class="modal-input" id="m-person-name" placeholder="이름 (예: 김철수)"/>
      <input class="modal-input" id="m-person-rel" placeholder="관계 (예: 큰아들, 담임목사님)"/>
      <textarea class="modal-input" id="m-person-note" placeholder="기도제목 또는 메모" rows="3" style="resize:none"></textarea>
      <button class="btn-primary" style="margin-bottom:16px" onclick="savePersonMemory()">저장하기</button>
      ${State.memories.people.length === 0
        ? '<div class="empty"><div class="empty-icon">👨‍👩‍👧</div><div class="empty-text">소중한 분들의 이름을 기억해요</div></div>'
        : State.memories.people.map((p,i) =>
            `<div class="modal-saved-item">
              <div class="modal-saved-name">${escHtml(p.name)} <span style="color:var(--gold)">${escHtml(p.relation)}</span></div>
              ${p.note ? `<div class="modal-saved-sub">${escHtml(p.note)}</div>` : ''}
              <button class="modal-del-btn" onclick="removePerson(${i})">삭제</button>
            </div>`
          ).join('')}`;
  } else if (type === 'verses') {
    title.textContent = '내가 좋아하는 말씀 📖';
    // 담아 둔 말씀은 여러 번 되읽는 글이라 글씨 크기를 고를 수 있어야 한다.
    // 목록이 비어 있을 때는 버튼을 숨긴다 — 키울 게 없으니 혼란만 준다.
    const hasVerses = State.memories.myVerses.length > 0;
    body.innerHTML = `
      <textarea class="modal-input" id="m-verse-text" placeholder="말씀을 적어보세요" rows="3" style="resize:none"></textarea>
      <input class="modal-input" id="m-verse-ref" placeholder="출처 (예: 요한복음 3:16)"/>
      <button class="btn-primary" style="margin-bottom:16px" onclick="saveVerseMemory()">저장하기</button>
      ${hasVerses ? `<div class="story-size-row">
        <button class="bible-size-btn" id="fav-size-btn" onclick="cycleFavFontSize()">글씨 보통</button>
      </div>` : ''}
      <div id="fav-verse-list">
      ${!hasVerses
        ? '<div class="empty"><div class="empty-icon">📖</div><div class="empty-text">마음에 새긴 말씀을 기록해 두세요</div></div>'
        : State.memories.myVerses.map((v,i) =>
            `<div class="modal-saved-item">
              <div class="fav-verse-text">${escHtml(v.text)}</div>
              <div class="fav-verse-ref">${escHtml(v.ref)}</div>
              <button class="modal-del-btn" onclick="removeVerse(${i})">삭제</button>
            </div>`
          ).join('')}
      </div>`;
    applyFavFontSize();
  } else if (type === 'faith') {
    title.textContent = '나의 신앙 이야기 ✝️';
    body.innerHTML = `
      <input class="modal-input" id="m-faith-baptism" placeholder="세례일 (예: 1985년 봄)" value="${escHtml(State.memories.myFaith.baptism)}"/>
      <input class="modal-input" id="m-faith-church" placeholder="교회 이름" value="${escHtml(State.memories.myFaith.church)}"/>
      <textarea class="modal-input" id="m-faith-note" placeholder="나의 신앙 이야기, 감사한 기억들..." rows="5" style="resize:none">${escHtml(State.memories.myFaith.note)}</textarea>
      <button class="btn-primary" onclick="saveFaithMemory()">저장하기</button>`;
  }
  overlay.classList.add('open');
}

function closeMemoryModal() { document.getElementById('memory-modal')?.classList.remove('open'); }

// ─── 좋아하는 말씀 목록 글씨 크기 ─────────────────────────
// 담아 둔 말씀을 다시 읽는 곳이라 목록 글씨가 작으면 담아 둔 뜻이 없다.
// 3단계는 다른 곳과 같게 맞췄다.
const FAV_SIZES = [
  { v: '14px', label: '보통' },
  { v: '18px', label: '크게' },
  { v: '22px', label: '아주 크게' }
];

function cycleFavFontSize() {
  State.favFontIdx = ((State.favFontIdx || 0) + 1) % FAV_SIZES.length;
  Store.save('favFontIdx', State.favFontIdx);
  applyFavFontSize();
}

function applyFavFontSize() {
  const size = FAV_SIZES[State.favFontIdx || 0] || FAV_SIZES[0];
  // 목록을 감싼 곳에 심어 두면 항목이 몇 개든 한 번에 적용된다
  const list = document.getElementById('fav-verse-list');
  if (list) list.style.setProperty('--fav-fs', size.v);
  const btn = document.getElementById('fav-size-btn');
  if (btn) btn.textContent = '글씨 ' + size.label;
}

function savePersonMemory() {
  const name = (document.getElementById('m-person-name')?.value || '').trim();
  const relation = (document.getElementById('m-person-rel')?.value || '').trim();
  const note = (document.getElementById('m-person-note')?.value || '').trim();
  if (!name) { showToast('이름을 입력해 주세요'); return; }
  State.memories.people.push({ name, relation, note });
  Store.save('memories', State.memories);
  cloudQueue();
  renderAlbum(); openMemoryModal('people');
  showToast(name + '님을 기억에 저장했습니다 💛');
}
function removePerson(idx) {
  State.memories.people.splice(idx, 1);
  Store.save('memories', State.memories);
  cloudQueue();
  renderAlbum(); openMemoryModal('people');
}
function saveVerseMemory() {
  const text = (document.getElementById('m-verse-text')?.value || '').trim();
  const ref = (document.getElementById('m-verse-ref')?.value || '').trim();
  if (!text) { showToast('말씀을 입력해 주세요'); return; }
  State.memories.myVerses.push({ text, ref, at: Date.now() });
  Store.save('memories', State.memories);
  cloudQueue();
  renderAlbum(); openMemoryModal('verses');
  // 읽기 화면에 같은 구절의 하트가 떠 있으면 함께 켜준다
  refreshFavButtons();
  showToast('말씀이 저장되었습니다 📖');
}
function removeVerse(idx) {
  State.memories.myVerses.splice(idx, 1);
  Store.save('memories', State.memories);
  cloudQueue();
  renderAlbum(); openMemoryModal('verses');
  refreshFavButtons();
}
function saveFaithMemory() {
  State.memories.myFaith = {
    baptism: (document.getElementById('m-faith-baptism')?.value || '').trim(),
    church: (document.getElementById('m-faith-church')?.value || '').trim(),
    note: (document.getElementById('m-faith-note')?.value || '').trim()
  };
  Store.save('memories', State.memories);
  cloudQueue();
  closeMemoryModal();
  showToast('신앙 이야기가 저장되었습니다 ✝️');
}

// ─── Companion (동반자 시스템) ───────────────────────────
function startCompanion() {
  requestNotificationPermission();

  // 시간대별 첫 인사
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 9) setTimeout(() => showCompanionBanner('morning'), 1800);
  else if (hour >= 11 && hour < 13) setTimeout(() => showCompanionBanner('noon'), 1800);
  else if (hour >= 18 && hour < 21) setTimeout(() => showCompanionBanner('evening'), 1800);

  // 5분 idle → 말씀 전체화면
  setInterval(() => {
    if (Date.now() - State.lastActivity > 5 * 60 * 1000 && document.visibilityState === 'visible') {
      showFullscreenVerse();
      State.lastActivity = Date.now();
    }
  }, 60000);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') State.lastActivity = Date.now();
  });
}

function showCompanionBanner(trigger) {
  const msg = DATA.companionMessages.find(m => m.trigger === trigger);
  if (!msg) return;
  const text = msg.text.replace('{name}', State.user?.name || '');
  const banner = document.getElementById('companion-banner');
  const bannerText = document.getElementById('companion-banner-text');
  const bannerAction = document.getElementById('companion-banner-action');
  if (!banner) return;
  bannerText.textContent = text;
  if (bannerAction) bannerAction.textContent = msg.action;
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 8000);
}

function dismissCompanion() { document.getElementById('companion-banner')?.classList.remove('show'); }

function doCompanionAction() {
  const action = document.getElementById('companion-banner-action')?.textContent || '';
  dismissCompanion();
  if (action.includes('말씀')) switchTab('word');
  else if (action.includes('기도')) switchTab('prayer');
  else if (action.includes('찬양')) switchTab('hymn');
  else if (action.includes('감사')) switchTab('gratitude');
}

function showFullscreenVerse() {
  const verse = DATA.dailyVerses[State.currentVerseIdx];
  setEl('fullscreen-verse-text', verse.text);
  setEl('fullscreen-verse-ref', verse.ref);
  document.getElementById('fullscreen-verse')?.classList.add('show');
}
function closeFullscreen() {
  document.getElementById('fullscreen-verse')?.classList.remove('show');
  State.lastActivity = Date.now();
}

async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') await Notification.requestPermission();
}

function registerSW() {
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// ─── Language ────────────────────────────────────────────
function t(key) {
  return (DATA.ui[State.lang] || DATA.ui.ko)[key] || key;
}

function toggleLang() {
  State.lang = State.lang === 'ko' ? 'en' : 'ko';
  Store.save('lang', State.lang);
  applyLangUI();
  renderAll();
}

function applyLangUI() {
  const ui = DATA.ui[State.lang];
  // 언어 토글 버튼 텍스트
  const btn = document.getElementById('lang-toggle-btn');
  if (btn) btn.textContent = ui.langToggle;
  const obBtn = document.getElementById('ob-lang-btn');
  if (obBtn) obBtn.textContent = ui.langToggle;

  // 탭 라벨
  const tabLabels = ['home','word','hymn','prayer','gratitude','album'];
  const uiKeys = ['tabHome','tabWord','tabHymn','tabPrayer','tabGratitude','tabAlbum'];
  tabLabels.forEach((tab, i) => {
    const el = document.querySelector(`.tab-btn[data-tab="${tab}"] .tab-label`);
    if (el) el.textContent = ui[uiKeys[i]];
  });

  // 온보딩 텍스트
  setEl('ob-title-el', ui.appName);
  setEl('ob-sub-el', ui.appSub);
  // obVerse 는 \n 을 <br> 로 살려야 두 줄로 보인다 (textContent 는 개행을 무시)
  const obVerseEl = document.getElementById('ob-verse-el');
  if (obVerseEl) obVerseEl.innerHTML = escHtml(ui.obVerse).replace(/\n/g, '<br>');
  setEl('ob-verse-ref-el', ui.obVerseRef);
  setEl('ob-name-label-el', ui.obNameLabel);
  const nameInput = document.getElementById('onboard-name');
  if (nameInput) nameInput.placeholder = ui.obNamePlaceholder;
  const startBtn = document.getElementById('btn-start');
  if (startBtn) startBtn.textContent = ui.obStartBtn;

  // 연령대 라벨 + 4개 버튼
  setEl('ob-age-label-el', ui.obAgeLabel);
  const ageKeys = { youth: 'obAgeYouth', young: 'obAgeYoung', middle: 'obAgeMiddle', senior: 'obAgeSenior' };
  Object.entries(ageKeys).forEach(([age, key]) => {
    const btn = document.querySelector(`.ob-age-btn[data-age="${age}"]`);
    if (!btn) return;
    const nameEl = btn.querySelector('.ob-age-name');
    const rangeEl = btn.querySelector('.ob-age-range');
    if (nameEl) nameEl.textContent = ui[key];
    if (rangeEl) rangeEl.textContent = ui[key + 'Range'];
  });
}

// ─── Utils ───────────────────────────────────────────────
function getTodayVerseIdx() {
  const start = new Date('2024-01-01');
  return Math.floor((Date.now() - start) / 86400000) % DATA.dailyVerses.length;
}
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  const days = ['일','월','화','수','목','금','토'];
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}
function calcStreak() {
  if (!State.gratitude.length) return 0;
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (State.gratitude.find(g => g.date === key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}
function setEl(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }

// 문구를 "끊어도 되는 자리"에서만 줄바꿈되게 넣는다.
//
// 데이터의 줄바꿈(\n)이 끊어도 되는 자리다. 그 사이의 낱말들은 nbsp 로 묶어
// 통째로 움직이게 한다. 이렇게 하면 '오늘도 주님이 함께하십니다' 가
// '오늘도 주님이 함 / 께하십니다' 처럼 낱말 중간에서 갈리는 일이 없고,
// 좁은 폰에서는 '오늘도' / '주님이 함께하십니다' 로 뜻 단위로 접힌다.
//
// 덩어리 끝의 그림글자는 묶지 않는다 — 280px 처럼 아주 좁은 폰에서
// 덩어리가 한 줄보다 넓어지면 낱말 중간이 갈려 버리기 때문이다.
function setPhrase(id, text) {
  const groups = String(text == null ? '' : text).split('\n');
  setEl(id, groups.map(nbspKeepEmoji).join(' '));
}
function escHtml(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

// ─── Global events ───────────────────────────────────────
function bindGlobalEvents() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
  document.getElementById('companion-trigger')?.addEventListener('click', () => {
    const triggers = ['morning','lonely','praise','evening'];
    showCompanionBanner(triggers[Math.floor(Math.random() * triggers.length)]);
  });
  document.getElementById('memory-modal')?.addEventListener('click', function(e) {
    if (e.target === this) closeMemoryModal();
  });
  document.getElementById('game-modal')?.addEventListener('click', function(e) {
    if (e.target === this && typeof closeGame === 'function') closeGame();
  });
  document.getElementById('fullscreen-verse')?.addEventListener('click', closeFullscreen);
}

// ══════════════════════════════════════════════════════════
// 성경 역사 흐름 탭 — Bible Story Tab
// ══════════════════════════════════════════════════════════

const StoryState = {
  currentEraIdx: 0,
  readEras: new Set(),   // 읽은 시대 추적
  ttsActive: false,
  ttsUtterance: null,
  ttsSpeed: 0.8,
  // 읽어주기는 문장 조각으로 나눠 이어 읽는다 (폰의 길이 제한 때문)
  ttsQueue: [],
  ttsIndex: 0,
  ttsPaused: false,
  storyFontIdx: 0,       // 역사 이야기 글씨 크기 단계
};

// ─── 스토리 탭 전체 렌더 ─────────────────────────────────
function renderStory() {
  renderEraChips();
  renderTimelineNav();
  renderEraContent(StoryState.currentEraIdx);
  updateStoryProgress();
}

// ─── 시대 칩 (가로 스크롤) ───────────────────────────────
function renderEraChips() {
  const el = document.getElementById('era-scroll');
  if (!el) return;
  el.innerHTML = BIBLE_STORY.eras.map((era, i) => `
    <button class="era-chip ${i === StoryState.currentEraIdx ? 'active' : ''}"
      onclick="selectEra(${i})">
      <div class="era-chip-icon">${era.icon}</div>
      <div class="era-chip-label">${era.era}</div>
      <div class="era-chip-period">${era.period.replace('기원전 ','BC ').replace('기원후 ','AD ')}</div>
    </button>
  `).join('');
  // 활성 칩 스크롤 중앙으로
  setTimeout(() => {
    const activeChip = el.querySelector('.era-chip.active');
    if (!activeChip || typeof activeChip.scrollIntoView !== 'function') return;
    try {
      activeChip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } catch (e) {
      // 구형 브라우저는 옵션 객체를 못 받는다 — 칩 위치만 맞춘다
      el.scrollLeft = Math.max(0, activeChip.offsetLeft - el.clientWidth / 2 + activeChip.offsetWidth / 2);
    }
  }, 50);
}

// ─── 세로 타임라인 ───────────────────────────────────────
function renderTimelineNav() {
  const el = document.getElementById('timeline-nav');
  if (!el) return;
  el.innerHTML = BIBLE_STORY.eras.map((era, i) => `
    <div class="timeline-item ${i === StoryState.currentEraIdx ? 'active' : ''} ${StoryState.readEras.has(i) ? 'done' : ''}"
      onclick="selectEra(${i})">
      <div class="timeline-line"></div>
      <div class="timeline-dot">${StoryState.readEras.has(i) ? '✓' : era.icon}</div>
      <div class="timeline-info">
        <div class="timeline-era">${era.era}</div>
        <div class="timeline-books">${era.books}</div>
        <div class="timeline-period">${era.period}</div>
      </div>
    </div>
  `).join('');
}

// ─── 시대 콘텐츠 렌더 ────────────────────────────────────
function renderEraContent(idx) {
  const era = BIBLE_STORY.eras[idx];
  if (!era) return;
  const lang = State.lang;

  // 히어로 배너
  const heroContainer = document.getElementById('story-hero-container');
  if (heroContainer) {
    heroContainer.innerHTML = `
      <div class="story-hero" style="background:${era.color}" data-icon="${era.icon}">
        <div class="story-hero-period">${era.period} · ${lang === 'en' ? era.booksEn : era.books}</div>
        <div class="story-hero-era">${lang === 'en' ? era.eraEn : era.era}</div>
        <div class="story-hero-tagline">${lang === 'en' ? era.taglineEn : era.tagline}</div>
      </div>`;
  }

  // 스토리 본문 (bold 처리)
  const bodyText = lang === 'en' ? era.storyEn : era.story;
  const bodyEl = document.getElementById('story-body-text');
  if (bodyEl) {
    bodyEl.innerHTML = bodyText
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  // 핵심 구절
  const versesEl = document.getElementById('story-key-verses');
  if (versesEl) {
    versesEl.innerHTML = era.keyVerses.map(v => `
      <div class="story-verse-item">
        <div class="story-verse-text">${lang === 'en' ? v.textEn : v.text}</div>
        <div class="story-verse-ref">${v.ref}</div>
        ${lang === 'ko' ? `<div class="story-verse-en">${v.textEn}</div>` : ''}
      </div>
    `).join('');
  }

  // 현대 적용
  const modernEl = document.getElementById('story-modern');
  if (modernEl) {
    modernEl.innerHTML = era.modern.map(m => `
      <div class="modern-card">
        <div class="modern-card-emoji">${m.emoji}</div>
        <div class="modern-card-body">
          <div class="modern-card-title">${m.title}</div>
          <div class="modern-card-text">${m.body}</div>
        </div>
      </div>
    `).join('');
  }

  // TTS 라벨
  const ttsLabel = document.getElementById('tts-label');
  if (ttsLabel) ttsLabel.textContent = `🔊 ${lang === 'en' ? 'Read aloud' : '읽어주기'} — ${lang === 'en' ? era.eraEn : era.era}`;

  // 본문을 새로 그렸으니 골라 둔 글씨 크기를 다시 입힌다
  // (innerHTML 로 갈아끼우면 인라인 스타일이 함께 사라진다)
  applyStoryFontSize();

  // 읽음 표시
  StoryState.readEras.add(idx);
  Store.save('readEras', [...StoryState.readEras]);
  cloudQueue();
  updateStoryProgress();
}

// ─── 시대 선택 ───────────────────────────────────────────
// 내용 전환이 최우선이다. 읽어주기 정지·스크롤 같은 곁일이 실패해도
// 시대가 바뀌지 않는 일은 없어야 해서, 상태와 렌더를 먼저 하고
// 나머지는 각각 따로 감싼다.
function selectEra(idx) {
  StoryState.currentEraIdx = idx;
  renderEraChips();
  renderEraContent(idx);
  renderTimelineNav();

  try { stopTts(); } catch (e) { console.warn('[tts] 정지 실패', e); }

  // 스토리 탭 상단으로 스크롤 (구형 브라우저는 scrollTo 옵션을 못 받는다)
  const pane = document.getElementById('tab-story');
  if (pane) {
    try {
      if (typeof pane.scrollTo === 'function') pane.scrollTo({ top: 0, behavior: 'smooth' });
      else pane.scrollTop = 0;
    } catch (e) { pane.scrollTop = 0; }
  }
}

// ─── 역사 이야기 글씨 크기 ───────────────────────────────
// 성경읽기와 같은 3단계. 이야기 본문이 길어서 어르신이 직접 키울 수 있어야 한다.
const STORY_SIZES = [
  { v: '14px', lh: '1.9', label: '보통' },
  { v: '18px', lh: '1.85', label: '크게' },
  { v: '22px', lh: '1.8', label: '아주 크게' }
];

function cycleStoryFontSize() {
  StoryState.storyFontIdx = ((StoryState.storyFontIdx || 0) + 1) % STORY_SIZES.length;
  Store.save('storyFontIdx', StoryState.storyFontIdx);
  applyStoryFontSize();
}

function applyStoryFontSize() {
  const idx = StoryState.storyFontIdx || 0;
  const size = STORY_SIZES[idx];
  // 본문과 핵심 구절·오늘 연결까지 같이 키운다 — 본문만 커지면 짝이 안 맞는다
  const body = document.getElementById('story-body-text');
  if (body) {
    body.style.fontSize = size.v;
    body.style.lineHeight = size.lh;
  }
  const pane = document.getElementById('tab-story');
  if (pane) pane.style.setProperty('--story-fs', size.v);

  const btn = document.getElementById('story-size-btn');
  if (btn) btn.textContent = '글씨 ' + size.label;
}

// ─── 진도 업데이트 ───────────────────────────────────────
function updateStoryProgress() {
  const done = StoryState.readEras.size;
  const total = BIBLE_STORY.eras.length;
  const pct = Math.round(done / total * 100);
  const bar = document.getElementById('story-progress-bar');
  const label = document.getElementById('story-progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = `${done} / ${total} 시대 읽음`;
}

// ══════════════════════════════════════════════════════════
// TTS (Web Speech API — 브라우저 내장 읽어주기)
// ══════════════════════════════════════════════════════════

function getTtsText() {
  const era = BIBLE_STORY.eras[StoryState.currentEraIdx];
  const lang = State.lang;
  const story = lang === 'en' ? era.storyEn : era.story;
  // ** 마크다운 제거
  const clean = story.replace(/\*\*/g, '');
  const verseText = era.keyVerses.map(v =>
    `${v.ref}. ${lang === 'en' ? v.textEn : v.text}`
  ).join('. ');
  return `${lang === 'en' ? era.eraEn : era.era}. ${clean} 핵심 구절. ${verseText}`;
}

// 읽어주기를 쓸 수 있는 브라우저인지 — 카카오톡 인앱 브라우저처럼
// speechSynthesis 가 아예 없는 환경이 있다. 여기서 걸러 두면
// 아래 함수들이 undefined.cancel() 로 터지는 일이 없다.
function ttsAvailable() {
  try {
    return typeof window !== 'undefined'
      && 'speechSynthesis' in window
      && !!window.speechSynthesis
      && typeof window.speechSynthesis.cancel === 'function';
  } catch (e) { return false; }
}

// 긴 글을 문장 단위로 자른다.
//
// 안드로이드 크롬의 speechSynthesis 는 한 번에 넘길 수 있는 길이에 제한이
// 있어서(대략 200~300자) 그보다 길면 오류도 없이 조용히 아무 말도 안 한다.
// 시대 한 편이 550~730자라 폰에서는 통째로 넘기면 무조건 실패했다.
// PC 크롬은 이 제한이 없어서 같은 코드가 잘 동작한다.
function splitForTts(text, limit) {
  const max = limit || 180;
  const out = [];
  // 문장 끝(. ! ? 뒤 공백)에서 끊는다. 한국어는 마침표가 잘 붙어 있다.
  const sentences = String(text).replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/);

  let buf = '';
  const push = s => { if (s && s.trim()) out.push(s.trim()); };

  for (let s of sentences) {
    // 문장 하나가 이미 한계보다 길면 쉼표, 그다음 공백으로 더 쪼갠다
    while (s.length > max) {
      // cut = 조각에 넣을 마지막 글자의 위치. 끊을 데가 없으면 max-1 —
      // max 로 두면 slice(0, cut+1) 이 max+1 자가 되어 한계를 넘는다.
      let cut = s.lastIndexOf(',', max - 1);
      if (cut < max * 0.5) cut = s.lastIndexOf(' ', max - 1);
      if (cut < max * 0.5) cut = max - 1;
      push(buf); buf = '';
      push(s.slice(0, cut + 1));
      s = s.slice(cut + 1).trim();
    }
    if ((buf + ' ' + s).trim().length > max) { push(buf); buf = s; }
    else { buf = (buf ? buf + ' ' : '') + s; }
  }
  push(buf);
  return out.filter(Boolean);
}

function toggleTts() {
  if (StoryState.ttsActive) { pauseTts(); return; }

  // 멈춰 둔 자리가 있으면 처음부터가 아니라 그 자리에서 이어 읽는다
  if (StoryState.ttsPaused && StoryState.ttsQueue && StoryState.ttsQueue.length
      && StoryState.ttsIndex < StoryState.ttsQueue.length) {
    if (!ttsAvailable() || typeof SpeechSynthesisUtterance === 'undefined') {
      showToast('이 브라우저는 읽어주기 기능을 지원하지 않습니다');
      return;
    }
    StoryState.ttsPaused = false;
    StoryState.ttsActive = true;
    updateTtsBtn();
    speakTtsChunk();
    return;
  }
  startTts();
}

// 목소리를 고른다. 안드로이드는 처음에 getVoices() 가 빈 배열을 주고
// voiceschanged 이후에 채워지므로, 없으면 목소리 지정 없이 진행한다
// (브라우저가 utter.lang 으로 알아서 고른다).
function pickTtsVoice() {
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    const code = State.lang === 'en' ? 'en' : 'ko';
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith(code)) || null;
  } catch (e) { return null; }
}

function startTts() {
  if (!ttsAvailable() || typeof SpeechSynthesisUtterance === 'undefined') {
    showToast('이 브라우저는 읽어주기 기능을 지원하지 않습니다');
    return;
  }
  stopTts();

  StoryState.ttsQueue = splitForTts(getTtsText());
  StoryState.ttsIndex = 0;
  if (!StoryState.ttsQueue.length) return;

  StoryState.ttsActive = true;
  updateTtsBtn();
  showToast(State.lang === 'en' ? '▶ Reading...' : '▶ 읽는 중...');
  speakTtsChunk();
}

// 조각 하나를 읽고, 끝나면 다음 조각을 이어 읽는다
function speakTtsChunk() {
  if (!StoryState.ttsActive || !ttsAvailable()) return;

  const chunk = StoryState.ttsQueue[StoryState.ttsIndex];
  if (chunk === undefined) {           // 다 읽었다
    StoryState.ttsActive = false;
    StoryState.ttsUtterance = null;
    updateTtsBtn();
    showToast(State.lang === 'en' ? '✓ Done reading' : '✓ 읽기 완료');
    return;
  }

  const utter = new SpeechSynthesisUtterance(chunk);
  utter.lang = State.lang === 'en' ? 'en-US' : 'ko-KR';
  utter.rate = StoryState.ttsSpeed;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  const voice = pickTtsVoice();
  if (voice) utter.voice = voice;

  utter.onend = () => {
    if (!StoryState.ttsActive) return;   // 사용자가 중간에 멈췄다
    StoryState.ttsIndex++;
    speakTtsChunk();
  };
  utter.onerror = e => {
    // 사용자가 cancel() 해서 나는 interrupted 는 오류가 아니다
    if (e && (e.error === 'interrupted' || e.error === 'canceled')) return;
    StoryState.ttsActive = false;
    StoryState.ttsUtterance = null;
    updateTtsBtn();
    showToast(State.lang === 'en' ? 'Could not read aloud' : '읽어주기를 시작할 수 없습니다');
  };

  StoryState.ttsUtterance = utter;
  try {
    window.speechSynthesis.speak(utter);
  } catch (e) {
    StoryState.ttsActive = false;
    updateTtsBtn();
    showToast('읽어주기를 시작할 수 없습니다');
  }
}

// 안드로이드에서 pause() 는 동작이 제각각이라(아예 안 멈추거나 재개가 안 된다)
// 멈출 때는 cancel 하고, 다시 누르면 아직 안 읽은 조각부터 이어 읽는다.
function pauseTts() {
  const at = StoryState.ttsIndex;
  if (ttsAvailable()) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  StoryState.ttsActive = false;
  StoryState.ttsUtterance = null;
  StoryState.ttsIndex = at;             // 이어 들을 자리를 남겨 둔다
  StoryState.ttsPaused = true;
  updateTtsBtn();
}

// selectEra 가 맨 처음 부르는 함수다. 여기서 예외가 나면 시대 전환이
// 통째로 멈추므로(내용이 안 바뀜) 읽어주기 실패가 절대 밖으로 나가지 않게 한다.
function stopTts() {
  StoryState.ttsActive = false;         // onend 가 다음 조각을 잇지 못하게 먼저 끈다
  if (ttsAvailable()) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  StoryState.ttsUtterance = null;
  StoryState.ttsQueue = [];
  StoryState.ttsIndex = 0;
  StoryState.ttsPaused = false;
  updateTtsBtn();
}

function setTtsSpeed(speed) {
  StoryState.ttsSpeed = speed;
  document.querySelectorAll('.tts-speed-btn').forEach(b => {
    b.classList.toggle('active', parseFloat(b.dataset.speed) === speed);
  });
  // 읽는 중이면 읽던 자리부터 새 속도로 이어 읽는다 (처음으로 돌아가지 않게)
  if (StoryState.ttsActive) {
    const at = StoryState.ttsIndex;
    const queue = StoryState.ttsQueue;
    stopTts();
    StoryState.ttsQueue = queue;
    StoryState.ttsIndex = at;
    StoryState.ttsActive = true;
    updateTtsBtn();
    speakTtsChunk();
  }
}

function updateTtsBtn() {
  const btn = document.getElementById('tts-play-btn');
  if (btn) btn.textContent = StoryState.ttsActive ? '⏸' : '▶';
}

// ══════════════════════════════════════════════════════════
// 접이식 카드 (스크롤 길이 단축)
// ══════════════════════════════════════════════════════════

// 카드 제목으로 안정적인 키를 만든다 (카드에 id 가 없으므로)
function collapseKey(card) {
  const head = card.querySelector('.card-label, .story-section-header');
  const label = head?.dataset.baseLabel || '';
  const tab = card.closest('.tab-content')?.id || '';
  return `${tab}:${label}`;
}

function bindCollapsibles() {
  const saved = Store.load('collapsed', null);

  document.querySelectorAll('.card.collapsible').forEach(card => {
    const head = card.querySelector('.card-label, .story-section-header');
    if (!head || head.dataset.collapseBound) return;

    // 원본 라벨 보관 — applyLangUI 나 재렌더가 덮어써도 키가 유지된다
    head.dataset.baseLabel = head.textContent.trim();
    head.dataset.collapseBound = '1';

    const hint = document.createElement('span');
    hint.className = 'collapse-hint';
    head.appendChild(hint);

    const chevron = document.createElement('span');
    chevron.className = 'collapse-chevron';
    chevron.textContent = '⌃';
    head.appendChild(chevron);

    // 접근성 — 스크린리더와 키보드
    head.setAttribute('role', 'button');
    head.setAttribute('tabindex', '0');

    head.addEventListener('click', () => toggleCard(card));
    head.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(card); }
    });

    // 저장된 상태 복원 (없으면 HTML 의 기본값 유지)
    if (saved) {
      const key = collapseKey(card);
      if (key in saved) card.classList.toggle('collapsed', !!saved[key]);
    }
    updateCollapseA11y(card);
  });
  updateCollapseHints();
}

function toggleCard(card) {
  card.classList.toggle('collapsed');
  updateCollapseA11y(card);
  updateCollapseHints();
  saveCollapseState();
  State.lastActivity = Date.now();
}

function updateCollapseA11y(card) {
  const head = card.querySelector('.card-label, .story-section-header');
  if (head) head.setAttribute('aria-expanded', String(!card.classList.contains('collapsed')));
}

function saveCollapseState() {
  const map = {};
  document.querySelectorAll('.card.collapsible').forEach(card => {
    map[collapseKey(card)] = card.classList.contains('collapsed');
  });
  Store.save('collapsed', map);
}

// 접힌 카드에 "3개" 같은 개수 힌트를 붙여 내용이 있음을 알린다
function updateCollapseHints() {
  document.querySelectorAll('.card.collapsible').forEach(card => {
    const hint = card.querySelector('.collapse-hint');
    if (!hint) return;
    const body = card.querySelector('.card-body');
    // 실제 항목 수를 세되, 안내문(p)이나 빈 상태는 제외
    const n = body
      ? body.querySelectorAll('.g-history-day, .imm-hist-day, .prayer-saved-row, .video-item, .hymn-row, .story-verse-item, .modern-card, .timeline-item, .prayer-type-card, .topic-verse-text').length
      : 0;
    hint.textContent = n ? `${n}개` : '';
  });
}

// 저장/렌더 후 접힌 카드를 자동으로 펼친다 — 방금 쓴 글이 안 보이면 안 되므로
function revealCard(el) {
  const card = el?.closest?.('.card.collapsible');
  if (!card) return;
  if (card.classList.contains('collapsed')) {
    card.classList.remove('collapsed');
    updateCollapseA11y(card);
    saveCollapseState();
  }
}

// ─── Boot ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bindOnboard();
  bindGlobalEvents();
  bindFavButtons();
  init();
  bindCollapsibles();
  // 클라우드는 마지막에 — 실패해도 앱은 이미 다 떠 있다
  if (typeof Cloud !== 'undefined') {
    Cloud.init().catch(e => console.warn('[cloud] 시작 실패', e));
  }
});

