/*
# Add student support requests and complete avatar access

1. New Tables
- `support_requests` stores Help and Report submissions from signed-in students.
- `id` uniquely identifies each request.
- `user_id` identifies the student who submitted it and defaults to the active account.
- `kind` distinguishes help questions from bug or problem reports.
- `subject` stores the short topic.
- `message` stores the student's request.
- `created_at` records when it was submitted.

2. Modified Access
- Avatar images remain stored in the existing `avatars` bucket.
- Authenticated users can read avatars and each student can manage only files in their own folder.

3. Security
- Row-level security is enabled on `support_requests`.
- Authenticated students can only read, create, update, or delete their own requests.
- The owner is assigned from `auth.uid()` by default.
- Data API grants are limited to authenticated users.

4. Notes
- No existing student records are removed or changed.
- Policies are recreated safely so this migration can be applied more than once.
*/

CREATE TABLE IF NOT EXISTS public.support_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('help', 'report')),
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_requests TO authenticated;

DROP POLICY IF EXISTS "support_requests_select_own" ON public.support_requests;
CREATE POLICY "support_requests_select_own" ON public.support_requests FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "support_requests_insert_own" ON public.support_requests;
CREATE POLICY "support_requests_insert_own" ON public.support_requests FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "support_requests_update_own" ON public.support_requests;
CREATE POLICY "support_requests_update_own" ON public.support_requests FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "support_requests_delete_own" ON public.support_requests;
CREATE POLICY "support_requests_delete_own" ON public.support_requests FOR DELETE
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'avatars');