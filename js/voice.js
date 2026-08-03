// ===== 항상기쁨 — 말로 쓰기 · 읽어주기 =====
//
// 어르신은 글자판으로 긴 기도를 쓰기 어렵다. 말씀하시면 받아적고,
// 쓴 기도를 다시 읽어드린다.
//
// 브라우저에 들어 있는 음성인식(SpeechRecognition)을 쓴다. 따로 서버가
// 필요하지 않지만, 알아듣는 일은 구글/애플 서버에서 하므로 인터넷이 있어야
// 한다. 이 앱은 원래 인터넷 없이도 도는 앱이라, 마이크는 "안 되면 조용히
// 숨는다" 를 원칙으로 했다 — 눌러도 아무 일이 없는 버튼은 고장으로 보인다.
//
// 어르신 말씀을 받아적을 때 가장 큰 문제는 알아듣는 정확도가 아니라
// '쉬는 동안 녹음이 꺼진다'는 점이다. 천천히 말씀하시다 잠깐 숨을 고르면
// 브라우저가 "말이 끝났다" 고 보고 인식을 끝낸다. 그래서 아래 onend 에서
// 스스로 다시 켠다 (Voice.wantStop 이 아닐 때만).

const Voice = {
  // ── 상태 ──
  rec: null,          // SpeechRecognition 객체
  target: null,       // 지금 받아쓰는 입력칸 (input/textarea)
  baseText: '',       // 마이크를 켤 때 이미 적혀 있던 글 — 절대 지우지 않는다
  finalText: '',      // 이번에 받아적어 확정된 글
  wantStop: false,    // 사용자가 '그만' 을 눌렀는지
  restarts: 0,        // 스스로 다시 켠 횟수 (끝없이 되살아나는 걸 막는다)
  restartAt: 0,       // 마지막으로 다시 켠 시각
  undoText: null,     // '다듬기' 되돌리기용 — 다듬기 직전의 글
  undoTarget: null,
  hold: null,         // 붙잡아 둔 마이크 스트림 (아래 _holdMic 설명)
  starting: false,    // 마이크 허용을 기다리는 중 (두 번 켜지는 걸 막는다)
  gen: 0,             // 켠 차례 번호 — 기다리는 사이에 딴 칸을 누르셨는지 안다

  // 스스로 다시 켤 수 있는 한도. 넉넉히 두되 무한은 아니다 —
  // 권한이 막힌 폰에서는 켜기/끝나기가 순식간에 반복될 수 있다.
  MAX_RESTARTS: 60,

  // ── 마이크를 붙잡아 둔다 (허용 창이 문장마다 뜨는 것을 막는다) ──
  //
  // 증상: 한 문장 말씀하고 쉬면 브라우저가 인식을 끝내고, _onEnd() 가 다시
  // 켠다. 그런데 다시 켤 때마다 새 녹음이 시작되므로 브라우저가 "마이크를
  // 쓰겠습니까" 를 또 묻는다. 어르신은 문장마다 허용을 누르셔야 했다.
  //
  // 고치는 법: 받아쓰기를 켤 때 getUserMedia 로 마이크를 한 번 열고 그
  // 스트림을 **말씀이 끝날 때까지 놓지 않는다**. 브라우저는 "지금 쓰고 있는
  // 중" 으로 보아 다시 묻지 않는다. 그만 누르시면 그때 놓는다.
  //
  // getUserMedia 가 없는 폰에서도 받아쓰기 자체는 되어야 하므로,
  // 실패하면 붙잡기만 건너뛰고 그대로 진행한다.
  //
  // 돌려주는 값: 'ok' 붙잡았다 · 'none' 이 브라우저엔 그 기능이 없다
  //              · 'denied' 어르신이 허용을 안 하셨다
  // 셋을 구분하는 이유는 'denied' 일 때만 지금 바로 말씀드려야 하기 때문이다.
  // 'none' 은 아무 말도 하지 않는다 — 잘 될 수도 있는데 겁을 줄 일이 아니다.
  async _holdMic() {
    if (this.hold) return 'ok';                    // 이미 붙잡고 있다
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return 'none';
      this.hold = await navigator.mediaDevices.getUserMedia({ audio: true });
      return 'ok';
    } catch (e) {
      this.hold = null;
      const kind = (e && e.name) || '';
      return (kind === 'NotAllowedError' || kind === 'SecurityError') ? 'denied' : 'none';
    }
  },

  _releaseMic() {
    const s = this.hold;
    this.hold = null;
    if (!s) return;
    try { s.getTracks().forEach(t => t.stop()); } catch (e) {}
  },

  // ── 쓸 수 있는 폰인지 ──
  // 카카오톡 인앱 브라우저처럼 음성인식이 아예 없는 곳이 있다.
  // https 가 아니면 (localhost 제외) 브라우저가 마이크를 막는다.
  ctor() {
    try {
      return window.SpeechRecognition || window.webkitSpeechRecognition || null;
    } catch (e) { return null; }
  },

  secure() {
    try {
      if (window.isSecureContext) return true;
      // 파일로 열었거나 http 면 마이크를 못 쓴다
      return location.protocol === 'https:' || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    } catch (e) { return false; }
  },

  available() { return !!this.ctor() && this.secure(); },

  listening() { return !!this.rec && !this.wantStop; },

  // ── 켜기 / 끄기 ──────────────────────────────────────────
  // el: 받아쓸 입력칸. 같은 칸을 다시 누르면 끈다 (토글).
  toggle(el) {
    // 허용 창이 떠 있는 사이에 또 누르셨으면 아무 일도 하지 않는다.
    // 그렇지 않으면 켜기가 둘 겹쳐 하나가 미아가 된다.
    if (this.starting) return;
    if (this.rec) {
      const same = this.target === el;
      this.stop();
      if (same) return;     // 같은 칸을 또 눌렀으면 끄기만 한다
    }
    this.start(el);
  },

  // ★ 인식을 켜기 **전에** 마이크를 붙잡는다. 순서가 뒤바뀌면 허용 창이
  // 두 번 뜨고, 쉴 때마다 또 뜬다 (어르신이 문장마다 허용을 누르셔야 했다).
  //
  // 붙잡기는 기다려야 하는 일이라 여기서 한 박자 늦어진다. 그래서 붙잡을
  // 것이 없을 때(getUserMedia 가 없는 브라우저, 또는 이미 붙잡아 둔 때)는
  // 기다리지 않고 곧바로 켠다 — 괜히 늦추면 버튼이 늦게 빨개져서
  // 어르신은 "안 눌렸나?" 하고 또 누르신다.
  start(el) {
    if (!el) return;
    if (!this.ctor()) { this._say(t('micUnsupported')); return; }
    if (!this.secure()) { this._say(t('micInsecure')); return; }
    if (!navigator.onLine) { this._say(t('micOffline')); return; }

    const canHold = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    // 붙잡을 것이 없거나 이미 붙잡고 있으면 기다릴 이유가 없다.
    // 붙잡기에 실패하는 폰(아이폰 사파리 등)에서도 받아쓰기 자체는 되므로
    // 그대로 켠다 — 그 폰에서는 예전처럼 문장마다 물을 수 있지만,
    // 아예 안 되는 것보다는 낫다.
    if (!canHold || this.hold) { this._begin(el); return; }

    const mine = ++this.gen;
    this.starting = true;
    this.wantStop = false;
    this._holdMic().then(held => {
      if (this.gen === mine) this.starting = false;
      // 기다리는 사이에 '그만' 을 누르거나 딴 칸을 누르셨으면 여기서 접는다
      if (this.gen !== mine || this.wantStop) { if (!this.rec) this._releaseMic(); return; }
      // 허용을 안 하셨으면 인식을 켜지 않는다. 켜 봐도 같은 오류가 날 뿐이고,
      // 그 사이 버튼이 잠깐 빨개져서 "켜졌나?" 하고 헷갈리신다.
      if (held === 'denied') { this._say(t('micDenied')); return; }
      this._begin(el);
    });
  },

  // 실제로 인식을 켠다. start() 가 마이크를 챙긴 뒤에만 불린다.
  _begin(el) {
    const Ctor = this.ctor();
    if (!Ctor) return;

    let rec;
    try { rec = new Ctor(); } catch (e) { this._releaseMic(); this._say(t('micNoStart')); return; }

    this.rec = rec;
    this.target = el;
    this.baseText = el.value || '';
    this.finalText = '';
    this.wantStop = false;
    this.restarts = 0;

    rec.lang = (typeof State !== 'undefined' && State.lang === 'en') ? 'en-US' : 'ko-KR';
    // 말씀이 길 테니 이어서 계속 듣는다. 아이폰은 continuous 를 무시하지만
    // 그래도 아래 onend 의 자동 재시작이 같은 일을 해 준다.
    rec.continuous = true;
    // 말하는 중에도 화면에 글이 차오르게 — 어르신이 "듣고 있구나" 를
    // 눈으로 확인하셔야 계속 말씀하신다.
    rec.interimResults = true;
    // 후보를 여럿 받아 두면 아래에서 기독교 낱말이 든 쪽을 고를 수 있다
    rec.maxAlternatives = 3;

    rec.onresult = e => this._onResult(e);
    rec.onerror = e => this._onError(e);
    rec.onend = () => this._onEnd();

    try { rec.start(); }
    catch (e) {
      // 이미 켜져 있을 때 start() 를 부르면 예외가 난다
      this.rec = null; this.target = null;
      this._releaseMic();
      this._say(t('micAlreadyOn'));
      return;
    }
    this._paint();
    this._say(t('micSpeak'));
  },

  stop() {
    this.wantStop = true;
    // 차례를 올려 두면, 허용을 기다리는 중인 start() 가 깨어나서 스스로 접는다
    this.gen++;
    this.starting = false;
    const rec = this.rec;
    this.rec = null;
    if (rec) {
      try { rec.onend = null; rec.onresult = null; rec.onerror = null; } catch (e) {}
      // abort 는 즉시 끊고, stop 은 마지막 결과를 기다린다.
      // 여기서는 이미 받은 글을 칸에 넣어 둔 상태라 즉시 끊어도 손실이 없다.
      try { rec.stop(); } catch (e) { try { rec.abort(); } catch (e2) {} }
    }
    // 붙잡아 둔 마이크를 여기서 놓는다. 안 놓으면 녹음 표시가 계속 켜져 있고
    // 어르신은 앱이 몰래 듣는 줄 아신다.
    this._releaseMic();
    this._clearInterim();
    this._paint();
  },

  // ── 받아적기 ────────────────────────────────────────────
  _onResult(e) {
    const el = this.target;
    if (!el) return;

    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const res = e.results[i];
      const said = this._pickAlternative(res);
      if (res.isFinal) this.finalText = this._join(this.finalText, said);
      else interim = this._join(interim, said);
    }

    // 확정된 글만 칸에 넣는다. 아직 확정 안 된 글은 칸 아래에 흐리게 —
    // 칸에 바로 넣으면 인식이 바뀔 때마다 글자가 춤춰서 눈이 어지럽다.
    el.value = this._join(this.baseText, this.finalText);
    this._showInterim(interim);
    // 긴 기도는 칸을 넘어가니 늘 방금 받아적은 데가 보이게 내려 준다
    try { el.scrollTop = el.scrollHeight; } catch (err) {}
  },

  // 후보 여럿 가운데 기독교 낱말이 제대로 들어간 쪽을 고른다.
  // '주님' 을 '주민' 으로 알아듣는 일이 잦은데, 2순위 후보에는 제대로
  // 들어 있는 경우가 있다. 없으면 그냥 1순위를 쓴다.
  _pickAlternative(res) {
    const first = (res[0] && res[0].transcript) || '';
    if (res.length < 2) return first;
    const good = /하나님|주님|예수|성령|아멘|할렐루야|은혜|찬양|기도/;
    if (good.test(first)) return first;
    for (let i = 1; i < res.length; i++) {
      const alt = (res[i] && res[i].transcript) || '';
      if (good.test(alt)) return alt;
    }
    return first;
  },

  // 조각을 이어 붙인다 — 사이에 공백 하나만 두고, 앞뒤 군더더기는 정리
  _join(a, b) {
    const left = String(a || '').replace(/\s+$/, '');
    const right = String(b || '').replace(/^\s+/, '');
    if (!left) return right;
    if (!right) return left;
    return left + ' ' + right;
  },

  _onError(e) {
    const kind = (e && e.error) || '';
    // 잠깐 말이 없었던 것뿐이면 아무 말도 하지 않는다 — 어르신이 생각을
    // 고르는 중일 뿐인데 오류가 뜨면 그만두시게 된다.
    if (kind === 'no-speech' || kind === 'aborted') return;
    if (kind === 'not-allowed' || kind === 'service-not-allowed') {
      this.wantStop = true;
      this._say(t('micDenied'));
    } else if (kind === 'network') {
      this.wantStop = true;
      this._say(t('micNetLost'));
    } else if (kind === 'audio-capture') {
      this.wantStop = true;
      this._say(t('micNoDevice'));
    }
  },

  // 쉬는 동안 꺼진 인식을 스스로 다시 켠다.
  //
  // 이게 이 기능의 핵심이다. 브라우저는 2~3초만 조용해도 인식을 끝내는데,
  // 어르신은 한 문장 말씀하고 한참 숨을 고르신다. 다시 켜지 않으면
  // "말했는데 안 적힌다" 가 되어 기능 자체가 쓸모없어진다.
  _onEnd() {
    if (this.wantStop || !this.rec) { this.rec = null; this._paint(); return; }

    if (this.restarts >= this.MAX_RESTARTS) {
      this.wantStop = true; this.rec = null;
      this._clearInterim(); this._paint();
      this._say(t('micPaused'));
      return;
    }
    this.restarts++;
    this.restartAt = Date.now();
    try { this.rec.start(); }
    catch (e) {
      // 곧바로 다시 못 켜는 폰이 있어 한 박자 쉬고 한 번 더 시도한다
      setTimeout(() => {
        if (this.wantStop || !this.rec) return;
        try { this.rec.start(); }
        catch (e2) {
          this.wantStop = true; this.rec = null;
          this._clearInterim(); this._paint();
        }
      }, 350);
    }
  },

  // ── 화면 표시 ───────────────────────────────────────────
  // 듣고 있는 칸의 버튼만 빨갛게, 나머지는 원래대로
  _paint() {
    const on = this.listening();
    document.querySelectorAll('.mic-btn').forEach(b => {
      // 다듬기 버튼도 .mic-btn 이라 여기 걸린다 — 그 버튼은 건드리지 않는다
      if (!b.dataset.mic) return;
      const mine = on && b.dataset.mic === (this.target && this.target.id);
      b.classList.toggle('on', mine);
      b.setAttribute('aria-pressed', mine ? 'true' : 'false');
      const word = mine ? t('micStop') : t('micWrite');
      const lab = b.querySelector('.mic-btn-label');
      if (lab) lab.textContent = word; else b.title = word;
      b.setAttribute('aria-label', word);
    });
    document.querySelectorAll('.mic-live').forEach(d => {
      const mine = on && d.dataset.mic === (this.target && this.target.id);
      d.classList.toggle('show', mine);
      if (!mine) d.textContent = '';
    });
  },

  _showInterim(text) {
    const el = this._liveBox();
    if (!el) return;
    el.textContent = text ? text : t('micListening');
  },

  // ── 언어를 바꿨을 때 ────────────────────────────────────
  // 마이크 · 다듬기 · 읽어주기 단추는 JS 가 만들어 붙인 것이라
  // data-i18n 이 없다. applyLangUI() 가 이것을 불러 준다.
  // 다시 만들지 않고 글씨만 바꾼다 — 다시 만들면 쓰고 있던 글이 날아간다.
  relabel() {
    this._paint();
    document.querySelectorAll('.mic-btn.tidy').forEach(b => {
      const lab = b.querySelector('.mic-btn-label');
      if (lab) lab.textContent = t('tidyBtn');
      b.setAttribute('aria-label', t('tidyAria'));
    });
    if (typeof PrayerVoice !== 'undefined') PrayerVoice._paint();
  },

  _clearInterim() {
    document.querySelectorAll('.mic-live').forEach(d => {
      d.classList.remove('show'); d.textContent = '';
    });
  },

  _liveBox() {
    if (!this.target) return null;
    return document.querySelector('.mic-live[data-mic="' + this.target.id + '"]');
  },

  _say(msg) { if (typeof showToast === 'function') showToast(msg); },
};

