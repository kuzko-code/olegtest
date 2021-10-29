DROP FUNCTION "add_settings_site_main_page_rubric";

CREATE OR REPLACE FUNCTION update_or_insert_tabs(
RowTitle varchar, SettingsObject varchar, SettingsSchema varchar, UiSchema varchar, Lang varchar)
RETURNS void AS $$
begin	

UPDATE tabs set form_data=SettingsObject::json, json_schema=SettingsSchema::json, ui_schema=UiSchema::json
WHERE title = RowTitle and "language"  = Lang;
	IF NOT FOUND THEN 
        INSERT INTO public.tabs
		(title, form_data, json_schema, ui_schema, "language")
		VALUES(RowTitle, SettingsObject::json, SettingsSchema::json, UiSchema::json, Lang); 
	END IF;

 end;
$$ language PLPGSQL;


CREATE OR REPLACE FUNCTION public.add_tabs_main_page_sliders(
tab_title varchar, main_title varchar, news_on_sliider varchar, news varchar, new_form_data varchar, new_ui_schema varchar, lang varchar)
RETURNS void AS $$
declare
  new_json_schema varchar;
begin	
	new_json_schema = '{
  "title": "' || main_title || '",
  "type": "array",
  "maxItems": 3,
  "items": {
    "title": "' || news_on_sliider || '",
    "type": "array",
    "items": {
      "title": "' || news || '",
      "type": "integer"
    }
  }
}';

PERFORM update_or_insert_tabs(tab_title, new_form_data, new_json_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;


CREATE OR REPLACE FUNCTION public.add_tabs_slider_links(
tab_title varchar, ImageUrl varchar, Title varchar, Link varchar, EnterName varchar, EnterLink varchar, aspectRatio varchar, new_form_data varchar, lang varchar)
RETURNS void AS $$
declare
  new_ui_schema varchar;
  new_json_schema varchar;
begin	
	new_json_schema = '{"type":"array", "aspectRatio":"' || aspectRatio || '", "required": ["file"], "items":{"type":"object","properties":{
      "file": {"type": "string", "title": "' || ImageUrl || '"},
      "title":{"type":"string","maxLength":100,"title":"' || Title || '"},
      "url":{"type":"string","title":"' || Link || '", "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"}
    }}}';

    new_ui_schema = '{"items": {"title": {"ui:placeholder": "' || EnterName || '"},"url": {"ui:placeholder": "' || EnterLink || '"}}}';

PERFORM update_or_insert_tabs(tab_title, new_form_data, new_json_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;


CREATE OR REPLACE FUNCTION public.add_tabs_link_wrapper(
tab_title varchar, ImageUrl varchar, Title varchar, Link varchar, EnterName varchar, EnterLink varchar, new_form_data varchar, lang varchar)
RETURNS void AS $$
declare
  new_ui_schema varchar;
  new_json_schema varchar;
begin	
	new_json_schema = '{"type":"object", "aspectRatio":"8", "required": ["file"], "properties":{
      "file": {"type": "string", "title": "' || ImageUrl || '"},
      "title":{"type":"string","maxLength":100,"title":"' || Title || '"},
      "url":{"type":"string","title":"' || Link || '", "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"}
    }}';

    new_ui_schema = '{"items": {"title": {"ui:placeholder": "' || EnterName || '"},"url": {"ui:placeholder": "' || EnterLink || '"}}}';

PERFORM update_or_insert_tabs(tab_title, new_form_data, new_json_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;


-- CREATE OR REPLACE FUNCTION public.add_tab_main_page_rubric(
-- tab_title varchar, RubricsTitle varchar, RubricTitle varchar, new_form_data varchar, new_ui_schema varchar, lang varchar)
-- RETURNS void AS $$
-- declare
--   new_json_schema varchar;
-- begin	
-- 	new_json_schema = '{
-- "title": "' || RubricsTitle || '",
--   "type": "array",
--   "items": {
--     "title": "' || RubricTitle || '",
--     "type": "integer"
--   }
-- }';

-- PERFORM update_or_insert_tabs(tab_title, new_form_data, new_json_schema, new_ui_schema, lang);

--  end;
-- $$ language PLPGSQL;


