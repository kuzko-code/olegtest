const uuidv4 = require("uuid");

const layout = {
    "selectedColorTheme": ["#273043", "#304f80", "#104D82"],
    "siteOldVersion": "",
    "header": "MonochromeLimited",
    "siteName": "Назва організації чи установи",
    "descriptionForSite": "Сайт працює в тестовому режимі"
};

const mainNavigation = [
    {
        "label": "Про нас",
        "url": "",
        "key": uuidv4(),
        "nodes": [{
            "label": "Інформація про підприємство",
            "url": "",
            "key": uuidv4(),
            "nodes": []
        }]
    }, {
        "label": "Керівництво",
        "url": "",
        "key": uuidv4(),
        "nodes": []
    }, {
        "label": "Пресцентр",
        "url": "",
        "key": uuidv4(),
        "nodes": [{
            "label": "Новини",
            "url": "/ua/newslist",
            "key": uuidv4(),
            "nodes": []
        }, {
            "label": "Фотогалерея",
            "url": "",
            "key": uuidv4(),
            "nodes": []
        }, {
            "label": "Відеогалерея",
            "url": "",
            "key": uuidv4(),
            "nodes": []
        }]
    }, {
        "label": "Зв'язок з громадскістю",
        "url": "",
        "key": uuidv4(),
        "nodes": [{
            "label": "Зворотній звязок",
            "url": "",
            "key": uuidv4(),
            "nodes": []
        }, {
            "label": "Повідомлення про корупцію",
            "url": "",
            "key": uuidv4(),
            "nodes": []
        }]
    }, {
        "label": "Контакти",
        "url": "",
        "key": uuidv4(),
        "nodes": []
    }];

module.exports.generateSql = function () {
    return `
    INSERT INTO public.site_settings
    (title, settings_object, "language", json_schema_id)
    VALUES('serviceHost','{"serviceHost":""}',null, null);
   
    UPDATE tabs SET enabled = true WHERE (position = 'topBar' and type_title = 'sliderNews' OR 
    position = 'bottomBar' and type_title = 'sliderLinks' OR 
    position = 'leftBar' and type_title = 'blockViewRubric' OR 
    position = 'rightBar' and type_title IN ('latestNews', 'popularTags')) AND (SELECT ((CAST(settings_object->'siteName' as varchar) = '""') IS NOT FALSE) 
    FROM site_settings WHERE title = 'layout' AND "language" = 'ua');  
    UPDATE site_settings SET "settings_object" = '${JSON.stringify(mainNavigation).replace(/'/g, "''")}' 
    WHERE "title" = 'mainNavigation' AND "language" = 'ua' AND (SELECT ((CAST(settings_object->'siteName' as varchar) = '""') IS NOT FALSE) 
    FROM site_settings WHERE title = 'layout' AND language = 'ua');  
    UPDATE site_settings SET "settings_object" = '${JSON.stringify(layout)}'
    WHERE "title" = 'layout' AND "language" = 'ua' AND (SELECT ((CAST(settings_object->'siteName' as varchar) = '""') IS NOT FALSE) 
    FROM site_settings WHERE title = 'layout' AND language = 'ua');
    `
}