// ─── 철자 다듬기 ──────────────────────────────────────────
//
// 음성인식은 '소리나는 대로' 적어 주지만, 기도문에 자주 나오는 낱말을
// 엉뚱하게 적는다. 특히
//   · 붙여 써야 할 말을 띄운다  — '하나님 아버지' 는 맞지만 '주 님' 은 틀림
//   · 소리가 닮은 낱말로 바꾼다 — '주님' → '주민', '은혜' → '은해'
//   · 성경 이름을 띄운다        — '요한 복음' → '요한복음'
//
// 아래 표는 그중 확실한 것만 담았다. 애매한 것은 넣지 않았다 —
// 어르신이 직접 쓴 글을 함부로 바꾸는 쪽이 훨씬 나쁘다.
// 그래서 이 기능은 저절로 돌지 않고, '다듬기' 를 누를 때만 돈다.
const VOICE_FIX = [
  // ── 소리가 닮아 잘못 적히는 말 ──
  // '주민' 은 '주민센터/주민등록' 처럼 진짜로 쓸 수 있어 그때는 두고,
  // 그 밖에는 기도문에서 '주님' 일 가능성이 압도적이다.
  [/주민(?!\s*(센터|등록|번호|세|증))/g, '주님'],
  [/은해/g, '은혜'],
  [/여호아/g, '여호와'],
  [/할레루야|할렐루아|할레루아/g, '할렐루야'],
  [/성경님/g, '성령님'],
  [/아만(?=[\s.!?]|$)/g, '아멘'],
  [/예수임/g, '예수님'],
  [/성령임/g, '성령님'],
  [/하나임/g, '하나님'],
  [/기도 재목|기도제목이라|기도 제목/g, '기도제목'],

  // ── 붙여 써야 하는데 띄어진 말 ──
  [/하나\s+님/g, '하나님'],
  [/예수\s+님/g, '예수님'],
  [/주\s+님/g, '주님'],
  [/성령\s+님/g, '성령님'],
  [/아\s+멘(?=[\s.!?]|$)/g, '아멘'],
  [/십\s+자가/g, '십자가'],
  [/임마\s*누엘/g, '임마누엘'],
  [/감사\s+합니다/g, '감사합니다'],
  [/사랑\s+합니다/g, '사랑합니다'],
  [/찬양\s+합니다/g, '찬양합니다'],
  [/기도\s+합니다/g, '기도합니다'],
  [/하\s+소서/g, '하소서'],
  [/주\s+소서/g, '주소서'],
  [/하시\s*옵\s*소서/g, '하시옵소서'],
  [/하\s*옵\s*나이다/g, '하옵나이다'],

  // ── 성경 이름 ──
  [/([가-힣]{1,3})\s+복음/g, '$1복음'],
  [/시\s+편/g, '시편'],
  [/창세\s+기/g, '창세기'],
  [/출애\s*굽기/g, '출애굽기'],
  [/사도\s+행전/g, '사도행전'],
  [/([가-힣]{1,3})\s+서(?=[\s.!?]|$)/g, '$1서'],
];