CREATE OR REPLACE FUNCTION public.add_tab_main_page_rubric(
tab_title varchar, RubricsTitle varchar, RubricTitle varchar, ShowLinksToAllNews varchar, new_form_data varchar, new_ui_schema varchar, lang varchar)
RETURNS void AS $$
declare
  new_json_schema varchar;
begin	
	new_json_schema = '{
  "type": "object",
  "properties": {
    "rubrics": {
      "title": "' || RubricsTitle || '",
      "type": "array",
        "items": {
          "title": "' || RubricTitle || '",
          "type": "integer"
       }
    },
    "showLinksToAllNews": {
      "type": "boolean",
      "title": "' || ShowLinksToAllNews || '",
      "default": false
    }
  }
}';

PERFORM update_or_insert_tabs(tab_title, new_form_data, new_json_schema, new_ui_schema, lang);

end;
$$ language PLPGSQL;

CREATE OR REPLACE FUNCTION public.add_tab_last_or_popular_news(
tab_title varchar, TypeOfView varchar, TypeOfViewBlock varchar, TypeOfViewList varchar, ShowLinksToAllNews varchar, NumberOfNews varchar, new_form_data varchar, lang varchar)
RETURNS void AS $$
declare
  new_json_schema varchar;
  new_ui_schema varchar;
begin

new_ui_schema = '{
  "typeOfView": {
    "ui:widget": "radio",
    "ui:options": {
      "inline": true
    }
  },
  "numberOfNews": {
    "ui:widget": "range"
  }
}';

new_json_schema = '{
  "properties": {
    "typeOfView": {
      "title": "' || TypeOfView || '",
      "type": "string",
      "default": 1,
      "oneOf": [
        {
         "title": "' || TypeOfViewBlock || '",
          "const": "block"
        },
        {
         "title": "' || TypeOfViewList || '",
          "const": "list"
        }        
      ]
    },
    "showLinksToAllNews": {
      "type": "boolean",
      "title": "' || ShowLinksToAllNews || '",
      "default": false
    },
    "numberOfNews": {
      "title": "' || NumberOfNews || '",
      "type": "integer",
      "minimum": 1,
      "maximum": 20,
      "multipleOf": 1
    }
  }
}';

