ALTER TABLE rubrics
RENAME TO news_rubrics;
ALTER TABLE news_rubrics
ALTER COLUMN title SET NOT NULL,
ADD CONSTRAINT news_rubrics_title_unique UNIQUE (title);

ALTER TABLE tags
RENAME TO news_tags;
ALTER TABLE news_tags
ALTER COLUMN title SET NOT NULL,
ADD CONSTRAINT news_tags_title_unique UNIQUE (title);

ALTER TABLE news RENAME COLUMN picture TO main_picture;
ALTER TABLE news RENAME COLUMN tag_titles TO tags;
ALTER TABLE news RENAME COLUMN "date" TO created_date;

ALTER TABLE news
ALTER COLUMN title SET NOT NULL,
DROP COLUMN description,
ALTER COLUMN main_picture SET NOT NULL,
ADD COLUMN content varchar NOT NULL,
ALTER COLUMN created_date TYPE timestamp,
ALTER COLUMN created_date SET NOT NULL,
ADD COLUMN number_of_views integer NOT NULL DEFAULT 0,
ADD COLUMN is_published boolean NOT NULL,
ADD COLUMN published_date timestamp,
DROP CONSTRAINT news_rubrics_fkey,
ADD CONSTRAINT news_rubrics_fkey FOREIGN KEY (rubric_id) REFERENCES news_rubrics(id);