// 받아적은 글을 사람이 읽기 좋게 다듬는다.
// 낱말 고치기 → 문장부호 → 공백 정리 순서로 한 번만 훑는다.
function tidyPrayerText(raw) {
  let s = String(raw == null ? '' : raw);
  if (!s.trim()) return s;

  for (const [re, to] of VOICE_FIX) s = s.replace(re, to);

  // 음성인식은 문장부호를 거의 안 넣는다. 기도문의 맺음말 뒤에는
  // 마침표를 넣어 주면 훨씬 읽기 좋다.
  s = s.replace(/(하소서|하옵나이다|하시옵소서|감사합니다|사랑합니다|찬양합니다|기도합니다|아멘)(?=\s|$)(?![.!?])/g, '$1.');

  // 문장부호 앞의 공백 제거, 뒤에는 공백 하나
  s = s.replace(/\s+([.,!?])/g, '$1').replace(/([.,!?])(?=[^\s.,!?])/g, '$1 ');
  // 공백은 하나로, 줄바꿈은 두 줄까지만 (문단은 남긴다)
  s = s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n');
  return s.split('\n').map(line => line.trim()).join('\n').trim();
}

// '다듬기' 버튼 — 되돌리기 한 번을 남겨 둔다.
// 어르신이 직접 쓴 표현을 앱이 바꿔 버렸을 때 되돌릴 길이 없으면 안 된다.
function tidyPrayerInput(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const before = el.value || '';
  if (!before.trim()) { showToast(t('tidyEmpty')); return; }

  // 이미 다듬어 둔 글을 또 누르면 되돌린다 (같은 버튼으로 왔다 갔다)
  if (Voice.undoTarget === id && Voice.undoText != null && Voice.undoText !== before) {
    el.value = Voice.undoText;
    Voice.undoText = null; Voice.undoTarget = null;
    showToast(t('tidyUndone'));
    return;
  }

  const after = tidyPrayerText(before);
  if (after === before) { showToast(t('tidyNothing')); return; }
  Voice.undoText = before;
  Voice.undoTarget = id;
  el.value = after;
  showToast(t('tidyDone'));
}

