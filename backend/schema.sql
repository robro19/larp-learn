-- Applied to the isolated Larp Learn Supabase project.
-- Tables are intentionally inaccessible to public Data API roles.
create table public.larp_sessions (
 id uuid primary key default gen_random_uuid(), token_hash text unique not null,
 ip_hash text not null, state jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.larp_sessions enable row level security;
revoke all on public.larp_sessions from anon, authenticated;
create index larp_session_rate on public.larp_sessions(ip_hash,created_at);
create table public.larp_mail_receipts (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references public.larp_sessions(id), recipient text not null,
 status text not null default 'pending', provider_id text,
 created_at timestamptz not null default now()
);
alter table public.larp_mail_receipts enable row level security;
revoke all on public.larp_mail_receipts from anon,authenticated;
create index larp_mail_rate on public.larp_mail_receipts(session_id,created_at);
