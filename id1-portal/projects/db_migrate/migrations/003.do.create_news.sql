CREATE TABLE rubrics(
  id serial NOT NULL,
  title varchar,
  CONSTRAINT rubrics_pkey PRIMARY KEY (id)
);

CREATE TABLE tags(
  id serial NOT NULL,
  title varchar,
  CONSTRAINT tags_pkey PRIMARY KEY (id)
);

CREATE TABLE news(
  id serial NOT NULL,
  title varchar,
  description varchar,
  picture varchar,
  rubric_id integer NOT NULL,
  tag_titles varchar[],
  "date" timestamptz,
  CONSTRAINT news_pkey PRIMARY KEY (id),
  CONSTRAINT news_rubrics_fkey FOREIGN KEY (rubric_id) REFERENCES rubrics(id)
);