CREATE TABLE digest(
    uuid UUID NOT NULL PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    language VARCHAR NOT NULL REFERENCES languages(cutback) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    ip INET NOT NULL,
    subscription_date TIMESTAMPTZ NOT NULL DEFAULT now()
);