  ALTER TABLE tabs
  ALTER COLUMN form_data SET NOT NULL,
  DROP COLUMN index,
  DROP type_title,
  DROP COLUMN "position",
  DROP COLUMN enabled,
  ADD COLUMN title VARCHAR(500),    
  ADD json_schema JSON DEFAULT '{}',
  ADD ui_schema JSON DEFAULT '{}';

ALTER TABLE site_settings 
	DROP json_schema_id,
    ADD settings_schema JSON DEFAULT '{}',
    ADD ui_schema JSON DEFAULT '{}';

DROP TABLE tabs_type;
DROP TABLE json_schemas;

DROP TYPE  tabs_position_type;
DROP FUNCTION update_tabs_position("json");

DELETE from site_settings where "language" IS NOT NULL;
DELETE from tabs where "language" IS NOT NULL;

select add_settings_site_layout('Назва веб-сайту', 'Опис до заголовку веб-сайту', 'URL старої версії сайту', 'Колірна схема', 'Вибір шапки сайту', '','{}', 'ua');
select add_settings_site_layout('Site name', 'Description to the title of the website', 'URL of the old version of the site', 'Color scheme', 'Choosing a site header', '','{}', 'en');

select add_settings_site_contacts('Контакти', 'Адреса електронної пошти', 'Телефон', 'Номер гарячої лінії', 'Адреса', 'Соціальні медіа', 'Сторінка', 'магазин', '','{}', 'ua');
select add_settings_site_contacts('Contacts', 'Email', 'Phone', 'Hotline number', 'Address', 'Social media', 'Page', 'shop', '','{}', 'en');

select add_settings_site_main_navigation('[]','{}', 'en');
select add_settings_site_main_navigation('[]','{}', 'ua');

select add_tabs_for_new_languages('en', 'Sliders on the main page',
'News in the slider',
'News',
'Rubrics on the main page',
'rubrics',
'Image',
'Title',
'Link',
'Enter a name',
'Enter the link',
'Content',
'Link editor',
'Type of',
'Block',
'List',
'Show link to all news',
'Number of news',
'Image size',
'Large',
'Medium',
'Small');

select add_tabs_for_new_languages('ua', 'Слайдери на головній сторінці',
'Новини в слайдері',
'Новина',
'Рубрики на головній сторінці',
'Рубрики',
'Зображення',
'Назва',
'Посилання',
'Внесіть назву',
'Внесіть посилання',
'Контент',
'Редактор посилань',
'Відображення новин',
'Плитки',
'Список',
'Показувати посилання Усі новини',
'Кількість новин',
'Розмір зображень',
'Великі',
'Середні',
'Малі');

INSERT INTO public.site_settings (title,settings_object,settings_schema,ui_schema,"language") VALUES 
('locationOfBanners','{"topBar": [
        {
          "title": "sliderNewsForTop",
          "enabled": true
        },
        {
          "title": "sliderLinksForTop",
          "enabled": false
        },
        {
          "title": "linkWrapperTop",
          "enabled": false
        }
      ],
      "leftBar": [
        {
          "title": "rubric",
          "enabled": false
        },
        {
          "title": "blockViewRubric",
          "enabled": false
        },
        {
          "title": "listViewRubric",
          "enabled": false
        }
      ],
      "rightBar": [
        {
          "title": "socialNetworks",
          "enabled": true
        },
        {
          "title": "latestNews",
          "enabled": false
        },
        {
          "title": "linkEditor",
          "enabled": false
        },
        {
          "title": "popularNews",
          "enabled": true
        },
        {
          "title": "blockLinks",
          "enabled": false
        },
        {
          "title": "popularTags",
          "enabled": false
        }
      ],
      "bottomBar": [
        {
          "title": "sliderNewsForBottom",
          "enabled": false
        },
        {
          "title": "sliderLinksForBottom",
          "enabled": false
        },
        {
          "title": "linkWrapperBottom",
          "enabled": true
        }
      ]
    }','{"type":"object","properties":{"topBar":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string","title":"Title"},"enabled":{"type":"boolean","title":"Enable"}}}},"rightBar":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string","title":"Title"},"enabled":{"type":"boolean","title":"Enable"}}}},"leftBar":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string","title":"Title"},"enabled":{"type":"boolean","title":"Enable"}}}},"bottomBar":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string","title":"Title"},"enabled":{"type":"boolean","title":"Enable"}}}}}}','{}','ua')
;

INSERT INTO public.site_settings (title,settings_object,settings_schema,ui_schema,"language") VALUES 
('locationOfBanners','{"topBar": [
        {
          "title": "sliderNewsForTop",
          "enabled": true
        },
        {
          "title": "sliderLinksForTop",
          "enabled": false
        },
        {
          "title": "linkWrapperTop",
          "enabled": false
        }
      ],
      "leftBar": [
        {
          "title": "rubric",
          "enabled": false
        },
        {
          "title": "blockViewRubric",
          "enabled": false
        },
        {
          "title": "listViewRubric",
          "enabled": false
        }
      ],
      "rightBar": [
        {
          "title": "socialNetworks",
          "enabled": true
        },
        {
          "title": "latestNews",
          "enabled": false
        },
        {
          "title": "linkEditor",
          "enabled": false
        },
        {
          "title": "popularNews",
          "enabled": true
        },
        {
          "title": "blockLinks",
          "enabled": false
        },
        {
          "title": "popularTags",
          "enabled": false
        }
      ],
      "bottomBar": [
        {
          "title": "sliderNewsForBottom",
          "enabled": false
        },
        {
          "title": "sliderLinksForBottom",
          "enabled": false
        },
        {
          "title": "linkWrapperBottom",
          "enabled": true
        }
      ]
    }','{"type":"object","properties":{"topBar":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string","title":"Title"},"enabled":{"type":"boolean","title":"Enable"}}}},"rightBar":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string","title":"Title"},"enabled":{"type":"boolean","title":"Enable"}}}},"leftBar":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string","title":"Title"},"enabled":{"type":"boolean","title":"Enable"}}}},"bottomBar":{"type":"array","items":{"type":"object","properties":{"title":{"type":"string","title":"Title"},"enabled":{"type":"boolean","title":"Enable"}}}}}}','{}','en')
;