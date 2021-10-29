create table site_settings (
    id serial NOT NULL PRIMARY KEY,
    title varchar(256) NOT NULL,
    settings_object json NOT NULL,
    CONSTRAINT SS_TITLE UNIQUE (title)
)