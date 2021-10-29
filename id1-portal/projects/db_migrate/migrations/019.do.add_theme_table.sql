CREATE TABLE color_schemes (
  id serial NOT NULL,
  color_scheme json NOT null,
  custom_color_scheme boolean NOT NULL DEFAULT true,
  CONSTRAINT site_themes_pkey PRIMARY KEY (id)
);

INSERT INTO public.color_schemes
(color_scheme, custom_color_scheme)
VALUES('["#273043","#304f80","#104D82"]', false);

INSERT INTO public.color_schemes
(color_scheme, custom_color_scheme)
VALUES('["#013414","#246d3f","#4CAF50"]', false);