var crypto = require('crypto');
require('dotenv').config();
const private_key = process.env.PRIVATE_KEY || 'secret';
const date = new Date(Date.now());

module.exports.generateSql = function () {
    return (
      `
      DROP TABLE messages;
      DROP TABLE portal_update_settings;
      DROP TABLE public.portal_versions;
      DROP TYPE status_portal_versions;
      DROP FUNCTION public.update_portal_version;

      UPDATE site_settings
      SET settings_object = '[{"content":[{"permission":"allNews","label":"allNews","to":"/news"},
        {"permission":"rubricsAndTags","label":"rubricsAndTags","to":"/rubrics"}],"permission":"news","label":"news","icon":"th-large","translateDescription":"translateDescriptionForNews"},
        {"permission":"mainNavigation","label":"navigation","to":"/menu_settings","icon":"sitemap","translateDescription":"translateDescriptionForMenuSettings"},
        {"content":[{"permission":"mainSettings","label":"main","to":"/main_settings"},
        {"permission":"users","label":"usersAndGroups","to":"/usersAndGroups_settings"},
        {"permission":"languageSettings","label":"languageSettings","to":"/language_settings"},{"permission":"botSettings","label":"botSettings","to":"/bot_settings"}],"permission":"settings","icon":"cog","label":"settings","translateDescription":"translateDescriptionForSettings"},
        {"permission":"linksSettings","label":"linksSettings","icon":"external-link","to":"/links","translateDescription":"translateDescriptionForLinksSettings"},
        {"permission":"plugins","icon":"diamond","to":"/plugins","label":"plugins","translateDescription":"translateDescriptionForPlugins"}]'
      WHERE title='adminNavigation';
       `
    )
  }
