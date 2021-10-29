-- change role enum
ALTER TABLE users ALTER COLUMN "role" TYPE varchar;
UPDATE users SET "role" = 'admin';
DROP TYPE enum_user_roles;
CREATE TYPE enum_user_roles AS ENUM('admin');
ALTER TABLE users ALTER COLUMN "role" TYPE enum_user_roles USING ("role"::enum_user_roles);

ALTER TABLE users
DROP COLUMN username;

ALTER TABLE users
ALTER COLUMN is_active SET DEFAULT FALSE;

ALTER TABLE users
ADD COLUMN forgot_url varchar(256);