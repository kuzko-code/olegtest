module.exports.generateSql = function () {
    return (`     
    DELETE FROM site_settings WHERE title = 'smtp';
    DELETE FROM json_schemas WHERE id = 'smtp';
    UPDATE site_settings
    SET settings_object = '[{"content":[{"permission":"allNews","label":"allNews","to":"/news"},
    {"permission":"rubricsAndTags","label":"rubricsAndTags","to":"/rubrics"}],"permission":"news","label":"news","icon":"th-large","translateDescription":"translateDescriptionForNews"},
    {"permission":"mainNavigation","label":"navigation","to":"/menu_settings","icon":"sitemap","translateDescription":"translateDescriptionForMenuSettings"},
    {"content":[{"permission":"mainSettings","label":"main","to":"/main_settings"},
    {"permission":"users","label":"usersAndGroups","to":"/usersAndGroups_settings"},
    {"permission":"languageSettings","label":"languageSettings","to":"/language_settings"},{"permission":"socialNetworks","label":"socialNetworks","to":"/social_networks"},{"permission":"update","label":"update","to":"/update"}],"permission":"settings","icon":"cog","label":"settings","translateDescription":"translateDescriptionForSettings"},
    {"permission":"visitors","label":"personalCabinet","icon":"vcard","to":"/visitors","translateDescription":"translateDescriptionForLinksSettings"},    
    {"permission":"linksSettings","label":"linksSettings","icon":"external-link","to":"/links","translateDescription":"translateDescriptionForLinksSettings"},
    {"permission":"plugins","icon":"diamond","to":"/plugins","label":"plugins","translateDescription":"translateDescriptionForPlugins"}]'
    WHERE title='adminNavigation';`
    )
}