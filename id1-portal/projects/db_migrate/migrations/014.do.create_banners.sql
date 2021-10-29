CREATE TABLE tabs (
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR NOT NULL,
    json_schema JSON NOT NULL DEFAULT '{}',
    form_data JSON NOT NULL DEFAULT '{}',
    ui_schema JSON NOT NULL DEFAULT '{}',
    language VARCHAR NOT NULL REFERENCES languages(cutback) ON DELETE CASCADE
);