-- ═══════════════════════════════════════════════════════════
--  항상기쁨 — Supabase 스키마
--
--  Supabase 대시보드 → SQL Editor 에 그대로 붙여 Run 하면 된다.
--  여러 번 실행해도 안전하다 (if not exists / drop policy if exists).
--
--  설계 원칙
--  · 모든 표에 user_id 를 두고 RLS 로 "내 것만" 잠근다.
--    감사일기·기도는 남이 보면 안 되는 글이라 이게 가장 중요하다.
--  · 폰과 태블릿에서 같이 써도 어긋나지 않게, 하루에 하나뿐인 것
--    (감사일기)과 여러 개인 것(기도)을 유니크 제약으로 구분한다.
--  · updated_at 을 두어 어느 쪽이 최신인지 판단한다 (오프라인 병합용).
-- ═══════════════════════════════════════════════════════════

-- ─── 1. 프로필 ────────────────────────────────────────────
-- 카카오에서 받은 이름을 담아 "김순자 님, 평안하세요" 인사에 쓴다
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text,
  age_group   text,                      -- 'senior' | 'adult' | 'youth'
  lang        text default 'ko',
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── 2. 감사일기 ──────────────────────────────────────────
-- 하루에 한 줄. items 는 감사한 일 1~3개의 배열.
-- (date, user_id) 를 유니크로 잡아 두 기기에서 같은 날을 쓰면
-- 새 줄이 생기지 않고 덮어써진다 — 지금 앱의 동작과 같다.
create table if not exists public.gratitude (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,             -- 'YYYY-MM-DD' (앱의 todayKey)
  items       text[] not null default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_id, date)
);
create index if not exists gratitude_user_date_idx
  on public.gratitude (user_id, date desc);

-- ─── 2-2. 임마누엘 일기 ───────────────────────────────────
-- '하나님이 우리와 함께 계시다'. 다섯 단계(감사 → 보심 → 들으심 →
-- 아심 → 함께하심)의 답을 jsonb 한 칸에 담는다. 단계가 늘거나 이름이
-- 바뀌어도 표를 고칠 필요가 없어서 열을 다섯 개로 쪼개지 않았다.
--
-- 사진은 여기 담지 않는다. 하루 다섯 장이면 1MB, 매일 쓰면 1년에 350MB로
-- 무료 용량(1GB)을 금방 넘긴다. 사진은 폰의 IndexedDB 에 남기고 여기에는
-- 몇 장이었는지만 적어 둔다 — 나중에 "그날 사진 3장" 표시에 쓸 수 있다.
create table if not exists public.immanuel (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  date        date not null,             -- 하루 하나 (앱의 todayKey)
  answers     jsonb not null default '{}'::jsonb,
  photo_count smallint not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_id, date)
);
create index if not exists immanuel_user_date_idx
  on public.immanuel (user_id, date desc);

-- ─── 3. 기도 ──────────────────────────────────────────────
-- 하루에 여러 번 쓸 수 있으므로 유니크를 걸지 않는다.
-- client_id 는 기기에서 만든 식별자 — 같은 기도가 두 번 올라가는 걸 막는다.
create table if not exists public.prayers (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  client_id   text,
  type        text default 'free',       -- 'thanks' | 'family' | 'health' | 'free' ...
  text        text not null,
  prayed_at   timestamptz not null default now(),
  answered    boolean default false,     -- 나중에 "응답받은 기도" 를 표시하려고
  created_at  timestamptz default now(),
  unique (user_id, client_id)
);
create index if not exists prayers_user_time_idx
  on public.prayers (user_id, prayed_at desc);

-- ─── 4. 좋아하는 말씀 ─────────────────────────────────────
-- ref 가 '요한복음 3:16' 처럼 들어온다. 같은 절을 두 번 담지 않게
-- (user_id, ref, text) 를 유니크로 잡는다.
-- 직접 적은 구절은 ref 가 빈 문자열일 수 있어 text 까지 포함했다.
create table if not exists public.fav_verses (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  ref         text not null default '',
  text        text not null,
  source      text,                      -- 'bible' | 'topic' | 'daily' | 'manual'
  created_at  timestamptz default now(),
  unique (user_id, ref, text)
);
create index if not exists fav_verses_user_idx
  on public.fav_verses (user_id, created_at desc);

