-- A room code is a shareable invitation. No real names or emails appear on the board.
create table public.larp_rooms (
 id uuid primary key default gen_random_uuid(),
 code text unique not null check (code ~ '^[A-F0-9]{8}$'),
 owner_id uuid not null references public.larp_sessions(id),
 inventory jsonb not null,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now() + interval '6 hours'
);
create table public.larp_room_entries (
 room_id uuid not null references public.larp_rooms(id),
 session_id uuid not null references public.larp_sessions(id),
 alias text not null,
 attempts integer not null default 0 check (attempts between 0 and 3),
 correct boolean not null default false,
 score integer not null default 0,
 updated_at timestamptz not null default now(),
 primary key(room_id,session_id)
);
alter table public.larp_rooms enable row level security;
alter table public.larp_room_entries enable row level security;
revoke all on public.larp_rooms, public.larp_room_entries from anon, authenticated;
create index larp_rooms_owner on public.larp_rooms(owner_id,created_at);
create index larp_rooms_board on public.larp_room_entries(room_id,score desc,updated_at);
create index larp_room_player on public.larp_room_entries(session_id);
create function public.larp_submit_room(p_code text,p_player uuid,p_status integer,p_total integer,p_empty integer)
returns jsonb language plpgsql security invoker set search_path='' as $$
declare r public.larp_rooms; e public.larp_room_entries; total integer; empty_count integer; won boolean;
begin
 select * into r from public.larp_rooms where code=p_code and expires_at>now();
 if not found then return jsonb_build_object('error','Room not found or expired'); end if;
 insert into public.larp_room_entries(room_id,session_id,alias)
 values(r.id,p_player,'Larp '||upper(substr(md5(p_player::text||p_code),1,6))) on conflict do nothing;
 select * into e from public.larp_room_entries where room_id=r.id and session_id=p_player for update;
 if e.correct or e.attempts>=3 then return jsonb_build_object('correct',e.correct,'attempts',e.attempts,'score',e.score,'locked',true); end if;
 select sum((v->>'stock')::integer),count(*) filter(where (v->>'stock')::integer=0)
 into total,empty_count from jsonb_array_elements(r.inventory->'snacks') v;
 won := p_status=200 and p_total=total and p_empty=empty_count;
 update public.larp_room_entries set attempts=attempts+1,correct=won,
 score=case when won then 100-attempts*25 else 0 end,updated_at=now()
 where room_id=r.id and session_id=p_player returning * into e;
 return jsonb_build_object('correct',e.correct,'attempts',e.attempts,'score',e.score,'locked',e.correct or e.attempts>=3);
end $$;
revoke all on function public.larp_submit_room(text,uuid,integer,integer,integer) from public,anon,authenticated;
grant execute on function public.larp_submit_room(text,uuid,integer,integer,integer) to service_role;
