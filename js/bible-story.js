// ===== 성경 역사 흐름 데이터 =====
// 통큰영어통독 방식: 창조 → 족장 → 출애굽 → 왕정 → 포로 → 귀환 → 신약 → 초대교회
// 각 시대별: 역사 배경 · 핵심 구절 · 오늘날과의 연결 · TTS 낭독 텍스트

const BIBLE_STORY = {

  eras: [
    // ─────────────────────────────────────────────
    // 1. 태초 & 창조 (창세기 1–11)
    // ─────────────────────────────────────────────
    {
      id: 'creation',
      period: '기원전 ~4000',
      era: '태초 · 창조',
      eraEn: 'Creation & Fall',
      icon: '🌍',
      color: '#2D5040',
      books: '창세기 1–11장',
      booksEn: 'Genesis 1–11',
      tagline: '하나님이 세상을 만드시고 인간을 사랑하셨습니다',
      taglineEn: 'God created the world and loved humanity',

      story: `하나님은 말씀으로 온 우주를 창조하셨습니다. 빛과 어둠, 하늘과 바다, 땅과 식물, 해와 달과 별, 새와 물고기, 동물들, 그리고 마지막에 하나님의 형상(이마고 데이)대로 사람을 만드셨습니다.

아담과 하와는 에덴동산에서 하나님과 완전한 관계 속에 살았습니다. 그러나 뱀의 유혹에 넘어가 선악과를 먹었고, 죄가 세상에 들어왔습니다. 부끄러움, 두려움, 서로에 대한 책임 전가 — 죄의 결과는 관계의 단절이었습니다.

노아 시대에는 인간의 죄악이 가득했지만, 하나님은 의인 노아를 통해 새로운 시작을 허락하셨습니다. 바벨탑 사건에서 인간은 또다시 하나님처럼 되려 했지만, 하나님은 언어를 흩으셨습니다.

이 모든 이야기의 핵심은 하나입니다: **하나님은 인간을 사랑하시며, 관계를 회복하기를 원하십니다.**`,

      storyEn: `God created the entire universe by His word. Light and darkness, sky and sea, land and plants, sun, moon, and stars, birds and fish, animals — and finally, humanity, made in His own image (Imago Dei).

Adam and Eve lived in the Garden of Eden in perfect relationship with God. But tempted by the serpent, they ate the forbidden fruit, and sin entered the world. Shame, fear, blame-shifting — the consequence of sin was broken relationship.

In Noah's time, human wickedness was great, yet God preserved a righteous remnant. At Babel, humanity again tried to reach God's level — but God confused their languages and scattered them.

The heart of every story is the same: **God loves humanity and desires to restore relationship.**`,

      keyVerses: [
        { ref: '창세기 1:1', text: '태초에 하나님이 천지를 창조하시니라', textEn: 'In the beginning God created the heavens and the earth.' },
        { ref: '창세기 1:27', text: '하나님이 자기 형상 곧 하나님의 형상대로 사람을 창조하시되', textEn: 'So God created mankind in his own image, in the image of God he created them.' },
        { ref: '창세기 3:15', text: '내가 너로 여자와 원수가 되게 하고 네 후손도 여자의 후손과 원수가 되게 하리니 여자의 후손은 네 머리를 상하게 할 것이요', textEn: 'I will put enmity between you and the woman, and between your offspring and hers; he will crush your head.' },
      ],

      modern: [
        { emoji: '🪞', title: '나는 하나님의 형상', body: '치매가 오거나 몸이 약해져도, 나는 여전히 하나님의 형상대로 지음받은 존재입니다. 내 가치는 능력이 아니라 하나님께서 나를 만드셨다는 사실에서 옵니다.' },
        { emoji: '💔', title: '죄는 관계를 끊는다', body: '오늘날도 우리는 두려움과 수치심으로 하나님께, 또 서로에게서 멀어집니다. Life Model Works가 말하는 "기쁨 결핍"은 창세기 3장의 단절에서 시작됩니다.' },
        { emoji: '🌈', title: '회복은 하나님으로부터', body: '노아의 무지개처럼, 하나님은 언제나 새로운 시작을 약속하십니다. 우리가 아무리 실패해도 그분의 사랑은 끊어지지 않습니다.' },
      ],
    },

    // ─────────────────────────────────────────────
    // 2. 족장 시대 (창세기 12–50)
    // ─────────────────────────────────────────────
    {
      id: 'patriarchs',
      period: '기원전 2100–1700',
      era: '족장 시대',
      eraEn: 'Age of the Patriarchs',
      icon: '⭐',
      color: '#4A3700',
      books: '창세기 12–50장',
      booksEn: 'Genesis 12–50',
      tagline: '믿음으로 떠난 한 사람의 이야기가 민족이 됩니다',
      taglineEn: 'One man\'s faith journey becomes a nation',

      story: `하나님은 갈대아 우르에 살던 평범한 사람 아브람을 부르셨습니다. "네 고향과 친척과 아버지의 집을 떠나 내가 네게 보여줄 땅으로 가라." 이유도, 지도도 없었습니다. 오직 하나님의 약속만 있었습니다.

아브라함은 갔습니다. 75세의 나이에. 아내 사라는 나이가 많아 아이를 낳을 수 없었지만, 하나님은 이삭을 주셨습니다. 그 이삭을 바치라 하실 때도 아브라함은 순종했고, 하나님은 "여호와 이레" — 준비하시는 하나님을 드러내셨습니다.

이삭의 아들 야곱은 형을 속이고 아버지를 속인 사람이었습니다. 그러나 하나님은 야곱과 씨름하시며 이름을 이스라엘로 바꾸셨습니다. "하나님과 겨루어 이겼다." 하나님은 완벽한 사람을 쓰시지 않습니다.

야곱의 아들 요셉은 형들에게 팔려 이집트 노예가 되었습니다. 억울한 고난의 연속이었지만, "당신들이 나를 이리로 판 것을 슬퍼하지 마소서 — 하나님이 생명을 구원하시려고 나를 당신들보다 먼저 보내셨나이다." 고난 속에도 하나님의 섭리가 있었습니다.`,

      storyEn: `God called an ordinary man named Abram in Ur of the Chaldeans: "Leave your country, your people, your father's household and go to the land I will show you." No map, no reason — only God's promise.

Abraham went. At 75 years old. Sarah was barren, yet God gave them Isaac. When commanded to sacrifice Isaac, Abraham obeyed — and God revealed Himself as Jehovah-Jireh, "The Lord Will Provide."

Jacob was a deceiver who tricked his father and cheated his brother. Yet God wrestled with Jacob and renamed him Israel: "You have struggled with God and overcome." God does not require perfection.

Joseph was sold into slavery by his own brothers. Years of unjust suffering followed — yet Joseph declared: "You intended to harm me, but God intended it for good." Even in suffering, God's providence was at work.`,

      keyVerses: [
        { ref: '창세기 12:1', text: '여호와께서 아브람에게 이르시되 너는 너의 고향과 친척과 아버지의 집을 떠나 내가 네게 보여줄 땅으로 가라', textEn: 'The Lord had said to Abram, "Go from your country, your people and your father\'s household to the land I will show you."' },
        { ref: '창세기 22:14', text: '아브라함이 그 땅 이름을 여호와 이레라 하였으므로', textEn: 'So Abraham called that place The Lord Will Provide.' },
        { ref: '창세기 50:20', text: '당신들은 나를 해하려 하였으나 하나님은 그것을 선으로 바꾸사 오늘과 같이 많은 백성의 생명을 구원하게 하시려 하셨나니', textEn: 'You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.' },
      ],

      modern: [
        { emoji: '🚶', title: '부르심에 응답하는 믿음', body: '아브라함처럼 우리도 예상치 못한 부르심을 받습니다. 노년에 새로운 여정을 시작하는 것, 익숙한 것을 떠나는 것 — 그것이 믿음의 삶입니다.' },
        { emoji: '🤕', title: '상처받은 사람도 쓰신다', body: '야곱처럼 상처를 주고받은 관계, 요셉처럼 억울한 고난 — 하나님은 그런 깨진 이야기 속에서도 일하십니다. 내 과거의 실수가 하나님의 손에서 선으로 바뀔 수 있습니다.' },
        { emoji: '🕊️', title: '섭리: 고난 너머의 의미', body: '요셉의 이야기는 정신적 고통을 겪는 분들에게 큰 위로입니다. "왜 이런 일이 나에게?" — 하나님은 그 고난의 의미를 나중에 보여주십니다.' },
      ],
    },

    // ─────────────────────────────────────────────
    // 3. 출애굽 & 광야 (출애굽기–민수기)
    // ─────────────────────────────────────────────
    {
      id: 'exodus',
      period: '기원전 1446',
      era: '출애굽 · 광야',
      eraEn: 'Exodus & Wilderness',
      icon: '🔥',
      color: '#7A3900',
      books: '출애굽기 · 레위기 · 민수기',
      booksEn: 'Exodus · Leviticus · Numbers',
      tagline: '하나님이 친히 노예를 구원하시고 함께 걸으셨습니다',
      taglineEn: 'God personally rescued slaves and walked with them',

      story: `이스라엘 백성은 400년간 이집트에서 노예 생활을 했습니다. 그들의 고통 소리를 하나님이 들으셨습니다. "나는 내 백성의 고통을 분명히 보았고, 그들의 부르짖음을 들었다."

하나님은 도망자 모세를 불타는 떨기나무에서 부르셨습니다. "나는 스스로 있는 자이니라 (I AM WHO I AM)." 이름 없던 하나님이 스스로를 드러내신 순간이었습니다.

열 가지 재앙 끝에 유월절 어린 양의 피로 이스라엘은 구원받았습니다 — 이것은 예수 그리스도의 십자가를 예표합니다. 홍해가 갈라지는 기적, 낮에는 구름 기둥, 밤에는 불 기둥으로 인도하신 하나님.

그러나 광야에서 이스라엘은 끊임없이 원망했습니다. 목이 마르면 원망, 고기가 없으면 원망, 길이 멀면 원망. 그럼에도 하나님은 만나와 메추라기와 반석의 물로 공급하셨습니다. 40년 광야 여정은 하나님과 이스라엘의 관계 훈련 학교였습니다.

시나이 산에서 하나님은 십계명을 주셨습니다. 이것은 제약이 아니라 사랑의 울타리였습니다 — 함께 살아가는 방법이었습니다.`,

      storyEn: `The Israelites were slaves in Egypt for 400 years. God heard their cries of suffering. "I have indeed seen the misery of my people... I have heard them crying out."

God called the fugitive Moses from a burning bush: "I AM WHO I AM." The nameless God revealed Himself by name for the first time.

After ten plagues, Israel was saved by the blood of the Passover lamb — a foreshadowing of Jesus Christ's cross. The Red Sea parted. A pillar of cloud by day, fire by night — God walked with His people.

Yet in the wilderness, Israel complained constantly. No water — complain. No meat — complain. Too far — complain. Still, God provided manna, quail, and water from the rock. The 40-year wilderness journey was a school of relationship between God and Israel.

At Mount Sinai, God gave the Ten Commandments — not as restriction, but as a loving boundary, a way of living together.`,

      keyVerses: [
        { ref: '출애굽기 3:14', text: '하나님이 모세에게 이르시되 나는 스스로 있는 자이니라', textEn: 'God said to Moses, "I AM WHO I AM."' },
        { ref: '출애굽기 14:14', text: '여호와께서 너희를 위하여 싸우시리니 너희는 가만히 있을지니라', textEn: 'The Lord will fight for you; you need only to be still.' },
        { ref: '신명기 31:6', text: '강하고 담대하라 두려워하지 말라 그들 앞에서 떨지 말라 네 하나님 여호와 그가 너와 함께 가시며', textEn: 'Be strong and courageous. Do not be afraid or terrified... for the Lord your God goes with you.' },
      ],

      modern: [
        { emoji: '⛓️', title: '오늘의 속박에서 자유로', body: '이집트의 노예처럼, 우리도 두려움·우울·중독·죄의 습관에 묶여 있을 수 있습니다. 하나님은 그 속박에서 건져내시는 분입니다.' },
        { emoji: '🏕️', title: '광야는 훈련의 시간', body: '치매가 오거나 노년의 어려움이 있을 때 — 그것이 광야처럼 느껴져도, 하나님은 만나로 매일 공급하십니다. 40년 광야에서도 이스라엘의 신발이 닳지 않았습니다.' },
        { emoji: '🔥', title: '지금 이 순간 하나님이 함께', body: '불 기둥과 구름 기둥은 하나님의 임재의 상징입니다. Life Model Works의 핵심인 "임마누엘 실천" — 지금 여기서 하나님의 존재를 인식하는 것이 출애굽의 영성입니다.' },
      ],
    },

    // ─────────────────────────────────────────────
    // 4. 정착 & 왕정 (여호수아–열왕기)
    // ─────────────────────────────────────────────
    {
      id: 'kingdom',
      period: '기원전 1400–586',
      era: '가나안 정착 · 왕국',
      eraEn: 'Conquest & Kingdom',
      icon: '👑',
      color: '#1A3566',
      books: '여호수아 · 사사기 · 사무엘 · 열왕기',
      booksEn: 'Joshua · Judges · Samuel · Kings',
      tagline: '약속의 땅을 얻었지만 사람의 마음은 하나님을 떠났습니다',
      taglineEn: 'They gained the promised land but lost their hearts to God',

      story: `여호수아의 인도 아래 이스라엘은 요단강을 건너 가나안을 정복했습니다. 여리고 성벽은 나팔 소리와 함성에 무너졌습니다 — 무기가 아니라 순종이 승리를 가져왔습니다.

그러나 사사기 시대는 "이스라엘에 왕이 없으므로 사람마다 자기 소견에 옳은 대로 행하였더라"는 반복 패턴을 보입니다. 죄 → 징계 → 부르짖음 → 구원 → 다시 죄. 인간의 본성을 그대로 보여줍니다.

다윗 왕은 "하나님의 마음에 합한 사람"이었습니다. 목동에서 왕까지, 그는 찬양으로 하나님을 예배했고 — 시편 대부분이 그의 노래입니다. 그러나 다윗도 밧세바와의 간음과 우리아의 살해라는 큰 죄를 범했습니다. 그럼에도 그는 하나님 앞에 무너지며 회개했습니다. 시편 51편이 그 고백입니다.

솔로몬은 지혜와 성전으로 이스라엘의 황금기를 열었습니다. 그러나 말년에 이방 여인들을 따라 우상을 섬겼고, 왕국은 분열되었습니다.

북 이스라엘과 남 유다는 대부분 악한 왕들의 통치 아래 하나님을 떠났고, 선지자들은 끊임없이 경고했지만 백성은 듣지 않았습니다.`,

      storyEn: `Under Joshua, Israel crossed the Jordan and conquered Canaan. The walls of Jericho fell — not by weapons, but by obedience to God's strange command.

The book of Judges shows a recurring cycle: sin → punishment → crying out → deliverance → sin again. It is an honest portrait of human nature.

David was "a man after God's own heart." From shepherd to king, he worshipped with all his heart — most of the Psalms are his songs. Yet David committed adultery with Bathsheba and had Uriah killed. Still, he fell broken before God in repentance — that is Psalm 51.

Solomon opened Israel's golden age with wisdom and the Temple. But in his old age, he followed foreign wives into idolatry, and the kingdom split.

The divided monarchy mostly turned away from God. The prophets warned repeatedly, but the people refused to listen.`,

      keyVerses: [
        { ref: '여호수아 1:9', text: '강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라', textEn: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.' },
        { ref: '시편 23:4', text: '내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라', textEn: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me.' },
        { ref: '시편 51:10', text: '하나님이여 내 속에 정한 마음을 창조하시고 내 안에 정직한 영을 새롭게 하소서', textEn: 'Create in me a pure heart, O God, and renew a steadfast spirit within me.' },
      ],

      modern: [
        { emoji: '🎵', title: '다윗의 찬양 — 우리의 찬양', body: '다윗은 기쁠 때도, 슬플 때도, 죄를 지었을 때도 하나님께 노래했습니다. 찬양은 감정의 표현이자 하나님과의 연결입니다. 우울할 때 찬양하는 것이 다윗의 방법이었습니다.' },
        { emoji: '🔄', title: '반복되는 패턴을 깨는 법', body: '사사기의 죄→징계→회개 사이클은 우리 삶에도 있습니다. 패턴을 인식하고 하나님께 돌아오는 것 — 그것이 회복의 시작입니다.' },
        { emoji: '🏚️', title: '깨진 사람도 쓰신다', body: '다윗의 이야기는 완벽해야 하나님이 쓰신다는 생각을 무너뜨립니다. 상처받고 실수하고 깨진 우리를 하나님은 여전히 "마음에 합한 사람"으로 보실 수 있습니다.' },
      ],
    },

    // ─────────────────────────────────────────────
    // 5. 포로 & 선지자 (이사야–다니엘)
    // ─────────────────────────────────────────────
    {
      id: 'exile',
      period: '기원전 722–539',
      era: '포로기 · 선지자',
      eraEn: 'Exile & Prophets',
      icon: '🕊️',
      color: '#4A2560',
      books: '이사야 · 예레미야 · 에스겔 · 다니엘',
      booksEn: 'Isaiah · Jeremiah · Ezekiel · Daniel',
      tagline: '가장 어두운 시대에 가장 밝은 약속이 왔습니다',
      taglineEn: 'In the darkest age came the brightest promise',

      story: `북 이스라엘은 기원전 722년 앗수르에게, 남 유다는 기원전 586년 바벨론에게 멸망했습니다. 성전은 불탔고 예루살렘은 폐허가 되었습니다. 이스라엘 백성은 낯선 땅 바벨론으로 끌려갔습니다.

예레미야애가는 그 비통함을 담고 있습니다: "예루살렘이 크게 범죄하였으므로 더러운 자가 되었고." 그러나 바로 그 책 한가운데 이런 말씀이 있습니다: "여호와의 인자와 자비는 무궁하여 아침마다 새로우니 주의 성실하심이 크도소이다."

이사야는 메시아를 예언했습니다 — "고난받는 종" 이야기 (사 53장)는 수백 년 뒤 예수님이 오시기 전에 이미 십자가를 그림으로 보여주었습니다.

다니엘은 바벨론 궁정에서 세상과 타협하지 않았습니다. 사자굴에서도, 세 친구가 풀무불에서도 하나님은 건져내셨습니다. "우리 하나님이 건져내실 것입니다. 그렇지 않더라도 우리는 절하지 않겠습니다."

에스겔의 마른 뼈 환상 — "이 뼈들이 살 수 있겠느냐?" 하나님의 영이 임하자 뼈들이 살아났습니다. 죽은 것 같은 희망에도 하나님의 생기가 임합니다.`,

      storyEn: `The Northern Kingdom fell to Assyria in 722 BC; Judah fell to Babylon in 586 BC. The Temple burned. Jerusalem lay in ruins. The people were carried away to a foreign land.

Lamentations captures the grief: "Jerusalem has sinned greatly." Yet in the middle of that book: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning."

Isaiah prophesied the Messiah — the "Suffering Servant" passage (Isaiah 53) painted a picture of the cross hundreds of years before Jesus came.

Daniel refused to compromise in Babylon's royal court. God delivered him from the lion's den and preserved his three friends in the furnace. "Our God is able to deliver us — but even if He does not, we will not bow."

Ezekiel's vision of dry bones — "Can these bones live?" When God's breath came upon them, they lived. Even what seems dead can receive the breath of God.`,

      keyVerses: [
        { ref: '예레미야애가 3:22-23', text: '여호와의 인자와 자비는 무궁하여 아침마다 새로우니 주의 성실하심이 크도소이다', textEn: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning.' },
        { ref: '이사야 40:31', text: '오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요', textEn: 'Those who hope in the Lord will renew their strength. They will soar on wings like eagles.' },
        { ref: '이사야 53:5', text: '그가 찔림은 우리의 허물 때문이요 그가 상함은 우리의 죄악 때문이라 그가 징계를 받으므로 우리는 평화를 누리고', textEn: 'He was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him.' },
      ],

      modern: [
        { emoji: '🌅', title: '아침마다 새로운 자비', body: '치매나 우울증으로 힘든 날도, 어제의 두려움과 혼란이 가득해도 — 오늘 아침은 새로운 자비로 시작됩니다. 예레미야애가 3:22-23은 절망 속에서 쓴 소망의 말씀입니다.' },
        { emoji: '💀', title: '마른 뼈에도 생기가', body: '에스겔의 마른 뼈처럼, 우리 안에 죽은 것 같은 기쁨, 메마른 신앙, 사라진 활력 — 하나님의 영이 임하시면 다시 살아납니다.' },
        { emoji: '🦁', title: '"그래도 우리는 절하지 않는다"', body: '세상이 우리에게 타협을 요구할 때, 다니엘의 친구들의 말이 우리의 고백이 됩니다. 결과와 상관없이 하나님을 신뢰하는 것이 믿음입니다.' },
      ],
    },

    // ─────────────────────────────────────────────
    // 6. 귀환 & 침묵 (에스라–말라기)
    // ─────────────────────────────────────────────
    {
      id: 'return',
      period: '기원전 539–400',
      era: '귀환 · 침묵의 400년',
      eraEn: 'Return & 400 Years of Silence',
      icon: '🌱',
      color: '#2E5C3E',
      books: '에스라 · 느헤미야 · 에스더 · 말라기',
      booksEn: 'Ezra · Nehemiah · Esther · Malachi',
      tagline: '폐허에서 다시 시작하는 회복의 이야기',
      taglineEn: 'Rebuilding from ruins — a story of restoration',

      story: `페르시아 왕 고레스의 칙령으로 이스라엘 백성은 고향으로 돌아갈 수 있었습니다. 70년 포로 생활 끝에 드디어 귀환 — 그러나 예루살렘은 폐허였습니다.

에스라는 말씀으로 공동체를 재건했습니다. 느헤미야는 52일 만에 성벽을 재건했습니다 — 한 손에 칼, 한 손에 연장을 들고. 반대와 위협 속에서도 "우리 하나님이 우리를 위해 싸우시리라"는 믿음으로.

에스더는 "이 때를 위함이 아닌지 알 수 없다"는 말로 민족을 살렸습니다. 평범한 여인이 하나님의 섭리의 도구가 되었습니다.

말라기를 마지막으로 구약은 끝나고 "침묵의 400년"이 시작됩니다. 선지자의 목소리가 없는 시간. 그러나 이 침묵은 메시아를 기다리는 시간이었습니다. 말라기는 약속했습니다: "보라 내가 내 사자를 보내리니 그가 내 앞에서 길을 준비하리라."

세례 요한이 오기까지 400년을 기다렸습니다.`,

      storyEn: `By the decree of Cyrus the Great of Persia, the Israelites were allowed to return home. After 70 years of exile — but Jerusalem was in ruins.

Ezra rebuilt the community through God's Word. Nehemiah rebuilt the walls in 52 days — sword in one hand, tool in the other. Amid opposition and threats, they pressed on: "Our God will fight for us."

Esther saved her people with the words: "Who knows whether you have not come to the kingdom for such a time as this?" An ordinary woman became an instrument of God's providence.

After Malachi, the Old Testament closes and "400 years of silence" begin. No prophetic voice. Yet this silence was a time of waiting for the Messiah. Malachi promised: "I will send my messenger, who will prepare the way before me."

They waited 400 years for John the Baptist to arrive.`,

      keyVerses: [
        { ref: '느헤미야 8:10', text: '여호와로 인하여 기뻐하는 것이 너희의 힘이니라', textEn: 'The joy of the Lord is your strength.' },
        { ref: '에스더 4:14', text: '네가 왕후의 자리를 얻은 것이 이 때를 위함이 아닌지 알 수 없다', textEn: 'Who knows whether you have not come to the kingdom for such a time as this?' },
        { ref: '말라기 3:1', text: '보라 내가 내 사자를 보내리니 그가 내 앞에서 길을 준비하리라', textEn: 'I will send my messenger, who will prepare the way before me.' },
      ],

      modern: [
        { emoji: '🧱', title: '폐허에서 다시 짓는 삶', body: '느헤미야처럼, 우리 삶의 어떤 부분이 무너졌어도 다시 세울 수 있습니다. 한 손에 하나님의 말씀, 한 손에 오늘의 일상 — 그것이 재건의 방법입니다.' },
        { emoji: '⏳', title: '침묵의 시간도 하나님의 섭리', body: '400년의 침묵처럼, 기도 응답이 없는 것 같은 시간도 있습니다. 그 침묵 속에서도 하나님은 메시아를 준비하고 계셨습니다. 우리의 기다림도 헛되지 않습니다.' },
        { emoji: '💪', title: '"여호와로 인한 기쁨"이 힘', body: '느헤미야 8:10은 항상기쁨 앱의 정신입니다. 기쁨은 상황에서 오지 않습니다. 여호와 하나님으로부터 옵니다. 그 기쁨이 우리의 힘입니다.' },
      ],
    },

    // ─────────────────────────────────────────────
    // 7. 예수님의 생애 (복음서)
    // ─────────────────────────────────────────────
    {
      id: 'jesus',
      period: '기원전 4 – 기원후 30년',
      era: '예수님의 생애',
      eraEn: 'Life of Jesus',
      icon: '✝️',
      color: '#8B1A1A',
      books: '마태복음 · 마가복음 · 누가복음 · 요한복음',
      booksEn: 'Matthew · Mark · Luke · John',
      tagline: '하나님이 사람이 되어 우리 가운데 오셨습니다',
      taglineEn: 'God became flesh and dwelt among us',

      story: `400년의 침묵 끝에 천사들이 베들레헴 들판에서 노래했습니다: "지극히 높은 곳에서는 하나님께 영광이요 땅에서는 하나님이 기뻐하신 사람들 중에 평화로다."

예수님은 목수의 아들로 태어나 갈릴리에서 자라셨습니다. 30세에 세례 요한에게 세례를 받으시고 공생애를 시작하셨습니다. 그분은 병자를 고치시고, 가난한 자에게 복음을 전하시고, 죄인들과 함께 식사하시고, 죽은 자를 살리셨습니다.

예수님은 "나는 길이요 진리요 생명이니라"고 하셨습니다. "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라."

마지막 유월절 저녁, 예수님은 제자들의 발을 씻기셨습니다 — 섬김의 본을 보이시며. 그리고 십자가에서 우리의 죄를 지고 죽으셨습니다. "다 이루었다."

3일 후 부활하셨습니다. 죽음을 이기신 것입니다. 이것이 복음의 핵심입니다 — 우리도 죄와 죽음에서 해방될 수 있다는 것.

부활 후 40일간 제자들과 함께 계시다가 승천하시며 약속하셨습니다: "내가 세상 끝날까지 너희와 항상 함께 있으리라."`,

      storyEn: `After 400 years of silence, angels sang over Bethlehem's fields: "Glory to God in the highest heaven, and on earth peace to those on whom his favor rests."

Jesus was born in a manger, raised as a carpenter's son in Galilee. At 30 He began His public ministry — healing the sick, preaching good news to the poor, dining with sinners, raising the dead.

Jesus said: "I am the way and the truth and the life." "Come to me, all you who are weary and burdened, and I will give you rest."

On the last Passover evening, He washed His disciples' feet — modeling servanthood. Then He died on the cross bearing our sins. "It is finished."

Three days later He rose from the dead — conquering death itself. This is the core of the gospel: we too can be set free from sin and death.

After 40 days with His disciples, He ascended and promised: "Surely I am with you always, to the very end of the age."`,

      keyVerses: [
        { ref: '요한복음 3:16', text: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라', textEn: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
        { ref: '요한복음 14:6', text: '예수께서 이르시되 내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께로 올 자가 없느니라', textEn: 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."' },
        { ref: '마태복음 28:20', text: '내가 세상 끝날까지 너희와 항상 함께 있으리라', textEn: 'And surely I am with you always, to the very end of the age.' },
      ],

      modern: [
        { emoji: '🍞', title: '예수님은 지금도 쉬게 하신다', body: '"수고하고 무거운 짐 진 자들아 내게로 오라" — 치매, 우울, 외로움, 몸의 고통을 짊어진 모든 분들에게 하시는 말씀입니다. 예수님은 우리의 짐을 아십니다.' },
        { emoji: '🫂', title: '발을 씻기신 예수님', body: '예수님은 아프고 약한 사람 곁에 앉으셨습니다. 죄인과 식사하셨습니다. 사회가 외면한 사람들을 찾아가셨습니다. 이것이 우리가 서로를 돌봐야 할 이유입니다.' },
        { emoji: '🌅', title: '"항상 함께 있으리라"', body: '기억이 흐려져도, 혼자인 것 같아도, 예수님은 "항상 함께"라고 약속하셨습니다. 이것이 항상기쁨의 가장 깊은 근거입니다.' },
      ],
    },

    // ─────────────────────────────────────────────
    // 8. 초대교회 & 서신 (사도행전–요한계시록)
    // ─────────────────────────────────────────────
    {
      id: 'church',
      period: '기원후 30–100년',
      era: '초대교회 · 서신',
      eraEn: 'Early Church & Letters',
      icon: '🕊️',
      color: '#1A4060',
      books: '사도행전 · 바울서신 · 요한계시록',
      booksEn: 'Acts · Epistles · Revelation',
      tagline: '성령이 임하여 교회가 세상으로 퍼져나갔습니다',
      taglineEn: 'The Spirit came and the church spread throughout the world',

      story: `오순절, 제자들이 한 곳에 모여 기도할 때 성령이 바람처럼, 불처럼 임하셨습니다. 베드로는 거리에서 설교했고, 하루에 3천 명이 세례를 받았습니다.

초대교회는 함께 먹고, 함께 기도하고, 가진 것을 나누며 살았습니다. "믿는 사람이 다 함께 있어 모든 물건을 서로 통용하고." 이것이 공동체의 원형입니다.

바울은 교회를 핍박하던 사람이었습니다. 다메섹 도상에서 부활하신 예수님을 만난 후 완전히 변했습니다. 그는 로마 제국 전역을 다니며 복음을 전했고, 감옥에서도 찬양하고 기도했습니다.

빌립보서는 감옥에서 쓴 편지입니다. 그럼에도 그는 말합니다: "주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라." 항상기뻐하라의 원본이 여기 있습니다.

요한계시록은 박해받는 교회에게 주어진 환상입니다: 어린 양이 이기셨고, 하나님이 모든 것을 새롭게 하실 것이며, "다시는 사망이 없고 애통하는 것이나 곡하는 것이나 아픈 것이 다시 있지 아니하리니" — 이것이 우리의 최종 소망입니다.`,

      storyEn: `On Pentecost, while the disciples prayed together, the Holy Spirit came like wind and fire. Peter preached in the streets, and three thousand were baptized in one day.

The early church ate together, prayed together, and shared everything they owned. "All the believers were together and had everything in common." This is the original community.

Paul had been a persecutor of the church. After meeting the risen Jesus on the Damascus road, he was completely transformed. He traveled the Roman Empire preaching the gospel, worshipping and praying even in prison.

Philippians was written from prison. Yet Paul writes: "Rejoice in the Lord always. I will say it again: Rejoice!" This is the original source of "Always Joy."

Revelation was given to a persecuted church: the Lamb has conquered, God will make all things new — "There will be no more death or mourning or crying or pain" — this is our ultimate hope.`,

      keyVerses: [
        { ref: '빌립보서 4:4', text: '주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라', textEn: 'Rejoice in the Lord always. I will say it again: Rejoice!' },
        { ref: '사도행전 2:42', text: '그들이 사도의 가르침을 받아 서로 교제하고 떡을 떼며 오로지 기도하기를 힘쓰니라', textEn: 'They devoted themselves to the apostles\' teaching and to fellowship, to the breaking of bread and to prayer.' },
        { ref: '요한계시록 21:4', text: '모든 눈물을 그 눈에서 닦아 주시니 다시는 사망이 없고 애통하는 것이나 곡하는 것이나 아픈 것이 다시 있지 아니하리니', textEn: 'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain.' },
      ],

      modern: [
        { emoji: '🔥', title: '성령은 지금도 임하신다', body: '오순절의 성령은 2천 년 전 사건이 아닙니다. 지금도 우리 안에 거하시며 위로하시고, 기억나지 않는 말씀을 떠올리게 하시고, 기쁨을 주십니다.' },
        { emoji: '👥', title: '교회는 서로 돌보는 공동체', body: '초대교회처럼 함께 먹고, 함께 기도하고, 서로의 짐을 지는 것 — 치매나 정신적 어려움을 겪는 분들에게 가장 필요한 것이 이 공동체입니다.' },
        { emoji: '🌟', title: '눈물을 닦아주실 날을 향해', body: '요한계시록 21장은 우리의 최종 소망입니다. 지금의 고통이 아무리 커도, 하나님이 친히 모든 눈물을 닦아주시는 날이 옵니다. 이 소망이 오늘을 살게 합니다.' },
      ],
    },
  ],
};
