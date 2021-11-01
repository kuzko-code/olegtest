require('dotenv').config();

module.exports.generateSql = function () {
  return (`     
  INSERT INTO json_schemas
  (id, json_schema, ui_schema)
  VALUES
  ('smtp', ' {
    "title": "SMTP server settings",
    "type": "object",
    "required": [
      "host",
      "port"
    ],
    "properties": {
      "host": {
      "type": "string",
      "title": "[host]"
      },
      "port": {
        "type": "number",
        "title": "[port]",
        "maximum": 65535,
        "minimum": 1
      },
      "user": {
        "type": "string",
        "title": "[email]",
        "format": "email",
        "minLength": 1
      },
      "password": {
        "type": "string",
        "title": "[password]",
        "minLength": 1
      }
    }
  }',
  '{
    "host": {
      "ui:autofocus": true
    },
    "port": {
    },
    "user": {
      "ui:options": {
        "inputType": "email"
      }
    },
    "password": {
      "ui:widget": "password"
    }
  }'
  );
  
  INSERT INTO site_settings
  (title, settings_object, json_schema_id)
  VALUES
  ('smtp', '{"password": "",
    "host": "",
    "port": "",
    "user": ""}', 'smtp');
  
  
  UPDATE site_settings
  SET settings_object = '[{"content":[{"permission":"allNews","label":"allNews","to":"/news"},
  {"permission":"rubricsAndTags","label":"rubricsAndTags","to":"/rubrics"}],"permission":"news","label":"news","icon":"th-large","translateDescription":"translateDescriptionForNews"},
  {"permission":"mainNavigation","label":"navigation","to":"/menu_settings","icon":"sitemap","translateDescription":"translateDescriptionForMenuSettings"},
  {"content":[{"permission":"mainSettings","label":"main","to":"/main_settings"},
  {"permission":"users","label":"usersAndGroups","to":"/usersAndGroups_settings"},
  {"permission":"languageSettings","label":"languageSettings","to":"/language_settings"},{"permission":"socialNetworks","label":"socialNetworks","to":"/social_networks"},{"permission":"smtp","label":"mailServer","to":"/smtp"},{"permission":"update","label":"update","to":"/update"}],"permission":"settings","icon":"cog","label":"settings","translateDescription":"translateDescriptionForSettings"},
  {"permission":"visitors","label":"personalCabinet","icon":"vcard","to":"/visitors","translateDescription":"translateDescriptionForLinksSettings"},    
  {"permission":"linksSettings","label":"linksSettings","icon":"external-link","to":"/links","translateDescription":"translateDescriptionForLinksSettings"},
  {"permission":"plugins","icon":"diamond","to":"/plugins","label":"plugins","translateDescription":"translateDescriptionForPlugins"}]'
  WHERE title='adminNavigation';`
  )
}