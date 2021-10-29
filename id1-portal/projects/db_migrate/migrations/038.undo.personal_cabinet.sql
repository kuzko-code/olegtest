ALTER TABLE users
no inherit authorization_data;

DROP TABLE visitors cascade;
DROP TABLE authorization_data cascade;

ALTER TABLE users ALTER COLUMN "role" TYPE varchar;
DROP TYPE enum_user_roles;
CREATE TYPE enum_user_roles AS ENUM('root_admin', 'global_admin', 'content_admin', 'group_admin');
ALTER TABLE users ALTER COLUMN "role" TYPE enum_user_roles USING ("role"::enum_user_roles);

UPDATE site_settings 
      SET settings_object = '[{"content":[{"permission":"allNews","label":"allNews","to":"/news"},
      {"permission":"rubricsAndTags","label":"rubricsAndTags","to":"/rubrics"}],"permission":"news","label":"news","icon":"th-large","translateDescription":"translateDescriptionForNews"},
      {"permission":"mainNavigation","label":"navigation","to":"/menu_settings","icon":"sitemap","translateDescription":"translateDescriptionForMenuSettings"},
      {"content":[{"permission":"mainSettings","label":"main","to":"/main_settings"},
      {"permission":"users","label":"usersAndGroups","to":"/usersAndGroups_settings"},
      {"permission":"languageSettings","label":"languageSettings","to":"/language_settings"},{"permission":"socialNetworks","label":"socialNetworks","to":"/social_networks"},{"permission":"update","label":"update","to":"/update"}],"permission":"settings","icon":"cog","label":"settings","translateDescription":"translateDescriptionForSettings"},
      {"permission":"linksSettings","label":"linksSettings","icon":"external-link","to":"/links","translateDescription":"translateDescriptionForLinksSettings"},
      {"permission":"plugins","icon":"diamond","to":"/plugins","label":"plugins","translateDescription":"translateDescriptionForPlugins"}]'
      WHERE title='adminNavigation';