DROP FUNCTION add_news_subscription(text, subscription_type, text);
DROP FUNCTION delete_news_from_json_schemas(int);

DO
$BODY$
DECLARE	langs text[];
BEGIN
	SELECT ARRAY(SELECT json_array_elements(ss.settings_object::json)) 
		INTO langs FROM site_settings ss 
		WHERE ss.title = 'languagesOnThePublicSite';

	DELETE FROM mailing WHERE language != split_part(langs[1],'"', 2);
END;
$BODY$ language plpgsql;

ALTER TABLE mailing 
	ALTER COLUMN status TYPE varchar,
	ALTER COLUMN status SET DEFAULT 'EveryDay'::varchar,
	ADD CONSTRAINT digest_email_key UNIQUE (email);
DELETE FROM mailing WHERE status = 'EveryMonth';
DROP TYPE subscription_type;
CREATE TYPE  subscription_type AS ENUM ('Never', 'EveryWeek', 'EveryDay');
ALTER TABLE mailing 
	ALTER COLUMN status SET DEFAULT 'EveryDay'::subscription_type;
ALTER TABLE mailing 
	ALTER COLUMN status TYPE subscription_type USING status::subscription_type;

ALTER TABLE mailing RENAME TO digest;
DELETE FROM tabs_type WHERE title = 'mailing';

DROP TRIGGER delete_rubrics_from_json_schemas_on_news_rubrics ON news_rubrics;
DROP FUNCTION delete_rubrics_from_json_schemas();

UPDATE json_schemas SET json_schema = '
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
ui_schema = '{}' WHERE id = 'facebookBotSettings';

DROP EXTENSION pgcrypto;