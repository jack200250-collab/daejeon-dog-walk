-- 대전 강아지 산책 지도 — Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에서 실행하세요

create table if not exists spots (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  address     text not null,
  lat         float8 not null,
  lng         float8 not null,
  description text,
  size_suitable text[] not null default '{}',  -- ['small','medium','large']
  features    text[] not null default '{}',
  image_url   text,
  spot_type   text not null default 'park',    -- park|trail|riverside|forest
  created_at  timestamptz default now()
);

-- 공개 읽기 허용 (로그인 없이 조회 가능)
alter table spots enable row level security;
create policy "Public read" on spots for select using (true);

-- 인덱스
create index spots_size_idx on spots using gin(size_suitable);

-- 시드 데이터 예시 (spots.service.ts 의 데이터와 동일)
insert into spots (name, address, lat, lng, description, size_suitable, features, image_url, spot_type) values
  ('한밭수목원',     '대전 서구 둔산대로 169',           36.3665, 127.3884,
   '대전 도심 속 넓은 수목원.',
   array['small','medium','large'], array['parking','toilet','bench','trail','shade'],
   'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', 'park'),

  ('갑천 자연생태공원', '대전 서구 갑천로 217',           36.3532, 127.3423,
   '갑천변을 따라 이어지는 긴 산책로.',
   array['small','medium','large'], array['trail','bench','water','shade'],
   'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80', 'riverside'),

  ('엑스포 과학공원', '대전 유성구 대덕대로 480',          36.3740, 127.3814,
   '넓은 잔디광장과 산책로가 있는 과학공원.',
   array['small','medium','large'], array['parking','toilet','bench','trail','water'],
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', 'park'),

  ('보문산 시민공원', '대전 중구 보문산공원로 170',         36.2967, 127.4076,
   '자연 그대로의 숲길 산책로.',
   array['small','medium'], array['trail','shade','bench','toilet','parking'],
   'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80', 'forest'),

  ('계족산 황톳길',  '대전 대덕구 장동 산 12',            36.3952, 127.4782,
   '14.5km 황톳길, 체력 좋은 강아지에게 최적.',
   array['small','medium','large'], array['trail','shade','parking','toilet','bench'],
   'https://images.unsplash.com/photo-1513836279014-a89f7d3b0e7a?w=600&q=80', 'trail'),

  ('월평공원',      '대전 서구 월평동 산 1-1',            36.3499, 127.3631,
   '대전 서구 대표 도시숲.',
   array['small','medium','large'], array['trail','shade','bench','parking'],
   'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=600&q=80', 'forest'),

  ('유성 근린공원',  '대전 유성구 봉명동 278',            36.3624, 127.3363,
   '소형견 산책에 특히 적합한 조용한 공원.',
   array['small','medium'], array['bench','shade','water','toilet'],
   'https://images.unsplash.com/photo-1567093351-f17dbf6f2e6e?w=600&q=80', 'park'),

  ('도안 근린공원',  '대전 서구 도안동 1374',             36.3243, 127.3362,
   '넓은 잔디광장, 대형견이 뛰어놀기 좋음.',
   array['small','medium','large'], array['parking','bench','water','trail','offleash'],
   'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&q=80', 'park'),

  ('대청호 수변공원', '대전 대덕구 미호동 일원',           36.4634, 127.5130,
   '대청댐 인근 한적한 수변공원.',
   array['small','medium','large'], array['parking','bench','trail','shade','toilet'],
   'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80', 'riverside'),

  ('천연기념물센터 생태공원', '대전 유성구 대덕대로 481번길 92', 36.3682, 127.3005,
   '평일 한적한 생태공원, 소형견 최적.',
   array['small','medium'], array['trail','shade','bench','parking'],
   'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80', 'forest');
