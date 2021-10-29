INSERT INTO json_schemas (id, json_schema, ui_schema)
VALUES ('facebookSettings','
{
  "properties": {
    "appID": {
      "type": "string",
      "title": "[facebook_appId]"
    },
    "commentsEnable": {
      "type": "boolean",
      "title": "[facebook_commentsEnable]",
      "default": false
    }
  }
}',
'{}'),
('facebookBotSettings','
{
  "properties": {
	"enableBot": {
		"type": "boolean",
		"title": "[facebook_enable_bot]",
		"default": false
	},
    "pageID": {
      "type": "number",
      "title": "[facebook_pageId]"
    },
	"pageAccessToken": {
		"type": "string",
		"title": "[facebook_page_access_token]"
	}
  }
}',
'{}'),
('facebookPage','
{
    "definitions": {
        "Tabs": {
            "title": "Tabs",
            "type": "string",
            "anyOf": [{
                    "type": "string",
                    "enum": [
                        "timeline"
                    ],
                    "title": "[facebookTab_timeline]"
                },
                {
                    "type": "string",
                    "enum": [
                        "events"
                    ],
                    "title": "[facebookTab_events]"
                },
                {
                    "type": "string",
                    "enum": [
                        "messages"
                    ],
                    "title": "[facebookTab_messages]"
                }
            ]
        }
    },
    "type": "object",
    "required": [
        "title",
        "href"
    ],
    "properties": {
        "title": {
            "type": "string",
            "title": "[facebookPage_title]",
            "default": "[facebookPage_title_default]"
        },
        "href": {
            "type": "string",
            "title": "[facebookPage_href]",
            "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
        },
        "tabs": {
            "type": "array",
            "uniqueItems": true,
            "items": {
                "$ref": "#/definitions/Tabs"
            },
            "title": "[facebookPage_tabs]"
        },
        "helpText": {
            "title": "[facebookPage_view]",
            "type": "null"
        },
        "hideCover": {
            "type": "boolean",
            "title": "[facebookPage_hideCover]",
            "default": false
        },
        "smallHeader": {
            "type": "boolean",
            "title": "[facebookPage_smallHeader]",
            "default": false
        }
    }
}',
'{
    "href": {
        "ui:placeholder": "https://www.facebook.com/XXXXXXXXXX"
    },
    "tabs": {
        "ui:widget": "checkboxes"
    }
}');

INSERT INTO public.site_settings (title,settings_object,"language",json_schema_id) VALUES 
('facebookSettings','{}',NULL, (select id from json_schemas where id = 'facebookSettings')), 
('facebookBotSettings','{}',NULL, (select id from json_schemas where id = 'facebookBotSettings'));

INSERT INTO public.tabs_type (tabs_schema_id, title, tab_position) VALUES 
((select id from json_schemas where id = 'facebookPage'), 'facebookPage', '{rightBar}' );

ALTER TABLE news
	ADD COLUMN facebook_enable BOOLEAN NOT NULL DEFAULT FALSE;