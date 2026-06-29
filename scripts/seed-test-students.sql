-- Seed 15 test students for SlugConnect (dev only)
-- All accounts use password: TestPassword123!
-- Run via Supabase SQL editor or scripts/seed via MCP execute_sql

DO $$
DECLARE
  sam_jo_id uuid := '59b9a274-db3a-4f8a-aead-793764850271';
  requester_ids uuid[] := '{}'::uuid[];
  student record;
  uid uuid;
  now_ts timestamptz := now();
  requester_count int := 0;
BEGIN
  FOR student IN
    SELECT * FROM (VALUES
      ('Emma Wilson', 'emmawilson@ucsc.edu', 'Psychology', 'Cowell College', 'Sophomore', ARRAY['Art', 'Reading']),
      ('Liam Chen', 'liamchen@ucsc.edu', 'Computer Science', 'Crown College', 'Junior', ARRAY['Gaming', 'Coding', 'Music']),
      ('Olivia Martinez', 'oliviamartinez@ucsc.edu', 'Biology', 'Merrill College', 'Freshman', ARRAY['Hiking', 'Photography']),
      ('Noah Patel', 'noahpatel@ucsc.edu', 'Economics', 'Stevenson College', 'Senior', ARRAY['Board Games', 'Cooking']),
      ('Ava Thompson', 'avathompson@ucsc.edu', 'Film and Digital Media', 'Porter College', 'Junior', ARRAY['Film', 'Writing', 'Theater']),
      ('Ethan Garcia', 'ethangarcia@ucsc.edu', 'Physics', 'Kresge College', 'Sophomore', ARRAY['Fitness', 'Rock Climbing']),
      ('Sophia Kim', 'sophiakim@ucsc.edu', 'Mathematics', 'Oakes College', 'Senior', ARRAY['Baking', 'Yoga']),
      ('Mason Rodriguez', 'masonrodriguez@ucsc.edu', 'Sociology', 'Rachel Carson College', 'Graduate', ARRAY['Volunteering', 'Travel']),
      ('Isabella Nguyen', 'isabellanguyen@ucsc.edu', 'Cognitive Science', 'College Nine', 'Junior', ARRAY['Drawing', 'Meditation']),
      ('Lucas Anderson', 'lucasanderson@ucsc.edu', 'Politics', 'John R. Lewis College', 'Sophomore', ARRAY['Running', 'Sports']),
      ('Mia Taylor', 'miataylor@ucsc.edu', 'Marine Biology', 'Cowell College', 'Freshman', ARRAY['Swimming', 'Surfing']),
      ('Jackson Lee', 'jacksonlee@ucsc.edu', 'Robotics Engineering', 'Crown College', 'Senior', ARRAY['Technology', 'Coding']),
      ('Charlotte Brown', 'charlottebrown@ucsc.edu', 'Literature', 'Stevenson College', 'Junior', ARRAY['Reading', 'Writing']),
      ('Aiden Davis', 'aidendavis@ucsc.edu', 'Environmental Studies', 'Merrill College', 'Sophomore', ARRAY['Gardening', 'Camping', 'Hiking']),
      ('Amelia Clark', 'ameliaclark@ucsc.edu', 'Neuroscience', 'Porter College', 'Freshman', ARRAY['Music', 'Dancing'])
    ) AS t(name, email, major, college, year, interests)
  LOOP
    uid := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      student.email, crypt('TestPassword123!', gen_salt('bf')),
      now_ts, now_ts, now_ts,
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
      false, false
    );

    INSERT INTO auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), uid::text, uid,
      jsonb_build_object('sub', uid::text, 'email', student.email, 'email_verified', true, 'phone_verified', false),
      'email', now_ts, now_ts, now_ts
    );

    INSERT INTO public.profiles (id, name, major, college, year, interests)
    VALUES (uid, student.name, student.major, student.college, student.year, student.interests);

    IF requester_count < 5 THEN
      requester_ids := array_append(requester_ids, uid);
      requester_count := requester_count + 1;
    END IF;
  END LOOP;

  FOREACH uid IN ARRAY requester_ids
  LOOP
    INSERT INTO public.connection_requests (sender_id, receiver_id, status)
    VALUES (uid, sam_jo_id, 'pending')
    ON CONFLICT (sender_id, receiver_id) DO NOTHING;
  END LOOP;
END $$;
