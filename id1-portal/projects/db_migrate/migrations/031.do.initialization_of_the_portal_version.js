const date = new Date(Date.now());

module.exports.generateSql = function () {
    return (
      ` 
      create table portal_update_settings (
        id serial NOT NULL PRIMARY KEY,
        title varchar(256) NOT NULL,
        settings_object json NOT NULL,
        CONSTRAINT U_portal_update_settings_title UNIQUE (title)
      );
    
      create table messages (
        id serial NOT NULL PRIMARY KEY,
        title varchar(1000) NOT NULL,
        link varchar(1000) NOT NULL,
        is_read boolean default false
      );
    
      INSERT INTO public.portal_update_settings
      (title, settings_object)
      VALUES
          ('portalUpdateSchedule', '{"updatedFrequency": "never", "updatedTime": 23, "updatedDay": 6 }'::json),
          ('OGPMarketUrl', '{"url":"https://ogp-market.softlist.ua/api"}'::json),
          ('authenticationInOGPMarket', '{"email":"", "hash":""}'::json);
    
      UPDATE site_settings 
      SET settings_object = '[{"content":[{"permission":"allNews","label":"allNews","to":"/news"},
      {"permission":"rubricsAndTags","label":"rubricsAndTags","to":"/rubrics"}],"permission":"news","label":"news","icon":"th-large","translateDescription":"translateDescriptionForNews"},
      {"permission":"mainNavigation","label":"navigation","to":"/menu_settings","icon":"sitemap","translateDescription":"translateDescriptionForMenuSettings"},
      {"content":[{"permission":"mainSettings","label":"main","to":"/main_settings"},
      {"permission":"users","label":"usersAndGroups","to":"/usersAndGroups_settings"},
      {"permission":"languageSettings","label":"languageSettings","to":"/language_settings"},{"permission":"socialNetworks","label":"socialNetworks","to":"/social_networks"},{"permission":"update","label":"update","to":"/update"}],"permission":"settings","icon":"cog","label":"settings","translateDescription":"translateDescriptionForSettings"},
      {"permission":"linksSettings","label":"linksSettings","icon":"external-link","to":"/links","translateDescription":"translateDescriptionForLinksSettings"},
      {"permission":"plugins","icon":"diamond","to":"/plugins","label":"plugins","translateDescription":"translateDescriptionForPlugins"}]'
      WHERE title='adminNavigation';


      CREATE TYPE "status_portal_versions" AS ENUM
      ('updated', 'currentVersion', 'notInstalled');
      
      CREATE TABLE public.portal_versions (
        "version" varchar(256) NOT NULL,
        update_date timestamptz NULL,
        status "status_portal_versions",
        CONSTRAINT portal_version_pkey PRIMARY KEY ("version"),
        CONSTRAINT u_version UNIQUE ("version")
      );
      
      
      INSERT INTO public.portal_versions ("version",update_date,status) VALUES 
      ('1.0.0','${date.toISOString()}', 'updated')
      ,('2.0.0','${date.toISOString()}', 'currentVersion');

      CREATE OR REPLACE FUNCTION public.update_portal_version(ver varchar, updateDate timestamptz)
        RETURNS void AS $$
        begin	
	
        UPDATE public.portal_versions
        SET status='updated'
        WHERE status='currentVersion';
       
       INSERT INTO public.portal_versions
	     ("version", update_date, status)
       VALUES(ver, updateDate, 'currentVersion');

      end;
      $$ language PLPGSQL;
      `
    )
  }
