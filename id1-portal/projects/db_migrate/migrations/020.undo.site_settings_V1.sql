DROP FUNCTION "add_settings_location_of_banners";
DROP FUNCTION "add_settings_site_layout";
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

select add_settings_site_layout('Назва веб-сайту','','{}', 'ua');
select add_settings_site_layout('Site name','','{}', 'en');


DROP FUNCTION "add_settings_site_contacts";
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

select add_settings_site_contacts('Контакти', 'Адреса електронної пошти', 'Телефон', 'Номер гарячої лінії', 'Адреса', 'Соціальні медіа', 'Сторінка', '','{}', 'ua');
select add_settings_site_contacts('Contacts', 'Email', 'Phone', 'Hotline number', 'Address', 'Social media', 'Page', '','{}', 'en');

DROP FUNCTION "add_new_languages";
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
settingRubrics varchar)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin

INSERT INTO public.languages
(title, cutback)
VALUES(title_lang, lang);

PERFORM add_settings_site_layout(settingSiteName,'{"selectedColorTheme":["#273043","#304f80","#104D82"],"header":"MonochromeLimited","siteName":""}','{}', lang);
PERFORM add_settings_site_contacts(settingContacts, settingEmail, settingPhone, settingHotlineNumber, settingAddress, settingSocialMedia, settingPage,
'{"socialMedia":{"facebookUrl":"","twitterUrl":"","linkedinUrl":"","youtubeUrl":""},"email":"","phone":"","hotlineNumber":"","address":""}',
'{}', lang);
PERFORM add_settings_site_main_page_sliders(settingSlidersOnTheMainPage, settingNewsInTheSlider, settingNews, '[]','{}', lang);
PERFORM add_settings_site_main_page_rubric(settingRubricsOnTheMainPage,settingRubrics,'[]','{}', lang);
PERFORM add_settings_site_main_navigation('[]','{}', lang);
 end;
$$ language PLPGSQL;