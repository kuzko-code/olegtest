ALTER TABLE site_settings 
 ADD COLUMN is_public boolean NOT NULL DEFAULT TRUE;
 
UPDATE site_settings 
	SET is_public = false 
	WHERE title = 'smtp'
		OR title = 'facebookBotSettings'
		OR title = 'telegramNotification'
		OR title = 'adminNavigation' 
		OR title = 'serviceHost'
		OR title = 'languagesOnTheAdminSite' 
		OR title = 'facebookSettings';
