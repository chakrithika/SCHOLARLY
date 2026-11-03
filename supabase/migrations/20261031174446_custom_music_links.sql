/*
# Custom music links

1. New table
- `music_links` stores each signed-in student's saved YouTube or Spotify links, with a title and creation time.

2. Security
- Row level security is enabled.
- Each authenticated user can only read, add, update, or delete their own saved links.
- The Data API grant is limited to authenticated users.

3. Notes
- Links remain user data and persist across devices through Supabase.
- The app validates supported YouTube and Spotify hostnames before insert.
*/

CREATE TABLE IF NOT EXISTS public.music_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Saved track',
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.music_links ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.music_links TO authenticated;

DROP POLICY IF EXISTS "music_links_select_own" ON public.music_links;
CREATE POLICY "music_links_select_own" ON public.music_links FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "music_links_insert_own" ON public.music_links;
CREATE POLICY "music_links_insert_own" ON public.music_links FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "music_links_update_own" ON public.music_links;
CREATE POLICY "music_links_update_own" ON public.music_links FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "music_links_delete_own" ON public.music_links;
CREATE POLICY "music_links_delete_own" ON public.music_links FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS music_links_user_created_idx ON public.music_links (user_id, created_at DESC);
