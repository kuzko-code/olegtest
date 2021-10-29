DROP function "add_new_languages";

CREATE OR REPLACE FUNCTION add_new_settings_languages(lang varchar(50), title_lang varchar(256)) RETURNS void AS $$
        BEGIN
			INSERT INTO public.languages
			(title, cutback)
			VALUES(title_lang, lang);

			INSERT INTO site_settings (title, settings_object, json_schema_id, "language")
			VALUES 
			('contacts', '{"socialMedia":{"facebookUrl":"","twitterUrl":"","linkedinUrl":"","youtubeUrl":"","shopUrl":""},"email":"","phone":"","hotlineNumber":"","address":""}', 'contacts', lang),
			('GovSites', '[]', 'GovSites', lang),
			('layout', '{}', 'layout', lang),
			('mainNavigation', '[]', 'mainNavigation', lang),
			('usefulLinks', '[]', 'usefulLinks', lang);
        END;
$$ LANGUAGE plpgsql;