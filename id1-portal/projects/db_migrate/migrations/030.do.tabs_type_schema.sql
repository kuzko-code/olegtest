CREATE TYPE  tabs_position_type AS ENUM ('topBar', 'bottomBar', 'rightBar', 'leftBar');

CREATE TABLE json_schemas(
    id VARCHAR(50) NOT NULL PRIMARY KEY,
    json_schema JSON DEFAULT '{}',
    ui_schema JSON DEFAULT '{}'
);

CREATE TABLE tabs_type(
    title VARCHAR(50) NOT NULL PRIMARY KEY,
    tabs_schema_id VARCHAR(50),
    picture VARCHAR(100) NOT NULL DEFAULT 'Default picture',
    tab_position tabs_position_type ARRAY[4] ,
    FOREIGN KEY (tabs_schema_id) REFERENCES json_schemas(id)
);


INSERT INTO json_schemas (id, json_schema, ui_schema)
VALUES ('sliderNews','
{
  "title": "[slidersOnTheMainPage]",
  "type": "array",
  "maxItems": 3,
  "items": {
    "title": "[newsInTheSlider]",
    "type": "array",
    "items": {
      "title": "[news]",
      "type": "integer"
    }
  }
}',
'{}'),
('sliderLinks','
{
  "required": [
    "typeOfView",
    "elements"
  ],
  "properties": {
    "typeOfView": {
      "title": "[imageSize]",
      "type": "string",
      "default": 1,
      "oneOf": [
        {
         "title": "[large]",
          "const": "1.33"
        },
        {
         "title": "[medium]",
          "const": "2"
        },
        {
         "title": "[small]",
          "const": "3"
        }          
      ]
    },
    "elements": {
		"type":"array", 
		"maxItems": 20, 
		"required": ["file"], 
		"items":{
			"type":"object",
				"properties":{      
			    	"file": {
						"type": "string", 
						"title": "[image]"
					},
	      			"title":{
						"type": "string",
						"maxLength": 100,
						"title": "[title]"
					},
      				"url": {
						"type": "string",
						"title": "[link]", 
						"pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
					},
      				"originalFile": {
						"type": "string", 
						"title": "[image]"
					}
    			}
			}
		}
	}
}',
'{
	"elements": {
		"items": {
			"title": {
				"ui:placeholder": "[enterAName]"
			},
			"url": {
				"ui:placeholder": "[enterTheLink]"
			}
		}
	}
}'),
('rubric','
{
  "type": "object",
  "properties": {
    "rubrics": {
      "title": "[rubricsOnTheMainPage]",
      "type": "array",
        "items": {
          "title": "[rubrics]",
          "type": "integer"
       }
    },
    "showLinksToAllNews": {
      "type": "boolean",
      "title": "[showLinkToAllNews]",
      "default": false
    }
  }
}',
'{}'),
('news','
{
  "properties": {
    "typeOfView": {
      "title": "[typeOfView]",
      "type": "string",
      "default": "block",
      "oneOf": [
        {
         "title": "[block]",
          "const": "block"
        },
        {
         "title": "[list]",
          "const": "list"
        }        
      ]
    },
    "showLinksToAllNews": {
      "type": "boolean",
      "title": "[showLinkToAllNews]",
      "default": false
    },
    "numberOfNews": {
      "title": "[numberOfNews]",
      "type": "integer",
      "default": 5,
      "minimum": 1,
      "maximum": 20,
      "multipleOf": 1
    }
  }
}',
'{
  "typeOfView": {
    "ui:widget": "radio",
    "ui:options": {
      "inline": true
    }
  },
  "numberOfNews": {
    "ui:widget": "range"
  }
}'),
('linkWrapper','
{
	"type":"object",
	"aspectRatio":"8",
	"required": ["file"],
	"properties":{
    	"file": {
			"type": "string",
			"title": "[image]"
		},
      	"title":{
			"type":"string",
			"maxLength":100,
			"title":"[title]"
		},
      	"url":{
			"type":"string",
			"title":"[link]", 
			"pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
		}
    }
}',
'{
	"items": {
		"title": {
			"ui:placeholder": "[enterAName]"
		},
		"url": {
			"ui:placeholder": "[enterTheLink]"
		}
	}
}'),
('linkEditor','
{
	"title": "[linkEditor]",
	"type": "object",
	"required": [
		"title",
		"content"
	],
	"properties": {
		"title": {
			"type": "string",
			"title": "[title]"
		},
		"content": {
			"type": "string",
			"title": "[content]"
		}
	}
}',
'{
	"title": {
		"ui:placeholder": "[enterAName]"
	}
}'),
('blockLinks','
{
	"type":"array",
	"aspectRatio":"7",
	"required": ["file"],
	"items":{
		"type":"object",
		"properties":{
      		"file": {
				"type": "string", 
				"title": "[image]"
			},
      		"title":{
				"type":"string",
				"maxLength":100,
				"title":"[title]"
			},
      		"url":{
				"type":"string",
				"title":"[link]", 
				"pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
			}
    	}
	}
}',
'{
	"items": {
		"title": {
			"ui:placeholder": "[enterAName]"
		},
		"url": {
			"ui:placeholder": "[enterTheLink]"
		}
	}
}'),
('location','
{
	"type":"object",
	"properties": {
		"topBar": {
			"type":"array",
			"items": {
				"type":"object",
				"properties": {
					"tab_id": {
						"type":"integer",
						"title":"[title]"
					},
					"enabled":{
						"type":"boolean",
						"title":"[enable]"
					}
				}
			}
		},
		"rightBar": {
			"type":"array",
			"items": {
				"type":"object",
				"properties": {
					"tab_id": {
						"type":"integer",
						"title":"[title]"
					},
					"enabled": {
						"type":"boolean",
						"title":"[enable]"
					}
				}
			}
		},
		"leftBar": {
			"type":"array",
			"items": {
				"type":"object",
				"properties": {
					"tab_id": {
						"type":"integer",
						"title":"[title]"
					},
					"enabled": {
						"type":"boolean",
						"title":"[enable]"
					}
				}
			}
		},
		"bottomBar": {
			"type":"array",
			"items": {
				"type":"object",
				"properties": {
					"tab_id": {
						"type":"integer",
						"title":"[title]"
					},
					"enabled": {
						"type":"boolean",
						"title":"[enable]"
					}
				}
			}
		}
	}
}',
'{}'),
('metaGoogleSiteVerification','
{
	"type":"object",
	"required": ["metaGoogleSiteVerification"],
	"properties": {
		"metaGoogleSiteVerification": {
			"type":"string",
			"title":"metaGoogleSiteVerification"
		}
	}
}',
'{}'),
('GovSites','
{
	"type": "array",
	"items": {
		"type": "object",
		"required": [
			"title",
			"url"
		],
		"properties": {
			"title": { 
				"type": "string", 
				"title": "[title]", 
				"maxLength":150
			},
			"url": {
				"type": "string",
				"title": "[link]",
				"pattern": "^\\https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)"
			}
		}
	}
}',
'{
	"items": {
		"title": {
			"ui:placeholder": "[enterAName]"
		},
		"url": {
			"ui:placeholder": "[enterTheLink]"
		}
	}
}'),
('usefulLinks','
{
	"type": "array",
	"maxItems": 10,
	"items": {
		"type": "object",
		"required": [
			"title",
			"url"
		],
		"properties": {
			"title": { 
				"type": "string", 
				"title": "[title]", 
				"maxLength":150
			},
			"url": {
				"type": "string",
				"title": "[link]",
				"pattern": "^\\https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)"
			}
		}
	}
}',
'{
	"items": {
		"title": {
			"ui:placeholder": "[enterAName]"
		},
		"url": {
			"ui:placeholder": "[enterTheLink]"
		}
	}
}'),
('contacts','
{
  "title": "",
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "title": "[email]"
    },
    "phone": {
      "type": "string",
      "title": "[phone]"
    },
    "hotlineNumber": {
      "type": "string",
      "title": "[hotlineNumber]"
    },
    "address": {
      "type": "string",
      "title": "[address]"
    },
    
    "socialMedia": {
      "title": "[socialMedia]",
      "type": "object",
      "properties": {
        "facebookUrl": {
          "title": "[pageFacebook]",
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
        },
        "linkedinUrl": {
          "title": "[pageLinkedin]",
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
        },
        "twitterUrl": {
          "title": "[pageTwitter]",
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
        },
        "youtubeUrl": {
 		      "title": "[pageYoutube]",
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
        },
        "shopUrl": {
 		      "title": "[pageShop]",
          "type": "string",
          "pattern": "^https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)|^$"
       }
      }
    }
  }
}',
'{}'),
('adminNavigation','
{
	"title":"adminNavigation",
	"type":"array",
	"items": {
		"type":"object",
		"required": ["label"],
		"properties": {
			"content": {
				"type":"array",
				"items": {
					"type":"object",
					"required": ["label"],
					"properties": {
						"label": {
							"type":"string",
							"title":"label"
						},
						"to": {
							"type":"string",
							"title":"to"
						},
						"icon": {
							"type":"string",
							"title":"icon"
						},
						"permission": {
							"type":"string",
							"title":"permission"
						},
						"translateDescription": {
							"type":"string",
							"title":"translateDescription"
						}
					}
				}
			},
			"label": { 
				"type":"string",
				"title":"label"
			},
			"to": {
				"type":"string",
				"title":"to"
			},
			"icon": {
				"type":"string",
				"title":"icon"
			},
			"permission": {
				"type":"string",
				"title":"permission"
			},
			"translateDescription": {
				"type":"string",
				"title":"translateDescription"
			}
		}
	}
}',
'{}'),
('layout','
{
	"title":"",
	"type":"object",
	"properties": {
		"siteName": {
			"type":"string",
			"minLength": 3,
			"maxLength":100,
			"title":"[siteName]"
		},
		"descriptionForSite": {
			"type":"string",
			"maxLength": 150,
			"title": "[descriptionToTheTitleOfTheWebsite]"
		},
		"selectedColorTheme": {
			"title":"[colorScheme]",
			"type":"array",
			"items": {
				"type":"string"
			}
		},
		"header": {
			"type":"string",
			"maxLength": 256,
			"title":"[choosingASiteHeader]"
		},
		"siteOldVersion": {
			"title":"[urlOfTheOldVersionOfTheSite]",
			"type":"string",
			"maxLength":150
		}
	}
}',
'{}'),
('contactsOfPreview','
{
	"title":"",
	"type":"object",
	"properties": {
		"email": {
			"type":"string",
			"format":"email",
			"title":"[email]"
		},
		"phone": {
			"type":"string",
			"title":"[phone]"
		},
		"hotlineNumber": {
			"type":"string",
			"title":"[hotlineNumber]"
		},
		"address": {
			"type":"string",
			"title":"[address]"
		},
		"socialMedia": {
			"title":"[socialMedia]",
			"type":"object",
			"properties": {
				"facebookUrl": {
					"title":"[pageFacebook]",
					"type":"string"
				},
				"linkedinUrl": {
					"title":"[pageLinkedin]",
					"type":"string"
				},
				"twitterUrl": {
					"title":"[pageTwitter]",
					"type":"string"
				},
				"youtubeUrl": {
					"title":"[pageYoutube]",
					"type":"string"
				},
				"shopUrl": {
					"title":"[pageShop]",
					"type":"string"
				}
			}
		}
	}
}',
'{}'),
('languages','
{
	"title": "",  
	"type": "array",  
	"items": {    
		"title": "",    
		"type": "string"  
	}
}',
'{}'),
('telegramNotification','
{
	"properties": {
		"enabled": {
			"type":"boolean",
			"title":"enabled"
		},
		"telegram_token": {
			"type":"string",
			"title":"telegram_token"
		},
		"channel_id": {
			"type":"string",
			"title":"channel_id"
		},
		"channel_url": {
			"type":"string",
			"title":"channel_url"
		}
	}
}',
'{}'),
('siteLogos','
{
  "type": "object",
  "properties": {
	  "headerLogo": {
	  	"type":"string",
		  "title":"",
      "pattern": "^\/attachments\/"
	  },
	  "footerLogo": {
		  "type":"string",
		  "title":"",
      "pattern": "^\/attachments\/"
  	}
  }
}',
'{}'),
('updateSettings','
{
	"title": "update Settings",
    "type": "object",
    "required": [
    	"OGPServicesUrl",
        "message"
	],
    "properties": {
    	"OGPServicesUrl": {
        	"type": "string",
            "pattern": "",
            "title": "OGPServicesUrl"
		},
        "updateSchedule": {
        	"type": "string",
            "title": "updateSchedule"
		},
        "message": {
        	"type": "string",
            "title": "message"
		}
	}
}',
'{}'),
('mainNavigation','
{  
	"definitions": {
		"node": {
			"type": "object",
			"properties": {
				"label": {
					"type": "string"
				},
				"url": {
					"type": "string"
				},
				"key": {
					"type": "string"
				},
				"nodes": {
					"type": "array",
					"items": {
						"$ref": "#/definitions/node"
					}
				}
			},
			"required": [
				"label",
				"url",
				"key",
				"nodes"
			]
		}
	},
	"type": "array",
	"items": {
		"$ref": "#/definitions/node"
	}
}',
'{}');

