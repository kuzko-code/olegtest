ALTER TABLE digest
    ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN ip INET NOT null,
    DROP COLUMN status;

DROP TYPE  subscription_type;