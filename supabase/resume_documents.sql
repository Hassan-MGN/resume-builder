-- Resummetry production-safe cloud document schema.
-- Run this in the Supabase SQL editor. It is safe to re-run.

create table if not exists public.resume_documents (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null check (document_type in ('draft', 'completed')),
  title text not null default 'Untitled Resume',
  template text,
  mode text,
  source text,
  resume jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  pdf_path text,
  pdf_filename text,
  revision bigint not null default 1,
  deleted_at timestamptz
);

alter table public.resume_documents add column if not exists revision bigint not null default 1;
alter table public.resume_documents add column if not exists deleted_at timestamptz;

update public.resume_documents set revision = 1 where revision is null or revision < 1;

create index if not exists resume_documents_user_updated_idx
  on public.resume_documents(user_id, updated_at desc);
create index if not exists resume_documents_user_type_idx
  on public.resume_documents(user_id, document_type);
create index if not exists resume_documents_user_deleted_idx
  on public.resume_documents(user_id, deleted_at);

alter table public.resume_documents enable row level security;

drop policy if exists "Users can read their own resume documents" on public.resume_documents;
create policy "Users can read their own resume documents"
  on public.resume_documents for select using (auth.uid() = user_id);

drop policy if exists "Users can insert their own resume documents" on public.resume_documents;
create policy "Users can insert their own resume documents"
  on public.resume_documents for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own resume documents" on public.resume_documents;
create policy "Users can update their own resume documents"
  on public.resume_documents for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own resume documents" on public.resume_documents;
create policy "Users can delete their own resume documents"
  on public.resume_documents for delete using (auth.uid() = user_id);

create or replace function public.set_resume_documents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  if tg_op = 'UPDATE' then
    new.revision = greatest(coalesce(old.revision, 1) + 1, coalesce(new.revision, 1));
  elsif new.revision is null or new.revision < 1 then
    new.revision = 1;
  end if;
  return new;
end;
$$;

drop trigger if exists resume_documents_updated_at on public.resume_documents;
create trigger resume_documents_updated_at
before update on public.resume_documents
for each row execute function public.set_resume_documents_updated_at();

insert into storage.buckets (id, name, public)
values ('resume-pdfs', 'resume-pdfs', false)
on conflict (id) do update set public = false;

drop policy if exists "Users can upload their own resume PDFs" on storage.objects;
create policy "Users can upload their own resume PDFs"
on storage.objects for insert
with check (bucket_id = 'resume-pdfs' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can read their own resume PDFs" on storage.objects;
create policy "Users can read their own resume PDFs"
on storage.objects for select
using (bucket_id = 'resume-pdfs' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can update their own resume PDFs" on storage.objects;
create policy "Users can update their own resume PDFs"
on storage.objects for update
using (bucket_id = 'resume-pdfs' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'resume-pdfs' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can delete their own resume PDFs" on storage.objects;
create policy "Users can delete their own resume PDFs"
on storage.objects for delete
using (bucket_id = 'resume-pdfs' and auth.uid()::text = (storage.foldername(name))[1]);

-- Durable server-side AI quota. The RPC reads auth.uid(), so a caller cannot
-- spend another user's quota. Direct table access remains disabled by RLS.
create table if not exists public.ai_usage (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started timestamptz not null default now(),
  window_count integer not null default 0,
  day_started date not null default current_date,
  day_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.ai_usage enable row level security;
drop policy if exists "Users cannot directly read AI usage" on public.ai_usage;
drop policy if exists "Users cannot directly write AI usage" on public.ai_usage;

create or replace function public.consume_ai_usage(
  p_window_limit integer default 20,
  p_day_limit integer default 200,
  p_window_seconds integer default 600
)
returns table(allowed boolean, window_count integer, day_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  current_window_start timestamptz;
  current_day date := current_date;
  next_window_count integer;
  next_day_count integer;
begin
  if uid is null then
    return query select false, 0, 0;
    return;
  end if;

  insert into public.ai_usage(user_id, window_started, window_count, day_started, day_count)
  values (uid, now(), 0, current_date, 0)
  on conflict (user_id) do nothing;

  select window_started, window_count, day_started, day_count
    into current_window_start, next_window_count, current_day, next_day_count
  from public.ai_usage
  where user_id = uid
  for update;

  if current_window_start + make_interval(secs => greatest(1, p_window_seconds)) <= now() then
    next_window_count := 0;
    current_window_start := now();
  end if;

  if current_day <> current_date then
    next_day_count := 0;
    current_day := current_date;
  end if;

  if next_window_count >= greatest(1, p_window_limit) or next_day_count >= greatest(1, p_day_limit) then
    return query select false, next_window_count, next_day_count;
    return;
  end if;

  next_window_count := next_window_count + 1;
  next_day_count := next_day_count + 1;

  update public.ai_usage
     set window_started = current_window_start,
         window_count = next_window_count,
         day_started = current_day,
         day_count = next_day_count,
         updated_at = now()
   where user_id = uid;

  return query select true, next_window_count, next_day_count;
end;
$$;

revoke all on function public.consume_ai_usage(integer, integer, integer) from public;
grant execute on function public.consume_ai_usage(integer, integer, integer) to authenticated;
