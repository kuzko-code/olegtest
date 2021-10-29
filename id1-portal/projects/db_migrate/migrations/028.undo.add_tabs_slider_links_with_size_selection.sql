DROP FUNCTION public.add_tabs_for_new_languages(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar);


CREATE OR REPLACE FUNCTION public.add_tabs_for_new_languages(lang varchar,
  TabsSlidersOnTheMainPage varchar,
  TabsNewsInTheSlider varchar,
  TabsNews varchar,

  RubricsTitle varchar,
  RubricTitle varchar,

  ImageUrl varchar,
  Title varchar,
  Link varchar,
  EnterName varchar,
  EnterLink varchar,

  Content varchar,  
  LinkEditor varchar,

  TypeOfView varchar, 
  TypeOfViewBlock varchar, 
  TypeOfViewList varchar, 
  ShowLinksToAllNews varchar, 
  NumberOfNews varchar
)
RETURNS void AS $$
declare
begin

PERFORM add_tabs_main_page_sliders('sliderNewsForTop', TabsSlidersOnTheMainPage, TabsNewsInTheSlider, TabsNews, '[]','{}', lang);
PERFORM add_tabs_main_page_sliders('sliderNewsForBottom', TabsSlidersOnTheMainPage, TabsNewsInTheSlider, TabsNews, '[]','{}', lang);

PERFORM add_tab_main_page_rubric('rubric', RubricsTitle, RubricTitle, ShowLinksToAllNews, '{"rubrics":[],"showLinksToAllNews":true}','{}', lang);
PERFORM add_tab_main_page_rubric('blockViewRubric', RubricsTitle, RubricTitle, ShowLinksToAllNews, '{"rubrics":[],"showLinksToAllNews":true}','{}', lang);
PERFORM add_tab_main_page_rubric('listViewRubric', RubricsTitle, RubricTitle, ShowLinksToAllNews, '{"rubrics":[],"showLinksToAllNews":true}','{}', lang);

PERFORM add_tabs_slider_links('blockLinks', ImageUrl, Title, Link, EnterName, EnterLink, '7', '[]', lang);

PERFORM add_tabs_slider_links('sliderLinksForTop', ImageUrl, Title, Link, EnterName, EnterLink, '1.333', '{}', lang);
PERFORM add_tabs_slider_links('sliderLinksForBottom', ImageUrl, Title, Link, EnterName, EnterLink, '1.333', '{}', lang);

PERFORM add_tabs_link_wrapper('linkWrapperTop', ImageUrl, Title, Link, EnterName, EnterLink,'{}', lang);
PERFORM add_tabs_link_wrapper('linkWrapperBottom', ImageUrl, Title, Link, EnterName, EnterLink,'{}', lang);

PERFORM add_tab_last_or_popular_news('popularNews', TypeOfView, TypeOfViewBlock, TypeOfViewList, ShowLinksToAllNews, NumberOfNews, '{
  "typeOfView": "block",
  "showLinksToAllNews": false,
  "numberOfNews": 1
}', lang);
PERFORM add_tab_last_or_popular_news('latestNews', TypeOfView, TypeOfViewBlock, TypeOfViewList, ShowLinksToAllNews, NumberOfNews, '{
  "typeOfView": "block",
  "showLinksToAllNews": false,
  "numberOfNews": 1
}', lang);

PERFORM update_or_insert_tabs(
    'GovSites',
    '[]',
    '{"type": "array","items": {"type": "object","required": ["title","url"],"properties": {"title": {"type": "string", "title": "' || Title || '", "maxLength":150},"url": {"type": "string","title": "' || Link || '", "pattern": "^\\https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)"}}}}',
    '{"items": {"title": {"ui:placeholder": "' || EnterName || '"},"url": {"ui:placeholder": "' || EnterLink || '"}}}',
    lang
    );

PERFORM update_or_insert_tabs(
    'linkEditor',
    '{}',
    '{"title": "'|| LinkEditor ||'","type": "object","required": ["title","content"],"properties": {"title": {"type": "string","title": "' || Title || '"},"content": {"type": "string","title": "' || Content || '"}}}',
    '{"title": {"ui:placeholder": "' || EnterName || '"}}',
    lang
    );

PERFORM update_or_insert_tabs(
    'usefulLinks',
    '[]',
    '{"type": "array", "maxItems": 10, "items": {"type": "object","required": ["title","url"],"properties": {"title": {"type": "string", "title": "' || Title || '", "maxLength":50},"url": {"type": "string","title": "' || Link || '", "pattern": "^\\https?:\/\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)"}}}}',
    '{"items": {"title": {"ui:placeholder": "' || EnterName || '"},"url": {"ui:placeholder": "' || EnterLink || '"}}}',
    lang
    );

 end;
$$ language PLPGSQL;

DROP FUNCTION add_tabs_slider_links_with_size_selection(varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar, varchar);
Select add_tabs_slider_links('sliderLinksForTop', 'Зображення', 'Назва', 'Посилання', 'Внесіть назву', 'Внесіть посилання', '1.333', '{}', 'ua');
Select add_tabs_slider_links('sliderLinksForTop', 'Image', 'Title', 'Link', 'Enter a name', 'Enter the link', '{}', '1.333', 'en');
Select add_tabs_slider_links('sliderLinksForBottom', 'Зображення', 'Назва', 'Посилання', 'Внесіть назву', 'Внесіть посилання', '1.333', '{}', 'ua');
Select add_tabs_slider_links('sliderLinksForBottom', 'Image', 'Title', 'Link', 'Enter a name', 'Enter the link', '{}', '1.333', 'en');