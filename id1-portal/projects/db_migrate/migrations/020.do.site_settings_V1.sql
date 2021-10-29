CREATE OR REPLACE FUNCTION update_or_insert_site_settings(
RowTitle varchar, SettingsObject varchar, SettingsSchema varchar, UiSchema varchar, Lang varchar)
RETURNS void AS $$
begin	

IF SettingsObject IS NULL OR SettingsObject = ''
THEN
    UPDATE site_settings set settings_schema=SettingsSchema::json, ui_schema=UiSchema::json WHERE title = RowTitle and "language"  = Lang;
   	IF NOT FOUND THEN 
        INSERT INTO public.site_settings
		(title, settings_object, settings_schema, ui_schema, "language")
		VALUES(RowTitle, '{}'::json, SettingsSchema::json, UiSchema::json, Lang); 
	END IF;
ELSE
    UPDATE site_settings set settings_object=SettingsObject::json, settings_schema=SettingsSchema::json, ui_schema=UiSchema::json WHERE title = RowTitle and "language"  = Lang;
   	IF NOT FOUND THEN 
        INSERT INTO public.site_settings
		(title, settings_object, settings_schema, ui_schema, "language")
		VALUES(RowTitle, SettingsObject::json, SettingsSchema::json, UiSchema::json, Lang); 
	END IF;
END IF;

 end;
$$ language PLPGSQL;

DROP FUNCTION "add_settings_site_layout";
CREATE OR REPLACE FUNCTION public.add_settings_site_layout(
title_site_name varchar, description_site varchar, siteOldVersion varchar, selectedColorTheme varchar, header_site varchar, new_settings_object varchar, new_ui_schema varchar, lang varchar)
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
      "maxLength": 100,
      "title": "' || title_site_name || '"
    },   
     "descriptionForSite": {
      "type": "string",
      "maxLength": 150,
      "title": "' || description_site || '"
    },
     "selectedColorTheme": {
      "title": "' || selectedColorTheme || '",
        "type": "array",
        "items": {
        "type": "string"
      }
    },
    "header": {
      "type": "string",
      "maxLength": 256,
      "title": "' || header_site || '"
    },
     "siteOldVersion": {
      "title": "' || siteOldVersion || '",
      "type": "string",
      "maxLength": 150
    }
  }
}';

PERFORM update_or_insert_site_settings('layout', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;

select add_settings_site_layout('Назва веб-сайту', 'Опис до заголовку веб-сайту', 'URL старої версії сайту', 'Колірна схема', 'Вибір шапки сайту', '{"selectedColorTheme":["#273043","#304f80","#104D82"],"header":"MonochromeLimited","siteName":""}','{}', 'ua');
select add_settings_site_layout('Site name', 'Description to the title of the website', 'URL of the old version of the site', 'Color scheme', 'Choosing a site header', '{"selectedColorTheme":["#273043","#304f80","#104D82"],"header":"MonochromeLimited","siteName":""}','{}', 'en');


DROP FUNCTION "add_settings_site_contacts";
CREATE OR REPLACE FUNCTION public.add_settings_site_contacts(
main_title varchar, title_email varchar,
title_phone varchar, title_hotline_number varchar,
title_address varchar, title_social_media varchar,
title_page varchar, title_shop varchar,
new_settings_object varchar, new_ui_schema varchar, lang varchar)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin	
	new_settings_schema = '{
  "title": "",
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
        },
        "shopUrl": {
 		  "title": "' || title_page || ' ' || title_shop || '",
          "type": "string"
        }
      }
    }
  }
}';