// ─── 내가 쓴 기도 읽어주기 ────────────────────────────────
//
// 역사 이야기의 읽어주기(StoryState)와 같은 speechSynthesis 를 쓰지만
// 상태는 따로 둔다 — 한쪽을 멈추면 다른 쪽도 멈추는 일을 막기 위해서다.
// 대신 시작할 때 서로를 멈춘다 (목소리 둘이 겹치면 아무것도 안 들린다).
const PrayerVoice = {
  queue: [],
  index: 0,
  active: false,
  targetId: null,

  toggle(id) {
    if (this.active) {
      const same = this.targetId === id;
      this.stop();
      if (same) return;
    }
    this.read(id);
  },

  read(id) {
    const el = document.getElementById(id);
    const text = (el && el.value || '').trim();
    if (!text) { showToast(t('tidyEmpty')); return; }
    if (typeof ttsAvailable !== 'function' || !ttsAvailable()
        || typeof SpeechSynthesisUtterance === 'undefined') {
      showToast(t('ttsUnsupported'));
      return;
    }
    // 역사 이야기 읽어주기가 돌고 있으면 멈춘다 — 목소리가 겹치면 안 된다
    if (typeof stopTts === 'function' && typeof StoryState !== 'undefined'
        && (StoryState.ttsActive || StoryState.ttsPaused)) stopTts();

    this.stop();
    // 폰의 speechSynthesis 는 한 번에 넘길 수 있는 길이가 짧아 조각내야 한다
    this.queue = typeof splitForTts === 'function' ? splitForTts(text) : [text];
    this.index = 0;
    if (!this.queue.length) return;
    this.active = true;
    this.targetId = id;
    this._paint();
    this._speak();
  },

  _speak() {
    if (!this.active || this.index >= this.queue.length) { this.stop(); return; }
    const u = new SpeechSynthesisUtterance(this.queue[this.index]);
    u.lang = (typeof State !== 'undefined' && State.lang === 'en') ? 'en-US' : 'ko-KR';
    // 어르신께는 느린 편이 낫다. 역사 이야기의 기본값과 같게 맞췄다.
    u.rate = 0.85;
    u.pitch = 1;
    const v = typeof pickTtsVoice === 'function' ? pickTtsVoice() : null;
    if (v) u.voice = v;
    u.onend = () => { if (this.active) { this.index++; this._speak(); } };
    // 한 조각이 실패해도 멈추지 않고 다음으로 넘어간다
    u.onerror = () => { if (this.active) { this.index++; this._speak(); } };
    try { window.speechSynthesis.speak(u); }
    catch (e) { this.stop(); }
  },

  stop() {
    this.active = false;
    this.queue = []; this.index = 0; this.targetId = null;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    this._paint();
  },

  _paint() {
    document.querySelectorAll('.read-btn').forEach(b => {
      const mine = this.active && b.dataset.read === this.targetId;
      b.classList.toggle('on', mine);
      b.setAttribute('aria-pressed', mine ? 'true' : 'false');
      const word = mine ? t('readAloudStop') : t('readAloud');
      const lab = b.querySelector('.mic-btn-label');
      if (lab) lab.textContent = word;
      b.setAttribute('aria-label', word);
    });
  },
};

