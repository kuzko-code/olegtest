--> news images
DO
$BODY$
DECLARE _main_picture text;
		_images text[];
		_uuid uuid;
		_news news%rowtype;
BEGIN
	ALTER TABLE news
    	ALTER COLUMN main_picture TYPE varchar USING main_picture::varchar,
    	ALTER COLUMN images TYPE varchar[] USING images::varchar[],
    	ALTER COLUMN images SET DEFAULT ARRAY[]::varchar[];

	FOR _news IN
 		SELECT * FROM news
	LOOP
		_images := ARRAY[]::varchar[];
	
		SELECT attac.source_url into _main_picture
			FROM attachments attac 
			WHERE attac.id = _news.main_picture::uuid;
	
		IF (_news.images IS NOT NULL) THEN
			FOREACH _uuid IN ARRAY _news.images
				LOOP
					SELECT _images || attac.source_url::text into _images
						FROM attachments attac 
						WHERE attac.id = _uuid::uuid;
			END LOOP;
		END IF;

		UPDATE news 
			SET main_picture = _main_picture, images = _images 
			WHERE id = _news.id;
	END LOOP;
END;
$BODY$ language plpgsql;

--> documents attachments
INSERT INTO attachments(id, mimetype, owner_id, source_url, storage_key, uploaded_at) 
	SELECT docs.id, docs.mimetype, docs.owner_id, docs.source_url, docs.storage_key, docs.uploaded_at 
	FROM documents docs 
	INNER JOIN news_attachments na ON na.attachment_id = docs.id;

ALTER TABLE public.news_attachments DROP CONSTRAINT news_attachments_attachment_id_fkey;
ALTER TABLE public.news_attachments ADD CONSTRAINT news_attachments_attachment_id_fkey FOREIGN KEY (attachment_id) REFERENCES attachments(id) ON DELETE CASCADE;

DROP VIEW "documents.search";
DROP TABLE documents;
