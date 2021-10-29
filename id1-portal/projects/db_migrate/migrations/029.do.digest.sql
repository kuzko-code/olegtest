CREATE TYPE  subscription_type AS ENUM ('Never', 'EveryWeek', 'EveryDay');

ALTER TABLE digest
    DROP COLUMN is_active,
    DROP COLUMN ip,
    ADD COLUMN status subscription_type NOT NULL DEFAULT 'EveryDay';
