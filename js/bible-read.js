// ═══════════════════════════════════════════════════════════
//  성경읽기 — 66권 전체
//
//  번역: 개역한글 (Korean Revised Version, 1952/1961)
//  출처: getbible.net API v2  ·  Wikisource
//  저작권: Public Domain (퍼블릭 도메인)
//
//  ⚠ 개역개정판·우리말성경은 대한성서공회가 저작권을 가진 번역이라
//     앱에 본문을 담을 수 없다. 그래서 저작권이 풀린 개역한글을 쓴다.
//     어르신들이 평생 들어온 문체와 가장 가까운 번역이기도 하다.
//
//  본문은 앱에 내장하지 않고 읽을 때마다 받아온다 (전체가 13MB 라 무리).
//  받아온 장은 localStorage 에 저장해 두 번째부터는 오프라인에서도 열린다.
// ═══════════════════════════════════════════════════════════

const BIBLE = {
  // 번역 정보 — 화면 하단에 표기해 출처를 밝힌다.
  // 영어로 보실 때는 World English Bible 을 쓴다. 이것도 퍼블릭 도메인이라
  // 담아 보여줄 수 있다 (NIV·ESV 는 저작권이 있어 본문을 실을 수 없다).
  meta: {
    name: '개역한글',
    fullName: '개역한글 (1952/1961)',
    license: 'Public Domain',
    source: 'getbible.net · Wikisource',
    note: '개역개정·우리말성경은 저작권이 있어 담지 못했습니다'
  },
  metaEn: {
    name: 'WEB',
    fullName: 'World English Bible',
    license: 'Public Domain',
    source: 'getbible.net',
    note: 'NIV and ESV are under copyright, so their text cannot be included'
  },

  // 66권 — n: 번호, t: 제목, e: 영어 제목, c: 장 수, g: 분류
  books: [
    { n: 1, t: '창세기', e: 'Genesis', c: 50, g: '모세오경' },
    { n: 2, t: '출애굽기', e: 'Exodus', c: 40, g: '모세오경' },
    { n: 3, t: '레위기', e: 'Leviticus', c: 27, g: '모세오경' },
    { n: 4, t: '민수기', e: 'Numbers', c: 36, g: '모세오경' },
    { n: 5, t: '신명기', e: 'Deuteronomy', c: 34, g: '모세오경' },
    { n: 6, t: '여호수아', e: 'Joshua', c: 24, g: '역사서' },
    { n: 7, t: '사사기', e: 'Judges', c: 21, g: '역사서' },
    { n: 8, t: '룻기', e: 'Ruth', c: 4, g: '역사서' },
    { n: 9, t: '사무엘상', e: '1 Samuel', c: 31, g: '역사서' },
    { n: 10, t: '사무엘하', e: '2 Samuel', c: 24, g: '역사서' },
    { n: 11, t: '열왕기상', e: '1 Kings', c: 22, g: '역사서' },
    { n: 12, t: '열왕기하', e: '2 Kings', c: 25, g: '역사서' },
    { n: 13, t: '역대상', e: '1 Chronicles', c: 29, g: '역사서' },
    { n: 14, t: '역대하', e: '2 Chronicles', c: 36, g: '역사서' },
    { n: 15, t: '에스라', e: 'Ezra', c: 10, g: '역사서' },
    { n: 16, t: '느헤미야', e: 'Nehemiah', c: 13, g: '역사서' },
    { n: 17, t: '에스더', e: 'Esther', c: 10, g: '역사서' },
    { n: 18, t: '욥기', e: 'Job', c: 42, g: '시가서' },
    { n: 19, t: '시편', e: 'Psalms', c: 150, g: '시가서' },
    { n: 20, t: '잠언', e: 'Proverbs', c: 31, g: '시가서' },
    { n: 21, t: '전도서', e: 'Ecclesiastes', c: 12, g: '시가서' },
    { n: 22, t: '아가', e: 'Song of Solomon', c: 8, g: '시가서' },
    { n: 23, t: '이사야', e: 'Isaiah', c: 66, g: '대선지서' },
    { n: 24, t: '예레미야', e: 'Jeremiah', c: 52, g: '대선지서' },
    { n: 25, t: '예레미야 애가', e: 'Lamentations', c: 5, g: '대선지서' },
    { n: 26, t: '에스겔', e: 'Ezekiel', c: 48, g: '대선지서' },
    { n: 27, t: '다니엘', e: 'Daniel', c: 12, g: '대선지서' },
    { n: 28, t: '호세아', e: 'Hosea', c: 14, g: '소선지서' },
    { n: 29, t: '요엘', e: 'Joel', c: 3, g: '소선지서' },
    { n: 30, t: '아모스', e: 'Amos', c: 9, g: '소선지서' },
    { n: 31, t: '오바댜', e: 'Obadiah', c: 1, g: '소선지서' },
    { n: 32, t: '요나', e: 'Jonah', c: 4, g: '소선지서' },
    { n: 33, t: '미가', e: 'Micah', c: 7, g: '소선지서' },
    { n: 34, t: '나훔', e: 'Nahum', c: 3, g: '소선지서' },
    { n: 35, t: '하박국', e: 'Habakkuk', c: 3, g: '소선지서' },
    { n: 36, t: '스바냐', e: 'Zephaniah', c: 3, g: '소선지서' },
    { n: 37, t: '학개', e: 'Haggai', c: 2, g: '소선지서' },
    { n: 38, t: '스가랴', e: 'Zechariah', c: 14, g: '소선지서' },
    { n: 39, t: '말라기', e: 'Malachi', c: 4, g: '소선지서' },
    { n: 40, t: '마태복음', e: 'Matthew', c: 28, g: '복음서' },
    { n: 41, t: '마가복음', e: 'Mark', c: 16, g: '복음서' },
    { n: 42, t: '누가복음', e: 'Luke', c: 24, g: '복음서' },
    { n: 43, t: '요한복음', e: 'John', c: 21, g: '복음서' },
    { n: 44, t: '사도행전', e: 'Acts', c: 28, g: '초대교회' },
    { n: 45, t: '로마서', e: 'Romans', c: 16, g: '바울서신' },
    { n: 46, t: '고린도전서', e: '1 Corinthians', c: 16, g: '바울서신' },
    { n: 47, t: '고린도후서', e: '2 Corinthians', c: 13, g: '바울서신' },
    { n: 48, t: '갈라디아서', e: 'Galatians', c: 6, g: '바울서신' },
    { n: 49, t: '에베소서', e: 'Ephesians', c: 6, g: '바울서신' },
    { n: 50, t: '빌립보서', e: 'Philippians', c: 4, g: '바울서신' },
    { n: 51, t: '골로새서', e: 'Colossians', c: 4, g: '바울서신' },
    { n: 52, t: '데살로니가전서', e: '1 Thessalonians', c: 5, g: '바울서신' },
    { n: 53, t: '데살로니가후서', e: '2 Thessalonians', c: 3, g: '바울서신' },
    { n: 54, t: '디모데전서', e: '1 Timothy', c: 6, g: '바울서신' },
    { n: 55, t: '디모데후서', e: '2 Timothy', c: 4, g: '바울서신' },
    { n: 56, t: '디도서', e: 'Titus', c: 3, g: '바울서신' },
    { n: 57, t: '빌레몬서', e: 'Philemon', c: 1, g: '바울서신' },
    { n: 58, t: '히브리서', e: 'Hebrews', c: 13, g: '일반서신' },
    { n: 59, t: '야고보서', e: 'James', c: 5, g: '일반서신' },
    { n: 60, t: '베드로전서', e: '1 Peter', c: 5, g: '일반서신' },
    { n: 61, t: '베드로후서', e: '2 Peter', c: 3, g: '일반서신' },
    { n: 62, t: '요한일서', e: '1 John', c: 5, g: '일반서신' },
    { n: 63, t: '요한이서', e: '2 John', c: 1, g: '일반서신' },
    { n: 64, t: '요한삼서', e: '3 John', c: 1, g: '일반서신' },
    { n: 65, t: '유다서', e: 'Jude', c: 1, g: '일반서신' },
    { n: 66, t: '요한계시록', e: 'Revelation', c: 22, g: '예언서' }
  ],

  // 분류 표시 순서 — 구약/신약을 나눠 칩으로 보여준다
  groups: [
    { g: '모세오경', gEn: 'Law', part: '구약' },
    { g: '역사서', gEn: 'History', part: '구약' },
    { g: '시가서', gEn: 'Poetry', part: '구약' },
    { g: '대선지서', gEn: 'Major Prophets', part: '구약' },
    { g: '소선지서', gEn: 'Minor Prophets', part: '구약' },
    { g: '복음서', gEn: 'Gospels', part: '신약' },
    { g: '초대교회', gEn: 'Early Church', part: '신약' },
    { g: '바울서신', gEn: "Paul's Letters", part: '신약' },
    { g: '일반서신', gEn: 'General Letters', part: '신약' },
    { g: '예언서', gEn: 'Prophecy', part: '신약' }
  ],

  // 처음 읽는 분께 권하는 순서 — 창세기부터 순서대로 읽다 지치는 걸 막는다
  starters: [
    { n: 43, c: 3, label: '요한복음 3장', labelEn: 'John 3', why: '하나님의 사랑', whyEn: "God's love" },
    { n: 19, c: 23, label: '시편 23편', labelEn: 'Psalm 23', why: '주는 나의 목자', whyEn: 'The Lord is my shepherd' },
    { n: 42, c: 15, label: '누가복음 15장', labelEn: 'Luke 15', why: '돌아온 아들', whyEn: 'The son who came home' },
    { n: 52, c: 5, label: '데살로니가전서 5장', labelEn: '1 Thessalonians 5', why: '항상 기뻐하라', whyEn: 'Rejoice always' },
    { n: 1, c: 1, label: '창세기 1장', labelEn: 'Genesis 1', why: '태초에', whyEn: 'In the beginning' },
    { n: 50, c: 4, label: '빌립보서 4장', labelEn: 'Philippians 4', why: '아무것도 염려 말라', whyEn: 'Do not be anxious' }
  ]
};