INSERT INTO tabs_type (title, tabs_schema_id, tab_position)
VALUES ('sliderNews', 'sliderNews', '{topBar, bottomBar}'), 
('sliderLinks', 'sliderLinks', '{topBar, bottomBar}'), 
('rubric', 'rubric', '{leftBar}'), 
('popularNews', 'news', '{rightBar}'), 
('listViewRubric', 'rubric', '{leftBar}'), 
('linkWrapper', 'linkWrapper', '{topBar, bottomBar}'), 
('linkEditor', 'linkEditor', '{rightBar}'), 
('latestNews', 'news', '{rightBar}'), 
('blockViewRubric', 'rubric', '{leftBar}'), 
('popularTags', null, '{rightBar}'), 
('socialNetworks', null, '{rightBar}'),
('blockLinks', 'blockLinks', '{rightBar}');


INSERT INTO public.site_settings
(title, settings_object, "language", settings_schema, ui_schema)
SELECT title, form_data as settings_object, "language", json_schema as settings_schema , ui_schema
FROM tabs
WHERE tabs.title = 'GovSites' OR tabs.title = 'usefulLinks';

DELETE FROM tabs WHERE title = 'GovSites' OR title = 'usefulLinks';

ALTER TABLE site_settings 
	DROP COLUMN settings_schema,
	DROP COLUMN ui_schema,
    ADD json_schema_id VARCHAR(50),
    ADD FOREIGN KEY (json_schema_id) REFERENCES json_schemas(id);


