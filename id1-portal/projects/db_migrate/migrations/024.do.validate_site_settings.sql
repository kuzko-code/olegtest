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
      "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
    }
  }
}';

PERFORM update_or_insert_site_settings('layout', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;

select add_settings_site_layout('Назва веб-сайту', 'Опис до заголовку веб-сайту', 'URL старої версії сайту', 'Колірна схема', 'Вибір шапки сайту', '','{}', 'ua');
select add_settings_site_layout('Site name', 'Description to the title of the website', 'URL of the old version of the site', 'Color scheme', 'Choosing a site header', '','{}', 'en');


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
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
        },
        "linkedinUrl": {
          "title": "' || title_page || ' Linkedin",
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
        },
        "twitterUrl": {
          "title": "' || title_page || ' Twitter",
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
        },
        "youtubeUrl": {
 		      "title": "' || title_page || ' Youtube",
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
        },
        "shopUrl": {
 		      "title": "' || title_page || ' ' || title_shop || '",
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
       }
      }
    }
  }
}';

PERFORM update_or_insert_site_settings('contacts', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;

select add_settings_site_contacts('Контакти', 'Адреса електронної пошти', 'Телефон', 'Номер гарячої лінії', 'Адреса', 'Соціальні медіа', 'Сторінка', 'магазин', '','{}', 'ua');
select add_settings_site_contacts('Contacts', 'Email', 'Phone', 'Hotline number', 'Address', 'Social media', 'Page', 'shop', '','{}', 'en');
