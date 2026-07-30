// ===== 항상기쁨 — 사진 보관 =====
//
// 임마누엘 일기에 사진을 넣기 위한 저장소.
// "쓸 말이 없는 날에도 사진 한 장으로 하루를 남긴다"가 목적이다.
//
// ─── 왜 IndexedDB 인가 ────────────────────────────────────
// 다른 기록은 localStorage 에 담지만 사진은 절대 안 된다.
// localStorage 는 앱 전체를 합쳐 5MB 남짓이고 문자열만 담긴다.
// 사진 한 장을 base64 로 넣으면(원본 4MB → base64 5.3MB) 그 한 장에
// 한도가 차서 감사일기·기도까지 저장이 멈춘다.
// IndexedDB 는 Blob 을 그대로 담고 한도가 수백 MB라 사진에 맞다.
//
// ─── 왜 줄여서 담는가 ─────────────────────────────────────
// 요즘 폰 사진은 한 장에 3~5MB다. 매일 한 장이면 1년에 1.8GB —
// 폰에도 부담이고 나중에 서버로 올릴 때는 더 문제다.
// 긴 변 1280px · JPEG 품질 0.72 로 줄이면 한 장이 대략 150~250KB가 되고,
// 매일 써도 1년에 70MB 정도다. 폰 화면으로 보기에는 화질 차이가 없다.

const Photos = {
  DB: 'ajoy_photos',
  STORE: 'photos',
  MAX_EDGE: 1280,     // 긴 변 기준 — 폰 화면에는 이보다 클 필요가 없다
  QUALITY: 0.72,      // JPEG 품질. 0.7 아래로 가면 얼굴에 얼룩이 보인다
  MAX_INPUT: 30 * 1024 * 1024,   // 30MB 넘는 파일은 아예 안 받는다 (폰이 멈춘다)

  _db: null,

  // 브라우저가 IndexedDB 를 지원하는지 — 아주 오래된 인앱 브라우저는 없다
  available() {
    try { return typeof indexedDB !== 'undefined' && !!indexedDB; }
    catch (e) { return false; }
  },

  async open() {
    if (this._db) return this._db;
    if (!this.available()) throw new Error('IndexedDB 없음');
    this._db = await new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.STORE)) {
          db.createObjectStore(this.STORE, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('열기 실패'));
    });
    return this._db;
  },

  _tx(mode) {
    return this.open().then(db => db.transaction(this.STORE, mode).objectStore(this.STORE));
  },

  _wrap(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('요청 실패'));
    });
  },

  // ─── 줄이기 ─────────────────────────────────────────────
  // 원본을 캔버스에 다시 그려 작은 JPEG 로 만든다.
  // 실패하면(캔버스를 못 쓰는 환경 등) 원본을 그대로 돌려주되,
  // 너무 크면 거부한다 — 조용히 거대한 파일을 담는 게 더 나쁘다.
  async shrink(file) {
    if (!file) throw new Error('파일 없음');
    if (file.size > this.MAX_INPUT) throw new Error('TOO_BIG');

    try {
      const bitmap = await this._decode(file);
      const w = bitmap.width, h = bitmap.height;
      const scale = Math.min(1, this.MAX_EDGE / Math.max(w, h));
      const cw = Math.max(1, Math.round(w * scale));
      const ch = Math.max(1, Math.round(h * scale));

      const canvas = document.createElement('canvas');
      canvas.width = cw; canvas.height = ch;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas 없음');
      ctx.drawImage(bitmap, 0, 0, cw, ch);
      if (bitmap.close) bitmap.close();

      const blob = await new Promise(res =>
        canvas.toBlob(b => res(b), 'image/jpeg', this.QUALITY));
      if (!blob) throw new Error('toBlob 실패');

      // 줄인 게 더 크면(이미 작은 사진) 원본을 쓴다
      return blob.size < file.size ? blob : file;
    } catch (e) {
      if (e && e.message === 'TOO_BIG') throw e;
      console.warn('[photos] 줄이기 실패 — 원본을 쓴다', e);
      // 줄이지 못했는데 원본이 크면 담지 않는다 (5MB 선)
      if (file.size > 5 * 1024 * 1024) throw new Error('TOO_BIG');
      return file;
    }
  },

  // createImageBitmap 이 없는 브라우저(구형 사파리)는 <img> 로 읽는다
  //
  // 시간 제한을 두는 이유: 아이폰 HEIC 처럼 브라우저가 못 읽는 형식은
  // onload 도 onerror 도 안 오는 경우가 있다. 그러면 "사진을 준비하고
  // 있어요..." 가 영원히 떠 있고 어르신은 앱이 멈춘 줄 아신다.
  // 시간이 지나면 실패로 보고 원본 경로로 넘긴다.
  DECODE_TIMEOUT: 8000,

  async _decode(file) {
    if (typeof createImageBitmap === 'function') {
      try { return await this._withTimeout(createImageBitmap(file)); }
      catch (e) { /* 아래 <img> 방식으로 */ }
    }
    const url = URL.createObjectURL(file);
    try {
      return await this._withTimeout(new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('이미지 읽기 실패'));
        img.src = url;
      }));
    } finally {
      // onload 뒤에 풀어도 캔버스에 이미 그려진 뒤라 안전하다
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  },

  _withTimeout(promise) {
    let timer;
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error('이미지 읽기 시간 초과')), this.DECODE_TIMEOUT);
      })
    ]).finally(() => clearTimeout(timer));
  },

  // ─── 담기 / 꺼내기 / 지우기 ─────────────────────────────
  async put(file) {
    const blob = await this.shrink(file);
    const id = 'p' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
    const store = await this._tx('readwrite');
    await this._wrap(store.put({ id, blob, at: Date.now(), size: blob.size }));
    return { id, size: blob.size };
  },

  async get(id) {
    if (!id) return null;
    const store = await this._tx('readonly');
    const rec = await this._wrap(store.get(id));
    return rec ? rec.blob : null;
  },

  // 화면에 붙일 주소를 만든다. 다 쓰면 revoke 로 풀어야 메모리가 안 샌다
  async url(id) {
    const blob = await this.get(id);
    return blob ? URL.createObjectURL(blob) : null;
  },

  async remove(id) {
    if (!id) return;
    const store = await this._tx('readwrite');
    await this._wrap(store.delete(id));
  },

  // 지금 사진들이 차지하는 용량 — 설정에 보여줄 수 있게
  async usage() {
    try {
      const store = await this._tx('readonly');
      const all = await this._wrap(store.getAll());
      return {
        count: all.length,
        bytes: all.reduce((a, r) => a + (r.size || (r.blob && r.blob.size) || 0), 0)
      };
    } catch (e) { return { count: 0, bytes: 0 }; }
  },

  // 일기에서 사라진 사진을 정리한다 — 안 그러면 지운 일기의 사진이 계속 남는다
  async prune(keepIds) {
    try {
      const keep = new Set(keepIds || []);
      const store = await this._tx('readwrite');
      const all = await this._wrap(store.getAll());
      for (const rec of all) {
        if (!keep.has(rec.id)) {
          const s = await this._tx('readwrite');
          await this._wrap(s.delete(rec.id));
        }
      }
    } catch (e) { console.warn('[photos] 정리 실패', e); }
  }
};

// 사람이 읽는 용량 표기
function formatBytes(n) {
  if (!n) return '0KB';
  if (n < 1024 * 1024) return Math.round(n / 1024) + 'KB';
  return (n / 1024 / 1024).toFixed(1) + 'MB';
}