UPDATE site_settings 
SET json_schema_id = 'metaGoogleSiteVerification'
WHERE title = 'metaGoogleSiteVerification';

UPDATE site_settings 
SET json_schema_id = 'location'
WHERE title = 'locationOfBanners' OR title = 'locationPreviewOfBanners';

UPDATE site_settings 
SET json_schema_id = 'GovSites'
WHERE title = 'GovSites';

UPDATE site_settings 
SET json_schema_id = 'usefulLinks'
WHERE title = 'usefulLinks';

UPDATE site_settings 
SET json_schema_id = 'contacts'
WHERE title = 'contacts';

UPDATE site_settings 
SET json_schema_id = 'adminNavigation'
WHERE title = 'adminNavigation';

UPDATE site_settings 
SET json_schema_id = 'layout'
WHERE title = 'layoutOfPreview' OR title = 'layout';

UPDATE site_settings 
SET json_schema_id = 'contactsOfPreview'
WHERE title = 'contactsOfPreview';

UPDATE site_settings 
SET json_schema_id = 'languages'
WHERE title = 'languagesOnThePublicSite' OR title = 'languagesOnTheAdminSite';

UPDATE site_settings 
SET json_schema_id = 'telegramNotification'
WHERE title = 'telegramNotification';

UPDATE site_settings 
SET json_schema_id = 'siteLogos'
WHERE title = 'siteLogosOfPreview' OR title = 'siteLogos';

