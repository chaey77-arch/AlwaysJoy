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
  // 볼드 모드 복원
  const boldMode = Store.load('boldMode', false);
  if (boldMode) {
    document.body.classList.add('bold-mode');
    const btn = document.getElementById('bold-toggle-btn');
    if (btn) btn.style.fontWeight = '900';
  }
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
    // 미리보기용 가짜 사용자. ageGroup 을 넣지 않는다 — 없앤 값이다
    if (!State.user) State.user = { name: '홍길동', joinDate: new Date().toISOString() };
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
  // 기억 탭을 열 때 기록 수를 다시 센다. 감사·기도를 저장해도 앨범 탭을
  // 다시 그리지는 않으므로, 여기서 세지 않으면 안내가 늦게 나타난다.
  if (tab === 'album' && typeof renderLocalOnly === 'function') renderLocalOnly();
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-' + tab));
  // 탭을 옮기면 새 탭 맨 위부터 — 이전 탭에서 내려둔 위치가 남지 않게
  scrollToTop();
  State.lastActivity = Date.now();
}

// ─── Onboarding ──────────────────────────────────────────
// 카카오로 시작하기
async function startWithKakao() {
  if (typeof Cloud === 'undefined' || !Cloud.signInKakao) {
    showToast('로그인 기능을 불러오는 중입니다...');
    return;
  }

  try {
    await Cloud.signInKakao();
    // 로그인 성공하면 Cloud.js가 자동으로 처리
  } catch (e) {
    console.error('카카오 로그인 실패:', e);
    showToast('로그인에 실패했습니다. 다시 시도해주세요.');
  }
}

function bindOnboard() {
  // 카카오 로그인 버튼은 HTML에서 onclick으로 직접 연결
  // startWithKakao() 함수가 처리

  // "주님 안에서 시작하기" 버튼 - 로그인 없이 바로 시작
  const localStartBtn = document.getElementById('btn-start');
  if (localStartBtn) {
    localStartBtn.onclick = () => {
      Store.save('onboarded', true);
      showScreen('main');
      renderAll();
      startCompanion();
      setTimeout(() => showCompanionBanner('morning'), 1400);
    };
  }
}

