-- WEI IN SIGHT: Seed Admin User for Local Development
-- This script creates a default admin user in the auth schema so you can log in on localhost.

-- 1. Enable pgcrypto if not already enabled (required for crypt function)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create the user in auth.users
-- Password will be: password123
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
)
SELECT
    '00000000-0000-0000-0000-000000000000',
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'jackyho@weiinsight.com',
    crypt('password123', gen_salt('bf')),
    now(),
    NULL,
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'jackyho@weiinsight.com'
);

-- 3. Create the identity in auth.identities
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at,
    provider_id
)
SELECT
    uuid_generate_v4(),
    id,
    format('{"sub":"%s","email":"%s"}', id, email)::jsonb,
    'email',
    now(),
    now(),
    now(),
    id -- provider_id usually matches sub/id for email provider
FROM auth.users
WHERE email = 'jackyho@weiinsight.com'
AND NOT EXISTS (
    SELECT 1 FROM auth.identities WHERE user_id = auth.users.id
);

-- 4. Ensure the user exists in our public.admin_users table as well
INSERT INTO public.admin_users (email, full_name, role)
VALUES ('jackyho@weiinsight.com', 'Jacky Ho', 'owner')
ON CONFLICT (email) DO NOTHING;
