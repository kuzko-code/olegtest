ALTER TABLE news
ALTER COLUMN created_date TYPE timestamptz,
ALTER COLUMN published_date TYPE timestamptz,
ADD COLUMN "description" varchar NOT NULL DEFAULT '';