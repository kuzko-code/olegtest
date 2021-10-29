CREATE EXTENSION pgcrypto;

ALTER TABLE "digest"
RENAME TO "mailing";

ALTER TABLE mailing 
	ALTER COLUMN status TYPE varchar,
	ALTER COLUMN status SET DEFAULT 'EveryDay'::varchar;
DROP TYPE subscription_type;
CREATE TYPE  subscription_type AS ENUM ('Never', 'EveryWeek', 'EveryDay', 'EveryMonth');
ALTER TABLE mailing 
	ALTER COLUMN status SET DEFAULT 'EveryDay'::subscription_type;
ALTER TABLE mailing 
	ALTER COLUMN status TYPE subscription_type USING status::subscription_type;

insert into tabs_type (title, tabs_schema_id, tab_position)
	values ('mailing', null, '{rightBar}');

ALTER TABLE mailing DROP CONSTRAINT digest_email_key;

CREATE OR REPLACE FUNCTION add_news_subscription(user_email text, status subscription_type, user_language text) RETURNS mailing AS $$
DECLARE uuid uuid;
DECLARE prev_status subscription_type;
DECLARE res mailing%rowtype;
BEGIN
	uuid := gen_random_uuid();
	
	SELECT m.status INTO prev_status FROM mailing m WHERE m.email = $1 AND m."language" = $3;
	
	IF (prev_status IS NULL) 
		THEN 
    		INSERT INTO mailing(uuid, email, status, subscription_date, language)
	        VALUES (uuid, $1, $2, now(), $3);
	ELSEIF (prev_status = 'Never') 
    	THEN 
    		UPDATE mailing SET status = $2 WHERE email = $1 AND language = $3;
	END IF;
	
	SELECT m.* INTO res FROM mailing m WHERE m.email = $1 AND m."language" = $3;
	RETURN res;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION delete_news_from_json_schemas(news_id int)
RETURNS void AS $$
DECLARE 
	_tab tabs%rowtype;
	_rubrics_array jsonb[];
	_arr int[];
	_sub_rubrics_array jsonb;
	_form_data jsonb;
BEGIN
	FOR _tab IN
 		SELECT *
       		FROM "tabs" tb
    	   	WHERE tb.type_title = 'sliderNews'
    LOOP	
    	SELECT ARRAY(select json_array_elements(_tab.form_data::json)) INTO _rubrics_array;
			_form_data := '[]'::jsonb;
			FOREACH _sub_rubrics_array IN ARRAY _rubrics_array
			LOOP
			   	SELECT ARRAY(select json_array_elements(_sub_rubrics_array::json)) INTO _arr;
					_arr := array_remove(_arr, $1);
			   		IF (array_length(_arr, 1) != 0) 
			   		THEN
			   			_form_data := _form_data::jsonb || json_build_array(_arr)::jsonb;
					END IF;
			END LOOP;
		UPDATE tabs SET form_data = _form_data WHERE id = _tab.id;
    END LOOP;
END;
$$  LANGUAGE plpgsql;


ALTER TABLE public.user_groups drop CONSTRAINT user_groups_user_fk;

ALTER TABLE public.user_groups
ADD CONSTRAINT user_groups_user_fk FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE ON UPDATE NO ACTION;

UPDATE json_schemas SET json_schema = '
{
  "definitions": {
    "rubrics": {
      "type": "number",
      "anyOf": [],
      "default": 0
    }
  },
  "required": [],
  "type": "object",
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
    },
    "rubrics": {
      "type": "array",
      "title": "[facebook_rubricTitle]",
      "description": "[facebook_rubricDescription]",
      "items": {
        "$ref": "#/definitions/rubrics"
      }
    }
  }
}', ui_schema = '{
  "rubrics": {
    "ui:options": {
      "orderable": false
    }
  }
}' WHERE id = 'facebookBotSettings';

CREATE OR REPLACE FUNCTION delete_rubrics_from_json_schemas()
RETURNS TRIGGER AS $$
DECLARE rubric_array INT[];
DECLARE tab tabs%rowtype;
BEGIN
	SELECT ARRAY(select json_array_elements(ss.settings_object::json->'rubrics')) INTO rubric_array 
	FROM site_settings ss WHERE ss.title = 'facebookBotSettings';

	UPDATE site_settings
	SET settings_object = settings_object::jsonb || jsonb_build_object('rubrics', ARRAY_REMOVE(rubric_array, OLD.id))
	WHERE title = 'facebookBotSettings';

 	FOR tab IN
 		SELECT *
        	FROM "tabs" tb
        	WHERE 
        		(tb.type_title = 'rubric' OR tb.type_title = 'listViewRubric' OR tb.type_title = 'blockViewRubric') 
        		AND tb."language" = OLD."language"
    	LOOP
			SELECT ARRAY(select json_array_elements(tab.form_data::json->'rubrics')) INTO rubric_array;

			UPDATE "tabs"
        		SET form_data = tab.form_data::jsonb || jsonb_build_object('rubrics', ARRAY_REMOVE(rubric_array, OLD.id))
            	WHERE id = tab.id AND language = tab."language";
    	END LOOP;

	RETURN NULL;
END;
$$  LANGUAGE plpgsql;

CREATE TRIGGER delete_rubrics_from_json_schemas_on_news_rubrics
AFTER DELETE ON news_rubrics
    FOR EACH ROW EXECUTE PROCEDURE delete_rubrics_from_json_schemas();