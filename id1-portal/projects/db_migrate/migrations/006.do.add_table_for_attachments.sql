CREATE TABLE attachments (
	id uuid NOT NULL,
	storage_key varchar(255) NOT NULL,
	owner_id int4 NOT NULL,
	mimetype varchar NOT NULL,
	source_url varchar NOT NULL,
	uploaded_at timestamp NOT NULL DEFAULT now(),
	CONSTRAINT attachments_pkey PRIMARY KEY (id),
	CONSTRAINT fk_attachment_owner_to_user FOREIGN KEY (owner_id) REFERENCES users(id) ON UPDATE CASCADE
);