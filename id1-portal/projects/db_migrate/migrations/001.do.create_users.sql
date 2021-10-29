CREATE TYPE enum_user_roles AS ENUM ('admin');

create table users (
    id serial NOT NULL,
    "role" enum_user_roles not null,
    email varchar(256) not NULL,
    "password" varchar(1024) not null,
    is_active boolean default false,
    forgot_url varchar(256) null,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT U_Email UNIQUE (email)    
)