alter table tabs_type 
	add column picture varchar(100) not null default 'Default picture';

ALTER TABLE tabs_type DROP CONSTRAINT "tabs_type_json_schemas_fkey";