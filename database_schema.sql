-- Create boq_items table
create table if not exists boq_items (
  id uuid default gen_random_uuid() primary key,
  description text not null,
  unit text not null,
  quantity numeric not null,
  rate numeric not null,
  created_at timestamptz default now()
);

-- Enable RLS for boq_items
alter table boq_items enable row level security;

-- Policies for boq_items
drop policy if exists "Public read access" on boq_items;
create policy "Public read access"
  on boq_items for select
  using (true);

drop policy if exists "Authenticated users can insert" on boq_items;
create policy "Authenticated users can insert"
  on boq_items for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update" on boq_items;
create policy "Authenticated users can update"
  on boq_items for update
  to authenticated
  using (true);

drop policy if exists "Authenticated users can delete" on boq_items;
create policy "Authenticated users can delete"
  on boq_items for delete
  to authenticated
  using (true);


-- Create community_contributions table
create table if not exists community_contributions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  initials text,
  amount numeric not null,
  role text,
  contribution text,
  image text,
  created_at timestamptz default now()
);

-- Enable RLS for community_contributions
alter table community_contributions enable row level security;

-- Policies for community_contributions
drop policy if exists "Public read access" on community_contributions;
create policy "Public read access"
  on community_contributions for select
  using (true);

drop policy if exists "Authenticated users can modify" on community_contributions;
create policy "Authenticated users can modify"
  on community_contributions for all
  to authenticated
  using (true);


-- Create project_images table
create table if not exists project_images (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  image_url text not null,
  lat numeric not null,
  lng numeric not null,
  created_at timestamptz default now()
);

-- Enable RLS for project_images
alter table project_images enable row level security;

-- Policies for project_images
drop policy if exists "Public read access" on project_images;
create policy "Public read access"
  on project_images for select
  using (true);

drop policy if exists "Authenticated users can modify" on project_images;
create policy "Authenticated users can modify"
  on project_images for all
  to authenticated
  using (true);

-- Storage Bucket Policies
-- Note: You still need to manually create the 'images' bucket in the dashboard if it doesn't exist.

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

drop policy if exists "Authenticated Uploads" on storage.objects;
create policy "Authenticated Uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'images' );

drop policy if exists "Authenticated Deletes" on storage.objects;
create policy "Authenticated Deletes"
on storage.objects for delete
to authenticated
using ( bucket_id = 'images' );
