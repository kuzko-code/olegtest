create or replace function add_tag(tags varchar[], language varchar) RETURNS void AS $$
declare
  tag varchar;
  begin   
    foreach tag in array tags
    loop
      INSERT INTO news_tags
        (title, language)
        SELECT tag, language
        WHERE
          NOT EXISTS (
            SELECT 1 FROM news_tags WHERE title = tag
          );
    end loop; 
 end;
$$ language PLPGSQL;

ALTER TABLE news ALTER COLUMN rubric_id DROP NOT NULL;

ALTER TABLE news 
DROP CONSTRAINT news_rubrics_fkey;

ALTER TABLE news
add CONSTRAINT news_rubrics_fkey FOREIGN KEY (rubric_id) REFERENCES news_rubrics(id) ON delete SET null;

create table "languages" (
    id serial NOT NULL,
    title varchar(256) NOT NULL,
    cutback varchar(256) NOT null PRIMARY key,
    CONSTRAINT languages_cutback_unique UNIQUE (title) 
);

INSERT INTO public.languages
(title, cutback)
VALUES('Українська', 'ua');

-- CREATE TYPE internal_names_of_themes AS ENUM('Blue', 'Green');
-- create table "themes" (
--     id serial NOT NULL,
--     title varchar(256) NOT null,
--     internal_name internal_names_of_themes,
--     language varchar NOT NULL DEFAULT 'ua',
--    CONSTRAINT news_themes_languages_fkey
--   FOREIGN KEY (language)
--   REFERENCES languages (cutback) ON DELETE CASCADE
-- --    CONSTRAINT themes_title_unique UNIQUE (title)
-- );


-- INSERT INTO public.themes
-- (title, "language", internal_name)
-- VALUES('Синя', 'ua', 'Blue');

-- INSERT INTO public.themes
-- (title, "language", internal_name)
-- VALUES('Зелена', 'ua', 'Green');

ALTER TABLE news
ADD COLUMN language varchar NOT null DEFAULT 'ua';

ALTER TABLE news
  ADD CONSTRAINT news_languages_fkey
  FOREIGN KEY (language)
  REFERENCES languages (cutback) ON DELETE CASCADE;
 
 ALTER TABLE news_tags
ADD COLUMN language varchar NOT NULL DEFAULT 'ua';

ALTER TABLE news_tags
  ADD CONSTRAINT news_tags_languages_fkey
  FOREIGN KEY (language)
  REFERENCES languages (cutback) ON DELETE CASCADE;
  
 
 ALTER TABLE news_rubrics
ADD COLUMN language varchar NOT NULL DEFAULT 'ua';

ALTER TABLE news_rubrics
  ADD CONSTRAINT news_rubrics_languages_fkey
  FOREIGN KEY (language)
  REFERENCES languages (cutback) ON DELETE CASCADE;

-- site_settings

 ALTER TABLE site_settings
ADD COLUMN language varchar;

ALTER TABLE site_settings
  ADD CONSTRAINT site_settings_languages_fkey
  FOREIGN KEY (language)
  REFERENCES languages (cutback) ON DELETE CASCADE;
 
 UPDATE site_settings
SET language='ua'
WHERE language IS NULL;

ALTER TABLE site_settings DROP CONSTRAINT SS_TITLE;


CREATE OR REPLACE FUNCTION update_or_insert_site_settings(
RowTitle varchar, SettingsObject varchar, SettingsSchema varchar, UiSchema varchar, Lang varchar)
RETURNS void AS $$
begin	

UPDATE site_settings set settings_object=SettingsObject::json, settings_schema=SettingsSchema::json, ui_schema=UiSchema::json
WHERE title = RowTitle and "language"  = Lang;
	IF NOT FOUND THEN 
        INSERT INTO public.site_settings
		(title, settings_object, settings_schema, ui_schema, "language")
		VALUES(RowTitle, SettingsObject::json, SettingsSchema::json, UiSchema::json, Lang); 
	END IF;

 end;
$$ language PLPGSQL;

CREATE OR REPLACE FUNCTION public.add_settings_site_logos( new_settings_object varchar, new_ui_schema varchar)RETURNS void AS $$
declare
  new_settings_schema varchar;
begin	
	new_settings_schema = '{   
   "headerLogo": {
      "type": "string",
      "title": "",
      "format": "uri"
    },
     "footerLogo": {
      "type": "string",
      "title": "",
      "format": "uri"
    }
}';
UPDATE site_settings set settings_object=new_settings_object::json, settings_schema=new_settings_schema::json, ui_schema=new_ui_schema::json
WHERE title = 'siteLogos' and "language" is null;
	IF NOT FOUND THEN 
        INSERT INTO public.site_settings
		(title, settings_object, settings_schema, ui_schema, "language")
		VALUES('siteLogos', new_settings_object::json, new_settings_schema::json, new_ui_schema::json, null); 
	END IF;

 end;
$$ language PLPGSQL;

CREATE OR REPLACE FUNCTION public.add_settings_site_layout(
title_site_name varchar, new_settings_object varchar, new_ui_schema varchar, lang varchar)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin	
	new_settings_schema = '{
  "title": "",
  "type": "object",
  "properties": {
    "siteName": {
      "type": "string",
      "minLength": 3,
      "maxLength": 256,
      "title": "' || title_site_name || '"
    }
  }
}';

