ALTER TABLE news_attachments
ADD COLUMN is_active boolean default true;


CREATE TYPE attachment AS (id uuid, is_active boolean);

DROP FUNCTION set_attacs_to_news;
CREATE OR REPLACE FUNCTION set_attacs_to_news(news integer, attachments attachment[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  current_attacs uuid[];
  obj_attachment attachment;
  id uuid;
begin
  select array_agg(attachment_id) into current_attacs from news_attachments where news_id = news;
 
 IF current_attacs IS NOT NULL THEN
 foreach id in array current_attacs
  loop
    delete from news_attachments
    where news_id = news and attachment_id = id;
  end loop;
 END IF;
 
  foreach obj_attachment in array attachments
  loop
    insert into news_attachments (news_id, attachment_id, is_active )
    values (news, obj_attachment.id, obj_attachment.is_active);
  end loop; 
 
end;

$function$