UPDATE site_settings 
SET json_schema_id = 'updateSettings'
WHERE title = 'updateSettings';

UPDATE site_settings 
SET json_schema_id = 'mainNavigation'
WHERE title = 'mainNavigation';


ALTER TABLE tabs
	DROP COLUMN json_schema,
	ALTER COLUMN form_data DROP NOT NULL,
	DROP COLUMN ui_schema,
    ADD COLUMN position tabs_position_type,
    ADD COLUMN index integer default 0,
    ADD type_title VARCHAR(50),
    ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT false,
    ALTER COLUMN title DROP NOT NULL,
    ADD FOREIGN KEY (type_title) REFERENCES tabs_type(title);


UPDATE tabs 
SET position = 'topBar'
WHERE title = 'sliderNewsForTop' OR title = 'sliderLinksForTop'  OR title = 'linkWrapperTop';

UPDATE tabs 
SET position = 'bottomBar'
WHERE title = 'sliderNewsForBottom' OR title = 'sliderLinksForBottom'  OR title = 'linkWrapperBottom';

UPDATE tabs 
SET position = 'rightBar'
WHERE title = 'popularNews'  OR title = 'linkWrapper'
OR title = 'latestNews'  OR title = 'linkEditor';

UPDATE tabs 
SET position = 'leftBar'
WHERE title = 'rubric' OR title = 'blockViewRubric'  OR title = 'listViewRubric';