// ─── 입력칸에 마이크 붙이기 ───────────────────────────────
//
// 기도·감사·임마누엘 일기의 모든 입력칸에 같은 방식으로 붙인다.
// 쓸 수 없는 폰에서는 아무것도 붙이지 않는다 — 눌러도 안 되는 버튼을
// 두면 어르신은 앱이 고장난 줄 아신다.
//
// full=true 면 '말로 쓰기 · 다듬기 · 읽어주기' 를 다 붙이고,
// 아니면 작은 마이크 하나만 붙인다 (감사 한 줄 칸처럼 좁은 곳).
function attachMic(inputId, opts) {
  const o = opts || {};
  const el = document.getElementById(inputId);
  if (!el) return;
  // 두 번 붙이지 않는다 (다시 그리는 화면에서 버튼이 쌓이는 걸 막는다)
  if (el.dataset.micAttached) return;
  if (!Voice.available()) return;
  el.dataset.micAttached = '1';

  const row = document.createElement('div');
  row.className = 'mic-row' + (o.full ? ' full' : '');

  const label = o.full ? `<span class="mic-btn-label">${escHtml(t('micWrite'))}</span>` : '';
  let html = `<button type="button" class="mic-btn" data-mic="${inputId}"
      aria-pressed="false" aria-label="${escHtml(t('micWrite'))}"
      onclick="Voice.toggle(document.getElementById('${inputId}'))">
      <span class="mic-btn-icon">🎤</span>${label}</button>`;

  if (o.full) {
    html += `<button type="button" class="mic-btn tidy"
        onclick="tidyPrayerInput('${inputId}')" aria-label="${escHtml(t('tidyAria'))}">
        <span class="mic-btn-icon">✨</span><span class="mic-btn-label">${escHtml(t('tidyBtn'))}</span></button>`;
    if (typeof ttsAvailable === 'function' && ttsAvailable()) {
      html += `<button type="button" class="mic-btn read-btn" data-read="${inputId}"
          aria-pressed="false" onclick="PrayerVoice.toggle('${inputId}')" aria-label="${escHtml(t('readAloud'))}">
          <span class="mic-btn-icon">🔊</span><span class="mic-btn-label">${escHtml(t('readAloud'))}</span></button>`;
    }
  }
  row.innerHTML = html;

  // 받아적히는 중인 말은 칸 아래 흐린 글씨로 — 확정되면 칸으로 옮겨 간다
  const live = document.createElement('div');
  live.className = 'mic-live';
  live.dataset.mic = inputId;
  live.setAttribute('aria-live', 'polite');

  el.insertAdjacentElement('afterend', live);
  live.insertAdjacentElement('afterend', row);
}

// 기도·감사·임마누엘의 모든 입력칸에 마이크를 붙인다.
// 임마누엘 다섯 칸은 JS 가 나중에 그리므로 그쪽에서도 이 함수를 부른다.
function attachAllMics() {
  if (!Voice.available()) return;
  // 기도 쓰기 — 가장 긴 글을 쓰는 곳이라 세 버튼을 모두 붙인다
  attachMic('prayer-textarea', { full: true });
  // 감사 한 줄 칸 — 좁으니 마이크만
  [1, 2, 3].forEach(n => attachMic('g-input-' + n, {}));
  // 임마누엘 일기 다섯 칸 — 말로 쓰기 + 읽어주기까지 있으면 좋은 곳이다
  (typeof DATA !== 'undefined' && DATA.immanuelSteps || []).forEach(s => {
    attachMic('imm-input-' + s.key, { full: true });
  });
}