// ─── Render all ──────────────────────────────────────────
function renderAll() {
  applyLangUI();
  renderHeader();
  renderHome();
  renderWord();
  restoreVerseHeroState();
  renderHymn();
  renderPrayer();
  renderGratitude();
  renderImmanuel();
  renderAlbum();
  renderStory();
  renderScreenMode();   // 화면 밝기 — 지금 어느 것이 켜져 있는지
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
  const alt = (CHAR_NAMES[name] || {})[State.lang === 'en' ? 'en' : 'ko'] || t('charAlt');
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
  // 이름은 위쪽 머리글에만 둔다. 예전에는 여기에도 붙여서 한 화면에
  // 이름이 두 번 나왔다 — 어머니가 "내 이름이 왜 두 번 있냐" 하셨다.
  // 인사말은 통째로 한 덩어리다 ('좋은 저 / 녁이에요' 방지).
  setPhrase('greet-hi', t(key));
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
  // 숫자는 옆 칸에 따로 크게 보여주므로 여기엔 뒤에 붙는 말만 넣는다
  setEl('home-streak-text', streak > 0 ? t('gratitudeStreak') : t('gratitudeStreakNone'));

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

  // 주제 칩 — 주제 이름도 영어로 (labelEn)
  const chips = document.getElementById('verse-topic-chips');
  if (chips) {
    chips.innerHTML = DATA.verseTopics.map((tp, i) =>
      `<button class="chip ${i === State.selectedVerseTopicIdx ? 'active' : ''}" onclick="selectVerseTopic(${i})">${tp.icon} ${escHtml(topicLabel(tp))}</button>`
    ).join('');
  }
  renderVerseTopicContent();
  renderBibleRead();
  renderBibleProgress();
  updateFavDailyBtn();

  // 영상 목록 — youtubeSearch 기반.
  // 영상 제목과 채널 이름은 한국어 설교라 그대로 둔다 (영어로 바꿔 놓으면
  // 유튜브에서 찾을 수 없는 이름이 된다). 분류 이름만 영어로 보여준다.
  const videoList = document.getElementById('video-list');
  if (videoList) {
    videoList.innerHTML = DATA.videos.flatMap(cat =>
      cat.items.map(v => {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(v.searchQuery || v.title)}`;
        const catName = State.lang === 'en' ? (cat.categoryEn || cat.category) : cat.category;
        return `<a class="video-item" href="${searchUrl}" target="_blank" rel="noopener">
          <div class="video-thumb">${v.thumb}</div>
          <div class="video-body">
            <div class="video-title">${v.title}</div>
            <div class="video-ch">${v.channel} · ${escHtml(catName)}</div>
          </div>
          <div class="video-arrow">▶</div>
        </a>`;
      })
    ).join('');
  }
}

// 주제 이름 · 주제 안의 구절 — 영어일 때는 짝으로 넣어 둔 영어를 쓴다.
// 영어가 없으면 한국어로 돌아간다 (빈 화면보다 낫다).
function topicLabel(tp) {
  return (State.lang === 'en' && tp.labelEn) ? tp.labelEn : tp.label;
}
function verseText(v) {
  return (State.lang === 'en' && v.textEn) ? v.textEn : v.text;
}
function verseRef(v) {
  return (State.lang === 'en' && v.refEn) ? v.refEn : v.ref;
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
  el.innerHTML = topic.verses.map(v => {
    const text = verseText(v), ref = verseRef(v);
    return `<div class="topic-verse">
      <div class="topic-verse-text">${escHtml(text)}</div>
      <div class="topic-verse-row">
        <div class="topic-verse-ref">${escHtml(ref)}</div>
        ${favBtnHtml(text, ref, 'topic')}
      </div>
    </div>`;
  }).join('');
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
    aria-label="${escHtml(t(on ? 'favRemove' : 'favAdd'))}"
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
    showToast(t('favRemoved'));
  } else {
    State.memories.myVerses.push({ text: String(text || '').trim(), ref: String(ref || '').trim(), at: Date.now() });
    showToast(t('favAdded'));
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
    btn.setAttribute('aria-label', t(on ? 'favRemove' : 'favAdd'));
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
  btn.textContent = t(on ? 'favDailyOn' : 'favDailyOff');
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
// 글씨 크기 3단계 — 어르신이 직접 키울 수 있게.
// 단계 이름은 여기 적지 않는다 — fontSizeLabel() 이 말모음에서 가져온다
// (여기 한글로 적어 두면 English 로 바꿔도 그대로 남는다).
const BIBLE_SIZES = [
  { v: '17px', w: '400' },
  { v: '21px', w: '500' },
  { v: '25px', w: '700' }
];

function renderBibleRead() {
  // 책 선택 — 언어를 바꾸면 66권 이름이 모두 달라지므로 다시 만든다.
  // (예전에는 한 번 만들면 그대로 둬서 English 로 바꿔도 한글 이름이 남았다)
  const bookSel = document.getElementById('bible-book');
  if (bookSel && bookSel.dataset.lang !== State.lang) {
    // 구약/신약을 묶어 보여준다 (66권을 평평하게 늘어놓으면 찾기 어렵다)
    let html = '';
    [['구약', 'bibleOT'], ['신약', 'bibleNT']].forEach(([part, key]) => {
      const gs = BIBLE.groups.filter(g => g.part === part).map(g => g.g);
      const books = BIBLE.books.filter(b => gs.includes(b.g));
      const label = `${t(key)} (${tf('bibleBooksUnit', { n: books.length })})`;
      html += `<optgroup label="${escHtml(label)}">` +
        books.map(b => `<option value="${b.n}">${escHtml(bibleBookTitle(b))}</option>`).join('') +
        `</optgroup>`;
    });
    bookSel.innerHTML = html;
    bookSel.dataset.lang = State.lang;
  }
  if (bookSel) bookSel.value = String(State.bibleBook);

  renderBibleChapterOptions();
  renderBibleStarters();
  renderBibleResume();

  // 번역 출처 표기 — 퍼블릭 도메인이라도 어디서 왔는지 밝힌다
  const meta = (State.lang === 'en' && BIBLE.metaEn) ? BIBLE.metaEn : BIBLE.meta;
  setEl('bible-credit', `${meta.fullName} · ${meta.license} · ${meta.source}`);
  applyBibleFontSize();
}

function renderBibleChapterOptions() {
  const sel = document.getElementById('bible-chapter');
  const book = BIBLE.books.find(b => b.n === State.bibleBook);
  if (!sel || !book) return;
  // 책이 바뀌거나 언어가 바뀌면 장 목록을 다시 만든다 ('3장' ↔ 'Chapter 3')
  const stamp = book.n + ':' + State.lang;
  if (sel.dataset.book !== stamp) {
    sel.innerHTML = Array.from({ length: book.c }, (_, i) =>
      `<option value="${i + 1}">${escHtml(tf('bibleChapterUnit', { n: i + 1 }))}</option>`).join('');
    sel.dataset.book = stamp;
  }
  sel.value = String(State.bibleChapter);
}

function renderBibleStarters() {
  const el = document.getElementById('bible-starters');
  if (!el) return;
  const en = State.lang === 'en';
  el.innerHTML = BIBLE.starters.map(s =>
    `<button class="bible-starter" onclick="openBible(${s.n}, ${s.c})">
      ${escHtml(en && s.labelEn ? s.labelEn : s.label)} <em>${escHtml(en && s.whyEn ? s.whyEn : s.why)}</em>
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
  const where = tf('bibleWhere', { book: bibleBookTitle(book), ch: last.c });
  el.innerHTML =
    `<button class="bible-resume-btn" onclick="openBible(${last.n}, ${last.c})">
      <div class="bible-resume-icon">📖</div>
      <div class="bible-resume-body">
        <div class="bible-resume-label">${escHtml(t('bibleResume'))}</div>
        <div class="bible-resume-where">${escHtml(where)}</div>
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

  const title = bibleBookTitle(book);
  setEl('bible-title', tf('bibleWhere', { book: title, ch }));
  updateBibleNavBtns();
  renderBibleResume();

  // 읽던 곳 저장 — 앱을 닫았다 열어도 이어서 읽을 수 있게
  State.bibleLast = { n: book.n, c: ch };
  Store.save('bibleLast', State.bibleLast);
  cloudQueue();
  markBibleRead(book.n, ch);

  const cached = BibleFetch.cached(book.n, ch);
  if (!cached) {
    body.innerHTML = `<div class="bible-state">${escHtml(tf('bibleLoading', { book: title, ch }))}</div>`;
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
        ${favBtnHtml(v.t, `${title} ${ch}:${v.v}`, 'bible')}
      </div>`).join('');
    document.getElementById('wordsub-read')?.scrollIntoView({ block: 'nearest' });
  } catch (e) {
    if (token !== State.bibleReqToken) return;
    body.innerHTML =
      `<div class="bible-state">
        ${t('bibleFailed')}
        <br><button class="bible-retry" onclick="loadBibleChapter()">${escHtml(t('bibleRetry'))}</button>
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
  const text = tf('bibleProgressText', {
    book: bibleBookTitle(book), done, total: book.c, all: reads.length
  });
  el.innerHTML =
    `<div class="bible-progress-bar"><span style="width:${Math.round(done / book.c * 100)}%"></span></div>
     <div class="bible-progress-text">${escHtml(text)}</div>`;
  renderReadProgress();
}

// ─── 권별 읽기 진도 (기억 탭) ────────────────────────────
//
// 성경읽기 카드의 진도는 '지금 보는 책' 하나만 알려 준다. 어머니 말씀:
// "내가 어디까지 읽었는지 전체를 좀 보고 싶다." 그래서 읽은 장이 하나라도
// 있는 책만 골라 분류(모세오경·복음서…)로 묶어 보여준다.
//
// 66권을 다 늘어놓지 않는다 — 아직 안 펼친 책 60권이 0장으로 줄줄이 있으면
// 읽은 것보다 안 읽은 것이 먼저 보여서 마음이 무거워진다.
function renderReadProgress() {
  const el = document.getElementById('read-progress');
  if (!el) return;
  const reads = Store.load('bibleReads', []);

  // 책마다 읽은 장 수
  const byBook = {};
  reads.forEach(r => { byBook[r.n] = (byBook[r.n] || 0) + 1; });
  const opened = BIBLE.books.filter(b => byBook[b.n] > 0);

  if (!opened.length) {
    el.innerHTML = `<div class="empty"><div class="empty-icon">📖</div>`
      + `<div class="empty-text" id="read-progress-empty"></div></div>`;
    // 낱말이 갈리지 않게 — \n 이 끊어도 되는 자리다
    setPhrase('read-progress-empty', t('readProgressNone'));
    return;
  }

  // 분류 순서대로 (BIBLE.groups 가 구약→신약 순서를 갖고 있다)
  const en = State.lang === 'en';
  const sections = BIBLE.groups.map(grp => {
    const books = opened.filter(b => b.g === grp.g);
    if (!books.length) return '';
    const rows = books.map(b => {
      const done = byBook[b.n];
      const pct = Math.round(done / b.c * 100);
      return `<div class="read-row${done >= b.c ? ' done' : ''}">
        <div class="read-row-name">${escHtml(bibleBookTitle(b))}</div>
        <div class="read-row-bar"><span style="width:${pct}%"></span></div>
        <div class="read-row-num">${done}/${b.c}</div>
      </div>`;
    }).join('');
    return `<div class="read-group">
      <div class="read-group-label">${escHtml(en && grp.gEn ? grp.gEn : grp.g)}</div>
      ${rows}
    </div>`;
  }).join('');

  el.innerHTML = `<div class="read-total">
      <div class="read-total-num">${escHtml(tf('readProgressAll', { done: reads.length }))}</div>
      <div class="read-total-books">${escHtml(tf('readProgressBooks', { n: opened.length }))}</div>
    </div>${sections}`;
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
  const size = BIBLE_SIZES[idx];
  const body = document.getElementById('bible-body');
  if (body) {
    body.style.setProperty('--v', size.v);
    body.style.fontWeight = size.w;
  }
  // 버튼에 지금 단계를 보여준다 — 글자 수로 크기를 짐작할 수 있게
  const btn = document.getElementById('bible-size-btn');
  if (btn) btn.textContent = fontSizeLabel(idx);
}

// 글씨 크기 버튼에 쓸 말 — '글씨 크게' / 'Text Large'
// 단계 이름을 코드에 박아 두면 English 로 바꿔도 한글이 남는다
const FONT_SIZE_KEYS = ['fontNormal', 'fontBig', 'fontHuge'];
function fontSizeLabel(idx) {
  const key = FONT_SIZE_KEYS[idx] || FONT_SIZE_KEYS[0];
  return tf('fontSizeLabel', { size: t(key) });
}

function prevVerse() {
  State.currentVerseIdx = (State.currentVerseIdx - 1 + DATA.dailyVerses.length) % DATA.dailyVerses.length;
  renderWord(); renderHome();
}
function nextVerse() {
  State.currentVerseIdx = (State.currentVerseIdx + 1) % DATA.dailyVerses.length;
  renderWord(); renderHome();
}

// 오늘의 말씀 상세 정보 펼치기/접기
function toggleVerseHeroDetails() {
  const details = document.getElementById('verse-hero-details');
  const icon = document.querySelector('.verse-hero-toggle-icon');
  if (!details || !icon) return;

  const isOpen = details.classList.toggle('open');
  icon.textContent = isOpen ? '▲' : '▼';
  Store.save('verseHeroOpen', isOpen);
}

// 초기화 시 저장된 상태 복원
function restoreVerseHeroState() {
  const isOpen = Store.load('verseHeroOpen', false);
  if (isOpen) {
    const details = document.getElementById('verse-hero-details');
    const icon = document.querySelector('.verse-hero-toggle-icon');
    if (details) details.classList.add('open');
    if (icon) icon.textContent = '▲';
  }
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

// 찬송가 제목·가사·부른이는 한글로 둔다. 평생 그 제목으로 알고 계신 노래이고,
// 유튜브도 한글 제목으로 찾아야 나온다. 대신 '언제 부르면 좋은지'(note) 는
// 안내하는 말이라 영어로 바꿔 준다.
function hymnNote(h) {
  return (State.lang === 'en' && h.noteEn) ? h.noteEn : h.note;
}

function renderHymn() {
  const hymn = DATA.hymns[State.currentHymnIdx];
  setEl('hymn-title', hymn.title);
  setEl('hymn-artist', (hymn.tag ? '[' + hymn.tag + '] ' : '') + hymn.artist);
  setEl('hymn-lyrics', hymn.lyrics);
  setEl('hymn-note', hymnNote(hymn));
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
        <div class="hymn-row-note">${h.tag ? '[' + h.tag + '] ' : ''}${escHtml(hymnNote(h))}</div>
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
  if (!btn) return;
  btn.textContent = State.isPlaying ? '⏸' : '▶';
  // 그림만 있는 단추라 눈으로는 언어가 없지만, 읽어주는 기계에는 말이 필요하다
  btn.setAttribute('aria-label', State.isPlaying ? t('hymnPause') : t('hymnPlay'));
}

// ─── Prayer ──────────────────────────────────────────────
function renderPrayer() {
  const grid = document.getElementById('prayer-type-grid');
  if (grid) {
    grid.innerHTML = DATA.prayerGuides.map(g =>
      `<div class="prayer-type-card ${State.selectedPrayerType === g.type ? 'selected' : ''}" onclick="selectPrayerType('${g.type}')">
        <div class="prayer-type-icon">${g.icon}</div>
        <div class="prayer-type-label">${escHtml(prayerTitle(g))}</div>
      </div>`
    ).join('');
  }
  renderPrayerGuide();

  const saved = document.getElementById('prayer-saved-list');
  if (saved) {
    if (!State.prayers.length) {
      saved.innerHTML = `<div class="empty"><div class="empty-icon">🙏</div><div class="empty-text">${escHtml(t('noPrayer'))}</div></div>`;
    } else {
      saved.innerHTML = State.prayers.slice(-10).reverse().map(p => {
        const guide = DATA.prayerGuides.find(g => g.type === p.type);
        return `<div class="prayer-saved-row">
          <div class="prayer-saved-meta">${formatDate(new Date(p.date))} · ${escHtml(guide ? prayerTitle(guide) : t('prayerKindFree'))}</div>
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

// 기도 종류 이름과 안내 네 줄 — 영어가 없으면 한국어로 돌아간다
function prayerTitle(g) {
  return (State.lang === 'en' && g.titleEn) ? g.titleEn : g.title;
}
function prayerGuideLines(g) {
  return (State.lang === 'en' && g.guideEn) ? g.guideEn : g.guide;
}

function renderPrayerGuide() {
  const el = document.getElementById('prayer-guide-box');
  if (!el) return;
  const guide = DATA.prayerGuides.find(g => g.type === State.selectedPrayerType);
  if (!guide) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="prayer-guide-box">
    ${prayerGuideLines(guide).map(line => `<div class="prayer-guide-line">${escHtml(line)}</div>`).join('')}
  </div>`;
}

function savePrayer() {
  // 받아쓰는 중이면 먼저 멈춘다 — 켜 둔 채 저장하면 저장 뒤에도 빈 칸에
  // 계속 받아적혀서 어르신은 왜 글자가 생기는지 알 수 없다
  if (typeof Voice !== 'undefined' && Voice.listening()) Voice.stop();
  const ta = document.getElementById('prayer-textarea');
  const text = (ta?.value || '').trim();
  if (!text) { showToast(t('prayerSaveEmpty')); return; }
  State.prayers.push({ cid: newClientId(), date: new Date().toISOString(), type: State.selectedPrayerType || 'free', text });
  Store.save('prayers', State.prayers);
  cloudQueue();
  if (ta) ta.value = '';
  renderPrayer();
  // 방금 저장한 기도가 접힌 카드에 가려지지 않도록 펼친다
  revealCard(document.getElementById('prayer-saved-list'));
  updateCollapseHints();
  showToast(t('prayerSaved2'));
}

// ─── Gratitude ───────────────────────────────────────────
function renderGratitude() {
  const streak = calcStreak();
  setEl('streak-num', streak.toString());
  setEl('streak-label', streak > 0 ? t('gratitudeStreak') : t('gratitudeStreakNone'));

  const history = document.getElementById('gratitude-history');
  if (!history) return;
  if (!State.gratitude.length) {
    history.innerHTML = `<div class="empty"><div class="empty-icon">💛</div><div class="empty-text">${t('gratitudeEmpty')}</div></div>`;
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
  if (!items.length) { showToast(t('gratitudeSaveEmpty')); return; }
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
  showToast(t('gratitudeSaved2'));
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
//
// 처음 켰을 때가 17px 이다 (가운데가 아니라 '보통' 자리를 17px 로 올렸다).
// 첫 값을 14px → 17px 로 올렸다. "어른들은 쉬워보이는 큰 버튼을 원하시는
// 것 같아" 라는 말을 듣고 재 보니 임마누엘 칸이 죄다 14px 이었다.
// 직접 키울 수 있게 해 두는 것만으로는 부족하다 — 그런 단추가 있는 줄
// 모르시면 작은 글씨를 그냥 참고 쓰신다. 기본값이 곧 보시는 값이다.
// ⚠ 첫 값을 바꾸면 style.css 의 var(--imm-fs, 17px) 대체값도 같이 고친다
//   (JS 가 --imm-fs 를 심기 전 첫 페인트에 그 값이 쓰인다)
const IMM_SIZES = [
  { v: '17px', w: '400' },
  { v: '20px', w: '500' },
  { v: '24px', w: '700' }
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
  if (pane) {
    pane.style.setProperty('--imm-fs', size.v);
    pane.style.setProperty('--imm-fw', size.w);
  }
  const btn = document.getElementById('imm-size-btn');
  if (btn) btn.textContent = fontSizeLabel(State.immFontIdx || 0);
}

// 임마누엘 다섯 단계의 말 — 영어가 없으면 한국어로 돌아간다
function immStepTitle(s) { return (State.lang === 'en' && s.titleEn) ? s.titleEn : s.title; }
function immStepAsk(s) { return (State.lang === 'en' && s.askEn) ? s.askEn : s.ask; }
function immStepHint(s) { return (State.lang === 'en' && s.hintEn) ? s.hintEn : s.hint; }

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
    setPhrase('imm-verse-text', '"' + verseText(v) + '"');
    setEl('imm-verse-ref', verseRef(v));
  }

  // 입력칸은 한 번만 그린다 — 다시 그리면 쓰던 글이 날아간다
  if (wrap && !wrap.dataset.built) {
    wrap.dataset.built = '1';
    wrap.dataset.lang = State.lang;
    wrap.innerHTML = steps.map((s, i) => `
      <div class="imm-step">
        <div class="imm-step-head">
          <span class="imm-step-num">${i + 1}</span>
          <span class="imm-step-icon">${s.icon}</span>
          <span class="imm-step-title">${escHtml(immStepTitle(s))}</span>
        </div>
        <div class="imm-step-ask">${escHtml(immStepAsk(s))}</div>
        <textarea class="imm-input" id="imm-input-${s.key}" rows="2"
          placeholder="${escHtml(immStepHint(s))}"></textarea>
      </div>`).join('');

    // 다섯 칸에 말로 쓰기를 붙인다 — 칸을 방금 만들었으니 여기서 해야 한다
    if (typeof attachAllMics === 'function') attachAllMics();

    // 오늘 붙여 둔 사진은 되살린다 — 빼기 단추가 이 목록을 보고 움직이므로,
    // 앱을 다시 켠 뒤에도 오늘 사진을 뺄 수 있어야 한다.
    //
    // 글은 되살리지 않는다. 저장하면 칸을 비우기로 했으니(어르신이 남아
    // 있는 글을 보고 저장이 안 된 줄 아셨다) 여기서 다시 채우면 앱을 켤
    // 때마다 되살아나 같은 일이 벌어진다. 저장한 글은 아래 기록칸에 있고,
    // 같은 날 다시 쓰면 그 하루에 이어 붙는다.
    const today = todayImmanuel();
    if (today && today.photos && today.photos.length) {
      immPendingPhotos = [...today.photos];
      renderImmPhotoPreview().catch(() => {});
    }
  } else if (wrap && wrap.dataset.lang !== State.lang) {
    // 언어가 바뀌었다. 다시 그리면 쓰고 있던 글이 날아가므로
    // 제목·질문·예시만 제자리에서 바꿔 준다.
    wrap.dataset.lang = State.lang;
    steps.forEach((s, i) => {
      const box = wrap.children[i];
      if (!box) return;
      const title = box.querySelector('.imm-step-title');
      const ask = box.querySelector('.imm-step-ask');
      const input = document.getElementById('imm-input-' + s.key);
      if (title) title.textContent = immStepTitle(s);
      if (ask) ask.textContent = immStepAsk(s);
      if (input) input.placeholder = immStepHint(s);
    });
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
      + `<div class="empty-text">${t('immEmpty')}</div></div>`;
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
          <div class="imm-hist-label">${s ? s.icon + ' ' + escHtml(immStepTitle(s)) : escHtml(k)}</div>
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
    img.alt = t('immPhotoAlt');
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
    showToast(t('immPhotoUnsupported'));
    return;
  }

  const room = IMM_PHOTO_MAX - immPendingPhotos.length;
  if (room <= 0) {
    showToast(tf('immPhotoOver', { max: IMM_PHOTO_MAX }));
    return;
  }

  // 한 번에 여러 장을 고를 수 있으니, 남은 자리만큼만 받는다
  const take = files.filter(f => /^image\//.test(f.type)).slice(0, room);
  if (!take.length) { showToast(t('immPhotoOnlyImage')); return; }
  const overflow = files.length - take.length;

  showToast(take.length > 1
    ? tf('immPhotoPreparingN', { n: take.length })
    : t('immPhotoPreparing'));

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
    let msg = tf('immPhotoAdded', { n: added, size: formatBytes(bytes) });
    // 못 담은 게 있으면 조용히 넘기지 않고 알려준다
    if (overflow) msg += ' · ' + tf('immPhotoOnlyMax', { max: IMM_PHOTO_MAX });
    if (tooBig) msg += ' · ' + tf('immPhotoTooBigN', { n: tooBig });
    if (failed) msg += ' · ' + tf('immPhotoFailedN', { n: failed });
    showToast(msg);
  } else if (tooBig) showToast(t('immPhotoTooBig'));
  else showToast(t('immPhotoFailed'));
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
    if (btn) { btn.textContent = t('immPhotoBtn'); btn.disabled = false; }
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
      <img class="imm-photo" src="${it.url}" alt="${escHtml(t('immPhotoAltToday'))}"/>
      <button class="imm-photo-del" onclick="removeImmPhoto('${it.id}')"
        aria-label="${escHtml(t('immPhotoRemoveAria'))}">✕</button>
    </div>`).join('')}</div>
    <div class="imm-photo-size">${escHtml(tf('immPhotoCount', { n: items.length, max: IMM_PHOTO_MAX }))}</div>`;

  if (btn) {
    const full = items.length >= IMM_PHOTO_MAX;
    btn.textContent = full ? tf('immPhotoFull', { max: IMM_PHOTO_MAX }) : t('immPhotoMore');
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
  showToast(t('immPhotoRemoved'));
}

function saveImmanuel() {
  if (typeof Voice !== 'undefined' && Voice.listening()) Voice.stop();
  const steps = DATA.immanuelSteps || [];
  const written = {};
  steps.forEach(s => {
    const v = (document.getElementById('imm-input-' + s.key)?.value || '').trim();
    if (v) written[s.key] = v;
  });

  // 사진만 넣어도 하루가 남는다 — 글이 없어도 저장을 막지 않는다
  if (!Object.keys(written).length && !immPendingPhotos.length) {
    showToast(t('immSaveEmpty'));
    return;
  }

  // 하루에 하나 — 같은 날 다시 쓰면 그 하루에 이어 붙인다.
  const today = todayKey();
  const idx = State.immanuel.findIndex(e => e.date === today);
  const prev = idx >= 0 ? State.immanuel[idx] : null;

  // ★ 아침에 적은 것을 저녁에 덧붙여도 잃지 않게 이어 붙인다.
  //
  // 저장하면 칸을 비우기 때문에(어르신이 "저장했는데 글이 그대로 있다" 고
  // 하셨다) 이어 붙이지 않으면 큰일이 난다: 저녁에 한 칸만 적고 저장하시면
  // 아침에 적은 넷이 빈 칸으로 덮여 사라진다. 비우기와 이어 붙이기는
  // 둘이 함께여야 맞다 — 하나만 하면 안 된다.
  //
  // 같은 칸을 다시 적으셨으면 새로 적은 것이 이긴다 (고쳐 쓰신 것이다).
  const answers = Object.assign({}, prev?.answers || {}, written);

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

  // ★ 저장했으면 칸을 비운다.
  //
  // 어르신 말씀: "임마누엘일기를 저장했는데 질문들마다 내가 쓴 글들이
  // 남아있어. 버그같아." 기도·감사는 저장하면 칸이 비는데 여기만 남아
  // 있었으니, 저장이 안 된 것으로 보이신 것이다. 아래 기록칸에 저장된
  // 글이 이미 보이므로 위에 또 남겨 둘 이유가 없다.
  //
  // 지운 글은 위 entry.answers 에 들어가 있고, 같은 날 또 쓰시면 이어
  // 붙으므로 잃는 것이 없다.
  steps.forEach(s => {
    const el = document.getElementById('imm-input-' + s.key);
    if (el) el.value = '';
  });
  // 사진은 비우지 않는다. 글과 사정이 다르다:
  //  · 사진은 그 자리에 작게 보여서 "저장이 안 됐나" 하고 헷갈릴 일이 없다.
  //  · 이 목록을 비우면 붙여 둔 사진을 빼낼 길이 없어진다 (빼기 단추가
  //    이 목록을 보고 움직인다).
  //  · 무엇보다, 비운 다음 저녁에 또 저장하시면 entry.photos 가 빈 채로
  //    덮여서 아침에 넣은 사진이 폰에서 지워진다.
  renderImmanuelHistory();
  revealCard(document.getElementById('imm-history'));
  updateCollapseHints();
  showToast(t('immSaved'));
}

// ─── Album ───────────────────────────────────────────────
function renderAlbum() {
  setEl('album-people-count', tf('albumPeopleCount', { n: State.memories.people.length }));
  setEl('album-verse-count', tf('albumVerseCount', { n: State.memories.myVerses.length }));
  renderReadProgress();
  // 추억의 게임 — games.js 가 없어도 앨범 탭은 그대로 열려야 한다
  if (typeof renderGames === 'function') renderGames();
  renderLocalOnly();
}

// 기록이 이 폰에만 있다는 안내를 보여줄지 정한다.
//
// 언제 보여주나: 기록이 LOCAL_ONLY_MIN 개 넘게 쌓인 뒤부터.
// 처음 켠 날 "사라질 수 있어요" 를 먼저 읽으면 쓰기도 전에 불안해진다.
// 잃을 것이 생긴 다음에 알려야 뜻이 있는 말이다.
//
// 언제 감추나: 로그인해서 서버에 보관되고 있을 때. 그때는 사실이 아니다.
const LOCAL_ONLY_MIN = 10;

function countMyRecords() {
  const m = State.memories || {};
  return State.gratitude.length + State.prayers.length + State.immanuel.length
       + (m.myVerses || []).length + (m.people || []).length;
}

function renderLocalOnly() {
  const card = document.getElementById('localonly-card');
  if (!card) return;

  const loggedIn = typeof Cloud !== 'undefined' && Cloud.loggedIn && Cloud.loggedIn();
  if (loggedIn || countMyRecords() < LOCAL_ONLY_MIN) {
    card.style.display = 'none';
    return;
  }
  card.style.display = '';
  setEl('localonly-title', t('localOnlyTitle'));
  // 낱말이 줄 끝에서 갈리지 않게 — \n 이 끊어도 되는 자리다
  setPhrase('localonly-l1', t('localOnlyL1'));
  setPhrase('localonly-l2', t('localOnlyL2'));
  setPhrase('localonly-l3', t('localOnlyL3'));
}

// ─── 화면 밝기 (해가 지면 저절로 어두워지기) ──────────────
//
// 어느 CSS 를 얹을지는 index.html 의 맨 위에서 이미 정해졌다 — 첫 페인트
// 전에 정해야 흰 화면이 번쩍이지 않기 때문이다. 여기서는 어머니가 고르신
// 것을 저장하고, 지금 어느 것이 켜져 있는지 보여 주는 일만 한다.
//
// ⚠ 이 설정은 서버에 안 올린다. js/cloud.js 는 감사·기도·말씀·읽기진도만
//   올린다 — 폰마다 밝기가 다를 수 있는데 서버가 덮어쓰면 안 된다.

// 서울(북위 37.5도) 기준 월별 일몰·일출. index.html 의 표와 **같아야 한다**.
// 왜 두 군데 있나: index.html 은 첫 페인트 전에 CSS 를 골라야 해서 app.js 를
// 기다릴 수 없다. 시간대 테마(getTimeChar)도 같은 이유로 두 군데다.
const SUNSET_H  = [17.3,18.0,18.5,19.0,19.5,19.9,19.9,19.4,18.7,18.0,17.4,17.3];
const SUNRISE_H = [ 7.8, 7.3, 6.7, 5.9, 5.3, 5.2, 5.4, 5.8, 6.2, 6.7, 7.2, 7.7];

// 지금이 밤인가 — '저절로' 일 때만 쓴다
function isAfterSunset(d) {
  const now = d.getHours() + d.getMinutes() / 60;
  const m = d.getMonth();
  return now >= SUNSET_H[m] || now < SUNRISE_H[m];
}

// 해 지는 시각을 '오후 7시 30분' 처럼 읽어 준다.
// 숫자만 '19.5' 로 보여드리면 어머니가 못 읽으신다.
function sunsetLabel(d) {
  const v = SUNSET_H[d.getMonth()];
  const h = Math.floor(v);
  const mm = Math.round((v - h) * 60);
  if (State.lang === 'en') {
    const h12 = h > 12 ? h - 12 : h;
    return `${h12}:${String(mm).padStart(2, '0')} pm`;
  }
  const h12 = h > 12 ? h - 12 : h;
  return mm ? `오후 ${h12}시 ${mm}분` : `오후 ${h12}시`;
}

function setScreenMode(mode) {
  console.log('[screenMode] 선택:', mode);
  Store.save('screenMode', mode);
  console.log('[screenMode] 저장 완료');

  const label = mode === 'night' ? t('screenModeNight')
              : mode === 'day'   ? t('screenModeDay')
              : t('screenModeAuto');

  showToast(label + ' 설정 완료');
  console.log('[screenMode] 토스트 표시:', label);

  // 저장 완료 후 새로고침 (localStorage 저장 보장)
  setTimeout(() => {
    console.log('[screenMode] 새로고침 시작');
    const u = new URL(location.href);
    u.searchParams.delete('night');
    location.href = u.toString();
  }, 800);
}

function renderScreenMode() {
  const card = document.getElementById('screenmode-card');
  if (!card) return;
  const mode = Store.load('screenMode', 'auto');
  ['auto', 'day', 'night'].forEach(k => {
    const b = document.getElementById('sm-' + k);
    if (b) b.classList.toggle('on', mode === k);
  });
  // '저절로' 밑에 실제로 몇 시에 어두워지는지 적어 드린다 —
  // 계절마다 달라지니까 (12월 5시 17분 · 6월 7시 56분)
  const sub = document.getElementById('sm-auto-sub');
  if (sub) setPhrase('sm-auto-sub', t('screenModeAutoSub').replace('{time}', sunsetLabel(new Date())));
}

function openMemoryModal(type) {
  const overlay = document.getElementById('memory-modal');
  const title = document.getElementById('memory-modal-title');
  const body = document.getElementById('memory-modal-body');
  if (!overlay) return;

  if (type === 'people') {
    title.textContent = t('modalPeople');
    body.innerHTML = `
      <input class="modal-input" id="m-person-name" placeholder="${escHtml(t('mPersonName'))}"/>
      <input class="modal-input" id="m-person-rel" placeholder="${escHtml(t('mPersonRel'))}"/>
      <textarea class="modal-input" id="m-person-note" placeholder="${escHtml(t('mPersonNote'))}" rows="3" style="resize:none"></textarea>
      <button class="btn-primary" style="margin-bottom:16px" onclick="savePersonMemory()">${escHtml(t('saveBtn'))}</button>
      ${State.memories.people.length === 0
        ? `<div class="empty"><div class="empty-icon">👨‍👩‍👧</div><div class="empty-text">${escHtml(t('mPeopleEmpty'))}</div></div>`
        : State.memories.people.map((p,i) =>
            `<div class="modal-saved-item">
              <div class="modal-saved-name">${escHtml(p.name)} <span style="color:var(--gold)">${escHtml(p.relation)}</span></div>
              ${p.note ? `<div class="modal-saved-sub">${escHtml(p.note)}</div>` : ''}
              <button class="modal-del-btn" onclick="removePerson(${i})">${escHtml(t('deleteBtn'))}</button>
            </div>`
          ).join('')}`;
  } else if (type === 'verses') {
    title.textContent = t('modalVerses');
    // 담아 둔 말씀은 여러 번 되읽는 글이라 글씨 크기를 고를 수 있어야 한다.
    // 목록이 비어 있을 때는 버튼을 숨긴다 — 키울 게 없으니 혼란만 준다.
    const hasVerses = State.memories.myVerses.length > 0;
    body.innerHTML = `
      <textarea class="modal-input" id="m-verse-text" placeholder="${escHtml(t('mVerseText'))}" rows="3" style="resize:none"></textarea>
      <input class="modal-input" id="m-verse-ref" placeholder="${escHtml(t('mVerseRef'))}"/>
      <button class="btn-primary" style="margin-bottom:16px" onclick="saveVerseMemory()">${escHtml(t('saveBtn'))}</button>
      ${hasVerses ? `<div class="story-size-row">
        <button class="bible-size-btn" id="fav-size-btn" onclick="cycleFavFontSize()">${escHtml(fontSizeLabel(0))}</button>
      </div>` : ''}
      <div id="fav-verse-list">
      ${!hasVerses
        ? `<div class="empty"><div class="empty-icon">📖</div><div class="empty-text">${escHtml(t('mVersesEmpty'))}</div></div>`
        : State.memories.myVerses.map((v,i) =>
            `<div class="modal-saved-item">
              <div class="fav-verse-text">${escHtml(v.text)}</div>
              <div class="fav-verse-ref">${escHtml(v.ref)}</div>
              <button class="modal-del-btn" onclick="removeVerse(${i})">${escHtml(t('deleteBtn'))}</button>
            </div>`
          ).join('')}
      </div>`;
    applyFavFontSize();
  } else if (type === 'faith') {
    title.textContent = t('modalFaith');
    body.innerHTML = `
      <input class="modal-input" id="m-faith-baptism" placeholder="${escHtml(t('mFaithBaptism'))}" value="${escHtml(State.memories.myFaith.baptism)}"/>
      <input class="modal-input" id="m-faith-church" placeholder="${escHtml(t('mFaithChurch'))}" value="${escHtml(State.memories.myFaith.church)}"/>
      <textarea class="modal-input" id="m-faith-note" placeholder="${escHtml(t('mFaithNote'))}" rows="5" style="resize:none">${escHtml(State.memories.myFaith.note)}</textarea>
      <button class="btn-primary" onclick="saveFaithMemory()">${escHtml(t('saveBtn'))}</button>`;
  }
  overlay.classList.add('open');
}

function closeMemoryModal() { document.getElementById('memory-modal')?.classList.remove('open'); }

// ─── 좋아하는 말씀 목록 글씨 크기 ─────────────────────────
// 담아 둔 말씀을 다시 읽는 곳이라 목록 글씨가 작으면 담아 둔 뜻이 없다.
// 3단계는 다른 곳과 같게 맞췄다.
const FAV_SIZES = [
  { v: '14px', w: '400' },
  { v: '18px', w: '500' },
  { v: '22px', w: '700' }
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
  if (list) {
    list.style.setProperty('--fav-fs', size.v);
    list.style.fontWeight = size.w;
  }
  const btn = document.getElementById('fav-size-btn');
  if (btn) btn.textContent = fontSizeLabel(State.favFontIdx || 0);
}

function savePersonMemory() {
  const name = (document.getElementById('m-person-name')?.value || '').trim();
  const relation = (document.getElementById('m-person-rel')?.value || '').trim();
  const note = (document.getElementById('m-person-note')?.value || '').trim();
  if (!name) { showToast(t('mNameRequired')); return; }
  State.memories.people.push({ name, relation, note });
  Store.save('memories', State.memories);
  cloudQueue();
  renderAlbum(); openMemoryModal('people');
  showToast(tf('mPersonSaved', { name }));
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
  if (!text) { showToast(t('mVerseRequired')); return; }
  State.memories.myVerses.push({ text, ref, at: Date.now() });
  Store.save('memories', State.memories);
  cloudQueue();
  renderAlbum(); openMemoryModal('verses');
  // 읽기 화면에 같은 구절의 하트가 떠 있으면 함께 켜준다
  refreshFavButtons();
  showToast(t('mVerseSaved'));
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
  showToast(t('mFaithSaved'));
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
  const en = State.lang === 'en';
  const raw = (en && msg.textEn) ? msg.textEn : msg.text;
  const text = raw.replace('{name}', State.user?.name || '');
  const banner = document.getElementById('companion-banner');
  const bannerText = document.getElementById('companion-banner-text');
  const bannerAction = document.getElementById('companion-banner-action');
  if (!banner) return;
  bannerText.textContent = text;
  if (bannerAction) {
    bannerAction.textContent = (en && msg.actionEn) ? msg.actionEn : msg.action;
    // 어느 탭으로 갈지는 버튼 글씨가 아니라 이 열쇠로 정한다 (아래 참고)
    bannerAction.dataset.actionKey = msg.actionKey || '';
  }
  banner.classList.add('show');
  setTimeout(() => banner.classList.remove('show'), 8000);
}

function dismissCompanion() { document.getElementById('companion-banner')?.classList.remove('show'); }

// 버튼 글씨('말씀 보기')로 탭을 고르던 것을 열쇠(actionKey)로 바꿨다.
// 글씨로 고르면 English 에서는 'Read the Word' 안에 '말씀' 이 없으니
// 눌러도 아무 일이 없다 — 어르신에겐 고장난 단추로 보인다.
const COMPANION_TABS = { word: 'word', prayer: 'prayer', hymn: 'hymn', gratitude: 'gratitude' };

function doCompanionAction() {
  const btn = document.getElementById('companion-banner-action');
  const key = btn?.dataset.actionKey || '';
  dismissCompanion();
  const tab = COMPANION_TABS[key];
  if (tab) switchTab(tab);
}

function showFullscreenVerse() {
  // 영어로 보고 계시면 영어 구절을 띄운다.
  // 예전에는 DATA.dailyVerses 만 봐서 English 로 두고 5분 쉬면
  // 갑자기 한글 구절이 화면을 덮었다. (두 목록은 같은 순서·같은 개수다)
  const list = State.lang === 'en' ? DATA.dailyVersesEn : DATA.dailyVerses;
  const verse = list[State.currentVerseIdx] || DATA.dailyVerses[State.currentVerseIdx];
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

// 자리를 채운 문구를 돌려준다 — tf('bibleWhere', {book:'요한복음', ch:3})
//
// 문구를 코드에서 이어 붙이면(`${book} ${ch}장`) 언어마다 어순이 달라 못 쓴다.
// 영어는 'John 3', 한국어는 '요한복음 3장' 이라 붙이는 자리가 다르다.
// 문구 전체를 ui 표에 두고 {이름} 만 갈아 끼우면 어순이 그 표에 담긴다.
function tf(key, vals) {
  let s = t(key);
  Object.entries(vals || {}).forEach(([k, v]) => {
    s = s.split('{' + k + '}').join(String(v));
  });
  return s;
}

// 그림글자 span 을 남기고 글자만 바꾼다.
// '<span>📖</span>매일 말씀으로...' 처럼 그림글자가 형제 노드로 있는 곳에서
// textContent 로 덮으면 그림글자까지 사라진다.
function setI18nText(el, text) {
  const last = el.lastChild;
  if (last && last.nodeType === 3 && el.childNodes.length > 1) last.nodeValue = text;
  else el.textContent = text;
}

function toggleLang() {
  State.lang = State.lang === 'ko' ? 'en' : 'ko';
  Store.save('lang', State.lang);
  applyLangUI();
  renderAll();
}

// 볼드 모드 — 어르신들이 글씨를 더 굵게 보고 싶을 때
function toggleBold() {
  const isBold = document.body.classList.toggle('bold-mode');
  Store.save('boldMode', isBold);
  const btn = document.getElementById('bold-toggle-btn');
  if (btn) btn.style.fontWeight = isBold ? '900' : '600';
}

// index.html 에 박힌 글을 언어에 맞게 갈아 끼운다.
//
// 예전에는 이 함수가 온보딩과 탭 이름만 건드려서, English 를 눌러도 화면
// 대부분이 한국어로 남았다. 이제 HTML 쪽에 data-i18n="열쇠말" 을 달아 두고
// 여기서 한 번에 훑는다 — 새 글을 넣을 때 코드를 고칠 일이 없다.
//
//   data-i18n       글자를 바꾼다 (그림글자 형제는 남긴다)
//   data-i18n-html  <b> · <br> 이 든 문구 (innerHTML)
//   data-i18n-ph    입력칸의 placeholder
//   data-i18n-aria  aria-label (눈으로 안 보이지만 읽어주는 글)
function applyI18nAttrs() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    setI18nText(el, t(el.dataset.i18n));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
}

function applyLangUI() {
  const ui = DATA.ui[State.lang];
  // HTML 에 표시해 둔 곳을 먼저 한 번에 (아래 손으로 챙기는 곳은 그 예외들)
  applyI18nAttrs();
  document.documentElement.setAttribute('lang', State.lang === 'en' ? 'en' : 'ko');

  // 언어 토글 버튼 텍스트
  const btn = document.getElementById('lang-toggle-btn');
  if (btn) btn.textContent = ui.langToggle;
  const obBtn = document.getElementById('ob-lang-btn');
  if (obBtn) obBtn.textContent = ui.langToggle;

  // 탭 라벨 — 일곱 개 모두. 예전엔 '역사' 가 빠져 영어에서도 한글로 남았다
  const tabKeys = {
    home: 'tabHome', word: 'tabWord', story: 'tabStory', hymn: 'tabHymn',
    prayer: 'tabPrayer', gratitude: 'tabGratitude', album: 'tabAlbum'
  };
  Object.entries(tabKeys).forEach(([tab, key]) => {
    const el = document.querySelector(`.tab-btn[data-tab="${tab}"] .tab-label`);
    if (el) el.textContent = ui[key];
  });

  // 글씨 크기 버튼들 — 라벨이 언어에 따라 달라진다
  applyBibleFontSize();
  applyImmFontSize();
  applyStoryFontSize();
  if (typeof applyGameFontSize === 'function') applyGameFontSize();
  // 말로 쓰기·읽어주기 버튼도 언어를 따라간다
  if (typeof Voice !== 'undefined' && Voice.relabel) Voice.relabel();
  // 그림의 대체글(alt) — 예전에는 시작할 때 한 번만 정해서, English 로
  // 바꿔도 읽어주는 기계에는 '예수님' 이라고 그대로 남아 있었다
  applyCharacter();

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

  // 연령대 칸이 있던 자리 — 이제 어린아이와 같이 들어가는 말씀 한 줄이다.
  // 낱말이 줄 끝에서 갈리지 않게 setPhrase 로 넣는다
  // ('하나님의 나라를 받아들이지 않는' 이 갈리면 뜻이 흔들린다)
  setPhrase('ob-welcome-verse', ui.obWelcomeVerse);
  setEl('ob-welcome-ref', ui.obWelcomeRef);
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
// 날짜 — 언어에 따라 어순이 다르다.
// 한국어: 2026년 7월 30일 (목) / 영어: Thu, July 30, 2026
// 틀은 ui 표의 dateFmt 에 있고 여기서는 자리만 채운다.
function formatDate(d) {
  if (!(d instanceof Date) || isNaN(d)) return '';
  const ui = DATA.ui[State.lang] || DATA.ui.ko;
  const days = ui.weekdays || ['일','월','화','수','목','금','토'];
  const months = ui.months || [];
  return tf('dateFmt', {
    y: d.getFullYear(),
    m: d.getMonth() + 1,
    mn: months[d.getMonth()] || String(d.getMonth() + 1),
    d: d.getDate(),
    w: days[d.getDay()]
  });
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

// ─── 시대 이름·연대 ───────────────────────────────────────
// 연대는 데이터에 한글로만 있다 ('기원전 2100–1700'). 숫자는 그대로 두고
// 앞머리만 바꿔 쓴다 — 시대마다 영어 연대를 또 적어 두면 숫자가 어긋날 수 있다.
function eraName(era) { return (State.lang === 'en' && era.eraEn) ? era.eraEn : era.era; }
function eraBooks(era) { return (State.lang === 'en' && era.booksEn) ? era.booksEn : era.books; }
function eraPeriodShort(era) {
  // '기원전 4 – 기원후 30년' → 'BC 4 – AD 30'
  // '년' 을 지우는 것도 잊지 말 것 — 예전에는 'AD 30년' 이 그대로 남아서
  // English 화면 시대 칩에 한글 한 자가 붙어 있었다.
  return String(era.period || '')
    .replace(/기원전\s*/g, 'BC ')
    .replace(/기원후\s*/g, 'AD ')
    .replace(/년/g, '')
    .trim();
}
function eraPeriod(era) {
  // 칩은 좁아서 언제나 짧게 쓰고, 타임라인은 한국어일 때만 원문을 쓴다
  return State.lang === 'en' ? eraPeriodShort(era) : era.period;
}

// 핵심 구절 출처를 지금 언어로 — '창세기 1:1' → 'Genesis 1:1'
//
// 시대마다 영어 출처를 또 적어 두지 않는다. 성경읽기가 이미 66권의 한글·영어
// 이름을 갖고 있으니 그것을 쓴다 — 한 곳에만 적어 두면 어긋날 일이 없다.
// 한글 책 이름에는 숫자가 없어서 첫 숫자 앞까지를 책 이름으로 본다.
// (띄어쓰기는 무시한다: 이야기 쪽은 '예레미야애가', 성경읽기는 '예레미야 애가')
function storyVerseRef(ref) {
  const raw = String(ref || '');
  if (State.lang !== 'en' || typeof BIBLE === 'undefined') return raw;
  const m = raw.match(/^([^\d]+)(.*)$/);
  if (!m) return raw;
  const flat = m[1].replace(/\s+/g, '');
  const book = BIBLE.books.find(b => b.t.replace(/\s+/g, '') === flat);
  return (book && book.e) ? (book.e + ' ' + m[2].trim()) : raw;
}

// ─── 시대 칩 (가로 스크롤) ───────────────────────────────
function renderEraChips() {
  const el = document.getElementById('era-scroll');
  if (!el) return;
  el.innerHTML = BIBLE_STORY.eras.map((era, i) => `
    <button class="era-chip ${i === StoryState.currentEraIdx ? 'active' : ''}"
      onclick="selectEra(${i})">
      <div class="era-chip-icon">${era.icon}</div>
      <div class="era-chip-label">${escHtml(eraName(era))}</div>
      <div class="era-chip-period">${escHtml(eraPeriodShort(era))}</div>
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
        <div class="timeline-era">${escHtml(eraName(era))}</div>
        <div class="timeline-books">${escHtml(eraBooks(era))}</div>
        <div class="timeline-period">${escHtml(eraPeriod(era))}</div>
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
        <div class="story-hero-period">${escHtml(eraPeriod(era))} · ${escHtml(eraBooks(era))}</div>
        <div class="story-hero-era">${escHtml(eraName(era))}</div>
        <div class="story-hero-tagline">${escHtml(lang === 'en' ? (era.taglineEn || era.tagline) : era.tagline)}</div>
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
        <div class="story-verse-text">${escHtml(lang === 'en' ? (v.textEn || v.text) : v.text)}</div>
        <div class="story-verse-ref">${escHtml(storyVerseRef(v.ref))}</div>
        ${lang === 'ko' ? `<div class="story-verse-en">${escHtml(v.textEn)}</div>` : ''}
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
          <div class="modern-card-title">${escHtml(lang === 'en' && m.titleEn ? m.titleEn : m.title)}</div>
          <div class="modern-card-text">${escHtml(lang === 'en' && m.bodyEn ? m.bodyEn : m.body)}</div>
        </div>
      </div>
    `).join('');
  }

  // TTS 라벨
  const ttsLabel = document.getElementById('tts-label');
  if (ttsLabel) ttsLabel.textContent = `🔊 ${t('ttsRead')} — ${eraName(era)}`;

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
  { v: '14px', lh: '1.9', w: '400' },
  { v: '18px', lh: '1.85', w: '500' },
  { v: '22px', lh: '1.8', w: '700' }
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
    body.style.fontWeight = size.w;
  }
  const pane = document.getElementById('tab-story');
  if (pane) {
    pane.style.setProperty('--story-fs', size.v);
    pane.style.setProperty('--story-fw', size.w);
  }

  const btn = document.getElementById('story-size-btn');
  if (btn) btn.textContent = fontSizeLabel(idx);
}

// ─── 진도 업데이트 ───────────────────────────────────────
function updateStoryProgress() {
  const done = StoryState.readEras.size;
  const total = BIBLE_STORY.eras.length;
  const pct = Math.round(done / total * 100);
  const bar = document.getElementById('story-progress-bar');
  const label = document.getElementById('story-progress-label');
  if (bar) bar.style.width = pct + '%';
  if (label) label.textContent = tf('storyProgress', { done, total });
}

// ══════════════════════════════════════════════════════════
// TTS (Web Speech API — 브라우저 내장 읽어주기)
// ══════════════════════════════════════════════════════════

// 성경 구절 표기를 읽는 말로 바꾼다 — '창세기 1:1' → '창세기 1장 1절'.
//
// 폰의 읽어주기는 1:1 을 시계로 본다. 어머니께는 "창세기 한 시 일 분" 으로
// 들렸다. 구절의 : 는 시각이 아니라 장과 절을 가르는 기호다.
// 앞 숫자에는 '장', 뒤 숫자에는 '절' 을 붙여 읽게 한다.
//
// 붙여 읽는 꼴도 함께 다룬다:
//   창세기 1:1      → 창세기 1장 1절
//   시편 121:1-2    → 시편 121장 1절에서 2절
//   예레미야애가 3:22-23 → 예레미야애가 3장 22절에서 23절
//   살전 5:16-18    → 살전 5장 16절에서 18절   (축약형도 그대로 통한다)
//
// 책 이름 목록에 기대지 않고 '숫자:숫자' 꼴만 본다. 이 앱은 온전한 이름
// (창세기·데살로니가전서)과 축약형(살전·눅·느)을 섞어 쓰므로, 66권 이름으로
// 맞추려 하면 절반을 놓친다 (세어 봤다: 축약형이 스물 몇 군데다).
// 대신 앞에 낱말이 있는지 보고, 시각을 가리키는 말이면 비켜 간다.
//
// 영어로 읽을 때는 손대지 않는다 — 영어 읽어주기는 'Genesis 1:1' 을
// 이미 "chapter one verse one" 에 가깝게 읽고, 'chapter'·'verse' 를
// 한국어로 붙이면 뒤섞인다.

// 이 말 뒤의 숫자:숫자 는 시각이다 — '오후 3:30' 을 "3장 30절" 로
// 읽으면 안 된다. 지금 앱 글에는 이런 표기가 없지만, 나중에 누가
// "저녁 6:00 예배" 같은 안내를 넣을 수 있어 미리 비켜 둔다.
// ⚠ '시' 만 적으면 '시각' 이 빠져나간다 (시험에서 걸렸다). 낱말 전체로 적는다.
const TIME_WORDS = /^(오전|오후|아침|저녁|밤|새벽|정오|낮|시|시각|시간|무렵|경)$/;

function speakBibleRefs(text) {
  const s = String(text == null ? '' : text);
  if (State.lang === 'en') return s;
  return s.replace(
    // 앞: 책 이름의 끝 낱말(한글·영문). 그게 없으면(그냥 10:14) 시각으로 보고 둔다.
    // 뒤: 절 하나 또는 '절-절'. 하이픈은 -(빼기) · –(엔) · ~ 를 다 받는다.
    /([가-힣A-Za-z]+)\s*(\d+):(\d+)(?:\s*[-–~]\s*(\d+))?/g,
    (m, before, chap, from, to) => {
      if (TIME_WORDS.test(before)) return m;      // 시각이다 — 그대로 둔다
      return `${before} ${chap}장 ${from}절` + (to ? `에서 ${to}절` : '');
    }
  );
}

function getTtsText() {
  const era = BIBLE_STORY.eras[StoryState.currentEraIdx];
  const lang = State.lang;
  const story = lang === 'en' ? era.storyEn : era.story;
  // ** 마크다운 제거
  const clean = story.replace(/\*\*/g, '');
  const verseText = era.keyVerses.map(v =>
    `${storyVerseRef(v.ref)}. ${lang === 'en' ? (v.textEn || v.text) : v.text}`
  ).join('. ');
  return `${eraName(era)}. ${clean} ${t('ttsKeyVerses')}. ${verseText}`;
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
  // 구절 표기를 읽는 말로 바꾼 뒤에 자른다.
  // ★ 여기서 하는 까닭 — 읽어주기는 두 곳에서 시작한다(역사 이야기의
  //   startTts, 내가 쓴 기도의 PrayerVoice.read). 두 곳이 다 이 함수를
  //   지나가므로 한 군데만 고쳐도 둘 다 따라온다. 부르는 쪽마다 붙이면
  //   나중에 세 번째 읽어주기가 생길 때 빠뜨린다.
  //   자르기 전에 해야 한다 — '1:1' 이 조각 경계에 걸리면 못 알아본다.
  const spoken = typeof speakBibleRefs === 'function' ? speakBibleRefs(text) : text;
  // 문장 끝(. ! ? 뒤 공백)에서 끊는다. 한국어는 마침표가 잘 붙어 있다.
  const sentences = String(spoken).replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/);

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
      showToast(t('ttsUnsupported'));
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
    showToast(t('ttsUnsupported'));
    return;
  }
  stopTts();

  StoryState.ttsQueue = splitForTts(getTtsText());
  StoryState.ttsIndex = 0;
  if (!StoryState.ttsQueue.length) return;

  StoryState.ttsActive = true;
  updateTtsBtn();
  showToast(t('ttsReading'));
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
    showToast(t('ttsDone'));
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
    showToast(t('ttsFailed'));
  };

  StoryState.ttsUtterance = utter;
  try {
    window.speechSynthesis.speak(utter);
  } catch (e) {
    StoryState.ttsActive = false;
    updateTtsBtn();
    showToast(t('ttsFailed'));
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
  if (!btn) return;
  btn.textContent = StoryState.ttsActive ? '⏸' : '▶';
  btn.setAttribute('aria-label', StoryState.ttsActive ? t('ttsPauseAria') : t('ttsPlayAria'));
  const fill = document.getElementById('tts-progress-fill');
  if (!fill) return;
  const total = StoryState.ttsQueue && StoryState.ttsQueue.length;
  const pct = total ? Math.round(StoryState.ttsIndex / total * 100) : 0;
  fill.style.width = pct + '%';
}

function seekTts(e) {
  const track = document.getElementById('tts-progress-track');
  if (!track) return;
  const total = StoryState.ttsQueue && StoryState.ttsQueue.length;
  if (!total) return;
  const pct = e.offsetX / track.offsetWidth;
  const idx = Math.max(0, Math.min(total - 1, Math.floor(pct * total)));
  const wasActive = StoryState.ttsActive;
  const queue = StoryState.ttsQueue;
  stopTts();
  if (wasActive || StoryState.ttsPaused) {
    StoryState.ttsQueue = queue;
    StoryState.ttsIndex = idx;
    StoryState.ttsActive = true;
    updateTtsBtn();
    speakTtsChunk();
  }
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
    hint.textContent = n ? tf('countUnit', { n }) : '';
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

// ─── 데이터 백업/복원 ────────────────────────────────────
function exportData() {
  try {
    // localStorage에서 모든 앱 데이터 수집
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      gratitude: State.gratitude || [],
      prayers: State.prayers || [],
      immanuel: State.immanuel || [],
      memories: State.memories || { people: [], myVerses: [], myFaith: {} },
      bibleBook: State.bibleBook,
      bibleChapter: State.bibleChapter,
      bibleLast: State.bibleLast,
      user: State.user
    };

    // JSON 파일로 다운로드
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alwaysjoy-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('✅ 백업 파일이 다운로드되었습니다');
  } catch (e) {
    console.error('백업 실패:', e);
    showToast('❌ 백업에 실패했습니다');
  }
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      // 확인 메시지
      if (!confirm(`백업 파일을 불러오시겠습니까?\n\n내보낸 날짜: ${new Date(data.exportDate).toLocaleString('ko-KR')}\n감사 기록: ${data.gratitude?.length || 0}개\n기도 제목: ${data.prayers?.length || 0}개\n임마누엘 일기: ${data.immanuel?.length || 0}개\n\n⚠️ 현재 데이터를 덮어씁니다!`)) {
        input.value = '';
        return;
      }

      // 데이터 복원
      if (data.gratitude) {
        State.gratitude = data.gratitude;
        Store.save('gratitude', data.gratitude);
      }
      if (data.prayers) {
        State.prayers = data.prayers;
        Store.save('prayers', data.prayers);
      }
      if (data.immanuel) {
        State.immanuel = data.immanuel;
        Store.save('immanuel', data.immanuel);
      }
      if (data.memories) {
        State.memories = data.memories;
        Store.save('memories', data.memories);
      }
      if (data.bibleBook) State.bibleBook = data.bibleBook;
      if (data.bibleChapter) State.bibleChapter = data.bibleChapter;
      if (data.bibleLast) {
        State.bibleLast = data.bibleLast;
        Store.save('bibleLast', data.bibleLast);
      }
      if (data.user) {
        State.user = data.user;
        Store.save('user', data.user);
      }

      showToast('✅ 데이터를 불러왔습니다! 페이지를 새로고침합니다...');
      setTimeout(() => location.reload(), 1500);
    } catch (e) {
      console.error('불러오기 실패:', e);
      showToast('❌ 파일을 읽을 수 없습니다');
    }
    input.value = '';
  };
  reader.readAsText(file);
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