UPDATE tabs 
SET type_title = 'sliderNews'
WHERE title = 'sliderNewsForBottom' OR title = 'sliderNewsForTop' ;

UPDATE tabs 
SET type_title = 'sliderLinks'
WHERE title = 'sliderLinksForBottom' OR title = 'sliderLinksForTop' ;

UPDATE tabs 
SET type_title = 'linkWrapper'
WHERE title = 'linkWrapperBottom' OR title = 'linkWrapperTop' ;

UPDATE tabs 
SET type_title = 'popularNews'
WHERE title = 'popularNews';

UPDATE tabs 
SET type_title = 'rubric'
WHERE title = 'rubric';

UPDATE tabs 
SET type_title = 'listViewRubric'
WHERE title = 'listViewRubric';

UPDATE tabs 
SET type_title = 'linkWrapper'
WHERE title = 'linkWrapper';


UPDATE tabs 
SET type_title = 'blockLinks'
WHERE title = 'blockLinks';

UPDATE tabs 
SET type_title = 'latestNews'
WHERE title = 'latestNews';

UPDATE tabs 
SET type_title = 'linkEditor'
WHERE title = 'linkEditor';

UPDATE tabs 
SET type_title = 'blockViewRubric'
WHERE title = 'blockViewRubric';

DO
$BODY$
declare
	indexposition smallint;
	ss_id integer; 
	i json;
	j json;
	item record;
	baner record;
