ALTER TABLE users ALTER COLUMN "role" TYPE varchar;
UPDATE users SET "role" = 'global_admin';
DROP TYPE enum_user_roles;
CREATE TYPE enum_user_roles AS ENUM('root_admin', 'global_admin', 'content_admin', 'group_admin');
ALTER TABLE users ALTER COLUMN "role" TYPE enum_user_roles USING ("role"::enum_user_roles);

CREATE TABLE groups (
  id serial NOT NULL,
  name  varchar UNIQUE,
  permission json NOT null,
  CONSTRAINT groups_pkey PRIMARY KEY (id)
);

CREATE TABLE user_groups (
  group_id int REFERENCES groups (id) ON DELETE CASCADE,
  user_id int REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT user_groups_pk PRIMARY KEY (group_id, user_id)
);

INSERT INTO public.site_settings
(title, settings_object, settings_schema, ui_schema, "language")
VALUES('adminNavigation', '[
      {
        "content": [
          {
            "permission": "allNews",
            "label": "allNews",
            "to": "/news"
          },
          {
            "permission": "rubricsAndTags",
            "label": "rubricsAndTags",
            "to": "/rubrics"
          }
        ],
        "permission": "news",
        "label": "news",
        "icon": "th-large",
        "translateDescription": "translateDescriptionForNews"
      },
      {
        "permission": "mainNavigation",
        "label": "navigation",
        "to": "/menu_settings",
        "icon": "sitemap",
        "translateDescription": "translateDescriptionForMenuSettings"
      },
      {
        "content": [
          {
            "permission": "mainSettings",
            "label": "main",
            "to": "/main_settings"
          },
          {
            "permission": "newsSettings",
            "label": "newsSettings",
            "to": "/news_settings"
          },
          {
            "permission": "contacts",
            "label": "contacts",
            "to": "/contacts"
          },
          {
            "permission": "users",
            "label": "usersAndGroups",
            "to": "/usersAndGroups_settings"
          },
          {
            "permission": "languageSettings",
            "label": "languageSettings",
            "to": "/language_settings"
          }
        ],
        "permission": "settings",
        "icon": "cog",
        "label": "settings",
        "translateDescription": "translateDescriptionForSettings"
      },
      {
        "permission": "linksSettings",
        "label": "linksSettings",
        "icon": "external-link",
        "to": "/links",
        "translateDescription": "translateDescriptionForLinksSettings"
      },
      {
        "permission": "plugins",
        "icon": "diamond",
        "to": "/plugins",
        "label": "plugins",
        "translateDescription": "translateDescriptionForPlugins"
      }
    ]',
    '{
      "title": "adminNavigation",
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "label"
        ],
        "properties": {
          "content": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "label"
              ],
              "properties": {
                "label": {
                  "type": "string",
                  "title": "label"
                },
                "to": {
                  "type": "string",
                  "title": "to"
                },
                "icon": {
                  "type": "string",
                  "title": "icon"
                },
                "permission": {
                  "type": "string",
                  "title": "permission"
                },
                "translateDescription": {
                  "type": "string",
                  "title": "translateDescription"
                }
              }
            }
          },
          "label": {
            "type": "string",
            "title": "label"
          },
          "to": {
            "type": "string",
            "title": "to"
          },
          "icon": {
            "type": "string",
            "title": "icon"
          },
          "permission": {
            "type": "string",
            "title": "permission"
          },
          "translateDescription": {
            "type": "string",
            "title": "translateDescription"
          }
        }
      }
    }'::json, '{}'::json, null);