PERFORM update_or_insert_site_settings('contacts', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;

select add_settings_site_contacts('Контакти', 'Адреса електронної пошти', 'Телефон', 'Номер гарячої лінії', 'Адреса', 'Соціальні медіа', 'Сторінка', 'магазин', '{"socialMedia":{"facebookUrl":"","twitterUrl":"","linkedinUrl":"","youtubeUrl":"","shopUrl":""},"email":"","phone":"","hotlineNumber":"","address":""}','{}', 'ua');
select add_settings_site_contacts('Contacts', 'Email', 'Phone', 'Hotline number', 'Address', 'Social media', 'Page', 'shop', '{"socialMedia":{"facebookUrl":"","twitterUrl":"","linkedinUrl":"","youtubeUrl":"","shopUrl":""},"email":"","phone":"","hotlineNumber":"","address":""}','{}', 'en');


CREATE OR REPLACE FUNCTION public.add_settings_location_of_banners(main_title varchar, title varchar, enabledProperty varchar, lang varchar)

RETURNS void AS $$
declare
  new_settings_schema varchar;
  new_settings_object varchar;
begin	
	new_settings_object = '{
      "topBar": [
        {
          "title": "sliderNewsForTop",
          "enabled": true
        },
        {
          "title": "sliderLinksForTop",
          "enabled": true
        },
        {
          "title": "linkWrapperTop",
          "enabled": true
        }
      ],
      "leftBar": [
        {
          "title": "rubric",
          "enabled": true
        },
        {
          "title": "blockViewRubric",
          "enabled": true
        },
        {
          "title": "listViewRubric",
          "enabled": true
        }
      ],
      "rightBar": [
        {
          "title": "socialNetworks",
          "enabled": true
        },
        {
          "title": "latestNews",
          "enabled": true
        },
        {
          "title": "linkEditor",
          "enabled": true
        },
        {
          "title": "popularNews",
          "enabled": true
        },
        {
          "title": "popularTags",
          "enabled": true
        },
        {
          "title": "blockLinks",
          "enabled": true
        }
      ],
      "bottomBar": [
        {
          "title": "sliderNewsForBottom",
          "enabled": true
        },
        {
          "title": "sliderLinksForBottom",
          "enabled": true
        },
        {
          "title": "linkWrapperBottom",
          "enabled": true
        }
      ]
    }';
    new_settings_schema = '{"type":"object","properties":{
      "topBar": {"type":"array","items":{"type":"object","properties":{       
       "title":{"type":"string","title":"' || title ||'"},
       "enabled":{"type":"boolean","title":"' || enabledProperty ||'"}
     }}},
     "rightBar": {"type":"array","items":{"type":"object","properties":{       
       "title":{"type":"string","title":"' || title ||'"},
       "enabled":{"type":"boolean","title":"' || enabledProperty ||'"}
     }}},
      "leftBar": {"type":"array","items":{"type":"object","properties":{       
       "title":{"type":"string","title":"' || title ||'"},
       "enabled":{"type":"boolean","title":"' || enabledProperty ||'"}
     }}},
      "bottomBar": {"type":"array","items":{"type":"object","properties":{       
       "title":{"type":"string","title":"' || title ||'"},
       "enabled":{"type":"boolean","title":"' || enabledProperty ||'"}
     }}}
  }}';

PERFORM update_or_insert_site_settings(main_title, new_settings_object, new_settings_schema, '{}', lang);

 end;
$$ language PLPGSQL;

DROP FUNCTION "add_new_languages";

CREATE OR REPLACE FUNCTION public.add_new_languages(lang varchar, title_lang varchar)

RETURNS void AS $$
declare
  new_settings_schema varchar;
begin

INSERT INTO public.languages
(title, cutback)
VALUES(title_lang, lang);

PERFORM add_settings_site_layout(settingSiteName, settingdescriptionSite, settingsiteOldVersion, settingselectedColorTheme, settingheaderSite, '{"selectedColorTheme": ["#273043","#304f80","#104D82"], "siteOldVersion": "", "header": "", "siteName": "","descriptionForSite": ""}','{}', lang);
PERFORM add_settings_site_contacts(settingContacts, settingEmail, settingPhone, settingHotlineNumber, settingAddress, settingSocialMedia, settingPage, settingShop,
'{"socialMedia":{"facebookUrl":"","twitterUrl":"","linkedinUrl":"","youtubeUrl":""},"email":"","phone":"","hotlineNumber":"","address":""}',
'{}', lang);

PERFORM add_settings_site_main_navigation('[]','{}', lang);
PERFORM add_settings_location_of_banners('locationOfBanners', settingTitle, settingEnabled, lang);

 end;
$$ language PLPGSQL;

UPDATE site_settings 
SET settings_object = '[{"content":[{"permission":"allNews","label":"allNews","to":"/news"},
{"permission":"rubricsAndTags","label":"rubricsAndTags","to":"/rubrics"}],"permission":"news","label":"news","icon":"th-large","translateDescription":"translateDescriptionForNews"},
{"permission":"mainNavigation","label":"navigation","to":"/menu_settings","icon":"sitemap","translateDescription":"translateDescriptionForMenuSettings"},
{"content":[{"permission":"mainSettings","label":"main","to":"/main_settings"},{"permission":"newsSettings","label":"newsSettings","to":"/news_settings"},
{"permission":"users","label":"usersAndGroups","to":"/usersAndGroups_settings"},
{"permission":"languageSettings","label":"languageSettings","to":"/language_settings"},{"permission":"botSettings","label":"botSettings","to":"/bot_settings"}],"permission":"settings","icon":"cog","label":"settings","translateDescription":"translateDescriptionForSettings"},
{"permission":"linksSettings","label":"linksSettings","icon":"external-link","to":"/links","translateDescription":"translateDescriptionForLinksSettings"},
 {"permission":"plugins","icon":"diamond","to":"/plugins","label":"plugins","translateDescription":"translateDescriptionForPlugins"}]'
WHERE title='adminNavigation'