begin
	
	FOR ss_id IN select id from site_settings where title = 'locationOfBanners' 
	loop
	select id, settings_object, "language" into baner from site_settings where id=ss_id;
   
		FOR J IN SELECT value FROM json_each(baner.settings_object)
		loop
			indexposition= 0;
			FOR i IN SELECT * FROM json_array_elements(j)
			loop
				select * into item from json_to_record(i) as x(title text, enabled boolean );
			
				if item.title = 'popularTags' or item.title = 'socialNetworks' then
					INSERT INTO public.tabs (form_data,"language","position","index",type_title,enabled) VALUES 
					(NULL, baner."language",'rightBar', indexposition,item.title,item.enabled);
				else			
					update tabs set enabled=item.enabled, index=indexposition where title=item.title and "language" = baner."language";
				END if;
					indexposition = indexposition + 1;
			END LOOP;
		END LOOP;
	END LOOP;
END;
$BODY$ language plpgsql;


UPDATE tabs 
SET position = 'topBar'
WHERE title = 'sliderNewsForTop' OR title = 'sliderLinksForTop'  OR title = 'linkWrapperTop';

UPDATE tabs 
SET position = 'bottomBar'
WHERE title = 'sliderNewsForBottom' OR title = 'sliderLinksForBottom'  OR title = 'linkWrapperBottom';

UPDATE tabs 
SET position = 'rightBar'
WHERE title = 'popularNews'  OR title = 'linkWrapper'
OR title = 'latestNews'  OR title = 'linkEditor' OR title = 'blockLinks';

UPDATE tabs 
SET position = 'leftBar'
WHERE title = 'rubric' OR title = 'blockViewRubric'  OR title = 'listViewRubric';

DELETE FROM site_settings WHERE title = 'locationOfBanners';

ALTER TABLE tabs
DROP COLUMN title;

CREATE OR REPLACE FUNCTION public.update_tabs_position(form_data json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare    
	indexposition smallint;
	i json;
	j json;
	item record;
begin   
		FOR J IN SELECT value FROM json_each(form_data)
		loop
			indexposition= 0;
			FOR i IN SELECT * FROM json_array_elements(j)
			loop
				select * into item from json_to_record(i) as x(id integer, enabled boolean );
				update tabs set enabled=item.enabled, index=indexposition where id=item.id;
				indexposition = indexposition + 1;
			END LOOP;
		END LOOP;
END;
$function$
;

INSERT INTO site_settings
    (title,settings_object,"language",json_schema_id)
SELECT 'siteLogos','{"headerLogo":"","footerLogo":""}',NULL,'siteLogos'
WHERE
    NOT EXISTS (
        SELECT title FROM site_settings WHERE title = 'siteLogos' and "language" isnull 
    );

INSERT INTO site_settings
    (title,settings_object,"language",json_schema_id)
SELECT 'telegramNotification','{"telegram_token":"","channel_id":"","channel_url":"","enabled":false}',NULL,'telegramNotification'
WHERE
    NOT EXISTS (
        SELECT title FROM site_settings WHERE title = 'telegramNotification' and "language" isnull 
    );
   
   
   
INSERT INTO site_settings
    (title,settings_object,"language",json_schema_id)
SELECT 'metaGoogleSiteVerification','{"metaGoogleSiteVerification":""}',NULL,'metaGoogleSiteVerification'
WHERE
    NOT EXISTS (
        SELECT title FROM site_settings WHERE title = 'metaGoogleSiteVerification' and "language" isnull 
    );

INSERT INTO site_settings
    (title,settings_object,"language",json_schema_id)
SELECT 'mainNavigation','[]','en','mainNavigation'
WHERE
    NOT EXISTS (
        SELECT title FROM site_settings WHERE title = 'mainNavigation' and "language" = 'en' 
    );
   
   
   INSERT INTO site_settings
    (title,settings_object,"language",json_schema_id)
SELECT 'mainNavigation','[{"label":"Головна","url":"/","key":"52593131-93e8-4c4a-947f-a1919d1223d1","nodes":[]}]','ua','mainNavigation'
WHERE
    NOT EXISTS (
        SELECT title FROM site_settings WHERE title = 'mainNavigation' and "language" = 'ua' 
    );  