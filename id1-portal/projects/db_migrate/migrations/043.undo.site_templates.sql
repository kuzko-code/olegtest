-- startupdate color_schemes
DELETE FROM public.color_schemes
WHERE template != 'DichromaticLimited';
DELETE FROM json_schemas WHERE id = 'colorTheme';

ALTER TABLE color_schemes
DROP CONSTRAINT color_schemes_template_fkey; 
ALTER TABLE color_schemes
DROP COLUMN template;
-- end update color_schemes

-- start update templates
DROP FUNCTION update_template_settings(jsonb, varchar(256), varchar(50));
DROP VIEW active_languages;
DROP VIEW site_template_settings;
drop table template_settings;
drop table templates;
-- end update templates