PERFORM update_or_insert_site_settings('layout', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;



CREATE OR REPLACE FUNCTION public.add_settings_site_contacts(
main_title varchar, title_email varchar,
title_phone varchar, title_hotline_number varchar,
title_address varchar, title_social_media varchar,
title_page varchar,
new_settings_object varchar, new_ui_schema varchar, lang varchar)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin	
	new_settings_schema = '{
  "title": "' || main_title || '",
  "type": "object",
  "properties": {
"email": {
      "type": "string",
      "format": "email",
      "title": "' || title_email || '"
    },
    "phone": {
      "type": "string",
      "title": "' || title_phone || '"
    },
    "hotlineNumber": {
      "type": "string",
      "title": "' || title_hotline_number || '"
    },
    "address": {
      "type": "string",
      "title": "' || title_address || '"
    },
    
    "socialMedia": {
      "title": "' || title_social_media || '",
      "type": "object",
      "properties": {
        "facebookUrl": {
          "title": "' || title_page || ' Facebook",
          "type": "string"
        },
        "linkedinUrl": {
          "title": "' || title_page || ' Linkedin",
          "type": "string"
        },
        "twitterUrl": {
          "title": "' || title_page || ' Twitter",
          "type": "string"
        },
        "youtubeUrl": {
 		  "title": "' || title_page || ' Youtube",
          "type": "string"
        }
      }
    }
  }
}';

PERFORM update_or_insert_site_settings('contacts', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;

CREATE OR REPLACE FUNCTION public.add_settings_site_main_navigation(new_settings_object varchar, new_ui_schema varchar, lang varchar)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin	
	new_settings_schema = '{  
  "definitions": {
    "node": {
      "type": "object",
      "properties": {
        "label": {
          "type": "string"
        },
        "url": {
          "type": "string"
        },
        "key": {
          "type": "string"
        },
        "nodes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/node"
          }
        }
      },
      "required": [
        "label",
        "url",
        "key",
        "nodes"
      ]
    }
  },
  "type": "array",
  "items": {
    "$ref": "#/definitions/node"
  }
}';

PERFORM update_or_insert_site_settings('mainNavigation', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;



CREATE OR REPLACE FUNCTION public.add_settings_site_main_page_sliders(
main_title varchar, news_on_sliider varchar, news varchar, new_settings_object varchar, new_ui_schema varchar, lang varchar)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin	
	new_settings_schema = '{
  "title": "' || main_title || '",
  "type": "array",
  "maxItems": 3,
  "items": {
    "title": "' || news_on_sliider || '",
    "type": "array",
    "minItems": 1,
    "maxItems": 5,
    "items": {
      "title": "' || news || '",
      "type": "integer"
    }
  }
}';

PERFORM update_or_insert_site_settings('mainPageSliders', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;

CREATE OR REPLACE FUNCTION public.add_settings_site_main_page_rubric(
main_title varchar, rubric varchar, new_settings_object varchar, new_ui_schema varchar, lang varchar)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin	
	new_settings_schema = '{
"title": "' || main_title || '",
  "type": "array",
  "items": {
    "title": "' || rubric || '",
    "type": "integer"
  }
}';

PERFORM update_or_insert_site_settings('mainPageRubrics', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;

CREATE OR REPLACE FUNCTION public.add_languages_settings(
internal_name varchar, new_settings_object varchar, new_ui_schema varchar)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin	
	new_settings_schema = '{
"title": "",
  "type": "array",
  "items": {
    "title": "",
    "type": "string"
  }
}';

PERFORM update_or_insert_site_settings(internal_name, new_settings_object, new_settings_schema, new_ui_schema, null);

 end;
$$ language PLPGSQL;

CREATE OR REPLACE FUNCTION public.add_new_languages(lang varchar, 
title_lang varchar,
settingSiteName varchar,
settingContacts varchar,
settingEmail varchar,
settingPhone varchar,
settingHotlineNumber varchar,
settingAddress varchar,
settingSocialMedia varchar,
settingPage varchar,
settingSlidersOnTheMainPage varchar,
settingNewsInTheSlider varchar,
settingNews varchar,
settingRubricsOnTheMainPage varchar,
settingRubrics varchar

)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin

INSERT INTO public.languages
(title, cutback)
VALUES(title_lang, lang);

PERFORM add_settings_site_layout(settingSiteName,'{}','{}', lang);
PERFORM add_settings_site_contacts(settingContacts, settingEmail, settingPhone, settingHotlineNumber, settingAddress, settingSocialMedia, settingPage,
'{"socialMedia":{}}',
'{}', lang);
PERFORM add_settings_site_main_page_sliders(settingSlidersOnTheMainPage, settingNewsInTheSlider, settingNews, '[]','{}', lang);
PERFORM add_settings_site_main_page_rubric(settingRubricsOnTheMainPage,settingRubrics,'[]','{}', lang);
PERFORM add_settings_site_main_navigation('[]','{}', lang);
 end;
$$ language PLPGSQL;

select add_new_languages('en', 'English', 'Site name', 'Contacts', 'Email', 'Phone',
'Hotline number', 'Address', 'Social media', 'Page', 'Sliders on the main page','News in the slider', 'News',
'Rubrics on the main page','rubrics');


select add_settings_site_logos('{"footerLogo":"","headerLogo":""}','{}');
select add_settings_site_layout('Назва веб-сайту','{}','{}', 'ua');

select add_languages_settings('languagesOnTheAdminSite','["ua", "en"]','{}');
select add_languages_settings('languagesOnThePublicSite','["ua", "en"]','{}');