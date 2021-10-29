ALTER TABLE news
ADD COLUMN auto_published boolean NOT NULL default false,
ADD COLUMN auto_publish_date TIMESTAMPTZ;