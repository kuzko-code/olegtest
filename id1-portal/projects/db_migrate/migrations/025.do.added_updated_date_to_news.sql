ALTER TABLE news
DROP COLUMN auto_publish_date;

ALTER TABLE news
ADD COLUMN updated_date TIMESTAMPTZ;

UPDATE news SET updated_date = published_date
WHERE published_date IS NOT NULL;
 
UPDATE news SET updated_date = created_date
WHERE updated_date IS NULL;