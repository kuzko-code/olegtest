ALTER TABLE users ALTER COLUMN "role" TYPE varchar;
DROP TYPE enum_user_roles;
CREATE TYPE enum_user_roles AS ENUM('root_admin', 'global_admin', 'content_admin', 'group_admin', 'visitor');
ALTER TABLE users ALTER COLUMN "role" TYPE enum_user_roles USING ("role"::enum_user_roles);

create table authorization_data (
    id serial NOT NULL,
    "role" enum_user_roles not null,
    email varchar(256) unique not NULL,
    "password" varchar(1024) not null,
    is_active boolean default true,
    CONSTRAINT authorization_data_users_pkey PRIMARY KEY (id),
    CONSTRAINT authorization_data_u_Email UNIQUE (email)   
);

create table temp_users (
    id int4 NOT NULL,
    "role" enum_user_roles not null,
    email varchar(256) not NULL,
    "password" varchar(1024) not null,
    is_active boolean default false,
    username varchar
);

INSERT INTO temp_users (id, "role", email, "password", is_active, username)
select id, "role", email, "password", is_active, username
FROM users;

ALTER TABLE users
drop CONSTRAINT users_pkey cascade;


drop table users;
create table users (
    username varchar NOT NULL DEFAULT 'username',
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT u_Email UNIQUE (email)  
) INHERITS (authorization_data);


ALTER TABLE authorization_data
ADD column forgot_url varchar(256) null;

INSERT INTO users (id, "role", email, "password", is_active, username)
select id, "role", email, "password", is_active, username
FROM temp_users;

SELECT setval('"authorization_data_id_seq"', 
       (select max(id) as c from users)+1
       );
select max(id)+1 as c from users;

drop table temp_users;

ALTER TABLE user_groups
ADD CONSTRAINT user_groups_user_fk FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE attachments
ADD CONSTRAINT attachments_user_fk FOREIGN KEY (owner_id) REFERENCES users(id);

create table visitors (
    first_name varchar(100) not NULL,
    last_name varchar(100) not NULL,
    patronymic varchar(100),
    phone varchar(15),
    birthday date,
    CONSTRAINT visitors_u_Email UNIQUE (email),
    CONSTRAINT subscriber_pkey PRIMARY KEY (id),
    CHECK (role = 'visitor')
)INHERITS (authorization_data);

ALTER TABLE public.authorization_data
ADD COLUMN confirmation_password varchar(6),
ADD COLUMN number_of_activation_requests int4 NULL DEFAULT 0,
ADD COLUMN code_updated timestamptz,
ADD COLUMN created_date timestamptz default now(),
DROP COLUMN forgot_url;


UPDATE site_settings 
      SET settings_object = '[{"content":[{"permission":"allNews","label":"allNews","to":"/news"},
      {"permission":"rubricsAndTags","label":"rubricsAndTags","to":"/rubrics"}],"permission":"news","label":"news","icon":"th-large","translateDescription":"translateDescriptionForNews"},
      {"permission":"mainNavigation","label":"navigation","to":"/menu_settings","icon":"sitemap","translateDescription":"translateDescriptionForMenuSettings"},
      {"content":[{"permission":"mainSettings","label":"main","to":"/main_settings"},
      {"permission":"users","label":"usersAndGroups","to":"/usersAndGroups_settings"},
      {"permission":"languageSettings","label":"languageSettings","to":"/language_settings"},{"permission":"socialNetworks","label":"socialNetworks","to":"/social_networks"},{"permission":"update","label":"update","to":"/update"}],"permission":"settings","icon":"cog","label":"settings","translateDescription":"translateDescriptionForSettings"},
      {"permission":"visitors","label":"personalCabinet","icon":"vcard","to":"/visitors","translateDescription":"translateDescriptionForLinksSettings"},      
      {"permission":"linksSettings","label":"linksSettings","icon":"external-link","to":"/links","translateDescription":"translateDescriptionForLinksSettings"},
      {"permission":"plugins","icon":"diamond","to":"/plugins","label":"plugins","translateDescription":"translateDescriptionForPlugins"}]'
      WHERE title='adminNavigation';