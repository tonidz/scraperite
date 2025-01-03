create table product_metadata (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  lang varchar(2) not null,
  title text not null,
  description text not null,
  features text[] default '{}',
  specifications jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint product_metadata_lang_check check (lang in ('en', 'sv')),
  constraint product_metadata_unique_product_lang unique (product_id, lang)
); 