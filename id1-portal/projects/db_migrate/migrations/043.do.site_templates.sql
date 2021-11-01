INSERT INTO json_schemas (id, json_schema, ui_schema)
VALUES ('colorTheme','{
	"title":"",
	"type":"object",
	"properties": {
		"selectedColorTheme": {
			"title":"[colorScheme]",
			"type":"array",
			"items": {
				"type":"string"
			}
		}		
	}
}', '{}');

-- start update templates
CREATE TABLE templates (
  title VARCHAR(256) NOT NULL PRIMARY KEY,
  header VARCHAR(256),
  footer VARCHAR(256),
  preview VARCHAR(256) NOT NULL,  
  configuration_form VARCHAR(256),
  custom_site_template boolean NOT NULL DEFAULT true,
  schema_id VARCHAR(50),
  CONSTRAINT templates_schema_id_fkey FOREIGN KEY (schema_id) REFERENCES json_schemas(id)
);

-- added new templates
INSERT INTO templates
(title, footer, header, preview, configuration_form, custom_site_template, schema_id)
VALUES('DichromaticLimited', './footer', './dichromaticLimitedHeader.jsx','./linkToPreviewPhoto.png', './linkToConfigurationForm.jsx', false, 'colorTheme'),
('DichromaticAllWidth', './footer', './dichromaticAllWidthHeader.jsx','./linkToPreviewPhoto.png', './linkToConfigurationForm.jsx', false, 'colorTheme'),
('MonochromeLimited', './footer', './monochromeLimitedHeader.jsx','./linkToPreviewPhoto.png', './linkToConfigurationForm.jsx', false, 'colorTheme');

CREATE TABLE template_settings (
  id serial NOT NULL PRIMARY KEY,
  settings_object jsonb NOT NULL,
  language VARCHAR(20) NOT NULL,
  template VARCHAR(256),
  FOREIGN KEY (language) REFERENCES languages (cutback) ON DELETE CASCADE,
  CONSTRAINT template_settings_schema_id_fkey FOREIGN KEY (template) REFERENCES templates(title) ON DELETE CASCADE
);

INSERT INTO public.template_settings
(settings_object, "language", "template")
VALUES
('{}', 'ua', 'DichromaticLimited'),
('{}', 'ua', 'DichromaticAllWidth'),
('{}', 'ua', 'MonochromeLimited');

INSERT INTO public.template_settings
(settings_object, "language", "template")
VALUES
('{}', 'en', 'DichromaticLimited'),
('{}', 'en', 'DichromaticAllWidth'),
('{}', 'en', 'MonochromeLimited');

CREATE OR REPLACE FUNCTION update_template_settings(settings_object jsonb, temp varchar(256), lang varchar(50))
RETURNS void AS $$
begin	
	DELETE FROM template_settings WHERE template = temp and language = lang;	
	INSERT INTO public.template_settings (settings_object, template, language) VALUES(settings_object, temp, lang);
END;
$$  LANGUAGE plpgsql;

CREATE VIEW site_template_settings AS
     SELECT templates.title, templates.header, templates.footer, template_settings.settings_object, template_settings.language
     FROM templates 
     LEFT JOIN template_settings on templates.title = template_settings.template;

CREATE VIEW active_languages as
SELECT * FROM languages WHERE languages.active = 't';
-- end update templates

-- startupdate color_schemes
ALTER TABLE color_schemes
ADD COLUMN template VARCHAR(256);

UPDATE color_schemes set template = 'DichromaticLimited'
WHERE template is null;

INSERT INTO color_schemes (color_scheme, custom_color_scheme, template)
SELECT color_scheme, custom_color_scheme, 'DichromaticAllWidth' FROM color_schemes
WHERE template = 'DichromaticLimited';

INSERT INTO color_schemes (color_scheme, custom_color_scheme, template)
SELECT color_scheme, custom_color_scheme, 'MonochromeLimited' FROM color_schemes
WHERE template = 'DichromaticLimited';

ALTER TABLE color_schemes
ADD CONSTRAINT color_schemes_template_fkey FOREIGN KEY (template) REFERENCES templates(title) ON DELETE CASCADE;
-- end update color_schemes

UPDATE public.json_schemas
SET json_schema='{
	"title":"",
	"type":"object",
	"properties": {
		"siteName": {
			"type":"string",
			"minLength": 3,
			"maxLength":100,
			"title":"[siteName]"
		},
		"descriptionForSite": {
			"type":"string",
			"maxLength": 150,
			"title": "[descriptionToTheTitleOfTheWebsite]"
		},
		"selectedColorTheme": {
			"title":"[colorScheme]",
			"type":"array",
			"items": {
				"type":"string"
			}
		},
		"header": {
			"type":"string",
			"maxLength": 256,
			"title":"[choosingASiteHeader]"
		},
		"siteOldVersion": {
			"title":"[urlOfTheOldVersionOfTheSite]",
			"type":"string",
			"maxLength":150
		}
	}
}'::json
WHERE id='layout';