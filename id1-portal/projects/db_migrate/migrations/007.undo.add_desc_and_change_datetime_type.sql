ALTER TABLE news
ALTER COLUMN created_date TYPE timestamp,
ALTER COLUMN published_date TYPE timestamp,
DROP COLUMN "description";