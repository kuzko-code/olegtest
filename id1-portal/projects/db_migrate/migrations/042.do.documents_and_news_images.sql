CREATE TABLE documents (
	content varchar[],
	CONSTRAINT PK_documents_id PRIMARY KEY (id)
) INHERITS (attachments);
      
CREATE OR REPLACE VIEW "documents.search" as (
	SELECT docs.id as "id", docs.storage_key as "title", docs."content" as "content", docs.source_url as "urlparams" FROM documents docs
);

--> documents attachments
DO
$BODY$
DECLARE attac attachments%rowtype;
BEGIN
 	ALTER TABLE public.news_attachments DROP CONSTRAINT news_attachments_attachment_id_fkey;
 	
	FOR attac IN
 		SELECT attacs.* FROM attachments attacs INNER JOIN news_attachments na ON na.attachment_id = attacs.id 
    	LOOP
			DELETE FROM attachments WHERE attachments.id = attac.id;

			INSERT INTO documents SELECT attac.*;
    	END LOOP;      
    
    ALTER TABLE public.news_attachments ADD CONSTRAINT news_attachments_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES documents(id) ON DELETE CASCADE;
END;
$BODY$ language plpgsql;

--> news images
DO
$BODY$
DECLARE _main_picture uuid;
		_images uuid[];
		_url text;
		_arr text[];
		_news news%rowtype;
BEGIN
   ALTER TABLE news 
    	ALTER COLUMN images SET DEFAULT ARRAY[]::uuid[];

	FOR _news IN
 		SELECT * FROM news
    LOOP
		_arr := regexp_split_to_array(_news.main_picture, E'/');
		_main_picture := split_part(_arr[array_length(_arr,1)]::text, '_', 1)::uuid;
    	_images := ARRAY[]::uuid[];
 			IF (_news.images IS NOT NULL) THEN
 				FOREACH _url IN ARRAY _news.images
 				LOOP
					_arr := regexp_split_to_array(_url, E'/');
					_images := _images || split_part(_arr[array_length(_arr,1)]::text, '_', 1)::uuid;
 				END LOOP;
 			END IF;
    	UPDATE news 
    		SET main_picture = _main_picture, images = _images 
    		WHERE id = _news.id;
    END LOOP;

    ALTER TABLE news
    	ALTER COLUMN main_picture TYPE uuid USING main_picture::uuid,
    	ALTER COLUMN images TYPE uuid[] USING images::uuid[];
END;
$BODY$ language plpgsql;