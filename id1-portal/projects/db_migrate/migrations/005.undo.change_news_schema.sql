ALTER TABLE news_rubrics
RENAME TO rubrics;
ALTER TABLE rubrics
ALTER COLUMN title DROP NOT NULL,
DROP CONSTRAINT news_rubrics_title_unique;

ALTER TABLE news_tags
RENAME TO tags;
ALTER TABLE tags
ALTER COLUMN title DROP NOT NULL,
DROP CONSTRAINT news_tags_title_unique;

ALTER TABLE news RENAME column main_picture TO picture;
ALTER TABLE news RENAME COLUMN tags TO tag_titles;
ALTER TABLE news RENAME COLUMN created_date TO "date";

ALTER TABLE news
ALTER COLUMN title DROP NOT NULL,
ADD COLUMN description varchar,
ALTER COLUMN picture DROP NOT NULL,
DROP COLUMN content,
ALTER COLUMN "date" TYPE timestamptz,
ALTER COLUMN "date" DROP NOT NULL,
DROP COLUMN number_of_views,
DROP COLUMN is_published,
DROP COLUMN published_date,
DROP CONSTRAINT news_rubrics_fkey,
ADD CONSTRAINT news_rubrics_fkey FOREIGN KEY (rubric_id) REFERENCES rubrics(id);