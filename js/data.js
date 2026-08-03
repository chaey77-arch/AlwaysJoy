// ===== 항상기쁨 콘텐츠 데이터 =====
// 데살로니가전서 5:16-18 핵심 구조 + Life Model Works 기쁨 회복 원리

const DATA = {

  // 1. 핵심 세 가지 명령 (살전 5:16-18)
  threeCommands: [
    {
      icon: '😊',
      cmd: '항상 기뻐하라',
      ref: '살전 5:16',
      sub: '기쁨은 훈련할 수 있습니다',
      color: '#F5D060'
    },
    {
      icon: '🙏',
      cmd: '쉬지 말고 기도하라',
      ref: '살전 5:17',
      sub: '하나님과 늘 연결되어 있습니다',
      color: '#A5D6A7'
    },
    {
      icon: '💛',
      cmd: '범사에 감사하라',
      ref: '살전 5:18',
      sub: '작은 것에도 감사할 수 있습니다',
      color: '#90CAF9'
    }
  ],

  // 2. 오늘의 말씀 (총 30개 — 매일 순환)
  dailyVerses: [
    { text: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라", ref: "데살로니가전서 5:16-18" },
    { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" },
    { text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라", ref: "요한복음 3:16" },
    { text: "내가 산을 향하여 눈을 들리라 나의 도움이 어디서 올까 나의 도움은 천지를 지으신 여호와에게서로다", ref: "시편 121:1-2" },
    { text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", ref: "마태복음 11:28" },
    { text: "여호와는 나의 빛이요 나의 구원이시니 내가 누구를 두려워하리요", ref: "시편 27:1" },
    { text: "내가 너와 함께 있어 네가 어디로 가든지 너를 지키며", ref: "창세기 28:15" },
    { text: "주는 나의 힘이요 나의 방패시니 내 마음이 주를 의지하여 도움을 얻었도다", ref: "시편 28:7" },
    { text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라", ref: "이사야 41:10" },
    { text: "여호와여 주는 나의 하나님이시라 내가 주를 높이고 주의 이름을 찬송하오리니", ref: "이사야 25:1" },
    { text: "하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라", ref: "빌립보서 4:7" },
    { text: "내가 주께 감사함은 나를 지으심이 심히 기묘하심이라 주께서 하시는 일이 기이함을 내 영혼이 잘 아나이다", ref: "시편 139:14" },
    { text: "내 영혼아 하나님만 잠잠히 바라라 무릇 나의 소망이 그로부터 나오는도다", ref: "시편 62:5" },
    { text: "주의 말씀은 내 발에 등이요 내 길에 빛이니이다", ref: "시편 119:105" },
    { text: "너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라", ref: "잠언 3:5" },
    { text: "우리가 선을 행하되 낙심하지 말지니 포기하지 아니하면 때가 이르매 거두리라", ref: "갈라디아서 6:9" },
    { text: "여호와께서 그의 얼굴을 네게로 향하여 드사 네게 평강 주시기를 원하노라", ref: "민수기 6:26" },
    { text: "내 안에 거하라 나도 너희 안에 거하리라", ref: "요한복음 15:4" },
    { text: "여호와는 나의 힘과 방패시니 내 마음이 그를 의지하여 도움을 얻었도다 그러므로 내 마음이 크게 기뻐하며 내 노래로 그를 찬송하리로다", ref: "시편 28:7" },
    { text: "하나님은 사랑이심이라 사랑 안에 거하는 자는 하나님 안에 거하고 하나님도 그의 안에 거하시느니라", ref: "요한일서 4:16" },
    { text: "내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라", ref: "시편 23:4" },
    { text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", ref: "빌립보서 4:13" },
    { text: "하나님이 우리에게 주신 것은 두려워하는 마음이 아니요 오직 능력과 사랑과 절제하는 마음이니", ref: "디모데후서 1:7" },
    { text: "주의 성령이 내게 임하셨으니 이는 가난한 자에게 복음을 전하게 하시려고 내게 기름을 부으시고", ref: "누가복음 4:18" },
    { text: "내가 항상 주를 내 앞에 모심이여 그가 나의 오른쪽에 계시므로 내가 흔들리지 아니하리로다", ref: "시편 16:8" },
    { text: "여호와의 인자와 자비는 무궁하여 아침마다 새로우니 주의 성실하심이 크도소이다", ref: "예레미야애가 3:22-23" },
    { text: "하나님은 우리의 피난처시요 힘이시니 환난 중에 만날 큰 도움이시라", ref: "시편 46:1" },
    { text: "이 하나님은 영원히 우리 하나님이시니 우리를 죽을 때까지 인도하시리로다", ref: "시편 48:14" },
    { text: "여호와를 기뻐하라 그가 네 마음의 소원을 네게 이루어 주시리로다", ref: "시편 37:4" },
    { text: "나는 포도나무요 너희는 가지라 그가 내 안에 내가 그 안에 거하면 사람이 열매를 많이 맺나니", ref: "요한복음 15:5" }
  ],

  // 3. 주제별 말씀 모음
  //
  // 영어로 바꿔도 내용까지 영어로 보여야 하므로 짝이 되는 en 을 함께 둔다.
  // 구절은 NIV, 출처는 영어 책 이름 + (NIV) — 오늘의 말씀(dailyVersesEn)과
  // 같은 표기라 두 곳을 오가도 낯설지 않다.
  verseTopics: [
    {
      key: 'peace',
      label: '평안',
      labelEn: 'Peace',
      icon: '☮️',
      verses: [
        { text: "하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라", ref: "빌립보서 4:7",
          textEn: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", refEn: "Philippians 4:7 (NIV)" },
        { text: "내가 너희에게 평안을 끼치노니 곧 나의 평안을 너희에게 주노라", ref: "요한복음 14:27",
          textEn: "Peace I leave with you; my peace I give you.", refEn: "John 14:27 (NIV)" },
        { text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", ref: "마태복음 11:28",
          textEn: "Come to me, all you who are weary and burdened, and I will give you rest.", refEn: "Matthew 11:28 (NIV)" }
      ]
    },
    {
      key: 'joy',
      label: '기쁨',
      labelEn: 'Joy',
      icon: '😊',
      verses: [
        { text: "항상 기뻐하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라", ref: "데살로니가전서 5:16,18",
          textEn: "Rejoice always; for this is God's will for you in Christ Jesus.", refEn: "1 Thessalonians 5:16,18 (NIV)" },
        { text: "여호와를 기뻐하는 것이 너희의 힘이니라", ref: "느헤미야 8:10",
          textEn: "The joy of the Lord is your strength.", refEn: "Nehemiah 8:10 (NIV)" },
        { text: "여호와를 기뻐하라 그가 네 마음의 소원을 네게 이루어 주시리로다", ref: "시편 37:4",
          textEn: "Take delight in the Lord, and he will give you the desires of your heart.", refEn: "Psalm 37:4 (NIV)" }
      ]
    },
    {
      key: 'strength',
      label: '힘과 용기',
      labelEn: 'Strength & Courage',
      icon: '💪',
      verses: [
        { text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라", ref: "이사야 41:10",
          textEn: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", refEn: "Isaiah 41:10 (NIV)" },
        { text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", ref: "빌립보서 4:13",
          textEn: "I can do all this through him who gives me strength.", refEn: "Philippians 4:13 (NIV)" },
        { text: "여호와는 나의 힘이요 나의 구원이시니", ref: "시편 27:1",
          textEn: "The Lord is my light and my salvation.", refEn: "Psalm 27:1 (NIV)" }
      ]
    },
    {
      key: 'love',
      label: '하나님의 사랑',
      labelEn: "God's Love",
      icon: '❤️',
      verses: [
        { text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니", ref: "요한복음 3:16",
          textEn: "For God so loved the world that he gave his one and only Son.", refEn: "John 3:16 (NIV)" },
        { text: "하나님은 사랑이심이라", ref: "요한일서 4:16",
          textEn: "God is love.", refEn: "1 John 4:16 (NIV)" },
        { text: "여호와의 인자와 자비는 무궁하여 아침마다 새로우니", ref: "예레미야애가 3:22-23",
          textEn: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning.", refEn: "Lamentations 3:22-23 (NIV)" }
      ]
    },
    {
      key: 'presence',
      label: '주님의 임재',
      labelEn: "The Lord's Presence",
      icon: '✨',
      verses: [
        { text: "내가 항상 주를 내 앞에 모심이여 그가 나의 오른쪽에 계시므로 내가 흔들리지 아니하리로다", ref: "시편 16:8",
          textEn: "I keep my eyes always on the Lord. With him at my right hand, I will not be shaken.", refEn: "Psalm 16:8 (NIV)" },
        { text: "내 안에 거하라 나도 너희 안에 거하리라", ref: "요한복음 15:4",
          textEn: "Remain in me, as I also remain in you.", refEn: "John 15:4 (NIV)" },
        { text: "내가 너와 함께 있어 네가 어디로 가든지 너를 지키며", ref: "창세기 28:15",
          textEn: "I am with you and will watch over you wherever you go.", refEn: "Genesis 28:15 (NIV)" }
      ]
    }
  ],

  // 4. 큐레이션 설교/유튜브 목록 (searchQuery 기반 — 링크 오류 없음)
  videos: [
    {
      category: '시애틀 형제교회',
      categoryEn: 'Seattle Brethren Church',
      icon: '⛪',
      items: [
        { title: "시애틀 형제교회 주일설교", channel: "시애틀 형제교회", searchQuery: "시애틀 형제교회 주일설교", thumb: '⛪' },
        { title: "시애틀 형제교회 새벽기도", channel: "시애틀 형제교회", searchQuery: "시애틀 형제교회 새벽기도", thumb: '🌅' }
      ]
    },
    {
      category: '잘믿고잘사는법',
      categoryEn: 'Believing Well, Living Well',
      icon: '📖',
      items: [
        { title: "잘믿고잘사는법 — 기쁨 회복", channel: "잘믿고잘사는법", searchQuery: "잘믿고잘사는법 기쁨 회복", thumb: '📖' },
        { title: "잘믿고잘사는법 — 기도하는 삶", channel: "잘믿고잘사는법", searchQuery: "잘믿고잘사는법 기도", thumb: '🙏' }
      ]
    },
    {
      category: '온누리교회',
      categoryEn: 'Onnuri Church',
      icon: '🏛️',
      items: [
        { title: "온누리교회 주일예배 설교", channel: "온누리교회", searchQuery: "온누리교회 주일예배 설교", thumb: '🏛️' },
        { title: "온누리교회 관계기술훈련", channel: "온누리교회", searchQuery: "온누리교회 관계기술훈련", thumb: '🤝' }
      ]
    },
    {
      category: '임마누엘 신앙',
      categoryEn: 'Immanuel Faith',
      icon: '✨',
      items: [
        { title: "Life Model Works — Joy Training", channel: "LifeModelWorks", searchQuery: "Life Model Works joy brain thriving", thumb: '✨' },
        { title: "THRIVEtoday — Relational Skills", channel: "THRIVEtoday", searchQuery: "THRIVEtoday relational brain skills joy", thumb: '🌱' }
      ]
    }
  ],

  // 5. 찬양 목록 — 현대 CCM + 전통 찬송가 (세대 통합)
  // youtubeSearch: 검색어로 유튜브 열기 (링크 오류 없음)
  hymns: [
    // ── 현대 CCM ──
    {
      id: 1,
      title: "항상 기뻐하라",
      artist: "소울루미 · 살전 5:16-18",
      tag: "CCM",
      youtubeSearch: "항상 기뻐하라 소울루미",
      lyrics: "항상 기뻐하라\n쉬지 말고 기도하라\n범사에 감사하라\n이것이 하나님의 뜻\n\n기쁨이 없어도 기뻐할 수 있어\n주님이 함께하시니\n감사합니다",
      note: "오늘의 핵심 말씀", noteEn: "The key verse for today"
    },
    {
      id: 2,
      title: "주님 한 분만으로",
      artist: "Hillsong · 현대 CCM",
      tag: "CCM",
      youtubeSearch: "주님 한 분만으로 찬양",
      lyrics: "주님 한 분만으로\n내 영혼이 만족해\n주님 한 분만으로\n내 삶이 풍성해\n\n주님 사랑해요\n주님만 바라봐요\n주님 한 분만으로 충분해",
      note: "마음이 공허할 때", noteEn: "When your heart feels empty"
    },
    {
      id: 3,
      title: "주 이름 찬양",
      artist: "Blessed Be Your Name",
      tag: "CCM",
      youtubeSearch: "주 이름 찬양 blessed be your name 한국어",
      lyrics: "주 이름 찬양\n풍요로울 때\n주 이름 찬양\n거친 길을 걸을 때\n\n주시고 거두시는 주님을 찬양\n복되신 주의 이름 찬양합니다",
      note: "어떤 상황에서도", noteEn: "In every circumstance"
    },
    {
      id: 4,
      title: "하나님 아버지의 마음",
      artist: "현대 CCM",
      tag: "CCM",
      youtubeSearch: "하나님 아버지의 마음 찬양",
      lyrics: "하나님 아버지의 마음\n내 안에 부어주소서\n잃어버린 영혼들을\n주의 눈으로 바라보게\n\n주의 마음으로\n이 세상을 바라보게 하소서",
      note: "다른 이를 위해 기도할 때", noteEn: "When praying for someone else"
    },
    {
      id: 5,
      title: "여호와는 나의 목자",
      artist: "시편 23편 CCM",
      tag: "CCM",
      youtubeSearch: "여호와는 나의 목자시니 CCM 찬양",
      lyrics: "여호와는 나의 목자시니\n내게 부족함이 없으리로다\n그가 나를 푸른 초장에 누이시며\n쉬운 물가으로 인도하시는도다\n\n내 영혼을 소생시키시고\n의의 길로 인도하시는도다",
      note: "평안이 필요할 때", noteEn: "When you need peace"
    },
    {
      id: 6,
      title: "주님 품에 안기어",
      artist: "복음 CCM",
      tag: "CCM",
      youtubeSearch: "주님 품에 안기어 찬양 CCM",
      lyrics: "주님 품에 안기어\n눈물 흘려도\n주님 사랑 안에서\n쉬어 갑니다\n\n지치고 힘든 날 주께로 나아가\n위로와 평안을 얻습니다",
      note: "위로가 필요할 때", noteEn: "When you need comfort"
    },
    // ── 전통 찬송가 ──
    {
      id: 7,
      title: "주 하나님 지으신 모든 세계",
      artist: "찬송가 79장",
      tag: "찬송가",
      youtubeSearch: "주 하나님 지으신 모든 세계 찬송가",
      lyrics: "주 하나님 지으신 모든 세계\n내 마음 속에 그리어볼 때\n하늘의 별 울려 퍼지는 뇌성\n주님의 권능 우주에 찼네\n\n주님 내 하나님 위대하신 주\n내 맘에 기쁨 넘치고 넘쳐\n경배드리나이다",
      note: "자연을 보며", noteEn: "While looking at creation"
    },
    {
      id: 8,
      title: "나 같은 죄인 살리신",
      artist: "찬송가 305장 (Amazing Grace)",
      tag: "찬송가",
      youtubeSearch: "나 같은 죄인 살리신 찬송가 amazing grace",
      lyrics: "나 같은 죄인 살리신\n주 은혜 놀라워\n잃었던 생명 찾았고\n광명을 얻었네\n\n큰 죄악에서 건지신\n주 은혜 고맙다\n나 처음 믿은 그 시간\n귀하고 귀하다",
      note: "은혜 생각날 때", noteEn: "When grace comes to mind"
    },
    {
      id: 9,
      title: "예수 사랑하심은",
      artist: "찬송가 411장",
      tag: "찬송가",
      youtubeSearch: "예수 사랑하심은 찬송가 411장",
      lyrics: "예수 사랑하심은\n거룩하신 말일세\n우리들은 약하나\n예수 권세 많도다\n\n날 사랑하심\n날 사랑하심\n날 사랑하심\n성경에 써 있네",
      note: "어릴 때부터 아는 찬양", noteEn: "A hymn known since childhood"
    },
    {
      id: 10,
      title: "내 주를 가까이 하게 함은",
      artist: "찬송가 364장",
      tag: "찬송가",
      youtubeSearch: "내 주를 가까이 하게 함은 찬송가 364장",
      lyrics: "내 주를 가까이 하게 함은\n십자가 짐 같은 고생이나\n내 일생 소원은 늘 찬송하면서\n주께 더 나가기 원합니다\n\n내 주를 가까이 내 주를 가까이\n주께 더 나가기 원합니다",
      note: "기도 드릴 때", noteEn: "When you pray"
    },
    {
      id: 11,
      title: "기뻐하며 경배하세",
      artist: "찬송가 20장",
      tag: "찬송가",
      youtubeSearch: "기뻐하며 경배하세 찬송가 20장",
      lyrics: "기뻐하며 경배하세\n영광의 주 하나님\n천지 지은 큰 권능을\n찬양을 드리세\n\n기쁨과 감사 드리며\n경배를 드리세",
      note: "기쁨이 필요할 때", noteEn: "When you need joy"
    },
    {
      id: 12,
      title: "저 높은 곳을 향하여",
      artist: "찬송가 491장",
      tag: "찬송가",
      youtubeSearch: "저 높은 곳을 향하여 찬송가 491장",
      lyrics: "저 높은 곳을 향하여\n날마다 나아갑니다\n내 뜻과 정성 모두어\n날마다 기도합니다\n\n내 주여 내 발 붙드사\n그 곳에 서게 하소서",
      note: "소망을 드릴 때", noteEn: "When you offer hope"
    },

    // ── 손경민 목사 찬양 ──
    // 저작권이 있는 곡이라 가사는 후렴 몇 줄만 담고, 전체는 유튜브에서 듣게 한다
    {
      id: 13,
      title: "은혜",
      artist: "손경민",
      tag: "CCM",
      youtubeSearch: "손경민 은혜 당연한 것 아니라 은혜였소 찬양",
      lyrics: "내가 누려왔던 모든 것들이\n내가 지나왔던 모든 시간이\n내가 걸어왔던 모든 순간이\n당연한 것 아니라\n은혜였소",
      note: "지나온 길을 돌아볼 때", noteEn: "When you look back on the road behind"
    },
    {
      id: 14,
      title: "축복하노라",
      artist: "손경민",
      tag: "CCM",
      youtubeSearch: "손경민 축복하노라 찬양",
      lyrics: "축복하노라\n주의 이름으로\n축복하노라\n\n주의 사랑이\n너와 함께 있으리",
      note: "사랑하는 이를 위해", noteEn: "For someone you love"
    },
    {
      id: 15,
      title: "우리 함께 기도해",
      artist: "손경민",
      tag: "CCM",
      youtubeSearch: "손경민 우리 함께 기도해 찬양",
      lyrics: "우리 함께 기도해\n주님 앞에 무릎 꿇고\n\n혼자가 아니야\n주님이 들으시니",
      note: "함께 기도하고 싶을 때", noteEn: "When you want to pray together"
    },
    {
      id: 16,
      title: "혼자 걷지 않을 거예요",
      artist: "예람워십",
      tag: "CCM",
      youtubeSearch: "혼자 걷지 않을 거예요 예람워십 찬양",
      lyrics: "혼자 걷지 않을 거예요\n주님이 함께 걸으시니\n\n어두운 길이어도\n손 잡아 주시니",
      note: "외로운 날에", noteEn: "On a lonely day"
    },

    // ── 위로가 되는 현대 CCM ──
    {
      id: 17,
      title: "하나님의 은혜",
      artist: "신상우 · 현대 CCM",
      tag: "CCM",
      youtubeSearch: "하나님의 은혜 나를 지으신 이가 하나님 찬양",
      lyrics: "나를 지으신 이가 하나님\n나를 부르신 이가 하나님\n나를 보내신 이도 하나님\n나의 나 된 것은\n다 하나님 은혜라",
      note: "내가 누구인지 잊었을 때", noteEn: "When you forget who you are"
    },
    {
      id: 18,
      title: "소원",
      artist: "한웅재 · 현대 CCM",
      tag: "CCM",
      youtubeSearch: "소원 한웅재 삶의 작은 일에도 찬양",
      lyrics: "삶의 작은 일에도\n그 뜻을 헤아리게 하시고\n\n그 길만 걸으며\n주 곁에 머물게 하소서",
      note: "하루를 맡기고 싶을 때", noteEn: "When you want to entrust the day"
    },
    {
      id: 19,
      title: "주 은혜임을",
      artist: "현대 CCM",
      tag: "CCM",
      youtubeSearch: "주 은혜임을 찬양 CCM",
      lyrics: "돌아보니 모든 것이\n주 은혜임을\n\n나의 삶의 모든 순간\n주님 손길이었네",
      note: "감사가 떠오를 때", noteEn: "When thanks comes to mind"
    },

    // ── 어르신께 익숙한 찬송가 ──
    {
      id: 20,
      title: "지금까지 지내온 것",
      artist: "찬송가 301장",
      tag: "찬송가",
      youtubeSearch: "지금까지 지내온 것 찬송가 301장",
      lyrics: "지금까지 지내온 것\n주의 크신 은혜라\n한이 없는 주의 사랑\n어찌 이루 말하랴\n\n자나 깨나 주의 손이\n항상 살펴 주시고",
      note: "살아온 세월을 감사할 때", noteEn: "When you give thanks for the years"
    },
    {
      id: 21,
      title: "나의 갈 길 다 가도록",
      artist: "찬송가 384장",
      tag: "찬송가",
      youtubeSearch: "나의 갈 길 다 가도록 찬송가 384장",
      lyrics: "나의 갈 길 다 가도록\n예수 인도하시니\n내 주 안에 있는 긍휼\n어찌 의심하리요\n\n믿음으로 사는 자는\n하늘 위로 받겠네",
      note: "앞이 안 보일 때", noteEn: "When you cannot see the way ahead"
    },
    {
      id: 22,
      title: "주의 친절한 팔에 안기세",
      artist: "찬송가 405장",
      tag: "찬송가",
      youtubeSearch: "주의 친절한 팔에 안기세 찬송가 405장",
      lyrics: "주의 친절한 팔에 안기세\n우리 맘이 평안하리로다\n\n주의 친절한 팔에 안기세\n영원토록 주 품에 안기세",
      note: "쉬고 싶을 때", noteEn: "When you want to rest"
    },
    {
      id: 23,
      title: "내 영혼이 은총 입어",
      artist: "찬송가 438장",
      tag: "찬송가",
      youtubeSearch: "내 영혼이 은총 입어 찬송가 438장",
      lyrics: "내 영혼이 은총 입어\n중한 죄짐 벗었네\n주 예수와 동행하니\n그 어디나 하늘나라\n\n할렐루야 찬양하세\n내 모든 죄 사함받고",
      note: "마음이 무거울 때", noteEn: "When your heart is heavy"
    },
    {
      id: 24,
      title: "예수로 나의 구주 삼고",
      artist: "찬송가 288장",
      tag: "찬송가",
      youtubeSearch: "예수로 나의 구주 삼고 찬송가 288장",
      lyrics: "예수로 나의 구주 삼고\n성령과 피로써 거듭나니\n이 세상에서 내 영혼이\n하늘의 영광 누리도다\n\n이것이 나의 찬송이라\n나 사는 동안 찬송하리",
      note: "확신이 필요할 때", noteEn: "When you need assurance"
    }
  ],

  // 6. 기도 안내 (Life Model: 하나님의 임재 인식 → 기쁨 회복)
  prayerGuides: [
    {
      type: 'morning',
      title: '아침 기도',
      titleEn: 'Morning Prayer',
      icon: '🌅',
      guide: [
        "주님, 오늘도 주님 안에서 눈을 떴습니다.",
        "오늘 하루도 주님과 함께하게 하소서.",
        "항상 기뻐하고 쉬지 말고 기도하며 범사에 감사하게 하소서.",
        "주님의 임재 안에서 오늘을 살아가게 하소서."
      ],
      guideEn: [
        "Lord, I have opened my eyes in you again today.",
        "Be with me through this whole day.",
        "Help me rejoice always, pray continually, and give thanks in all things.",
        "Let me live this day in your presence."
      ]
    },
    {
      type: 'evening',
      title: '저녁 기도',
      titleEn: 'Evening Prayer',
      icon: '🌙',
      guide: [
        "주님, 오늘 하루도 지켜주셔서 감사합니다.",
        "오늘 주님께서 베풀어주신 은혜를 기억합니다.",
        "연약한 저를 붙들어 주셔서 감사합니다.",
        "내일도 주님 손 잡고 나아가게 하소서."
      ],
      guideEn: [
        "Lord, thank you for keeping me through this day.",
        "I remember the grace you have shown me today.",
        "Thank you for holding me when I was weak.",
        "Let me walk tomorrow holding your hand."
      ]
    },
    {
      type: 'peace',
      title: '평안 기도',
      titleEn: 'Prayer for Peace',
      icon: '☮️',
      guide: [
        "주님, 지금 마음이 무겁고 힘듭니다.",
        "수고하고 무거운 짐 진 자들을 쉬게 하신다 하셨습니다.",
        "지금 이 순간 주님께 모든 것을 맡깁니다.",
        "하나님의 평강이 내 마음을 지켜 주시길 원합니다."
      ],
      guideEn: [
        "Lord, my heart is heavy and weary right now.",
        "You said you would give rest to the weary and burdened.",
        "In this moment I place everything in your hands.",
        "Let the peace of God guard my heart."
      ]
    },
    {
      type: 'joy',
      title: '기쁨 회복 기도',
      titleEn: 'Prayer to Restore Joy',
      icon: '😊',
      guide: [
        "주님, 기쁨이 사라진 것 같습니다.",
        "여호와를 기뻐하는 것이 나의 힘임을 믿습니다.",
        "구원의 기쁨을 내게 회복시켜 주소서.",
        "주님이 나와 함께하심을 다시 알게 하소서."
      ],
      guideEn: [
        "Lord, it feels as if my joy has gone.",
        "I believe the joy of the Lord is my strength.",
        "Restore to me the joy of your salvation.",
        "Let me know again that you are with me."
      ]
    }
  ],

  // 6-2. 임마누엘 일기 (Life Model Works: Immanuel Journaling)
  //
  // '임마누엘'은 하나님이 우리와 함께 계시다는 뜻이다. 감사일기가 "무엇을
  // 감사했나"를 적는 것이라면, 임마누엘 일기는 "주님이 지금 나를 어떻게
  // 보고 계신가"를 순서대로 따라가며 적는다. 다섯 단계는 Life Model 의
  // 실제 훈련 순서 그대로다 — 감사로 마음을 열고, 주님이 나를 보시고,
  // 들으시고, 이해하시고, 함께하신다는 것까지 차례로 적는다.
  //
  // 어르신이 빈 칸 앞에서 막히지 않도록 단계마다 '이렇게 적어보세요' 예시를
  // 붙였다. 순서를 건너뛰어도 되고, 한 칸만 적어도 저장된다.
  immanuelSteps: [
    {
      key: 'thanks',
      icon: '💛',
      title: '감사로 시작해요',
      ask: '오늘 감사한 일 하나를 주님께 말씀드려 보세요',
      hint: '예) 주님, 오늘 아침 햇살이 참 따뜻했습니다. 감사합니다.',
      titleEn: 'Start with thanks',
      askEn: 'Tell the Lord one thing you are thankful for today',
      hintEn: 'e.g. Lord, the morning sun was so warm today. Thank you.'
    },
    {
      key: 'see',
      icon: '👀',
      title: '주님이 나를 보고 계세요',
      ask: '주님이 지금 내 모습을 어떻게 보고 계실까요?',
      hint: '예) 주님은 지친 내 어깨를 보고 계십니다.',
      titleEn: 'The Lord sees you',
      askEn: 'How might the Lord be seeing you right now?',
      hintEn: 'e.g. The Lord is looking at my tired shoulders.'
    },
    {
      key: 'hear',
      icon: '👂',
      title: '주님이 내 말을 들으세요',
      ask: '주님께 지금 마음을 그대로 말씀드려 보세요',
      hint: '예) 주님, 요즘 마음이 외롭고 무겁습니다.',
      titleEn: 'The Lord hears you',
      askEn: 'Tell the Lord what is on your heart, just as it is',
      hintEn: 'e.g. Lord, my heart has been lonely and heavy lately.'
    },
    {
      key: 'understand',
      icon: '🤝',
      title: '주님이 내 마음을 아세요',
      ask: '주님이 내 마음을 어떻게 헤아려 주실까요?',
      hint: '예) 주님은 내가 얼마나 애썼는지 다 아신다고 하십니다.',
      titleEn: 'The Lord understands you',
      askEn: 'How might the Lord understand what you are feeling?',
      hintEn: 'e.g. The Lord says he knows how hard I have tried.'
    },
    {
      key: 'with',
      icon: '✝️',
      title: '주님이 함께 계세요',
      ask: '주님이 지금 나에게 뭐라고 하실 것 같나요?',
      hint: '예) "내가 너와 함께 있으니 두려워하지 말라" 하십니다.',
      titleEn: 'The Lord is with you',
      askEn: 'What do you think the Lord is saying to you now?',
      hintEn: 'e.g. He says, "Do not fear, for I am with you."'
    }
  ],

  // 임마누엘 일기를 쓸 때 곁에 두는 말씀 — 하나님의 함께하심을 붙들어 준다
  immanuelVerses: [
    { text: '두려워하지 말라 내가 너와 함께 있느니라', ref: '이사야 41:10',
      textEn: 'Do not fear, for I am with you.', refEn: 'Isaiah 41:10 (NIV)' },
    { text: '보라 내가 세상 끝날까지 너희와 항상 함께 있으리라', ref: '마태복음 28:20',
      textEn: 'And surely I am with you always, to the very end of the age.', refEn: 'Matthew 28:20 (NIV)' },
    { text: '내가 너를 결코 버리지 아니하고 너를 떠나지 아니하리라', ref: '히브리서 13:5',
      textEn: 'Never will I leave you; never will I forsake you.', refEn: 'Hebrews 13:5 (NIV)' },
    { text: '여호와는 마음이 상한 자를 가까이 하시고', ref: '시편 34:18',
      textEn: 'The Lord is close to the brokenhearted.', refEn: 'Psalm 34:18 (NIV)' },
    { text: '내가 네 눈물을 보았노라', ref: '이사야 38:5',
      textEn: 'I have seen your tears.', refEn: 'Isaiah 38:5 (NIV)' }
  ],

  // 7. 동반자 메시지 (멍한 상태 / 우울 / 고독 상황)
  //
  // action 은 doCompanionAction() 이 어느 탭으로 갈지 정하는 데도 쓰인다.
  // 영어 문구는 actionKey 로 탭을 정하므로 글자를 보고 짐작하지 않는다.
  companionMessages: [
    { trigger: 'idle', text: "😊 {name}님, 주님이 지금도 곁에 계세요.\n\"내가 너와 함께 함이라\" (사 41:10)", action: '말씀 보기',
      textEn: "😊 {name}, the Lord is beside you even now.\n\"I am with you\" (Isaiah 41:10)", actionEn: 'Read the Word', actionKey: 'word' },
    { trigger: 'morning', text: "🌅 좋은 아침이에요, {name}님!\n오늘도 주님 안에서 시작해요 🙏", action: '아침 기도',
      textEn: "🌅 Good morning, {name}!\nLet's begin this day in the Lord 🙏", actionEn: 'Morning prayer', actionKey: 'prayer' },
    { trigger: 'evening', text: "🌙 {name}님, 오늘 하루도 수고하셨어요.\n감사한 일 하나 떠올려볼까요? 💛", action: '감사 쓰기',
      textEn: "🌙 {name}, you have done well today.\nShall we recall one thing to be thankful for? 💛", actionEn: 'Write gratitude', actionKey: 'gratitude' },
    { trigger: 'lonely', text: "✨ {name}님, 외로우신가요?\n주님은 항상 함께하십니다.\n찬양 한 곡 들어볼까요?", action: '찬양 듣기',
      textEn: "✨ {name}, are you feeling lonely?\nThe Lord is always with you.\nShall we listen to a hymn?", actionEn: 'Listen to a hymn', actionKey: 'hymn' },
    { trigger: 'depression', text: "💚 {name}님, 마음이 무거우실 수 있어요.\n괜찮아요. 주님께 말씀드려봐요.", action: '기도하기',
      textEn: "💚 {name}, your heart may feel heavy.\nThat's alright. Let's tell the Lord about it.", actionEn: 'Pray', actionKey: 'prayer' },
    { trigger: 'noon', text: "☀️ {name}님, 점심시간이에요!\n\"여호와를 기뻐하는 것이 너희의 힘이니라\" (느 8:10)", action: '찬양 듣기',
      textEn: "☀️ {name}, it's lunchtime!\n\"The joy of the Lord is your strength\" (Nehemiah 8:10)", actionEn: 'Listen to a hymn', actionKey: 'hymn' },
    { trigger: 'praise', text: "🎵 {name}님, 찬양 한 곡 들어볼까요?\n마음이 밝아질 거예요!", action: '찬양 듣기',
      textEn: "🎵 {name}, shall we listen to a hymn?\nIt will lift your heart!", actionEn: 'Listen to a hymn', actionKey: 'hymn' }
  ],

  // 8. (연령대별 프로필이 여기 있었다 — 없앴다.
  //     화면에서 고르는 칸을 뺐고, 이 표는 그 칸만 채우던 것이라 함께 빠졌다.
  //     읽는 곳이 한 곳도 없었다)

  // 9. NIV 영어 말씀 (개역개정 대응)
  dailyVersesEn: [
    { text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.", ref: "1 Thessalonians 5:16–18 (NIV)" },
    { text: "The Lord is my shepherd, I lack nothing.", ref: "Psalm 23:1 (NIV)" },
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", ref: "John 3:16 (NIV)" },
    { text: "I lift up my eyes to the mountains — where does my help come from? My help comes from the Lord, the Maker of heaven and earth.", ref: "Psalm 121:1–2 (NIV)" },
    { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28 (NIV)" },
    { text: "The Lord is my light and my salvation — whom shall I fear?", ref: "Psalm 27:1 (NIV)" },
    { text: "I am with you and will watch over you wherever you go.", ref: "Genesis 28:15 (NIV)" },
    { text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.", ref: "Psalm 28:7 (NIV)" },
    { text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", ref: "Isaiah 41:10 (NIV)" },
    { text: "Lord, you are my God; I will exalt you and praise your name.", ref: "Isaiah 25:1 (NIV)" },
    { text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.", ref: "Philippians 4:7 (NIV)" },
    { text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.", ref: "Psalm 139:14 (NIV)" },
    { text: "Yes, my soul, find rest in God; my hope comes from him.", ref: "Psalm 62:5 (NIV)" },
    { text: "Your word is a lamp for my feet, a light on my path.", ref: "Psalm 119:105 (NIV)" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5 (NIV)" },
    { text: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", ref: "Galatians 6:9 (NIV)" },
    { text: "The Lord turn his face toward you and give you peace.", ref: "Numbers 6:26 (NIV)" },
    { text: "Remain in me, as I also remain in you.", ref: "John 15:4 (NIV)" },
    { text: "The Lord is my strength and my shield; my heart trusts in him, and he helps me. My heart leaps for joy, and with my song I praise him.", ref: "Psalm 28:7 (NIV)" },
    { text: "God is love. Whoever lives in love lives in God, and God in them.", ref: "1 John 4:16 (NIV)" },
    { text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me.", ref: "Psalm 23:4 (NIV)" },
    { text: "I can do all this through him who gives me strength.", ref: "Philippians 4:13 (NIV)" },
    { text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.", ref: "2 Timothy 1:7 (NIV)" },
    { text: "The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor.", ref: "Luke 4:18 (NIV)" },
    { text: "I keep my eyes always on the Lord. With him at my right hand, I will not be shaken.", ref: "Psalm 16:8 (NIV)" },
    { text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.", ref: "Lamentations 3:22–23 (NIV)" },
    { text: "God is our refuge and strength, an ever-present help in trouble.", ref: "Psalm 46:1 (NIV)" },
    { text: "For this God is our God for ever and ever; he will be our guide even to the end.", ref: "Psalm 48:14 (NIV)" },
    { text: "Take delight in the Lord, and he will give you the desires of your heart.", ref: "Psalm 37:4 (NIV)" },
    { text: "I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit.", ref: "John 15:5 (NIV)" }
  ],

  // 10. 영어 UI 텍스트
  ui: {
    ko: {
      lang: 'ko',
      appName: '항상기쁨',
      appSub: 'ALWAYS JOY',
      today: '오늘의 말씀',
      moreVerse: '말씀 더 보기',
      bigView: '크게 보기',
      quickWord: '말씀', quickHymn: '찬양', quickPrayer: '기도', quickGratitude: '감사',
      threeToday: '오늘의 세 가지',
      cmd1: '항상 기뻐하라', cmd1ref: '살전 5:16 · 기쁨은 훈련할 수 있습니다',
      cmd2: '쉬지 말고 기도하라', cmd2ref: '살전 5:17 · 하나님과 늘 연결되어 있습니다',
      cmd3: '범사에 감사하라', cmd3ref: '살전 5:18 · 작은 것에도 감사할 수 있습니다',
      streakDays: '일째 감사 중', streakStart: '오늘 첫 감사 써볼까요?',
      todayVerse: '오늘의 말씀', topicVerse: '주제별 말씀', sermons: '설교 · 유튜브',
      sermonsNote: '탭하면 유튜브 검색으로 연결됩니다',
      nowPlaying: '지금 듣는 찬양', allHymns: '찬양 목록',
      filterAll: '전체', filterCCM: '현대 CCM', filterHymnal: '전통 찬송가',
      prayerType: '기도 종류', prayerWrite: '기도 쓰기',
      prayerSaved: '이전 기도제목', noPrayer: '아직 기도제목이 없어요',
      prayerPlaceholder: '주님께 드리고 싶은 말씀을 자유롭게 적어보세요...',
      prayerSave: '🙏 저장하기',
      gratitudeToday: '오늘 감사한 일',
      gratitudeSave: '💛 감사 저장하기',
      gratitudeHistory: '감사 기록', noGratitude: '감사한 일을 적어보세요',
      gPlaceholder1: '오늘 감사한 일...', gPlaceholder2: '또 하나...', gPlaceholder3: '마지막으로...',
      gNote: '작은 것이라도 괜찮아요. 하나씩 적어보세요 🌿',
      albumBannerVerse: '"내가 너를 잊지 아니하리라"',
      albumBannerRef: '이사야 49:15',
      people: '소중한 분들', verses: '내 말씀', faith: '신앙 이야기', diary: '감사 기록',
      aboutLabel: '이 앱이 도와드리는 것',
      tabHome: '홈', tabWord: '말씀', tabHymn: '찬양', tabPrayer: '기도', tabGratitude: '감사', tabAlbum: '기억',
      obTitle: '항상기쁨', obSub: 'ALWAYS JOY',
      obVerse: '항상 기뻐하라\n쉬지 말고 기도하라\n범사에 감사하라',
      obVerseRef: '데살로니가전서 5:16–18',
      obNameLabel: '이름이 어떻게 되세요?', obNamePlaceholder: '홍길동',
      // 연령대를 고르는 칸이 있던 자리다. 없앴다 — '어르신 · 70대 이상' 이
      // 미리 골라져 있는 것을 보시고 "이런건 어릴때 하는 거야" 하셨다.
      // 나이를 묻는 순간 앱이 당신을 그렇게 부르는 것이 된다.
      // 대신 모두 같은 자리로 들어간다. \n 은 setPhrase 가 먹는 끊을 자리다.
      // ⚠ 개역한글(저작권 만료)만 쓴다. 개역개정·우리말성경은 넣지 않는다.
      // 그리고 '들어가지 못하리라' 쪽 구절(눅 18:17)이 아니라 '오는 것을
      // 금하지 말라' 쪽을 골랐다 — 첫 화면은 문을 여는 자리이므로.
      // \n 은 '여기서 끊어도 된다' 는 표시이지 '여기서 끊어라' 가 아니다.
      // 그림으로 확인해 보니 352px 자리에서는 앞 두 덩이가 한 줄에 들어가
      // 실제로는 두 줄로 떴다 — '…금하지 말라' / '하나님의 나라가…' 로,
      // 뜻이 끊기는 자리에서 갈렸으니 그대로 둔다. 좁은 폰에서는 석 줄이 된다.
      obWelcomeVerse: '어린 아이들의 내게 오는 것을\n용납하고 금하지 말라\n하나님의 나라가 이런 자의 것이니라',
      obWelcomeRef: '마가복음 10:14 (개역한글)',
      obNameRequired: '이름을 입력해 주세요',
      obStartBtn: '주님 안에서 시작하기 →',
      greetMorning: '좋은 아침이에요!', greetAfternoon: '좋은 오후예요!',
      greetEvening: '좋은 저녁이에요!', greetNight: '평안한 밤이에요',
      // 인사 문구의 \n 은 "여기서 끊어도 좋다"는 표시다. 좁은 폰에서 두 줄이
      // 될 때 이 자리에서만 갈리고, 나머지 낱말은 붙어서 함께 내려간다.
      greetMsg: '오늘도\n주님이 함께하십니다 🌿',
      // 캐릭터별 인사 — 아침 해 · 점심 숲 · 저녁 예수님
      greetMsgSun: '햇살처럼\n오늘을 열어요 ☀️',
      greetMsgForest: '잠시 쉬어가도\n괜찮아요 🌳',
      greetMsgJesus: '오늘도\n주님이 함께하십니다 🌿',
      // ── 기록이 어디에 있는지 알려 주는 안내 ──
      // 겁을 주는 경고가 아니다. 폰 안에는 잘 남아 있다는 말을 먼저 하고,
      // 폰을 바꿀 때만 조심하시라고 알린다. 첫 화면에 띄우지 않고 기록이
      // 어느 정도 쌓인 뒤에만 보여준다 (잃을 것이 생긴 뒤에 알려야 뜻이 있다).
      localOnlyTitle: '기록이 있는 곳',
      localOnlyL1: '지금까지 쓰신 기록은\n이 폰 안에 잘 남아 있어요 🌿',
      localOnlyL2: '다만 폰을 바꾸거나\n앱을 지우면 함께 사라져요.',
      localOnlyL3: '옮기는 방법을\n준비하고 있어요.',
      langToggle: 'English',
      closeBtn: '닫기', saveBtn: '저장하기', deleteBtn: '삭제',
      headerSuffix: '님, 주님 안에서 🌿',

      // ── 아래는 영어로 바꿀 때 화면에 붙는 문구들 ──
      // 예전에는 이 글들이 코드 안에 한글로 박혀 있어서 English 를 눌러도
      // 한국어가 그대로 남았다. 두 언어를 여기 나란히 두면 빠진 곳이
      // 눈에 보이고, applyLangUI() 가 한 자리에서 다 바꿔 준다.

      // 날짜 — formatDate() 가 읽는다
      dateFmt: '{y}년 {m}월 {d}일 ({w})',
      weekdays: ['일','월','화','수','목','금','토'],
      // 한국어는 달을 숫자로 부른다 ('7월'). 영어의 months(January…) 와
      // 짝을 맞춰 두는 이유는 두 가지다. ① 두 표에 같은 열쇠말이 있어야
      // 빠진 곳을 시험이 잡아낸다. ② dateFmt 에 {mn} 을 쓰고 싶어지면
      // 여기만 고치면 된다 — 코드에는 손대지 않는다.
      months: ['1월','2월','3월','4월','5월','6월',
               '7월','8월','9월','10월','11월','12월'],

      // 말씀 탭
      wordSubTopic: '주제별 말씀', wordSubRead: '성경읽기', wordSubVideo: '설교 유튜브',
      prevVerse: '← 이전', nextVerse: '다음 →',
      favDailyOn: '♥ 담아둔 말씀', favDailyOff: '♡ 이 말씀 담아두기',
      favAdd: '좋아하는 말씀에 담기', favRemove: '좋아하는 말씀에서 빼기',
      favAdded: '좋아하는 말씀에 담았습니다 ♥', favRemoved: '좋아하는 말씀에서 뺐습니다',

      // 성경읽기
      bibleRead: '성경읽기', bibleResume: '이어서 읽기',
      biblePrevCh: '← 이전 장', bibleNextCh: '다음 장 →', bibleToTop: '↑ 맨 위로',
      bibleTopAria: '본문 맨 위로',
      bibleBookAria: '성경 책 선택', bibleChapterAria: '장 선택',
      bibleLoading: '{book} {ch}장을 불러오는 중입니다…',
      bibleFailed: '본문을 불러오지 못했습니다.<br>인터넷 연결을 확인해 주세요.',
      bibleRetry: '다시 시도',
      bibleChapterUnit: '{n}장',
      bibleWhere: '{book} {ch}장',
      bibleProgressText: '{book} {done}/{total}장 읽음 · 전체 {all}/1189장',
      bibleOT: '구약', bibleNT: '신약', bibleBooksUnit: '{n}권',
      fontSizeLabel: '글씨 {size}',
      fontNormal: '보통', fontBig: '크게', fontHuge: '아주 크게',
      bibleSizeBtn: '글씨 크기 가',

      // 읽기 진도 (기억 탭)
      readProgress: '읽기 진도',
      readProgressAll: '전체 {done} / 1189장',
      readProgressNone: '아직 읽은 장이 없어요\n말씀 탭에서 성경읽기를 열어보세요',
      readProgressBooks: '{n}권을 펼쳐 보셨어요',

      // 찬양
      hymnNowPlaying: 'NOW PLAYING',
      // 그림(▶ ⏮ ⏭)만 있는 단추 — 눈에는 언어가 없지만
      // 읽어주는 기계에는 말이 있어야 한다
      hymnPlay: '찬양 듣기', hymnPause: '그만 듣기',
      hymnPrevAria: '앞 찬양', hymnNextAria: '다음 찬양',

      // 기도
      prayerSaveEmpty: '기도 내용을 입력해 주세요 🙏',
      prayerSaved2: '기도제목이 저장되었습니다 🙏',
      prayerKindFree: '기도',

      // 감사
      gratitudeStreak: '일째 감사 중 🔥',
      gratitudeStreakNone: '오늘 첫 감사를 써볼까요?',
      gratitudeEmpty: '감사한 일을 적어보세요<br>범사에 감사하라 · 살전 5:18',
      gratitudeSaveEmpty: '감사한 일을 하나라도 써주세요 💛',
      gratitudeSaved2: '감사 일기를 저장했습니다 💛',
      streakSub: '범사에 감사하라 · 살전 5:18',

      // 임마누엘 일기
      immTitle: '임마누엘 일기', immHistTitle: '임마누엘 일기 기록',
      immIntro: '임마누엘은 <b>하나님이 우리와 함께 계시다</b>는 뜻이에요.<br>주님이 지금 나를 어떻게 보고 계신지 천천히 적어보세요 🌿',
      immPhotoTitle: '오늘의 사진 (없어도 괜찮아요)',
      immPhotoAsk: '글로 적기 어려우면 사진만 남겨도 좋아요 (최대 5장)',
      immPhotoBtn: '📷 사진 고르기',
      immNote: '한 칸만 적어도 괜찮아요. 순서를 건너뛰어도 됩니다.',
      immSaveBtn: '🌿 임마누엘 일기 저장하기',
      immSaveEmpty: '한 칸이라도 적거나 사진을 넣어주세요 🌿',
      immSaved: '임마누엘 일기를 저장했습니다 🌿',
      immEmpty: '주님과 함께한 하루를 적어보세요<br>임마누엘 · 하나님이 우리와 함께 계시다',
      immPhotoCount: '{n} / {max}장',
      immPhotoOver: '사진은 {max}장까지만 넣을 수 있어요',
      immPhotoRemoved: '사진을 빼냈어요',
      immPhotoRemoveAria: '사진 빼기',
      immPhotoAlt: '그날의 사진',
      immPhotoAltToday: '오늘의 사진',
      immPhotoUnsupported: '이 브라우저에서는 사진을 넣을 수 없습니다',
      immPhotoOnlyImage: '사진 파일만 넣을 수 있어요',
      immPhotoPreparing: '사진을 준비하고 있어요...',
      immPhotoPreparingN: '사진 {n}장을 준비하고 있어요...',
      immPhotoAdded: '사진 {n}장을 넣었어요 ({size})',
      immPhotoOnlyMax: '{max}장까지만 담겨요',
      immPhotoTooBigN: '{n}장은 너무 커요',
      immPhotoFailedN: '{n}장 실패',
      immPhotoTooBig: '사진이 너무 커요. 다른 사진을 골라주세요',
      immPhotoFailed: '사진을 넣지 못했어요',
      immPhotoMore: '📷 사진 더 고르기',
      immPhotoFull: '📷 {max}장까지 넣었어요',

      // 기억 탭
      albumPeopleCount: '{n}명', albumVerseCount: '{n}개',
      albumFaithSub: '세례 · 교회', albumDiarySub: '감사일기 보기',
      gamesTitle: '추억의 게임',
      cloudTitle: '내 기록 이어가기',
      cloudNote: '감사일기 · 기도 · 좋아하는 말씀 · 읽기 진도가 함께 보관됩니다.<br>로그인하지 않아도 이 폰에는 그대로 남아 있습니다.',
      cloudSignin: '카카오로 시작하기', cloudSync: '지금 맞추기', cloudSignout: '로그아웃',
      cloudWhoAnon: '로그인하면 폰을 바꿔도 기록이 이어집니다',
      cloudNotReady: '아직 연결 준비가 안 됐습니다',
      cloudSigninFail: '로그인을 시작하지 못했습니다',
      cloudSignedOut: '로그아웃했습니다. 기록은 폰에 남아 있습니다',
      cloudPulled: '기록을 불러왔습니다 ☁',
      cloudSyncing: '맞추는 중…',
      cloudSyncLater: '나중에 다시 맞춥니다',
      cloudWhoIn: '{name} 님 · 기록이 이어집니다',
      cloudWhoInNoName: '로그인됨 · 기록이 이어집니다',

      // 기억앨범 창
      modalPeople: '소중한 분들 👨‍👩‍👧',
      modalVerses: '내가 좋아하는 말씀 📖',
      modalFaith: '나의 신앙 이야기 ✝️',
      mPersonName: '이름 (예: 김철수)', mPersonRel: '관계 (예: 큰아들, 담임목사님)',
      mPersonNote: '기도제목 또는 메모',
      mPeopleEmpty: '소중한 분들의 이름을 기억해요',
      mVerseText: '말씀을 적어보세요', mVerseRef: '출처 (예: 요한복음 3:16)',
      mVersesEmpty: '마음에 새긴 말씀을 기록해 두세요',
      mFaithBaptism: '세례일 (예: 1985년 봄)', mFaithChurch: '교회 이름',
      mFaithNote: '나의 신앙 이야기, 감사한 기억들...',
      mNameRequired: '이름을 입력해 주세요',
      mVerseRequired: '말씀을 입력해 주세요',
      mPersonSaved: '{name}님을 기억에 저장했습니다 💛',
      mVerseSaved: '말씀이 저장되었습니다 📖',
      mFaithSaved: '신앙 이야기가 저장되었습니다 ✝️',

      // 성경 역사 흐름 탭
      storyTitle: '성경 역사 흐름 읽기', storyEraPick: '시대 선택',
      storySection: '역사 이야기', storyKeyVerses: '핵심 구절',
      storyModern: '오늘 나의 삶과 연결', storyAll: '전체 성경 역사 흐름',
      storyProgress: '{done} / {total} 시대 읽음',
      ttsRead: '읽어주기', ttsSlow: '느리게', ttsNormal: '보통', ttsFast: '빠르게',
      ttsPlayAria: '읽어주기 시작', ttsPauseAria: '읽어주기 잠깐 멈춤',
      ttsStopAria: '읽어주기 그만',
      ttsReading: '▶ 읽는 중...', ttsDone: '✓ 읽기 완료',
      ttsUnsupported: '이 브라우저는 읽어주기 기능을 지원하지 않습니다',
      ttsFailed: '읽어주기를 시작할 수 없습니다',
      ttsKeyVerses: '핵심 구절',

      // 말로 쓰기 (voice.js)
      micWrite: '말로 쓰기', micStop: '그만 말하기',
      micListening: '듣고 있어요...',
      micUnsupported: '이 브라우저에서는 말로 쓰기를 쓸 수 없어요',
      micInsecure: '안전한 연결(https)에서만 마이크를 쓸 수 있어요',
      micOffline: '말로 쓰기는 인터넷이 있어야 해요',
      micDenied: '마이크 사용을 허용해 주세요',
      micNoStart: '마이크를 켤 수 없어요',
      micAlreadyOn: '마이크가 이미 켜져 있어요',
      micSpeak: '말씀하세요. 천천히 하셔도 됩니다 🎤',
      micNetLost: '인터넷이 끊겨서 받아쓰기를 멈췄어요',
      micNoDevice: '마이크를 찾지 못했어요',
      micPaused: '받아쓰기를 잠시 멈췄어요. 다시 눌러 주세요',
      tidyAria: '철자 다듬기', tidyBtn: '다듬기',
      tidyEmpty: '먼저 기도를 적어 주세요 🙏',
      tidyUndone: '원래 글로 되돌렸어요',
      tidyNothing: '고칠 곳이 없어요. 잘 적으셨습니다 🌿',
      tidyDone: '철자를 다듬었어요. 한 번 더 누르면 되돌립니다',
      readAloud: '읽어주기', readAloudStop: '그만 듣기',

      // 추억의 게임 (games.js)
      gameHymnTitle: '찬송가 이어 부르기',
      gameHymnSub: '다음 줄이 뭘까요? 평생 부르신 노래예요',
      gamePeopleTitle: '성경 인물 맞추기',
      gamePeopleSub: '설명을 보고 누구인지 골라보세요',
      gamePairTitle: '짝 맞추기',
      gamePairSub: '같은 그림 두 장을 찾아보세요',
      gameNote: '시간을 재지 않아요. 천천히 하셔도 됩니다 🌿',
      gamePlays: '지금까지 {n}번 즐기셨어요',
      gameNoQuiz: '지금은 문제를 준비할 수 없어요',
      gameHymnHead: '찬송가 이어 부르기 🎵',
      gamePeopleHead: '성경 인물 맞추기 👤',
      gamePairHead: '짝 맞추기 🃏',
      gameAskHymn: '다음 줄은 무엇일까요?',
      gameAskPeople: '설명을 읽어 보세요',
      gameAskPair: '같은 그림 두 장을 찾아 눌러 보세요',
      gameWhoIs: '이분은 누구실까요?',
      gameSoft: '다시 한번 보실래요? 천천히요 🌿',
      gameGood: '잘하셨어요! 🎉',
      gameNext: '다음 문제 →', gameLast: '다 했어요',
      gamePairFound: '짝을 찾으셨어요! 🎉 ({n} / 6)',
      gamePairMiss: '다른 짝이네요. 다시 볼까요? 🌿',
      gameEndHead: '오늘도 잘하셨어요 🌿',
      gameEndTitle: '끝까지 하셨어요',
      gameEndSub: '하나님이 주신 기쁨이\n오늘도 함께합니다',
      gameAgain: '한 번 더 할까요', gameQuit: '그만할래요',
      gameExit: '그만하고 나가기',
      gameCardAria: '카드',

      // 공통
      fsvClose: '괜찮아요, 계속할게요',
      // 화면 밝기 — '저절로' 밑에는 이 달의 해 지는 시각이 들어간다.
      // 낱말이 줄 끝에서 갈리지 않게 \n 으로 끊을 자리를 정해 둔다.
      screenModeTitle: '화면 밝기',
      screenModeAuto: '저절로',
      screenModeAutoSub: '{time}쯤\n어두워져요',
      screenModeDay: '밝게', screenModeDaySub: '늘 밝은 화면',
      screenModeNight: '어둡게', screenModeNightSub: '늘 어두운 화면',
      screenModeSaved: '화면을 「{mode}」로 두었어요',
      aboutTitle: '이 앱이 도와드리는 것',
      about1: '매일 말씀으로 하나님을 만나게',
      about2: '찬양으로 기쁨을 회복하게',
      about3: '기도로 주님과 연결되게',
      about4: '감사로 마음이 밝아지게',
      about5: '소중한 분들을 기억하게',
      cbOpen: '열기', cbClose: '닫기',
      cbDefault: '😊 주님이 오늘도 함께하십니다!',
      countUnit: '{n}개',
      tabStory: '역사',
      charAlt: '캐릭터',
    },
    en: {
      lang: 'en',
      appName: 'Always Joy',
      appSub: '항상기쁨',
      today: "Today's Verse",
      moreVerse: 'More Verses',
      bigView: 'Full Screen',
      quickWord: 'Word', quickHymn: 'Hymns', quickPrayer: 'Prayer', quickGratitude: 'Gratitude',
      threeToday: "Today's Three",
      cmd1: 'Rejoice always', cmd1ref: '1 Thess 5:16 · Joy can be trained',
      cmd2: 'Pray continually', cmd2ref: '1 Thess 5:17 · Always connected to God',
      cmd3: 'Give thanks in all things', cmd3ref: '1 Thess 5:18 · Even small things',
      streakDays: '-day gratitude streak 🔥', streakStart: 'Start your first gratitude today!',
      todayVerse: "Today's Verse (NIV)", topicVerse: 'Verses by Topic', sermons: 'Sermons · YouTube',
      sermonsNote: 'Tap to search on YouTube',
      nowPlaying: 'Now Playing', allHymns: 'Hymn List',
      filterAll: 'All', filterCCM: 'Modern CCM', filterHymnal: 'Traditional Hymns',
      prayerType: 'Prayer Type', prayerWrite: 'Write a Prayer',
      prayerSaved: 'Saved Prayers', noPrayer: 'No prayers saved yet',
      prayerPlaceholder: 'Share anything with the Lord...',
      prayerSave: '🙏 Save Prayer',
      gratitudeToday: "Today's Gratitude",
      gratitudeSave: '💛 Save Gratitude',
      gratitudeHistory: 'Gratitude History', noGratitude: 'Write what you are grateful for',
      gPlaceholder1: 'Something I am grateful for...', gPlaceholder2: 'One more thing...', gPlaceholder3: 'And one more...',
      gNote: 'Even small things count. Take it one by one 🌿',
      albumBannerVerse: '"I will not forget you."',
      albumBannerRef: 'Isaiah 49:15 (NIV)',
      people: 'People I Love', verses: 'My Verses', faith: 'My Faith Story', diary: 'Gratitude Diary',
      aboutLabel: 'How this app helps you',
      tabHome: 'Home', tabWord: 'Word', tabHymn: 'Hymns', tabPrayer: 'Prayer', tabGratitude: 'Thanks', tabAlbum: 'Memory',
      obTitle: 'Always Joy', obSub: '항상기쁨',
      obVerse: 'Rejoice always\nPray continually\nGive thanks in all circumstances',
      obVerseRef: '1 Thessalonians 5:16–18 (NIV)',
      obNameLabel: 'What is your name?', obNamePlaceholder: 'Your Name',
      // 한국어와 같은 자리 — WEB(저작권 만료)에서 가져왔다
      obWelcomeVerse: 'Allow the little children\nto come to me, and don’t forbid them;\nfor the Kingdom of God belongs to such as these',
      obWelcomeRef: 'Mark 10:14 (WEB)',
      obNameRequired: 'Please enter your name',
      obStartBtn: 'Begin in the Lord →',
      greetMorning: 'Good morning!', greetAfternoon: 'Good afternoon!',
      greetEvening: 'Good evening!', greetNight: 'Peaceful night',
      // 한국어와 같은 규칙 — \n 이 끊어도 되는 자리다.
      // 영어는 원래 공백에서 끊기지만, 여기서도 뜻 단위로 접히게 맞춰 둔다.
      greetMsg: 'The Lord is\nwith you today 🌿',
      greetMsgSun: 'Open the day\nlike sunshine ☀️',
      greetMsgForest: "It's okay\nto rest awhile 🌳",
      greetMsgJesus: 'The Lord is\nwith you today 🌿',
      // 한국어와 같은 규칙 — \n 이 끊어도 되는 자리다
      localOnlyTitle: 'Where your records are',
      localOnlyL1: 'Everything you have written\nis safe on this phone 🌿',
      localOnlyL2: 'But it goes away if you change\nphones or delete the app.',
      localOnlyL3: 'A way to move it\nis on the way.',
      langToggle: '한국어',
      closeBtn: 'Close', saveBtn: 'Save', deleteBtn: 'Delete',
      headerSuffix: ', in the Lord 🌿',

      // ── 위 ko 블록과 하나하나 짝이다. 한쪽에만 있으면 t() 가 열쇠말을
      //    그대로 뱉어서 화면에 'gratitudeStreak' 같은 글자가 보인다.
      dateFmt: '{w}, {mn} {d}, {y}',
      weekdays: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
      months: ['January','February','March','April','May','June',
               'July','August','September','October','November','December'],

      wordSubTopic: 'By Topic', wordSubRead: 'Read the Bible', wordSubVideo: 'Sermons',
      prevVerse: '← Previous', nextVerse: 'Next →',
      favDailyOn: '♥ Saved verse', favDailyOff: '♡ Save this verse',
      favAdd: 'Save to my verses', favRemove: 'Remove from my verses',
      favAdded: 'Saved to your verses ♥', favRemoved: 'Removed from your verses',

      bibleRead: 'Read the Bible', bibleResume: 'Continue reading',
      biblePrevCh: '← Previous', bibleNextCh: 'Next →', bibleToTop: '↑ Back to top',
      bibleTopAria: 'Back to top of chapter',
      bibleBookAria: 'Choose a book', bibleChapterAria: 'Choose a chapter',
      bibleLoading: 'Loading {book} {ch}…',
      bibleFailed: 'Could not load the text.<br>Please check your connection.',
      bibleRetry: 'Try again',
      bibleChapterUnit: 'Chapter {n}',
      bibleWhere: '{book} {ch}',
      bibleProgressText: '{book} {done}/{total} chapters · {all}/1189 in all',
      bibleOT: 'Old Testament', bibleNT: 'New Testament', bibleBooksUnit: '{n} books',
      fontSizeLabel: 'Text {size}',
      fontNormal: 'Normal', fontBig: 'Large', fontHuge: 'Extra Large',
      bibleSizeBtn: 'Text size A',

      readProgress: 'Reading progress',
      readProgressAll: '{done} of 1189 chapters',
      readProgressNone: 'No chapters read yet\nOpen Read the Bible in the Word tab',
      readProgressBooks: 'You have opened {n} books',

      hymnNowPlaying: 'NOW PLAYING',
      hymnPlay: 'Play the hymn', hymnPause: 'Stop the hymn',
      hymnPrevAria: 'Previous hymn', hymnNextAria: 'Next hymn',

      prayerSaveEmpty: 'Please write your prayer 🙏',
      prayerSaved2: 'Your prayer has been saved 🙏',
      prayerKindFree: 'Prayer',

      gratitudeStreak: '-day gratitude streak 🔥',
      gratitudeStreakNone: 'Shall we write your first gratitude today?',
      gratitudeEmpty: 'Write what you are grateful for<br>Give thanks in all circumstances · 1 Thess 5:18',
      gratitudeSaveEmpty: 'Please write at least one thing 💛',
      gratitudeSaved2: 'Your gratitude diary has been saved 💛',
      streakSub: 'Give thanks in all things · 1 Thess 5:18',

      immTitle: 'Immanuel Journal', immHistTitle: 'Immanuel Journal History',
      immIntro: 'Immanuel means <b>God is with us</b>.<br>Take your time and write how the Lord sees you right now 🌿',
      immPhotoTitle: "Today's photo (it's fine without one)",
      immPhotoAsk: 'If writing is hard, a photo alone is enough (up to 5)',
      immPhotoBtn: '📷 Choose photos',
      immNote: 'One line is enough. You may skip any step.',
      immSaveBtn: '🌿 Save Immanuel Journal',
      immSaveEmpty: 'Please write one line or add a photo 🌿',
      immSaved: 'Your Immanuel journal has been saved 🌿',
      immEmpty: 'Write about your day with the Lord<br>Immanuel · God is with us',
      immPhotoCount: '{n} / {max} photos',
      immPhotoOver: 'You can add up to {max} photos',
      immPhotoRemoved: 'Photo removed',
      immPhotoRemoveAria: 'Remove photo',
      immPhotoAlt: 'Photo from that day',
      immPhotoAltToday: "Today's photo",
      immPhotoUnsupported: 'This browser cannot add photos',
      immPhotoOnlyImage: 'Only image files can be added',
      immPhotoPreparing: 'Getting the photo ready...',
      immPhotoPreparingN: 'Getting {n} photos ready...',
      immPhotoAdded: 'Added {n} photos ({size})',
      immPhotoOnlyMax: 'only {max} could be kept',
      immPhotoTooBigN: '{n} were too large',
      immPhotoFailedN: '{n} failed',
      immPhotoTooBig: 'That photo is too large. Please choose another one',
      immPhotoFailed: 'Could not add the photo',
      immPhotoMore: '📷 Choose more photos',
      immPhotoFull: '📷 {max} photos added',

      albumPeopleCount: '{n} people', albumVerseCount: '{n} verses',
      albumFaithSub: 'Baptism · Church', albumDiarySub: 'See gratitude diary',
      gamesTitle: 'Games to Remember',
      cloudTitle: 'Keep My Records',
      cloudNote: 'Your gratitude, prayers, saved verses and reading progress are kept together.<br>Even without signing in, everything stays on this phone.',
      cloudSignin: 'Start with Kakao', cloudSync: 'Sync now', cloudSignout: 'Sign out',
      cloudWhoAnon: 'Sign in and your records follow you to a new phone',
      cloudNotReady: 'The connection is not ready yet',
      cloudSigninFail: 'Could not start sign-in',
      cloudSignedOut: 'Signed out. Your records are still on this phone',
      cloudPulled: 'Your records have been loaded ☁',
      cloudSyncing: 'Syncing…',
      cloudSyncLater: 'Will sync again later',
      cloudWhoIn: '{name} · your records continue',
      cloudWhoInNoName: 'Signed in · your records continue',

      modalPeople: 'People I Love 👨‍👩‍👧',
      modalVerses: 'My Verses 📖',
      modalFaith: 'My Faith Story ✝️',
      mPersonName: 'Name (e.g. John Kim)', mPersonRel: 'Relationship (e.g. eldest son, our pastor)',
      mPersonNote: 'Prayer request or a note',
      mPeopleEmpty: 'We remember the names of those you love',
      mVerseText: 'Write the verse', mVerseRef: 'Reference (e.g. John 3:16)',
      mVersesEmpty: 'Keep the verses written on your heart',
      mFaithBaptism: 'Baptism (e.g. spring of 1985)', mFaithChurch: 'Church name',
      mFaithNote: 'My faith story, memories I am thankful for...',
      mNameRequired: 'Please enter a name',
      mVerseRequired: 'Please enter the verse',
      mPersonSaved: '{name} has been saved to your memories 💛',
      mVerseSaved: 'The verse has been saved 📖',
      mFaithSaved: 'Your faith story has been saved ✝️',

      storyTitle: 'Walk Through Bible History', storyEraPick: 'Choose an era',
      storySection: 'The Story', storyKeyVerses: 'Key Verses',
      storyModern: 'For My Life Today', storyAll: 'All Eras of Bible History',
      storyProgress: '{done} / {total} eras read',
      ttsRead: 'Read aloud', ttsSlow: 'Slow', ttsNormal: 'Normal', ttsFast: 'Fast',
      ttsPlayAria: 'Start reading aloud', ttsPauseAria: 'Pause reading',
      ttsStopAria: 'Stop reading',
      ttsReading: '▶ Reading...', ttsDone: '✓ Finished',
      ttsUnsupported: 'This browser cannot read aloud',
      ttsFailed: 'Could not start reading aloud',
      ttsKeyVerses: 'Key Verses',

      micWrite: 'Speak instead', micStop: 'Stop speaking',
      micListening: 'Listening...',
      micUnsupported: 'Speaking is not available in this browser',
      micInsecure: 'The microphone works only on a secure (https) connection',
      micOffline: 'Speaking needs an internet connection',
      micDenied: 'Please allow microphone access',
      micNoStart: 'Could not turn on the microphone',
      micAlreadyOn: 'The microphone is already on',
      micSpeak: 'Go ahead. Take your time 🎤',
      micNetLost: 'The connection dropped, so writing stopped',
      micNoDevice: 'No microphone was found',
      micPaused: 'Writing paused. Please tap again',
      tidyAria: 'Tidy the spelling', tidyBtn: 'Tidy up',
      tidyEmpty: 'Please write your prayer first 🙏',
      tidyUndone: 'Put back the way you wrote it',
      tidyNothing: 'Nothing to fix. Well written 🌿',
      tidyDone: 'Spelling tidied. Tap again to undo',
      readAloud: 'Read aloud', readAloudStop: 'Stop reading',

      gameHymnTitle: 'Finish the Hymn',
      gameHymnSub: "What's the next line? Songs you've sung all your life",
      gamePeopleTitle: 'Guess the Bible Person',
      gamePeopleSub: 'Read the clue and choose who it is',
      gamePairTitle: 'Find the Pairs',
      gamePairSub: 'Find the two cards that match',
      gameNote: 'Nothing is timed. Take all the time you like 🌿',
      gamePlays: 'You have played {n} times',
      gameNoQuiz: 'No questions are ready right now',
      gameHymnHead: 'Finish the Hymn 🎵',
      gamePeopleHead: 'Guess the Bible Person 👤',
      gamePairHead: 'Find the Pairs 🃏',
      gameAskHymn: 'What is the next line?',
      gameAskPeople: 'Read the clue',
      gameAskPair: 'Tap the two cards that match',
      gameWhoIs: 'Who is this?',
      gameSoft: 'Shall we look once more? Take your time 🌿',
      gameGood: 'Well done! 🎉',
      gameNext: 'Next question →', gameLast: "That's all",
      gamePairFound: 'You found a pair! 🎉 ({n} / 6)',
      gamePairMiss: 'Not a match. Shall we look again? 🌿',
      gameEndHead: 'Well done today 🌿',
      gameEndTitle: 'You finished it all',
      gameEndSub: 'The joy God gives\nis with you today too',
      gameAgain: 'Shall we play again', gameQuit: "I'll stop here",
      gameExit: 'Stop and close',
      gameCardAria: 'Card',

      fsvClose: "I'm alright, let's go on",
      screenModeTitle: 'Screen brightness',
      screenModeAuto: 'Automatic',
      screenModeAutoSub: 'Dims around\n{time}',
      screenModeDay: 'Light', screenModeDaySub: 'Always bright',
      screenModeNight: 'Dark', screenModeNightSub: 'Always dark',
      screenModeSaved: 'Screen set to "{mode}"',
      aboutTitle: 'How this app helps you',
      about1: 'Meet God in his word each day',
      about2: 'Recover joy through praise',
      about3: 'Stay connected to the Lord in prayer',
      about4: 'Brighten your heart with thanks',
      about5: 'Remember the people you love',
      cbOpen: 'Open', cbClose: 'Close',
      cbDefault: '😊 The Lord is with you today!',
      countUnit: '{n}',
      tabStory: 'History',
      charAlt: 'Character',
    }
  }
};
