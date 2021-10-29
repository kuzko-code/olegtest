ALTER TABLE tabs 
DROP CONSTRAINT "tabs_type_title_fkey";
ALTER TABLE tabs
ADD CONSTRAINT "tabs_type_title_fkey" FOREIGN KEY (type_title) REFERENCES tabs_type(title);