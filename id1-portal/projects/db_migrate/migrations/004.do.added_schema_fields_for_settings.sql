ALTER TABLE site_settings
ADD COLUMN settings_schema json NOT NULL DEFAULT '{}',
ADD COLUMN ui_schema json NOT NULL DEFAULT '{}';