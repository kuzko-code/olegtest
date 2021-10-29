ALTER TABLE news
DROP COLUMN updated_date;


ALTER TABLE news
ADD COLUMN auto_publish_date TIMESTAMPTZ;