PERFORM update_or_insert_tabs(tab_title, new_form_data, new_json_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;

CREATE OR REPLACE FUNCTION public.add_tabs_for_new_languages(lang varchar,
  TabsSlidersOnTheMainPage varchar,
  TabsNewsInTheSlider varchar,
  TabsNews varchar,

  RubricsTitle varchar,
  RubricTitle varchar,

  ImageUrl varchar,
  Title varchar,
  Link varchar,
  EnterName varchar,
  EnterLink varchar,

  Content varchar,  
  LinkEditor varchar,

  TypeOfView varchar, 
  TypeOfViewBlock varchar, 
  TypeOfViewList varchar, 
  ShowLinksToAllNews varchar, 
  NumberOfNews varchar
)
RETURNS void AS $$
declare
begin

PERFORM add_tabs_main_page_sliders('sliderNewsForTop', TabsSlidersOnTheMainPage, TabsNewsInTheSlider, TabsNews, '[]','{}', lang);
PERFORM add_tabs_main_page_sliders('sliderNewsForBottom', TabsSlidersOnTheMainPage, TabsNewsInTheSlider, TabsNews, '[]','{}', lang);

PERFORM add_tab_main_page_rubric('rubric', RubricsTitle, RubricTitle, ShowLinksToAllNews, '{"rubrics":[],"showLinksToAllNews":true}','{}', lang);
PERFORM add_tab_main_page_rubric('blockViewRubric', RubricsTitle, RubricTitle, ShowLinksToAllNews, '{"rubrics":[],"showLinksToAllNews":true}','{}', lang);
PERFORM add_tab_main_page_rubric('listViewRubric', RubricsTitle, RubricTitle, ShowLinksToAllNews, '{"rubrics":[],"showLinksToAllNews":true}','{}', lang);

PERFORM add_tabs_slider_links('blockLinks', ImageUrl, Title, Link, EnterName, EnterLink, '7', '[]', lang);

PERFORM add_tabs_slider_links('sliderLinksForTop', ImageUrl, Title, Link, EnterName, EnterLink, '1.333', '{}', lang);
PERFORM add_tabs_slider_links('sliderLinksForBottom', ImageUrl, Title, Link, EnterName, EnterLink, '1.333', '{}', lang);

PERFORM add_tabs_link_wrapper('linkWrapperTop', ImageUrl, Title, Link, EnterName, EnterLink,'{}', lang);
PERFORM add_tabs_link_wrapper('linkWrapperBottom', ImageUrl, Title, Link, EnterName, EnterLink,'{}', lang);

PERFORM add_tab_last_or_popular_news('popularNews', TypeOfView, TypeOfViewBlock, TypeOfViewList, ShowLinksToAllNews, NumberOfNews, '{
  "typeOfView": "block",
  "showLinksToAllNews": false,
  "numberOfNews": 1
}', lang);
PERFORM add_tab_last_or_popular_news('latestNews', TypeOfView, TypeOfViewBlock, TypeOfViewList, ShowLinksToAllNews, NumberOfNews, '{
  "typeOfView": "block",
  "showLinksToAllNews": false,
  "numberOfNews": 1
}', lang);

PERFORM update_or_insert_tabs(
    'GovSites',
    '[]',
    '{"type": "array","items": {"type": "object","required": ["title","url"],"properties": {"title": {"type": "string", "title": "' || Title || '", "maxLength":150},"url": {"type": "string","title": "' || Link || '", "pattern": "^\\https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)"}}}}',
    '{"items": {"title": {"ui:placeholder": "' || EnterName || '"},"url": {"ui:placeholder": "' || EnterLink || '"}}}',
    lang
    );

PERFORM update_or_insert_tabs(
    'linkEditor',
    '{}',
    '{"title": "'|| LinkEditor ||'","type": "object","required": ["title","content"],"properties": {"title": {"type": "string","title": "' || Title || '"},"content": {"type": "string","title": "' || Content || '"}}}',
    '{"title": {"ui:placeholder": "' || EnterName || '"}}',
    lang
    );

 end;
$$ language PLPGSQL;

select add_tabs_for_new_languages('ua', 'Слайдери на головній сторінці', 'Новини в слайдері', 'Новина', 'Рубрики на головній сторінці', 'Рубрики',
'Зображення', 'Назва', 'Посилання', 'Внесіть назву', 'Внесіть посилання', 'Контент', 'Редактор посилань', 'Відображення новин', 'Плитки', 'Список', 'Показувати посилання Усі новини', 'Кількість новин');

select add_tabs_for_new_languages('en', 'Sliders on the main page', 'News in the slider', 'News', 'Rubrics on the main page', 'rubrics',
'Image', 'Title', 'Link', 'Enter a name', 'Enter the link', 'Content', 'Link editor', 'Type of view', 'Block', 'List', 'Show link to all news', 'Number of news');

DELETE FROM site_settings WHERE title = 'mainPageRubrics' or title = 'mainPageSliders';


UPDATE site_settings 
SET settings_object = '[{"content":[{"permission":"allNews","label":"allNews","to":"/news"},
{"permission":"rubricsAndTags","label":"rubricsAndTags","to":"/rubrics"}],"permission":"news","label":"news","icon":"th-large","translateDescription":"translateDescriptionForNews"},
{"permission":"mainNavigation","label":"navigation","to":"/menu_settings","icon":"sitemap","translateDescription":"translateDescriptionForMenuSettings"},
{"content":[{"permission":"mainSettings","label":"main","to":"/main_settings"},
{"permission":"users","label":"usersAndGroups","to":"/usersAndGroups_settings"},
{"permission":"languageSettings","label":"languageSettings","to":"/language_settings"},{"permission":"botSettings","label":"botSettings","to":"/bot_settings"}],"permission":"settings","icon":"cog","label":"settings","translateDescription":"translateDescriptionForSettings"},
{"permission":"linksSettings","label":"linksSettings","icon":"external-link","to":"/links","translateDescription":"translateDescriptionForLinksSettings"},
 {"permission":"plugins","icon":"diamond","to":"/plugins","label":"plugins","translateDescription":"translateDescriptionForPlugins"}]'
WHERE title='adminNavigation';