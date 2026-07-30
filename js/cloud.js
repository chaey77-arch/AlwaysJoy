// ═══════════════════════════════════════════════════════════
//  클라우드 — 내 이름으로 기록이 이어지게
//
//  Supabase 인증(카카오) + 데이터 동기화.
//
//  설계에서 가장 중요한 것: 오프라인 우선.
//  어르신 폰은 데이터가 끊기거나 느린 경우가 잦다. 그래서
//  ① 무엇을 쓰든 localStorage 에 먼저 저장해 화면은 즉시 반응하고
//  ② 인터넷이 될 때 서버로 올린다.
//  로그인을 안 해도 앱은 지금까지처럼 그대로 동작한다 (폰 안에만 쌓인다).
//
//  설정(글씨 크기·언어)은 기기마다 다를 수 있어 서버로 올리지 않는다.
// ═══════════════════════════════════════════════════════════

const CLOUD_CONFIG = {
  // Supabase 대시보드 → Project Settings → API 에서 복사
  url: '',       // 예: 'https://abcdefgh.supabase.co'
  anonKey: ''    // 예: 'eyJhbGciOi...'  (anon public 키 — 공개돼도 되는 키다)
};

const Cloud = {
  sb: null,          // Supabase 클라이언트
  user: null,        // 로그인한 사람
  ready: false,      // 설정과 라이브러리가 갖춰졌는지
  syncing: false,
  pendingTimer: null,

  // 설정이 채워져 있고 라이브러리가 실려 있으면 쓸 수 있다
  enabled() {
    return !!(CLOUD_CONFIG.url && CLOUD_CONFIG.anonKey
              && typeof supabase !== 'undefined' && supabase.createClient);
  },

  loggedIn() { return !!this.user; },

  // ─── 시작 ───────────────────────────────────────────────
  async init() {
    if (!this.enabled()) return false;   // 설정 전이면 조용히 지역 저장만 쓴다
    try {
      this.sb = supabase.createClient(CLOUD_CONFIG.url, CLOUD_CONFIG.anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      this.ready = true;

      const { data } = await this.sb.auth.getSession();
      this.user = data?.session?.user || null;

      // 로그인·로그아웃이 일어나면 화면과 데이터를 맞춘다
      this.sb.auth.onAuthStateChange((event, session) => {
        const was = this.user?.id || null;
        this.user = session?.user || null;
        renderCloudUI();
        // 사람이 바뀌었을 때만 내려받는다 (토큰 갱신마다 받지 않게)
        if (this.user && this.user.id !== was) this.syncAll();
      });

      renderCloudUI();
      if (this.user) await this.syncAll();
      return true;
    } catch (e) {
      // 서버가 죽었어도 앱은 계속 써야 한다
      console.warn('[cloud] 시작 실패 — 폰에만 저장합니다', e);
      this.ready = false;
      return false;
    }
  },

  // ─── 로그인 · 로그아웃 ──────────────────────────────────
  async signInKakao() {
    if (!this.ready) { showToast('아직 연결 준비가 안 됐습니다'); return; }
    try {
      const { error } = await this.sb.auth.signInWithOAuth({
        provider: 'kakao',
        options: { redirectTo: location.origin + location.pathname }
      });
      if (error) throw error;
    } catch (e) {
      showToast('로그인을 시작하지 못했습니다');
      console.warn('[cloud] 로그인 실패', e);
    }
  },

  async signOut() {
    if (!this.ready) return;
    try { await this.sb.auth.signOut(); } catch (e) { /* 이미 끊겼으면 그만 */ }
    this.user = null;
    renderCloudUI();
    showToast('로그아웃했습니다. 기록은 폰에 남아 있습니다');
  },

  // 로그인한 사람의 이름 (카카오에서 받아온다)
  displayName() {
    const m = this.user?.user_metadata || {};
    return m.name || m.full_name || m.preferred_username || '';
  },

  // ─── 전체 동기화 ────────────────────────────────────────
  // 올리기 → 내려받기 순서. 올리기를 먼저 해야 오프라인에서 쓴 글이
  // 서버 것으로 덮여 사라지지 않는다.
  async syncAll() {
    if (!this.ready || !this.user || this.syncing) return;
    this.syncing = true;
    setCloudStatus('맞추는 중…');
    try {
      await this.pushAll();
      await this.pullAll();
      Store.save('lastSync', Date.now());
      setCloudStatus('');
      showToast('기록을 불러왔습니다 ☁');
    } catch (e) {
      console.warn('[cloud] 동기화 실패', e);
      setCloudStatus('나중에 다시 맞춥니다');
    } finally {
      this.syncing = false;
    }
  },

  // 짧은 시간에 여러 번 저장해도 통신은 한 번만 (어르신이 연달아 눌러도)
  queueSync() {
    if (!this.ready || !this.user) return;
    clearTimeout(this.pendingTimer);
    this.pendingTimer = setTimeout(() => this.pushAll().catch(e =>
      console.warn('[cloud] 올리기 실패 — 다음에 다시', e)), 1500);
  },

  // ─── 올리기 ─────────────────────────────────────────────
  async pushAll() {
    if (!this.ready || !this.user) return;
    const uid = this.user.id;
    const rows = [];   // [표 이름, 데이터, 충돌 기준 열]

    if (State.gratitude.length) rows.push(['gratitude',
      State.gratitude.map(g => ({ user_id: uid, date: g.date, items: (g.items || []).filter(Boolean) })),
      'user_id,date']);

    // 임마누엘 일기 — 글만 올린다.
    // 사진은 서버로 보내지 않는다: 다섯 장이면 하루 1MB, 매일 쓰면 1년에
    // 350MB 라 Supabase 무료 용량(1GB)을 금방 넘긴다. 사진은 폰의
    // IndexedDB 에 남고, 글은 폰을 바꿔도 이어진다.
    // (photo_count 만 올려 두면 "그날 사진 3장" 같은 표시를 나중에 할 수 있다)
    if (State.immanuel.length) rows.push(['immanuel',
      State.immanuel.map(e => ({
        user_id: uid, date: e.date, answers: e.answers || {},
        photo_count: (e.photos || []).length
      })), 'user_id,date']);

    if (State.prayers.length) rows.push(['prayers',
      State.prayers.map(p => ({
        user_id: uid,
        client_id: p.cid || ('p' + p.date),   // 예전 기록은 시각으로 짝을 맞춘다
        type: p.type || 'free',
        text: p.text,
        prayed_at: p.date
      })), 'user_id,client_id']);

    const mem = State.memories || {};
    if (mem.myVerses?.length) rows.push(['fav_verses',
      mem.myVerses.map(v => ({
        user_id: uid, ref: v.ref || '', text: v.text,
        source: v.source || 'manual'
      })), 'user_id,ref,text']);

    if (mem.people?.length) rows.push(['people',
      mem.people.map((p, i) => ({
        user_id: uid, client_id: p.cid || ('h' + i + '_' + p.name),
        name: p.name, relation: p.relation || '', note: p.note || ''
      })), 'user_id,client_id']);

    const f = mem.myFaith;
    if (f && (f.baptism || f.church || f.note)) rows.push(['faith_story',
      [{ user_id: uid, baptism: f.baptism || '', church: f.church || '', note: f.note || '' }],
      'user_id']);

    // 성경 읽기 진도
    const reads = Store.load('bibleReads', []);
    if (reads.length) rows.push(['bible_reads',
      reads.map(r => ({ user_id: uid, book: r.n, chapter: r.c, read_at: new Date(r.at || Date.now()).toISOString() })),
      'user_id,book,chapter']);

    if (State.bibleLast) rows.push(['bible_bookmark',
      [{ user_id: uid, book: State.bibleLast.n, chapter: State.bibleLast.c }], 'user_id']);

    const eras = [...(StoryState.readEras || [])];
    if (eras.length) rows.push(['story_reads',
      eras.map(i => ({ user_id: uid, era_idx: i })), 'user_id,era_idx']);

    // 표 하나가 실패해도 나머지는 올린다
    for (const [table, data, onConflict] of rows) {
      const { error } = await this.sb.from(table).upsert(data, { onConflict });
      if (error) console.warn(`[cloud] ${table} 올리기 실패`, error.message);
    }
  },

  // ─── 내려받기 ───────────────────────────────────────────
  // 서버에 있고 폰에 없는 것을 합친다. 지우기는 옮기지 않는다
  // (한쪽에서 지운 걸 다른 쪽이 되살리는 사고를 막으려면 삭제 기록이
  //  따로 필요한데, 그건 이 앱에 과하다)
  async pullAll() {
    if (!this.ready || !this.user) return;
    const uid = this.user.id;
    const get = async (table, cols = '*') => {
      const { data, error } = await this.sb.from(table).select(cols).eq('user_id', uid);
      if (error) { console.warn(`[cloud] ${table} 받기 실패`, error.message); return []; }
      return data || [];
    };

    // 감사일기 — 날짜가 열쇠. 서버에만 있는 날을 채운다
    const g = await get('gratitude', 'date,items');
    if (g.length) {
      const have = new Set(State.gratitude.map(x => x.date));
      g.forEach(row => {
        if (!have.has(row.date)) State.gratitude.push({ date: row.date, items: row.items || [] });
      });
      State.gratitude.sort((a, b) => a.date.localeCompare(b.date));
      Store.save('gratitude', State.gratitude);
    }

    // 임마누엘 일기 — 감사일기와 같이 날짜가 열쇠.
    // 사진은 서버에 없으므로 폰에 있는 사진 목록은 건드리지 않는다
    // (그냥 덮어쓰면 새 폰에서 받아온 글이 이 폰의 사진을 지워 버린다)
    const im = await get('immanuel', 'date,answers');
    if (im.length) {
      const have = new Set(State.immanuel.map(x => x.date));
      im.forEach(row => {
        if (!have.has(row.date)) {
          State.immanuel.push({ date: row.date, answers: row.answers || {}, photos: [] });
        }
      });
      State.immanuel.sort((a, b) => a.date.localeCompare(b.date));
      Store.save('immanuel', State.immanuel);
    }

    // 기도
    const p = await get('prayers', 'client_id,type,text,prayed_at');
    if (p.length) {
      const have = new Set(State.prayers.map(x => x.cid || ('p' + x.date)));
      p.forEach(row => {
        if (!have.has(row.client_id)) {
          State.prayers.push({ cid: row.client_id, date: row.prayed_at, type: row.type, text: row.text });
        }
      });
      State.prayers.sort((a, b) => String(a.date).localeCompare(String(b.date)));
      Store.save('prayers', State.prayers);
    }

    // 좋아하는 말씀 — favKey 로 짝을 맞춘다 (앱과 같은 기준)
    const fv = await get('fav_verses', 'ref,text,source');
    if (fv.length) {
      const have = new Set(State.memories.myVerses.map(v => favKey(v.text, v.ref)));
      fv.forEach(row => {
        if (!have.has(favKey(row.text, row.ref))) {
          State.memories.myVerses.push({ text: row.text, ref: row.ref, source: row.source });
        }
      });
    }

    // 소중한 분들
    const pe = await get('people', 'client_id,name,relation,note');
    if (pe.length) {
      const have = new Set(State.memories.people.map((x, i) => x.cid || ('h' + i + '_' + x.name)));
      pe.forEach(row => {
        if (!have.has(row.client_id)) {
          State.memories.people.push({ cid: row.client_id, name: row.name, relation: row.relation, note: row.note });
        }
      });
    }

    // 신앙 이야기 — 폰이 비어 있을 때만 채운다 (긴 글을 덮어쓰면 안 된다)
    const fs = await get('faith_story', 'baptism,church,note');
    if (fs.length) {
      const cur = State.memories.myFaith || {};
      const empty = !cur.baptism && !cur.church && !cur.note;
      if (empty) State.memories.myFaith = { baptism: fs[0].baptism || '', church: fs[0].church || '', note: fs[0].note || '' };
    }
    Store.save('memories', State.memories);

    // 성경 읽기 진도
    const br = await get('bible_reads', 'book,chapter,read_at');
    if (br.length) {
      const local = Store.load('bibleReads', []);
      const have = new Set(local.map(r => r.n + ':' + r.c));
      br.forEach(row => {
        if (!have.has(row.book + ':' + row.chapter)) {
          local.push({ n: row.book, c: row.chapter, at: Date.parse(row.read_at) || Date.now() });
        }
      });
      Store.save('bibleReads', local);
    }

    // 이어읽기 — 서버가 더 뒤면 그걸 쓴다
    const bm = await get('bible_bookmark', 'book,chapter,updated_at');
    if (bm.length && !State.bibleLast) {
      State.bibleLast = { n: bm[0].book, c: bm[0].chapter };
      State.bibleBook = bm[0].book;
      State.bibleChapter = bm[0].chapter;
      Store.save('bibleLast', State.bibleLast);
    }

    // 성경 이야기 시대
    const sr = await get('story_reads', 'era_idx');
    if (sr.length) {
      sr.forEach(row => StoryState.readEras.add(row.era_idx));
      Store.save('readEras', [...StoryState.readEras]);
    }

    // 받아온 걸 화면에 반영
    renderHome(); renderGratitude(); renderPrayer(); renderAlbum();
    if (typeof renderImmanuelHistory === 'function') renderImmanuelHistory();
    refreshFavButtons();
    if (typeof updateStoryProgress === 'function') updateStoryProgress();
    renderBibleProgress();
  }
};

// ─── 화면 ─────────────────────────────────────────────────
function setCloudStatus(msg) {
  const el = document.getElementById('cloud-status');
  if (el) { el.textContent = msg || ''; el.style.display = msg ? 'block' : 'none'; }
}

function renderCloudUI() {
  const card = document.getElementById('cloud-card');
  if (!card) return;

  // 설정을 안 넣었으면 카드를 감춘다 (빈 버튼을 보여줄 이유가 없다)
  if (!Cloud.enabled()) { card.style.display = 'none'; return; }
  card.style.display = '';

  const inBtn = document.getElementById('cloud-signin');
  const outBtn = document.getElementById('cloud-signout');
  const syncBtn = document.getElementById('cloud-sync');
  const who = document.getElementById('cloud-who');

  if (Cloud.loggedIn()) {
    const name = Cloud.displayName();
    if (who) who.textContent = (name ? name + ' 님' : '로그인됨') + ' · 기록이 이어집니다';
    if (inBtn) inBtn.style.display = 'none';
    if (outBtn) outBtn.style.display = '';
    if (syncBtn) syncBtn.style.display = '';
  } else {
    if (who) who.textContent = '로그인하면 폰을 바꿔도 기록이 이어집니다';
    if (inBtn) inBtn.style.display = '';
    if (outBtn) outBtn.style.display = 'none';
    if (syncBtn) syncBtn.style.display = 'none';
  }
}
