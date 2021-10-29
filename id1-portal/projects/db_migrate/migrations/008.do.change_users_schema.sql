-- change role enum
ALTER TABLE users ALTER COLUMN "role" TYPE varchar;
UPDATE users SET "role" = 'global_admin';
DROP TYPE enum_user_roles;
CREATE TYPE enum_user_roles AS ENUM('root_admin', 'global_admin', 'content_admin');
ALTER TABLE users ALTER COLUMN "role" TYPE enum_user_roles USING ("role"::enum_user_roles);

ALTER TABLE users
ADD COLUMN username varchar NOT NULL DEFAULT 'username';

ALTER TABLE users
ALTER COLUMN is_active SET DEFAULT TRUE;

ALTER TABLE users
DROP COLUMN forgot_url;