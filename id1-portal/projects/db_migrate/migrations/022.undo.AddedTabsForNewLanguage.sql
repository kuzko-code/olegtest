CREATE OR REPLACE FUNCTION public.add_settings_site_main_page_rubric(
main_title varchar, rubric varchar, new_settings_object varchar, new_ui_schema varchar, lang varchar)
RETURNS void AS $$
declare
  new_settings_schema varchar;
begin	
	new_settings_schema = '{
"title": "' || main_title || '",
  "type": "array",
  "items": {
    "title": "' || rubric || '",
    "type": "integer"
  }
}';

PERFORM update_or_insert_site_settings('mainPageRubrics', new_settings_object, new_settings_schema, new_ui_schema, lang);

 end;
$$ language PLPGSQL;

DROP FUNCTION "update_or_insert_tabs";
DROP FUNCTION "add_tabs_main_page_sliders";
DROP FUNCTION "add_tabs_link_wrapper";
DROP FUNCTION "add_tabs_for_new_languages";
DROP FUNCTION "add_tab_main_page_rubric";
DROP FUNCTION public.add_tab_last_or_popular_news;
DROP FUNCTION public.add_tabs_slider_links;
