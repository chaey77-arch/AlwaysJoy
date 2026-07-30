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
  verseTopics: [
    {
      key: 'peace',
      label: '평안',
      icon: '☮️',
      verses: [
        { text: "하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라", ref: "빌립보서 4:7" },
        { text: "내가 너희에게 평안을 끼치노니 곧 나의 평안을 너희에게 주노라", ref: "요한복음 14:27" },
        { text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", ref: "마태복음 11:28" }
      ]
    },
    {
      key: 'joy',
      label: '기쁨',
      icon: '😊',
      verses: [
        { text: "항상 기뻐하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라", ref: "데살로니가전서 5:16,18" },
        { text: "여호와를 기뻐하는 것이 너희의 힘이니라", ref: "느헤미야 8:10" },
        { text: "여호와를 기뻐하라 그가 네 마음의 소원을 네게 이루어 주시리로다", ref: "시편 37:4" }
      ]
    },
    {
      key: 'strength',
      label: '힘과 용기',
      icon: '💪',
      verses: [
        { text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라", ref: "이사야 41:10" },
        { text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", ref: "빌립보서 4:13" },
        { text: "여호와는 나의 힘이요 나의 구원이시니", ref: "시편 27:1" }
      ]
    },
    {
      key: 'love',
      label: '하나님의 사랑',
      icon: '❤️',
      verses: [
        { text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니", ref: "요한복음 3:16" },
        { text: "하나님은 사랑이심이라", ref: "요한일서 4:16" },
        { text: "여호와의 인자와 자비는 무궁하여 아침마다 새로우니", ref: "예레미야애가 3:22-23" }
      ]
    },
    {
      key: 'presence',
      label: '주님의 임재',
      icon: '✨',
      verses: [
        { text: "내가 항상 주를 내 앞에 모심이여 그가 나의 오른쪽에 계시므로 내가 흔들리지 아니하리로다", ref: "시편 16:8" },
        { text: "내 안에 거하라 나도 너희 안에 거하리라", ref: "요한복음 15:4" },
        { text: "내가 너와 함께 있어 네가 어디로 가든지 너를 지키며", ref: "창세기 28:15" }
      ]
    }
  ],

  // 4. 큐레이션 설교/유튜브 목록 (searchQuery 기반 — 링크 오류 없음)
  videos: [
    {
      category: '시애틀 형제교회',
      icon: '⛪',
      items: [
        { title: "시애틀 형제교회 주일설교", channel: "시애틀 형제교회", searchQuery: "시애틀 형제교회 주일설교", thumb: '⛪' },
        { title: "시애틀 형제교회 새벽기도", channel: "시애틀 형제교회", searchQuery: "시애틀 형제교회 새벽기도", thumb: '🌅' }
      ]
    },
    {
      category: '잘믿고잘사는법',
      icon: '📖',
      items: [
        { title: "잘믿고잘사는법 — 기쁨 회복", channel: "잘믿고잘사는법", searchQuery: "잘믿고잘사는법 기쁨 회복", thumb: '📖' },
        { title: "잘믿고잘사는법 — 기도하는 삶", channel: "잘믿고잘사는법", searchQuery: "잘믿고잘사는법 기도", thumb: '🙏' }
      ]
    },
    {
      category: '온누리교회',
      icon: '🏛️',
      items: [
        { title: "온누리교회 주일예배 설교", channel: "온누리교회", searchQuery: "온누리교회 주일예배 설교", thumb: '🏛️' },
        { title: "온누리교회 관계기술훈련", channel: "온누리교회", searchQuery: "온누리교회 관계기술훈련", thumb: '🤝' }
      ]
    },
    {
      category: '임마누엘 신앙',
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
      note: "오늘의 핵심 말씀"
    },
    {
      id: 2,
      title: "주님 한 분만으로",
      artist: "Hillsong · 현대 CCM",
      tag: "CCM",
      youtubeSearch: "주님 한 분만으로 찬양",
      lyrics: "주님 한 분만으로\n내 영혼이 만족해\n주님 한 분만으로\n내 삶이 풍성해\n\n주님 사랑해요\n주님만 바라봐요\n주님 한 분만으로 충분해",
      note: "마음이 공허할 때"
    },
    {
      id: 3,
      title: "주 이름 찬양",
      artist: "Blessed Be Your Name",
      tag: "CCM",
      youtubeSearch: "주 이름 찬양 blessed be your name 한국어",
      lyrics: "주 이름 찬양\n풍요로울 때\n주 이름 찬양\n거친 길을 걸을 때\n\n주시고 거두시는 주님을 찬양\n복되신 주의 이름 찬양합니다",
      note: "어떤 상황에서도"
    },
    {
      id: 4,
      title: "하나님 아버지의 마음",
      artist: "현대 CCM",
      tag: "CCM",
      youtubeSearch: "하나님 아버지의 마음 찬양",
      lyrics: "하나님 아버지의 마음\n내 안에 부어주소서\n잃어버린 영혼들을\n주의 눈으로 바라보게\n\n주의 마음으로\n이 세상을 바라보게 하소서",
      note: "다른 이를 위해 기도할 때"
    },
    {
      id: 5,
      title: "여호와는 나의 목자",
      artist: "시편 23편 CCM",
      tag: "CCM",
      youtubeSearch: "여호와는 나의 목자시니 CCM 찬양",
      lyrics: "여호와는 나의 목자시니\n내게 부족함이 없으리로다\n그가 나를 푸른 초장에 누이시며\n쉬운 물가으로 인도하시는도다\n\n내 영혼을 소생시키시고\n의의 길로 인도하시는도다",
      note: "평안이 필요할 때"
    },
    {
      id: 6,
      title: "주님 품에 안기어",
      artist: "복음 CCM",
      tag: "CCM",
      youtubeSearch: "주님 품에 안기어 찬양 CCM",
      lyrics: "주님 품에 안기어\n눈물 흘려도\n주님 사랑 안에서\n쉬어 갑니다\n\n지치고 힘든 날 주께로 나아가\n위로와 평안을 얻습니다",
      note: "위로가 필요할 때"
    },
    // ── 전통 찬송가 ──
    {
      id: 7,
      title: "주 하나님 지으신 모든 세계",
      artist: "찬송가 79장",
      tag: "찬송가",
      youtubeSearch: "주 하나님 지으신 모든 세계 찬송가",
      lyrics: "주 하나님 지으신 모든 세계\n내 마음 속에 그리어볼 때\n하늘의 별 울려 퍼지는 뇌성\n주님의 권능 우주에 찼네\n\n주님 내 하나님 위대하신 주\n내 맘에 기쁨 넘치고 넘쳐\n경배드리나이다",
      note: "자연을 보며"
    },
    {
      id: 8,
      title: "나 같은 죄인 살리신",
      artist: "찬송가 305장 (Amazing Grace)",
      tag: "찬송가",
      youtubeSearch: "나 같은 죄인 살리신 찬송가 amazing grace",
      lyrics: "나 같은 죄인 살리신\n주 은혜 놀라워\n잃었던 생명 찾았고\n광명을 얻었네\n\n큰 죄악에서 건지신\n주 은혜 고맙다\n나 처음 믿은 그 시간\n귀하고 귀하다",
      note: "은혜 생각날 때"
    },
    {
      id: 9,
      title: "예수 사랑하심은",
      artist: "찬송가 411장",
      tag: "찬송가",
      youtubeSearch: "예수 사랑하심은 찬송가 411장",
      lyrics: "예수 사랑하심은\n거룩하신 말일세\n우리들은 약하나\n예수 권세 많도다\n\n날 사랑하심\n날 사랑하심\n날 사랑하심\n성경에 써 있네",
      note: "어릴 때부터 아는 찬양"
    },
    {
      id: 10,
      title: "내 주를 가까이 하게 함은",
      artist: "찬송가 364장",
      tag: "찬송가",
      youtubeSearch: "내 주를 가까이 하게 함은 찬송가 364장",
      lyrics: "내 주를 가까이 하게 함은\n십자가 짐 같은 고생이나\n내 일생 소원은 늘 찬송하면서\n주께 더 나가기 원합니다\n\n내 주를 가까이 내 주를 가까이\n주께 더 나가기 원합니다",
      note: "기도 드릴 때"
    },
    {
      id: 11,
      title: "기뻐하며 경배하세",
      artist: "찬송가 20장",
      tag: "찬송가",
      youtubeSearch: "기뻐하며 경배하세 찬송가 20장",
      lyrics: "기뻐하며 경배하세\n영광의 주 하나님\n천지 지은 큰 권능을\n찬양을 드리세\n\n기쁨과 감사 드리며\n경배를 드리세",
      note: "기쁨이 필요할 때"
    },
    {
      id: 12,
      title: "저 높은 곳을 향하여",
      artist: "찬송가 491장",
      tag: "찬송가",
      youtubeSearch: "저 높은 곳을 향하여 찬송가 491장",
      lyrics: "저 높은 곳을 향하여\n날마다 나아갑니다\n내 뜻과 정성 모두어\n날마다 기도합니다\n\n내 주여 내 발 붙드사\n그 곳에 서게 하소서",
      note: "소망을 드릴 때"
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
      note: "지나온 길을 돌아볼 때"
    },
    {
      id: 14,
      title: "축복하노라",
      artist: "손경민",
      tag: "CCM",
      youtubeSearch: "손경민 축복하노라 찬양",
      lyrics: "축복하노라\n주의 이름으로\n축복하노라\n\n주의 사랑이\n너와 함께 있으리",
      note: "사랑하는 이를 위해"
    },
    {
      id: 15,
      title: "우리 함께 기도해",
      artist: "손경민",
      tag: "CCM",
      youtubeSearch: "손경민 우리 함께 기도해 찬양",
      lyrics: "우리 함께 기도해\n주님 앞에 무릎 꿇고\n\n혼자가 아니야\n주님이 들으시니",
      note: "함께 기도하고 싶을 때"
    },
    {
      id: 16,
      title: "혼자 걷지 않을 거예요",
      artist: "예람워십",
      tag: "CCM",
      youtubeSearch: "혼자 걷지 않을 거예요 예람워십 찬양",
      lyrics: "혼자 걷지 않을 거예요\n주님이 함께 걸으시니\n\n어두운 길이어도\n손 잡아 주시니",
      note: "외로운 날에"
    },

    // ── 위로가 되는 현대 CCM ──
    {
      id: 17,
      title: "하나님의 은혜",
      artist: "신상우 · 현대 CCM",
      tag: "CCM",
      youtubeSearch: "하나님의 은혜 나를 지으신 이가 하나님 찬양",
      lyrics: "나를 지으신 이가 하나님\n나를 부르신 이가 하나님\n나를 보내신 이도 하나님\n나의 나 된 것은\n다 하나님 은혜라",
      note: "내가 누구인지 잊었을 때"
    },
    {
      id: 18,
      title: "소원",
      artist: "한웅재 · 현대 CCM",
      tag: "CCM",
      youtubeSearch: "소원 한웅재 삶의 작은 일에도 찬양",
      lyrics: "삶의 작은 일에도\n그 뜻을 헤아리게 하시고\n\n그 길만 걸으며\n주 곁에 머물게 하소서",
      note: "하루를 맡기고 싶을 때"
    },
    {
      id: 19,
      title: "주 은혜임을",
      artist: "현대 CCM",
      tag: "CCM",
      youtubeSearch: "주 은혜임을 찬양 CCM",
      lyrics: "돌아보니 모든 것이\n주 은혜임을\n\n나의 삶의 모든 순간\n주님 손길이었네",
      note: "감사가 떠오를 때"
    },

    // ── 어르신께 익숙한 찬송가 ──
    {
      id: 20,
      title: "지금까지 지내온 것",
      artist: "찬송가 301장",
      tag: "찬송가",
      youtubeSearch: "지금까지 지내온 것 찬송가 301장",
      lyrics: "지금까지 지내온 것\n주의 크신 은혜라\n한이 없는 주의 사랑\n어찌 이루 말하랴\n\n자나 깨나 주의 손이\n항상 살펴 주시고",
      note: "살아온 세월을 감사할 때"
    },
    {
      id: 21,
      title: "나의 갈 길 다 가도록",
      artist: "찬송가 384장",
      tag: "찬송가",
      youtubeSearch: "나의 갈 길 다 가도록 찬송가 384장",
      lyrics: "나의 갈 길 다 가도록\n예수 인도하시니\n내 주 안에 있는 긍휼\n어찌 의심하리요\n\n믿음으로 사는 자는\n하늘 위로 받겠네",
      note: "앞이 안 보일 때"
    },
    {
      id: 22,
      title: "주의 친절한 팔에 안기세",
      artist: "찬송가 405장",
      tag: "찬송가",
      youtubeSearch: "주의 친절한 팔에 안기세 찬송가 405장",
      lyrics: "주의 친절한 팔에 안기세\n우리 맘이 평안하리로다\n\n주의 친절한 팔에 안기세\n영원토록 주 품에 안기세",
      note: "쉬고 싶을 때"
    },
    {
      id: 23,
      title: "내 영혼이 은총 입어",
      artist: "찬송가 438장",
      tag: "찬송가",
      youtubeSearch: "내 영혼이 은총 입어 찬송가 438장",
      lyrics: "내 영혼이 은총 입어\n중한 죄짐 벗었네\n주 예수와 동행하니\n그 어디나 하늘나라\n\n할렐루야 찬양하세\n내 모든 죄 사함받고",
      note: "마음이 무거울 때"
    },
    {
      id: 24,
      title: "예수로 나의 구주 삼고",
      artist: "찬송가 288장",
      tag: "찬송가",
      youtubeSearch: "예수로 나의 구주 삼고 찬송가 288장",
      lyrics: "예수로 나의 구주 삼고\n성령과 피로써 거듭나니\n이 세상에서 내 영혼이\n하늘의 영광 누리도다\n\n이것이 나의 찬송이라\n나 사는 동안 찬송하리",
      note: "확신이 필요할 때"
    }
  ],

  // 6. 기도 안내 (Life Model: 하나님의 임재 인식 → 기쁨 회복)
  prayerGuides: [
    {
      type: 'morning',
      title: '아침 기도',
      icon: '🌅',
      guide: [
        "주님, 오늘도 주님 안에서 눈을 떴습니다.",
        "오늘 하루도 주님과 함께하게 하소서.",
        "항상 기뻐하고 쉬지 말고 기도하며 범사에 감사하게 하소서.",
        "주님의 임재 안에서 오늘을 살아가게 하소서."
      ]
    },
    {
      type: 'evening',
      title: '저녁 기도',
      icon: '🌙',
      guide: [
        "주님, 오늘 하루도 지켜주셔서 감사합니다.",
        "오늘 주님께서 베풀어주신 은혜를 기억합니다.",
        "연약한 저를 붙들어 주셔서 감사합니다.",
        "내일도 주님 손 잡고 나아가게 하소서."
      ]
    },
    {
      type: 'peace',
      title: '평안 기도',
      icon: '☮️',
      guide: [
        "주님, 지금 마음이 무겁고 힘듭니다.",
        "수고하고 무거운 짐 진 자들을 쉬게 하신다 하셨습니다.",
        "지금 이 순간 주님께 모든 것을 맡깁니다.",
        "하나님의 평강이 내 마음을 지켜 주시길 원합니다."
      ]
    },
    {
      type: 'joy',
      title: '기쁨 회복 기도',
      icon: '😊',
      guide: [
        "주님, 기쁨이 사라진 것 같습니다.",
        "여호와를 기뻐하는 것이 나의 힘임을 믿습니다.",
        "구원의 기쁨을 내게 회복시켜 주소서.",
        "주님이 나와 함께하심을 다시 알게 하소서."
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
      hint: '예) 주님, 오늘 아침 햇살이 참 따뜻했습니다. 감사합니다.'
    },
    {
      key: 'see',
      icon: '👀',
      title: '주님이 나를 보고 계세요',
      ask: '주님이 지금 내 모습을 어떻게 보고 계실까요?',
      hint: '예) 주님은 지친 내 어깨를 보고 계십니다.'
    },
    {
      key: 'hear',
      icon: '👂',
      title: '주님이 내 말을 들으세요',
      ask: '주님께 지금 마음을 그대로 말씀드려 보세요',
      hint: '예) 주님, 요즘 마음이 외롭고 무겁습니다.'
    },
    {
      key: 'understand',
      icon: '🤝',
      title: '주님이 내 마음을 아세요',
      ask: '주님이 내 마음을 어떻게 헤아려 주실까요?',
      hint: '예) 주님은 내가 얼마나 애썼는지 다 아신다고 하십니다.'
    },
    {
      key: 'with',
      icon: '✝️',
      title: '주님이 함께 계세요',
      ask: '주님이 지금 나에게 뭐라고 하실 것 같나요?',
      hint: '예) "내가 너와 함께 있으니 두려워하지 말라" 하십니다.'
    }
  ],

  // 임마누엘 일기를 쓸 때 곁에 두는 말씀 — 하나님의 함께하심을 붙들어 준다
  immanuelVerses: [
    { text: '두려워하지 말라 내가 너와 함께 있느니라', ref: '이사야 41:10' },
    { text: '보라 내가 세상 끝날까지 너희와 항상 함께 있으리라', ref: '마태복음 28:20' },
    { text: '내가 너를 결코 버리지 아니하고 너를 떠나지 아니하리라', ref: '히브리서 13:5' },
    { text: '여호와는 마음이 상한 자를 가까이 하시고', ref: '시편 34:18' },
    { text: '내가 네 눈물을 보았노라', ref: '이사야 38:5' }
  ],

  // 7. 동반자 메시지 (멍한 상태 / 우울 / 고독 상황)
  companionMessages: [
    { trigger: 'idle', text: "😊 {name}님, 주님이 지금도 곁에 계세요.\n\"내가 너와 함께 함이라\" (사 41:10)", action: '말씀 보기' },
    { trigger: 'morning', text: "🌅 좋은 아침이에요, {name}님!\n오늘도 주님 안에서 시작해요 🙏", action: '아침 기도' },
    { trigger: 'evening', text: "🌙 {name}님, 오늘 하루도 수고하셨어요.\n감사한 일 하나 떠올려볼까요? 💛", action: '감사 쓰기' },
    { trigger: 'lonely', text: "✨ {name}님, 외로우신가요?\n주님은 항상 함께하십니다.\n찬양 한 곡 들어볼까요?", action: '찬양 듣기' },
    { trigger: 'depression', text: "💚 {name}님, 마음이 무거우실 수 있어요.\n괜찮아요. 주님께 말씀드려봐요.", action: '기도하기' },
    { trigger: 'noon', text: "☀️ {name}님, 점심시간이에요!\n\"여호와를 기뻐하는 것이 너희의 힘이니라\" (느 8:10)", action: '찬양 듣기' },
    { trigger: 'praise', text: "🎵 {name}님, 찬양 한 곡 들어볼까요?\n마음이 밝아질 거예요!", action: '찬양 듣기' }
  ],

  // 8. 연령대별 프로필
  ageGroups: [
    { key: 'youth', label: '청소년', labelEn: 'Youth', range: '10–19세', icon: '🌱' },
    { key: 'young', label: '청년', labelEn: 'Young Adult', range: '20–40대', icon: '☀️' },
    { key: 'middle', label: '중년', labelEn: 'Middle Age', range: '50–60대', icon: '🍂' },
    { key: 'senior', label: '어르신', labelEn: 'Senior', range: '70대+', icon: '🌻' }
  ],

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
      obAgeLabel: '연령대',
      obAgeYouth: '청소년', obAgeYouthRange: '10–19세',
      obAgeYoung: '청년', obAgeYoungRange: '20–40대',
      obAgeMiddle: '중년', obAgeMiddleRange: '50–60대',
      obAgeSenior: '어르신', obAgeSeniorRange: '70대 이상',
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
      langToggle: 'English',
      closeBtn: '닫기', saveBtn: '저장하기', deleteBtn: '삭제',
      headerSuffix: '님, 주님 안에서 🌿',
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
      obAgeLabel: 'Age Group',
      obAgeYouth: 'Youth', obAgeYouthRange: 'Ages 10–19',
      obAgeYoung: 'Young Adult', obAgeYoungRange: 'Ages 20–49',
      obAgeMiddle: 'Middle Age', obAgeMiddleRange: 'Ages 50–69',
      obAgeSenior: 'Senior', obAgeSeniorRange: 'Ages 70+',
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
      langToggle: '한국어',
      closeBtn: 'Close', saveBtn: 'Save', deleteBtn: 'Delete',
      headerSuffix: ', in the Lord 🌿',
    }
  }
};
