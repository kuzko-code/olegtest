CREATE OR REPLACE FUNCTION public.add_tab(
    _title VARCHAR DEFAULT null,
    _json_schema JSON DEFAULT '{}',
    _form_data JSON DEFAULT '{}',
    _ui_schema JSON DEFAULT '{}',
    _language VARCHAR DEFAULT null
    )
RETURNS void AS $$
BEGIN

    IF NOT EXISTS(SELECT 1 FROM tabs WHERE title = _title AND language = _language) THEN
        INSERT INTO public.tabs
        (title, json_schema, form_data, ui_schema, language)
        VALUES(_title, _json_schema, _form_data, _ui_schema, _language);
    END IF;

END $$
LANGUAGE plpgsql;