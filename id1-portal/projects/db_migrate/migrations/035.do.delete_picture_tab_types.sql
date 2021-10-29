alter table tabs_type 
	drop column picture;

ALTER TABLE tabs_type ADD CONSTRAINT "tabs_type_json_schemas_fkey" FOREIGN KEY (tabs_schema_id) REFERENCES json_schemas(id) ON DELETE cascade;