-- ─── 5. 소중한 분들 ───────────────────────────────────────
create table if not exists public.people (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  client_id   text,
  name        text not null,
  relation    text default '',
  note        text default '',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_id, client_id)
);

-- ─── 6. 신앙 이야기 ───────────────────────────────────────
-- 한 사람에 하나뿐이라 user_id 를 그대로 기본키로 쓴다
create table if not exists public.faith_story (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  baptism     text default '',
  church      text default '',
  note        text default '',
  updated_at  timestamptz default now()
);

-- ─── 7. 성경 읽기 진도 ────────────────────────────────────
-- 읽은 장을 하나씩 기록한다. 이게 있으면 "창세기 12/50장",
-- "며칠 연속 읽음" 같은 걸 보여줄 수 있다.
-- book 은 1~66, chapter 는 1부터.
create table if not exists public.bible_reads (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  book        smallint not null check (book between 1 and 66),
  chapter     smallint not null check (chapter >= 1),
  read_at     timestamptz not null default now(),
  unique (user_id, book, chapter)
);
create index if not exists bible_reads_user_idx
  on public.bible_reads (user_id, read_at desc);

-- 마지막에 읽던 곳 — 이어읽기용. 사람마다 하나.
create table if not exists public.bible_bookmark (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  book        smallint not null default 43,
  chapter     smallint not null default 1,
  updated_at  timestamptz default now()
);

-- ─── 8. 성경 이야기(시대) 읽음 ────────────────────────────
-- 스토리 탭의 readEras 에 대응
create table if not exists public.story_reads (
  id          bigserial primary key,
  user_id     uuid not null references auth.users(id) on delete cascade,
  era_idx     smallint not null,
  read_at     timestamptz not null default now(),
  unique (user_id, era_idx)
);

-- ═══════════════════════════════════════════════════════════
--  RLS — 내 데이터는 나만
--  이걸 켜지 않으면 anon 키를 아는 누구나 남의 감사일기를 읽을 수 있다.
-- ═══════════════════════════════════════════════════════════
alter table public.profiles       enable row level security;
alter table public.gratitude      enable row level security;
alter table public.immanuel       enable row level security;
alter table public.prayers        enable row level security;
alter table public.fav_verses     enable row level security;
alter table public.people         enable row level security;
alter table public.faith_story    enable row level security;
alter table public.bible_reads    enable row level security;
alter table public.bible_bookmark enable row level security;
alter table public.story_reads    enable row level security;

-- profiles 는 기본키가 id, 나머지는 user_id 라 두 갈래로 만든다
drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

do $$
declare t text;
begin
  foreach t in array array[
    'gratitude','immanuel','prayers','fav_verses','people',
    'faith_story','bible_reads','bible_bookmark','story_reads'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_own', t);
    execute format(
      'create policy %I on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t || '_own', t);
  end loop;
end $$;

-- ═══════════════════════════════════════════════════════════
--  가입하면 프로필을 자동으로 만든다
--  카카오 로그인은 이름과 프로필 사진을 raw_user_meta_data 에 넣어준다.
-- ═══════════════════════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'preferred_username',
      ''
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══════════════════════════════════════════════════════════
--  updated_at 자동 갱신 — 오프라인 병합에서 최신을 고를 때 쓴다
-- ═══════════════════════════════════════════════════════════
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$
declare t text;
begin
  foreach t in array array['profiles','gratitude','immanuel','people','faith_story','bible_bookmark']
  loop
    execute format('drop trigger if exists %I on public.%I', t || '_touch', t);
    execute format(
      'create trigger %I before update on public.%I for each row execute function public.touch_updated_at()',
      t || '_touch', t);
  end loop;
end $$;
