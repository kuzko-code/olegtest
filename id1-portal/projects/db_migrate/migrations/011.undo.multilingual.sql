drop function add_tag;

DELETE FROM public.languages WHERE cutback!='ua';

-- DROP TABLE "themes";
-- DROP TYPE internal_names_of_themes;

ALTER TABLE news_rubrics 
DROP CONSTRAINT news_rubrics_languages_fkey;

ALTER TABLE news_rubrics 
DROP COLUMN language;

ALTER TABLE news_tags 
DROP CONSTRAINT news_tags_languages_fkey;

ALTER TABLE news_tags 
DROP COLUMN language;


ALTER TABLE news 
DROP CONSTRAINT news_languages_fkey;

ALTER TABLE news 
DROP COLUMN language;

DELETE FROM site_settings
WHERE language!='ua' or language is null;

ALTER TABLE site_settings 
DROP CONSTRAINT site_settings_languages_fkey;

ALTER TABLE site_settings 
DROP COLUMN language;

ALTER TABLE site_settings
ADD CONSTRAINT SS_TITLE UNIQUE (title);

DROP TABLE languages;

DROP FUNCTION "add_new_languages";
DROP FUNCTION "add_languages_settings";
DROP FUNCTION "add_settings_site_main_navigation";
DROP FUNCTION "add_settings_site_main_page_rubric";
DROP FUNCTION "add_settings_site_main_page_sliders";
DROP FUNCTION "add_settings_site_contacts";
DROP FUNCTION "add_settings_site_layout";
DROP FUNCTION "add_settings_site_logos";
DROP FUNCTION "update_or_insert_site_settings";