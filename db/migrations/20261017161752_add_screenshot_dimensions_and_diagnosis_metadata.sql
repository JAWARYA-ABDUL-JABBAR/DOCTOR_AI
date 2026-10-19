alter table public.screenshot_objects add column if not exists width integer check (width between 320 and 8000);
alter table public.screenshot_objects add column if not exists height integer check (height between 240 and 8000);
alter table public.projects add column if not exists diagnosis_source text check (diagnosis_source in ('openai','demo'));
alter table public.projects add column if not exists diagnosed_at timestamptz;
