var crypto = require('crypto');
require('dotenv').config();

module.exports.generateSql = function () {
    return (`      
   CREATE OR REPLACE FUNCTION f_replace_everywhere(_pattern text, _new_string text, _tbl regclass, OUT updated_rows int) AS
   $func$
   DECLARE
      _typ CONSTANT regtype[] := '{_varchar, text, bpchar, varchar, json, jsonb}';
      _sql  text;
   begin
     BEGIN
      SELECT INTO _sql
             format('UPDATE %s SET %s'
                  , _tbl
                  , string_agg(format($$%1$s = regexp_replace(%1$s::TEXT, $1, $2, 'g')::%2$s $$, col, typname), ', '))
      FROM  (
         SELECT quote_ident(attname) AS col, pg_type.typname as typname
         FROM   pg_attribute JOIN pg_type ON pg_attribute.atttypid = pg_type.oid
         WHERE  attrelid = _tbl   
         AND    attnum >= 1
         AND    NOT attisdropped      
         AND    atttypid = ANY(_typ)
         ORDER  BY attnum
         ) sub;
   
      IF _sql IS NULL THEN
         updated_rows := 0;
      ELSE
         EXECUTE _sql
         USING _pattern, _new_string;
   
         GET DIAGNOSTICS updated_rows = ROW_COUNT;
      END IF;
       EXCEPTION WHEN OTHERS THEN
     
     end;
   END
   $func$  LANGUAGE plpgsql;
   
   select (SELECT f_replace_everywhere( '${process.env.PUBLIC_HOST}/attachments/'
                              , '/attachments/'
                              , format($$"%1$s" $$, table_name)))as ROW_COUNT
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;`
    )
  }