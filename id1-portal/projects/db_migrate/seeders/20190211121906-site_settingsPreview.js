'use strict';

const initialCAllergyCategories = [ 
	{
		"title" :"contactsOfPreview",
		"settings_object": JSON.stringify(
      {"socialMedia":{"facebookUrl":"","twitterUrl":"","linkedinUrl":"","youtubeUrl":"", "shopUrl": ""},"email":"","phone":"","hotlineNumber":"","address":""}),
    "json_schema_id": "contacts",
		"language": null
  },
  

  {
		"title" :"layoutOfPreview",
		"settings_object": JSON.stringify({"selectedColorTheme": ["#273043","#304f80","#104D82"], "siteOldVersion": "", "header": "", "siteName": "","descriptionForSite": ""}),
    "json_schema_id": "layout",
		"language": null
	},
  

  {
		"title" :"siteLogosOfPreview",
		"settings_object": JSON.stringify({"footerLogo":"","headerLogo":""}),
    "json_schema_id": "siteLogos",
		"language": null
  },
  
  {
		"title" :"locationPreviewOfBanners",
    "settings_object":JSON.stringify({
      "topBar": [],
      "leftBar": [],
      "rightBar": [],
      "bottomBar": []
    }),    
    "json_schema_id": "location",
		"language": null
	}
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'site_settings',
      initialCAllergyCategories.map(r => ({ title: r.title,
        settings_object: r.settings_object, 
        json_schema_id: r.json_schema_id,
        language: r.language})),
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('site_settings', null, {});
  }
};
