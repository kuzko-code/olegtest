CREATE TABLE news_attachments (
  news_id int REFERENCES news (id) ON DELETE CASCADE,
  attachment_id uuid REFERENCES attachments (id) ON DELETE RESTRICT,
  CONSTRAINT news_attachments_pk PRIMARY KEY (news_id, attachment_id)
);

create function set_attacs_to_news(news integer, attac_ids uuid[])
returns void as $$
declare
  current_attacs uuid[];
  attacs_to_add uuid[];
  attacs_to_delete uuid[];
  attac_id uuid;
begin
  select array_agg(attachment_id) into current_attacs from news_attachments where news_id = news;
 
  attacs_to_add := (select array(select unnest(attac_ids) except select unnest(current_attacs)));
  attacs_to_delete := (select array(select unnest(current_attacs) except select unnest(attac_ids)));
 
  foreach attac_id in array attacs_to_add
  loop
    insert into news_attachments (news_id, attachment_id)
    values (news, attac_id);
  end loop;
 
  foreach attac_id in array attacs_to_delete
  loop
    delete from news_attachments
    where news_id = news and attachment_id = attac_id;
  end loop;
 
end;

$$ language PLPGSQL;