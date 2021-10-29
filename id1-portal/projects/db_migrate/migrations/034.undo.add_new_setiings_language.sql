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
'{"socialMedia":{"facebookUrl":"www.facebook.com","twitterUrl":"http://twitter.com/explore","linkedinUrl":"www.linkedin.com/","youtubeUrl":"https://www.youtube.com/"}}',
'{}', lang);

PERFORM add_settings_site_main_navigation('[]','{}', lang);
PERFORM add_settings_location_of_banners('locationOfBanners', settingTitle, settingEnabled, lang);

 end;
$$ language PLPGSQL;

DROP FUNCTION "add_new_settings_languages"(lang varchar(50), title_lang varchar(256));



