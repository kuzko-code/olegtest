DELETE FROM public.tabs
WHERE type_title='facebookSettings' OR type_title = 'facebookBotSettings' OR type_title = 'facebookPage';
DELETE FROM public.tabs_type 
WHERE title = 'facebookPage';
DELETE FROM public.site_settings
WHERE title='facebookSettings' OR title = 'facebookBotSettings' OR title = 'facebookPage';
DELETE FROM public.json_schemas
WHERE id='facebookSettings' OR id = 'facebookBotSettings' OR id = 'facebookPage';
ALTER TABLE news 
	DROP COLUMN facebook_enable;