// 지금 언어로 된 책 이름 — 영어 이름이 없으면 한국어로 돌아간다
function bibleBookTitle(book) {
  if (!book) return '';
  const en = typeof State !== 'undefined' && State.lang === 'en';
  return (en && book.e) ? book.e : book.t;
}

// 장 하나를 가져온다 — 저장된 게 있으면 그걸 쓰고, 없으면 받아서 저장
const BibleFetch = {
  base: 'https://api.getbible.net/v2',
  // 언어마다 다른 번역을 받는다. 둘 다 퍼블릭 도메인이다.
  //   korean = 개역한글, web = World English Bible
  translations: { ko: 'korean', en: 'web' },
  memory: {},                       // 이번 세션 동안의 캐시

  // 지금 어느 번역을 볼지
  tr() {
    const lang = (typeof State !== 'undefined' && State.lang === 'en') ? 'en' : 'ko';
    return this.translations[lang];
  },

  // 저장 열쇠에 번역 이름을 넣는다.
  // 안 넣으면 한국어로 읽던 요한복음 3장이 영어 자리에 그대로 나온다
  // (같은 열쇠를 두 번역이 나눠 쓰게 되므로).
  key(book, ch, tr) { return `bible_${tr || this.tr()}_${book}_${ch}`; },

  // 저장된 장 (없으면 null)
  cached(book, ch) {
    const k = this.key(book, ch);
    if (this.memory[k]) return this.memory[k];
    try {
      const raw = localStorage.getItem('ajoy_' + k);
      if (raw) { const v = JSON.parse(raw); this.memory[k] = v; return v; }
    } catch (e) { /* 저장 공간이 꽉 찼거나 읽기 실패 — 그냥 받아온다 */ }
    return null;
  },

  save(book, ch, verses) {
    const k = this.key(book, ch);
    this.memory[k] = verses;
    try {
      localStorage.setItem('ajoy_' + k, JSON.stringify(verses));
    } catch (e) {
      // 저장 공간 초과. 읽기 자체는 되니 조용히 넘어간다
      // (다음에 다시 받아오면 되고, 어르신께 저장 오류를 보일 이유가 없다)
    }
  },

  // [{ v: 절번호, t: 본문 }] 을 돌려준다. 실패하면 throw
  async chapter(book, ch) {
    const hit = this.cached(book, ch);
    if (hit) return hit;

    const res = await fetch(`${this.base}/${this.tr()}/${book}/${ch}.json`);
    if (!res.ok) throw new Error('본문을 가져오지 못했습니다 (' + res.status + ')');
    const data = await res.json();
    const verses = (data.verses || []).map(v => ({
      v: v.verse,
      t: String(v.text || '').trim()
    }));
    if (!verses.length) throw new Error('본문이 비어 있습니다');
    this.save(book, ch, verses);
    return verses;
  }
};
