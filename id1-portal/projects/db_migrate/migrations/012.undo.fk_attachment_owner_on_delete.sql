 ALTER TABLE attachments 
DROP CONSTRAINT fk_attachment_owner_to_user;

ALTER TABLE attachments
add CONSTRAINT fk_attachment_owner_to_user FOREIGN KEY (owner_id) REFERENCES users(id) ON UPDATE cascade;